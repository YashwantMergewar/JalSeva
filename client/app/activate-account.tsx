import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Droplets,
  User,
  Briefcase,
  Building2,
  IdCard,
  XCircle,
} from "lucide-react-native";
import {
  apiVerifyActivationToken,
  apiActivateAccount,
  VerifyTokenResponseData,
  getApiErrorMessage,
} from "../src/api/employee.api";

type TokenState =
  | { status: "loading" }
  | { status: "valid"; info: VerifyTokenResponseData }
  | { status: "invalid"; message: string }
  | { status: "expired"; message: string }
  | { status: "used"; message: string };

const PASSWORD_RULES = [
  { id: "len", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { id: "digit", label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function ActivateAccountScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [tokenState, setTokenState] = useState<TokenState>({ status: "loading" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const verifyToken = useCallback(async (rawToken: string) => {
    setTokenState({ status: "loading" });
    try {
      const res = await apiVerifyActivationToken(rawToken);
      if (res.success && res.data) {
        setTokenState({ status: "valid", info: res.data });
      } else {
        setTokenState({ status: "invalid", message: res.message || "Invalid activation link." });
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to verify activation link.");
      if (msg.toLowerCase().includes("expired")) {
        setTokenState({ status: "expired", message: msg });
      } else if (msg.toLowerCase().includes("already been used") || msg.toLowerCase().includes("already activated")) {
        setTokenState({ status: "used", message: msg });
      } else {
        setTokenState({ status: "invalid", message: msg });
      }
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setTokenState({ status: "invalid", message: "No activation token found in this link." });
      return;
    }
    verifyToken(token);
  }, [token, verifyToken]);

  const passwordRulesMet = PASSWORD_RULES.map((r) => ({
    ...r,
    met: r.test(password),
  }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!confirmPassword) errs.confirm = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleActivate = async () => {
    if (!validate() || !token) return;
    try {
      setSubmitting(true);
      const res = await apiActivateAccount({ token, password });
      if (res.success && res.data) {
        router.replace({
          pathname: "/activation-success" as any,
          params: {
            result: JSON.stringify({
              employeeId: res.data.employeeId,
              fullname: res.data.fullname,
              email: res.data.email,
              role: res.data.role?.name ?? "N/A",
              department: res.data.department?.name ?? "N/A",
            }),
          },
        });
      } else {
        setErrors({ submit: res.message || "Activation failed. Please try again." });
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, "Activation failed. Please try again.");
      if (msg.toLowerCase().includes("expired")) {
        setTokenState({ status: "expired", message: msg });
      } else if (msg.toLowerCase().includes("already been used") || msg.toLowerCase().includes("already activated")) {
        setTokenState({ status: "used", message: msg });
      } else {
        setErrors({ submit: msg });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Token loading state ──
  if (tokenState.status === "loading") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0649aa" />
          <Text style={styles.loadingText}>Verifying activation link…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error states ──
  if (
    tokenState.status === "invalid" ||
    tokenState.status === "expired" ||
    tokenState.status === "used"
  ) {
    const isExpired = tokenState.status === "expired";
    const isUsed = tokenState.status === "used";
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.centeredScroll}>
          <View style={[styles.errorCircle, isExpired && styles.expiredCircle]}>
            {isUsed ? (
              <CheckCircle2 size={40} color="#ffffff" strokeWidth={2.5} />
            ) : (
              <XCircle size={40} color="#ffffff" strokeWidth={2.5} />
            )}
          </View>

          <View style={styles.sysBadgeRow}>
            <Droplets size={13} color="#0649aa" strokeWidth={2} />
            <Text style={styles.sysBadgeText}>JAL SEVA • ACCOUNT ACTIVATION</Text>
          </View>

          <Text style={styles.errorTitle}>
            {isExpired
              ? "Activation Link Expired"
              : isUsed
              ? "Already Activated"
              : "Invalid Activation Link"}
          </Text>

          <Text style={styles.errorMessage}>{tokenState.message}</Text>

          {isExpired && (
            <View style={styles.helpBox}>
              <AlertCircle size={16} color="#92400e" strokeWidth={2} />
              <Text style={styles.helpText}>
                Activation links are valid for 24 hours. Please contact your administrator to
                resend the invitation.
              </Text>
            </View>
          )}

          {isUsed && (
            <View style={[styles.helpBox, styles.successBox]}>
              <CheckCircle2 size={16} color="#065f46" strokeWidth={2} />
              <Text style={[styles.helpText, { color: "#065f46" }]}>
                Your account is already active. You can log in directly.
              </Text>
            </View>
          )}

          <Pressable style={styles.loginBtn} onPress={() => router.replace("/login" as any)}>
            <Text style={styles.loginBtnText}>Go to Employee Login</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Valid token: show activation form ──
  const info = tokenState.info;
  const initials = info.fullname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.topSection}>
            <View style={styles.logoWrap}>
              <Droplets size={28} color="#0649aa" strokeWidth={2.2} />
            </View>
            <View style={styles.sysBadgeRow}>
              <ShieldCheck size={13} color="#0649aa" strokeWidth={2} />
              <Text style={styles.sysBadgeText}>JAL SEVA • ACCOUNT ACTIVATION</Text>
            </View>
            <Text style={styles.pageTitle}>Create Your Password</Text>
            <Text style={styles.pageSubtitle}>
              Set a secure password to activate your official municipal account.
            </Text>
          </View>

          {/* Employee Info Card */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{info.fullname}</Text>
                <Text style={styles.profileSub}>
                  {info.role?.name ?? "Employee"} • {info.department?.name ?? ""}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <IdCard size={14} color="#0649aa" strokeWidth={1.8} />
                <View>
                  <Text style={styles.detailLabel}>Employee ID</Text>
                  <Text style={styles.detailValue}>{info.employeeId ?? "Pending"}</Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Building2 size={14} color="#0649aa" strokeWidth={1.8} />
                <View>
                  <Text style={styles.detailLabel}>Department</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {info.department?.name ?? "N/A"}
                  </Text>
                </View>
              </View>

              <View style={styles.detailItem}>
                <Briefcase size={14} color="#0649aa" strokeWidth={1.8} />
                <View>
                  <Text style={styles.detailLabel}>Role</Text>
                  <Text style={styles.detailValue}>{info.role?.name ?? "N/A"}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Password Form Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Lock size={18} color="#0649aa" strokeWidth={2} />
              <Text style={styles.cardTitle}>Create Secure Password</Text>
            </View>

            {/* New Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                New Password <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputBox, errors.password && styles.inputError]}>
                <Lock size={16} color="#64748b" strokeWidth={1.8} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(v) => {
                    setPassword(v);
                    if (errors.password) setErrors((e) => ({ ...e, password: "" }));
                  }}
                  placeholder="Enter secure password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable hitSlop={8} onPress={() => setShowPassword((s) => !s)}>
                  {showPassword ? (
                    <EyeOff size={18} color="#64748b" strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} color="#64748b" strokeWidth={1.8} />
                  )}
                </Pressable>
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Confirm Password <Text style={styles.required}>*</Text>
              </Text>
              <View style={[styles.inputBox, errors.confirm && styles.inputError]}>
                <Lock size={16} color="#64748b" strokeWidth={1.8} />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={(v) => {
                    setConfirmPassword(v);
                    if (errors.confirm) setErrors((e) => ({ ...e, confirm: "" }));
                  }}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Pressable hitSlop={8} onPress={() => setShowConfirm((s) => !s)}>
                  {showConfirm ? (
                    <EyeOff size={18} color="#64748b" strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} color="#64748b" strokeWidth={1.8} />
                  )}
                </Pressable>
              </View>
              {errors.confirm ? (
                <Text style={styles.errorText}>{errors.confirm}</Text>
              ) : null}
              {!errors.confirm && confirmPassword.length > 0 && confirmPassword === password ? (
                <View style={styles.matchRow}>
                  <CheckCircle2 size={13} color="#059669" strokeWidth={2.5} />
                  <Text style={styles.matchText}>Passwords match</Text>
                </View>
              ) : null}
            </View>

            {/* Password Requirements */}
            <View style={styles.rulesBox}>
              <Text style={styles.rulesTitle}>Password Requirements</Text>
              {passwordRulesMet.map((r) => (
                <View key={r.id} style={styles.ruleRow}>
                  {r.met ? (
                    <CheckCircle2 size={13} color="#059669" strokeWidth={2.5} />
                  ) : (
                    <View style={styles.ruleDot} />
                  )}
                  <Text style={[styles.ruleText, r.met && styles.ruleTextMet]}>{r.label}</Text>
                </View>
              ))}
            </View>

            {/* Submit Error */}
            {errors.submit ? (
              <View style={styles.submitErrorBox}>
                <AlertCircle size={16} color="#dc2626" strokeWidth={2} />
                <Text style={styles.submitErrorText}>{errors.submit}</Text>
              </View>
            ) : null}

            {/* Activate Button */}
            <Pressable
              style={[styles.activateBtn, submitting && styles.btnDisabled]}
              onPress={handleActivate}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <ShieldCheck size={18} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.activateBtnText}>Activate Account</Text>
                </>
              )}
            </Pressable>
          </View>

          {/* Security note */}
          <View style={styles.secNote}>
            <Lock size={13} color="#64748b" strokeWidth={2} />
            <Text style={styles.secNoteText}>
              Your password is encrypted and never visible to administrators.
            </Text>
          </View>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 24 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  centeredScroll: { padding: 24, alignItems: "center", paddingTop: 60 },
  loadingText: { fontSize: 14, color: "#64748b", fontWeight: "500" },

  // Error states
  errorCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#dc2626",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  expiredCircle: { backgroundColor: "#d97706" },
  errorTitle: { fontSize: 22, fontWeight: "800", color: "#0f172a", textAlign: "center", marginBottom: 10 },
  errorMessage: { fontSize: 14, color: "#475569", textAlign: "center", lineHeight: 21, marginBottom: 20, paddingHorizontal: 8 },
  helpBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fde68a",
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    width: "100%",
  },
  successBox: { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" },
  helpText: { flex: 1, fontSize: 13, color: "#92400e", lineHeight: 19 },
  loginBtn: {
    width: "100%",
    height: 48,
    backgroundColor: "#0649aa",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#0649aa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  loginBtnText: { fontSize: 14, fontWeight: "700", color: "#ffffff" },

  // Header
  topSection: { alignItems: "center", marginBottom: 24 },
  logoWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#eff6ff",
    borderWidth: 2,
    borderColor: "#bfdbfe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  sysBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#eff6ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  sysBadgeText: { fontSize: 10, fontWeight: "800", color: "#0649aa", letterSpacing: 0.5 },
  pageTitle: { fontSize: 22, fontWeight: "800", color: "#0f172a", textAlign: "center", letterSpacing: -0.3 },
  pageSubtitle: { fontSize: 13, color: "#64748b", textAlign: "center", marginTop: 6, lineHeight: 19 },

  // Cards
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 16,
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  avatarWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#ffffff" },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  profileSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  detailRow: { gap: 10 },
  detailItem: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  detailLabel: { fontSize: 10, fontWeight: "600", color: "#64748b" },
  detailValue: { fontSize: 13, fontWeight: "700", color: "#0f172a" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#0f172a" },

  // Form fields
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#0f172a", marginBottom: 6 },
  required: { color: "#dc2626" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
  },
  inputError: { borderColor: "#fca5a5", backgroundColor: "#fff5f5" },
  input: { flex: 1, fontSize: 15, color: "#0f172a" },
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 4 },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  matchText: { fontSize: 12, color: "#059669", fontWeight: "500" },

  // Password rules
  rulesBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    gap: 6,
  },
  rulesTitle: { fontSize: 11, fontWeight: "700", color: "#64748b", marginBottom: 4 },
  ruleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  ruleDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#cbd5e1" },
  ruleText: { fontSize: 12, color: "#94a3b8" },
  ruleTextMet: { color: "#059669" },

  // Submit error
  submitErrorBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  submitErrorText: { flex: 1, fontSize: 13, color: "#dc2626", lineHeight: 18 },

  // Activate button
  activateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0649aa",
    borderRadius: 10,
    height: 50,
    elevation: 2,
    shadowColor: "#0649aa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  btnDisabled: { opacity: 0.7 },
  activateBtnText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  // Security note
  secNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: -4,
    marginBottom: 8,
  },
  secNoteText: { fontSize: 11, color: "#94a3b8" },
});
