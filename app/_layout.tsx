import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Stack } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons';
import { LanguageProvider, LanguageContext } from "@/contexts/LanguageContext";
import LanguageModal from '@/components/LanguageModal';

export default function RootLayout() {
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
          fontWeight: 'bold',
          fontFamily: 'Libre Bodoni'
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
