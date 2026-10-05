import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AlertTriangle,
  ChevronRight,
  FileText,
  ClipboardCheck,
  CheckCircle2,
  Clock,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  employeeService,
  ServiceApplication,
  ApplicationStatus,
} from "../../src/services/employee.service";

// ─── Stage Progress ───────────────────────────────────────────────────────────
const STAGES = ["Consumer", "Plumber", "Clerk", "Engineer"] as const;
type Stage = typeof STAGES[number];

function StageProgress({
  currentStage,
  stageCompleted,
}: {
  currentStage: Stage;
  stageCompleted: number;
}) {
  return (
    <View style={prog.container}>
      {STAGES.map((stage, i) => {
        const done = i < stageCompleted;
        const active = stage === currentStage && !done;
        return (
          <React.Fragment key={stage}>
            <View style={prog.stageCol}>
              <View
                style={[
                  prog.dot,
                  done ? prog.dotDone : active ? prog.dotActive : prog.dotPending,
                ]}
              >
                {done && (
                  <CheckCircle2 size={14} color="#fff" strokeWidth={2.5} />
                )}
              </View>
              <Text
                style={[
                  prog.label,
                  done ? prog.labelDone : active ? prog.labelActive : prog.labelPending,
                ]}
              >
                {stage}
              </Text>
            </View>
            {i < STAGES.length - 1 && (
              <View style={[prog.line, done ? prog.lineDone : prog.linePending]} />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const prog = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  stageCol: { alignItems: "center", gap: 4 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: { backgroundColor: "#0040a1" },
  dotActive: { backgroundColor: "#0040a1", borderWidth: 3, borderColor: "#bfdbfe" },
  dotPending: { backgroundColor: "#e2e8f0" },
  line: { flex: 1, height: 2, marginTop: 11, marginHorizontal: 2 },
  lineDone: { backgroundColor: "#0040a1" },
  linePending: { backgroundColor: "#e2e8f0" },
  label: { fontSize: 10, fontWeight: "600" },
  labelDone: { color: "#0040a1" },
  labelActive: { color: "#0040a1" },
  labelPending: { color: "#94a3b8" },
});

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config: Record<ApplicationStatus, { bg: string; text: string; border?: string }> = {
    New: { bg: "#f1f5f9", text: "#475569" },
    "Field Visit Pending": { bg: "#dbeafe", text: "#1d4ed8" },
    "Field Visit Done": { bg: "#8df1e0", text: "#006b5f" },
    "Clerk Review": { bg: "#fef9c3", text: "#854d0e" },
    "Engineer Review": { bg: "#fee2e2", text: "#991b1b", border: "#dc2626" },
    Approved: { bg: "#dcfce7", text: "#166534" },
    Rejected: { bg: "#fee2e2", text: "#991b1b" },
    Completed: { bg: "#dcfce7", text: "#166534" },
  };
  const c = config[status] ?? { bg: "#f1f5f9", text: "#475569" };
  return (
    <View style={[sbadge.wrap, { backgroundColor: c.bg, borderColor: c.border || "transparent", borderWidth: c.border ? 1 : 0 }]}>
      <Text style={[sbadge.text, { color: c.text }]}>{status}</Text>
    </View>
  );
}
const sbadge = StyleSheet.create({
  wrap: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  text: { fontSize: 11, fontWeight: "700" },
});

// ─── Status Filter Tabs ───────────────────────────────────────────────────────
const STATUS_TABS: Array<{ label: string; value: string }> = [
  { label: "All Statuses", value: "All Statuses" },
  { label: "New (3)", value: "New" },
  { label: "Field Visit Pending", value: "Field Visit Pending" },
  { label: "Review Needed (1)", value: "Engineer Review" },
  { label: "Approved", value: "Approved" },
  { label: "Rejected", value: "Rejected" },
];

// ─── Application Card ─────────────────────────────────────────────────────────
function AppCard({
  app,
  onViewDocs,
  onReview,
  onPress,
}: {
  app: ServiceApplication;
  onViewDocs: () => void;
  onReview: () => void;
  onPress: () => void;
}) {
  const needsAction = app.status === "Engineer Review";
  return (
    <Pressable
      style={[styles.card, needsAction && styles.cardUrgent]}
      onPress={onPress}
    >
      {/* Action Required Banner */}
      {needsAction && (
        <View style={styles.actionBanner}>
          <AlertTriangle size={13} color="#fff" strokeWidth={2.5} />
          <Text style={styles.actionBannerText}>Action Required</Text>
        </View>
      )}

      {/* App ID + Status */}
      <View style={styles.cardTopRow}>
        <Text style={styles.cardId}>{app.applicationNumber}</Text>
        {!needsAction && <StatusBadge status={app.status} />}
      </View>

      {/* Type + Applicant */}
      <Text style={styles.cardType}>{app.type}</Text>
      <Text style={styles.cardApplicant}>
        {app.applicantName} · {app.zone}
      </Text>

      {/* Stage Progress */}
      <StageProgress
        currentStage={app.currentStage}
        stageCompleted={app.stageCompleted}
      />

      {/* Action Buttons */}
      <View style={styles.cardBtnRow}>
        <Pressable style={styles.docsBtn} onPress={onViewDocs}>
          <FileText size={14} color="#0040a1" strokeWidth={2} />
          <Text style={styles.docsBtnText}>View Documents</Text>
        </Pressable>
        {needsAction && (
          <Pressable style={styles.reviewBtn} onPress={onReview}>
            <ClipboardCheck size={14} color="#fff" strokeWidth={2} />
            <Text style={styles.reviewBtnText}>Review Now</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ApplicationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Statuses");
  const [applications, setApplications] = useState<ServiceApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadApps = useCallback(async () => {
    try {
      const data = await employeeService.getApplications(
        activeFilter === "All Statuses" ? undefined : activeFilter
      );
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    setLoading(true);
    loadApps();
  }, [loadApps]);

  const onRefresh = () => {
    setRefreshing(true);
    loadApps();
  };

  const totalPending = applications.filter(
    (a) => a.status !== "Approved" && a.status !== "Rejected" && a.status !== "Completed"
  ).length;

  const assignedToMe = applications.filter(
    (a) => a.status === "Engineer Review"
  ).length;

  const completedToday = applications.filter(
    (a) => a.status === "Approved" || a.status === "Completed"
  ).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Application Management</Text>
          <Text style={styles.headerSub}>Review and process service requests.</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}
      >
        {STATUS_TABS.map((tab) => (
          <Pressable
            key={tab.value}
            style={[
              styles.tabChip,
              activeFilter === tab.value && styles.tabChipActive,
              tab.value === "Engineer Review" && activeFilter !== tab.value && styles.tabChipReview,
            ]}
            onPress={() => setActiveFilter(tab.value)}
          >
            <Text
              style={[
                styles.tabChipText,
                activeFilter === tab.value && styles.tabChipTextActive,
                tab.value === "Engineer Review" && activeFilter !== tab.value && { color: "#991b1b" },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#0040a1" />
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0040a1"
            />
          }
        >
          {/* Application Cards */}
          {applications.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={40} color="#d1d5db" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No applications found</Text>
              <Text style={styles.emptySubtitle}>No applications match the selected filter.</Text>
            </View>
          ) : (
            applications.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onViewDocs={() =>
                  router.push({
                    pathname: "/(employee)/application-detail" as any,
                    params: { id: app.id, tab: "docs" },
                  })
                }
                onReview={() =>
                  router.push({
                    pathname: "/(employee)/application-detail" as any,
                    params: { id: app.id },
                  })
                }
                onPress={() =>
                  router.push({
                    pathname: "/(employee)/application-detail" as any,
                    params: { id: app.id },
                  })
                }
              />
            ))
          )}

          {/* Quick Stats Card */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Quick Stats</Text>
            <View style={styles.statsDivider} />
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Total Pending</Text>
              <Text style={[styles.statsValue, { color: "#0040a1" }]}>
                {totalPending}
              </Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Assigned to Me</Text>
              <Text style={[styles.statsValue, { color: "#dc2626" }]}>
                {assignedToMe}
              </Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Completed Today</Text>
              <Text style={[styles.statsValue, { color: "#16a34a" }]}>
                {completedToday}
              </Text>
            </View>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
  headerSub: { fontSize: 13, color: "#64748b", marginTop: 2 },

  tabScroll: {
    maxHeight: 52,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  tabContent: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
    alignItems: "center",
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  tabChipActive: {
    backgroundColor: "#0040a1",
    borderColor: "#0040a1",
  },
  tabChipReview: {
    backgroundColor: "#fff1f2",
    borderColor: "#fecaca",
  },
  tabChipText: { fontSize: 12, fontWeight: "500", color: "#64748b" },
  tabChipTextActive: { color: "#ffffff", fontWeight: "600" },

  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },

  scroll: { flex: 1 },
  scrollContent: { padding: 14 },

  emptyState: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },
  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 24,
  },

  // Application Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  cardUrgent: {
    borderColor: "#dc2626",
    borderWidth: 1.5,
  },
  actionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#dc2626",
    marginHorizontal: -14,
    marginTop: -14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 10,
  },
  actionBannerText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardId: { fontSize: 12, color: "#64748b", fontWeight: "500" },
  cardType: { fontSize: 17, fontWeight: "700", color: "#111827", marginBottom: 2 },
  cardApplicant: { fontSize: 13, color: "#64748b" },
  cardBtnRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  docsBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#0040a1",
    borderRadius: 10,
    paddingVertical: 10,
  },
  docsBtnText: { fontSize: 13, fontWeight: "600", color: "#0040a1" },
  reviewBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#0040a1",
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: "#0040a1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  // Stats Card
  statsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginTop: 4,
  },
  statsTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 10 },
  statsDivider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 8 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsLabel: { fontSize: 14, color: "#374151" },
  statsValue: { fontSize: 20, fontWeight: "800" },
});
