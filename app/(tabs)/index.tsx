import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
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
        id: number;
        attributes: {
          url: string;
        }
      }
    ];
  };
  sub_categories: {
    data: SubCategoryData[];
  };
}

interface CategoriesData {
  data: [{
    id: number;
    attributes: CategoriesAttributes;
  }];
}

interface MenuData {
  data: {
    attributes: {
      title: string;
    }
  };
}

interface GridItemProps {
  item: SubCategoryData;
}

const Page = () => {
  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;

  const categoriesApiUrl = `http://172.16.11.121:1337/api/categories?locale=${locale}&populate=*`;
  const { loading: loadingCategories, error: errorcategories, data: categoriesData } = useFetch<CategoriesData>(categoriesApiUrl);
  const menuApiUrl = `http://172.16.11.121:1337/api/categories-menu?locale=${locale}&populate=*`;
  const { loading: menuLoading, error: menuError, data: menuData } = useFetch<MenuData>(menuApiUrl);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(locale && locale === 'it-IT' ? 3 : 4);

  useEffect(() => {
    setSelectedCategoryId(locale && locale === 'it-IT' ? 3 : 4);
  }, [locale]);

  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSubCategoryPress = (subCategoryId: number) => {
    router.push({
      pathname: ".././itemsList/[id]",
      params: { id: subCategoryId },
    });
  };

  if (loadingCategories || menuLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const GridItem: React.FC<GridItemProps> = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity key={item.id} onPress={() => handleSubCategoryPress(item.id)}>
        <Text style={styles.itemText}>{`${item.attributes.nome}`.toUpperCase()}</Text>
      </TouchableOpacity>
    </View>
  );

  const numColumns = 2;

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        {categoriesData?.data.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategoryId === category.id && styles.selectedCategoryButtonText,
            ]}>{`${category.attributes.category}`.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentContainer}>
        {categoriesData?.data.map((category) => {
          if (selectedCategoryId === category.id) {
            return (
              <View key={category.id} style={styles.categoryContent}>
                <Image
                  source={{ uri: `http://172.16.11.121:1337${category.attributes.cover.data[0].attributes.url}` }}
                  style={styles.cover}
                />
                <FlatList
                  data={category.attributes.sub_categories.data}
                  renderItem={({ item }) => <GridItem item={item} />}
                  numColumns={numColumns}
                  contentContainerStyle={styles.grid}
                />
              </View>
            );
          }
          return null;
        })}
      </View>
    </View>
  );
};

export default Page;

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
    aspectRatio: 1 / 1,
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
    letterSpacing: 1.2,
  },
  subCategoriesContainer: {
    paddingVertical: 15,
    paddingTop: 10,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  categoryButton: {
    padding: 15,
  },
  selectedCategoryButtonText: {
    fontSize: 16,
    color: 'rgba(0,0,0,1)',
    fontFamily: 'LeagueSpartan_500Medium',
    letterSpacing: 1.2,
  },
  categoryButtonText: {
    fontSize: 16,
    color: 'rgba(0,0,0,0.7)',
    fontFamily: 'LeagueSpartan_500Medium',
    letterSpacing: 1.2,
  },
  contentContainer: {
    flex: 1,
    padding: 0,
  },
  categoryContent: {
    marginBottom: 20,
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f3f1',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 3,
    padding: 5,
    borderColor: '#EAE3DF',
    borderWidth: 1,
  },
  itemText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.8)',
    fontFamily: 'LeagueSpartan_400Regular',
    letterSpacing: 1.2,
  },
  grid: {
    justifyContent: 'center',
    padding: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
