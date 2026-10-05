import { useRouter } from "expo-router";
import WelcomeScreen from "../src/screens/WelcomeScreen";
import { setHasSeenOnboarding } from "../src/utils/storage";

export default function WelcomeRoute() {
  const router = useRouter();

  const handleContinueAsGuest = () => {
    setHasSeenOnboarding(true).catch(() => {});
    router.replace("/(tabs)");
  };

  return (
    <WelcomeScreen
      onLogin={() => router.push("/login")}
      onContinueAsGuest={handleContinueAsGuest}
    />
  );
}

