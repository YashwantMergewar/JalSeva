import { useRouter } from "expo-router";
import RegisterScreen from "../src/screens/RegisterScreen";

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <RegisterScreen
      onBack={() => router.back()}
      onRegister={() => router.replace("/registration-success")}
      onLogin={() => router.replace("/login")}
    />
  );
}
