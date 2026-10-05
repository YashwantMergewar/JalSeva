import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  employeeService,
  EmpComplaint,
  ComplaintStatus,
  ComplaintPriority,
} from "../../src/services/employee.service";

// ─── Priority Badge ───────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: ComplaintPriority }) {
  const config: Record<
    ComplaintPriority,
    { bg: string; text: string; label: string }
  > = {
    Low: { bg: "#dcfce7", text: "#166534", label: "Low Priority" },
    Medium: { bg: "#fef9c3", text: "#854d0e", label: "Medium Priority" },
    High: { bg: "#fee2e2", text: "#991b1b", label: "High Priority" },
    Urgent: { bg: "#fee2e2", text: "#991b1b", label: "Urgent" },
  };
  const c = config[priority] ?? config.Medium;
  return (
    <View style={[badge.wrap, { backgroundColor: c.bg }]}>
      <Text style={[badge.text, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  text: { fontSize: 11, fontWeight: "600" },
});

// ─── Status Chip ─────────────────────────────────────────────────────────────
function StatusChip({ status }: { status: ComplaintStatus }) {
  const colors: Record<ComplaintStatus, { bg: string; text: string }> = {
    Submitted: { bg: "#f1f5f9", text: "#475569" },
    "Pending Review": { bg: "#fef9c3", text: "#854d0e" },
    Assigned: { bg: "#dbeafe", text: "#1d4ed8" },
    "In Progress": { bg: "#8df1e0", text: "#006b5f" },
    Escalated: { bg: "#fee2e2", text: "#991b1b" },
    Resolved: { bg: "#dcfce7", text: "#166534" },
    Rejected: { bg: "#f1f5f9", text: "#475569" },
  };
  const c = colors[status] ?? { bg: "#f1f5f9", text: "#475569" };
  return (
    <View style={[chip.wrap, { backgroundColor: c.bg }]}>
      <Text style={[chip.text, { color: c.text }]}>{status}</Text>
    </View>
  );
}

const chip = StyleSheet.create({
  wrap: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  text: { fontSize: 11, fontWeight: "600" },
});

// ─── Left-side priority border color ─────────────────────────────────────────
function priorityBorderColor(p: ComplaintPriority) {
  if (p === "Urgent" || p === "High") return "#dc2626";
  if (p === "Medium") return "#d97706";
  return "#16a34a";
}

// ─── Tab filters ─────────────────────────────────────────────────────────────
const STATUS_TABS: Array<{ label: string; value: ComplaintStatus | "All" }> = [
  { label: "All Complaints", value: "All" },
  { label: "Pending", value: "Pending Review" },
  { label: "Assigned", value: "Assigned" },
  { label: "In Progress", value: "In Progress" },
  { label: "Escalated", value: "Escalated" },
  { label: "Resolved", value: "Resolved" },
];

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function EmployeeComplaintsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filterStatus?: string }>();

  const [activeTab, setActiveTab] = useState<ComplaintStatus | "All">(
    (params.filterStatus as ComplaintStatus) || "All"
  );
  const [search, setSearch] = useState("");
  const [complaints, setComplaints] = useState<EmpComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadComplaints = useCallback(async () => {
    try {
      const data = await employeeService.getComplaints({
        status: activeTab !== "All" ? activeTab : undefined,
        search: search.trim() || undefined,
      });
      setComplaints(data);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, search]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(loadComplaints, 300);
    return () => clearTimeout(t);
  }, [loadComplaints]);

  const onRefresh = () => {
    setRefreshing(true);
    loadComplaints();
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Municipal Services</Text>
        <Pressable
          onPress={() => router.push("/(employee)/notifications" as any)}
          style={styles.headerIcon}
        >
          <Filter size={20} color="#374151" strokeWidth={1.8} />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={16} color="#94a3b8" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, Area, or Type"
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Status Tabs */}
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
              activeTab === tab.value && styles.tabChipActive,
            ]}
            onPress={() => setActiveTab(tab.value)}
          >
            <Text
              style={[
                styles.tabChipText,
                activeTab === tab.value && styles.tabChipTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Complaint List */}
      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#0040a1" />
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#0040a1"
            />
          }
        >
          {complaints.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No complaints found</Text>
              <Text style={styles.emptySubtitle}>
                {search
                  ? `No results for "${search}". Try a different search term.`
                  : "No complaints match the selected filter."}
              </Text>
            </View>
          ) : (
            complaints.map((c) => (
              <Pressable
                key={c.id}
                style={[
                  styles.card,
                  {
                    borderLeftColor: priorityBorderColor(c.priority),
                  },
                ]}
                onPress={() =>
                  router.push({
                    pathname: "/(employee)/complaint-detail" as any,
                    params: { id: c.id },
                  })
                }
              >
                {/* Top row: ID + Priority */}
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardId}>ID: #{c.complaintNumber}</Text>
                  <PriorityBadge priority={c.priority} />
                </View>

                {/* Type */}
                <Text style={styles.cardType}>{c.type}</Text>

                {/* Location */}
                <View style={styles.cardMeta}>
                  <MapPin size={13} color="#94a3b8" strokeWidth={2} />
                  <Text style={styles.cardMetaText} numberOfLines={1}>
                    {c.location}
                  </Text>
                </View>

                {/* Reported date */}
                <View style={styles.cardMeta}>
                  <Calendar size={13} color="#94a3b8" strokeWidth={2} />
                  <Text style={styles.cardMetaText}>
                    Reported: {c.reportedAt}
                  </Text>
                </View>

                {/* Bottom: Status + View Details */}
                <View style={styles.cardBottom}>
                  <StatusChip status={c.status} />
                  <Pressable
                    style={styles.viewDetailsBtn}
                    onPress={() =>
                      router.push({
                        pathname: "/(employee)/complaint-detail" as any,
                        params: { id: c.id },
                      })
                    }
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <ChevronRight size={13} color="#0040a1" strokeWidth={2} />
                  </Pressable>
                </View>
              </Pressable>
            ))
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0040a1",
  },
  headerIcon: { padding: 6 },

  searchRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1b1c1c",
  },

  tabScroll: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    maxHeight: 50,
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
  tabChipText: { fontSize: 13, fontWeight: "500", color: "#64748b" },
  tabChipTextActive: { color: "#ffffff", fontWeight: "600" },

  list: { flex: 1 },
  listContent: { padding: 14 },

  loadingCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },
  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 19,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardId: { fontSize: 12, color: "#64748b", fontWeight: "500" },
  cardType: { fontSize: 16, fontWeight: "700", color: "#111827" },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  cardMetaText: {
    fontSize: 13,
    color: "#64748b",
    flex: 1,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  viewDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0040a1",
  },
});
