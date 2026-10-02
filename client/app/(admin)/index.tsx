import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  UserRound,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  Droplets,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  Download,
} from "lucide-react-native";
import { useAuth } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function AdminDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const initial = user?.fullname?.charAt(0).toUpperCase() ?? "A";

  const stats = [
    {
      label: "Total Complaints",
      value: "1,245",
      change: "+12%",
      up: true,
      icon: <FileText size={22} color="#0649aa" strokeWidth={1.8} />,
      iconBg: "#dbeafe",
    },
    {
      label: "Pending Resolution",
      value: "342",
      change: "+5%",
      up: true,
      icon: <Clock size={22} color="#d97706" strokeWidth={1.8} />,
      iconBg: "#fef3c7",
    },
    {
      label: "Critical Escalations",
      value: "28",
      change: "Urgent",
      urgent: true,
      icon: <AlertTriangle size={22} color="#dc2626" strokeWidth={1.8} />,
      iconBg: "#fee2e2",
    },
    {
      label: "Service Applications",
      value: "156",
      change: "",
      icon: <Droplets size={22} color="#0a6640" strokeWidth={1.8} />,
      iconBg: "#d1fae5",
    },
  ];

  const urgentActions = [
    {
      tag: "Zone North · SLA Breach",
      tagColor: "#dc2626",
      tagBg: "#fee2e2",
      title: "Major Pipe Burst – Sector 42",
      desc: "Multiple complaints regarding severe water logging and zero supply in Sector 42 residential...",
      time: "2h ago",
    },
    {
      tag: "WQ Warning",
      tagColor: "#d97706",
      tagBg: "#fef3c7",
      title: "Contaminated Supply Report",
      desc: "Initial reports of yellowish water supply in the Civil Lines district. Requires immediate testing...",
      time: "5h ago",
    },
    {
      tag: "Staffing Shortage",
      tagColor: "#0649aa",
      tagBg: "#dbeafe",
      title: "Sanitation Fleet Maintenance",
      desc: "4 garbage collection trucks down for maintenance in East Zone, causing backlog.",
      time: "1d ago",
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoWrap}>
            <Droplets size={18} color="#0a6640" strokeWidth={2} />
          </View>
          <View>
            <View style={styles.headerBrandRow}>
              <Text style={styles.headerBrand}>Jal Seva</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            </View>
            <Text style={styles.headerSub}>Municipal Water Board</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={styles.headerIconBtn}
            onPress={() => router.push("/(admin)/complaints" as any)}
          >
            <Bell size={20} color="#374151" strokeWidth={1.8} />
          </Pressable>
          <Pressable
            style={styles.avatarBtn}
            onPress={() => router.push("/(admin)/settings" as any)}
          >
            <Text style={styles.avatarText}>{initial}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <View style={styles.pageTitleRow}>
          <View>
            <Text style={styles.pageTitle}>Chief Officer Dashboard</Text>
            <Text style={styles.pageSubtitle}>
              Real-time overview of Jal Seva operations and departmental performance.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.exportBtn}
          onPress={() =>
            alert("Export Initiated: Generating Jal Seva Municipal Performance Report (PDF).")
          }
        >
          <Download size={15} color="#374151" strokeWidth={2} />
          <Text style={styles.exportText}>Export Report</Text>
        </Pressable>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View
              key={i}
              style={[styles.statCard, s.urgent && styles.statCardUrgent]}
            >
              <View style={styles.statTopRow}>
                <View style={[styles.statIconWrap, { backgroundColor: s.iconBg }]}>
                  {s.icon}
                </View>
                {s.change ? (
                  <View
                    style={[
                      styles.statChangeBadge,
                      s.urgent
                        ? styles.statChangeUrgent
                        : s.up
                        ? styles.statChangeUp
                        : styles.statChangeNeutral,
                    ]}
                  >
                    {s.up && !s.urgent && (
                      <TrendingUp size={10} color="#16a34a" strokeWidth={2} />
                    )}
                    <Text
                      style={[
                        styles.statChangeText,
                        s.urgent ? { color: "#dc2626" } : { color: "#16a34a" },
                      ]}
                    >
                      {s.change}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statValue, s.urgent && { color: "#dc2626" }]}>
                {s.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Department Overview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Department Overview</Text>
          <View style={styles.tabRow}>
            <Pressable style={[styles.tab, styles.tabActive]}>
              <Text style={styles.tabActiveText}>Water Supply</Text>
            </Pressable>
            <Pressable style={styles.tab}>
              <Text style={styles.tabText}>Sanitation</Text>
            </Pressable>
          </View>
          <Text style={styles.effLabel}>Overall Efficiency</Text>
          <View style={styles.effRow}>
            <Text style={styles.effValue}>87.4%</Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#0649aa" }]} />
                <Text style={styles.legendText}>Resolved</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: "#e5e7eb" }]} />
                <Text style={styles.legendText}>Pending</Text>
              </View>
            </View>
          </View>

          {/* Simple Bar Chart */}
          <View style={styles.barsRow}>
            {[65, 80, 55, 90, 70, 85, 60].map((h, i) => (
              <View key={i} style={styles.barWrap}>
                <View style={[styles.bar, { height: h * 0.9 }]} />
                <Text style={styles.barLabel}>
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Urgent Actions */}
        <View style={styles.urgentHeader}>
          <View style={styles.urgentTitleRow}>
            <AlertTriangle size={16} color="#d97706" strokeWidth={2} />
            <Text style={styles.urgentTitle}>Urgent Actions</Text>
          </View>
          <Pressable onPress={() => router.push("/(admin)/complaints" as any)}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>

        {urgentActions.map((a, i) => (
          <View key={i} style={styles.urgentCard}>
            <View style={styles.urgentCardTop}>
              <View style={[styles.urgentTag, { backgroundColor: a.tagBg }]}>
                <Text style={[styles.urgentTagText, { color: a.tagColor }]}>
                  {a.tag}
                </Text>
              </View>
              <Text style={styles.urgentTime}>{a.time}</Text>
            </View>
            <Text style={styles.urgentCardTitle}>{a.title}</Text>
            <Text style={styles.urgentCardDesc}>{a.desc}</Text>
            <Pressable
              style={styles.urgentAction}
              onPress={() => router.push("/(admin)/complaints" as any)}
            >
              <Text style={styles.urgentActionText}>Action Required</Text>
              <ChevronRight size={13} color="#0649aa" strokeWidth={2} />
            </Pressable>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },

  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#d1fae5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBrandRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerBrand: { fontSize: 15, fontWeight: "700", color: "#111827" },
  adminBadge: {
    backgroundColor: "#d1fae5",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  adminBadgeText: { fontSize: 9, fontWeight: "700", color: "#065f46" },
  headerSub: { fontSize: 11, color: "#6b7280", marginTop: 1 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0a6640",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  pageTitleRow: { marginBottom: 10 },
  pageTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
  pageSubtitle: { fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 17 },

  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#ffffff",
    marginBottom: 18,
  },
  exportText: { fontSize: 13, fontWeight: "600", color: "#374151" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: (width - 42) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statCardUrgent: {
    backgroundColor: "#fff1f2",
    borderColor: "#fecaca",
  },
  statTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statChangeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  statChangeUp: { backgroundColor: "#dcfce7" },
  statChangeNeutral: { backgroundColor: "#f3f4f6" },
  statChangeUrgent: { backgroundColor: "#fee2e2" },
  statChangeText: { fontSize: 10, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  statValue: { fontSize: 26, fontWeight: "800", color: "#111827" },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 20,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 12 },

  tabRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  tabActive: { backgroundColor: "#111827" },
  tabText: { fontSize: 13, color: "#6b7280", fontWeight: "500" },
  tabActiveText: { fontSize: 13, color: "#ffffff", fontWeight: "600" },

  effLabel: { fontSize: 12, color: "#6b7280" },
  effRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  effValue: { fontSize: 28, fontWeight: "800", color: "#111827" },
  legendRow: { flexDirection: "row", gap: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: "#6b7280" },

  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 80,
    marginTop: 4,
  },
  barWrap: { flex: 1, alignItems: "center", gap: 4 },
  bar: { width: "100%", backgroundColor: "#0649aa", borderRadius: 4 },
  barLabel: { fontSize: 9, color: "#9ca3af" },

  urgentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  urgentTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  urgentTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  viewAll: { fontSize: 13, color: "#0649aa", fontWeight: "600" },

  urgentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
  },
  urgentCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  urgentTag: {
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  urgentTagText: { fontSize: 10, fontWeight: "700" },
  urgentTime: { fontSize: 11, color: "#9ca3af" },
  urgentCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  urgentCardDesc: { fontSize: 12, color: "#6b7280", lineHeight: 17, marginBottom: 10 },
  urgentAction: { flexDirection: "row", alignItems: "center", gap: 4 },
  urgentActionText: { fontSize: 12, fontWeight: "700", color: "#0649aa" },
});
