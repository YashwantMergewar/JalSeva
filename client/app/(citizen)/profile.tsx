import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { LogOut, User, Mail, Phone, ShieldCheck } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CitizenProfileRoute() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/welcome");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
          </Text>
        </View>

        <Text style={styles.name}>{user?.fullname || "Citizen Profile"}</Text>
        <Text style={styles.role}>Registered Citizen</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Mail size={18} color="#0649aa" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email || "Not provided"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Phone size={18} color="#0649aa" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Mobile Number</Text>
              <Text style={styles.infoValue}>{user?.mobile_no || "Not provided"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <ShieldCheck size={18} color="#0a7868" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Account Status</Text>
              <Text style={[styles.infoValue, { color: "#0a7868", fontWeight: "600" }]}>
                {user?.isActive ? "Verified & Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#ba1a1a" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0efea" },
  container: {
    padding: 20,
    alignItems: "center",
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#ffffff" },
  name: { fontSize: 22, fontWeight: "700", color: "#111111" },
  role: { fontSize: 14, color: "#687080", marginTop: 4, marginBottom: 24 },
  infoCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#d8d8d0",
    marginBottom: 28,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 8,
  },
  infoTextGroup: { flex: 1 },
  infoLabel: { fontSize: 12, color: "#687080" },
  infoValue: { fontSize: 15, fontWeight: "500", color: "#111111", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#ecece6", marginVertical: 8 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ba1a1a",
    backgroundColor: "#ffdad6",
  },
  logoutText: { fontSize: 16, fontWeight: "700", color: "#ba1a1a" },
});
