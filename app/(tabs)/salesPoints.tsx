import React, { useContext } from 'react';
import { ScrollView, View, Text, StyleSheet, Image } from 'react-native';
import { Card } from '@rneui/base';
import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import { Entypo } from '@expo/vector-icons';

interface RegionAttributes {
  region: string;
}

interface RegionsData {
  id: number;
  attributes: RegionAttributes;
}

interface SalesPointAttributes {
  location: string;
  telephone: string;
  city: string;
  region: {
    data: RegionsData;
  };
}

interface SalesPointData {
  id: number;
  attributes: SalesPointAttributes;
}

interface SalesPointsData {
  data: SalesPointData[];
}

interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

interface ImageAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ImageData {
  id: number;
  attributes: ImageAttributes;
}

interface PageAttributes {
  caption: string;
  locationDetailTitle: string;
  telephoneDetailTitle: string;
  locale: string;
  shoppingImage: {
    data: ImageData;
  };
}

interface PageData {
  data: {
    id: number;
    attributes: PageAttributes;
  }
}



const Page = () => {

  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;
  const salesPointsApiUrl = `http://192.168.1.101:1337/api/sales-points?locale=${locale}&populate=*`;
  const salesPointPageApiUrl = `http://192.168.1.101:1337/api/sales-point-page?locale=${locale}&populate=*`;
  const regionsApiUrl = `http://192.168.1.101:1337/api/regions?locale=${locale}&populate=*`;
  const { loading: loadingData, error: errorData, data: salesPointsData } = useFetch<SalesPointsData>(salesPointsApiUrl);
  const { loading: loadingPage, error: errorPage, data: pageData } = useFetch<PageData>(salesPointPageApiUrl);
  const { loading: loadingRegions, error: errorRegions, data: regionsData } = useFetch<RegionsData>(regionsApiUrl);


    return (
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Entypo name="location" size={24} color="black" />
        <Text style={styles.caption}>{pageData?.data?.attributes?.caption}</Text>
      </View>
      <View style={styles.salesPointsContainer}>
        {salesPointsData?.data?.map((salesPoint, index) => (
          <Card key={index} containerStyle={styles.card}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: `http://172.20.10.3:1337${pageData?.data?.attributes?.shoppingImage?.data?.attributes?.url}` }}
                style={styles.image}
                alt="Image by jcomp on Freepik"
              />
              <View style={styles.overlay} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.region}>
                {salesPoint?.attributes?.region?.data?.attributes?.region}
              </Text>
              <Text style={styles.location}>
                {salesPoint?.attributes?.location}
              </Text>
              <Text style={styles.telephone}>
                {salesPoint?.attributes?.telephone}
              </Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
      )
}

export default Page

const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      marginTop: 10
    },
    caption: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
    salesPointsContainer: {
      flex: 1,
    },
    card: {
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 15,
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: '100%',
      height: 200,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    cardContent: {
      padding: 10,
    },
    region: {
      fontSize: 18,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginBottom: 5,
    },
    location: {
      fontSize: 16,
      marginBottom: 5,
    },
    telephone: {
      fontSize: 14,
      color: 'gray',
    },
})