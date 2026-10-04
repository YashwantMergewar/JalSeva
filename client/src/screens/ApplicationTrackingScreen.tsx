import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Check,
  User,
  Headphones,
  RefreshCw,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import StatusBadge from "../components/StatusBadge";
import {
  connectionApplicationService,
  ConnectionApplication,
} from "../services/connectionApplication.service";

export default function ApplicationTrackingScreen() {
  const router = useRouter();
  const [application, setApplication] = useState<ConnectionApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadApplication();
  }, []);

  const loadApplication = async () => {
    try {
      const app = await connectionApplicationService.getApplication();
      setApplication(app);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelApplication = () => {
    if (!application) return;

    if (application.status === "Cancelled") {
      Alert.alert("Already Cancelled", "This application has already been cancelled.");
      return;
    }

    Alert.alert(
      "Cancel Application",
      `Are you sure you want to cancel application #${application.applicationNumber}? This action cannot be undone.`,
      [
        { text: "No, Keep Application", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            setCancelling(true);
            try {
              const success = await connectionApplicationService.cancelApplication(
                application.id
              );
              if (success) {
                await loadApplication();
                Alert.alert(
                  "Application Cancelled",
                  "Your connection application has been cancelled."
                );
              }
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CitizenHeader title="Application Tracking" showBack />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0056d2" />
        </View>
      </SafeAreaView>
    );
  }

  if (!application) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CitizenHeader title="Application Tracking" showBack />
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No active application found.</Text>
          <Pressable
            style={styles.newAppBtn}
            onPress={() => router.push("/(citizen)/new-connection" as any)}
          >
            <Text style={styles.newAppBtnText}>Apply for New Connection</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Application Tracking" showBack />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Summary Card ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.summaryTitle}>{application.type}</Text>
            <StatusBadge status={application.status} />
          </View>
          <Text style={styles.appIdText}>Application ID: #{application.applicationNumber}</Text>

          <View style={styles.divider} />

          <View style={styles.dateRow}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>Date Submitted</Text>
              <Text style={styles.dateValue}>{application.dateSubmitted}</Text>
            </View>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>Estimated Completion</Text>
              <Text style={styles.dateValue}>{application.estimatedCompletion}</Text>
            </View>
          </View>
        </View>

        {/* ── Status Tracker Card ── */}
        <View style={styles.trackerCard}>
          <Text style={styles.trackerTitle}>Status Tracker</Text>

          <View style={styles.timelineContainer}>
            {application.stages.map((stage, idx) => {
              const isLast = idx === application.stages.length - 1;
              const isCompleted = stage.status === "completed";
              const isCurrent = stage.status === "current";
              const isRejected = stage.status === "rejected";

              return (
                <View key={stage.id} style={styles.timelineItem}>
                  {/* Left Column: Icon and Vertical Line */}
                  <View style={styles.timelineLeftCol}>
                    {isCompleted ? (
                      <View style={styles.iconCircleCompleted}>
                        <Check size={14} color="#ffffff" strokeWidth={3} />
                      </View>
                    ) : isCurrent ? (
                      <View style={styles.iconCircleCurrentOuter}>
                        <View style={styles.iconCircleCurrentInner} />
                      </View>
                    ) : isRejected ? (
                      <View style={styles.iconCircleRejected}>
                        <Text style={styles.rejectedIconText}>✕</Text>
                      </View>
                    ) : (
                      <View style={styles.iconCirclePending} />
                    )}

                    {!isLast && (
                      <View
                        style={[
                          styles.verticalLine,
                          isCompleted && styles.verticalLineActive,
                        ]}
                      />
                    )}
                  </View>

                  {/* Right Column: Stage Details */}
                  <View style={styles.timelineRightCol}>
                    <Text
                      style={[
                        styles.stageTitle,
                        isCurrent && styles.stageTitleCurrent,
                        !isCompleted && !isCurrent && styles.stageTitlePending,
                      ]}
                    >
                      {stage.title}
                    </Text>

                    {stage.description ? (
                      <Text style={styles.stageDescription}>{stage.description}</Text>
                    ) : null}

                    {isCompleted && stage.completedAt ? (
                      <Text style={styles.stageTimestamp}>{stage.completedAt}</Text>
                    ) : null}

                    {isCurrent ? (
                      <Text style={styles.currentActiveLabel}>Currently Active</Text>
                    ) : null}

                    {/* Inspector sub-card for Field Visit */}
                    {isCurrent && stage.inspector ? (
                      <View style={styles.inspectorCard}>
                        <View style={styles.inspectorAvatar}>
                          <User size={22} color="#475569" strokeWidth={2} />
                        </View>
                        <View style={styles.inspectorInfo}>
                          <Text style={styles.inspectorName}>
                            {stage.inspector.name}
                          </Text>
                          <Text style={styles.inspectorContact}>
                            Contact: {stage.inspector.contact}
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Action Buttons ── */}
        <Pressable
          style={styles.contactSupportBtn}
          onPress={() => router.push("/(citizen)/support" as any)}
          accessibilityRole="button"
          accessibilityLabel="Contact Support"
        >
          <Headphones size={18} color="#ffffff" strokeWidth={2} />
          <Text style={styles.contactSupportBtnText}>Contact Support</Text>
        </Pressable>

        <Pressable
          style={[
            styles.cancelBtn,
            application.status === "Cancelled" && styles.cancelBtnDisabled,
          ]}
          onPress={handleCancelApplication}
          disabled={cancelling || application.status === "Cancelled"}
          accessibilityRole="button"
          accessibilityLabel="Cancel Application"
        >
          {cancelling ? (
            <ActivityIndicator color="#0040a1" size="small" />
          ) : (
            <Text
              style={[
                styles.cancelBtnText,
                application.status === "Cancelled" && styles.cancelBtnTextDisabled,
              ]}
            >
              {application.status === "Cancelled"
                ? "Application Cancelled"
                : "Cancel Application"}
            </Text>
          )}
        </Pressable>

        <View style={{ height: 32 }} />
      </ScrollView>
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
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 16,
  },
  newAppBtn: {
    backgroundColor: "#0056d2",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  newAppBtnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },

  /* Summary Card */
  summaryCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  appIdText: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 14,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateCol: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },

  /* Status Tracker Card */
  trackerCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  trackerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 20,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 64,
  },
  timelineLeftCol: {
    alignItems: "center",
    width: 32,
    marginRight: 12,
  },
  iconCircleCompleted: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleCurrentOuter: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  iconCircleCurrentInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0040a1",
  },
  iconCirclePending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#e2e8f0",
  },
  iconCircleRejected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectedIconText: {
    color: "#ba1a1a",
    fontSize: 13,
    fontWeight: "700",
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
  },
  verticalLineActive: {
    backgroundColor: "#0040a1",
  },
  timelineRightCol: {
    flex: 1,
    paddingBottom: 20,
  },
  stageTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  stageTitleCurrent: {
    color: "#0040a1",
  },
  stageTitlePending: {
    color: "#475569",
    fontWeight: "600",
  },
  stageDescription: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginTop: 4,
  },
  stageTimestamp: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  currentActiveLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0056d2",
    marginTop: 4,
  },
  inspectorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  inspectorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  inspectorInfo: {
    flex: 1,
  },
  inspectorName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  inspectorContact: {
    fontSize: 12,
    color: "#475569",
    marginTop: 2,
  },

  /* Buttons */
  contactSupportBtn: {
    backgroundColor: "#0040a1",
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  contactSupportBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  cancelBtn: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnDisabled: {
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  cancelBtnText: {
    color: "#0040a1",
    fontSize: 15,
    fontWeight: "600",
  },
  cancelBtnTextDisabled: {
    color: "#94a3b8",
  },
});
