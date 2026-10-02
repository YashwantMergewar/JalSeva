import { useRouter } from "expo-router";
import HomeScreen from "../../src/screens/HomeScreen";

export default function HomeRoute() {
  const router = useRouter();

  return (
    <HomeScreen
      onLogin={() => router.push("/login")}
      onRegister={() => router.push("/register")}
    />
  );
}
