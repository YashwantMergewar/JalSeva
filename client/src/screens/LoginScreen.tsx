import { ArrowLeft, Landmark, EyeOff } from "lucide-react-native";
import { Image } from "expo-image";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type LoginScreenProps = { onBack: () => void; onLogin: () => void };

export default function LoginScreen({ onBack, onLogin }: LoginScreenProps) {
  const { width } = useWindowDimensions();
  const compact = width < 420;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.containerContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
    >
      <View style={styles.brand}>
        <Pressable onPress={onBack} style={styles.back}>
          <ArrowLeft color="#0649aa" size={22} strokeWidth={1.8} />
        </Pressable>
        <View style={styles.govIcon}>
          <Landmark size={27} color="#0649aa" strokeWidth={1.8} />
        </View>
        <View style={styles.brandText}>
          <Text style={[styles.gov, compact && styles.govCompact]}>GOVERNMENT OF INDIA</Text>
          <Text style={[styles.portal, compact && styles.portalCompact]}>Municipal Services Portal</Text>
        </View>
      </View>
      <Image
        accessibilityLabel="Smart City municipal services citizen login illustration"
        contentFit="cover"
        source={require("../assets/images/Login.png")}
        style={[styles.hero, compact && styles.heroCompact]}
      />
      <View style={[styles.card, compact && styles.cardCompact]}>
        <Text style={[styles.title, compact && styles.titleCompact]}>Login</Text>
        <Text style={[styles.intro, compact && styles.introCompact]}>
          Welcome back! Please enter your{`\n`}details.
        </Text>
        <Text style={[styles.label, compact && styles.labelCompact]}>Mobile number or Email</Text>
        <View style={styles.phoneInput}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile or email"
            placeholderTextColor="#9da0aa"
          />
        </View>
        <View style={[styles.passwordLabel, compact && styles.passwordLabelCompact]}>
          <Text style={[styles.label, compact && styles.labelCompact]}>Password</Text>
          <Pressable>
            <Text style={[styles.forgot, compact && styles.forgotCompact]}>Forgot Password?</Text>
          </Pressable>
        </View>
        <View style={styles.passwordInput}>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9da0aa"
          />
          <EyeOff size={25} color="#3f4350" strokeWidth={1.8} />
        </View>
        <Pressable style={[styles.primary, compact && styles.buttonCompact]} onPress={onLogin}>
          <Text style={[styles.primaryText, compact && styles.buttonTextCompact]}>Login</Text>
        </Pressable>
        <Pressable style={[styles.otp, compact && styles.buttonCompact]}>
          <Text style={[styles.otpText, compact && styles.buttonTextCompact]}>Login with OTP</Text>
        </Pressable>
        <Text style={[styles.register, compact && styles.registerCompact]}>
          New user? <Text style={styles.registerLink}>Register</Text>
        </Text>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fbf9f8" },
  keyboardAvoidingView: { flex: 1 },
  container: { flex: 1, backgroundColor: "#fbf9f8" },
  containerContent: { padding: 14, paddingBottom: 24 },
  brand: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 10 },
  back: { width: 34, height: 48, justifyContent: "center" },
  backText: { fontSize: 38, color: "#0649aa" },
  govIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: "#c3c6d6",
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { flex: 1 },
  gov: { color: "#111111", fontSize: 14, letterSpacing: 0.5 },
  govCompact: { fontSize: 12, letterSpacing: 0.2 },
  portal: { color: "#0649aa", fontSize: 21, fontWeight: "600", marginTop: 3 },
  portalCompact: { fontSize: 17, marginTop: 2 },
  hero: {
    width: "100%",
    aspectRatio: 1.02,
    borderRadius: 18,
    backgroundColor: "#dcf4f6",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#b5ccd6",
    overflow: "hidden",
  },
  heroCompact: { marginTop: 20 },
  card: {
    borderWidth: 2,
    borderColor: "#c3c6d6",
    borderRadius: 20,
    padding: 24,
    marginTop: 18,
    backgroundColor: "#fbf9f8",
  },
  cardCompact: { padding: 16, borderRadius: 14 },
  title: { color: "#111111", fontSize: 32, fontWeight: "700" },
  titleCompact: { fontSize: 28 },
  intro: {
    color: "#303543",
    fontSize: 17,
    lineHeight: 25,
    marginTop: 18,
    marginBottom: 22,
  },
  introCompact: { fontSize: 16, lineHeight: 23, marginTop: 12, marginBottom: 20 },
  label: { color: "#111111", fontSize: 16, marginBottom: 7 },
  labelCompact: { fontSize: 14 },
  phoneInput: {
    height: 58,
    borderWidth: 1.5,
    borderColor: "#687080",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  prefix: {
    fontSize: 15,
    color: "#3f4350",
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: "#687080",
    height: "100%",
    textAlignVertical: "center",
  },
  input: { flex: 1, fontSize: 16, paddingHorizontal: 14, color: "#111111" },
  passwordLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
  },
  passwordLabelCompact: { marginTop: 20 },
  forgot: { color: "#0649aa", fontSize: 15 },
  forgotCompact: { fontSize: 13 },
  passwordInput: {
    height: 58,
    borderWidth: 1.5,
    borderColor: "#687080",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 14,
  },
  primary: {
    height: 70,
    backgroundColor: "#0649aa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 26,
  },
  primaryText: { color: "#ffffff", fontSize: 21, fontWeight: "700" },
  otp: {
    height: 60,
    borderWidth: 3,
    borderColor: "#0649aa",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  otpText: { color: "#0649aa", fontSize: 20, fontWeight: "600" },
  buttonCompact: { height: 52, marginTop: 20 },
  buttonTextCompact: { fontSize: 18 },
  register: {
    color: "#303543",
    fontSize: 18,
    textAlign: "center",
    marginTop: 34,
  },
  registerCompact: { fontSize: 16, marginTop: 24 },
  registerLink: { color: "#0649aa", fontWeight: "600" },
});
