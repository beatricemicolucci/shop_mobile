import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';

interface ContactsData {
  data: {
      attributes: {
          telephone: string;
          email: string,
          headquarters: string
      };
  };
}

interface ContactsFields {
  data: {
    attributes: {
      telephone: string;
      headquarters: string;
      email: string;
    }
  }
}

const Page = () => {

  const languageContext = useContext(LanguageContext);
  const locale = languageContext?.locale;
  const contactsDataApiUrl = `http://172.20.10.3:1337/api/company`;
  const contactsFieldsApiUrl = `http://172.20.10.3:1337/api/contacts-bar?locale=${locale}`;
  const { loading: loadingData, error: errorData, data: contactsData } = useFetch<ContactsData>(contactsDataApiUrl);
  const { loading: loadingFields, error: errorFields, data: contactsFields } = useFetch<ContactsFields>(contactsFieldsApiUrl);

  return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Fontisto name="phone" size={35} color="black" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.field}>{`${contactsFields?.data?.attributes?.telephone}`.toUpperCase()}</Text>
            <Text style={styles.data}>{contactsData?.data?.attributes?.telephone}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={35} color="black" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.field}>{`${contactsFields?.data?.attributes?.email}`.toUpperCase()}</Text>
            <Text style={styles.data}>{contactsData?.data?.attributes?.email}</Text>
          </View>
          </View>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <FontAwesome6 name="map-location-dot" size={35} color="black" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.field}>{`${contactsFields?.data?.attributes?.headquarters}`.toUpperCase()}</Text>
            <Text style={styles.data}>{contactsData?.data?.attributes?.headquarters}</Text>
          </View>
          </View>
      </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    marginVertical: 10
  },
  iconContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: 5,
    padding: 15
  },
  textContainer: {
    padding: 10,
    paddingRight: 20,
  },
  field: {
    fontWeight: 'bold',
    fontSize: 20
  },
  data: {
    fontStyle: 'italic'
  }
})
