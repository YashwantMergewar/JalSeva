import { Droplets, House, Trash2 } from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type WelcomeScreenProps = {
  onLogin: () => void;
  onContinueAsGuest: () => void;
};

export default function WelcomeScreen({
  onLogin,
  onContinueAsGuest,
}: WelcomeScreenProps) {
  const { width } = useWindowDimensions();
  const compact = width < 420;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.containerContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.illustration, compact && styles.illustrationCompact]}
        >
          <View style={[styles.phone, compact && styles.phoneCompact]}>
            <View style={styles.phoneNotch} />
            <View style={styles.drop}>
              <Droplets size={74} color="#ffffff" strokeWidth={1.8} />
            </View>
            <Text
              style={[styles.phoneTitle, compact && styles.phoneTitleCompact]}
            >
              JAL SEVA
            </Text>
            <Text style={styles.phoneSubtitle}>
              स्वागत है! स्वच्छ जल, जिम्मेदारी
            </Text>
          </View>
          <View style={styles.waveOne} />
          <View style={styles.waveTwo} />
          <View style={styles.city}>
            <View style={[styles.building, { height: 58 }]} />
            <View style={[styles.building, { height: 82 }]} />
            <View style={[styles.building, { height: 45 }]} />
          </View>
        </View>

        <View style={styles.content}>
          <View
            style={[styles.logoCircle, compact && styles.logoCircleCompact]}
          >
            <Droplets size={42} color="#ffffff" strokeWidth={1.8} />
          </View>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            Welcome to Jal Seva
          </Text>
          <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
            Manage your water supply and{`\n`}sanitation services with ease.
          </Text>

          <View
            style={[styles.serviceRow, compact && styles.serviceRowCompact]}
          >
            <Pressable
              style={[styles.serviceCard, compact && styles.serviceCardCompact]}
              onPress={onContinueAsGuest}
            >
              <View
                style={[styles.waterIcon, compact && styles.serviceIconCompact]}
              >
                <House size={32} color="#ffffff" strokeWidth={1.8} />
              </View>
              <Text
                style={[
                  styles.serviceText,
                  compact && styles.serviceTextCompact,
                ]}
              >
                Water{`\n`}Services
              </Text>
            </Pressable>
            <Pressable
              style={[styles.serviceCard, compact && styles.serviceCardCompact]}
              onPress={onContinueAsGuest}
            >
              <View
                style={[
                  styles.sanitationIcon,
                  compact && styles.serviceIconCompact,
                ]}
              >
                <Trash2 size={32} color="#006b5f" strokeWidth={1.8} />
              </View>
              <Text
                style={[
                  styles.serviceText,
                  compact && styles.serviceTextCompact,
                ]}
              >
                Sanitation{`\n`}Services
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={[styles.actions, compact && styles.actionsCompact]}>
          <Pressable
            accessibilityRole="button"
            style={styles.loginButton}
            onPress={onLogin}
          >
            <Text
              style={[
                styles.loginButtonText,
                compact && styles.actionTextCompact,
              ]}
            >
              Login / Register
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.guestButton}
            onPress={onContinueAsGuest}
          >
            <Text
              style={[styles.guestText, compact && styles.guestTextCompact]}
            >
              Continue as Guest
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fbf9f8" },
  container: { flex: 1, backgroundColor: "#fbf9f8" },
  containerContent: { alignItems: "center", paddingBottom: 24 },
  illustration: {
    width: "100%",
    height: 300,
    backgroundColor: "#e9f8fb",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  illustrationCompact: { height: 220 },
  phone: {
    width: 190,
    height: 270,
    borderRadius: 28,
    borderWidth: 9,
    borderColor: "#ffffff",
    backgroundColor: "#d9f5fb",
    alignItems: "center",
    paddingTop: 38,
    zIndex: 2,
  },
  phoneCompact: {
    width: 142,
    height: 205,
    borderRadius: 22,
    borderWidth: 7,
    paddingTop: 26,
  },
  phoneNotch: {
    position: "absolute",
    top: 3,
    width: 72,
    height: 18,
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },
  drop: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#8fe8ef",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  phoneTitle: {
    color: "#7eafc0",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },
  phoneTitleCompact: { fontSize: 13, marginTop: 8 },
  phoneSubtitle: { color: "#9ac6ce", fontSize: 10, marginTop: 8 },
  waveOne: {
    position: "absolute",
    bottom: -32,
    left: -50,
    width: 480,
    height: 110,
    borderRadius: 100,
    backgroundColor: "#b9eef1",
    transform: [{ rotate: "-8deg" }],
  },
  waveTwo: {
    position: "absolute",
    bottom: -52,
    left: -40,
    width: 470,
    height: 90,
    borderRadius: 80,
    backgroundColor: "#ffffff",
    transform: [{ rotate: "8deg" }],
  },
  city: {
    position: "absolute",
    bottom: 34,
    left: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  building: { width: 25, backgroundColor: "#addfe6", borderRadius: 3 },
  content: { alignItems: "center", width: "100%", paddingTop: 22 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -62,
    borderWidth: 3,
    borderColor: "#fbf9f8",
  },
  logoCircleCompact: {
    width: 76,
    height: 76,
    borderRadius: 38,
    marginTop: -45,
  },
  title: {
    color: "#0649aa",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 16,
    textAlign: "center",
  },
  titleCompact: { fontSize: 23, marginTop: 12 },
  subtitle: {
    color: "#3f4350",
    fontSize: 17,
    lineHeight: 25,
    textAlign: "center",
    marginTop: 10,
  },
  subtitleCompact: { fontSize: 15, lineHeight: 22 },
  serviceRow: { flexDirection: "row", gap: 18, width: "92%", marginTop: 26 },
  serviceRowCompact: { gap: 10, width: "94%", marginTop: 22 },
  serviceCard: {
    flex: 1,
    height: 220,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#c3c6d6",
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 26,
  },
  serviceCardCompact: { height: 170, borderRadius: 14, paddingTop: 18 },
  waterIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#075ad5",
    alignItems: "center",
    justifyContent: "center",
  },
  sanitationIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#8df1e0",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceIconCompact: { width: 58, height: 58, borderRadius: 29 },
  serviceText: {
    color: "#111111",
    fontSize: 21,
    lineHeight: 29,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 18,
  },
  serviceTextCompact: { fontSize: 17, lineHeight: 24, marginTop: 12 },
  actions: { width: "92%", paddingTop: 32, alignItems: "center" },
  actionsCompact: { paddingTop: 26 },
  loginButton: {
    width: "100%",
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: { color: "#ffffff", fontSize: 20, fontWeight: "600" },
  actionTextCompact: { fontSize: 18 },
  guestButton: {
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  guestText: { color: "#0649aa", fontSize: 18, fontWeight: "500" },
  guestTextCompact: { fontSize: 16 },
});
