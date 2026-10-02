import { CheckCircle, ArrowRight, ShieldCheck } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RegistrationSuccessScreenProps = {
  onContinueLogin: () => void;
};

export default function RegistrationSuccessScreen({
  onContinueLogin,
}: RegistrationSuccessScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.container}>
        {/* ── Success card ── */}
        <View style={styles.card}>
          {/* Green check circle */}
          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <CheckCircle size={52} color="#0a7868" strokeWidth={1.8} />
            </View>
          </View>

          <Text style={styles.title}>Account Created{"\n"}Successfully!</Text>

          <Text style={styles.subtitle}>
            Welcome to Jal Seva. You can now access all municipal services
            securely and manage your civic duties.
          </Text>

          {/* ── Continue Login button ── */}
          <Pressable
            style={({ pressed }) => [
              styles.continueBtn,
              pressed && styles.continueBtnPressed,
            ]}
            onPress={onContinueLogin}
            accessibilityRole="button"
            accessibilityLabel="Continue Login"
          >
            <Text style={styles.continueBtnText}>Continue Login</Text>
            <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
          </Pressable>
        </View>

        {/* ── Security footnote ── */}
        <View style={styles.footnote}>
          <ShieldCheck size={14} color="#687080" strokeWidth={1.8} />
          <Text style={styles.footnoteText}>
            Secured by Government of India Infrastructure
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0efea" },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  /* card */
  card: {
    width: "100%",
    backgroundColor: "#f9f8f3",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  /* icon */
  iconWrap: { marginBottom: 24 },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#9ef0d8",
    alignItems: "center",
    justifyContent: "center",
  },

  /* text */
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: "#3f4350",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 14,
    paddingHorizontal: 6,
  },

  /* button */
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    height: 54,
    borderRadius: 30,
    backgroundColor: "#0a2d7a",
    marginTop: 30,
  },
  continueBtnPressed: { opacity: 0.85 },
  continueBtnText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },

  /* footnote */
  footnote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 26,
  },
  footnoteText: {
    color: "#687080",
    fontSize: 13,
  },
});
