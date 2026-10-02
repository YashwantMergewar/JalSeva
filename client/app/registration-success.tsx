import { useRouter } from "expo-router";
import RegistrationSuccessScreen from "../src/screens/RegistrationSuccessScreen";

export default function RegistrationSuccessRoute() {
  const router = useRouter();

  return (
    <RegistrationSuccessScreen
      onContinueLogin={() => router.replace("/login")}
    />
  );
}
