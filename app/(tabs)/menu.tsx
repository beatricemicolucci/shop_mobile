import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';

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
  cover: {
    data: [
      {
        id: number,
        attributes: {
          url: string
        }
      }
    ]
  }
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

const Page = () => {

  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;
  
  const categoriesApiUrl = `http://172.16.11.121:1337/api/categories?locale=${locale}&populate=*`;
  const { loading: loadingCategories, error: errorcategories, data: categoriesData } = useFetch<CategoriesData>(categoriesApiUrl);
  const menuApiUrl = `http://172.16.11.121:1337/api/categories-menu?locale=${locale}&populate=*`;
  const { loading: menuLoading, error: menuError, data: menuData } = useFetch<MenuData>(menuApiUrl);

  const handleSubCategoryPress = (subCategoryId: number) => {
    router.push({
      pathname: ".././itemsList/[id]",
      params: { id: subCategoryId },
    })
  };

    return (
        <View style={styles.container}>
          {categoriesData?.data.map((category) => {
            return (
              <View key={category.id} style={styles.categoryContainer}>
                <Image source={{ uri: `http://172.16.11.121:1337${category.attributes.cover.data[0].attributes.url}`}} style={styles.cover}/>
                <ScrollView horizontal={true} style={styles.subCategoriesContainer}>
                    {category.attributes.sub_categories.data.map(subCategory => (
                      <TouchableOpacity key={subCategory.id} onPress={() => handleSubCategoryPress(subCategory.id)} style={styles.subCategory}>
                        <Text style={styles.subCategoryText}>{`${subCategory.attributes.nome}`.toUpperCase()}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )
          })}
        </View>
      )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  categoryContainer: {
    width: '100%',
  },
  cover: {
    width: '100%',
    aspectRatio: 3/2,
    resizeMode: 'cover',
  },
  subCategory: {
    marginRight: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  },
  subCategoryText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.8)',
    fontFamily: 'LeagueSpartan_400Regular',
    letterSpacing: 1.2
  },
  subCategoriesContainer: {
    paddingVertical: 15,
    paddingTop: 10,
    marginBottom: 10
  }
})