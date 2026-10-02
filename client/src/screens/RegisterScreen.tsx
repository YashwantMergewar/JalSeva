import {
  ArrowLeft,
  EyeOff,
  Eye,
  Landmark,
} from "lucide-react-native";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { getApiErrorMessage } from "../api";
import {
  citizenRegistrationSchema,
  type RegistrationFormValues as RegistrationValues,
} from "../validation";
import { useAuth } from "../context/AuthContext";

type RegisterScreenProps = {
  onBack: () => void;
  onRegister: () => void;
  onLogin: () => void;
};

type Field = keyof RegistrationValues;
const initialValues: RegistrationValues = {
  fullname: "",
  email: "",
  mobile_no: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterScreen({
  onBack,
  onRegister,
  onLogin,
}: RegisterScreenProps) {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [values, setValues] = useState<RegistrationValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field: Field, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError("");
  };

  const submit = async () => {
    const parsed = citizenRegistrationSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((issue) => [issue.path[0], issue.message])
        )
      );
      return;
    }
    setApiError("");
    setSubmitting(true);
    try {
      await register(parsed.data);
      onRegister();
    } catch (error) {
      setApiError(
        getApiErrorMessage(
          error,
          "Could not create your account. Please check your details and try again."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* ── Top header bar ── */}
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backBtn} hitSlop={8}>
            <ArrowLeft size={22} color="#0649aa" strokeWidth={1.8} />
          </Pressable>
          <View style={styles.headerBrand}>
            <Landmark size={22} color="#0649aa" strokeWidth={1.8} />
            <Text style={styles.headerTitle}>Municipal Services</Text>
          </View>
          <View style={styles.backBtn} />
        </View>

        {/* ── Scrollable form body ── */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Page title */}
          <Text style={styles.pageTitle}>Create Account</Text>
          <Text style={styles.pageSubtitle}>
            Register to manage your bills and complaints.
          </Text>

          {/* ── Personal Information ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.sectionDivider} />

            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.fullname && styles.inputInvalid]}
              value={values.fullname}
              onChangeText={(value) => update("fullname", value)}
              placeholder=""
              placeholderTextColor="#9da0aa"
            />
            {errors.fullname && <Text style={styles.errorText}>{errors.fullname}</Text>}

            <Text style={styles.label}>
              Mobile Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.mobile_no && styles.inputInvalid]}
              value={values.mobile_no}
              onChangeText={(value) => update("mobile_no", value)}
              placeholder=""
              placeholderTextColor="#9da0aa"
              keyboardType="phone-pad"
            />
            {errors.mobile_no && <Text style={styles.errorText}>{errors.mobile_no}</Text>}

            <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputInvalid]}
              value={values.email}
              onChangeText={(value) => update("email", value)}
              placeholder=""
              placeholderTextColor="#9da0aa"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* ── Security ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.sectionDivider} />

            <Text style={styles.label}>
              Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                value={values.password}
                onChangeText={(value) => update("password", value)}
                placeholder=""
                placeholderTextColor="#9da0aa"
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword((p) => !p)}
                hitSlop={8}
                style={styles.eyeBtn}
              >
                {showPassword ? (
                  <Eye size={20} color="#687080" strokeWidth={1.8} />
                ) : (
                  <EyeOff size={20} color="#687080" strokeWidth={1.8} />
                )}
              </Pressable>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <Text style={styles.label}>
              Confirm Password <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.passwordWrap}>
              <TextInput
                style={styles.passwordInput}
                value={values.confirmPassword}
                onChangeText={(value) => update("confirmPassword", value)}
                placeholder=""
                placeholderTextColor="#9da0aa"
                secureTextEntry={!showConfirm}
              />
              <Pressable
                onPress={() => setShowConfirm((p) => !p)}
                hitSlop={8}
                style={styles.eyeBtn}
              >
                {showConfirm ? (
                  <Eye size={20} color="#687080" strokeWidth={1.8} />
                ) : (
                  <EyeOff size={20} color="#687080" strokeWidth={1.8} />
                )}
              </Pressable>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* ── Service Details ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Password requirements</Text>
            <View style={styles.sectionDivider} />
            <Text style={styles.helperText}>Use at least 8 characters, including uppercase, lowercase, and a number.</Text>
          </View>

          {apiError ? <Text style={styles.apiError}>{apiError}</Text> : null}

          {/* Already have account */}
          <Text style={styles.loginLink}>
            Already have an account?{" "}
            <Text style={styles.loginLinkText} onPress={onLogin}>
              Login
            </Text>
          </Text>

          {/* Spacer so last field isn't hidden behind the fixed button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Fixed Register button at bottom ── */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.registerBtn,
              pressed && styles.registerBtnPressed,
              submitting && styles.registerBtnDisabled,
            ]}
            onPress={submit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Register"
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.registerBtnText}>Register</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f0" },
  flex: { flex: 1 },

  /* header */
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    backgroundColor: "#f5f5f0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0d8",
  },
  backBtn: { width: 36, alignItems: "flex-start" },
  headerBrand: { flexDirection: "row", alignItems: "center", gap: 7 },
  headerTitle: {
    color: "#0649aa",
    fontSize: 17,
    fontWeight: "700",
  },

  /* scroll */
  scroll: { flex: 1, backgroundColor: "#f5f5f0" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 20 },

  /* page heading */
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#3f4350",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 10,
  },

  /* section */
  section: { marginTop: 18 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#c8c8c0",
    marginBottom: 14,
  },

  /* fields */
  label: {
    fontSize: 14,
    color: "#222222",
    marginBottom: 5,
    marginTop: 10,
  },
  required: { color: "#ba1a1a" },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#b0b0a8",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    fontSize: 15,
    color: "#111111",
  },
  inputInvalid: { borderColor: "#ba1a1a" },
  errorText: { color: "#ba1a1a", fontSize: 12, marginTop: 4 },
  apiError: {
    color: "#ba1a1a",
    fontSize: 14,
    fontWeight: "500",
    backgroundColor: "#ffdad6",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    textAlign: "center",
  },
  helperText: { color: "#3f4350", fontSize: 14, lineHeight: 20 },
  textArea: {
    height: 80,
    paddingTop: 12,
  },

  /* password row */
  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#b0b0a8",
    borderRadius: 6,
    backgroundColor: "#ffffff",
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 12,
    color: "#111111",
  },
  eyeBtn: { paddingRight: 12 },

  /* login hint */
  loginLink: {
    textAlign: "center",
    fontSize: 14,
    color: "#3f4350",
    marginTop: 22,
  },
  loginLinkText: { color: "#0649aa", fontWeight: "600" },

  /* footer / register button */
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#f5f5f0",
    borderTopWidth: 1,
    borderTopColor: "#e0e0d8",
  },
  registerBtn: {
    height: 54,
    backgroundColor: "#0649aa",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  registerBtnPressed: { opacity: 0.82 },
  registerBtnDisabled: { opacity: 0.65 },
  registerBtnText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
