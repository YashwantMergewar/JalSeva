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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Smartphone,
  Mail,
  CreditCard,
  MapPin,
  Building,
  Upload,
  CheckCircle,
  FileCheck,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import { connectionApplicationService } from "../services/connectionApplication.service";
import { MUNICIPAL_WARDS } from "../services/waterSchedule.service";

const STEP_TITLES = [
  "Applicant Information",
  "Property & Address",
  "Connection Details",
  "Document Upload",
  "Review & Submit",
];

export default function NewWaterConnectionScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Applicant
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");

  // Step 2: Property
  const [selectedWard, setSelectedWard] = useState(MUNICIPAL_WARDS[3].name); // Ward 4
  const [houseNumber, setHouseNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [pincode, setPincode] = useState("445204");

  // Step 3: Connection
  const [connectionType, setConnectionType] = useState<"Domestic" | "Commercial" | "Industrial">("Domestic");
  const [pipeSize, setPipeSize] = useState("0.5 inch (15mm)");
  const [dailyRequirement, setDailyRequirement] = useState("500 Litres");

  // Step 4: Documents
  const [aadhaarUploaded, setAadhaarUploaded] = useState(false);
  const [propertyDocUploaded, setPropertyDocUploaded] = useState(false);

  // Step 5: Terms
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateStep1 = () => {
    if (!fullName.trim()) {
      Alert.alert("Required Field", "Please enter your full name as per Aadhaar.");
      return false;
    }
    if (!mobileNumber.trim() || mobileNumber.length < 10) {
      Alert.alert("Required Field", "Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!aadhaarNumber.trim() || aadhaarNumber.replace(/\s+/g, "").length !== 12) {
      Alert.alert("Required Field", "Please enter a valid 12-digit Aadhaar number.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!houseNumber.trim()) {
      Alert.alert("Required Field", "Please enter house / building number.");
      return false;
    }
    if (!streetAddress.trim()) {
      Alert.alert("Required Field", "Please enter street or locality details.");
      return false;
    }
    if (!pincode.trim() || pincode.length !== 6) {
      Alert.alert("Required Field", "Please enter a valid 6-digit municipal pincode.");
      return false;
    }
    return true;
  };

  const validateStep4 = () => {
    if (!aadhaarUploaded || !propertyDocUploaded) {
      Alert.alert(
        "Upload Documents",
        "Please attach mock documents for both Aadhaar Card and Property Ownership."
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 4 && !validateStep4()) return;

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmitApplication = async () => {
    if (!agreedToTerms) {
      Alert.alert("Declaration Required", "Please agree to municipal water service terms.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await connectionApplicationService.submitNewConnection({
        fullName,
        mobile: mobileNumber,
        email: emailAddress,
        aadhaar: aadhaarNumber,
        address: `${houseNumber}, ${streetAddress}`,
        ward: selectedWard,
        pincode,
        connectionType,
        pipeSize,
      });

      Alert.alert(
        "Application Submitted",
        `Your application #${created.applicationNumber} has been logged. You can now track its inspection and review status.`,
        [
          {
            text: "View Application Tracking",
            onPress: () => router.replace("/(citizen)/application-tracking" as any),
          },
        ]
      );
    } catch {
      Alert.alert("Submission Error", "Could not submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* ── Header ── */}
      <CitizenHeader title="Municipal Water" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Back to Services Link ── */}
        <Pressable
          style={styles.backLink}
          onPress={handlePrevious}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft size={16} color="#0040a1" strokeWidth={2} />
          <Text style={styles.backLinkText}>
            {currentStep === 1 ? "Back to Services" : "Previous Step"}
          </Text>
        </Pressable>

        {/* ── Screen Title & Subtitle ── */}
        <Text style={styles.screenTitle}>New Water Connection</Text>
        <Text style={styles.screenSubtitle}>
          Please provide your details to initiate a new municipal water connection request.
        </Text>

        {/* ── Step Progress Indicator ── */}
        <View style={styles.progressContainer}>
          <View style={styles.stepLabelsRow}>
            <Text style={styles.stepCurrentText}>Step {currentStep} of 5</Text>
            <Text style={styles.stepNameText}>{STEP_TITLES[currentStep - 1]}</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(currentStep / 5) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* ── STEP 1: Applicant Information (Screenshot 5 Match) ── */}
        {currentStep === 1 && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeader}>
              <User size={20} color="#0040a1" strokeWidth={2} />
              <Text style={styles.cardHeaderText}>Applicant Details</Text>
            </View>

            <View style={styles.formFields}>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Full Name (as per Aadhaar)"
                  placeholderTextColor="#94a3b8"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputWithIconWrap}>
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="Mobile Number"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
                <Smartphone size={20} color="#64748b" />
              </View>

              <View style={styles.inputWithIconWrap}>
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="Email Address (Optional)"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                />
                <Mail size={20} color="#64748b" />
              </View>

              <View style={styles.inputWithIconWrap}>
                <TextInput
                  style={styles.textInputWithIcon}
                  placeholder="Aadhaar Number (12 Digits)"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  maxLength={14}
                  value={aadhaarNumber}
                  onChangeText={setAadhaarNumber}
                />
                <CreditCard size={20} color="#64748b" />
              </View>
            </View>

            <Pressable
              style={styles.nextBtn}
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel="Next Step"
            >
              <Text style={styles.nextBtnText}>Next</Text>
              <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
            </Pressable>
          </View>
        )}

        {/* ── STEP 2: Property & Address ── */}
        {currentStep === 2 && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeader}>
              <MapPin size={20} color="#0040a1" strokeWidth={2} />
              <Text style={styles.cardHeaderText}>Property & Address</Text>
            </View>

            <View style={styles.formFields}>
              <Text style={styles.subFieldLabel}>Select Municipal Ward</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.wardScroll}
              >
                {MUNICIPAL_WARDS.map((w) => (
                  <Pressable
                    key={w.id}
                    style={[
                      styles.wardChip,
                      selectedWard === w.name && styles.wardChipActive,
                    ]}
                    onPress={() => setSelectedWard(w.name)}
                  >
                    <Text
                      style={[
                        styles.wardChipText,
                        selectedWard === w.name && styles.wardChipTextActive,
                      ]}
                    >
                      {w.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.textInput}
                  placeholder="House / Flat / Plot Number"
                  placeholderTextColor="#94a3b8"
                  value={houseNumber}
                  onChangeText={setHouseNumber}
                />
              </View>

              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Street / Colony / Landmark"
                  placeholderTextColor="#94a3b8"
                  value={streetAddress}
                  onChangeText={setStreetAddress}
                />
              </View>

              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Pincode (6 Digits)"
                  placeholderTextColor="#94a3b8"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={pincode}
                  onChangeText={setPincode}
                />
              </View>
            </View>

            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next</Text>
              <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
            </Pressable>
          </View>
        )}

        {/* ── STEP 3: Connection Details ── */}
        {currentStep === 3 && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeader}>
              <Building size={20} color="#0040a1" strokeWidth={2} />
              <Text style={styles.cardHeaderText}>Connection Details</Text>
            </View>

            <View style={styles.formFields}>
              <Text style={styles.subFieldLabel}>Connection Category</Text>
              <View style={styles.pillRow}>
                {(["Domestic", "Commercial", "Industrial"] as const).map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.pillOption,
                      connectionType === cat && styles.pillOptionActive,
                    ]}
                    onPress={() => setConnectionType(cat)}
                  >
                    <Text
                      style={[
                        styles.pillOptionText,
                        connectionType === cat && styles.pillOptionTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.subFieldLabel}>Supply Pipe Size</Text>
              <View style={styles.pillRow}>
                {["0.5 inch (15mm)", "0.75 inch (20mm)", "1.0 inch (25mm)"].map(
                  (size) => (
                    <Pressable
                      key={size}
                      style={[
                        styles.pillOption,
                        pipeSize === size && styles.pillOptionActive,
                      ]}
                      onPress={() => setPipeSize(size)}
                    >
                      <Text
                        style={[
                          styles.pillOptionText,
                          pipeSize === size && styles.pillOptionTextActive,
                        ]}
                      >
                        {size}
                      </Text>
                    </Pressable>
                  )
                )}
              </View>

              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Estimated Daily Consumption (e.g. 500 Litres)"
                  placeholderTextColor="#94a3b8"
                  value={dailyRequirement}
                  onChangeText={setDailyRequirement}
                />
              </View>
            </View>

            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next</Text>
              <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
            </Pressable>
          </View>
        )}

        {/* ── STEP 4: Document Uploads ── */}
        {currentStep === 4 && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeader}>
              <Upload size={20} color="#0040a1" strokeWidth={2} />
              <Text style={styles.cardHeaderText}>Required Documents</Text>
            </View>

            <View style={styles.formFields}>
              {/* Aadhaar Upload Box */}
              <Pressable
                style={[
                  styles.uploadBox,
                  aadhaarUploaded && styles.uploadBoxDone,
                ]}
                onPress={() => setAadhaarUploaded(!aadhaarUploaded)}
              >
                {aadhaarUploaded ? (
                  <CheckCircle size={28} color="#166534" />
                ) : (
                  <Upload size={28} color="#0056d2" />
                )}
                <Text style={styles.uploadBoxTitle}>Aadhaar Card Copy (PDF/JPG)</Text>
                <Text style={styles.uploadBoxSub}>
                  {aadhaarUploaded ? "Attached: aadhaar_card.pdf" : "Tap to upload identity proof"}
                </Text>
              </Pressable>

              {/* Property Document Box */}
              <Pressable
                style={[
                  styles.uploadBox,
                  propertyDocUploaded && styles.uploadBoxDone,
                ]}
                onPress={() => setPropertyDocUploaded(!propertyDocUploaded)}
              >
                {propertyDocUploaded ? (
                  <FileCheck size={28} color="#166534" />
                ) : (
                  <Upload size={28} color="#0056d2" />
                )}
                <Text style={styles.uploadBoxTitle}>
                  Property Ownership / Tax Receipt
                </Text>
                <Text style={styles.uploadBoxSub}>
                  {propertyDocUploaded
                    ? "Attached: property_tax_receipt.pdf"
                    : "Tap to upload latest municipal property tax slip"}
                </Text>
              </Pressable>
            </View>

            <Pressable style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next</Text>
              <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
            </Pressable>
          </View>
        )}

        {/* ── STEP 5: Review & Submit ── */}
        {currentStep === 5 && (
          <View style={styles.cardBox}>
            <View style={styles.cardHeader}>
              <FileCheck size={20} color="#0040a1" strokeWidth={2} />
              <Text style={styles.cardHeaderText}>Review Application</Text>
            </View>

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Applicant Name:</Text>
                <Text style={styles.summaryVal}>{fullName}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Mobile:</Text>
                <Text style={styles.summaryVal}>{mobileNumber}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Aadhaar:</Text>
                <Text style={styles.summaryVal}>XXXX-XXXX-{aadhaarNumber.slice(-4)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Ward:</Text>
                <Text style={styles.summaryVal}>{selectedWard}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Address:</Text>
                <Text style={styles.summaryVal}>
                  {houseNumber}, {streetAddress}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Connection Type:</Text>
                <Text style={styles.summaryVal}>{connectionType} ({pipeSize})</Text>
              </View>
            </View>

            {/* Declaration Checkbox */}
            <Pressable
              style={styles.declarationRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View
                style={[
                  styles.checkbox,
                  agreedToTerms && styles.checkboxActive,
                ]}
              >
                {agreedToTerms && <CheckCircle size={14} color="#ffffff" />}
              </View>
              <Text style={styles.declarationText}>
                I hereby declare that the details provided are true and I agree to municipal water connection guidelines.
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.submitBtn,
                !agreedToTerms && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmitApplication}
              disabled={submitting || !agreedToTerms}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Application</Text>
              )}
            </Pressable>
          </View>
        )}

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

  /* Back Link */
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  backLinkText: {
    fontSize: 14,
    color: "#0040a1",
    fontWeight: "600",
  },

  /* Titles */
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 18,
  },

  /* Progress */
  progressContainer: {
    marginBottom: 20,
  },
  stepLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCurrentText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0040a1",
  },
  stepNameText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: "#e2e8f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0040a1",
    borderRadius: 3,
  },

  /* Card Box */
  cardBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 12,
    marginBottom: 16,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },

  /* Inputs */
  formFields: {
    gap: 14,
    marginBottom: 24,
  },
  subFieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  textInput: {
    height: 50,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0f172a",
  },
  inputWithIconWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    paddingRight: 14,
    backgroundColor: "#ffffff",
  },
  textInputWithIcon: {
    flex: 1,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0f172a",
  },

  /* Wards horizontal */
  wardScroll: {
    flexDirection: "row",
    paddingBottom: 4,
  },
  wardChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    marginRight: 8,
  },
  wardChipActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#0040a1",
  },
  wardChipText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "500",
  },
  wardChipTextActive: {
    color: "#0040a1",
    fontWeight: "700",
  },

  /* Pills */
  pillRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  pillOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  pillOptionActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#0040a1",
  },
  pillOptionText: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
  },
  pillOptionTextActive: {
    color: "#0040a1",
    fontWeight: "700",
  },

  /* Upload */
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#93c5fd",
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  uploadBoxDone: {
    borderColor: "#86efac",
    backgroundColor: "#f0fdf4",
  },
  uploadBoxTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  uploadBoxSub: {
    fontSize: 12,
    color: "#64748b",
  },

  /* Review Summary */
  summaryContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryKey: {
    fontSize: 13,
    color: "#64748b",
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    maxWidth: "60%",
    textAlign: "right",
  },

  /* Declaration */
  declarationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#64748b",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: "#0040a1",
    borderColor: "#0040a1",
  },
  declarationText: {
    fontSize: 12,
    color: "#475569",
    flex: 1,
    lineHeight: 18,
  },

  /* Next / Submit Button */
  nextBtn: {
    backgroundColor: "#0040a1",
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "flex-end",
    paddingHorizontal: 28,
  },
  nextBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  submitBtn: {
    backgroundColor: "#0040a1",
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
