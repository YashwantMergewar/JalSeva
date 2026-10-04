import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  CalendarDays,
  Droplet,
  Briefcase,
  AlertTriangle,
  FlaskConical,
  Info,
  Waves,
  Network,
  Home,
  ArrowDown,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import { mockServiceAnnouncement } from "../services/waterSchedule.service";

export default function CitizenHomeScreen() {
  const router = useRouter();
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Water Department" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Welcome Banner ── */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeTextGroup}>
            <Text style={styles.welcomeTitle}>Welcome to Jal Seva</Text>
            <Text style={styles.welcomeSubtitle}>
              Your portal for all municipal water services. Manage connections,
              view schedules, and track requests efficiently.
            </Text>
          </View>
          <View style={styles.welcomeDecor}>
            <Droplet size={88} color="rgba(255, 255, 255, 0.15)" strokeWidth={1.5} />
          </View>
        </View>

        {/* ── Water Supply Journey Card ── */}
        <View style={styles.journeyCard}>
          <Text style={styles.journeySectionTitle}>WATER SUPPLY JOURNEY</Text>

          <View style={styles.journeyList}>
            {/* Stage 1: Source */}
            <View style={styles.journeyStep}>
              <View style={[styles.stepCircle, { backgroundColor: "#dbeafe" }]}>
                <Waves size={24} color="#0040a1" strokeWidth={2} />
              </View>
              <Text style={styles.stepTitle}>Source</Text>
              <Text style={styles.stepSubtitle}>Pus Dam</Text>
            </View>

            <View style={styles.arrowWrap}>
              <ArrowDown size={18} color="#94a3b8" strokeWidth={2} />
            </View>

            {/* Stage 2: Treatment */}
            <View style={styles.journeyStep}>
              <View style={[styles.stepCircle, { backgroundColor: "#dcfce7" }]}>
                <FlaskConical size={24} color="#006b5f" strokeWidth={2} />
              </View>
              <Text style={styles.stepTitle}>Treatment</Text>
              <Text style={styles.stepSubtitle}>Filtration</Text>
            </View>

            <View style={styles.arrowWrap}>
              <ArrowDown size={18} color="#94a3b8" strokeWidth={2} />
            </View>

            {/* Stage 3: Distribution */}
            <View style={styles.journeyStep}>
              <View style={[styles.stepCircle, { backgroundColor: "#e0e7ff" }]}>
                <Network size={24} color="#3730a3" strokeWidth={2} />
              </View>
              <Text style={styles.stepTitle}>Distribution</Text>
              <Text style={styles.stepSubtitle}>Network</Text>
            </View>

            <View style={styles.arrowWrap}>
              <ArrowDown size={18} color="#94a3b8" strokeWidth={2} />
            </View>

            {/* Stage 4: Consumer */}
            <View style={styles.journeyStep}>
              <View style={[styles.stepCircle, { backgroundColor: "#f1f5f9" }]}>
                <Home size={24} color="#0f172a" strokeWidth={2} />
              </View>
              <Text style={styles.stepTitle}>Consumer</Text>
              <Text style={styles.stepSubtitle}>Citizens</Text>
            </View>
          </View>
        </View>

        {/* ── Quick Actions ── */}
        <Text style={styles.sectionHeading}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          {/* Action 1: Water Schedule */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.cardPressed]}
            onPress={() => router.push("/(citizen)/schedule" as any)}
            accessibilityRole="button"
            accessibilityLabel="Water Schedule"
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#eff6ff" }]}>
              <CalendarDays size={24} color="#0056d2" strokeWidth={1.8} />
            </View>
            <Text style={styles.actionLabel}>Water Schedule</Text>
          </Pressable>

          {/* Action 2: Water Connection */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.cardPressed]}
            onPress={() => router.push("/(citizen)/my-connection" as any)}
            accessibilityRole="button"
            accessibilityLabel="Water Connection"
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#eff6ff" }]}>
              <Droplet size={24} color="#0056d2" strokeWidth={1.8} />
            </View>
            <Text style={styles.actionLabel}>Water Connection</Text>
          </Pressable>

          {/* Action 3: Water Services */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.cardPressed]}
            onPress={() => router.push("/(citizen)/services" as any)}
            accessibilityRole="button"
            accessibilityLabel="Water Services"
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#eff6ff" }]}>
              <Briefcase size={24} color="#0056d2" strokeWidth={1.8} />
            </View>
            <Text style={styles.actionLabel}>Water Services</Text>
          </Pressable>

          {/* Action 4: Water Complaints */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.cardPressed]}
            onPress={() => router.push("/(citizen)/complaints" as any)}
            accessibilityRole="button"
            accessibilityLabel="Water Complaints"
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#fff1f2" }]}>
              <AlertTriangle size={24} color="#ba1a1a" strokeWidth={1.8} />
            </View>
            <Text style={styles.actionLabel}>Water Complaints</Text>
          </Pressable>

          {/* Action 5: Water Quality */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.cardPressed]}
            onPress={() =>
              router.push({
                pathname: "/(citizen)/submit-complaint" as any,
                params: { category: "Water Quality" },
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Water Quality"
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#ecfdf5" }]}>
              <FlaskConical size={24} color="#006b5f" strokeWidth={1.8} />
            </View>
            <Text style={styles.actionLabel}>Water Quality</Text>
          </Pressable>

          {/* Action 6: Water Information */}
          <Pressable
            style={({ pressed }) => [styles.actionCard, pressed && styles.cardPressed]}
            onPress={() => setShowInfoModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Water Information"
          >
            <View style={[styles.actionIconBox, { backgroundColor: "#eff6ff" }]}>
              <Info size={24} color="#0040a1" strokeWidth={1.8} />
            </View>
            <Text style={styles.actionLabel}>Water Information</Text>
          </Pressable>
        </View>

        {/* ── Service Announcement Card ── */}
        <View style={styles.announcementCard}>
          <Text style={styles.announcementTitle}>{mockServiceAnnouncement.title}</Text>
          <Text style={styles.announcementBody}>
            {mockServiceAnnouncement.description}
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Water Information Modal ── */}
      <Modal
        visible={showInfoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <ShieldCheck size={22} color="#0040a1" />
                <Text style={styles.modalTitle}>Municipal Water System</Text>
              </View>
              <Pressable
                onPress={() => setShowInfoModal(false)}
                hitSlop={10}
                style={styles.modalCloseBtn}
              >
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.infoSectionHeader}>About Jal Seva</Text>
              <Text style={styles.infoText}>
                Jal Seva supplies clean, filtered potable water to all 15 wards across the municipality. Water is sourced directly from Pus Dam, routed through multi-stage sand filters and chlorination units, and pumped through dedicated gravity feeders.
              </Text>

              <Text style={styles.infoSectionHeader}>Daily Supply Norms</Text>
              <Text style={styles.infoText}>
                • Each ward receives approximately 1 hour of pressurized potable water daily.{"\n"}
                • Quality parameters (turbidity, TDS, residual chlorine) are sampled twice daily.{"\n"}
                • For any pressure issues or line leakages, citizens can lodge instant grievances under the Complaints section.
              </Text>

              <Pressable
                style={styles.modalActionBtn}
                onPress={() => {
                  setShowInfoModal(false);
                  router.push("/(citizen)/support" as any);
                }}
              >
                <Text style={styles.modalActionBtnText}>Visit Support & FAQs</Text>
                <ChevronRight size={16} color="#ffffff" />
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 16,
  },

  /* Welcome Banner */
  welcomeBanner: {
    backgroundColor: "#0040a1",
    borderRadius: 16,
    padding: 18,
    position: "relative",
    overflow: "hidden",
    marginBottom: 20,
    minHeight: 120,
    justifyContent: "center",
  },
  welcomeTextGroup: {
    maxWidth: "80%",
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: "#ccd8ff",
    lineHeight: 18,
    fontWeight: "400",
  },
  welcomeDecor: {
    position: "absolute",
    right: -10,
    bottom: -15,
  },

  /* Water Supply Journey */
  journeyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  journeySectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#475569",
    marginBottom: 16,
  },
  journeyList: {
    alignItems: "center",
    width: "100%",
  },
  journeyStep: {
    alignItems: "center",
  },
  stepCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  stepSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 1,
  },
  arrowWrap: {
    marginVertical: 6,
  },

  /* Quick Actions */
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  actionCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 14,
    minHeight: 108,
    justifyContent: "space-between",
  },
  cardPressed: {
    backgroundColor: "#f8fafc",
    transform: [{ scale: 0.98 }],
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },

  /* Service Announcement */
  announcementCard: {
    backgroundColor: "#f0fdf9",
    borderWidth: 1,
    borderColor: "#ccfbf1",
    borderRadius: 14,
    padding: 16,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065f46",
    marginBottom: 4,
  },
  announcementBody: {
    fontSize: 13,
    color: "#0f766e",
    lineHeight: 18,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 14,
    marginBottom: 16,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0040a1",
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 10,
  },
  infoSectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 10,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 12,
  },
  modalActionBtn: {
    backgroundColor: "#0040a1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 48,
    borderRadius: 12,
    marginTop: 14,
    marginBottom: 10,
  },
  modalActionBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
