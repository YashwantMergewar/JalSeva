import "../src/global.css";

import { Redirect, Stack } from "expo-router";
import * as ExpoSplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "./../src/screens/SplashScreen";

import { AuthProvider, ToastProvider } from "../src/context";
import { useAuth } from "../src/context/AuthContext";
import { getHasSeenOnboarding } from "../src/utils/storage";

ExpoSplashScreen.preventAutoHideAsync();


/**
 * Inner navigator that has access to AuthContext.
 * Routes based on whether the user has a valid access token.
 */
function RootNavigator() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboardingState] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    getHasSeenOnboarding()
      .then((seen) => {
        if (mounted) {
          setHasSeenOnboardingState(seen);
        }
      })
      .catch(() => {
        if (mounted) {
          setHasSeenOnboardingState(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // While AuthContext is restoring the token from SecureStore or checking onboarding status, show a loader
  if (isLoading || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f0efea" }}>
        <ActivityIndicator size="large" color="#0649aa" />
      </View>
    );
  }

  // ── Authenticated ──
  if (isAuthenticated) {
    const isEmployee = user?.userType === "EMPLOYEE";
    const roleName = ((user as any)?.role?.name || (user as any)?.roleName || (user as any)?.role || "").toString().toUpperCase();
    const isAdmin = isEmployee && (roleName.includes("ADMIN") || (user as any)?.isAdmin);
    const initialRoute = isAdmin ? "(admin)" : isEmployee ? "(employee)" : "(citizen)";

    return (
      <Stack initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(admin)" options={{ href: isAdmin ? undefined : null } as any} />
        <Stack.Screen name="(employee)" options={{ href: (isEmployee && !isAdmin) ? undefined : null } as any} />
        <Stack.Screen name="(citizen)" options={{ href: !isEmployee ? undefined : null } as any} />
        {/* Hide auth / guest screens from the stack */}
        <Stack.Screen name="welcome" options={{ href: null } as any} />
        <Stack.Screen name="login" options={{ href: null } as any} />
        <Stack.Screen name="register" options={{ href: null } as any} />
        <Stack.Screen name="registration-success" options={{ href: null } as any} />
        <Stack.Screen name="onboarding" options={{ href: null } as any} />
        <Stack.Screen name="(tabs)" options={{ href: null } as any} />
      </Stack>
    );
  }

  // ── Not authenticated: show public/guest screens ──
  const initialRoute = hasSeenOnboarding ? "welcome" : "onboarding";

  return (
    <Stack initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="registration-success" />
      <Stack.Screen name="(tabs)" />
      {/* Activation screens — accessible without authentication via deep link */}
      <Stack.Screen name="activate-account" />
      <Stack.Screen name="activation-success" />
      {/* Hide protected routes from the stack */}
      <Stack.Screen name="(citizen)" options={{ href: null } as any} />
      <Stack.Screen name="(admin)" options={{ href: null } as any} />
      <Stack.Screen name="(employee)" options={{ href: null } as any} />
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

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          {showSplash ? <SplashScreen /> : <RootNavigator />}
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}

