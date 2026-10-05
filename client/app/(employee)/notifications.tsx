import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Bell,
  Calendar,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  CheckCheck,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  employeeService,
  EmployeeNotification,
} from "../../src/services/employee.service";

// ─── Notification Icon ────────────────────────────────────────────────────────
function NotifIcon({ type }: { type: EmployeeNotification["type"] }) {
  const config = {
    schedule: { icon: Calendar, bg: "#dbeafe", color: "#1d4ed8" },
    complaint: { icon: ClipboardList, bg: "#fee2e2", color: "#dc2626" },
    application: { icon: FileText, bg: "#d1fae5", color: "#059669" },
    task: { icon: CheckCircle2, bg: "#ede9fe", color: "#7c3aed" },
    escalation: { icon: AlertTriangle, bg: "#fef9c3", color: "#d97706" },
    report: { icon: FileText, bg: "#f0fdf4", color: "#16a34a" },
  };
  const c = config[type] ?? config.complaint;
  const Icon = c.icon;
  return (
    <View style={[ni.wrap, { backgroundColor: c.bg }]}>
      <Icon size={18} color={c.color} strokeWidth={2} />
    </View>
  );
}
const ni = StyleSheet.create({
  wrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function EmployeeNotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<EmployeeNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await employeeService.getEmpNotifications();
    setNotifications(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await employeeService.markEmpNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = async () => {
    await employeeService.markAllEmpNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotifPress = async (notif: EmployeeNotification) => {
    await markRead(notif.id);
    if (notif.linkType === "complaint" && notif.linkId) {
      router.push({ pathname: "/(employee)/complaint-detail" as any, params: { id: notif.linkId } });
    } else if (notif.linkType === "application" && notif.linkId) {
      router.push({ pathname: "/(employee)/application-detail" as any, params: { id: notif.linkId } });
    } else if (notif.linkType === "schedule") {
      router.push("/(employee)/schedules" as any);
    } else if (notif.linkType === "task") {
      router.push("/(employee)/tasks" as any);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <Pressable onPress={markAllRead} style={styles.markAllBtn}>
            <CheckCheck size={14} color="#0040a1" strokeWidth={2} />
            <Text style={styles.markAllText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#0040a1" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Bell size={48} color="#d1d5db" strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptySubtitle}>You're all caught up!</Text>
        </View>
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Today's notifications */}
          {notifications.some((n) => n.date.includes("ago") || n.date === "Just now") && (
            <Text style={styles.groupLabel}>Recent</Text>
          )}
          {notifications
            .filter((n) => n.date.includes("ago") || n.date === "Just now")
            .map((notif) => (
              <Pressable
                key={notif.id}
                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                onPress={() => handleNotifPress(notif)}
              >
                {!notif.read && <View style={styles.unreadDot} />}
                <NotifIcon type={notif.type} />
                <View style={styles.notifContent}>
                  <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>
                    {notif.title}
                  </Text>
                  <Text style={styles.notifMessage} numberOfLines={2}>
                    {notif.message}
                  </Text>
                  <View style={styles.notifMeta}>
                    <Clock size={11} color="#94a3b8" strokeWidth={2} />
                    <Text style={styles.notifDate}>{notif.date}</Text>
                  </View>
                </View>
              </Pressable>
            ))}

          {notifications.some((n) => !n.date.includes("ago") && n.date !== "Just now") && (
            <Text style={styles.groupLabel}>Earlier</Text>
          )}
          {notifications
            .filter((n) => !n.date.includes("ago") && n.date !== "Just now")
            .map((notif) => (
              <Pressable
                key={notif.id}
                style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
                onPress={() => handleNotifPress(notif)}
              >
                {!notif.read && <View style={styles.unreadDot} />}
                <NotifIcon type={notif.type} />
                <View style={styles.notifContent}>
                  <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]}>
                    {notif.title}
                  </Text>
                  <Text style={styles.notifMessage} numberOfLines={2}>
                    {notif.message}
                  </Text>
                  <View style={styles.notifMeta}>
                    <Clock size={11} color="#94a3b8" strokeWidth={2} />
                    <Text style={styles.notifDate}>{notif.date}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  countBadge: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 4,
  },
  countBadgeText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 6,
  },
  markAllText: { fontSize: 12, fontWeight: "600", color: "#0040a1" },

  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151" },
  emptySubtitle: { fontSize: 14, color: "#94a3b8" },

  scroll: { flex: 1 },
  groupLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },

  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    position: "relative",
  },
  notifCardUnread: {
    backgroundColor: "#f0f7ff",
  },
  unreadDot: {
    position: "absolute",
    left: 6,
    top: "50%",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#0040a1",
    marginTop: -3.5,
  },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 3 },
  notifTitleUnread: { fontWeight: "700", color: "#111827" },
  notifMessage: { fontSize: 13, color: "#64748b", lineHeight: 18, marginBottom: 5 },
  notifMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  notifDate: { fontSize: 11, color: "#94a3b8" },
});
