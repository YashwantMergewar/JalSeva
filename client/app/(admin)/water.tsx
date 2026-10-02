import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Droplets, Activity, Gauge, AlertCircle } from "lucide-react-native";

export default function WaterScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Water Management</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Droplets size={32} color="#0649aa" />
          <Text style={styles.title}>Municipal Water Monitoring</Text>
          <Text style={styles.sub}>
            Real-time telemetry, reservoir level telemetry, and flow pressure
            sensors across zones.
          </Text>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Gauge size={20} color="#059669" />
            <Text style={styles.statVal}>98.2 PSI</Text>
            <Text style={styles.statLabel}>Avg Pressure</Text>
          </View>
          <View style={styles.statCard}>
            <Activity size={20} color="#0649aa" />
            <Text style={styles.statVal}>84.5%</Text>
            <Text style={styles.statLabel}>Reservoir Level</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  content: { padding: 16, gap: 14 },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  sub: { fontSize: 13, color: "#64748b", textAlign: "center", lineHeight: 18 },
  statGrid: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    gap: 6,
  },
  statVal: { fontSize: 16, fontWeight: "800", color: "#0f172a" },
  statLabel: { fontSize: 11, color: "#64748b" },
});
