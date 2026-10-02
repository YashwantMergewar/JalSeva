import { useRouter } from "expo-router";
import OnboardingFlow from "../src/screens/OnboardingFlow";

export default function OnboardingRoute() {
  const router = useRouter();

  // Both Skip and Complete go to the guest home screen (tabs)
  const goGuestHome = () => router.replace("/(tabs)");

  return <OnboardingFlow onSkip={goGuestHome} onComplete={goGuestHome} />;
}
