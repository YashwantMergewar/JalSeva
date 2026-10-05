import React, { useEffect, useState, useMemo } from "react";
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
  UserCheck,
  Bell,
  UserPlus,
  Search,
  ChevronDown,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Plus,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { employeeService, Consumer } from "../../src/services/employee.service";

export default function ConsumerDirectoryScreen() {
  const router = useRouter();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Filter picker modals
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  // Add Consumer Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMobile, setNewMobile] = useState("");
  const [newArea, setNewArea] = useState("North Ward, Sector 4");
  const [newStatus, setNewStatus] = useState<"Active" | "Inactive">("Active");

  // Consumers list
  const [consumers, setConsumers] = useState<
    Array<{
      id: string;
      code: string;
      name: string;
      phone: string;
      location: string;
      status: "Active" | "Inactive";
    }>
  >([
    {
      id: "c-1",
      code: "C-9021",
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      location: "North Ward, Sector 4",
      status: "Active",
    },
    {
      id: "c-2",
      code: "C-9022",
      name: "Anita Sharma",
      phone: "+91 87654 32109",
      location: "South Ward, Phase 2",
      status: "Inactive",
    },
    {
      id: "c-3",
      code: "C-9023",
      name: "Vikram Singh",
      phone: "+91 76543 21098",
      location: "East Ward, Block A",
      status: "Active",
    },
    {
      id: "c-4",
      code: "C-9024",
      name: "Pooja Hegde",
      phone: "+91 98111 22334",
      location: "West Ward, Sector 7",
      status: "Active",
    },
    {
      id: "c-5",
      code: "C-9025",
      name: "Arjun Deshmukh",
      phone: "+91 97222 33445",
      location: "Central Ward, Lane 3",
      status: "Inactive",
    },
  ]);

  const areas = [
    "All Areas",
    "North Ward, Sector 4",
    "South Ward, Phase 2",
    "East Ward, Block A",
    "West Ward, Sector 7",
    "Central Ward, Lane 3",
  ];

  const statuses = ["All Statuses", "Active", "Inactive"];

  // Filtered list
  const filteredList = useMemo(() => {
    return consumers.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery.trim());
      const matchArea =
        selectedArea === "All Areas" || item.location === selectedArea;
      const matchStatus =
        selectedStatus === "All Statuses" || item.status === selectedStatus;
      return matchSearch && matchArea && matchStatus;
    });
  }, [consumers, searchQuery, selectedArea, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredList.length / pageSize));
  const paginatedItems = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddConsumer = () => {
    if (!newName.trim() || !newMobile.trim()) {
      Alert.alert("Missing Fields", "Please enter consumer name and phone number.");
      return;
    }

    const nextNum = consumers.length + 9021;
    const newConsumer = {
      id: `c-${Date.now()}`,
      code: `C-${nextNum}`,
      name: newName.trim(),
      phone: newMobile.trim(),
      location: newArea,
      status: newStatus,
    };

    setConsumers([newConsumer, ...consumers]);
    setNewName("");
    setNewMobile("");
    setShowAddModal(false);
    Alert.alert("Consumer Added", `Account created for ${newConsumer.name} (${newConsumer.code}).`);
  };

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
          <Bell size={20} color="#0f172a" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Description */}
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Consumer Directory</Text>
          <Text style={styles.pageSubtitle}>
            Manage and view consumer connection details.
          </Text>
        </View>

        {/* Primary Action Button */}
        <Pressable
          style={({ pressed }) => [
            styles.addConsumerBtn,
            pressed && styles.addConsumerBtnPressed,
          ]}
          onPress={() => setShowAddModal(true)}
        >
          <UserPlus size={18} color="#ffffff" strokeWidth={2.2} />
          <Text style={styles.addConsumerText}>Add Consumer</Text>
        </Pressable>

        {/* Search & Filter Card */}
        <View style={styles.filterCard}>
          {/* Search Box */}
          <View style={styles.searchBox}>
            <Search size={18} color="#94a3b8" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or consumer number..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setCurrentPage(1);
              }}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <X size={16} color="#94a3b8" />
              </Pressable>
            )}
          </View>

          {/* Area & Status Dropdowns */}
          <View style={styles.dropdownsRow}>
            {/* Area Dropdown */}
            <Pressable
              style={styles.dropdown}
              onPress={() => setShowAreaModal(true)}
            >
              <Text style={styles.dropdownText} numberOfLines={1}>
                {selectedArea}
              </Text>
              <ChevronDown size={16} color="#475569" strokeWidth={2} />
            </Pressable>

            {/* Status Dropdown */}
            <Pressable
              style={styles.dropdown}
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={styles.dropdownText} numberOfLines={1}>
                {selectedStatus}
              </Text>
              <ChevronDown size={16} color="#475569" strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* Consumers List Container Card */}
        <View style={styles.listContainer}>
          {paginatedItems.map((item, index) => {
            const isLast = index === paginatedItems.length - 1;
            return (
              <Pressable
                key={item.id}
                style={[styles.consumerItem, !isLast && styles.consumerItemBorder]}
                onPress={() =>
                  router.push({
                    pathname: "/(employee)/consumer-detail",
                    params: { id: item.id, consumerNumber: item.code },
                  } as any)
                }
              >
                {/* Code Chip */}
                <View style={styles.codeBadge}>
                  <Text style={styles.codeBadgeText}>{item.code}</Text>
                </View>

                {/* Consumer Name */}
                <Text style={styles.consumerName}>{item.name}</Text>

                {/* Phone */}
                <Text style={styles.consumerPhone}>{item.phone}</Text>

                {/* Location with Pin */}
                <View style={styles.locationRow}>
                  <MapPin size={14} color="#64748b" strokeWidth={2} />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>

                {/* Status Row */}
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>STATUS</Text>
                  <View
                    style={[
                      styles.statusPill,
                      item.status === "Active"
                        ? styles.statusPillActive
                        : styles.statusPillInactive,
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        item.status === "Active"
                          ? styles.statusDotActive
                          : styles.statusDotInactive,
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        item.status === "Active"
                          ? styles.statusTextActive
                          : styles.statusTextInactive,
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          {filteredList.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No consumers found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search query or area filters.
              </Text>
            </View>
          )}

          {/* Pagination Footer */}
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationCount}>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredList.length)} of{" "}
              {filteredList.length > 5 ? 150 : filteredList.length}
            </Text>
            <View style={styles.paginationButtons}>
              <Pressable
                style={[
                  styles.pageBtn,
                  currentPage === 1 && styles.pageBtnDisabled,
                ]}
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft
                  size={16}
                  color={currentPage === 1 ? "#cbd5e1" : "#475569"}
                  strokeWidth={2}
                />
              </Pressable>
              <Pressable
                style={[
                  styles.pageBtn,
                  currentPage === totalPages && styles.pageBtnDisabled,
                ]}
                onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight
                  size={16}
                  color={currentPage === totalPages ? "#cbd5e1" : "#475569"}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Area Picker Modal */}
      <Modal visible={showAreaModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAreaModal(false)}
        >
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Filter by Area</Text>
            {areas.map((a) => (
              <Pressable
                key={a}
                style={styles.pickerOption}
                onPress={() => {
                  setSelectedArea(a);
                  setShowAreaModal(false);
                  setCurrentPage(1);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    selectedArea === a && styles.pickerOptionTextActive,
                  ]}
                >
                  {a}
                </Text>
                {selectedArea === a && (
                  <Check size={16} color="#0040a1" strokeWidth={2.5} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Status Picker Modal */}
      <Modal visible={showStatusModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowStatusModal(false)}
        >
          <View style={styles.pickerCard}>
            <Text style={styles.pickerTitle}>Filter by Status</Text>
            {statuses.map((s) => (
              <Pressable
                key={s}
                style={styles.pickerOption}
                onPress={() => {
                  setSelectedStatus(s);
                  setShowStatusModal(false);
                  setCurrentPage(1);
                }}
              >
                <Text
                  style={[
                    styles.pickerOptionText,
                    selectedStatus === s && styles.pickerOptionTextActive,
                  ]}
                >
                  {s}
                </Text>
                {selectedStatus === s && (
                  <Check size={16} color="#0040a1" strokeWidth={2.5} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Add Consumer Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlayBottom}>
          <View style={styles.addModalCard}>
            <View style={styles.addModalHeader}>
              <Text style={styles.addModalTitle}>Add New Consumer</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.addFormField}>
              <Text style={styles.addFormLabel}>Full Name</Text>
              <TextInput
                style={styles.addFormInput}
                placeholder="e.g. Ramesh Kadam"
                placeholderTextColor="#94a3b8"
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            <View style={styles.addFormField}>
              <Text style={styles.addFormLabel}>Phone Number</Text>
              <TextInput
                style={styles.addFormInput}
                placeholder="e.g. +91 98765 00000"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                value={newMobile}
                onChangeText={setNewMobile}
              />
            </View>

            <View style={styles.addFormField}>
              <Text style={styles.addFormLabel}>Ward / Area</Text>
              <TextInput
                style={styles.addFormInput}
                placeholder="e.g. North Ward, Sector 4"
                placeholderTextColor="#94a3b8"
                value={newArea}
                onChangeText={setNewArea}
              />
            </View>

            <View style={styles.addFormField}>
              <Text style={styles.addFormLabel}>Status</Text>
              <View style={styles.statusToggleRow}>
                <Pressable
                  style={[
                    styles.statusToggleBtn,
                    newStatus === "Active" && styles.statusToggleBtnActive,
                  ]}
                  onPress={() => setNewStatus("Active")}
                >
                  <Text
                    style={[
                      styles.statusToggleText,
                      newStatus === "Active" && styles.statusToggleTextActive,
                    ]}
                  >
                    Active
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.statusToggleBtn,
                    newStatus === "Inactive" && styles.statusToggleBtnActive,
                  ]}
                  onPress={() => setNewStatus("Inactive")}
                >
                  <Text
                    style={[
                      styles.statusToggleText,
                      newStatus === "Inactive" && styles.statusToggleTextActive,
                    ]}
                  >
                    Inactive
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.saveConsumerBtn} onPress={handleAddConsumer}>
              <Text style={styles.saveConsumerBtnText}>Save Consumer</Text>
            </Pressable>
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

  // Primary Add Button
  addConsumerBtn: {
    backgroundColor: "#0040a1",
    borderRadius: 8,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addConsumerBtnPressed: {
    backgroundColor: "#003282",
  },
  addConsumerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },

  // Filter Card
  filterCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    backgroundColor: "#ffffff",
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0f172a",
  },
  dropdownsRow: {
    flexDirection: "row",
    gap: 10,
  },
  dropdown: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  dropdownText: {
    fontSize: 13,
    color: "#1e293b",
    flex: 1,
  },

  // List Container Card
  listContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  consumerItem: {
    padding: 16,
    gap: 6,
  },
  consumerItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  codeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e7ff",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  codeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3730a3",
  },
  consumerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  consumerPhone: {
    fontSize: 13,
    color: "#475569",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    color: "#475569",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillActive: {
    backgroundColor: "#8ef2db",
  },
  statusPillInactive: {
    backgroundColor: "#fee2e2",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusDotActive: {
    backgroundColor: "#0d9488",
  },
  statusDotInactive: {
    backgroundColor: "#dc2626",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextActive: {
    color: "#0f766e",
  },
  statusTextInactive: {
    color: "#991b1b",
  },

  // Pagination Footer
  paginationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  paginationCount: {
    fontSize: 12,
    color: "#475569",
  },
  paginationButtons: {
    flexDirection: "row",
    gap: 8,
  },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  pageBtnDisabled: {
    backgroundColor: "#f1f5f9",
    borderColor: "#e2e8f0",
  },

  emptyState: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748b",
  },

  // Pickers
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  pickerCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
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

  // Add Modal
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  addModalCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
    gap: 14,
  },
  addModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  addModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },
  addFormField: {
    gap: 6,
  },
  addFormLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },
  addFormInput: {
    height: 42,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#0f172a",
  },
  statusToggleRow: {
    flexDirection: "row",
    gap: 10,
  },
  statusToggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  statusToggleBtnActive: {
    backgroundColor: "#0040a1",
    borderColor: "#0040a1",
  },
  statusToggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  statusToggleTextActive: {
    color: "#ffffff",
  },
  saveConsumerBtn: {
    backgroundColor: "#0040a1",
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveConsumerBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
