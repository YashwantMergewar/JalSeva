import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Users,
  MapPin,
  Zap,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react-native";
import { useRouter } from "expo-router";

interface EscalationItem {
  id: string;
  badge: string;
  badgeType: "breached" | "high";
  timeAgo: string;
  title: string;
  description: string;
  location: string;
  iconType: "pin" | "zap";
  acknowledged: boolean;
}

export default function ExecutiveDashboardScreen() {
  const router = useRouter();

  // Escalations state
  const [escalations, setEscalations] = useState<EscalationItem[]>([
    {
      id: "esc-1",
      badge: "SLA BREACHED",
      badgeType: "breached",
      timeAgo: "10 mins ago",
      title: "Major Water Main Burst - Sector 4",
      description:
        "Severe flooding reported near the main commercial district. Traffic severely impacted....",
      location: "Sector 4, Central District",
      iconType: "pin",
      acknowledged: false,
    },
    {
      id: "esc-2",
      badge: "HIGH PRIORITY",
      badgeType: "high",
      timeAgo: "45 mins ago",
      title: "Power Outage - Hospital Zone",
      description:
        "Multiple reports of power failure affecting City General Hospital and surrounding blocks....",
      location: "Electrical Dept",
      iconType: "zap",
      acknowledged: false,
    },
  ]);

  const handleAcknowledge = (id: string, title: string) => {
    setEscalations((prev) =>
      prev.map((e) => (e.id === id ? { ...e, acknowledged: true } : e))
    );
    Alert.alert(
      "Escalation Acknowledged",
      `Emergency protocol initiated for: ${title}. Response team notified.`
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
            }}
            style={styles.avatarImg}
          />
          <Text style={styles.brandTitle}>Municipal Services</Text>
        </View>
        <Pressable
          style={styles.bellBtn}
          onPress={() => router.push("/(employee)/notifications" as any)}
        >
          <Bell size={20} color="#0f172a" strokeWidth={2} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Executive Dashboard</Text>
          <Text style={styles.pageSubtitle}>
            Real-time overview of municipal operations and critical escalations.
          </Text>
          <Text style={styles.lastUpdatedText}>
            Last updated: <Text style={styles.lastUpdatedHighlight}>Just now</Text>
          </Text>
        </View>

        {/* 2x2 KPI Grid */}
        <View style={styles.kpiGrid}>
          {/* Card 1: Total Complaints */}
          <Pressable
            style={styles.kpiCard}
            onPress={() => router.push("/(employee)/complaints" as any)}
          >
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiLabel}>Total{"\n"}Complaints</Text>
              <ClipboardList size={20} color="#0040a1" strokeWidth={2} />
            </View>
            <Text style={styles.kpiValue}>1,245</Text>
            <View style={styles.kpiSubRow}>
              <TrendingDown size={14} color="#16a34a" strokeWidth={2.5} />
              <Text style={styles.kpiSubGreen}>5% vs last week</Text>
            </View>
          </Pressable>

          {/* Card 2: Resolved Rate */}
          <Pressable
            style={styles.kpiCard}
            onPress={() => router.push("/(employee)/complaints" as any)}
          >
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiLabel}>Resolved Rate</Text>
              <CheckCircle2 size={20} color="#16a34a" strokeWidth={2} />
            </View>
            <Text style={styles.kpiValue}>82%</Text>
            <View style={styles.kpiSubRow}>
              <TrendingUp size={14} color="#16a34a" strokeWidth={2.5} />
              <Text style={styles.kpiSubGreen}>2% vs last week</Text>
            </View>
          </Pressable>

          {/* Card 3: Critical Escalations */}
          <Pressable
            style={[styles.kpiCard, styles.kpiCardAlert]}
            onPress={() => router.push("/(employee)/complaints" as any)}
          >
            <View style={styles.kpiTopRow}>
              <Text style={[styles.kpiLabel, styles.kpiLabelAlert]}>
                Critical{"\n"}Escalations
              </Text>
              <AlertTriangle size={20} color="#dc2626" strokeWidth={2} />
            </View>
            <Text style={[styles.kpiValue, styles.kpiValueAlert]}>12</Text>
            <View style={styles.kpiSubRow}>
              <TrendingUp size={14} color="#dc2626" strokeWidth={2.5} />
              <Text style={styles.kpiSubRed}>Requires Attention</Text>
            </View>
          </Pressable>

          {/* Card 4: Staff Active */}
          <Pressable
            style={styles.kpiCard}
            onPress={() => router.push("/(employee)/tasks" as any)}
          >
            <View style={styles.kpiTopRow}>
              <Text style={styles.kpiLabel}>Staff Active</Text>
              <Users size={20} color="#0040a1" strokeWidth={2} />
            </View>
            <Text style={styles.kpiValue}>432</Text>
            <View style={styles.kpiSubRow}>
              <Clock size={13} color="#64748b" strokeWidth={2} />
              <Text style={styles.kpiSubGray}>On shift currently</Text>
            </View>
          </Pressable>
        </View>

        {/* Critical Escalations Section */}
        <View style={styles.escalationsCard}>
          {/* Card Header */}
          <View style={styles.escalationsHeader}>
            <View style={styles.escalationsTitleRow}>
              <AlertCircle size={20} color="#dc2626" strokeWidth={2.2} />
              <Text style={styles.escalationsTitle}>Critical Escalations</Text>
            </View>
            <Pressable
              onPress={() => router.push("/(employee)/complaints" as any)}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </Pressable>
          </View>

          {/* List of Escalations */}
          <View style={styles.escalationsList}>
            {escalations.map((item, idx) => {
              const isLast = idx === escalations.length - 1;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.escalationItem,
                    !isLast && styles.escalationItemBorder,
                  ]}
                >
                  {/* Badge & Timestamp */}
                  <View style={styles.escBadgeRow}>
                    <View
                      style={[
                        styles.escBadge,
                        item.badgeType === "breached"
                          ? styles.escBadgeBreached
                          : styles.escBadgeHigh,
                      ]}
                    >
                      <Text
                        style={[
                          styles.escBadgeText,
                          item.badgeType === "breached"
                            ? styles.escBadgeTextBreached
                            : styles.escBadgeTextHigh,
                        ]}
                      >
                        {item.badge}
                      </Text>
                    </View>
                    <Text style={styles.escTimeText}>{item.timeAgo}</Text>
                  </View>

                  {/* Title & Body */}
                  <Text style={styles.escTitle}>{item.title}</Text>
                  <Text style={styles.escBody} numberOfLines={2}>
                    {item.description}
                  </Text>

                  {/* Location & Action Button */}
                  <View style={styles.escFooterRow}>
                    <View style={styles.escLocationRow}>
                      {item.iconType === "pin" ? (
                        <MapPin size={14} color="#64748b" strokeWidth={2} />
                      ) : (
                        <Zap size={14} color="#64748b" strokeWidth={2} />
                      )}
                      <Text style={styles.escLocationText}>{item.location}</Text>
                    </View>

                    <Pressable
                      style={[
                        styles.ackBtn,
                        item.acknowledged && styles.ackBtnDone,
                      ]}
                      onPress={() =>
                        !item.acknowledged &&
                        handleAcknowledge(item.id, item.title)
                      }
                      disabled={item.acknowledged}
                    >
                      <Text style={styles.ackBtnText}>
                        {item.acknowledged ? "Acknowledged ✓" : "Acknowledge"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Department Efficiency Section */}
        <View style={styles.efficiencyCard}>
          <Text style={styles.efficiencyTitle}>Department Efficiency</Text>

          {/* Bar Chart Container */}
          <View style={styles.chartContainer}>
            <View style={styles.barsGroup}>
              {/* Water */}
              <View style={styles.barColumn}>
                <View style={[styles.bar, { height: 86, backgroundColor: "#0040a1" }]} />
              </View>
              {/* Power */}
              <View style={styles.barColumn}>
                <View style={[styles.bar, { height: 68, backgroundColor: "#047857" }]} />
              </View>
              {/* Waste */}
              <View style={styles.barColumn}>
                <View style={[styles.bar, { height: 98, backgroundColor: "#a5b4fc" }]} />
              </View>
              {/* Sanitation */}
              <View style={styles.barColumn}>
                <View style={[styles.bar, { height: 50, backgroundColor: "#5eead4" }]} />
              </View>
              {/* Admin */}
              <View style={styles.barColumn}>
                <View style={[styles.bar, { height: 74, backgroundColor: "#3f3f46" }]} />
              </View>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#0040a1" }]} />
              <Text style={styles.legendText}>Water</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#047857" }]} />
              <Text style={styles.legendText}>Power</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#a5b4fc" }]} />
              <Text style={styles.legendText}>Waste</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  avatarImg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e2e8f0",
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
    position: "relative",
  },
  bellDot: {
    position: "absolute",
    top: 6,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#dc2626",
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
    gap: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  lastUpdatedHighlight: {
    color: "#0040a1",
    fontWeight: "700",
  },

  // 2x2 KPI Grid
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  kpiCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
  },
  kpiCardAlert: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
  },
  kpiTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    lineHeight: 16,
  },
  kpiLabelAlert: {
    color: "#991b1b",
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },
  kpiValueAlert: {
    color: "#dc2626",
  },
  kpiSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  kpiSubGreen: {
    fontSize: 11,
    fontWeight: "600",
    color: "#16a34a",
  },
  kpiSubRed: {
    fontSize: 11,
    fontWeight: "700",
    color: "#dc2626",
  },
  kpiSubGray: {
    fontSize: 11,
    color: "#64748b",
  },

  // Critical Escalations Card
  escalationsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  escalationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  escalationsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  escalationsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0040a1",
  },
  escalationsList: {},
  escalationItem: {
    padding: 16,
    gap: 8,
  },
  escalationItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  escBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  escBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  escBadgeBreached: {
    backgroundColor: "#fee2e2",
  },
  escBadgeHigh: {
    backgroundColor: "#ffedd5",
  },
  escBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  escBadgeTextBreached: {
    color: "#dc2626",
  },
  escBadgeTextHigh: {
    color: "#ea580c",
  },
  escTimeText: {
    fontSize: 12,
    color: "#64748b",
  },
  escTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  escBody: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  escFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  escLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  escLocationText: {
    fontSize: 12,
    color: "#475569",
  },
  ackBtn: {
    backgroundColor: "#0040a1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  ackBtnDone: {
    backgroundColor: "#16a34a",
  },
  ackBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },

  // Department Efficiency Card
  efficiencyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    gap: 16,
  },
  efficiencyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
  },
  chartContainer: {
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    height: 140,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  barsGroup: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  barColumn: {
    alignItems: "center",
  },
  bar: {
    width: 28,
    borderRadius: 3,
  },
  chartLegend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
});
