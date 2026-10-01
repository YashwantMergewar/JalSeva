import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Info,
  User,
  Mail,
  Phone,
  Camera,
  Droplets,
  Briefcase,
  Building2,
  ChevronDown,
  Lock,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  X,
} from "lucide-react-native";
import {
  apiGetRoles,
  apiGetDepartments,
  Role,
  Department,
} from "../../src/api/employee.api";
import { useAuth } from "../../src/context/AuthContext";

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "dept-water", name: "Water Department", description: "Water supply, treatment and pipeline management" },
  { id: "dept-sanitation", name: "Sanitation Department", description: "Waste and sanitation services" },
  { id: "dept-drainage", name: "Drainage & Sewerage", description: "Stormwater and sewerage management" },
  { id: "dept-admin", name: "Administration", description: "Municipal governance and operations" },
];

const DEFAULT_ROLES: Role[] = [
  { id: "role-engineer", name: "Engineer", description: "Grievance Level 2 Authority & Technical Operations" },
  { id: "role-inspector", name: "Field Inspector", description: "Site inspections and quality audits" },
  { id: "role-plumber", name: "Senior Plumber", description: "Maintenance & pipeline repairs" },
  { id: "role-officer", name: "Desk Officer", description: "Administrative record keeping" },
];

const DEFAULT_OFFICES = [
  "Central Water Works",
  "North Pumping Station",
  "South Water Treatment Plant",
  "East Municipal Depot",
  "Headquarters - Civil Lines",
];

