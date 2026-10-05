import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  UserCheck,
  Waves,
  Cog,
  Scan,
  TrendingUp,
  FlaskConical,
  X,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";

interface InfraNode {
  id: string;
  title: string;
  subtitle: string;
  metric: string;
  metricIsAlert?: boolean;
  status: "Operational" | "Maintenance" | "Offline";
  iconType: "dam" | "pump" | "bpt" | "pipeline" | "wtp";
  details: {
    capacity?: string;
    flowRate?: string;
    pressure?: string;
    quality?: string;
    lastInspection: string;
    notes: string;
  };
}

export default function WaterInfrastructureFlowScreen() {
  const router = useRouter();

  // Selected node for telemetry detail view
  const [selectedNode, setSelectedNode] = useState<InfraNode | null>(null);

  const nodes: InfraNode[] = [
    {
      id: "pus-dam",
      title: "Pus Dam",
      subtitle: "Raw Water Source",
      metric: "Level: 95%",
      status: "Operational",
      iconType: "dam",
      details: {
        capacity: "450 MLD (Reservoir Volume)",
        flowRate: "420 L/s intake",
        pressure: "14.2 bar",
        lastInspection: "Oct 22, 2026 by Er. Kulkarni",
        notes: "Sufficient monsoon reserve. Normal inflow rate maintained.",
      },
    },
    {
      id: "raw-pumping",
      title: "Raw Water Pumping",
      subtitle: "Pumping Station",
      metric: "Flow: 450 L/s",
      status: "Operational",
      iconType: "pump",
      details: {
        capacity: "3 × 150 kW High-Volume Turbines",
        flowRate: "450 L/s nominal",
        pressure: "11.8 bar",
        lastInspection: "Oct 24, 2026 (Daily Check)",
        notes: "Turbine 1 & 2 operational. Turbine 3 on standby reserve.",
      },
    },
    {
      id: "bpt",
      title: "BPT",
      subtitle: "Break Pressure Tank",
      metric: "Issue Detected",
      metricIsAlert: true,
      status: "Maintenance",
      iconType: "bpt",
      details: {
        capacity: "1.2 ML Surge Buffer",
        flowRate: "390 L/s (throttled)",
        pressure: "Warning: Back-pressure spike detected",
        lastInspection: "Oct 25, 2026 • 08:30 AM",
        notes: "Valve #3 actuator jammed. Field technician dispatched for bypass alignment.",
      },
    },
    {
      id: "gravity-main",
      title: "Gravity Main",
      subtitle: "Pipeline",
      metric: "Flow: Stable",
      status: "Operational",
      iconType: "pipeline",
      details: {
        capacity: "900mm Prestressed Concrete Trunk",
        flowRate: "Stable (410 L/s)",
        pressure: "7.4 bar",
        lastInspection: "Oct 23, 2026",
        notes: "Acoustic leak monitoring sensors reporting 0 anomalies.",
      },
    },
    {
      id: "wtp",
      title: "WTP",
      subtitle: "Water Treatment Plant",
      metric: "Quality: High",
      status: "Operational",
      iconType: "wtp",
      details: {
        capacity: "350 MLD Filtration Capacity",
        quality: "Turbidity 0.4 NTU | Residual Chlorine 1.2 ppm",
        lastInspection: "Oct 25, 2026 • 09:00 AM Lab Sample",
        notes: "All potable water standards satisfied under WHO & BIS guidelines.",
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.avatarCircle}>
            <UserCheck size={18} color="#0040a1" strokeWidth={2.2} />
          </View>
          <Text style={styles.brandTitle}>Municipal Services</Text>
        </View>
        <Pressable
          style={styles.bellBtn}
          onPress={() => router.push("/(employee)/notifications" as any)}
        >
          <Bell size={20} color="#0040a1" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title & Subtitle */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Water Infrastructure Flow</Text>
          <Text style={styles.pageSubtitle}>
            Live status monitoring of the municipal water distribution network.
          </Text>
        </View>

        {/* List of Infrastructure Cards */}
        <View style={styles.nodesList}>
          {nodes.map((node) => {
            const isMaintenance = node.status === "Maintenance";
            return (
              <Pressable
                key={node.id}
                style={({ pressed }) => [
                  styles.nodeCard,
                  pressed && styles.nodeCardPressed,
                ]}
                onPress={() => setSelectedNode(node)}
              >
                {/* Left Icon Circle */}
                <View
                  style={[
                    styles.iconCircle,
                    isMaintenance ? styles.iconCircleGrey : styles.iconCircleBlue,
                  ]}
                >
                  {node.iconType === "dam" ? (
                    <Waves size={20} color="#ffffff" strokeWidth={2.2} />
                  ) : node.iconType === "pump" ? (
                    <Cog size={20} color="#ffffff" strokeWidth={2.2} />
                  ) : node.iconType === "bpt" ? (
                    <Scan size={20} color="#64748b" strokeWidth={2.2} />
                  ) : node.iconType === "pipeline" ? (
                    <TrendingUp size={20} color="#ffffff" strokeWidth={2.2} />
                  ) : (
                    <FlaskConical size={20} color="#ffffff" strokeWidth={2.2} />
                  )}
                </View>

                {/* Content */}
                <View style={styles.nodeContent}>
                  {/* Top Line: Title + Status Badge */}
                  <View style={styles.nodeTopRow}>
                    <Text style={styles.nodeTitle}>{node.title}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        isMaintenance
                          ? styles.statusPillMaintenance
                          : styles.statusPillOperational,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          isMaintenance
                            ? styles.statusTextMaintenance
                            : styles.statusTextOperational,
                        ]}
                      >
                        {node.status}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom Line: Subtitle + Metric */}
                  <View style={styles.nodeBottomRow}>
                    <Text style={styles.nodeSubtitle}>{node.subtitle}</Text>
                    <Text
                      style={[
                        styles.nodeMetric,
                        node.metricIsAlert ? styles.nodeMetricAlert : null,
                      ]}
                    >
                      {node.metric}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Telemetry Detail Modal */}
      <Modal visible={!!selectedNode} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedNode && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalHeaderTitleRow}>
                    <Text style={styles.modalTitle}>{selectedNode.title}</Text>
                    <View
                      style={[
                        styles.statusPill,
                        selectedNode.status === "Maintenance"
                          ? styles.statusPillMaintenance
                          : styles.statusPillOperational,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          selectedNode.status === "Maintenance"
                            ? styles.statusTextMaintenance
                            : styles.statusTextOperational,
                        ]}
                      >
                        {selectedNode.status}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => setSelectedNode(null)}>
                    <X size={20} color="#64748b" />
                  </Pressable>
                </View>

                <Text style={styles.modalSubtitle}>
                  {selectedNode.subtitle} • Real-time municipal telemetry stream
                </Text>

                <View style={styles.telemetryGrid}>
                  {selectedNode.details.capacity && (
                    <View style={styles.telemetryBox}>
                      <Text style={styles.telemetryLabel}>Capacity</Text>
                      <Text style={styles.telemetryValue}>
                        {selectedNode.details.capacity}
                      </Text>
                    </View>
                  )}
                  {selectedNode.details.flowRate && (
                    <View style={styles.telemetryBox}>
                      <Text style={styles.telemetryLabel}>Current Flow</Text>
                      <Text style={styles.telemetryValue}>
                        {selectedNode.details.flowRate}
                      </Text>
                    </View>
                  )}
                  {selectedNode.details.pressure && (
                    <View style={styles.telemetryBox}>
                      <Text style={styles.telemetryLabel}>Pressure / Gauge</Text>
                      <Text style={styles.telemetryValue}>
                        {selectedNode.details.pressure}
                      </Text>
                    </View>
                  )}
                  {selectedNode.details.quality && (
                    <View style={styles.telemetryBox}>
                      <Text style={styles.telemetryLabel}>Water Quality</Text>
                      <Text style={styles.telemetryValue}>
                        {selectedNode.details.quality}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.inspectionCard}>
                  <Text style={styles.inspectionTitle}>Last Inspection</Text>
                  <Text style={styles.inspectionText}>
                    {selectedNode.details.lastInspection}
                  </Text>
                  <Text style={styles.notesText}>{selectedNode.details.notes}</Text>
                </View>

                {selectedNode.status === "Maintenance" && (
                  <Pressable
                    style={styles.actionBtnAlert}
                    onPress={() => {
                      Alert.alert(
                        "Technician Alert",
                        "Priority maintenance dispatch notified for BPT Valve #3."
                      );
                      setSelectedNode(null);
                    }}
                  >
                    <AlertTriangle size={18} color="#ffffff" strokeWidth={2} />
                    <Text style={styles.actionBtnText}>
                      Dispatch Emergency Technician
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  style={styles.closeBtn}
                  onPress={() => setSelectedNode(null)}
                >
                  <Text style={styles.closeBtnText}>Close Telemetry</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0040a1",
  },
  bellBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // Header Section
  headerSection: {
    gap: 6,
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },

  // Nodes List
  nodesList: {
    gap: 14,
  },
  nodeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  nodeCardPressed: {
    backgroundColor: "#f8fafc",
    transform: [{ scale: 0.995 }],
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleBlue: {
    backgroundColor: "#0040a1",
  },
  iconCircleGrey: {
    backgroundColor: "#e2e8f0",
  },
  nodeContent: {
    flex: 1,
    gap: 8,
  },
  nodeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nodeTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillOperational: {
    backgroundColor: "#8ef2db",
  },
  statusPillMaintenance: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextOperational: {
    color: "#0f766e",
  },
  statusTextMaintenance: {
    color: "#991b1b",
  },
  nodeBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nodeSubtitle: {
    fontSize: 13,
    color: "#475569",
  },
  nodeMetric: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  nodeMetricAlert: {
    color: "#dc2626",
    fontWeight: "700",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  telemetryGrid: {
    gap: 8,
    marginTop: 4,
  },
  telemetryBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  telemetryLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
  },
  telemetryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    marginTop: 2,
  },
  inspectionCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bfdbfe",
    gap: 4,
  },
  inspectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0040a1",
  },
  inspectionText: {
    fontSize: 12,
    color: "#1e293b",
    fontWeight: "500",
  },
  notesText: {
    fontSize: 12,
    color: "#475569",
    marginTop: 4,
    lineHeight: 16,
  },
  actionBtnAlert: {
    backgroundColor: "#dc2626",
    height: 44,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  actionBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  closeBtn: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
});
