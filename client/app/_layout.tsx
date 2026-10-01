import "../src/global.css";

import { Redirect, Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./../src/screens/SplashScreen";

import { AuthProvider } from "../src/context";
import { useAuth } from "../src/context/AuthContext";

ExpoSplashScreen.preventAutoHideAsync();

/**
 * Inner navigator that has access to AuthContext.
 * Routes based on whether the user has a valid access token.
 */
function RootNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // While AuthContext is restoring the token from SecureStore, show a loader
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0efea" }}>
        <ActivityIndicator size="large" color="#0649aa" />
      </View>
    );
  }

  // ── Authenticated ──
  if (isAuthenticated) {
    const isAdmin = user?.userType === "EMPLOYEE";
    return (
      <Stack screenOptions={{ headerShown: false }}>
        {isAdmin ? (
          <Stack.Screen name="(admin)" />
        ) : (
          <Stack.Screen name="(citizen)" />
        )}
        {/* Hide auth / guest screens from the stack */}
        <Stack.Screen name="welcome" options={{ href: null } as any} />
        <Stack.Screen name="login" options={{ href: null } as any} />
        <Stack.Screen name="register" options={{ href: null } as any} />
        <Stack.Screen name="registration-success" options={{ href: null } as any} />
        <Stack.Screen name="onboarding" options={{ href: null } as any} />
        <Stack.Screen name="(tabs)" options={{ href: null } as any} />
        {isAdmin ? (
          <Stack.Screen name="(citizen)" options={{ href: null } as any} />
        ) : (
          <Stack.Screen name="(admin)" options={{ href: null } as any} />
        )}
      </Stack>
    );
  }

  // ── Not authenticated: show public/guest screens ──
  return (
    <Stack initialRouteName="welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="registration-success" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      {/* Activation screens — accessible without authentication via deep link */}
      <Stack.Screen name="activate-account" />
      <Stack.Screen name="activation-success" />
      <Stack.Screen name="(admin)/activate-account" />
      <Stack.Screen name="(admin)/activation-success" />
      {/* Hide protected routes from the stack */}
      <Stack.Screen name="(citizen)" options={{ href: null } as any} />
      <Stack.Screen name="(admin)" options={{ href: null } as any} />
    </Stack>
  );
}

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
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
