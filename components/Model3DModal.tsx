import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber/native';
import Loader from './model/Loader';
import Trigger from './model/Trigger';
import Model from './model/Model';
import useFetch from '@/hooks/useFetch';
import useControls from 'r3f-native-orbitcontrols'

interface ModelModalProps {
    visible: boolean;
    onClose: () => void;
    productId: number;
}

interface ProductData {
    data: {
        id: number;
        attributes: {
            object: {
                data: {
                    id: number;
                    attributes: {
                        url: string;
                    }
                }
            }
        }
    }
}

const Model3DModal: React.FC<ModelModalProps> = ({ visible, onClose, productId }) => {

    const contactsDataApiUrl = `http://192.168.1.102:1337/api/product-colors?${productId}&populate=*`;
    const { loading: loadingData, error: errorData, data: productData } = useFetch<ProductData>(contactsDataApiUrl);
    const [OrbitControls, events] = useControls();
    const [loading, setLoading] = useState<boolean>(false);

    const objUrl = `http://192.168.1.102:1337${productData?.data?.attributes?.object?.data?.attributes?.url}`;
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modelContainer} {...events}>
        {loading && <Loader />}
            <Canvas>
            <OrbitControls enablePan={false} />
                <directionalLight position={[1, 0, 0]} args={['white', 5]} />
                <directionalLight position={[-1, 0, 0]} args={['white', 5]} />
                <directionalLight position={[0, 0, 1]} args={['white', 5]} />
                <directionalLight position={[0, 0, -1]} args={['white', 5]} />
                <directionalLight position={[0, 1, 0]} args={['white', 5]} />
                <directionalLight position={[0, -1, 0]} args={['white', 5]} />
                <Suspense fallback={<Trigger setLoading={setLoading} />}>
                    <Model url={objUrl} setLoading={setLoading} />
                </Suspense>
            </Canvas>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
        </View>
      </Modal>
    );

};

const styles = StyleSheet.create({
    modelContainer: {
        flex: 2,
    },
    closeButton: {
        marginTop: 20,
        padding: 7,
        backgroundColor: '#49516c',
        borderRadius: 30,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 5,
        fontFamily: 'Poppins_400Regular'
    },
  });

  export default Model3DModal;