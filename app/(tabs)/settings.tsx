import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { LanguageContext, LanguageProvider } from '@/contexts/LanguageContext';
import useFetch from '@/hooks/useFetch';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import LanguageModal from '@/components/LanguageModal';

interface PageData {
    data: {
        id: number,
        attributes: {
            contactsField: string,
            languageField: string,
            termsField: string,
            title: string
        }
    }
}

const Page = () => {

    const languageContext = useContext(LanguageContext);
    const locale = languageContext?.locale;

    const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
    if (!languageContext) {
        return null;
      }
    const { setLocale } = languageContext;

    const pageApiUrl = `http://192.168.1.102:1337/api/settings-page?locale=${locale}`
    const {loading: loading, error: error, data: pageData} = useFetch<PageData>(pageApiUrl)

    const toggleLanguageModal = () => {
        setLanguageModalVisible(!isLanguageModalVisible);
      };

    return (
        <View style={styles.container}>
          <Text style={styles.title}>{pageData?.data.attributes.title}</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.optionContainer} onPress={() => router.push({pathname: "./contacts"})}>
             <View style={styles.firstItems}>
                    <MaterialCommunityIcons name="email" size={24} color="#434343" style={styles.icon}/>
                    <Text style={styles.text}>{pageData?.data.attributes.contactsField}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#434343" style={styles.arrow}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer} onPress={toggleLanguageModal}>
                <View style={styles.firstItems}>
                <MaterialIcons name="language" size={24} color="#434343" style={styles.icon}/>
                    <Text style={styles.text}>{pageData?.data.attributes.languageField}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#434343" style={styles.arrow}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionContainer}>
                <View style={styles.firstItems}>
                <MaterialIcons name="policy" size={24} color="#434343" style={styles.icon} />
                    <Text style={styles.text}>{pageData?.data.attributes.termsField}</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="#434343" style={styles.arrow}/>
            </TouchableOpacity>
          </View>
          <LanguageModal
            visible={isLanguageModalVisible}
            onClose={toggleLanguageModal}
            onSelectLanguage={(language) => {
            setLocale(language);
          }}
        />
        </View>
      )
}

export default Page

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAE3DF',
    },
    title: {
        color: '#434343',
        fontFamily: 'Poppins_500Medium',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30
    },
    settingsContainer: {
        padding: 20,
        paddingHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#D4A690',
        padding: 10,
        justifyContent: 'space-between',
        shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginVertical: 10
    },
    arrow: {
        alignSelf: 'flex-end',
        marginBottom: 5
    },
    text: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 16,
        color: '#434343'
    },
    firstItems: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginHorizontal: 10,
        marginBottom: 5
    }
});