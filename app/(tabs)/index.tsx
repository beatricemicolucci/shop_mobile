import { View, Text, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native'
import React from 'react'
import useFetch from '@/hooks/useFetch';

interface HomePageData {
    data: {
        attributes: {
        homeText: string;
        backgroundImage: {
            data: {
                attributes: {
                    url: string;
                };
            };
        };
        };
    };
}

const Page = ()  => {

    const apiUrl = `http://192.168.1.101:1337/api/home-page?populate=*`;
    const { loading, error, data: homePageData } = useFetch<HomePageData>(apiUrl);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.error}>Error: {error.message}</Text>;
    }
    
    const relativebackgroundImageUrl = homePageData?.data?.attributes?.backgroundImage?.data?.attributes?.url;
    const backendUrl = 'http://192.168.1.101:1337';
    const backgroundImageUrl = `${backendUrl}${relativebackgroundImageUrl}`;


    return (
        <ImageBackground source={{uri: backgroundImageUrl}} style={styles.backgroundImage}>
            <View style={styles.homePage}>
                <Text style={styles.homeText}>{homePageData?.data?.attributes?.homeText}</Text>
            </View>
        </ImageBackground>
        
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