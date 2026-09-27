import { useRouter } from "expo-router";
import CitizenDashboardScreen from "../../src/screens/CitizenDashboardScreen";

export default function CitizenHomeRoute() {
  const router = useRouter();

  return (
    <CitizenDashboardScreen
      onNotifications={() => router.push("/(citizen)/notifications" as any)}
    />
  );
}
