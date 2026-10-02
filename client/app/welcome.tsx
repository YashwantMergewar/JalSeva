import { useRouter } from "expo-router";
import WelcomeScreen from "../src/screens/WelcomeScreen";

export default function WelcomeRoute() {
  const router = useRouter();

  return (
    <WelcomeScreen
      onLogin={() => router.push("/login")}
      onContinueAsGuest={() => router.push("/onboarding")}
    />
  );
}
