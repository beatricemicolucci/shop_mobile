import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import { useSharedValue, useAnimatedStyle} from 'react-native-reanimated';


interface LocalizationAttributes {
  name: string;
  description: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  size: { name: string }[];
}

interface LocalizationData {
  id: number;
  attributes: LocalizationAttributes;
}

interface Localizations {
  data: LocalizationData[];
}

interface ProductAttributes {
  name: string,
  description: string,
  price: number,
  locale: string,
  size: { name: string }[];
  image?: {
    data: {
      attributes: {
        url: string;
      };
    }[];
  };
  product_colors: {
    data: [
      {
        id: number,
      }
    ]
  };
  sub_category: {
    data: {
      id: number,
      attributes: {
        sub_category: string, 
        nome: string
      }
    };
  };
  localizations: Localizations;
}

interface ProductData {
  id: number;
  attributes: ProductAttributes;
}

interface ProductsResult {
  data: ProductData[];
}

interface ProductsColorData {
  id: number,
  attributes: {
    locale: string,
    image?: {
      data: {
        attributes: {
          url: string;
        };
      }[];
    };
    product: {
      data: {
        id: number,
        attributes: {
          name: string,
          description: string,
          price: number,
          locale: string,
          size: { name: string }[];
        }
      }
    },
    color: {
      data: {
        id: number,
        attributes: {
          Color: string,
          locale: string,
          codiceEsadecimale: string
        }
      }
    },
    object: {
      data: {
        id: number,
        attributes: {
          name: string
        }
      }
    },
    mtlFile: {
      daat: {
        id: number,
        attributes: {
          name: string
        }
      }
    },
    localizations: {
      data: [
        {
          id: number
        }
      ]
    }
  }
}

interface ProductsColorsResult {
  data: ProductsColorData[];
}

interface ColorsResult {
  data: [
    {
      id: number,
      attributes: {
        Color: string,
        locale: string,
        codiceEsadecimale: string,
        product_colors: [
          {
            data: [
              {
                id: number
              }
            ]
          }
        ],
        localizations: {
          data: [
            {
              id: number,
              attributes: {
                Color: string, 
                codiceEsadecimale: string
              }
            }
          ]
        }
      }
    }
  ]
}

interface PageResult {
  data: {
    id: number,
    attributes: {
      locale: string, 
      descriptionTitle: string,
      colorsTitle: string,
      sizesTitle: string,
      buttonText: string
    }
  }
}

interface CategoriesData {
  data: {
    id: number,
    attributes: {
      category: string,
      locale: string
    }
  }
}

interface SubCategoriesData {
  id: number,
  attributes: {
    subcategory: string,
    locale: string,
    nome: string,
    category: CategoriesData,
    products: {
      data: [
        {
          id: number
        }
      ]
    },
    localizations: {
      data: [
        {
          id: number
        }
      ]
    }
  }
}

interface SubCategoriesResult {
  data: SubCategoriesData[]
}

interface ImagesByColor {
  [key: string]: string,
  val: string
}

