import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Check,
  User,
  Shield,
  ArrowDown,
  UserCheck,
  Headphones,
  Settings,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";

export default function ComplaintDetailsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Municipal Water" showBack />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Summary Card (Screenshot 4 Match) ── */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <Text style={styles.complaintHeading}>Complaint #CMP-4432</Text>
            <View style={styles.assignedBadge}>
              <UserCheck size={14} color="#ffffff" strokeWidth={2} />
              <Text style={styles.assignedBadgeText}>Assigned</Text>
            </View>
          </View>

          <Text style={styles.categoryTitle}>Pipeline Leakage</Text>
          <Text style={styles.reportedMeta}>
            Reported on 12 Oct 2023 at Sector 4, MG Road.
          </Text>
        </View>

        {/* ── Tracking Progress Section (Screenshot 4 Match) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Tracking Progress</Text>
        </View>
        <View style={styles.sectionDivider} />

        <View style={styles.timelineContainer}>
          {/* Step 1: Submitted (Completed) */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.circleCompleted}>
                <Check size={14} color="#ffffff" strokeWidth={3} />
              </View>
              <View style={styles.verticalLineActive} />
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stageTitleDone}>Submitted</Text>
              <Text style={styles.stageTimestamp}>12 Oct 2023, 10:30 AM</Text>
            </View>
          </View>

          {/* Step 2: Under Review (Completed) */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.circleCompleted}>
                <Check size={14} color="#ffffff" strokeWidth={3} />
              </View>
              <View style={styles.verticalLineActive} />
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stageTitleDone}>Under Review</Text>
              <Text style={styles.stageTimestamp}>12 Oct 2023, 02:15 PM</Text>
            </View>
          </View>

          {/* Step 3: Assigned (Completed with Sub-card) */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.circleCompleted}>
                <Check size={14} color="#ffffff" strokeWidth={3} />
              </View>
              <View style={styles.verticalLineActive} />
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stageTitleDone}>Assigned</Text>
              <Text style={styles.stageTimestamp}>13 Oct 2023, 09:00 AM</Text>
              <View style={styles.dispatchSubCard}>
                <Text style={styles.dispatchSubCardText}>
                  Team Alpha dispatched to location.
                </Text>
              </View>
            </View>
          </View>

          {/* Step 4: Work in Progress (Active) */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.circleActiveOuter}>
                <View style={styles.circleActiveInner} />
              </View>
              <View style={styles.verticalLinePending} />
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stageTitleActive}>Work in Progress</Text>
              <Text style={styles.stageTimestamp}>
                Expected completion: 14 Oct 2023
              </Text>
            </View>
          </View>

          {/* Step 5: Resolved (Pending) */}
          <View style={styles.timelineRow}>
            <View style={styles.timelineIconCol}>
              <View style={styles.circlePending} />
            </View>
            <View style={styles.timelineTextCol}>
              <Text style={styles.stageTitlePending}>Resolved</Text>
              <Text style={styles.stageTimestampPending}>
                Pending confirmation.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Escalation Hierarchy (Screenshot 4 Match) ── */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Escalation Hierarchy</Text>
        </View>

        <View style={styles.escalationList}>
          {/* Level 1: Clerk */}
          <View style={styles.levelCard}>
            <View style={styles.levelTag}>
              <Text style={styles.levelTagText}>Level 1</Text>
            </View>
            <View style={styles.levelIconCircle}>
              <Headphones size={22} color="#475569" strokeWidth={1.8} />
            </View>
            <Text style={styles.levelRoleTitle}>Clerk</Text>
            <Text style={styles.levelRoleSubtitle}>Initial Triage</Text>
          </View>

          <View style={styles.arrowWrap}>
            <ArrowDown size={18} color="#0056d2" strokeWidth={2} />
          </View>

          {/* Level 2: Engineer (Active) */}
          <View style={[styles.levelCard, styles.levelCardActive]}>
            <View style={[styles.levelTag, styles.levelTagActive]}>
              <Text style={styles.levelTagTextActive}>Level 2 (Active)</Text>
            </View>
            <View style={[styles.levelIconCircle, styles.levelIconCircleActive]}>
              <Settings size={22} color="#ffffff" strokeWidth={2} />
            </View>
            <Text style={styles.levelRoleTitle}>Engineer</Text>
            <Text style={styles.levelRoleSubtitle}>Field Resolution</Text>
          </View>

          <View style={styles.arrowWrap}>
            <ArrowDown size={18} color="#94a3b8" strokeWidth={2} />
          </View>

          {/* Level 3: Chief Officer */}
          <View style={styles.levelCard}>
            <View style={styles.levelTag}>
              <Text style={styles.levelTagText}>Level 3</Text>
            </View>
            <View style={styles.levelIconCircle}>
              <Shield size={22} color="#475569" strokeWidth={1.8} />
            </View>
            <Text style={styles.levelRoleTitle}>Chief Officer</Text>
            <Text style={styles.levelRoleSubtitle}>Oversight</Text>
          </View>
        </View>

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

  /* Top Summary Card */
  summaryCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  complaintHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  assignedBadge: {
    backgroundColor: "#0056d2",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  assignedBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  categoryTitle: {
    fontSize: 14,
    color: "#0f172a",
    marginBottom: 6,
  },
  reportedMeta: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },

  /* Section Header */
  sectionHeaderRow: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 16,
  },

  /* Timeline */
  timelineContainer: {
    paddingLeft: 4,
    marginBottom: 24,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 52,
  },
  timelineIconCol: {
    width: 28,
    alignItems: "center",
    marginRight: 14,
  },
  circleCompleted: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
  },
  circleActiveOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: "#0040a1",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  circleActiveInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0040a1",
  },
  circlePending: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
  },
  verticalLineActive: {
    width: 2,
    flex: 1,
    backgroundColor: "#0040a1",
    marginVertical: 3,
  },
  verticalLinePending: {
    width: 2,
    flex: 1,
    backgroundColor: "#cbd5e1",
    marginVertical: 3,
  },
  timelineTextCol: {
    flex: 1,
    paddingBottom: 16,
  },
  stageTitleDone: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  stageTitleActive: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0040a1",
  },
  stageTitlePending: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
  },
  stageTimestamp: {
    fontSize: 12,
    color: "#475569",
    marginTop: 2,
  },
  stageTimestampPending: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  dispatchSubCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 6,
    alignSelf: "flex-start",
  },
  dispatchSubCardText: {
    fontSize: 12,
    color: "#334155",
  },

  /* Escalation Hierarchy */
  escalationList: {
    gap: 4,
    marginTop: 8,
  },
  levelCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    position: "relative",
  },
  levelCardActive: {
    backgroundColor: "#f0f7ff",
    borderColor: "#bfdbfe",
    borderWidth: 1.5,
  },
  levelTag: {
    position: "absolute",
    top: -12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  levelTagActive: {
    backgroundColor: "#dbeafe",
    borderColor: "#93c5fd",
  },
  levelTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  levelTagTextActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0040a1",
  },
  levelIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    marginTop: 4,
  },
  levelIconCircleActive: {
    backgroundColor: "#0040a1",
  },
  levelRoleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  levelRoleSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  arrowWrap: {
    alignItems: "center",
    marginVertical: 4,
  },
});
