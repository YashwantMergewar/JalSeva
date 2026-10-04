import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ChevronDown,
  Camera,
  Video,
  Send,
  Navigation,
  CheckCircle2,
  X,
  Trash2,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import {
  complaintService,
  COMPLAINT_CATEGORIES,
} from "../services/complaint.service";

export default function SubmitComplaintScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [category, setCategory] = useState<string>(
    (params.category as string) || ""
  );
  const [description, setDescription] = useState("");
  const [areaLocation, setAreaLocation] = useState(
    (params.location as string) || ""
  );
  const [pincode, setPincode] = useState("");
  const [evidenceList, setEvidenceList] = useState<string[]>([]);

  const [detectingLocation, setDetectingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleAddEvidence = () => {
    if (evidenceList.length >= 3) {
      Alert.alert("Limit Reached", "You can attach up to 3 evidence files.");
      return;
    }
    const mockFileName = `evidence_file_${evidenceList.length + 1}.jpg`;
    setEvidenceList([...evidenceList, mockFileName]);
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceList(evidenceList.filter((_, i) => i !== index));
  };

  const handleAutoDetectLocation = () => {
    setDetectingLocation(true);
    setTimeout(() => {
      setAreaLocation("Sector 4, MG Road");
      setPincode("445204");
      setDetectingLocation(false);
      Alert.alert("Location Detected", "Area auto-filled: Sector 4, MG Road (Pincode: 445204)");
    }, 600);
  };

  const handleSubmit = async () => {
    if (!category) {
      Alert.alert("Category Required", "Please select a complaint type from the dropdown.");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Description Required", "Please provide detailed information about the problem.");
      return;
    }
    if (!areaLocation.trim()) {
      Alert.alert("Location Required", "Please enter the Area / Locality.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await complaintService.submitComplaint({
        category,
        description: description.trim(),
        ward: "Ward 4 - Sector 4",
        location: areaLocation.trim(),
        evidenceUris: evidenceList,
      });

      Alert.alert(
        "Complaint Submitted",
        `Complaint #${created.complaintNumber} has been logged successfully.`,
        [
          {
            text: "View Complaint",
            onPress: () =>
              router.replace({
                pathname: "/(citizen)/complaint-details" as any,
                params: { id: created.id },
              }),
          },
        ]
      );
    } catch {
      Alert.alert("Error", "Could not submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Municipal Water" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Screen Heading (Screenshot 3 Match) ── */}
        <Text style={styles.screenTitle}>Submit Complaint</Text>
        <Text style={styles.screenSubtitle}>
          Please provide details about the water-related issue in your area.
        </Text>

        {/* ── Form Card ── */}
        <View style={styles.formCard}>
          {/* 1. Complaint Type */}
          <Text style={styles.fieldLabel}>Complaint Type</Text>
          <Pressable
            style={styles.dropdownBtn}
            onPress={() => setShowCategoryModal(true)}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.dropdownText,
                !category && styles.dropdownPlaceholder,
              ]}
            >
              {category || "Select an issue category"}
            </Text>
            <ChevronDown size={20} color="#334155" />
          </Pressable>

          {/* 2. Description */}
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="Provide detailed information about the problem..."
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
          />

          {/* 3. Location */}
          <Text style={styles.fieldLabel}>Location</Text>

          {/* Auto-detect Mint Pill Button */}
          <Pressable
            style={styles.autoDetectBtn}
            onPress={handleAutoDetectLocation}
            disabled={detectingLocation}
            accessibilityRole="button"
          >
            {detectingLocation ? (
              <ActivityIndicator color="#004d40" size="small" />
            ) : (
              <>
                <Navigation size={18} color="#004d40" strokeWidth={2.2} />
                <Text style={styles.autoDetectBtnText}>Auto-detect</Text>
              </>
            )}
          </Pressable>

          <TextInput
            style={styles.inputField}
            placeholder="Area / Locality"
            placeholderTextColor="#94a3b8"
            value={areaLocation}
            onChangeText={setAreaLocation}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Pincode"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
            maxLength={6}
            value={pincode}
            onChangeText={setPincode}
          />

          {/* 4. Evidence (Optional) */}
          <Text style={styles.fieldLabel}>Evidence (Optional)</Text>

          <Pressable
            style={styles.dashedUploadBox}
            onPress={handleAddEvidence}
            accessibilityRole="button"
          >
            <View style={styles.uploadIconsRow}>
              <Camera size={26} color="#0f172a" strokeWidth={1.8} />
              <Video size={26} color="#0f172a" strokeWidth={1.8} />
            </View>
            <Text style={styles.uploadLinkText}>
              Tap to upload photos or videos
            </Text>
            <Text style={styles.uploadLimitText}>Max size: 10MB</Text>
          </Pressable>

          {/* Attached Files List */}
          {evidenceList.map((file, idx) => (
            <View key={idx} style={styles.evidenceItem}>
              <Camera size={14} color="#0040a1" />
              <Text style={styles.evidenceItemText}>{file}</Text>
              <Pressable onPress={() => handleRemoveEvidence(idx)} hitSlop={8}>
                <Trash2 size={15} color="#ba1a1a" />
              </Pressable>
            </View>
          ))}

          {/* 5. Submit Complaint Button */}
          <Pressable
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Send size={18} color="#ffffff" strokeWidth={2} />
                <Text style={styles.submitBtnText}>Submit Complaint</Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Category Dropdown Modal ── */}
      <Modal
        visible={showCategoryModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select an issue category</Text>
              <Pressable onPress={() => setShowCategoryModal(false)} hitSlop={10}>
                <X size={20} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 360 }}>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.modalItem,
                    category === cat.name && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setCategory(cat.name);
                    setShowCategoryModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      category === cat.name && styles.modalItemTextSelected,
                    ]}
                  >
                    {cat.name}
                  </Text>
                  {category === cat.name && <CheckCircle2 size={18} color="#0040a1" />}
                </Pressable>
              ))}
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
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0040a1",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    marginBottom: 20,
  },

  /* Form Card */
  formCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
    gap: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 4,
  },

  /* Dropdown */
  dropdownBtn: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
  },
  dropdownText: {
    fontSize: 14,
    color: "#0f172a",
  },
  dropdownPlaceholder: {
    color: "#64748b",
  },

  /* Text Area */
  textArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 110,
    fontSize: 14,
    color: "#0f172a",
    textAlignVertical: "top",
  },

  /* Auto-detect Button */
  autoDetectBtn: {
    backgroundColor: "#8df1e0", // Mint teal from screenshot
    height: 46,
    borderRadius: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  autoDetectBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#004d40",
  },

  /* Input Field */
  inputField: {
    height: 50,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },

  /* Dashed Upload Box */
  dashedUploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    gap: 6,
  },
  uploadIconsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
  uploadLinkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0056d2",
  },
  uploadLimitText: {
    fontSize: 12,
    color: "#64748b",
  },

  /* Evidence List */
  evidenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  evidenceItemText: {
    fontSize: 13,
    color: "#0040a1",
    flex: 1,
    marginLeft: 8,
  },

  /* Submit Button */
  submitBtn: {
    backgroundColor: "#0040a1",
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  submitBtnDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
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
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 14,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  modalItemSelected: {
    backgroundColor: "#eff6ff",
  },
  modalItemText: {
    fontSize: 14,
    color: "#334155",
  },
  modalItemTextSelected: {
    color: "#0040a1",
    fontWeight: "700",
  },
});
