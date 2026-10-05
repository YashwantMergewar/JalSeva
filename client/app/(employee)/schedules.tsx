import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Droplets,
  Calendar,
  Clock,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Filter,
  Map,
  Wrench,
  History,
  ChevronDown,
  Bell,
  X,
  Check,
} from "lucide-react-native";
import { useRouter } from "expo-router";

interface ScheduleItem {
  id: string;
  zone: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "Active" | "Restricted" | "Completed";
  iconType: "grid" | "wrench" | "history";
}

export default function WaterScheduleManagementScreen() {
  const router = useRouter();

  // Schedule Editor form state
  const [selectedArea, setSelectedArea] = useState("North Ward - Sector A");
  const [scheduleDate, setScheduleDate] = useState("10/24/2026");
  const [startTime, setStartTime] = useState("06:00 AM");
  const [endTime, setEndTime] = useState("10:00 AM");
  const [scheduleStatus, setScheduleStatus] = useState<"Active" | "Restricted">(
    "Active"
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  // Modals
  const [showAreaPicker, setShowAreaPicker] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState<"All" | "Active" | "Restricted">("All");

  const availableAreas = [
    "North Ward - Sector A",
    "South Ward - Central Line",
    "East Ward - Industrial Zone",
    "West Ward - Residential Hub",
    "Central Ward - Commercial Market",
    "Sector 14 - Highway Line",
  ];

  // Schedules list matching screenshot
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: "sc-1",
      zone: "North Ward - Sector A",
      date: "Oct 24, 2026",
      startTime: "06:00 AM",
      endTime: "10:00 AM",
      status: "Active",
      iconType: "grid",
    },
    {
      id: "sc-2",
      zone: "South Ward - Central Line",
      date: "Oct 24, 2026",
      startTime: "14:00 PM",
      endTime: "18:00 PM",
      status: "Restricted",
      iconType: "wrench",
    },
    {
      id: "sc-3",
      zone: "East Ward - Industrial Zone",
      date: "Oct 25, 2026",
      startTime: "04:00 AM",
      endTime: "08:00 AM",
      status: "Active",
      iconType: "grid",
    },
    {
      id: "sc-4",
      zone: "West Ward - Residential Hub",
      date: "Oct 23, 2026",
      startTime: "07:00 AM",
      endTime: "11:00 AM",
      status: "Completed",
      iconType: "history",
    },
  ]);

  const activeCount = schedules.filter((s) => s.status === "Active").length * 4; // simulated zones
  const disruptionCount = schedules.filter((s) => s.status === "Restricted").length;

  const handleEditSchedule = (item: ScheduleItem) => {
    setEditingId(item.id);
    setSelectedArea(item.zone);
    setScheduleDate(item.date);
    setStartTime(item.startTime);
    setEndTime(item.endTime);
    if (item.status === "Restricted" || item.status === "Active") {
      setScheduleStatus(item.status);
    }
    Alert.alert(
      "Editing Schedule",
      `Details for "${item.zone}" loaded into Schedule Editor above.`
    );
  };

  const handleSaveSchedule = () => {
    if (!startTime.trim() || !endTime.trim()) {
      Alert.alert("Missing Timings", "Please enter start and end time.");
      return;
    }

    if (editingId) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                zone: selectedArea,
                date: scheduleDate,
                startTime,
                endTime,
                status: scheduleStatus,
                iconType: scheduleStatus === "Restricted" ? "wrench" : "grid",
              }
            : s
        )
      );
      setEditingId(null);
      Alert.alert("Schedule Updated", `Water timing updated for ${selectedArea}.`);
    } else {
      const newEntry: ScheduleItem = {
        id: `sc-${Date.now()}`,
        zone: selectedArea,
        date: scheduleDate,
        startTime,
        endTime,
        status: scheduleStatus,
        iconType: scheduleStatus === "Restricted" ? "wrench" : "grid",
      };
      setSchedules([newEntry, ...schedules]);
      Alert.alert("Schedule Created", `New water supply timing published for ${selectedArea}.`);
    }
  };

  const handlePublishAnnouncement = () => {
    Alert.alert(
      "Publish Ward Broadcast",
      `Send SMS & push notification to citizens in ${selectedArea} for timings ${startTime} - ${endTime} (${scheduleStatus})?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Broadcast",
          style: "default",
          onPress: () => {
            Alert.alert(
              "Broadcast Dispatched",
              `Public announcement successfully sent to all registered water consumers in ${selectedArea}.`
            );
          },
        },
      ]
    );
  };

  const filteredSchedules = schedules.filter((s) => {
    if (filterType === "All") return true;
    return s.status === filterType;
  });

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <Text style={styles.brandTitle}>Municipal Services</Text>
        <Pressable
          style={styles.bellBtn}
          onPress={() => router.push("/(employee)/notifications" as any)}
        >
          <Bell size={20} color="#0f172a" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page Title & Subtitle */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Water Schedule Management</Text>
          <Text style={styles.pageSubtitle}>
            Authorized Staff Portal. View, manage, and announce scheduled water
            supply timings for specific zones. Ensure all schedules are updated
            to minimize citizen disruption.
          </Text>
        </View>

        {/* Schedule Editor Card */}
        <View style={styles.editorCard}>
          {/* Card Header with Droplet Icon */}
          <View style={styles.cardHeaderRow}>
            <Droplets size={20} color="#0040a1" strokeWidth={2.2} />
            <Text style={styles.cardHeaderTitle}>Schedule Editor</Text>
          </View>

          {/* Zone / Area Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Zone / Area</Text>
            <Pressable
              style={styles.selectBox}
              onPress={() => setShowAreaPicker(true)}
            >
              <Text style={styles.selectBoxText} numberOfLines={1}>
                {selectedArea || "Select Area..."}
              </Text>
              <ChevronDown size={18} color="#64748b" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Schedule Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Schedule Date</Text>
            <View style={styles.iconInputWrap}>
              <TextInput
                style={styles.iconInput}
                placeholder="mm/dd/yyyy"
                placeholderTextColor="#94a3b8"
                value={scheduleDate}
                onChangeText={setScheduleDate}
              />
              <Calendar size={18} color="#64748b" strokeWidth={2} />
            </View>
          </View>

          {/* Start Time & End Time side-by-side */}
          <View style={styles.timeRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Start Time</Text>
              <View style={styles.iconInputWrap}>
                <TextInput
                  style={styles.iconInput}
                  placeholder="--:-- --"
                  placeholderTextColor="#94a3b8"
                  value={startTime}
                  onChangeText={setStartTime}
                />
                <Clock size={16} color="#64748b" strokeWidth={2} />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>End Time</Text>
              <View style={styles.iconInputWrap}>
                <TextInput
                  style={styles.iconInput}
                  placeholder="--:-- --"
                  placeholderTextColor="#94a3b8"
                  value={endTime}
                  onChangeText={setEndTime}
                />
                <Clock size={16} color="#64748b" strokeWidth={2} />
              </View>
            </View>
          </View>

          {/* Schedule Status Radio */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Schedule Status</Text>
            <View style={styles.radioRow}>
              {/* Option 1: Active */}
              <Pressable
                style={styles.radioOption}
                onPress={() => setScheduleStatus("Active")}
              >
                <View style={styles.radioCircle}>
                  {scheduleStatus === "Active" && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Active{"\n"}(Normal)</Text>
              </Pressable>

              {/* Option 2: Restricted */}
              <Pressable
                style={styles.radioOption}
                onPress={() => setScheduleStatus("Restricted")}
              >
                <View style={styles.radioCircle}>
                  {scheduleStatus === "Restricted" && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={styles.radioLabel}>Restricted /{"\n"}Cut</Text>
              </Pressable>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.editorButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.saveScheduleBtn,
                pressed && styles.saveScheduleBtnPressed,
              ]}
              onPress={handleSaveSchedule}
            >
              <Calendar size={18} color="#ffffff" strokeWidth={2.2} />
              <Text style={styles.saveScheduleText}>
                {editingId ? "Update Schedule" : "Save Schedule"}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.publishBtn,
                pressed && styles.publishBtnPressed,
              ]}
              onPress={handlePublishAnnouncement}
            >
              <Megaphone size={18} color="#0040a1" strokeWidth={2.2} />
              <Text style={styles.publishText}>Publish Announcement</Text>
            </Pressable>
          </View>
        </View>

        {/* Metrics Row */}
        <View style={styles.metricsRow}>
          {/* Active Zones */}
          <View style={styles.metricCardActive}>
            <CheckCircle2 size={22} color="#16a34a" strokeWidth={2.2} />
            <Text style={styles.metricLabel}>ACTIVE ZONES</Text>
            <Text style={styles.metricValueActive}>{activeCount || 12}</Text>
          </View>

          {/* Disruptions */}
          <View style={styles.metricCardDisruption}>
            <AlertTriangle size={22} color="#dc2626" strokeWidth={2.2} />
            <Text style={styles.metricLabelDisruption}>DISRUPTIONS</Text>
            <Text style={styles.metricValueDisruption}>
              {disruptionCount || 2}
            </Text>
          </View>
        </View>

        {/* Current Active Schedules Card */}
        <View style={styles.activeSchedulesCard}>
          {/* Card Title */}
          <View style={styles.activeCardHeader}>
            <View style={styles.activeTitleRow}>
              <ClipboardList size={20} color="#0f172a" strokeWidth={2} />
              <Text style={styles.activeHeaderTitle}>
                Current Active Schedules
              </Text>
            </View>
            <Pressable
              style={styles.filterBtn}
              onPress={() => setShowFilterModal(true)}
            >
              <Filter size={18} color="#0040a1" strokeWidth={2} />
            </Pressable>
          </View>

          {/* Schedules List */}
          <View style={styles.schedulesList}>
            {filteredSchedules.map((item, idx) => {
              const isRestricted = item.status === "Restricted";
              const isCompleted = item.status === "Completed";
              const isLast = idx === filteredSchedules.length - 1;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.scheduleItem,
                    isRestricted && styles.scheduleItemRestricted,
                    !isLast && styles.scheduleItemBorder,
                  ]}
                >
                  <View style={styles.itemTopRow}>
                    {/* Icon */}
                    <View
                      style={[
                        styles.itemIconCircle,
                        isRestricted
                          ? styles.iconCircleRestricted
                          : isCompleted
                          ? styles.iconCircleCompleted
                          : styles.iconCircleActive,
                      ]}
                    >
                      {item.iconType === "wrench" ? (
                        <Wrench size={18} color="#dc2626" strokeWidth={2} />
                      ) : item.iconType === "history" ? (
                        <History size={18} color="#64748b" strokeWidth={2} />
                      ) : (
                        <Map size={18} color="#0040a1" strokeWidth={2} />
                      )}
                    </View>

                    {/* Zone Info */}
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemZone}>{item.zone}</Text>
                      <View style={styles.itemMetaRow}>
                        <Calendar size={13} color="#64748b" />
                        <Text style={styles.itemMetaText}>{item.date}</Text>
                      </View>
                      <View style={styles.itemMetaRow}>
                        <Clock size={13} color="#64748b" />
                        <Text style={styles.itemMetaText}>
                          {item.startTime} - {item.endTime}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Status Badge & Edit Link */}
                  <View style={styles.itemBottomRow}>
                    <View
                      style={[
                        styles.badge,
                        item.status === "Active"
                          ? styles.badgeActive
                          : item.status === "Restricted"
                          ? styles.badgeRestricted
                          : styles.badgeCompleted,
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          item.status === "Active"
                            ? styles.badgeTextActive
                            : item.status === "Restricted"
                            ? styles.badgeTextRestricted
                            : styles.badgeTextCompleted,
                        ]}
                      >
                        {item.status}
                      </Text>
                    </View>

                    {item.status !== "Completed" && (
                      <Pressable onPress={() => handleEditSchedule(item)}>
                        <Text style={styles.editLink}>Edit</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Historical link */}
          <Pressable
            style={styles.historicalLinkContainer}
            onPress={() => setShowHistoryModal(true)}
          >
            <Text style={styles.historicalLinkText}>
              View All Historical Schedules
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Area Picker Modal */}
      <Modal visible={showAreaPicker} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAreaPicker(false)}
        >
          <View style={styles.pickerModal}>
            <Text style={styles.pickerTitle}>Select Zone / Area</Text>
            {availableAreas.map((area) => (
              <Pressable
                key={area}
                style={styles.pickerOption}
                onPress={() => {
                  setSelectedArea(area);
                  setShowAreaPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    selectedArea === area && styles.pickerOptionTextActive,
                  ]}
                >
                  {area}
                </Text>
                {selectedArea === area && (
                  <Check size={16} color="#0040a1" strokeWidth={2.5} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Historical Schedules Modal */}
      <Modal visible={showHistoryModal} transparent animationType="slide">
        <View style={styles.historyModalOverlay}>
          <View style={styles.historyModalCard}>
            <View style={styles.historyModalHeader}>
              <Text style={styles.historyModalTitle}>
                Historical Schedules Archive
              </Text>
              <Pressable onPress={() => setShowHistoryModal(false)}>
                <X size={20} color="#64748b" />
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {[
                { zone: "West Ward - Sector 2", date: "Oct 22, 2026", time: "06:00 AM - 09:00 AM", status: "Delivered" },
                { zone: "East Ward - Sector 8", date: "Oct 21, 2026", time: "05:00 AM - 08:30 AM", status: "Delivered" },
                { zone: "North Ward - Main Hub", date: "Oct 20, 2026", time: "07:00 AM - 10:00 AM", status: "Delivered" },
                { zone: "Central Line - Substation", date: "Oct 19, 2026", time: "14:00 PM - 17:00 PM", status: "Cut - Maintenance" },
              ].map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <Text style={styles.historyZone}>{h.zone}</Text>
                  <Text style={styles.historySub}>
                    {h.date} • {h.time}
                  </Text>
                  <Text style={styles.historyStatus}>{h.status}</Text>
                </View>
              ))}
            </ScrollView>
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
  brandTitle: {
    fontSize: 17,
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
    lineHeight: 19,
  },

  // Schedule Editor Card
  editorCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderTopWidth: 3,
    borderTopColor: "#0040a1",
    padding: 16,
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  selectBox: {
    height: 44,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  selectBoxText: {
    fontSize: 14,
    color: "#0f172a",
    flex: 1,
  },
  iconInputWrap: {
    height: 44,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  iconInput: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  radioRow: {
    flexDirection: "row",
    gap: 28,
    paddingVertical: 4,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0040a1",
  },
  radioLabel: {
    fontSize: 13,
    color: "#1e293b",
    lineHeight: 16,
  },
  editorButtons: {
    gap: 10,
    marginTop: 6,
  },
  saveScheduleBtn: {
    backgroundColor: "#0040a1",
    height: 44,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveScheduleBtnPressed: {
    backgroundColor: "#003282",
  },
  saveScheduleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  publishBtn: {
    backgroundColor: "#ffffff",
    height: 44,
    borderRadius: 8,
    borderWidth: 1.2,
    borderColor: "#0040a1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  publishBtnPressed: {
    backgroundColor: "#f0f5ff",
  },
  publishText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0040a1",
  },

  // Metrics Row
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricCardActive: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  metricValueActive: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  metricCardDisruption: {
    flex: 1,
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  metricLabelDisruption: {
    fontSize: 11,
    fontWeight: "700",
    color: "#dc2626",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  metricValueDisruption: {
    fontSize: 22,
    fontWeight: "800",
    color: "#dc2626",
  },

  // Active Schedules Card
  activeSchedulesCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  activeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  filterBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  schedulesList: {},
  scheduleItem: {
    padding: 16,
    gap: 10,
  },
  scheduleItemRestricted: {
    backgroundColor: "#fff5f5",
  },
  scheduleItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  itemTopRow: {
    flexDirection: "row",
    gap: 12,
  },
  itemIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: "#dbeafe",
  },
  iconCircleRestricted: {
    backgroundColor: "#fee2e2",
  },
  iconCircleCompleted: {
    backgroundColor: "#f1f5f9",
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemZone: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  itemMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemMetaText: {
    fontSize: 13,
    color: "#475569",
  },
  itemBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeActive: {
    backgroundColor: "#d1fae5",
  },
  badgeRestricted: {
    backgroundColor: "#fee2e2",
  },
  badgeCompleted: {
    backgroundColor: "#e2e8f0",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  badgeTextActive: {
    color: "#065f46",
  },
  badgeTextRestricted: {
    color: "#991b1b",
  },
  badgeTextCompleted: {
    color: "#475569",
  },
  editLink: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0040a1",
  },
  historicalLinkContainer: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#fafbfc",
  },
  historicalLinkText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0040a1",
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  pickerModal: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#334155",
  },
  pickerOptionTextActive: {
    color: "#0040a1",
    fontWeight: "700",
  },
  historyModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  historyModalCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  historyModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  historyModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: 4,
  },
  historyZone: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  historySub: {
    fontSize: 12,
    color: "#64748b",
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0284c7",
  },
});
