import { useRouter } from "expo-router";
import OnboardingFlow from "../src/screens/OnboardingFlow";
import { setHasSeenOnboarding } from "../src/utils/storage";

export default function OnboardingRoute() {
  const router = useRouter();

  const handleFinish = async () => {
    try {
      await setHasSeenOnboarding(true);
    } catch {}
    router.replace("/welcome");
  };

  return <OnboardingFlow onSkip={handleFinish} onComplete={handleFinish} />;
}

