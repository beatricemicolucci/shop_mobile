import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MenuModal from '@/components/menuModal';
import LanguageModal from '@/components/LanguageModal';
import { LanguageContext, LanguageProvider } from '@/contexts/LanguageContext';
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function Layout() {

  const [isModalVisible, setModalVisible] = useState(false);  
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

 const languageContext = useContext(LanguageContext);

  if (!languageContext) {
    return null;
  }
  const { setLocale } = languageContext;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleLanguageModal = () => {
    setLanguageModalVisible(!isLanguageModalVisible);
  };

  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <Tabs screenOptions={{
          tabBarStyle: {
              backgroundColor: '#F0DDCB',
          },
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.black,
          tabBarInactiveTintColor: '999',
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#F0DDCB',
          },
          headerTitle: 'Galleria Glamour',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontFamily: 'Libre Bodoni',
            letterSpacing: 1.5
          },
          headerRight: () => (
            <MaterialIcons
              name="language"
              size={24}
              color="black"
              style={{ marginRight: 15 }}
              onPress={toggleLanguageModal}
            />
          ),
      }}>
          <Tabs.Screen name='index' options={{tabBarIcon: ({color}) => (
              <FontAwesome name="home" size={24} color={color} />
          )}}/>
          <Tabs.Screen name='salesPoints' options={{tabBarIcon: ({color}) => (
              <FontAwesome5 name="map-pin" size={24} color={color} />
          )}}/>
          <Tabs.Screen name='contacts' options={{tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="email" size={24} color={color} />
          )}}/>
          <Tabs.Screen 
              name='menu' 
              listeners={{
                tabPress: (e) => {
                  e.preventDefault();  // previene la navigazione
                  toggleModal();  // apre il modale
                },
              }}
              options={{
                tabBarIcon: ({color}) => (
                  <MaterialIcons name="menu" size={24} color={color} />
                ),
              }}
            />
        </Tabs>
        <MenuModal visible={isModalVisible} onClose={toggleModal} />
        <LanguageModal
          visible={isLanguageModalVisible}
          onClose={toggleLanguageModal}
          onSelectLanguage={(language) => {
            setLocale(language);
            toggleLanguageModal();
          }}
        />
    </GestureHandlerRootView>
  )
}