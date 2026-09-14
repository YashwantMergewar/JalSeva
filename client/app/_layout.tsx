import "../src/global.css";

import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from './../src/screens/SplashScreen';

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Expo's native splash uses the same background, then this branded view takes over.
    ExpoSplashScreen.hide();

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <Stack initialRouteName="welcome" screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
