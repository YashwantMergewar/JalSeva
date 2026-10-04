import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Megaphone,
  Wrench,
  Droplets,
  Waves,
  Gauge,
  FlaskConical,
  ChevronRight,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";

export default function ComplaintsHomeScreen() {
  const router = useRouter();

  // Mock complaints matching Screenshot 2
  const [complaints] = useState([
    {
      id: "cmp-4432",
      complaintNumber: "CMP-2023-8472",
      category: "Pipeline Leakage",
      date: "Oct 24, 2023",
      status: "Pending Review",
      statusType: "pending",
      icon: "leakage",
    },
    {
      id: "cmp-6190",
      complaintNumber: "CMP-2023-6190",
      category: "Pipeline Breakdown",
      date: "Sep 15, 2023",
      status: "Resolved",
      statusType: "resolved",
      icon: "breakdown",
    },
  ]);

  const handleCategoryPress = (categoryName: string) => {
    router.push({
      pathname: "/(citizen)/submit-complaint" as any,
      params: { category: categoryName },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Municipal Water" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Report a Water Issue Hero Card (Screenshot 2 Match) ── */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Report a Water Issue</Text>
          <Text style={styles.heroSubtitle}>
            Help us maintain the city's water infrastructure by reporting problems promptly.
          </Text>
          <Pressable
            style={styles.reportBtn}
            onPress={() => router.push("/(citizen)/submit-complaint" as any)}
            accessibilityRole="button"
            accessibilityLabel="Report a Problem"
          >
            <Megaphone size={18} color="#ffffff" strokeWidth={2} />
            <Text style={styles.reportBtnText}>Report a Problem</Text>
          </Pressable>
        </View>

        {/* ── Common Complaints (2 Columns x 3 Rows) ── */}
        <Text style={styles.sectionHeading}>Common Complaints</Text>

        <View style={styles.categoriesGrid}>
          {/* 1. Pipeline Breakdown */}
          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("Pipeline Breakdown")}
            accessibilityRole="button"
          >
            <Wrench size={24} color="#0056d2" strokeWidth={2.2} />
            <Text style={styles.categoryName}>Pipeline Breakdown</Text>
          </Pressable>

          {/* 2. Pump Breakdown */}
          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("Pump Breakdown")}
            accessibilityRole="button"
          >
            <Wrench size={24} color="#0056d2" strokeWidth={2.2} />
            <Text style={styles.categoryName}>Pump Breakdown</Text>
          </Pressable>

          {/* 3. Pipeline Leakage */}
          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("Pipeline Leakage")}
            accessibilityRole="button"
          >
            <Droplets size={24} color="#0056d2" strokeWidth={2.2} />
            <Text style={styles.categoryName}>Pipeline Leakage</Text>
          </Pressable>

          {/* 4. Dirty Water */}
          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("Dirty Water")}
            accessibilityRole="button"
          >
            <Waves size={24} color="#0056d2" strokeWidth={2.2} />
            <Text style={styles.categoryName}>Dirty Water</Text>
          </Pressable>

          {/* 5. Low Pressure */}
          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("Low Pressure")}
            accessibilityRole="button"
          >
            <Gauge size={24} color="#0056d2" strokeWidth={2.2} />
            <Text style={styles.categoryName}>Low Pressure</Text>
          </Pressable>

          {/* 6. Water Quality */}
          <Pressable
            style={styles.categoryCard}
            onPress={() => handleCategoryPress("Water Quality")}
            accessibilityRole="button"
          >
            <FlaskConical size={24} color="#0056d2" strokeWidth={2.2} />
            <Text style={styles.categoryName}>Water Quality</Text>
          </Pressable>
        </View>

        {/* ── My Recent Complaints (with View All) ── */}
        <View style={styles.recentHeaderRow}>
          <Text style={styles.sectionHeading}>My Recent Complaints</Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>

        {complaints.map((item) => (
          <Pressable
            key={item.id}
            style={styles.complaintCard}
            onPress={() =>
              router.push({
                pathname: "/(citizen)/complaint-details" as any,
                params: { id: item.id },
              })
            }
          >
            <View style={styles.complaintLeftIconWrap}>
              {item.icon === "leakage" ? (
                <Droplets size={20} color="#0056d2" />
              ) : (
                <Wrench size={20} color="#0056d2" />
              )}
            </View>

            <View style={styles.complaintDetailsCol}>
              <Text style={styles.complaintCategoryText}>{item.category}</Text>
              <Text style={styles.complaintSubText}>
                {item.complaintNumber} • {item.date}
              </Text>
              <View
                style={[
                  styles.statusBadgePill,
                  item.statusType === "pending"
                    ? styles.badgePending
                    : styles.badgeResolved,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    item.statusType === "pending"
                      ? styles.badgeTextPending
                      : styles.badgeTextResolved,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <ChevronRight size={18} color="#475569" />
          </Pressable>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 16,
  },

  /* Hero Card */
  heroCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0040a1",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  reportBtn: {
    backgroundColor: "#0040a1",
    height: 44,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 24,
  },
  reportBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Common Complaints */
  sectionHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 14,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  categoryCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
  },

  /* My Recent Complaints */
  recentHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    color: "#0040a1",
    fontWeight: "600",
  },
  complaintCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  complaintLeftIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  complaintDetailsCol: {
    flex: 1,
    gap: 3,
  },
  complaintCategoryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  complaintSubText: {
    fontSize: 12,
    color: "#64748b",
  },
  statusBadgePill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 4,
  },
  badgePending: {
    backgroundColor: "#8df1e0",
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeTextPending: {
    fontSize: 11,
    color: "#004d40",
    fontWeight: "600",
  },
  badgeResolved: {
    backgroundColor: "#dcfce7",
  },
  badgeTextResolved: {
    fontSize: 11,
    color: "#166534",
    fontWeight: "600",
  },
});
