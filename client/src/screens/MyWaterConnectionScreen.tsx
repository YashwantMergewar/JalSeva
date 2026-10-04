import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  User,
  Droplet,
  MapPin,
  Map,
  Calendar,
  Gauge,
  Pencil,
  Power,
  X,
  AlertTriangle,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import { waterConnectionService } from "../services/waterConnection.service";

export default function MyWaterConnectionScreen() {
  const router = useRouter();

  // Connection data matching Screenshot 1
  const [consumerData, setConsumerData] = useState({
    consumerNumber: "#MC-882194",
    status: "Active",
    consumerName: "Ravi Kumar",
    connectionType: "Residential",
    address: "42, Lotus Lane, Green Park Ext.",
    areaWard: "South Zone - Ward 12",
    connectionDate: "14 Oct, 2018",
    meterNumber: "WTM-2018-4992X",
  });

  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [changeType, setChangeType] = useState("Commercial");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRequestChange = async () => {
    if (!reason.trim()) {
      Alert.alert("Reason Required", "Please provide a reason for the modification request.");
      return;
    }
    setSubmitting(true);
    try {
      await waterConnectionService.requestTypeChange(changeType as any, reason);
      setShowChangeModal(false);
      setReason("");
      Alert.alert(
        "Request Submitted",
        `Your request to change connection to ${changeType} has been submitted for municipal review.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestDisconnect = () => {
    if (!reason.trim()) {
      Alert.alert("Reason Required", "Please state the reason for permanent disconnection.");
      return;
    }

    Alert.alert(
      "Confirm Disconnection",
      "Are you sure you want to request permanent termination of your municipal water supply? A technician will be assigned to remove the meter.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Disconnect",
          style: "destructive",
          onPress: async () => {
            setSubmitting(true);
            try {
              await waterConnectionService.requestDisconnection(reason);
              setConsumerData((prev) => ({
                ...prev,
                status: "Disconnection Requested",
              }));
              setShowDisconnectModal(false);
              setReason("");
              Alert.alert(
                "Disconnection Logged",
                "Your request has been logged. Municipal officials will contact you regarding meter retrieval."
              );
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Municipal Water" showBack />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Screen Title & Subtitle ── */}
        <Text style={styles.screenTitle}>My Water Connection</Text>
        <Text style={styles.screenSubtitle}>
          Manage your residential water service details and requests.
        </Text>

        {/* ── Main Connection Card (Matching Screenshot 1) ── */}
        <View style={styles.mainCard}>
          {/* Top Row: Consumer Number + Active Badge */}
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.consumerNumberLabel}>CONSUMER NUMBER</Text>
              <Text style={styles.consumerNumberValue}>
                {consumerData.consumerNumber}
              </Text>
            </View>
            <View style={styles.activeBadge}>
              <View style={styles.activeCheckCircle}>
                <Text style={styles.activeCheckText}>✓</Text>
              </View>
              <Text style={styles.activeBadgeText}>{consumerData.status}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Details Rows */}
          <View style={styles.attributesList}>
            {/* 1. Consumer Name */}
            <View style={styles.attrItem}>
              <View style={styles.attrIconRow}>
                <User size={16} color="#475569" strokeWidth={1.8} />
                <Text style={styles.attrLabel}>Consumer Name</Text>
              </View>
              <Text style={styles.attrValue}>{consumerData.consumerName}</Text>
            </View>

            {/* 2. Connection Type */}
            <View style={styles.attrItem}>
              <View style={styles.attrIconRow}>
                <Droplet size={16} color="#475569" strokeWidth={1.8} />
                <Text style={styles.attrLabel}>Connection Type</Text>
              </View>
              <Text style={styles.attrValue}>{consumerData.connectionType}</Text>
            </View>

            {/* 3. Address */}
            <View style={styles.attrItem}>
              <View style={styles.attrIconRow}>
                <MapPin size={16} color="#475569" strokeWidth={1.8} />
                <Text style={styles.attrLabel}>Address</Text>
              </View>
              <Text style={styles.attrValue}>{consumerData.address}</Text>
            </View>

            {/* 4. Area / Ward */}
            <View style={styles.attrItem}>
              <View style={styles.attrIconRow}>
                <Map size={16} color="#475569" strokeWidth={1.8} />
                <Text style={styles.attrLabel}>Area / Ward</Text>
              </View>
              <Text style={styles.attrValue}>{consumerData.areaWard}</Text>
            </View>

            {/* 5. Connection Date */}
            <View style={styles.attrItem}>
              <View style={styles.attrIconRow}>
                <Calendar size={16} color="#475569" strokeWidth={1.8} />
                <Text style={styles.attrLabel}>Connection Date</Text>
              </View>
              <Text style={styles.attrValue}>{consumerData.connectionDate}</Text>
            </View>

            {/* 6. Meter Number */}
            <View style={styles.attrItem}>
              <View style={styles.attrIconRow}>
                <Gauge size={16} color="#475569" strokeWidth={1.8} />
                <Text style={styles.attrLabel}>Meter Number</Text>
              </View>
              <Text style={styles.attrValue}>{consumerData.meterNumber}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Action Buttons: Request Change & Request Disconnection */}
          <View style={styles.actionsContainer}>
            <Pressable
              style={styles.requestChangeBtn}
              onPress={() => setShowChangeModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Request Change"
            >
              <Pencil size={18} color="#0040a1" strokeWidth={2} />
              <Text style={styles.requestChangeBtnText}>Request Change</Text>
            </Pressable>

            <Pressable
              style={styles.requestDisconnectBtn}
              onPress={() => setShowDisconnectModal(true)}
              accessibilityRole="button"
              accessibilityLabel="Request Disconnection"
            >
              <Power size={18} color="#ffffff" strokeWidth={2.2} />
              <Text style={styles.requestDisconnectBtnText}>
                Request Disconnection
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Request Change Modal ── */}
      <Modal
        visible={showChangeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowChangeModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Connection Change</Text>
              <Pressable onPress={() => setShowChangeModal(false)} hitSlop={10}>
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            <Text style={styles.modalSubLabel}>Select Change Category</Text>
            <View style={styles.pillRow}>
              {["Commercial", "Industrial", "Upgraded Line"].map((opt) => (
                <Pressable
                  key={opt}
                  style={[
                    styles.pillOption,
                    changeType === opt && styles.pillOptionActive,
                  ]}
                  onPress={() => setChangeType(opt)}
                >
                  <Text
                    style={[
                      styles.pillOptionText,
                      changeType === opt && styles.pillOptionTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.modalSubLabel}>Reason for Request</Text>
            <TextInput
              style={styles.modalTextArea}
              multiline
              numberOfLines={3}
              placeholder="State the purpose of this connection change..."
              value={reason}
              onChangeText={setReason}
            />

            <Pressable
              style={styles.modalSubmitBtn}
              onPress={handleRequestChange}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalSubmitBtnText}>Submit Request</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ── Request Disconnection Modal ── */}
      <Modal
        visible={showDisconnectModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDisconnectModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: "#ba1a1a" }]}>
                Permanent Disconnection
              </Text>
              <Pressable onPress={() => setShowDisconnectModal(false)} hitSlop={10}>
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            <View style={styles.alertBanner}>
              <AlertTriangle size={18} color="#ba1a1a" />
              <Text style={styles.alertBannerText}>
                This will initiate the formal termination of municipal water supply for Consumer #{consumerData.consumerNumber}.
              </Text>
            </View>

            <Text style={styles.modalSubLabel}>Reason for Disconnection</Text>
            <TextInput
              style={styles.modalTextArea}
              multiline
              numberOfLines={3}
              placeholder="e.g. Demolition, permanent relocation, property sale..."
              value={reason}
              onChangeText={setReason}
            />

            <Pressable
              style={[styles.modalSubmitBtn, { backgroundColor: "#ba1a1a" }]}
              onPress={handleRequestDisconnect}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.modalSubmitBtnText}>Confirm Disconnection</Text>
              )}
            </Pressable>
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
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 20,
  },

  /* Main Card */
  mainCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  consumerNumberLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  consumerNumberValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 2,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#8df1e0", // Mint teal from screenshot
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#004d40",
    alignItems: "center",
    justifyContent: "center",
  },
  activeCheckText: {
    fontSize: 10,
    color: "#004d40",
    fontWeight: "700",
  },
  activeBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#004d40",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 18,
  },

  /* Attributes */
  attributesList: {
    gap: 16,
  },
  attrItem: {
    gap: 3,
  },
  attrIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  attrLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  attrValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginLeft: 24,
  },

  /* Actions */
  actionsContainer: {
    gap: 12,
  },
  requestChangeBtn: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#0040a1",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  requestChangeBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0040a1",
  },
  requestDisconnectBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ba1a1a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  requestDisconnectBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
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
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  modalSubLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginTop: 8,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  pillOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  pillOptionActive: {
    borderColor: "#0040a1",
    backgroundColor: "#eff6ff",
  },
  pillOptionText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  pillOptionTextActive: {
    color: "#0040a1",
    fontWeight: "700",
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 80,
    fontSize: 14,
    color: "#0f172a",
    textAlignVertical: "top",
    marginBottom: 16,
  },
  modalSubmitBtn: {
    backgroundColor: "#0040a1",
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  modalSubmitBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  alertBannerText: {
    fontSize: 12,
    color: "#991b1b",
    flex: 1,
    lineHeight: 16,
  },
});
