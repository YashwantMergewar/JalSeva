import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Droplets,
  Building2,
  User,
  Shield,
  KeyRound,
  Lock,
  IdCard,
  UserCheck,
  UserPlus,
  Pencil,
  CheckCircle2,
  Clock,
  Briefcase,
} from "lucide-react-native";
import { apiCreateEmployee, getApiErrorMessage } from "../../src/api/employee.api";
import { useAuth } from "../../src/context/AuthContext";

export default function ReviewEmployeeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  // Parse passed data or use defaults
  const parsedData = params.data
    ? JSON.parse(params.data as string)
    : {
        fullname: "Rahul Patil",
        email: "rahul.patil@muni.gov.in",
        mobile_no: "9823019842",
        roleId: "role-engineer",
        roleName: "Engineer",
        roleDesc: "Grievance Level 2 Authority",
        departmentId: "dept-water",
        departmentName: "Water Department",
        officeName: "Central Water Works",
        supervisor: "Chief Officer",
      };

  const initials = parsedData.fullname
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedMobile = parsedData.mobile_no.startsWith("+91")
    ? parsedData.mobile_no
    : `+91 ${parsedData.mobile_no}`;

  const handleCreate = async () => {
    try {
      setLoading(true);
      const res = await apiCreateEmployee({
        fullname: parsedData.fullname,
        email: parsedData.email,
        mobile_no: parsedData.mobile_no,
        roleId: parsedData.roleId,
        departmentId: parsedData.departmentId,
        officeName: parsedData.officeName,
      });

      if (res.success && res.data) {
        // Navigate to Screen 5
        router.push({
          pathname: "/(admin)/employee-created",
          params: {
            result: JSON.stringify({
              id: res.data.employee.id,
              fullname: res.data.employee.fullname,
              email: res.data.employee.email,
              employeeId: res.data.employee.employeeId || "EMP-0001",
              department: res.data.department?.name || parsedData.departmentName,
              role: res.data.role?.name || parsedData.roleName,
              emailSent: res.data.emailSent,
              cadreUnit: parsedData.officeName || "Central Division",
              accessLevel: res.data.role?.name || parsedData.roleName,
            }),
          },
        } as any);
      } else {
        Alert.alert("Creation Error", res.message || "Could not create employee.");
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, "Failed to create employee.");
      Alert.alert("Creation Error", msg);
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.headerTitle}>Review Details</Text>
        <View style={styles.avatarBtn}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step Badge */}
        <View style={styles.stepBadgeRow}>
          <View style={styles.stepBadge}>
            <CheckCircle2 size={12} color="#0f766e" strokeWidth={2.5} />
            <Text style={styles.stepBadgeText}>
              STEP 3 OF 3 • REVIEW • Jal Seva Governance
            </Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Review Employee Details</Text>
          <Text style={styles.pageSubtitle}>
            Verify employee credentials before generating the account and invitation
            link.
          </Text>
        </View>

        {/* ──────── Candidate Summary Card ──────── */}
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarInitials}>{initials}</Text>
              <View style={styles.avatarBadge}>
                <Briefcase size={10} color="#ffffff" strokeWidth={2.5} />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{parsedData.fullname}</Text>
                <View style={styles.newHireBadge}>
                  <Text style={styles.newHireText}>New Hire</Text>
                </View>
              </View>
              <Text style={styles.profileDept}>
                Civil & Hydraulic Infrastructure
              </Text>
            </View>
          </View>

          {/* Contact Details Inner Box */}
          <View style={styles.innerContactCard}>
            <View style={styles.contactItemRow}>
              <View style={styles.contactLabelRow}>
                <Mail size={14} color="#0649aa" strokeWidth={1.8} />
                <Text style={styles.contactLabel}>Candidate Email</Text>
              </View>
              <Text
                style={styles.contactVal}
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {parsedData.email}
              </Text>
            </View>

            <View style={styles.contactItemRow}>
              <View style={styles.contactLabelRow}>
                <Phone size={14} color="#0649aa" strokeWidth={1.8} />
                <Text style={styles.contactLabel}>Mobile Contact</Text>
              </View>
              <Text style={styles.contactVal}>{formattedMobile}</Text>
            </View>
          </View>
        </View>

        {/* ──────── Role & Assignment Card ──────── */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <IdCard size={18} color="#0f766e" strokeWidth={2} />
              <Text style={styles.cardSectionTitle}>Role & Assignment</Text>
            </View>
            <Lock size={15} color="#94a3b8" />
          </View>

          {/* Department */}
          <View style={styles.roleBlock}>
            <Text style={styles.blockLabel}>DEPARTMENT</Text>
            <View style={styles.blockValRow}>
              <Droplets size={16} color="#0649aa" strokeWidth={2} />
              <Text style={styles.blockValText}>{parsedData.departmentName}</Text>
            </View>
          </View>

          {/* Assigned Role & Permission */}
          <View style={styles.roleBlock}>
            <Text style={styles.blockLabel}>ASSIGNED ROLE & PERMISSION</Text>
            <View style={styles.blockValRow}>
              <UserCheck size={16} color="#0649aa" strokeWidth={2} />
              <View>
                <Text style={styles.blockValText}>{parsedData.roleName}</Text>
                <Text style={styles.blockSubText}>{parsedData.roleDesc}</Text>
              </View>
            </View>
          </View>

          {/* 2-Column Grid: Station & Supervisor */}
          <View style={styles.twoColRow}>
            <View style={[styles.roleBlock, { flex: 1 }]}>
              <Text style={styles.blockLabel}>OFFICE STATION</Text>
              <View style={styles.blockValRow}>
                <Building2 size={15} color="#64748b" strokeWidth={2} />
                <Text
                  style={styles.blockValTextSmall}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {parsedData.officeName}
                </Text>
              </View>
            </View>

            <View style={[styles.roleBlock, { flex: 1 }]}>
              <Text style={styles.blockLabel}>SUPERVISOR</Text>
              <View style={styles.blockValRow}>
                <User size={15} color="#64748b" strokeWidth={2} />
                <Text
                  style={styles.blockValTextSmall}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {parsedData.supervisor}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ──────── Automatic Credential & Security Protocol Notice ──────── */}
        <View style={styles.securityBox}>
          <View style={styles.securityHeader}>
            <View style={styles.shieldIconWrap}>
              <Shield size={18} color="#0649aa" strokeWidth={2.2} />
            </View>
            <KeyRound size={16} color="#0649aa" strokeWidth={2} />
            <Text style={styles.securityTitle}>
              Automatic Credential & Security Protocol
            </Text>
          </View>

          <Text style={styles.securityBody}>
            An official Employee ID{" "}
            <Text style={styles.empIdInline}>EMP-0007</Text> will be automatically
            generated upon creation. For security compliance, no permanent
            password is created by the Admin. An encrypted activation invitation
            link will be issued for the employee to securely choose their own
            password.
          </Text>
        </View>

        {/* Activation Link Validity */}
        <View style={styles.validityCard}>
          <View style={styles.validityIconWrap}>
            <Clock size={16} color="#0649aa" strokeWidth={2} />
          </View>
          <View style={styles.validityTextWrap}>
            <Text style={styles.validityTitle}>Activation link validity</Text>
            <Text style={styles.validitySub}>
              Expires in 72 hours via official SMS & Email
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <Pressable
            style={[styles.createBtn, loading && styles.btnDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <UserPlus size={18} color="#ffffff" strokeWidth={2} />
                <Text style={styles.createBtnText}>Create Employee Account</Text>
              </>
            )}
          </Pressable>

          <Pressable
            style={styles.editBtn}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Pencil size={16} color="#475569" strokeWidth={2} />
            <Text style={styles.editBtnText}>Edit Details</Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
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
  stepBadgeRow: {
    marginBottom: 10,
  },
  stepBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ccfbf1",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#0f766e",
    letterSpacing: 0.3,
  },
  titleSection: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 18,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },
  avatarWrap: {
    position: "relative",
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#0649aa",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
  },
  avatarBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0d9488",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0f172a",
  },
  newHireBadge: {
    backgroundColor: "#ede9fe",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newHireText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6d28d9",
  },
  profileDept: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  innerContactCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    padding: 12,
    gap: 10,
  },
  contactItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  contactVal: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
    maxWidth: 180,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  roleBlock: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    marginBottom: 10,
  },
  blockLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  blockValRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  blockValText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  blockValTextSmall: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  blockSubText: {
    fontSize: 11,
    color: "#0d9488",
    fontWeight: "600",
    marginTop: 1,
  },
  twoColRow: {
    flexDirection: "row",
    gap: 10,
  },
  securityBox: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  securityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  shieldIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  securityTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1e3a8a",
    flex: 1,
  },
  securityBody: {
    fontSize: 12,
    color: "#1e40af",
    lineHeight: 18,
  },
  empIdInline: {
    fontWeight: "800",
    backgroundColor: "#ffffff",
    color: "#0649aa",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  validityCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  validityIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  validityTextWrap: {
    flex: 1,
  },
  validityTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  validitySub: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 1,
  },
  actionsBox: {
    gap: 10,
  },
  createBtn: {
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
  btnDisabled: {
    opacity: 0.7,
  },
  createBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    height: 46,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
});
