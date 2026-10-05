/**
 * schedule-detail.tsx
 *
 * Deep-dive view for a single ward's water schedule.
 * Opened from the Schedules list when a ward card is tapped.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Clock,
  Calendar,
  MapPin,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Users,
  Droplets,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { employeeService, WaterSchedule } from "../../src/services/employee.service";

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, highlight && styles.infoValueHighlight]}>{value}</Text>
    </View>
  );
}

export default function ScheduleDetailScreen() {
  const router = useRouter();
  const { ward } = useLocalSearchParams<{ ward?: string }>();
  const [schedule, setSchedule] = useState<WaterSchedule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ward) {
      employeeService.getScheduleByWard(ward).then((s) => {
        setSchedule(s);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [ward]);

  if (!schedule && !loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>Schedule Detail</Text>
        </View>
        <View style={styles.center}>
          <Text style={{ color: "#94a3b8" }}>Schedule not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = {
    Active: { bg: "#dcfce7", text: "#166534", icon: <CheckCircle2 size={14} color="#166534" strokeWidth={2} /> },
    Restricted: { bg: "#fef9c3", text: "#854d0e", icon: <AlertTriangle size={14} color="#d97706" strokeWidth={2} /> },
    Cancelled: { bg: "#fee2e2", text: "#991b1b", icon: <AlertTriangle size={14} color="#dc2626" strokeWidth={2} /> },
  };
  const sc = schedule ? (statusConfig[schedule.status] ?? statusConfig.Active) : statusConfig.Active;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>{schedule?.ward ?? "Schedule Detail"}</Text>
        <Pressable
          style={styles.editBtn}
          onPress={() => router.push("/(employee)/schedules" as any)}
        >
          <Edit3 size={16} color="#0040a1" strokeWidth={2} />
          <Text style={styles.editBtnText}>Edit</Text>
        </Pressable>
      </View>

      {schedule && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Status Banner */}
          <View style={[styles.statusBanner, { backgroundColor: sc.bg }]}>
            {sc.icon}
            <Text style={[styles.statusText, { color: sc.text }]}>
              Schedule Status: {schedule.status}
            </Text>
          </View>

          {/* Time Card */}
          <View style={styles.timeCard}>
            <View style={styles.timeCardIcon}>
              <Clock size={24} color="#0040a1" strokeWidth={1.8} />
            </View>
            <View>
              <Text style={styles.timeRange}>
                {schedule.startTime} – {schedule.endTime}
              </Text>
              <Text style={styles.duration}>{schedule.durationMinutes} minutes supply window</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Schedule Details</Text>
            <InfoRow label="Ward" value={schedule.ward} />
            <View style={styles.divider} />
            <InfoRow label="Area" value={schedule.area} />
            <View style={styles.divider} />
            <InfoRow label="Date" value={schedule.date} />
            <View style={styles.divider} />
            <InfoRow label="Start Time" value={schedule.startTime} highlight />
            <View style={styles.divider} />
            <InfoRow label="End Time" value={schedule.endTime} highlight />
            <View style={styles.divider} />
            <InfoRow label="Duration" value={`${schedule.durationMinutes} minutes`} />
            <View style={styles.divider} />
            <InfoRow label="Updated By" value={schedule.updatedBy} />
            <View style={styles.divider} />
            <InfoRow label="Last Updated" value={schedule.updatedAt} />
          </View>

          {/* Reschedule Reason */}
          {schedule.rescheduleReason && (
            <View style={styles.reasonCard}>
              <View style={styles.reasonHeader}>
                <AlertTriangle size={14} color="#d97706" strokeWidth={2} />
                <Text style={styles.reasonTitle}>Rescheduled — Reason</Text>
              </View>
              <Text style={styles.reasonText}>{schedule.rescheduleReason}</Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Users size={18} color="#0040a1" strokeWidth={2} />
              <Text style={styles.statValue}>~1,200</Text>
              <Text style={styles.statLabel}>Consumers</Text>
            </View>
            <View style={styles.statCard}>
              <Droplets size={18} color="#006b5f" strokeWidth={2} />
              <Text style={styles.statValue}>~60 KL</Text>
              <Text style={styles.statLabel}>Daily Supply</Text>
            </View>
            <View style={styles.statCard}>
              <MapPin size={18} color="#7c3aed" strokeWidth={2} />
              <Text style={styles.statValue}>{schedule.area}</Text>
              <Text style={styles.statLabel}>Area</Text>
            </View>
          </View>

          {/* Action Button */}
          <Pressable
            style={styles.editFullBtn}
            onPress={() => router.push("/(employee)/schedules" as any)}
          >
            <Edit3 size={16} color="#fff" strokeWidth={2} />
            <Text style={styles.editFullBtnText}>Edit & Reschedule</Text>
          </Pressable>

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
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: { padding: 6 },
  headerTitle: { flex: 1, fontSize: 17, fontWeight: "700", color: "#111827" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  editBtnText: { fontSize: 13, fontWeight: "600", color: "#0040a1" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  statusText: { fontSize: 14, fontWeight: "700" },

  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    padding: 16,
    marginBottom: 12,
  },
  timeCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  timeRange: { fontSize: 22, fontWeight: "800", color: "#0040a1" },
  duration: { fontSize: 12, color: "#64748b", marginTop: 3 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 12 },
  infoRow: { paddingVertical: 8 },
  infoLabel: { fontSize: 11, color: "#94a3b8", marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: "500", color: "#111827" },
  infoValueHighlight: { fontWeight: "700", color: "#0040a1", fontSize: 15 },
  divider: { height: 1, backgroundColor: "#f1f5f9" },

  reasonCard: {
    backgroundColor: "#fef9c3",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fde68a",
    padding: 14,
    marginBottom: 12,
  },
  reasonHeader: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 8 },
  reasonTitle: { fontSize: 13, fontWeight: "700", color: "#854d0e" },
  reasonText: { fontSize: 13, color: "#78350f", lineHeight: 19 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 15, fontWeight: "700", color: "#111827", textAlign: "center" },
  statLabel: { fontSize: 11, color: "#94a3b8", textAlign: "center" },

  editFullBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0040a1",
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: "#0040a1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  editFullBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
