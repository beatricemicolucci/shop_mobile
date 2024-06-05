import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import { FontAwesome } from '@expo/vector-icons';
import { router } from "expo-router";

interface ProductsApiResponse {
  data: ProductsData[];
}

interface ProductsData {
  id: number;
  attributes: {
    name: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    size: { name: string }[];
    image?: {
      data: {
        attributes: {
          url: string;
        };
      }[];
    };
  };
}

interface ProductSize {
  name: string;
}

interface ProductAttributes {
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  size: ProductSize[];
}

interface ProductData {
  id: number;
  attributes: ProductAttributes;
}

interface CategoryAttributes {
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
}

interface CategoryData {
  id: number;
  attributes: CategoryAttributes;
}

interface SubCategoryAttributes {
  subcategory: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  nome: string;
  category: {
    data: CategoryData;
  };
  products: {
    data: ProductData[];
  };
  localizations: {
    data: SubCategoryLocalization[];
  };
}

interface SubCategoryData {
  id: number;
  attributes: SubCategoryAttributes;
}

interface SubCategoryLocalization {
  id: number;
  attributes: {
    subcategory: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    nome: string;
  };
}

interface SubCategoriesResult {
  data: SubCategoryData[];
}

interface GridItemProps {
  item: ProductData;
}

const ItemsList = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;

  const subcategoriesApiUrl = `http://172.16.11.121:1337/api/sub-categories?locale=all&populate=*&pagination[pageSize]=100`;
  const { loading: subcategoriesLoading, error: subcategoriesError, data: subcategoriesResult } = useFetch<SubCategoriesResult>(subcategoriesApiUrl);
  const productsApiUrl = `http://172.16.11.121:1337/api/products?locale=all&populate=*&pagination[pageSize]=100`;
  const { loading: productsLoading, error: productsError, data: productsData } = useFetch<ProductsApiResponse>(productsApiUrl);

  if (subcategoriesLoading || productsLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (subcategoriesError || productsError) {
    return <Text>Error: {subcategoriesError?.message || productsError?.message}</Text>;
  }

  if (!id) {
    return <Text>Error: No subcategory ID provided</Text>;
  }

  const targetSubcategory = subcategoriesResult?.data.find((subcategory: SubCategoryData) => subcategory.id === parseInt(id));
  if (!targetSubcategory) {
    return <Text>Error: Subcategory not found</Text>;
  }

  let it_subcategory: SubCategoryData | undefined;
  let en_subcategory: SubCategoryData | undefined;


  if (targetSubcategory.attributes.locale === "it-IT") {
    it_subcategory = targetSubcategory;
    const en_subcategoryId = targetSubcategory.attributes.localizations.data[0]?.id;
    if (en_subcategoryId !== undefined) {
      en_subcategory = subcategoriesResult?.data.find((subcategory: SubCategoryData) => subcategory.id === en_subcategoryId);
    }
  } else {
    en_subcategory = targetSubcategory;
    const it_subcategoryId = targetSubcategory.attributes.localizations.data[0]?.id;
    if (it_subcategoryId !== undefined) {
      it_subcategory = subcategoriesResult?.data.find((subcategory: SubCategoryData) => subcategory.id === it_subcategoryId);
    }
  }

  const subCategory = locale === "it-IT" ? it_subcategory : en_subcategory;

  const getImage = (productId: number): string | null => {
    const product = productsData?.data.find((product: ProductData) => product.id === productId);
    if (product && product.attributes.image && product.attributes.image.data.length > 0) {
      return `http://172.16.11.121:1337${product.attributes.image.data[0].attributes.url}`
    }
    return null;
  };

  const Breadcrumb = ({ text }: { text?: string }) => (
    <TouchableOpacity style={styles.breadcrumb} onPress={() => router.back()}>
      <Text style={styles.breadcrumbText}>{text || ''}</Text>
    </TouchableOpacity>
  );

  const GridItem: React.FC<GridItemProps> = ({ item }) => (
      <TouchableOpacity style={[styles.itemContainer, { width: itemWidth }]} key={item.id} onPress={ () => router.push({
          pathname: ".././itemDetails/[id]",
          params: { id: item.id },
        })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: getImage(item.id) || 'placeholder_image_url' }} style={styles.itemImage} />
        </View>
        <Text style={styles.productName}>{item.attributes.name}</Text>
        <Text style={styles.productPrice}>Price: {item.attributes.price}$</Text>
    </TouchableOpacity>
  );

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 2;
  const itemWidth = (screenWidth - 2 * 16 - (numColumns - 1) * 10) / numColumns;

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbContainer}>
        <Breadcrumb text={subCategory?.attributes?.category?.data?.attributes?.category} />
        <FontAwesome name="angle-right" size={20} color="black" />
        <Breadcrumb text={subCategory?.attributes?.nome}/>
      </View>
      <FlatList
        data={subCategory?.attributes?.products?.data || []}
        renderItem={({ item }) => <GridItem item={item} />}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
      />
      {/*<FlatList
        style={styles.flatList}
        numColumns={1}
        data={subCategory?.attributes?.products?.data || []}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} onPress={ () => router.push({
              pathname: ".././itemDetails/[id]",
              params: { id: item.id },
            })}
          >
            <View style={styles.productCard} >
              <View style={styles.imageContainer}>
                <Image source={{ uri: getImage(item.id) || 'placeholder_image_url' }} style={styles.image} />
              </View>
              <Text style={styles.productName}>{item.attributes.name}</Text>
              <Text style={styles.productPrice}>Price: {item.attributes.price}$</Text>
            </View>
          </TouchableOpacity>
        )}
      contentContainerStyle={styles.flatListContent}/>*/}
    </View>
  );
};

export default ItemsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignContent: 'center'
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  breadcrumb: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    marginRight: 8,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins_400Regular',
    marginTop: 7
  },
  breadcrumbArrow: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    flex: 1,
    margin:1,
    width: '70%',
    alignSelf: 'center'
   
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1 / 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    marginHorizontal: 15,
    marginVertical: 10
  },
  productPrice: {
    fontSize: 12,
    color: '#666',
    marginHorizontal: 15,
    marginBottom: 10,
    fontFamily: 'Poppins_400Regular'
  },
  flatListContent: {
    marginHorizontal: 0,
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center'

  },
  flatList: {
    width: '100%',
    alignContent: 'center',
    paddingBottom: 50,
  },
  itemContainer: {
    flex: 0.5,
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, 
  },
  grid: {
    justifyContent: 'center',
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1/1,
    resizeMode: 'cover',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
});