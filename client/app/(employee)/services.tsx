import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Waves,
  CalendarDays,
  Users,
  FileCheck2,
  GitFork,
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  Bell,
  UserCheck,
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function ServicesHubScreen() {
  const router = useRouter();

  const services = [
    {
      id: "infra",
      title: "Water Infrastructure Flow",
      subtitle: "Live telemetry, dam levels, pumping flow, & pipeline status",
      badge: "Real-Time",
      badgeColor: "#16a34a",
      badgeBg: "#dcfce7",
      icon: <Waves size={24} color="#0040a1" strokeWidth={2} />,
      iconBg: "#dbeafe",
      route: "/(employee)/infrastructure",
    },
    {
      id: "schedules",
      title: "Water Schedule Management",
      subtitle: "Configure supply hours, zone timings, & publish announcements",
      badge: "12 Zones Active",
      badgeColor: "#0284c7",
      badgeBg: "#e0f2fe",
      icon: <CalendarDays size={24} color="#0284c7" strokeWidth={2} />,
      iconBg: "#e0f2fe",
      route: "/(employee)/schedules",
    },
    {
      id: "consumers",
      title: "Consumer Directory",
      subtitle: "Search 150+ connections, meters, active status & history",
      badge: "Directory",
      badgeColor: "#006b5f",
      badgeBg: "#ccfbf1",
      icon: <Users size={24} color="#006b5f" strokeWidth={2} />,
      iconBg: "#ccfbf1",
      route: "/(employee)/consumers",
    },
    {
      id: "field-report",
      title: "Field Reports & Inspections",
      subtitle: "Step-by-step verification, observations, photos & resolutions",
      badge: "Work Orders",
      badgeColor: "#7c3aed",
      badgeBg: "#ede9fe",
      icon: <FileCheck2 size={24} color="#7c3aed" strokeWidth={2} />,
      iconBg: "#ede9fe",
      route: "/(employee)/field-report",
    },
    {
      id: "applications",
      title: "Connection Applications",
      subtitle: "Review new water connection, name change & sewer requests",
      badge: "Approvals",
      badgeColor: "#ea580c",
      badgeBg: "#ffedd5",
      icon: <GitFork size={24} color="#ea580c" strokeWidth={2} />,
      iconBg: "#ffedd5",
      route: "/(employee)/applications",
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <View style={styles.avatarCircle}>
            <UserCheck size={18} color="#ffffff" strokeWidth={2.2} />
          </View>
          <Text style={styles.brandTitle}>Municipal Services</Text>
        </View>
        <Pressable
          style={styles.bellBtn}
          onPress={() => router.push("/(employee)/notifications" as any)}
        >
          <Bell size={20} color="#0040a1" strokeWidth={2} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Municipal Operations</Text>
          <Text style={styles.subtitle}>
            Field engineering tools, water network monitoring, and consumer services portal.
          </Text>
        </View>

        {/* Status Highlights */}
        <View style={styles.statusBanner}>
          <View style={styles.statusLeft}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusBannerTitle}>Municipal Network Live</Text>
          </View>
          <Text style={styles.statusBannerSub}>Zone 4 telemetry synched 2m ago</Text>
        </View>

        {/* Services List */}
        <View style={styles.servicesGrid}>
          {services.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.serviceCard,
                pressed && styles.serviceCardPressed,
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconWrap, { backgroundColor: item.iconBg }]}>
                {item.icon}
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.serviceName}>{item.title}</Text>
                  <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
                    <Text style={[styles.badgeText, { color: item.badgeColor }]}>
                      {item.badge}
                    </Text>
                  </View>
                </View>
                <Text style={styles.serviceDesc}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={18} color="#94a3b8" strokeWidth={2} />
            </Pressable>
          ))}
        </View>

        {/* Staff Verification Badge */}
        <View style={styles.footerNote}>
          <ShieldCheck size={16} color="#64748b" strokeWidth={2} />
          <Text style={styles.footerNoteText}>
            Authorized Staff Access • Operations logged under municipal audit log
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
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
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0040a1",
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#dc2626",
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 19,
    marginTop: 4,
  },
  statusBanner: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#16a34a",
  },
  statusBannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
  statusBannerSub: {
    fontSize: 11,
    color: "#64748b",
  },
  servicesGrid: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  serviceCardPressed: {
    backgroundColor: "#f8fafc",
    transform: [{ scale: 0.995 }],
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  serviceDesc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  footerNoteText: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
  },
});
