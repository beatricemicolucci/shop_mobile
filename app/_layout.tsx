import { LanguageProvider } from "@/contexts/LanguageContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
        <Stack.Screen name="itemList" options={{ headerShown: false }} />
      </Stack>
    </LanguageProvider>
  );
}
