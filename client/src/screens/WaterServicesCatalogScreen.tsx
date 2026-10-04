import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  PlusCircle,
  Plus,
  ArrowLeftRight,
  UserCheck,
  FileEdit,
  XCircle,
  Droplet,
  HelpCircle,
  ArrowRight,
  X,
  AlertTriangle,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import { waterConnectionService } from "../services/waterConnection.service";

export default function WaterServicesCatalogScreen() {
  const router = useRouter();

  // Modal states for interactive requests
  const [activeModal, setActiveModal] = useState<
    "type_change" | "status_change" | "name_change" | "disconnection" | null
  >(null);
  const [inputText, setInputText] = useState("");
  const [reasonText, setReasonText] = useState("");
  const [selectedOption, setSelectedOption] = useState<string>("Commercial");
  const [submitting, setSubmitting] = useState(false);

  const closeModal = () => {
    setActiveModal(null);
    setInputText("");
    setReasonText("");
    setSelectedOption("Commercial");
  };

  const handleTypeChangeSubmit = async () => {
    if (!reasonText.trim()) {
      Alert.alert("Reason Required", "Please provide a brief reason for changing connection type.");
      return;
    }
    setSubmitting(true);
    try {
      await waterConnectionService.requestTypeChange(selectedOption as any, reasonText);
      closeModal();
      Alert.alert(
        "Request Submitted",
        `Your request to change connection to ${selectedOption} has been submitted for municipal review.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChangeSubmit = async () => {
    if (!reasonText.trim()) {
      Alert.alert("Reason Required", "Please specify the reason for suspending or reactivating service.");
      return;
    }
    setSubmitting(true);
    try {
      await waterConnectionService.requestStatusChange(selectedOption as any, reasonText);
      closeModal();
      Alert.alert(
        "Request Submitted",
        `Your request to update connection status to ${selectedOption} has been logged.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleNameChangeSubmit = async () => {
    if (!inputText.trim()) {
      Alert.alert("Name Required", "Please enter the new registered consumer name.");
      return;
    }
    if (!reasonText.trim()) {
      Alert.alert("Reason Required", "Please state the reason for name change (e.g. transfer of deed).");
      return;
    }
    setSubmitting(true);
    try {
      await waterConnectionService.requestNameChange(inputText.trim(), reasonText.trim());
      closeModal();
      Alert.alert(
        "Request Submitted",
        "Consumer name change request submitted with supporting reference logged."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisconnectionSubmit = async () => {
    if (!reasonText.trim()) {
      Alert.alert("Reason Required", "Please describe the reason for permanent disconnection.");
      return;
    }
    Alert.alert(
      "Confirm Disconnection",
      "Are you sure you want to request permanent termination of your municipal water supply? A technician will be scheduled to remove the meter.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Disconnect",
          style: "destructive",
          onPress: async () => {
            setSubmitting(true);
            try {
              await waterConnectionService.requestDisconnection(reasonText.trim());
              closeModal();
              Alert.alert(
                "Disconnection Logged",
                "Your permanent disconnection request has been registered. An official will contact you for meter retrieval."
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
      <CitizenHeader title="Municipal Water" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Screen Heading ── */}
        <View style={styles.headingSection}>
          <Text style={styles.screenTitle}>Water Services Catalogue</Text>
          <Text style={styles.screenSubtitle}>
            Browse our catalogue to submit new requests or modify your existing
            water utility services securely.
          </Text>
        </View>

        {/* ── Service Card A: New Water Connection ── */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceCardTop}>
            <View style={[styles.iconBox, { backgroundColor: "#0056d2" }]}>
              <PlusCircle size={22} color="#ffffff" strokeWidth={2.2} />
            </View>
            <View style={styles.watermarkContainer}>
              <Plus size={44} color="#e0e7ff" strokeWidth={2.5} />
            </View>
          </View>
          <Text style={styles.cardTitle}>New Water Connection</Text>
          <Text style={styles.cardDesc}>
            Apply for a new municipal water connection for residential or commercial use.
          </Text>
          <Pressable
            style={styles.cardActionLink}
            onPress={() => router.push("/(citizen)/new-connection" as any)}
            accessibilityRole="button"
            accessibilityLabel="Apply Now for New Water Connection"
          >
            <Text style={styles.cardActionText}>Apply Now</Text>
            <ArrowRight size={16} color="#0056d2" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* ── Service Card B: Change in Type of Connection ── */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceCardTop}>
            <View style={[styles.iconBox, { backgroundColor: "#8df1e0" }]}>
              <ArrowLeftRight size={22} color="#004d40" strokeWidth={2.2} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Change in Type of Connection</Text>
          <Text style={styles.cardDesc}>
            Upgrade or modify your connection type (e.g., domestic to commercial).
          </Text>
          <Pressable
            style={styles.cardActionLink}
            onPress={() => {
              setSelectedOption("Commercial");
              setActiveModal("type_change");
            }}
            accessibilityRole="button"
            accessibilityLabel="Request Change in Type of Connection"
          >
            <Text style={styles.cardActionText}>Request Change</Text>
            <ArrowRight size={16} color="#0056d2" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* ── Service Card C: Change in Connection Status ── */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceCardTop}>
            <View style={[styles.iconBox, { backgroundColor: "#e2e8f0" }]}>
              <UserCheck size={22} color="#334155" strokeWidth={2.2} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Change in Connection Status</Text>
          <Text style={styles.cardDesc}>
            Temporarily suspend or reactivate an existing water service connection.
          </Text>
          <Pressable
            style={styles.cardActionLink}
            onPress={() => {
              setSelectedOption("Suspended");
              setActiveModal("status_change");
            }}
            accessibilityRole="button"
            accessibilityLabel="Manage Status of Connection"
          >
            <Text style={styles.cardActionText}>Manage Status</Text>
            <ArrowRight size={16} color="#0056d2" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* ── Service Card D: Change in Consumer Name ── */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceCardTop}>
            <View style={[styles.iconBox, { backgroundColor: "#e2e8f0" }]}>
              <FileEdit size={22} color="#334155" strokeWidth={2.2} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Change in Consumer Name</Text>
          <Text style={styles.cardDesc}>
            Update the registered owner or tenant details for billing and municipal records.
          </Text>
          <Pressable
            style={styles.cardActionLink}
            onPress={() => setActiveModal("name_change")}
            accessibilityRole="button"
            accessibilityLabel="Update Consumer Name"
          >
            <Text style={styles.cardActionText}>Update Details</Text>
            <ArrowRight size={16} color="#0056d2" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* ── Service Card E: Disconnection of Consumer Connection (Warning Style) ── */}
        <View style={[styles.serviceCard, styles.dangerCard]}>
          <View style={styles.serviceCardTop}>
            <View style={[styles.iconBox, { backgroundColor: "#ffdad6" }]}>
              <XCircle size={22} color="#ba1a1a" strokeWidth={2.2} />
            </View>
          </View>
          <Text style={[styles.cardTitle, { color: "#111111" }]}>
            Disconnection of Consumer Connection
          </Text>
          <Text style={styles.cardDesc}>
            Submit a request for permanent termination of municipal water supply.
          </Text>
          <Pressable
            style={styles.cardActionLink}
            onPress={() => setActiveModal("disconnection")}
            accessibilityRole="button"
            accessibilityLabel="Request Disconnection"
          >
            <Text style={[styles.cardActionText, { color: "#ba1a1a" }]}>
              Request Disconnection
            </Text>
            <ArrowRight size={16} color="#ba1a1a" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* ── Service Card F: Water Quality-related request ── */}
        <View style={styles.serviceCard}>
          <View style={styles.serviceCardTop}>
            <View style={[styles.iconBox, { backgroundColor: "#c7d2fe" }]}>
              <Droplet size={22} color="#3730a3" strokeWidth={2.2} />
            </View>
          </View>
          <Text style={styles.cardTitle}>Water Quality-related request</Text>
          <Text style={styles.cardDesc}>
            Report issues regarding water turbidity, odor, or request a quality inspection.
          </Text>
          <Pressable
            style={styles.cardActionLink}
            onPress={() =>
              router.push({
                pathname: "/(citizen)/submit-complaint" as any,
                params: { category: "Water Quality" },
              })
            }
            accessibilityRole="button"
            accessibilityLabel="Report Water Quality Issue"
          >
            <Text style={styles.cardActionText}>Report Issue</Text>
            <ArrowRight size={16} color="#0056d2" strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* ── Assistance Card ── */}
        <View style={styles.assistanceCard}>
          <View style={styles.assistanceHeader}>
            <View style={styles.assistanceIconCircle}>
              <HelpCircle size={24} color="#ffffff" strokeWidth={2} />
            </View>
            <View style={styles.assistanceTextWrap}>
              <Text style={styles.assistanceTitle}>Need assistance?</Text>
              <Text style={styles.assistanceSubtitle}>
                Check our FAQs or contact support for help with your service requests.
              </Text>
            </View>
          </View>
          <Pressable
            style={styles.assistanceBtn}
            onPress={() => router.push("/(citizen)/support" as any)}
            accessibilityRole="button"
            accessibilityLabel="Visit Support Center"
          >
            <Text style={styles.assistanceBtnText}>Visit Support Center</Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Interactive Modal for Change / Disconnection Requests ── */}
      <Modal
        visible={activeModal !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <View style={styles.modalTop}>
              <Text style={styles.modalHeading}>
                {activeModal === "type_change" && "Change Connection Type"}
                {activeModal === "status_change" && "Manage Connection Status"}
                {activeModal === "name_change" && "Change Consumer Name"}
                {activeModal === "disconnection" && "Permanent Disconnection"}
              </Text>
              <Pressable onPress={closeModal} hitSlop={10}>
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              {activeModal === "type_change" && (
                <View style={styles.modalForm}>
                  <Text style={styles.inputLabel}>Select New Connection Type</Text>
                  <View style={styles.optionRow}>
                    {["Domestic", "Commercial", "Industrial"].map((type) => (
                      <Pressable
                        key={type}
                        style={[
                          styles.optionPill,
                          selectedOption === type && styles.optionPillSelected,
                        ]}
                        onPress={() => setSelectedOption(type)}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            selectedOption === type && styles.optionPillTextSelected,
                          ]}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={styles.inputLabel}>Reason for Change</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={3}
                    placeholder="Describe why the connection type needs modification..."
                    value={reasonText}
                    onChangeText={setReasonText}
                  />

                  <Pressable
                    style={styles.submitModalBtn}
                    onPress={handleTypeChangeSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitModalBtnText}>Submit Request</Text>
                    )}
                  </Pressable>
                </View>
              )}

              {activeModal === "status_change" && (
                <View style={styles.modalForm}>
                  <Text style={styles.inputLabel}>Select Desired Status</Text>
                  <View style={styles.optionRow}>
                    {["Active", "Suspended"].map((status) => (
                      <Pressable
                        key={status}
                        style={[
                          styles.optionPill,
                          selectedOption === status && styles.optionPillSelected,
                        ]}
                        onPress={() => setSelectedOption(status)}
                      >
                        <Text
                          style={[
                            styles.optionPillText,
                            selectedOption === status && styles.optionPillTextSelected,
                          ]}
                        >
                          {status}
                        </Text>
                      </Pressable>
                    ))}
                  </View>

                  <Text style={styles.inputLabel}>Reason / Duration</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={3}
                    placeholder="e.g., Temporarily vacating premises for 3 months..."
                    value={reasonText}
                    onChangeText={setReasonText}
                  />

                  <Pressable
                    style={styles.submitModalBtn}
                    onPress={handleStatusChangeSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitModalBtnText}>Update Status</Text>
                    )}
                  </Pressable>
                </View>
              )}

              {activeModal === "name_change" && (
                <View style={styles.modalForm}>
                  <Text style={styles.inputLabel}>New Consumer Full Name</Text>
                  <TextInput
                    style={styles.inputField}
                    placeholder="Enter full name as per Aadhaar / deed"
                    value={inputText}
                    onChangeText={setInputText}
                  />

                  <Text style={styles.inputLabel}>Reason for Name Change</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={3}
                    placeholder="e.g., Property transferred through registered sale deed..."
                    value={reasonText}
                    onChangeText={setReasonText}
                  />

                  <Pressable
                    style={styles.submitModalBtn}
                    onPress={handleNameChangeSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitModalBtnText}>Submit Name Update</Text>
                    )}
                  </Pressable>
                </View>
              )}

              {activeModal === "disconnection" && (
                <View style={styles.modalForm}>
                  <View style={styles.disconnectionAlert}>
                    <AlertTriangle size={20} color="#ba1a1a" />
                    <Text style={styles.disconnectionAlertText}>
                      Disconnection is permanent. You will need to file a new water application to restore service later.
                    </Text>
                  </View>

                  <Text style={styles.inputLabel}>Reason for Disconnection</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={3}
                    placeholder="e.g., House demolition, permanent relocation, merger of plots..."
                    value={reasonText}
                    onChangeText={setReasonText}
                  />

                  <Pressable
                    style={[styles.submitModalBtn, { backgroundColor: "#ba1a1a" }]}
                    onPress={handleDisconnectionSubmit}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitModalBtnText}>Request Disconnection</Text>
                    )}
                  </Pressable>
                </View>
              )}
            </ScrollView>
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
  headingSection: {
    marginBottom: 20,
    marginTop: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 19,
  },

  /* Service Card */
  serviceCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  dangerCard: {
    backgroundColor: "#fff8f7",
    borderColor: "#ffdad6",
  },
  serviceCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  watermarkContainer: {
    position: "absolute",
    right: 0,
    top: -4,
    opacity: 0.8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 14,
  },
  cardActionLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  cardActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0056d2",
  },

  /* Assistance Card */
  assistanceCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
  },
  assistanceHeader: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  assistanceIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#006b5f",
    alignItems: "center",
    justifyContent: "center",
  },
  assistanceTextWrap: {
    flex: 1,
  },
  assistanceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  assistanceSubtitle: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },
  assistanceBtn: {
    backgroundColor: "#c7d2fe",
    borderRadius: 22,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  assistanceBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e1b4b",
  },

  /* Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 14,
    marginBottom: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  modalForm: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginTop: 6,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: "#0f172a",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minHeight: 80,
    fontSize: 14,
    color: "#0f172a",
    textAlignVertical: "top",
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
  },
  optionPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  optionPillSelected: {
    borderColor: "#0056d2",
    backgroundColor: "#eff6ff",
  },
  optionPillText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#475569",
  },
  optionPillTextSelected: {
    color: "#0056d2",
    fontWeight: "700",
  },
  disconnectionAlert: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fee2e2",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  disconnectionAlertText: {
    fontSize: 12,
    color: "#991b1b",
    flex: 1,
    lineHeight: 17,
  },
  submitModalBtn: {
    backgroundColor: "#0040a1",
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  submitModalBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});
