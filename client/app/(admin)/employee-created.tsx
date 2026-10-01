import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  Check,
  ShieldCheck,
  ArrowRight,
  Mail,
  Send,
  RotateCw,
  Building2,
  Briefcase,
  IdCard,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react-native";
import { apiResendInvitation, getApiErrorMessage } from "../../src/api/employee.api";

export default function EmployeeCreatedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [copiedId, setCopiedId] = useState(false);
  const [resending, setResending] = useState(false);

  const result = params.result
    ? JSON.parse(params.result as string)
    : {
        id: "",
        fullname: "Rahul Patil",
        email: "rahul.patil@muni.gov.in",
        employeeId: "EMP-0007",
        department: "Water Department",
        role: "Engineer",
        emailSent: true,
        cadreUnit: "Central Division",
        accessLevel: "Field Supervisor",
      };

  const [emailDelivered, setEmailDelivered] = useState<boolean>(Boolean(result.emailSent));

  const initials = result.fullname
    ? result.fullname
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "EP";

  const handleCopyId = () => {
    setCopiedId(true);
    Alert.alert("Employee ID Copied", `${result.employeeId} has been copied.`);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleResend = async () => {
    if (!result.id) {
      Alert.alert(
        "Notice",
        "Employee reference is unavailable. Please locate the employee in the directory to resend the invitation."
      );
      return;
    }

    try {
      setResending(true);
      const res = await apiResendInvitation(result.id);
      if (res.success && res.data?.emailSent) {
        setEmailDelivered(true);
        Alert.alert(
          "Invitation Resent",
          `A new secure 24-hour activation email has been delivered to ${result.email || "the employee"}. Any previous link has been invalidated.`
        );
      } else {
        Alert.alert(
          "Invitation Generated",
          `A fresh activation token was generated, but email delivery is pending or failed. Please check SMTP settings.`
        );
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to resend invitation email.");
      Alert.alert("Resend Failed", msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Success Icon */}
        <View style={styles.topIconSection}>
          <View style={styles.iconGlowOuter}>
            <View style={styles.iconCircle}>
              <Check size={36} color="#ffffff" strokeWidth={3} />
            </View>
          </View>

          {/* System Badge */}
          <View style={styles.sysBadge}>
            <ShieldCheck size={13} color="#0f766e" strokeWidth={2.2} />
            <Text style={styles.sysBadgeText}>MUNICIPAL WATER BOARD • PERSONNEL</Text>
          </View>

          {/* Title & Subtitle */}
          <Text style={styles.title}>Employee Created Successfully</Text>
          <Text style={styles.subtitle}>
            The official employee record has been registered. The account is awaiting initial password creation and activation.
          </Text>
        </View>

        {/* ──────── Employee Summary Card ──────── */}
        <View style={styles.card}>
          <View style={styles.empHeaderRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>

            <View style={styles.empDetailsCol}>
              <View style={styles.nameRow}>
                <Text style={styles.empName}>{result.fullname}</Text>
                <View style={styles.pendingBadge}>
                  <View style={styles.amberDot} />
                  <Text style={styles.pendingBadgeText}>Pending Activation</Text>
                </View>
              </View>
              <Text style={styles.empRoleDept}>
                {result.role} • {result.department}
              </Text>
            </View>
          </View>

          {/* Generated Employee ID Box */}
          <View style={styles.idBox}>
            <View>
              <Text style={styles.idLabel}>Generated Employee ID</Text>
              <Text style={styles.idValue}>{result.employeeId}</Text>
            </View>
            <Pressable
              style={[styles.copyIdBtn, copiedId && styles.copyIdBtnSuccess]}
              onPress={handleCopyId}
            >
              <Check size={14} color={copiedId ? "#059669" : "#0649aa"} strokeWidth={2.5} />
              <Text
                style={[
                  styles.copyIdBtnText,
                  copiedId && { color: "#059669" },
                ]}
              >
                {copiedId ? "Copied" : "Copy ID"}
              </Text>
            </Pressable>
          </View>

          {/* 2-Column: Cadre Unit & Access Level */}
          <View style={styles.twoColRow}>
            <View style={styles.colCard}>
              <Text style={styles.colLabel}>Office / Cadre</Text>
              <Text style={styles.colValue}>{result.cadreUnit || "Municipal HQ"}</Text>
            </View>

            <View style={styles.colCard}>
              <Text style={styles.colLabel}>Assigned Role</Text>
              <Text style={styles.colValue}>{result.role}</Text>
            </View>
          </View>
        </View>

        {/* ──────── Activation Invitation Card (Zero Exposure) ──────── */}
        <View style={styles.card}>
          <View style={styles.linkCardHeader}>
            <Mail size={18} color="#0649aa" strokeWidth={2.2} />
            <Text style={styles.linkCardTitle}>Employee Invitation Status</Text>
          </View>

          <View style={[styles.statusBox, emailDelivered ? styles.statusBoxSuccess : styles.statusBoxPending]}>
            <View style={styles.statusBoxRow}>
              {emailDelivered ? (
                <CheckCircle2 size={18} color="#059669" strokeWidth={2} />
              ) : (
                <Clock size={18} color="#b45309" strokeWidth={2} />
              )}
              <Text style={[styles.statusBoxTitle, emailDelivered ? styles.statusTextSuccess : styles.statusTextPending]}>
                {emailDelivered ? "Activation Email Delivered" : "Email Delivery Pending / Failed"}
              </Text>
            </View>
            <Text style={styles.statusBoxDesc}>
              {emailDelivered
                ? `An official activation email with a single-use 24-hour activation link was dispatched to ${result.email || "the employee"}. The employee must click the button to set their password.`
                : `The account record is saved in a retryable state. Email delivery is pending or failed. You can resend the invitation below at any time.`}
            </Text>
          </View>

          {/* Resend Action Button */}
          <Pressable
            style={[styles.resendBtn, resending && styles.resendBtnDisabled]}
            onPress={handleResend}
            disabled={resending}
          >
            {resending ? (
              <ActivityIndicator size="small" color="#0649aa" />
            ) : (
              <RotateCw size={15} color="#0649aa" strokeWidth={2} />
            )}
            <Text style={styles.resendBtnText}>
              {resending ? "Dispatching Invitation…" : "Resend Activation Email"}
            </Text>
          </Pressable>

          {/* Zero Exposure Security Notice */}
          <View style={styles.policyBox}>
            <ShieldCheck size={16} color="#0d9488" strokeWidth={2} />
            <Text style={styles.policyText}>
              Zero Exposure Policy: For security, activation tokens are never revealed to administrators. Only the recipient can access their single-use link.
            </Text>
          </View>
        </View>

        {/* ──────── Action Buttons ──────── */}
        <View style={styles.actionsBox}>
          <Pressable
            style={styles.doneBtn}
            onPress={() => router.replace("/(admin)/employees" as any)}
          >
            <Text style={styles.doneBtnText}>Done (Back to Employee Directory)</Text>
            <ArrowRight size={16} color="#ffffff" strokeWidth={2} />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.govFooter}>
          <ShieldCheck size={14} color="#059669" strokeWidth={2} />
          <Text style={styles.govFooterText}>
            Ministry of Jal Shakti • Govt. of India Initiative
          </Text>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  topIconSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconGlowOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ccfbf1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#0f766e",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  sysBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  sysBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#0f766e",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  empHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0649aa",
  },
  empDetailsCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  empName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  pendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  amberDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d97706",
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#b45309",
  },
  empRoleDept: {
    fontSize: 12,
    color: "#64748b",
  },
  idBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  idValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0649aa",
    letterSpacing: 0.5,
  },
  copyIdBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyIdBtnSuccess: {
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
  },
  copyIdBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0649aa",
  },
  twoColRow: {
    flexDirection: "row",
    gap: 10,
  },
  colCard: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 10,
    padding: 10,
  },
  colLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
    marginBottom: 2,
  },
  colValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },
  linkCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  linkCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  statusBox: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
  },
  statusBoxSuccess: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  statusBoxPending: {
    backgroundColor: "#fffbeb",
    borderColor: "#fde68a",
  },
  statusBoxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  statusBoxTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  statusTextSuccess: {
    color: "#15803d",
  },
  statusTextPending: {
    color: "#b45309",
  },
  statusBoxDesc: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 16,
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 14,
  },
  resendBtnDisabled: {
    opacity: 0.6,
  },
  resendBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0649aa",
  },
  policyBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#f0fdfa",
    borderWidth: 1,
    borderColor: "#ccfbf1",
    borderRadius: 10,
    padding: 10,
  },
  policyText: {
    flex: 1,
    fontSize: 11,
    color: "#0f766e",
    lineHeight: 15,
  },
  actionsBox: {
    marginBottom: 16,
  },
  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0649aa",
    borderRadius: 12,
    paddingVertical: 14,
  },
  doneBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  govFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  govFooterText: {
    fontSize: 11,
    color: "#059669",
    fontWeight: "600",
  },
});
