import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import {
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Droplet,
  FileText,
  HelpCircle,
  ChevronRight,
  Bell,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CitizenHeader from "../../src/components/CitizenHeader";

export default function CitizenProfileRoute() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/welcome");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Citizen Profile" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── User Avatar & Identity ── */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {user?.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={styles.name}>{user?.fullname || "Registered Citizen"}</Text>
          <Text style={styles.role}>Municipal Water Consumer • Ward 4</Text>
        </View>

        {/* ── Citizen Information Card ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Mail size={18} color="#0040a1" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user?.email || "citizen@jalseva.gov.in"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Phone size={18} color="#0040a1" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Registered Mobile</Text>
              <Text style={styles.infoValue}>{user?.mobile_no || "+91 98765 43210"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <ShieldCheck size={18} color="#006b5f" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Account Status</Text>
              <Text style={[styles.infoValue, { color: "#006b5f", fontWeight: "700" }]}>
                {user?.isActive ? "Verified & Active" : "Active Citizen"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Quick Links ── */}
        <Text style={styles.sectionHeading}>My Services</Text>

        <View style={styles.linksCard}>
          <Pressable
            style={styles.linkRow}
            onPress={() => router.push("/(citizen)/my-connection" as any)}
          >
            <View style={styles.linkLeft}>
              <Droplet size={18} color="#0040a1" />
              <Text style={styles.linkLabel}>My Water Connection</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.linkRow}
            onPress={() => router.push("/(citizen)/application-tracking" as any)}
          >
            <View style={styles.linkLeft}>
              <FileText size={18} color="#0040a1" />
              <Text style={styles.linkLabel}>Application Tracking</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.linkRow}
            onPress={() => router.push("/(citizen)/notifications" as any)}
          >
            <View style={styles.linkLeft}>
              <Bell size={18} color="#0040a1" />
              <Text style={styles.linkLabel}>Municipal Notifications</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.linkRow}
            onPress={() => router.push("/(citizen)/support" as any)}
          >
            <View style={styles.linkLeft}>
              <HelpCircle size={18} color="#0040a1" />
              <Text style={styles.linkLabel}>Support & Helpdesk</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </Pressable>
        </View>

        {/* ── Sign Out Button ── */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#ba1a1a" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#ffffff" },
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContent: { padding: 16 },
  profileHeader: {
    alignItems: "center",
    marginVertical: 14,
  },
  avatarCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  avatarText: { fontSize: 30, fontWeight: "700", color: "#ffffff" },
  name: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  role: { fontSize: 13, color: "#64748b", marginTop: 4 },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
  infoTextGroup: { flex: 1 },
  infoLabel: { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", fontWeight: "600" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#0f172a", marginTop: 2 },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 8 },
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  linksCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 8,
    marginBottom: 24,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  linkLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#ba1a1a",
    backgroundColor: "#fff5f5",
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#ba1a1a" },
});
