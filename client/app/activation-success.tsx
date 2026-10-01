import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  CheckCircle2,
  ShieldCheck,
  Droplets,
  ArrowRight,
  IdCard,
  Briefcase,
  Building2,
} from "lucide-react-native";

interface SuccessResult {
  employeeId: string | null;
  fullname: string;
  email: string;
  role: string;
  department: string;
}

export default function ActivationSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ result?: string }>();

  const result: SuccessResult = params.result
    ? JSON.parse(params.result)
    : {
        employeeId: "EMP-0001",
        fullname: "Employee",
        email: "employee@jalseva.gov.in",
        role: "Employee",
        department: "Water Department",
      };

  const initials = result.fullname
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.iconSection}>
          <View style={styles.glowOuter}>
            <View style={styles.iconCircle}>
              <CheckCircle2 size={40} color="#ffffff" strokeWidth={2.5} />
            </View>
          </View>

          <View style={styles.sysBadgeRow}>
            <ShieldCheck size={13} color="#0f766e" strokeWidth={2.2} />
            <Text style={styles.sysBadgeText}>ACCOUNT ACTIVATED SUCCESSFULLY</Text>
          </View>

          <Text style={styles.title}>Account Activated!</Text>
          <Text style={styles.subtitle}>
            Your Jal Seva employee account has been successfully activated.
            You can now log in and access the municipal management system.
          </Text>
        </View>

        {/* Employee Card */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{initials}</Text>
              <View style={styles.avatarBadge}>
                <CheckCircle2 size={10} color="#ffffff" strokeWidth={2.5} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{result.fullname}</Text>
              <View style={styles.activeBadge}>
                <View style={styles.greenDot} />
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailsGrid}>
            {result.employeeId && (
              <View style={styles.detailItem}>
                <IdCard size={14} color="#0649aa" strokeWidth={1.8} />
                <View>
                  <Text style={styles.detailLabel}>Employee ID</Text>
                  <Text style={[styles.detailValue, { color: "#0649aa" }]}>
                    {result.employeeId}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.detailItem}>
              <Building2 size={14} color="#0649aa" strokeWidth={1.8} />
              <View>
                <Text style={styles.detailLabel}>Department</Text>
                <Text style={styles.detailValue}>{result.department}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Briefcase size={14} color="#0649aa" strokeWidth={1.8} />
              <View>
                <Text style={styles.detailLabel}>Role</Text>
                <Text style={styles.detailValue}>{result.role}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Steps Card */}
        <View style={styles.nextCard}>
          <View style={styles.nextHeader}>
            <Droplets size={16} color="#0649aa" strokeWidth={2} />
            <Text style={styles.nextTitle}>What happens next?</Text>
          </View>
          <View style={styles.nextList}>
            {[
              "Use your registered email and the password you just created to log in.",
              "Your administrator has assigned your role and department.",
              "You can update your profile settings after logging in.",
            ].map((item, i) => (
              <View key={i} style={styles.nextItem}>
                <View style={styles.nextNumCircle}>
                  <Text style={styles.nextNum}>{i + 1}</Text>
                </View>
                <Text style={styles.nextItemText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Go to Login Button */}
        <Pressable
          style={styles.loginBtn}
          onPress={() => router.replace("/login" as any)}
        >
          <Text style={styles.loginBtnText}>Go to Employee Login</Text>
          <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
        </Pressable>

        {/* Footer */}
        <View style={styles.footer}>
          <ShieldCheck size={13} color="#059669" strokeWidth={2} />
          <Text style={styles.footerText}>
            Ministry of Jal Shakti • Govt. of India Initiative
          </Text>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { paddingHorizontal: 16, paddingTop: 32 },

  iconSection: { alignItems: "center", marginBottom: 24 },
  glowOuter: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#ccfbf1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#0f766e",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#0f766e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  sysBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  sysBadgeText: { fontSize: 10, fontWeight: "800", color: "#0f766e", letterSpacing: 0.4 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 12,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 14,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  avatarWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#ffffff" },
  avatarBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0f766e",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontWeight: "800", color: "#0f172a", marginBottom: 4 },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#dcfce7",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  greenDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#16a34a" },
  activeBadgeText: { fontSize: 11, fontWeight: "700", color: "#15803d" },

  detailsGrid: { gap: 8 },
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

  nextCard: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  nextHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  nextTitle: { fontSize: 14, fontWeight: "700", color: "#1e3a8a" },
  nextList: { gap: 10 },
  nextItem: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  nextNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  nextNum: { fontSize: 11, fontWeight: "800", color: "#ffffff" },
  nextItemText: { flex: 1, fontSize: 13, color: "#1e40af", lineHeight: 19 },

  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0649aa",
    borderRadius: 12,
    height: 52,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#0649aa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loginBtnText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  footerText: { fontSize: 11, fontWeight: "600", color: "#059669" },
});
