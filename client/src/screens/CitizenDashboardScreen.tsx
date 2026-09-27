import {
  Bell,
  Droplets,
  CheckCircle,
  AlertCircle,
  Receipt,
  CalendarDays,
  ClipboardList,
  Settings,
  Plug,
  Trash2,
  ChevronRight,
  Map,
} from "lucide-react-native";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

type CitizenDashboardScreenProps = {
  onNotifications?: () => void;
};

export default function CitizenDashboardScreen({
  onNotifications,
}: CitizenDashboardScreenProps) {
  const { user } = useAuth();
  const initial = user?.fullname ? user.fullname.charAt(0).toUpperCase() : "C";
  const displayName = user?.fullname ? user.fullname : "Citizen";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* ── Top header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Avatar placeholder */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.headerGreeting}>
            <Text style={styles.headerSub}>Welcome back,</Text>
            <Text style={styles.headerTitle}>{displayName}</Text>
          </View>
        </View>
        <Pressable onPress={onNotifications} style={styles.bellBtn} hitSlop={8}>
          <Bell size={24} color="#222222" strokeWidth={1.8} />
        </Pressable>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Your Overview ── */}
        <Text style={styles.sectionHeading}>Your Overview</Text>

        {/* Row 1: Water Supply + Active Complaint */}
        <View style={styles.overviewRow}>
          {/* Water Supply card */}
          <View style={[styles.overviewCard, styles.cardBorder]}>
            <View style={styles.cardTopRow}>
              <Droplets size={20} color="#075ad5" strokeWidth={1.8} />
              <Text style={styles.cardLabel}>Water Supply</Text>
            </View>
            <Text style={styles.cardBody}>
              Scheduled for{"\n"}
              <Text style={styles.cardBodyBold}>6:00 AM – 9:00{"\n"}AM today</Text>
            </Text>
            <View style={styles.divider} />
            <View style={styles.cardFooterRow}>
              <View style={styles.activeArea}>
                <CheckCircle size={13} color="#006b5f" strokeWidth={2} />
                <Text style={styles.activeAreaText}>Active Area</Text>
              </View>
              <Pressable style={styles.viewMapBtn}>
                <Text style={styles.viewMapText}>View{"\n"}Map</Text>
              </Pressable>
            </View>
          </View>

          {/* Active Complaint card */}
          <View style={[styles.overviewCard, styles.cardBorder]}>
            <View style={styles.cardTopRow}>
              <AlertCircle size={20} color="#687080" strokeWidth={1.8} />
              <Text style={styles.cardLabel}>Active{"\n"}Complaint</Text>
            </View>
            <Text style={styles.complaintTitle}>Leaking Pipe</Text>
            <Text style={styles.complaintRef}>Ref: #1234</Text>
            <View style={styles.divider} />
            <View style={styles.cardFooterRow}>
              <View style={styles.inProgressBadge}>
                <Text style={styles.inProgressText}>In Progress</Text>
              </View>
              <Pressable>
                <Text style={styles.trackText}>Track</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Bill Summary card */}
        <View style={[styles.billCard, styles.cardBorder]}>
          <View style={styles.billTopRow}>
            <View style={styles.billIconWrap}>
              <Receipt size={18} color="#ba1a1a" strokeWidth={1.8} />
            </View>
            <Text style={styles.billLabel}>Bill Summary</Text>
          </View>
          <Text style={styles.billSubLabel}>Pending Water Bill</Text>
          <View style={styles.billAmountRow}>
            <Text style={styles.billAmount}>₹450</Text>
            <View style={styles.dueBadge}>
              <Text style={styles.dueText}>Due in 3{"\n"}days</Text>
            </View>
          </View>
          <Pressable style={styles.payNowBtn}>
            <Text style={styles.payNowText}>Pay Now</Text>
            <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* ── Quick Actions ── */}
        <Text style={[styles.sectionHeading, { marginTop: 26 }]}>
          Quick Actions
        </Text>

        <View style={styles.actionsGrid}>
          <ActionTile
            icon={<CalendarDays size={28} color="#ffffff" strokeWidth={1.8} />}
            bg="#075ad5"
            label="Water Schedule"
          />
          <ActionTile
            icon={<AlertCircle size={28} color="#0a7868" strokeWidth={1.8} />}
            bg="#9ef0d8"
            label="Complaints"
          />
          <ActionTile
            icon={<Settings size={28} color="#687080" strokeWidth={1.8} />}
            bg="#e8e8e8"
            label="Services"
          />
          <ActionTile
            icon={<Receipt size={28} color="#ba1a1a" strokeWidth={1.8} />}
            bg="#ffdad6"
            label={"Bills &\nPayments"}
          />
          <ActionTile
            icon={<Plug size={28} color="#5c5f8a" strokeWidth={1.8} />}
            bg="#dde0f5"
            label={"Water\nConnection"}
          />
          <ActionTile
            icon={<Trash2 size={28} color="#ffffff" strokeWidth={1.8} />}
            bg="#444444"
            label="Sanitation"
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionTile({
  icon,
  bg,
  label,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
}) {
  return (
    <Pressable style={styles.actionTile}>
      <View style={[styles.actionIconCircle, { backgroundColor: bg }]}>
        {icon}
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0efea" },

  /* header */
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#f0efea",
    borderBottomWidth: 1,
    borderBottomColor: "#e0dfd8",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#c3c6d6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "700", color: "#555" },
  headerGreeting: { gap: 1 },
  headerSub: { fontSize: 12, color: "#3f4350" },
  headerTitle: { fontSize: 15, fontWeight: "700", color: "#0649aa" },
  bellBtn: { padding: 4 },

  /* scroll */
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 20 },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
  },

  /* overview row */
  overviewRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  overviewCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    minHeight: 160,
  },
  cardBorder: {
    borderWidth: 1,
    borderColor: "#d8d8d0",
  },
  cardTopRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  cardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111111",
    flex: 1,
    lineHeight: 18,
  },
  cardBody: { fontSize: 13, color: "#3f4350", lineHeight: 19, marginTop: 8 },
  cardBodyBold: { fontWeight: "700", color: "#111111" },
  divider: { height: 1, backgroundColor: "#e8e8e0", marginVertical: 10 },
  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activeArea: { flexDirection: "row", alignItems: "center", gap: 4 },
  activeAreaText: { fontSize: 11, color: "#006b5f", fontWeight: "600" },
  viewMapBtn: {},
  viewMapText: {
    fontSize: 11,
    color: "#0649aa",
    fontWeight: "600",
    textAlign: "right",
    lineHeight: 15,
  },
  complaintTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111111",
    marginTop: 8,
  },
  complaintRef: { fontSize: 12, color: "#687080", marginTop: 2 },
  inProgressBadge: {
    backgroundColor: "#e8e8e8",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  inProgressText: { fontSize: 10, color: "#444444", fontWeight: "600" },
  trackText: { fontSize: 13, color: "#0649aa", fontWeight: "600" },

  /* bill card */
  billCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
  },
  billTopRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  billIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#ffdad6",
    alignItems: "center",
    justifyContent: "center",
  },
  billLabel: { fontSize: 15, fontWeight: "700", color: "#111111" },
  billSubLabel: { fontSize: 13, color: "#3f4350" },
  billAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  billAmount: { fontSize: 30, fontWeight: "700", color: "#111111" },
  dueBadge: {
    backgroundColor: "#ffdad6",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dueText: { fontSize: 11, color: "#ba1a1a", fontWeight: "700", lineHeight: 15 },
  payNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 44,
    backgroundColor: "#0a2d7a",
    borderRadius: 24,
    marginTop: 14,
    alignSelf: "flex-start",
    paddingHorizontal: 22,
  },
  payNowText: { color: "#ffffff", fontWeight: "700", fontSize: 15 },

  /* quick actions */
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionTile: {
    width: "30.5%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8d8d0",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 16,
    gap: 10,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 12,
    color: "#111111",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 16,
  },
});
