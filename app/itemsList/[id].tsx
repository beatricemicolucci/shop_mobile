import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
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

const ItemsList = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;

  const subcategoriesApiUrl = `http://192.168.1.101:1337/api/sub-categories?locale=all&populate=*&pagination[pageSize]=100`;
  const { loading: subcategoriesLoading, error: subcategoriesError, data: subcategoriesResult } = useFetch<SubCategoriesResult>(subcategoriesApiUrl);
  const productsApiUrl = `http://192.168.1.101:1337/api/products?locale=all&populate=*&pagination[pageSize]=100`;
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
      return `http://192.168.1.101:1337${product.attributes.image.data[0].attributes.url}`
    }
    return null;
  };

  const Breadcrumb = ({ text }: { text?: string }) => (
    <TouchableOpacity style={styles.breadcrumb}>
      <Text style={styles.breadcrumbText}>{text || ''}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumbContainer}>
        <Breadcrumb text={subCategory?.attributes?.category?.data?.attributes?.category} />
        <FontAwesome name="angle-right" size={24} color="black" />
        <Breadcrumb text={subCategory?.attributes?.nome}/>
      </View>
      <FlatList
        style={{alignSelf:'center'}}
        data={subCategory?.attributes?.products?.data || []}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={ () => router.push({
              pathname: ".././itemDetails/[id]",
              params: { id: item.id },
            })}
          >
            <View style={styles.productCard}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: getImage(item.id) || 'placeholder_image_url' }} style={styles.image} />
              </View>
              <Text style={styles.productName}>{item.attributes.name}</Text>
              <Text style={styles.productPrice}>Price: {item.attributes.price}$</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ItemsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingHorizontal: 25,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  },
  breadcrumbArrow: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 8,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
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
    fontSize: 16,
    fontWeight: 'bold',
    padding: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  flatListContent: {
    alignItems: 'center',
  },
});