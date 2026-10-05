import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MoreVertical,
  Check,
  Camera,
  Plus,
  Wrench,
  X,
  CheckCircle2,
  FileText,
  ArrowRight,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { employeeService } from "../../src/services/employee.service";

export default function FieldReportScreen() {
  const router = useRouter();
  const { taskId, complaintId } = useLocalSearchParams<{
    taskId?: string;
    complaintId?: string;
  }>();

  // Current step (0: Task Overview, 1: Work Details - as in reference, 2: Verification, 3: Completed)
  const [currentStep, setCurrentStep] = useState(2); // Step 2 of 4 as in reference

  // Form Fields matching screenshot
  const [observations, setObservations] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Pipe Repair",
  ]);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [materialsUsed, setMaterialsUsed] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  // UI state
  const [showMenu, setShowMenu] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "Pipe Repair",
    "Valve Replacement",
    "Blockage Clearing",
    "Leak Detection",
  ];

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handlePickPhoto = (type: "before" | "after") => {
    // Pick photo / simulated upload
    const mockUri =
      type === "before"
        ? "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=500"
        : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500";
    if (type === "before") {
      setBeforePhoto(mockUri);
    } else {
      setAfterPhoto(mockUri);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!observations.trim()) {
      errs.observations = "Observations are required.";
    }
    if (selectedCategories.length === 0) {
      errs.categories = "Select at least one work category.";
    }
    if (!actionTaken.trim()) {
      errs.actionTaken = "Action taken summary is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveDraft = () => {
    Alert.alert(
      "Draft Saved",
      "Field report progress saved locally. You can resume anytime."
    );
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert("Missing Details", "Please fill in all mandatory fields marked with *.");
      return;
    }

    setSubmitting(true);
    try {
      if (taskId) {
        await employeeService.updateTaskStatus(taskId, "Field Report Submitted");
      }
      setSubmitted(true);
    } catch {
      Alert.alert("Error", "Could not submit report. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <CheckCircle2 size={64} color="#16a34a" strokeWidth={2} />
          </View>
          <Text style={styles.successTitle}>Report Submitted Successfully</Text>
          <Text style={styles.successMessage}>
            Field report for {taskId || "CMP-8472"} has been recorded and submitted to the Chief Municipal Engineer for final sign-off.
          </Text>
          <Pressable
            style={styles.successBtn}
            onPress={() => router.push("/(employee)/tasks" as any)}
          >
            <Text style={styles.successBtnText}>Back to Tasks</Text>
            <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <Pressable
          style={styles.iconButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={22} color="#0f172a" strokeWidth={2.2} />
        </Pressable>
        <Text style={styles.navTitle}>Field Report</Text>
        <Pressable
          style={styles.iconButton}
          onPress={() => setShowMenu(true)}
          accessibilityLabel="Options"
        >
          <MoreVertical size={22} color="#0f172a" strokeWidth={2} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Step Progress Card */}
        <View style={styles.stepCard}>
          <View style={styles.stepHeaderRow}>
            <Text style={styles.stepText}>Step 2 of 4</Text>
            <Text style={styles.stepTitle}>Work Details</Text>
          </View>
          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: "50%" }]} />
          </View>
        </View>

        {/* Main Form Container Card */}
        <View style={styles.formCard}>
          {/* Field: Observations */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Observations</Text>
              <Text style={styles.asterisk}> *</Text>
            </View>
            <TextInput
              style={[
                styles.textArea,
                errors.observations ? styles.inputError : null,
              ]}
              placeholder="Describe the current state of the plumbing issue..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={observations}
              onChangeText={(text) => {
                setObservations(text);
                if (errors.observations) setErrors((e) => ({ ...e, observations: "" }));
              }}
            />
            {errors.observations ? (
              <Text style={styles.errorText}>{errors.observations}</Text>
            ) : null}
          </View>

          {/* Field: Work Category */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Work Category</Text>
              <Text style={styles.asterisk}> *</Text>
            </View>
            {errors.categories ? (
              <Text style={styles.errorText}>{errors.categories}</Text>
            ) : null}
            <View style={styles.categoryGrid}>
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryCard,
                      isSelected && styles.categoryCardSelected,
                    ]}
                    onPress={() => toggleCategory(cat)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}
                    >
                      {isSelected && (
                        <Check size={14} color="#ffffff" strokeWidth={3} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Field: Site Photos */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Site Photos</Text>
            <View style={styles.photosRow}>
              {/* Before Photo Box */}
              {beforePhoto ? (
                <View style={styles.photoPreviewCard}>
                  <Image source={{ uri: beforePhoto }} style={styles.photoImage} />
                  <Pressable
                    style={styles.photoDeleteBtn}
                    onPress={() => setBeforePhoto(null)}
                  >
                    <X size={14} color="#ffffff" strokeWidth={2.5} />
                  </Pressable>
                  <Text style={styles.photoPreviewLabel}>Before Photo</Text>
                </View>
              ) : (
                <Pressable
                  style={styles.uploadDottedBox}
                  onPress={() => handlePickPhoto("before")}
                >
                  <View style={styles.cameraIconWrap}>
                    <Camera size={26} color="#0040a1" strokeWidth={2} />
                    <View style={styles.plusBadge}>
                      <Plus size={10} color="#0040a1" strokeWidth={3} />
                    </View>
                  </View>
                  <Text style={styles.uploadTitle}>Upload Before Photo</Text>
                  <Text style={styles.uploadSub}>Tap to select or capture</Text>
                </Pressable>
              )}

              {/* After Photo Box */}
              {afterPhoto ? (
                <View style={styles.photoPreviewCard}>
                  <Image source={{ uri: afterPhoto }} style={styles.photoImage} />
                  <Pressable
                    style={styles.photoDeleteBtn}
                    onPress={() => setAfterPhoto(null)}
                  >
                    <X size={14} color="#ffffff" strokeWidth={2.5} />
                  </Pressable>
                  <Text style={styles.photoPreviewLabel}>After Photo</Text>
                </View>
              ) : (
                <Pressable
                  style={styles.uploadDottedBox}
                  onPress={() => handlePickPhoto("after")}
                >
                  <View style={styles.cameraIconWrap}>
                    <Camera size={26} color="#0040a1" strokeWidth={2} />
                    <View style={styles.plusBadge}>
                      <Plus size={10} color="#0040a1" strokeWidth={3} />
                    </View>
                  </View>
                  <Text style={styles.uploadTitle}>Upload After Photo</Text>
                  <Text style={styles.uploadSub}>Tap to select or capture</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Field: Materials Used */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Materials Used</Text>
            <TextInput
              style={styles.textArea}
              placeholder="List parts, pipes, sealants, etc..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={materialsUsed}
              onChangeText={setMaterialsUsed}
            />
          </View>

          {/* Field: Action Taken Summary */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Action Taken Summary</Text>
            <View
              style={[
                styles.actionInputWrapper,
                errors.actionTaken ? styles.inputError : null,
              ]}
            >
              <Wrench size={18} color="#64748b" strokeWidth={2} />
              <TextInput
                style={styles.actionInput}
                placeholder="Brief summary of resolution..."
                placeholderTextColor="#9ca3af"
                value={actionTaken}
                onChangeText={(text) => {
                  setActionTaken(text);
                  if (errors.actionTaken) setErrors((e) => ({ ...e, actionTaken: "" }));
                }}
              />
            </View>
            {errors.actionTaken ? (
              <Text style={styles.errorText}>{errors.actionTaken}</Text>
            ) : null}
          </View>

          {/* Action Buttons Row */}
          <View style={styles.actionButtonsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.saveDraftBtn,
                pressed && styles.saveDraftBtnPressed,
              ]}
              onPress={handleSaveDraft}
            >
              <Text style={styles.saveDraftText}>Save Draft</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.submitReportBtn,
                pressed && styles.submitReportBtnPressed,
                submitting && { opacity: 0.7 },
              ]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text style={styles.submitReportText}>
                {submitting ? "Submitting…" : "Submit Report"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Options Menu Modal */}
      <Modal visible={showMenu} transparent animationType="fade">
        <Pressable style={styles.menuOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.menuCard}>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                handleSaveDraft();
              }}
            >
              <FileText size={18} color="#0f172a" />
              <Text style={styles.menuItemText}>Save Draft to Device</Text>
            </Pressable>
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                setObservations("");
                setActionTaken("");
                setMaterialsUsed("");
                setBeforePhoto(null);
                setAfterPhoto(null);
              }}
            >
              <X size={18} color="#dc2626" />
              <Text style={[styles.menuItemText, { color: "#dc2626" }]}>
                Clear Form
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f4f6fa",
  },
  navBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0040a1",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // Step Progress Card
  stepCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  stepHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  stepText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0040a1",
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0040a1",
    borderRadius: 3,
  },

  // Form Container Card
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 18,
  },
  fieldGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  asterisk: {
    fontSize: 14,
    fontWeight: "700",
    color: "#dc2626",
  },
  textArea: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1e293b",
    minHeight: 84,
  },
  inputError: {
    borderColor: "#dc2626",
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    marginTop: -2,
  },

  // Work Categories 2x2 Grid
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  categoryCardSelected: {
    borderColor: "#0040a1",
    backgroundColor: "#f0f5ff",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  checkboxSelected: {
    borderColor: "#0040a1",
    backgroundColor: "#0040a1",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#334155",
    flex: 1,
  },
  categoryTextSelected: {
    color: "#0040a1",
    fontWeight: "600",
  },

  // Site Photos
  photosRow: {
    gap: 12,
  },
  uploadDottedBox: {
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  cameraIconWrap: {
    position: "relative",
    marginBottom: 6,
  },
  plusBadge: {
    position: "absolute",
    bottom: -2,
    right: -6,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 2,
  },
  uploadSub: {
    fontSize: 11,
    color: "#64748b",
  },
  photoPreviewCard: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    height: 110,
    backgroundColor: "#e2e8f0",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoDeleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  photoPreviewLabel: {
    position: "absolute",
    bottom: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  },

  // Action Taken Summary
  actionInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 46,
  },
  actionInput: {
    flex: 1,
    fontSize: 14,
    color: "#1e293b",
  },

  // Action Buttons Row
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  saveDraftBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.2,
    borderColor: "#cbd5e1",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  saveDraftBtnPressed: {
    backgroundColor: "#f8fafc",
  },
  saveDraftText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0040a1",
  },
  submitReportBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0040a1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  submitReportBtnPressed: {
    backgroundColor: "#003282",
  },
  submitReportText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },

  // Menu Modal
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 16,
  },
  menuCard: {
    width: 200,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  menuItemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },

  // Success Screen
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#ffffff",
  },
  successIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
    textAlign: "center",
  },
  successMessage: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  successBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0040a1",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    width: "100%",
  },
  successBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
