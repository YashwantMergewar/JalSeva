import React, { useEffect, useState } from "react";
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
  Phone,
  MapPin,
  Droplets,
  Calendar,
  Gauge,
  FileText,
  AlertCircle,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { employeeService, Consumer } from "../../src/services/employee.service";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function ConsumerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [consumer, setConsumer] = useState<Consumer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employeeService.getConsumerById(id || "").then((c) => {
      setConsumer(c);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
        </View>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#0040a1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!consumer) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>Consumer Detail</Text>
        </View>
        <View style={styles.loadingCenter}>
          <Text style={{ color: "#94a3b8" }}>Consumer not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColors: Record<Consumer["status"], { bg: string; text: string }> = {
    Active: { bg: "#dcfce7", text: "#166534" },
    Inactive: { bg: "#fef9c3", text: "#854d0e" },
    Disconnected: { bg: "#fee2e2", text: "#991b1b" },
  };
  const sc = statusColors[consumer.status];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>Consumer Details</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{consumer.name[0]}</Text>
          </View>
          <Text style={styles.profileName}>{consumer.name}</Text>
          <Text style={styles.profileNum}>{consumer.consumerNumber}</Text>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: sc.text }]} />
            <Text style={[styles.statusText, { color: sc.text }]}>{consumer.status}</Text>
          </View>
        </View>

        {/* Contact & Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Location</Text>
          <View style={styles.sectionContent}>
            <View style={styles.metaRow}>
              <Phone size={16} color="#0040a1" strokeWidth={2} />
              <Text style={styles.metaText}>{consumer.mobile}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metaRow}>
              <MapPin size={16} color="#0040a1" strokeWidth={2} />
              <Text style={styles.metaText}>{consumer.address}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metaRow}>
              <Droplets size={16} color="#0040a1" strokeWidth={2} />
              <Text style={styles.metaText}>{consumer.ward}, {consumer.area}</Text>
            </View>
          </View>
        </View>

        {/* Connection Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Details</Text>
          <View style={styles.sectionContent}>
            <InfoRow label="Connection Type" value={consumer.connectionType} />
            <View style={styles.divider} />
            <InfoRow label="Meter Number" value={consumer.meterNumber} />
            <View style={styles.divider} />
            <InfoRow label="Connection Date" value={consumer.connectionDate} />
          </View>
        </View>

        {/* Related Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Related Records</Text>
          <Pressable
            style={styles.relatedRow}
            onPress={() =>
              router.push({
                pathname: "/(employee)/complaints" as any,
                params: { search: consumer.consumerNumber },
              })
            }
          >
            <View style={styles.relatedIcon}>
              <AlertCircle size={16} color="#dc2626" strokeWidth={2} />
            </View>
            <Text style={styles.relatedText}>View Related Complaints</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={styles.relatedRow}
            onPress={() =>
              router.push({
                pathname: "/(employee)/applications" as any,
              })
            }
          >
            <View style={styles.relatedIcon}>
              <FileText size={16} color="#0040a1" strokeWidth={2} />
            </View>
            <Text style={styles.relatedText}>View Service Applications</Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },

  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },

  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  profileCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 14,
    gap: 6,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: "#fff" },
  profileName: { fontSize: 19, fontWeight: "700", color: "#111827" },
  profileNum: { fontSize: 13, color: "#64748b" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: "700" },

  section: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 12 },
  sectionContent: { gap: 0 },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 10 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  metaText: { fontSize: 14, color: "#374151", flex: 1 },
  infoRow: {},
  infoLabel: { fontSize: 11, color: "#94a3b8", marginBottom: 3 },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#111827" },

  relatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  relatedIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  relatedText: { fontSize: 14, fontWeight: "600", color: "#374151" },
});
