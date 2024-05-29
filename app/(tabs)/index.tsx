import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useContext, useRef } from 'react'
import useFetch from '@/hooks/useFetch';
import { LanguageContext } from '@/contexts/LanguageContext';
import PagerView from 'react-native-pager-view';
import { Button } from '@rneui/base';


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

const Page = ()  => {

    const languageContext = useContext(LanguageContext);
    const locale = languageContext?.locale;

    const categoriesApiUrl = `http://172.20.10.3:1337/api/categories?locale=${locale}&populate=*`;
    const { loading: loading, error: error, data: categoriesData } = useFetch<CategoriesData>(categoriesApiUrl);
    const ref = useRef<PagerView>(null);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>Error: {error.message}</Text>;
    }
    
    /*const relativebackgroundImageUrl = homePageData?.data?.attributes?.backgroundImage?.data?.attributes?.url;
    const backendUrl = 'http://172.20.10.3:1337';
    const backgroundImageUrl = `${backendUrl}${relativebackgroundImageUrl}`;*/


    return (
        <View style={styles.container}>
            <PagerView 
                style={styles.pager} 
                ref={ref} 
                initialPage={0} 
            >
                <View style={styles.switchContainer}>
                    <TouchableOpacity onPress={() => ref.current?.setPage(0)} style={styles.switchButton}>
                        <Text style={styles.switchButtonText}>{categoriesData?.data[0].attributes.category}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ref.current?.setPage(1)} style={styles.switchButton}>
                        <Text style={styles.switchButtonText}>{categoriesData?.data[0].attributes.category}</Text>
                    </TouchableOpacity>
                </View>
                <View key="1">

                </View>
                <View key="2">

                </View>
            </PagerView>
        </View>
        
    )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    pager: {
        flex: 1,
        alignSelf: "stretch"
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    switchButton: {

    },
    switchButtonText: {

    },
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    homePage: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    homeText: {
        fontSize: 30,
        color: '#fff',
        textAlign: 'center',
        fontWeight: '300',
    },
})