import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ClipboardList, AlertTriangle, CheckCircle, Clock } from "lucide-react-native";

export default function ComplaintsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grievance Management</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <ClipboardList size={32} color="#0649aa" />
          <Text style={styles.title}>Citizen Complaints & Escalations</Text>
          <Text style={styles.sub}>
            Triage, assign, and track SLA resolution times across all administrative zones.
          </Text>
        </View>

        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Clock size={20} color="#d97706" />
            <Text style={styles.statVal}>342</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <AlertTriangle size={20} color="#dc2626" />
            <Text style={styles.statVal}>28</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          <View style={styles.statCard}>
            <CheckCircle size={20} color="#059669" />
            <Text style={styles.statVal}>1,245</Text>
            <Text style={styles.statLabel}>Resolved</Text>
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
