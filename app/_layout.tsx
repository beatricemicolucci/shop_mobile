import React, { useCallback, useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SplashScreen, Stack } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { LanguageProvider, LanguageContext } from "@/contexts/LanguageContext";
import LanguageModal from '@/components/LanguageModal';
import { useFonts, LeagueSpartan_400Regular, LeagueSpartan_600SemiBold, LeagueSpartan_700Bold } from '@expo-google-fonts/league-spartan';
import AppLoading from 'expo-app-loading';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    LeagueSpartan_400Regular,
    LeagueSpartan_600SemiBold,
    LeagueSpartan_700Bold
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }


  return (
    <LanguageProvider>
      <AppNavigator />
    </LanguageProvider>
  );
}

function AppNavigator() {
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const languageContext = useContext(LanguageContext);

  if (!languageContext) {
    return null;
  }

  const { setLocale } = languageContext;

  const toggleLanguageModal = () => {
    setLanguageModalVisible(!isLanguageModalVisible);
  };

  return (
    <>
      <Stack screenOptions={{
        headerTintColor: 'black',
        headerStyle: {
          backgroundColor: '#F0DDCB',
        },
        headerTitle: 'Galleria Glamour',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'BodoniModa_700Bold',        
        },
        headerRight: () => (
          <MaterialIcons
            name="language"
            size={24}
            color="black"
            onPress={toggleLanguageModal}
          />
        ),
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="itemsList/[id]" />
        <Stack.Screen name="itemDetails/[id]" />
      </Stack>
    <LanguageModal
      visible={isLanguageModalVisible}
      onClose={toggleLanguageModal}
      onSelectLanguage={(language) => {
        setLocale(language);
        toggleLanguageModal();
      }}
      />
    </>
  );
}
