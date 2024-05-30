import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

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
      title: string;
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
        <Text style={styles.title}>{contactsFields?.data.attributes.title}</Text>
        <ScrollView style={styles.scrollview} contentContainerStyle={{alignItems: 'center'}}>
          <View style={styles.card}>
              <Fontisto name="phone" size={30} color="#434343" style={styles.iconContainer}/>
              <Text style={styles.field}>{`${contactsFields?.data?.attributes?.telephone}`.toUpperCase()}</Text>
              <Text style={styles.data}>{contactsData?.data?.attributes?.telephone}</Text>
          </View>
          <View style={styles.card}>
              <Ionicons name="mail" size={30} color="#434343" style={styles.iconContainer}/>
              <Text style={styles.field}>{`${contactsFields?.data?.attributes?.email}`.toUpperCase()}</Text>
              <Text style={styles.data}>{contactsData?.data?.attributes?.email}</Text>
            </View>
          <View style={styles.card}>
              <FontAwesome6 name="map-location-dot" size={30} color="#434343" style={styles.iconContainer}/>
              <Text style={styles.field}>{`${contactsFields?.data?.attributes?.headquarters}`.toUpperCase()}</Text>
              <Text style={styles.data}>{contactsData?.data?.attributes?.headquarters}</Text>
          </View>
        </ScrollView>
      </View>
  )
}

export default Page

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#EAE3DF',
  },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D4A690',
    borderRadius: 30,
    elevation: 5,
    marginVertical: 10,
    width: '70%',
  },
  iconContainer: {
    margin: 10,
  },
  textContainer: {
    padding: 10,
    paddingRight: 20,
  },
  field: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#434343'
  },
  data: {
    fontFamily: 'Poppins_300Light',
    fontSize: 12,
    color: '#434343'
  },
  title: {
    color: '#434343',
    fontFamily: 'Poppins_500Medium',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 30
  },
  scrollview: {
    width: '100%',
    marginBottom: 20
  }
})
