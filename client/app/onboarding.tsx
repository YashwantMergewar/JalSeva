import { useRouter } from "expo-router";
import OnboardingFlow from "../src/screens/OnboardingFlow";

export default function OnboardingRoute() {
  const router = useRouter();
  const goHome = () => router.replace("/index");

  return <OnboardingFlow onSkip={goHome} onComplete={goHome} />;
}
