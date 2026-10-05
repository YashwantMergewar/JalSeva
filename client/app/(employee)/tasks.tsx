import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MapPin,
  Play,
  Navigation,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Loader,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  employeeService,
  EmployeeTask,
  ComplaintPriority,
  TaskStatus,
} from "../../src/services/employee.service";

// ─── Priority Config ──────────────────────────────────────────────────────────
const priorityConfig: Record<
  ComplaintPriority,
  { label: string; bg: string; text: string; borderColor: string }
> = {
  Urgent: { label: "URGENT", bg: "#fee2e2", text: "#991b1b", borderColor: "#dc2626" },
  High: { label: "HIGH", bg: "#fef9c3", text: "#854d0e", borderColor: "#d97706" },
  Medium: { label: "NORMAL", bg: "#8df1e0", text: "#006b5f", borderColor: "#e2e8f0" },
  Low: { label: "NORMAL", bg: "#8df1e0", text: "#006b5f", borderColor: "#e2e8f0" },
};

// ─── Status Pill ─────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: TaskStatus }) {
  const config: Record<TaskStatus, { bg: string; text: string; icon: React.ReactNode }> = {
    Assigned: { bg: "#dbeafe", text: "#1d4ed8", icon: <Clock size={11} color="#1d4ed8" strokeWidth={2} /> },
    Started: { bg: "#8df1e0", text: "#006b5f", icon: <Play size={11} color="#006b5f" strokeWidth={2} /> },
    "In Progress": { bg: "#8df1e0", text: "#006b5f", icon: <Loader size={11} color="#006b5f" strokeWidth={2} /> },
    "Field Report Submitted": { bg: "#ede9fe", text: "#7c3aed", icon: <CheckCircle2 size={11} color="#7c3aed" strokeWidth={2} /> },
    Completed: { bg: "#dcfce7", text: "#166534", icon: <CheckCircle2 size={11} color="#166534" strokeWidth={2} /> },
  };
  const c = config[status] ?? config.Assigned;
  return (
    <View style={[sp.wrap, { backgroundColor: c.bg }]}>
      {c.icon}
      <Text style={[sp.text, { color: c.text }]}>{status}</Text>
    </View>
  );
}
const sp = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  text: { fontSize: 11, fontWeight: "600" },
});

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({
  task,
  onStartWork,
  onViewRoute,
  onPress,
}: {
  task: EmployeeTask;
  onStartWork: () => void;
  onViewRoute: () => void;
  onPress: () => void;
}) {
  const pc = priorityConfig[task.priority] ?? priorityConfig.Medium;
  const isUrgent = task.priority === "Urgent" || task.priority === "High";
  const canStart = task.status === "Assigned";

  return (
    <Pressable
      style={[styles.card, { borderColor: pc.borderColor, borderLeftWidth: 4 }]}
      onPress={onPress}
    >
      {/* Priority Badge */}
      <View style={[styles.priorityBadge, { backgroundColor: pc.bg }]}>
        {isUrgent && (
          <AlertTriangle size={11} color={pc.text} strokeWidth={2.5} />
        )}
        <Text style={[styles.priorityText, { color: pc.text }]}>
          {pc.label}
        </Text>
      </View>

      {/* Urgent icon overlay */}
      {isUrgent && (
        <View style={styles.urgentCorner}>
          <AlertTriangle size={22} color="#dc2626" strokeWidth={1.5} />
        </View>
      )}

      {/* Task info */}
      <Text style={styles.taskType}>{task.type}</Text>
      <Text style={styles.taskId}>ID: {task.complaintNumber}</Text>

      <View style={styles.locationRow}>
        <MapPin size={13} color="#94a3b8" strokeWidth={2} />
        <Text style={styles.locationText} numberOfLines={2}>
          {task.location}
        </Text>
      </View>

      <View style={styles.statusRow}>
        <StatusPill status={task.status} />
      </View>

      {/* Buttons */}
      <View style={styles.btnRow}>
        {canStart && (
          <Pressable style={styles.startBtn} onPress={onStartWork}>
            <Play size={14} color="#fff" strokeWidth={2.5} fill="#fff" />
            <Text style={styles.startBtnText}>Start Work</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.routeBtn, canStart ? { flex: 1 } : { flex: 1 }]}
          onPress={onViewRoute}
        >
          <Navigation size={14} color="#374151" strokeWidth={2} />
          <Text style={styles.routeBtnText}>View Route</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function MyTasksScreen() {
  const router = useRouter();
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const loadTasks = useCallback(async () => {
    try {
      const data = await employeeService.getTasks();
      setTasks(data);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const handleStartWork = async (taskId: string, taskType: string) => {
    Alert.alert(
      "Start Work",
      `Start work on "${taskType}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Start",
          onPress: async () => {
            const updated = await employeeService.updateTaskStatus(taskId, "In Progress");
            if (updated) {
              setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, status: "In Progress" } : t))
              );
              Alert.alert("Work Started", "Task status updated to In Progress.");
            }
          },
        },
      ]
    );
  };

  const handleViewRoute = (task: EmployeeTask) => {
    Alert.alert(
      "View Route",
      `Opening navigation to:\n${task.location}, ${task.ward}`,
      [{ text: "OK" }]
    );
  };

  const handleTaskPress = (task: EmployeeTask) => {
    router.push({
      pathname: "/(employee)/complaint-detail" as any,
      params: { id: task.complaintNumber },
    });
  };

  const urgentCount = tasks.filter(
    (t) => t.priority === "Urgent" || t.priority === "High"
  ).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Municipal Services</Text>
      </View>

      {/* Page Title */}
      <View style={styles.pageTitleRow}>
        <View>
          <Text style={styles.pageTitle}>My Tasks</Text>
          <Text style={styles.pageSubtitle}>Today's schedule</Text>
        </View>
        <Text style={styles.dateText}>{today}</Text>
      </View>

      {/* Summary chips */}
      {!loading && tasks.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryChipText}>
              {tasks.length} tasks
            </Text>
          </View>
          {urgentCount > 0 && (
            <View style={[styles.summaryChip, { backgroundColor: "#fee2e2" }]}>
              <AlertTriangle size={11} color="#991b1b" strokeWidth={2.5} />
              <Text style={[styles.summaryChipText, { color: "#991b1b" }]}>
                {urgentCount} urgent
              </Text>
            </View>
          )}
        </View>
      )}

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#0040a1" />
          <Text style={styles.loadingText}>Loading tasks…</Text>
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
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <CheckCircle2 size={48} color="#d1d5db" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptySubtitle}>
                No tasks assigned for today.
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStartWork={() => handleStartWork(task.id, task.type)}
                onViewRoute={() => handleViewRoute(task)}
                onPress={() => handleTaskPress(task)}
              />
            ))
          )}

          {/* Field Report CTA */}
          {tasks.some((t) => t.status === "In Progress") && (
            <Pressable
              style={styles.fieldReportCTA}
              onPress={() =>
                router.push({
                  pathname: "/(employee)/field-report" as any,
                  params: { taskId: tasks.find((t) => t.status === "In Progress")?.id },
                })
              }
            >
              <CheckCircle2 size={18} color="#7c3aed" strokeWidth={2} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldReportCTATitle}>
                  Submit Field Report
                </Text>
                <Text style={styles.fieldReportCTASub}>
                  You have work in progress. Submit your observations.
                </Text>
              </View>
            </Pressable>
          )}

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
    height: 58,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0040a1" },

  pageTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: "#111827" },
  pageSubtitle: { fontSize: 13, color: "#64748b", marginTop: 2 },
  dateText: { fontSize: 14, fontWeight: "600", color: "#0040a1" },

  summaryRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  summaryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  summaryChipText: { fontSize: 12, fontWeight: "600", color: "#374151" },

  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: { fontSize: 14, color: "#64748b" },

  scroll: { flex: 1 },
  scrollContent: { padding: 14 },

  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151" },
  emptySubtitle: { fontSize: 14, color: "#94a3b8" },

  // Task Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
    position: "relative",
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  priorityText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  urgentCorner: {
    position: "absolute",
    top: 12,
    right: 14,
  },
  taskType: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 2 },
  taskId: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    marginBottom: 10,
  },
  locationText: { fontSize: 13, color: "#374151", flex: 1, lineHeight: 18 },
  statusRow: { marginBottom: 12 },
  btnRow: { flexDirection: "row", gap: 10 },
  startBtn: {
    flex: 1.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#0040a1",
    borderRadius: 10,
    paddingVertical: 12,
    shadowColor: "#0040a1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  startBtnText: { fontSize: 14, fontWeight: "700", color: "#ffffff" },
  routeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  routeBtnText: { fontSize: 14, fontWeight: "600", color: "#374151" },

  // Field Report CTA
  fieldReportCTA: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#faf5ff",
    borderWidth: 1,
    borderColor: "#e9d5ff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  fieldReportCTATitle: { fontSize: 14, fontWeight: "700", color: "#7c3aed" },
  fieldReportCTASub: { fontSize: 12, color: "#a78bfa", marginTop: 2, lineHeight: 17 },
});
