import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  Shield,
  LogOut,
  Bell,
  Lock,
  ChevronRight,
  IdCard,
  Edit3,
} from "lucide-react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";

// ─── Info Row ─────────────────────────────────────────────────────────────────
function ProfileInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>{icon}</View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── Menu Item ────────────────────────────────────────────────────────────────
function MenuItem({
  icon,
  label,
  onPress,
  danger,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
  extra?: React.ReactNode;
}) {
  return (
    <Pressable
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={[styles.menuIcon, danger && { backgroundColor: "#fff1f2" }]}>
        {icon}
      </View>
      <Text style={[styles.menuLabel, danger && { color: "#dc2626" }]}>
        {label}
      </Text>
      <View style={styles.menuRight}>
        {extra}
        {!danger && <ChevronRight size={16} color="#94a3b8" strokeWidth={2} />}
      </View>
    </Pressable>
  );
}

export default function EmployeeProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const initial = user?.fullname?.charAt(0).toUpperCase() ?? "E";
  const employeeId = "EMP-0007"; // Would come from employee profile API
  const department = "Water Department";
  const role = "Engineer";

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "A password reset link will be sent to your registered email address.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send Link", onPress: () => Alert.alert("Email Sent", "Password reset link has been sent.") },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Pressable style={styles.editAvatarBtn}>
            <Edit3 size={12} color="#0040a1" strokeWidth={2.5} />
          </Pressable>
          <Text style={styles.profileName}>{user?.fullname ?? "Employee"}</Text>
          <View style={styles.roleBadge}>
            <Shield size={12} color="#0040a1" strokeWidth={2} />
            <Text style={styles.roleBadgeText}>{role}</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>

        {/* Employee Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Employee Information</Text>

          <ProfileInfoRow
            icon={<IdCard size={16} color="#0040a1" strokeWidth={2} />}
            label="Employee ID"
            value={employeeId}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            icon={<UserRound size={16} color="#0040a1" strokeWidth={2} />}
            label="Full Name"
            value={user?.fullname ?? "—"}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            icon={<Mail size={16} color="#0040a1" strokeWidth={2} />}
            label="Email Address"
            value={user?.email ?? "—"}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            icon={<Phone size={16} color="#0040a1" strokeWidth={2} />}
            label="Mobile Number"
            value={user?.mobile_no ?? "—"}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            icon={<Building2 size={16} color="#0040a1" strokeWidth={2} />}
            label="Department"
            value={department}
          />
          <View style={styles.divider} />
          <ProfileInfoRow
            icon={<Shield size={16} color="#0040a1" strokeWidth={2} />}
            label="Role"
            value={role}
          />
        </View>

        {/* Settings */}
        <View style={styles.menuCard}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <MenuItem
            icon={<Bell size={16} color="#0040a1" strokeWidth={2} />}
            label="Push Notifications"
            extra={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#e2e8f0", true: "#bfdbfe" }}
                thumbColor={notificationsEnabled ? "#0040a1" : "#94a3b8"}
              />
            }
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<Lock size={16} color="#0040a1" strokeWidth={2} />}
            label="Change Password"
            onPress={handleChangePassword}
          />
        </View>

        {/* Logout */}
        <View style={styles.menuCard}>
          <MenuItem
            icon={<LogOut size={16} color="#dc2626" strokeWidth={2} />}
            label="Sign Out"
            onPress={handleLogout}
            danger
          />
        </View>

        <Text style={styles.versionText}>Jal Seva v1.0.0 · Water Department</Text>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    height: 58,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0040a1" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    position: "relative",
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "800", color: "#fff" },
  editAvatarBtn: {
    position: "absolute",
    top: 72,
    right: "37%",
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 6 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#dbeafe",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  roleBadgeText: { fontSize: 12, fontWeight: "700", color: "#0040a1" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#16a34a" },
  statusText: { fontSize: 12, color: "#16a34a", fontWeight: "600" },

  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 9,
    backgroundColor: "#f0f7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: "#94a3b8", marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  divider: { height: 1, backgroundColor: "#f1f5f9" },

  menuCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 4,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#f0f7ff",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: "600", color: "#374151" },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 4 },

  versionText: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 8,
  },
});