export default function AddEmployeeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Form Fields
  const [fullname, setFullname] = useState("Rahul Patil");
  const [email, setEmail] = useState("rahul.patil@muni.gov.in");
  const [mobileNo, setMobileNo] = useState("9823019842");
  const [photoAdded, setPhotoAdded] = useState(false);

  // Department & Role lists
  const [departments, setDepartments] = useState<Department[]>(DEFAULT_DEPARTMENTS);
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [offices] = useState<string[]>(DEFAULT_OFFICES);

  // Selected values
  const [selectedDept, setSelectedDept] = useState<Department>(DEFAULT_DEPARTMENTS[0]);
  const [selectedRole, setSelectedRole] = useState<Role>(DEFAULT_ROLES[0]);
  const [selectedOffice, setSelectedOffice] = useState<string>(DEFAULT_OFFICES[0]);

  // Modal pickers
  const [activePicker, setActivePicker] = useState<"DEPT" | "ROLE" | "OFFICE" | null>(null);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch live roles & departments from backend
    (async () => {
      try {
        const [rRes, dRes] = await Promise.allSettled([
          apiGetRoles(),
          apiGetDepartments(),
        ]);
        if (rRes.status === "fulfilled" && rRes.value.success && rRes.value.data?.length) {
          setRoles(rRes.value.data);
          setSelectedRole(rRes.value.data[0]);
        }
        if (dRes.status === "fulfilled" && dRes.value.success && dRes.value.data?.length) {
          setDepartments(dRes.value.data);
          setSelectedDept(dRes.value.data[0]);
        }
      } catch {
        // Defaults already set
      }
    })();
  }, []);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!fullname.trim()) errs.fullname = "Full name is required";
    if (!email.trim() || !email.includes("@")) errs.email = "Valid email address is required";
    const cleanedMobile = mobileNo.replace(/\D/g, "");
    if (cleanedMobile.length !== 10) errs.mobileNo = "Enter a valid 10-digit mobile number";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReview = () => {
    if (!validate()) {
      Alert.alert("Validation Error", "Please ensure all required fields are accurately filled.");
      return;
    }

    const payload = {
      fullname: fullname.trim(),
      email: email.trim().toLowerCase(),
      mobile_no: mobileNo.replace(/\D/g, ""),
      roleId: selectedRole.id,
      roleName: selectedRole.name,
      roleDesc: selectedRole.description || "Grievance Level 2 Authority",
      departmentId: selectedDept.id,
      departmentName: selectedDept.name,
      officeName: selectedOffice,
      supervisor: "Chief Officer",
    };

    router.push({
      pathname: "/(admin)/review-employee",
      params: { data: JSON.stringify(payload) },
    } as any);
  };

  const initial = user?.fullname?.charAt(0).toUpperCase() ?? "A";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <ArrowLeft size={20} color="#1e293b" strokeWidth={2} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Employee</Text>
        <View style={styles.avatarBtn}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle Banner */}
        <View style={styles.subBanner}>
          <View style={styles.subBannerTagRow}>
            <Building2 size={13} color="#0649aa" strokeWidth={2} />
            <Text style={styles.subBannerTag}>HR PORTAL • PERSONNEL RECORDS</Text>
          </View>
          <Text style={styles.subBannerDesc}>
            Create an employee record and assign predefined municipal roles.
          </Text>
        </View>

        {/* Administrative Notice Box */}
        <View style={styles.noticeBox}>
          <View style={styles.noticeIconWrap}>
            <Info size={18} color="#0649aa" strokeWidth={2.2} />
          </View>
          <View style={styles.noticeTextWrap}>
            <Text style={styles.noticeTitle}>Administrative Notice</Text>
            <Text style={styles.noticeBody}>
              Employees cannot self-register. Creating this account generates an
              invitation link allowing the employee to activate their account and set
              their password.
            </Text>
          </View>
        </View>

        {/* Stepper Indicator */}
        <View style={styles.stepperWrap}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, styles.stepCircleActive]}>
              <Text style={styles.stepNumActive}>1</Text>
            </View>
            <Text style={styles.stepLabelActive}>Record Entry</Text>
          </View>

          <View style={styles.stepConnector} />

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Review</Text>
          </View>

          <View style={styles.stepConnector} />

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={styles.stepCircle}>
              <Text style={styles.stepNum}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Issue Pass</Text>
          </View>
        </View>

        {/* ──────── Section 1: Personal Information ──────── */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={styles.sectionIconWrap}>
                <User size={18} color="#0649aa" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>
                  Section 1: Personal Information
                </Text>
                <Text style={styles.sectionSub}>
                  Identity & verification contact points
                </Text>
              </View>
            </View>
            <View style={styles.stepBadgeCyan}>
              <Text style={styles.stepBadgeCyanText}>Step 1 of 2</Text>
            </View>
          </View>

          {/* Field: Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputBox, errors.fullname && styles.inputError]}>
              <User size={16} color="#64748b" strokeWidth={1.8} />
              <TextInput
                style={styles.input}
                value={fullname}
                onChangeText={(v) => {
                  setFullname(v);
                  if (errors.fullname) setErrors({ ...errors, fullname: "" });
                }}
                placeholder="Enter official full name"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <Text style={styles.helperText}>
              As stated in the official Government Aadhaar / Voter ID card
            </Text>
          </View>

          {/* Field: Official Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Official Email Address <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputBox, errors.email && styles.inputError]}>
              <Mail size={16} color="#64748b" strokeWidth={1.8} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(v) => {
                  setEmail(v);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                placeholder="official.email@muni.gov.in"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <Text style={styles.helperHighlight}>
              ↳ Activation link will be sent to this email
            </Text>
          </View>

          {/* Field: Mobile Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Mobile Number <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputBox, errors.mobileNo && styles.inputError]}>
              <View style={styles.flagWrap}>
                <Text style={styles.flagText}>🇮🇳</Text>
                <Text style={styles.countryCode}>+91</Text>
              </View>
              <View style={styles.vDivider} />
              <TextInput
                style={styles.input}
                value={mobileNo}
                onChangeText={(v) => {
                  setMobileNo(v);
                  if (errors.mobileNo) setErrors({ ...errors, mobileNo: "" });
                }}
                placeholder="9823019842"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                maxLength={10}
              />
              {mobileNo.replace(/\D/g, "").length === 10 && (
                <CheckCircle2 size={16} color="#059669" strokeWidth={2} />
              )}
            </View>
            <Text style={styles.helperText}>
              Used for two-factor authentication (2FA) municipal logins
            </Text>
          </View>

          {/* Field: Employee Photo (Optional) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Employee Photo (Optional)</Text>
            <Pressable
              style={[styles.uploadBox, photoAdded && styles.uploadBoxActive]}
              onPress={() => setPhotoAdded(!photoAdded)}
            >
              <View style={styles.uploadIconWrap}>
                <Camera size={22} color="#0649aa" strokeWidth={1.8} />
              </View>
              <Text style={styles.uploadTitle}>
                {photoAdded ? "Photo Attached (Ready for Card)" : "Upload Employee Photo"}
              </Text>
              <Text style={styles.uploadSub}>JPG, PNG or WEBP up to 5MB</Text>
              <View style={styles.uploadBadge}>
                <Text style={styles.uploadBadgeText}>
                  🪪 Prints directly onto Digital ID card
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* ──────── Section 2: Employment Information ──────── */}
        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleLeft}>
              <View style={[styles.sectionIconWrap, { backgroundColor: "#e0e7ff" }]}>
                <Briefcase size={18} color="#4338ca" strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.sectionTitle}>
                  Section 2: Employment Information
                </Text>
                <Text style={styles.sectionSub}>
                  Administrative jurisdiction & clearances
                </Text>
              </View>
            </View>
            <View style={styles.stepBadgePurple}>
              <Text style={styles.stepBadgePurpleText}>Step 2 of 2</Text>
            </View>
          </View>

          {/* Field: Assigned Department */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Assigned Department <Text style={styles.required}>*</Text>
            </Text>
            <Pressable
              style={styles.dropdownBtn}
              onPress={() => setActivePicker("DEPT")}
            >
              <View style={styles.dropdownLeft}>
                <Droplets size={16} color="#0649aa" strokeWidth={2} />
                <Text style={styles.dropdownValue}>{selectedDept.name}</Text>
              </View>
              <ChevronDown size={18} color="#64748b" />
            </Pressable>
            <Text style={styles.helperText}>
              Allocates primary department quota & workflow routing
            </Text>
          </View>

          {/* Field: Predefined Role */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                Predefined Role <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.clearanceBadge}>
                <Text style={styles.clearanceBadgeText}>Level 4 Clearance</Text>
              </View>
            </View>
            <Pressable
              style={styles.dropdownBtn}
              onPress={() => setActivePicker("ROLE")}
            >
              <View style={styles.dropdownLeft}>
                <User size={16} color="#0649aa" strokeWidth={2} />
                <Text style={styles.dropdownValue}>{selectedRole.name}</Text>
              </View>
              <ChevronDown size={18} color="#64748b" />
            </Pressable>

            {/* Lock Notice */}
            <View style={styles.lockNoticeBox}>
              <Lock size={14} color="#d97706" strokeWidth={2} />
              <Text style={styles.lockNoticeText}>
                Roles are predefined by the municipal administration to maintain SLA
                compliance. Custom roles are not permitted.
              </Text>
            </View>
          </View>

          {/* Field: Office / Sub-division */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>
              Office / Sub-division <Text style={styles.required}>*</Text>
            </Text>
            <Pressable
              style={styles.dropdownBtn}
              onPress={() => setActivePicker("OFFICE")}
            >
              <View style={styles.dropdownLeft}>
                <Building2 size={16} color="#0649aa" strokeWidth={2} />
                <Text style={styles.dropdownValue}>{selectedOffice}</Text>
              </View>
              <ChevronDown size={18} color="#64748b" />
            </Pressable>
            <Text style={styles.helperText}>
              Designates physical check-in kiosk and field roster assignment
            </Text>
          </View>
        </View>

        {/* Aadhaar Verification Banner */}
        <View style={styles.aadhaarBanner}>
          <View style={styles.aadhaarIconWrap}>
            <ShieldCheck size={18} color="#0649aa" strokeWidth={2} />
          </View>
          <View style={styles.aadhaarTextWrap}>
            <Text style={styles.aadhaarTitle}>
              Aadhaar e-Sign Verification Ready
            </Text>
            <Text style={styles.aadhaarSub}>
              The invitation sent will require OTP validation using UIDAI registered
              mobile.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.submitBtn} onPress={handleReview}>
            <Text style={styles.submitBtnText}>Review Employee Details</Text>
            <ArrowRight size={16} color="#ffffff" strokeWidth={2} />
          </Pressable>

          <Pressable
            style={styles.cancelBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Picker Modal */}
      <Modal
        visible={activePicker !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActivePicker(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activePicker === "DEPT"
                  ? "Select Department"
                  : activePicker === "ROLE"
                  ? "Select Predefined Role"
                  : "Select Office / Sub-division"}
              </Text>
              <Pressable
                onPress={() => setActivePicker(null)}
                style={styles.modalCloseBtn}
              >
                <X size={18} color="#64748b" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalList}>
              {activePicker === "DEPT" &&
                departments.map((d) => (
                  <Pressable
                    key={d.id}
                    style={[
                      styles.modalItem,
                      selectedDept.id === d.id && styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setSelectedDept(d);
                      setActivePicker(null);
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          styles.modalItemTitle,
                          selectedDept.id === d.id && styles.modalItemTitleActive,
                        ]}
                      >
                        {d.name}
                      </Text>
                      {d.description ? (
                        <Text style={styles.modalItemSub}>{d.description}</Text>
                      ) : null}
                    </View>
                    {selectedDept.id === d.id && (
                      <CheckCircle2 size={18} color="#0649aa" strokeWidth={2} />
                    )}
                  </Pressable>
                ))}

              {activePicker === "ROLE" &&
                roles.map((r) => (
                  <Pressable
                    key={r.id}
                    style={[
                      styles.modalItem,
                      selectedRole.id === r.id && styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setSelectedRole(r);
                      setActivePicker(null);
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          styles.modalItemTitle,
                          selectedRole.id === r.id && styles.modalItemTitleActive,
                        ]}
                      >
                        {r.name}
                      </Text>
                      {r.description ? (
                        <Text style={styles.modalItemSub}>{r.description}</Text>
                      ) : null}
                    </View>
                    {selectedRole.id === r.id && (
                      <CheckCircle2 size={18} color="#0649aa" strokeWidth={2} />
                    )}
                  </Pressable>
                ))}

              {activePicker === "OFFICE" &&
                offices.map((off) => (
                  <Pressable
                    key={off}
                    style={[
                      styles.modalItem,
                      selectedOffice === off && styles.modalItemActive,
                    ]}
                    onPress={() => {
                      setSelectedOffice(off);
                      setActivePicker(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemTitle,
                        selectedOffice === off && styles.modalItemTitleActive,
                      ]}
                    >
                      {off}
                    </Text>
                    {selectedOffice === off && (
                      <CheckCircle2 size={18} color="#0649aa" strokeWidth={2} />
                    )}
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
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  subBanner: {
    marginBottom: 14,
  },
  subBannerTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  subBannerTag: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0649aa",
    letterSpacing: 0.5,
  },
  subBannerDesc: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
  noticeBox: {
    flexDirection: "row",
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    marginBottom: 16,
  },
  noticeIconWrap: {
    marginTop: 2,
  },
  noticeTextWrap: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  noticeBody: {
    fontSize: 12,
    color: "#1e40af",
    lineHeight: 18,
    marginTop: 2,
  },
  stepperWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  stepCircleActive: {
    backgroundColor: "#0649aa",
    borderColor: "#0649aa",
  },
  stepNum: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
  },
  stepNumActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#ffffff",
  },
  stepLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },
  stepLabelActive: {
    fontSize: 11,
    color: "#0f172a",
    fontWeight: "700",
  },
  stepConnector: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  sectionTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  sectionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  sectionSub: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 1,
  },
  stepBadgeCyan: {
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stepBadgeCyanText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0f766e",
  },
  stepBadgePurple: {
    backgroundColor: "#ede9fe",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  stepBadgePurpleText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6d28d9",
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  required: {
    color: "#dc2626",
  },
  clearanceBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  clearanceBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0f766e",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  inputError: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#0f172a",
  },
  helperText: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 4,
  },
  helperHighlight: {
    fontSize: 11,
    color: "#059669",
    marginTop: 4,
    fontWeight: "500",
  },
  flagWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  flagText: {
    fontSize: 14,
  },
  countryCode: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 4,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBoxActive: {
    borderColor: "#0649aa",
    backgroundColor: "#eff6ff",
  },
  uploadIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  uploadTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
  uploadSub: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  uploadBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 8,
  },
  uploadBadgeText: {
    fontSize: 10,
    color: "#475569",
  },
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  dropdownLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  dropdownValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  lockNoticeBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fef3c7",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  lockNoticeText: {
    fontSize: 11,
    color: "#92400e",
    lineHeight: 16,
    flex: 1,
  },
  aadhaarBanner: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 16,
  },
  aadhaarIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  aadhaarTextWrap: {
    flex: 1,
  },
  aadhaarTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  aadhaarSub: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    lineHeight: 15,
  },
  actionButtons: {
    gap: 10,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0649aa",
    borderRadius: 10,
    height: 48,
    elevation: 2,
    shadowColor: "#0649aa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  cancelBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    height: 46,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalList: {
    marginTop: 10,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: "#f8fafc",
  },
  modalItemActive: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  modalItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  modalItemTitleActive: {
    color: "#0649aa",
    fontWeight: "700",
  },
  modalItemSub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
});
