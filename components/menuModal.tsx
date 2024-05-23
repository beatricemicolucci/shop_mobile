import React , { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
}

interface SubCategoryAttributes {
  subcategory: string;
  locale: string;
  nome: string;
}

interface SubCategoryData {
  id: number;
  attributes: SubCategoryAttributes;
}

interface CategoriesAttributes {
  category: string;
  locale: string;
  sub_categories: {
    data: SubCategoryData[];
  };
}

interface CategoriesData {
  data: [{
    id: number;
    attributes: CategoriesAttributes
  }]
}

interface MenuData {
  data: {
    attributes: {
      title: string;
    }
  }
}

const MenuModal: React.FC<MenuModalProps> = ({ visible, onClose }) => {

  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;
  const categoriesApiUrl = `http://172.20.10.3:1337/api/categories?locale=${locale}&populate=*`;
  const { loading: loadingCategories, error: errorcategories, data: categoriesData } = useFetch<CategoriesData>(categoriesApiUrl);
  const menuApiUrl = `http://172.20.10.3:1337/api/categories-menu?locale=${locale}&populate=*`;
  const { loading: menuLoading, error: menuError, data: menuData } = useFetch<MenuData>(menuApiUrl);
  const navigation = useNavigation();

  const [expandedCategories, setExpandedCategories] = useState<{ [key: number]: boolean }>({});

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  const handleSubCategoryPress = (subCategoryId) => {
    onClose();
    navigation.navigate('itemList', { subCategoryId });
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-circle-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{menuData?.data?.attributes?.title}</Text>
        <ScrollView style={styles.scrollView}>
          {categoriesData?.data.map(category => (
            <View key={category.id}>
              <TouchableOpacity onPress={() => toggleCategory(category.id)} style={styles.categoryHeader}>
                <Text style={styles.categoryText}>
                  {category.attributes.category}
                </Text>
                {expandedCategories[category.id] ? <MaterialIcons name="expand-less" size={24} color="black" /> : <MaterialIcons name="expand-more" size={24} color="black" />}
              </TouchableOpacity>
              {expandedCategories[category.id] && (
                <View style={styles.subCategories}>
                  {category.attributes.sub_categories.data.map(subCategory => (
                    <TouchableOpacity key={subCategory.id} onPress={onClose} style={styles.subCategory}>
                      <Text style={styles.subCategoryText}>{subCategory.attributes.nome}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  scrollView: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryText: {
    fontSize: 18,
  },
  subCategories: {
    paddingLeft: 20,
  },
  subCategory: {
    paddingVertical: 5,
  },
  subCategoryText: {
    fontSize: 16,
  },
});

export default MenuModal;
