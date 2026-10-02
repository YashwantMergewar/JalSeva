import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Settings, LogOut, ShieldCheck, UserCheck, Bell, ChevronRight } from "lucide-react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of the Admin Portal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  const initial = user?.fullname?.charAt(0).toUpperCase() ?? "A";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.card}>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.profileText}>
              <Text style={styles.name}>{user?.fullname || "Admin Officer"}</Text>
              <Text style={styles.email}>{user?.email || "admin@jalseva.gov.in"}</Text>
              <View style={styles.roleBadge}>
                <ShieldCheck size={12} color="#0f766e" />
                <Text style={styles.roleBadgeText}>CHIEF OFFICER • ADMIN</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Options */}
        <View style={styles.card}>
          <Pressable style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <UserCheck size={18} color="#0649aa" />
              <Text style={styles.rowText}>Role Permissions & Access Control</Text>
            </View>
            <ChevronRight size={16} color="#94a3b8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <Bell size={18} color="#0649aa" />
              <Text style={styles.rowText}>Notification & Alert Preferences</Text>
            </View>
            <ChevronRight size={16} color="#94a3b8" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <Settings size={18} color="#0649aa" />
              <Text style={styles.rowText}>Department Configuration</Text>
            </View>
            <ChevronRight size={16} color="#94a3b8" />
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#dc2626" />
          <Text style={styles.logoutText}>Log Out from Admin Portal</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  content: { padding: 16, gap: 14 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
  },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#ffffff" },
  profileText: { flex: 1 },
  name: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  email: { fontSize: 12, color: "#64748b", marginTop: 2 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ccfbf1",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  roleBadgeText: { fontSize: 9, fontWeight: "800", color: "#0f766e" },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowText: { fontSize: 13, fontWeight: "600", color: "#1e293b" },
  divider: { height: 1, backgroundColor: "#f1f5f9" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fee2e2",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginTop: 8,
  },
  logoutText: { fontSize: 13, fontWeight: "700", color: "#dc2626" },
});
