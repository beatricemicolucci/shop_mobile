import { View, Text } from 'react-native'
import React, { useContext, useState } from 'react'
import { Tabs, router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MenuModal from '@/components/menuModal';
import LanguageModal from '@/components/LanguageModal';
import { LanguageContext, LanguageProvider } from '@/contexts/LanguageContext';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LeagueSpartan_600SemiBold, useFonts, LeagueSpartan_800ExtraBold, LeagueSpartan_700Bold, LeagueSpartan_500Medium } from '@expo-google-fonts/league-spartan';
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
import {
  BodoniModa_400Regular,
  BodoniModa_500Medium,
  BodoniModa_600SemiBold,
  BodoniModa_700Bold,
  BodoniModa_800ExtraBold,
  BodoniModa_900Black,
  BodoniModa_400Regular_Italic,
  BodoniModa_500Medium_Italic,
  BodoniModa_600SemiBold_Italic,
  BodoniModa_700Bold_Italic,
  BodoniModa_800ExtraBold_Italic,
  BodoniModa_900Black_Italic,
} from '@expo-google-fonts/bodoni-moda';
import { Route } from 'expo-router/build/Route';
import { Ionicons } from '@expo/vector-icons';


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

  let [fontsLoaded] = useFonts({
    LeagueSpartan_700Bold,
    BodoniModa_400Regular,
    BodoniModa_500Medium,
    BodoniModa_600SemiBold,
    BodoniModa_700Bold,
    BodoniModa_800ExtraBold,
    BodoniModa_900Black,
    BodoniModa_400Regular_Italic,
    BodoniModa_500Medium_Italic,
    BodoniModa_600SemiBold_Italic,
    BodoniModa_700Bold_Italic,
    BodoniModa_800ExtraBold_Italic,
    BodoniModa_900Black_Italic,
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_300Light,
    Poppins_400Regular,
    LeagueSpartan_500Medium
  });


  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <Tabs screenOptions={{
          tabBarStyle: {
              backgroundColor: '#F0DDCB',
              height: 60,
          },
          tabBarShowLabel: true,
          tabBarActiveTintColor: Colors.black,
          tabBarInactiveTintColor: '#434343',
          tabBarLabelStyle: {
            marginBottom: 5
          },
          tabBarIconStyle: {
            marginTop: 10
          },
          headerTintColor: 'black',
          headerStyle: {
            backgroundColor: '#F0DDCB',
          },
          headerTitle: 'Galleria Glamour',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'BodoniModa_700Bold',
          },
      }}>
          <Tabs.Screen name='index' options={{ title:"Home", tabBarIcon: ({color}) => (
              <FontAwesome name="home" size={22} color={color} />
          )}}/>
          <Tabs.Screen name='salesPoints' options={{title:"Sales Points", tabBarIcon: ({color}) => (
              <FontAwesome5 name="map-pin" size={20} color={color} />
          )}}/>
          <Tabs.Screen name='menu' options={{href: null}} />
          <Tabs.Screen name='settings' options={{title:"Settings", tabBarIcon: ({color}) => (
              <Ionicons name="settings-sharp" size={22} color={color} />
          )}}/>
          <Tabs.Screen name='itemsList/[id]' options={{href: null}}/>
          <Tabs.Screen name='itemDetails/[id]' options={{href: null}} />
          <Tabs.Screen name='contacts' options={{href: null}} />
          {/*<Tabs.Screen 
              name='menu' 
              listeners={{
                tabPress: (e) => {
                  e.preventDefault();
                  toggleModal();
                },
              }}
              options={{
                tabBarIcon: ({color}) => (
                  <MaterialIcons name="menu" size={24} color={color} />
                ),
              }}
            />*/}
        </Tabs>
        <MenuModal visible={isModalVisible} onClose={toggleModal} />
        <LanguageModal
          visible={isLanguageModalVisible}
          onClose={toggleLanguageModal}
          onSelectLanguage={(language) => {
            setLocale(language);
          }}
        />
        </GestureHandlerRootView>
  )
}