import { useRouter } from "expo-router";
import LoginScreen from "../src/screens/LoginScreen";
import { useAuth } from "../src/context/AuthContext";

export default function LoginRoute() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <LoginScreen
      onBack={() => router.back()}
      onLogin={(loggedInUser) => {
        const u = loggedInUser || user;
        const roleName = ((u as any)?.role?.name || (u as any)?.roleName || (u as any)?.role || "").toString().toUpperCase();
        const isAdmin = u?.userType === "EMPLOYEE" && (roleName.includes("ADMIN") || (u as any)?.isAdmin);
        if (isAdmin) {
          router.replace("/(admin)" as any);
        } else if (u?.userType === "EMPLOYEE") {
          router.replace("/(employee)" as any);
        } else {
          router.replace("/(citizen)" as any);
        }
      }}
      onRegister={() => router.push("/register")}
    />
  );
}