const Page = () => {

  // id del prodotto
  const { id } = useLocalSearchParams<{ id: string }>();

  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;

  const productsApiUrl = `http://172.20.10.3:1337/api/products?locale=all&populate=*&pagination[pageSize]=100`;
  const { loading: productsLoading, error: productsError, data: productsResult } = useFetch<ProductsResult>(productsApiUrl);
  const productsColorsApiUrl = `http://172.20.10.3:1337/api/product-colors?locale=all&populate=*&pagination[pageSize]=100`;
  const { loading: productsColorsLoading, error: productsColorsError, data: productsColorsResult } = useFetch<ProductsColorsResult>(productsColorsApiUrl);
  const colorsApiUrl = `http://172.20.10.3:1337/api/colors?locale=all&populate=*&pagination[pageSize]=100`;
  const { loading: colorsLoading , error: colorsError , data: colorsResult } = useFetch<ColorsResult>(colorsApiUrl);
  const itemDetailsPageApiUrl = `http://172.20.10.3:1337/api/item-details-page?locale=${locale}`;
  const { loading: pageLoading , error: pageError , data: pageResult } = useFetch<PageResult>(itemDetailsPageApiUrl);
  const subcategoriesApiUrl = `http://172.20.10.3:1337/api/sub-categories?locale=all&populate=*&pagination[pageSize]=100`;
  const { loading: subcategoriesLoading , error: subcategoriesError , data: subcategoriesResult } = useFetch<SubCategoriesResult>(subcategoriesApiUrl);

  if (!id) {
    return <Text>Error: No product ID provided</Text>;
  }

  const targetProduct = productsResult?.data.find((product: ProductData) => product.id === parseInt(id));
  
  const defaultProductColor = targetProduct ? getProductColor(targetProduct?.attributes?.product_colors?.data[0].id) : null;
  const defaultColor = defaultProductColor?.attributes.color;

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);  
  useEffect(() => {
    if (defaultColor?.data?.attributes?.codiceEsadecimale) {
      setSelectedColor(defaultColor.data.attributes.codiceEsadecimale);
    }
  }, [defaultColor]);
  const animatedColor = useSharedValue(selectedColor)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedColor.value,
    };
  });

 /*const colors = useMemo(() => {
    if (targetProduct) {
      return (targetProduct.attributes?.product_colors?.data.map((pc) => {
        const colorData = getProductColor(pc.id)?.attributes?.color?.data?.attributes;
        const colorId = getProductColor(pc.id)?.attributes?.color?.data?.id;
        const hexColor = colorData?.codiceEsadecimale;
        if (colorId && hexColor) { // Rimosso check di selectedColor
          return {
            id: colorId.toString(),
            label: '',
            value: hexColor,
            color: hexColor,
            selected: selectedColor === hexColor,
            containerStyle: { backgroundColor: hexColor } // Aggiunto lo stile per il background color
          };
        }
        return null;
      }).filter((color): color is RadioButtonProps => color !== null)) || [];
    } else {
      return [];
    }
  }, [targetProduct, selectedColor]);*/

  

  let it_product: ProductData | undefined;
  let en_product: ProductData | undefined;
  
  if (targetProduct?.attributes?.locale === "it-IT") {
    it_product = targetProduct;
    const en_productId = targetProduct?.attributes?.localizations?.data[0]?.id;
    en_product = productsResult?.data.find(product => product.id === en_productId);
  } else {
    en_product = targetProduct;
    const it_productId = targetProduct?.attributes?.localizations?.data[0]?.id;
    it_product = productsResult?.data.find(product => product.id === it_productId);
  }

  const product = locale === "it-IT" ? it_product : en_product;

  if (!product) {
    return <Text>SCRIVI DOPO!!!!!!!!!!</Text>
  }

  const subcategory = product?.attributes?.sub_category;
  const category = subcategoriesResult?.data.find(sb => sb.id === subcategory?.data.id)?.attributes?.category;

  /*const colors = useMemo(() => {
    return product?.attributes?.product_colors?.data.map((pc) => {
      const colorData = getProductColor(pc.id)?.attributes?.color?.data?.attributes;
      const colorId = getProductColor(pc.id)?.attributes?.color?.data?.id;
      const hexColor = colorData?.codiceEsadecimale;
      if (colorId && hexColor && selectedColor) {
        return {
          id: colorId,
          label: '',
          value: hexColor,
          color: hexColor,
          selected: selectedColor === hexColor,
        };
      }  
    }).filter((color) => color !== undefined); // Filter out undefined values
  }, [product, selectedColor]);*/

 
  const colors = product?.attributes?.product_colors?.data.map((pc) => ({
    name: getProductColor(pc?.id)?.attributes?.color?.data?.attributes?.codiceEsadecimale,
    value: getProductColor(pc?.id)?.attributes?.color?.data?.attributes?.codiceEsadecimale,
  }));
  

  const imagesByColor = {} as ImagesByColor
  product?.attributes?.product_colors?.data.forEach((pc) => {
    const productColor = productsColorsResult?.data.find(p => p?.id === pc?.id);
    const color = productColor?.attributes?.color;
    if (color && productColor?.attributes?.image?.data[0]?.attributes?.url) {
      imagesByColor[color?.data?.attributes?.codiceEsadecimale] = `http://172.20.10.3:1337${productColor?.attributes?.image?.data[0]?.attributes?.url}`;
    }
    
  });

  function getProductColor(productColorId: number) {
    const productColor = productsColorsResult?.data.find((product) => product.id === productColorId);
    if (productColor) {
      return productColor;
    } else {
      return null;
    }
  }

  return (
    <ScrollView style={styles.container}>
      {/*<View style={styles.breadcrumbContainer}>
        <Text style={styles.breadcrumbText}>{category?.data?.attributes?.category}</Text>
        <Text style={styles.breadcrumbSeparator}> / </Text>
        <TouchableOpacity onPress={() => router.back}>
          <Text style={styles.breadcrumbText}>{subcategory?.data?.attributes?.nome}</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumbSeparator}> / </Text>
        <Text style={styles.breadcrumbCurrent}>{product.attributes.name}</Text>
  </View>*/}
      <View style={styles.productContainer}>
        <View style={styles.imageContainer}>
          { selectedColor && <Image source={{ uri: imagesByColor[selectedColor] || 'placeholder_image_url' }} style={styles.image} />}
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.titleAndPrice}>
              <Text style={styles.productName}>{product.attributes.name}</Text>
              <Text style={styles.productPrice}>{product.attributes.price}.00$</Text>
            </View>
            <View style={styles.colors}>
                {colors.map((color) => (
                  <TouchableOpacity 
                    key = {color.name}
                    onPress={() => {
                      setSelectedColor(color.value);
                    }}
                    style={{
                      height: selectedColor === color.value ? 45 : 40,
                      width: selectedColor === color.value ? 45 : 40,
                      borderRadius: 50,
                      margin: 5,
                      borderWidth: 1,
                      borderColor: 'gray',
                      backgroundColor: color.name,
                      shadowColor: selectedColor === color.value ? "#000" : "#FFF",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
                  />
                ))}
            </View>
          </View>
          
          
          <Text style={styles.sectionTitle}>{pageResult?.data?.attributes?.descriptionTitle}</Text>
          <Text style={styles.productDescription}>{product.attributes.description}</Text>
          <Text style={styles.sectionTitle}>{pageResult?.data?.attributes?.sizesTitle}</Text>
          <View style={styles.sizesContainer}>
            {product.attributes.size.map((size, index) => (
              <View key={index} style={styles.sizeOption}>
                <Text style={styles.sizeText}>{size.name}</Text>
              </View>
            ))}
          </View>
          {product.attributes.product_colors.data.map((pc) => {
            const color = getProductColor(pc?.id)?.attributes?.color?.data?.attributes?.codiceEsadecimale;
            if (color === selectedColor && getProductColor(pc?.id)?.attributes?.object?.data) {
              return (
                <TouchableOpacity
                  key={pc?.id}
                  style={styles.button}
                  onPress={() => router.navigate('TridModel')}
                >
                  <Text style={styles.buttonText}>{pageResult?.data?.attributes?.buttonText}</Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      </View>
    </ScrollView>
  );
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#000000',
  },
  breadcrumbSeparator: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  breadcrumbCurrent: {
    fontSize: 14,
    color: '#777777',
  },
  productContainer: {
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    height: 350,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flexDirection: 'column',
    padding: 10,
    paddingHorizontal: 20
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16
  },
  productDescription: {
    fontSize: 15,
    color: '#555555',
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000000',
    margin: 4,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  sizeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  sizeText: {
    fontSize: 14,
    color: '#555555',
  },
  button: {
    backgroundColor: '#F0DDCB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#000000',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleAndPrice: {
    maxWidth: '80%'
  },
  colors: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});