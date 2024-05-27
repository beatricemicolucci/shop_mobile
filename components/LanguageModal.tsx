import useFetch from '@/hooks/useFetch';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectLanguage: (language: string) => void;
}

interface HeaderData {
  data: {
    id: number,
    attributes: {
      languages: [
        {
          language: string,
          denUrl: string,
          flag: {
            data: {
              attributes: {
                url: string
              }
            }
          }
        }
      ]
    }
  }
}

const LanguageModal: React.FC<LanguageModalProps> = ({ visible, onClose, onSelectLanguage }) => {

  const contactsDataApiUrl = `http://172.20.10.3:1337/api/header?populate[0]=languages&populate[1]=languages.flag`;
  const { loading: loadingData, error: errorData, data: headerData } = useFetch<HeaderData>(contactsDataApiUrl);


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Language</Text>
          <TouchableOpacity onPress={() => { onSelectLanguage('it-IT'); onClose(); }} style={styles.languageOption}>
            <Text style={styles.languageText}>Italian</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onSelectLanguage('en'); onClose(); }} style={styles.languageOption}>
            <Text style={styles.languageText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  languageOption: {
    padding: 10,
    marginVertical: 5,
  },
  languageText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LanguageModal;
