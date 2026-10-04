import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Megaphone,
  Share2,
  Clock,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  X,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import StatusBadge from "../components/StatusBadge";
import {
  mockAnnouncement,
  mockTodaySchedules,
  mockUpcomingSchedules,
  mockWeeklySchedules,
  MUNICIPAL_WARDS,
  WaterScheduleItem,
} from "../services/waterSchedule.service";

export default function WaterScheduleScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"today" | "upcoming" | "weekly">("today");
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [showWardModal, setShowWardModal] = useState(false);
  const [selectedScheduleDetail, setSelectedScheduleDetail] = useState<WaterScheduleItem | null>(null);

  const mainSchedule = mockTodaySchedules[0]; // Sector 12, Phase 2
  const otherSchedules = mockTodaySchedules.slice(1);

  const filteredOtherSchedules = selectedWard
    ? otherSchedules.filter((s) => s.wardNumber === selectedWard)
    : otherSchedules;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Jal Seva Water Supply Schedule for ${mainSchedule.areaName}: Supply Time ${mainSchedule.startTime} - ${mainSchedule.endTime} (${mainSchedule.duration}). Status: ${mainSchedule.status}.`,
      });
    } catch {
      // User cancelled
    }
  };

  const handleReportIssue = (schedule: WaterScheduleItem) => {
    router.push({
      pathname: "/(citizen)/submit-complaint" as any,
      params: {
        category: "Low Pressure",
        location: schedule.areaName,
        ward: schedule.wardName,
      },
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
        {/* ── Important Announcement Banner ── */}
        <View style={styles.announcementBanner}>
          <View style={styles.announcementIconWrap}>
            <Megaphone size={20} color="#ba1a1a" strokeWidth={2} />
          </View>
          <View style={styles.announcementTextWrap}>
            <Text style={styles.announcementTitle}>{mockAnnouncement.title}</Text>
            <Text style={styles.announcementDesc}>{mockAnnouncement.description}</Text>
          </View>
        </View>

        {/* ── Screen Heading & Filter ── */}
        <View style={styles.headingRow}>
          <Text style={styles.screenHeading}>Water Schedule</Text>
          <Pressable
            style={styles.wardFilterBtn}
            onPress={() => setShowWardModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Filter by Ward"
          >
            <Filter size={15} color="#0040a1" />
            <Text style={styles.wardFilterText}>
              {selectedWard ? `Ward ${selectedWard}` : "All 15 Wards"}
            </Text>
          </Pressable>
        </View>

        {/* ── Tabs: Today's Schedule | Upcoming | Weekly ── */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tabItem, activeTab === "today" && styles.tabItemActive]}
            onPress={() => setActiveTab("today")}
          >
            <Text
              style={[styles.tabText, activeTab === "today" && styles.tabTextActive]}
            >
              Today's Schedule
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, activeTab === "upcoming" && styles.tabItemActive]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text
              style={[styles.tabText, activeTab === "upcoming" && styles.tabTextActive]}
            >
              Upcoming
            </Text>
          </Pressable>

          <Pressable
            style={[styles.tabItem, activeTab === "weekly" && styles.tabItemActive]}
            onPress={() => setActiveTab("weekly")}
          >
            <Text
              style={[styles.tabText, activeTab === "weekly" && styles.tabTextActive]}
            >
              Weekly
            </Text>
          </Pressable>
        </View>

        {/* ── Tab Content ── */}
        {activeTab === "today" && (
          <View>
            {/* Primary Citizen Ward Card */}
            <View style={styles.heroScheduleCard}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.areaTitle}>{mainSchedule.areaName}</Text>
                  <Text style={styles.areaDate}>Oct 24, 2026 • Tuesday</Text>
                </View>
                <StatusBadge status={mainSchedule.status} />
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Supply Time</Text>
                  <Text style={styles.statValue}>
                    {mainSchedule.startTime} - {mainSchedule.endTime}
                  </Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Duration</Text>
                  <Text style={styles.statValue}>{mainSchedule.duration}</Text>
                </View>
              </View>

              <View style={styles.actionButtonsRow}>
                <Pressable
                  style={styles.reportIssueBtn}
                  onPress={() => handleReportIssue(mainSchedule)}
                  accessibilityRole="button"
                  accessibilityLabel="Report Issue"
                >
                  <Text style={styles.reportIssueBtnText}>Report Issue</Text>
                </Pressable>

                <Pressable
                  style={styles.shareBtn}
                  onPress={handleShare}
                  accessibilityRole="button"
                  accessibilityLabel="Share Schedule"
                >
                  <Share2 size={20} color="#0040a1" strokeWidth={2} />
                </Pressable>
              </View>
            </View>

            {/* Other Areas Today List */}
            <View style={styles.otherAreasSection}>
              <Text style={styles.otherAreasTitle}>Other Areas Today</Text>

              {filteredOtherSchedules.map((schedule) => (
                <Pressable
                  key={schedule.id}
                  style={({ pressed }) => [
                    styles.areaListItem,
                    pressed && styles.areaListItemPressed,
                  ]}
                  onPress={() => setSelectedScheduleDetail(schedule)}
                >
                  <View style={styles.clockIconCircle}>
                    <Clock size={20} color="#64748b" strokeWidth={1.8} />
                  </View>

                  <View style={styles.areaListInfo}>
                    <Text style={styles.areaListName}>{schedule.areaName}</Text>
                    <Text style={styles.areaListTime}>
                      {schedule.startTime} - {schedule.endTime} • {schedule.duration}
                    </Text>
                  </View>

                  <View style={styles.areaListRight}>
                    {schedule.status === "Delayed" && (
                      <View style={styles.miniAlertPill}>
                        <Text style={styles.miniAlertText}>Delayed</Text>
                      </View>
                    )}
                    <ChevronRight size={18} color="#94a3b8" />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {activeTab === "upcoming" && (
          <View style={styles.upcomingList}>
            {mockUpcomingSchedules.map((item) => (
              <View key={item.id} style={styles.upcomingCard}>
                <View style={styles.upcomingTop}>
                  <View>
                    <Text style={styles.upcomingArea}>{item.areaName}</Text>
                    <Text style={styles.upcomingDay}>
                      {item.dayOfWeek} • {item.date}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} size="small" />
                </View>

                <View style={styles.upcomingTimeRow}>
                  <Clock size={16} color="#0056d2" />
                  <Text style={styles.upcomingTime}>
                    {item.startTime} - {item.endTime} ({item.duration})
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === "weekly" && (
          <View style={styles.weeklyCard}>
            <View style={styles.weeklyHeader}>
              <Calendar size={18} color="#0040a1" />
              <Text style={styles.weeklyTitle}>Ward 4 - Standard Weekly Roster</Text>
            </View>

            {mockWeeklySchedules.map((dayItem, idx) => (
              <View key={dayItem.day} style={styles.weeklyRow}>
                <View style={styles.weeklyDayCol}>
                  <Text style={styles.weeklyDayText}>{dayItem.day}</Text>
                  <Text style={styles.weeklyDateText}>{dayItem.date}</Text>
                </View>
                <Text style={styles.weeklyTimeText}>{dayItem.time}</Text>
                <View style={styles.weeklyStatusCol}>
                  <StatusBadge status={dayItem.status} size="small" />
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Ward Selector Modal ── */}
      <Modal
        visible={showWardModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWardModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Filter by Municipal Ward</Text>
              <Pressable onPress={() => setShowWardModal(false)} hitSlop={10}>
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 360 }}>
              <Pressable
                style={[
                  styles.wardModalItem,
                  selectedWard === null && styles.wardModalItemSelected,
                ]}
                onPress={() => {
                  setSelectedWard(null);
                  setShowWardModal(false);
                }}
              >
                <Text
                  style={[
                    styles.wardModalItemText,
                    selectedWard === null && styles.wardModalItemTextSelected,
                  ]}
                >
                  All Municipal Wards
                </Text>
                {selectedWard === null && <CheckCircle2 size={18} color="#0040a1" />}
              </Pressable>

              {MUNICIPAL_WARDS.map((ward) => (
                <Pressable
                  key={ward.id}
                  style={[
                    styles.wardModalItem,
                    selectedWard === ward.id && styles.wardModalItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedWard(ward.id);
                    setShowWardModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.wardModalItemText,
                      selectedWard === ward.id && styles.wardModalItemTextSelected,
                    ]}
                  >
                    {ward.name}
                  </Text>
                  {selectedWard === ward.id && <CheckCircle2 size={18} color="#0040a1" />}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Schedule Detail Modal ── */}
      <Modal
        visible={selectedScheduleDetail !== null}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedScheduleDetail(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeading}>Area Schedule Details</Text>
              <Pressable onPress={() => setSelectedScheduleDetail(null)} hitSlop={10}>
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            {selectedScheduleDetail && (
              <View style={styles.detailBody}>
                <Text style={styles.detailArea}>{selectedScheduleDetail.areaName}</Text>
                <Text style={styles.detailWard}>{selectedScheduleDetail.wardName}</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Supply Status:</Text>
                  <StatusBadge status={selectedScheduleDetail.status} size="small" />
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Slot Time:</Text>
                  <Text style={styles.detailValue}>
                    {selectedScheduleDetail.startTime} - {selectedScheduleDetail.endTime}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Standard Duration:</Text>
                  <Text style={styles.detailValue}>{selectedScheduleDetail.duration}</Text>
                </View>

                <Pressable
                  style={styles.detailActionBtn}
                  onPress={() => {
                    const item = selectedScheduleDetail;
                    setSelectedScheduleDetail(null);
                    handleReportIssue(item);
                  }}
                >
                  <Text style={styles.detailActionBtnText}>Report Issue for this Area</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
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

  /* Announcement Banner */
  announcementBanner: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  announcementIconWrap: {
    marginTop: 2,
  },
  announcementTextWrap: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ba1a1a",
    marginBottom: 4,
  },
  announcementDesc: {
    fontSize: 13,
    color: "#7f1d1d",
    lineHeight: 18,
  },

  /* Heading & Filter */
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  screenHeading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  wardFilterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  wardFilterText: {
    fontSize: 12,
    color: "#0040a1",
    fontWeight: "600",
  },

  /* Tab Bar */
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabItemActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: "#0040a1",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  tabTextActive: {
    color: "#0040a1",
    fontWeight: "700",
  },

  /* Hero Schedule Card */
  heroScheduleCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  areaDate: {
    fontSize: 13,
    color: "#64748b",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 10,
  },
  reportIssueBtn: {
    flex: 1,
    backgroundColor: "#0040a1",
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  reportIssueBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  shareBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Other Areas Section */
  otherAreasSection: {
    marginBottom: 16,
  },
  otherAreasTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 12,
  },
  areaListItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  areaListItemPressed: {
    backgroundColor: "#f8fafc",
  },
  clockIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  areaListInfo: {
    flex: 1,
  },
  areaListName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 2,
  },
  areaListTime: {
    fontSize: 12,
    color: "#64748b",
  },
  areaListRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  miniAlertPill: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  miniAlertText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#92400e",
  },

  /* Upcoming List */
  upcomingList: {
    gap: 12,
  },
  upcomingCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 16,
  },
  upcomingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  upcomingArea: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  upcomingDay: {
    fontSize: 12,
    color: "#64748b",
  },
  upcomingTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  upcomingTime: {
    fontSize: 13,
    color: "#0040a1",
    fontWeight: "600",
  },

  /* Weekly Roster */
  weeklyCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 16,
  },
  weeklyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  weeklyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0040a1",
  },
  weeklyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  weeklyDayCol: {
    width: 90,
  },
  weeklyDayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  weeklyDateText: {
    fontSize: 11,
    color: "#94a3b8",
  },
  weeklyTimeText: {
    fontSize: 12,
    color: "#475569",
  },
  weeklyStatusCol: {
    alignItems: "flex-end",
  },

  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 14,
    marginBottom: 14,
  },
  modalHeading: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  wardModalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },
  wardModalItemSelected: {
    backgroundColor: "#eff6ff",
  },
  wardModalItemText: {
    fontSize: 14,
    color: "#334155",
  },
  wardModalItemTextSelected: {
    color: "#0040a1",
    fontWeight: "700",
  },

  /* Detail Body */
  detailBody: {
    gap: 12,
  },
  detailArea: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  detailWard: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  detailLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  detailActionBtn: {
    backgroundColor: "#0040a1",
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  detailActionBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
