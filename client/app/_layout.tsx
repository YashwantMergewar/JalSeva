import "../src/global.css";

import { Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import SplashScreen from "../src/components/SplashScreen";

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

  return <Stack screenOptions={{ headerShown: false }} />;
}
