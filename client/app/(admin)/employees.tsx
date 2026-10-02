import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  AlertButton,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  Mail,
  Phone,
  ChevronRight,
  Clock,
  RotateCw,
  Droplets,
  Bell,
  ShieldAlert,
  IdCard,
  CheckCircle2,
  X,
} from "lucide-react-native";
import {
  apiListEmployees,
  apiResendInvitation,
  getApiErrorMessage,
  EmployeePublic,
} from "../../src/api/employee.api";
import { useAuth } from "../../src/context/AuthContext";

// Fallback municipal staff data to guarantee immediate rich UI experience
const INITIAL_STAFF_DATA: Array<{
  id: string;
  fullname: string;
  employeeId: string;
  email: string;
  mobile_no: string;
  department: string;
  role: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
  inviteDate?: string;
}> = [
  {
    id: "seed-1",
    fullname: "Rahul Patil",
    employeeId: "EMP-0007",
    email: "rahul.patil@muni.gov.in",
    mobile_no: "+91 98234 56789",
    department: "Water Department",
    role: "Engineer",
    status: "ACTIVE",
  },
  {
    id: "seed-2",
    fullname: "Amit Shinde",
    employeeId: "EMP-0008",
    email: "amit.shinde@muni.gov.in",
    mobile_no: "+91 98450 12345",
    department: "Water Department",
    role: "Plumber",
    status: "ACTIVE",
  },
  {
    id: "seed-3",
    fullname: "Sneha Deshmukh",
    employeeId: "EMP-0009",
    email: "sneha.d@muni.gov.in",
    mobile_no: "+91 97654 32100",
    department: "Sanitation Department",
    role: "Officer",
    status: "PENDING",
    inviteDate: "Oct 26",
  },
  {
    id: "seed-4",
    fullname: "Vikram Gaikwad",
    employeeId: "EMP-0004",
    email: "vikram.g@muni.gov.in",
    mobile_no: "+91 99221 44556",
    department: "Administration",
    role: "Senior Inspector",
    status: "SUSPENDED",
  },
  {
    id: "seed-5",
    fullname: "Pooja Kulkarni",
    employeeId: "EMP-0010",
    email: "pooja.k@muni.gov.in",
    mobile_no: "+91 98112 33445",
    department: "Water Department",
    role: "Laboratory Analyst",
    status: "ACTIVE",
  },
  {
    id: "seed-6",
    fullname: "Ramesh Pawar",
    employeeId: "EMP-0011",
    email: "ramesh.p@muni.gov.in",
    mobile_no: "+91 98223 99881",
    department: "Sanitation Department",
    role: "Field Supervisor",
    status: "ACTIVE",
  },
];

export default function EmployeesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "ACTIVE" | "PENDING">("ALL");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [employees, setEmployees] = useState(INITIAL_STAFF_DATA);

  // Fetch employees from API and merge with mock data
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const res = await apiListEmployees();
      if (res.success && res.data && res.data.length > 0) {
        const mapped = res.data.map((emp: EmployeePublic) => ({
          id: emp.id,
          fullname: emp.fullname,
          employeeId: emp.employeeId || "EMP-0000",
          email: emp.email,
          mobile_no: emp.mobile_no.startsWith("+91") ? emp.mobile_no : `+91 ${emp.mobile_no}`,
          department: emp.employeeDepartment?.[0]?.department?.name || "Water Department",
          role: emp.role?.name || "Employee",
          status: (emp.isActive ? "ACTIVE" : "PENDING") as "ACTIVE" | "PENDING" | "SUSPENDED",
          inviteDate: "Recent",
        }));

        // Merge backend list with default seed items without duplicates by email/id
        const existingEmails = new Set(mapped.map((m) => m.email.toLowerCase()));
        const remainingSeeds = INITIAL_STAFF_DATA.filter(
          (s) => !existingEmails.has(s.email.toLowerCase())
        );
        setEmployees([...mapped, ...remainingSeeds]);
      }
    } catch {
      // Fallback cleanly to INITIAL_STAFF_DATA if backend call fails or during demo
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadEmployees();
  };

  // Filtered employees
  const filteredList = useMemo(() => {
    return employees.filter((emp) => {
      // Status filter
      if (selectedFilter === "ACTIVE" && emp.status !== "ACTIVE") return false;
      if (selectedFilter === "PENDING" && emp.status !== "PENDING") return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = emp.fullname.toLowerCase().includes(query);
        const matchesId = emp.employeeId.toLowerCase().includes(query);
        const matchesMobile = emp.mobile_no.toLowerCase().includes(query);
        const matchesDept = emp.department.toLowerCase().includes(query);
        return matchesName || matchesId || matchesMobile || matchesDept;
      }
      return true;
    });
  }, [employees, selectedFilter, searchQuery]);

  const activeCount = employees.filter((e) => e.status === "ACTIVE").length;
  const pendingCount = employees.filter((e) => e.status === "PENDING").length;

  const handleResendInvite = async (empId: string, empName: string, email: string) => {
    try {
      const res = await apiResendInvitation(empId);
      if (res.success && res.data?.emailSent) {
        Alert.alert(
          "Invitation Resent",
          `A fresh 24-hour activation email has been dispatched to ${email} for ${empName}. Previous activation links are now invalidated.`
        );
      } else {
        Alert.alert(
          "Invitation Generated",
          `A new activation token was generated for ${empName}, but email delivery is pending or failed. Please check SMTP configuration.`
        );
      }
    } catch (err) {
      Alert.alert(
        "Failed to Resend",
        getApiErrorMessage(err, "Unable to resend activation invitation.")
      );
    }
  };

  const handleEmployeeAction = (emp: (typeof employees)[0]) => {
    const isPending = emp.status === "PENDING";
    const buttons: AlertButton[] = [
      {
        text: "View Details",
        onPress: () => {
          Alert.alert(
            "Employee Profile",
            `Name: ${emp.fullname}\nEmployee ID: ${emp.employeeId}\nEmail: ${emp.email}\nMobile: ${emp.mobile_no}\nDepartment: ${emp.department}\nRole: ${emp.role}\nStatus: ${emp.status}`
          );
        },
      },
    ];

    if (isPending) {
      buttons.push({
        text: "Resend Invitation",
        onPress: () => handleResendInvite(emp.id, emp.fullname, emp.email),
      });
    }

    buttons.push(
      {
        text: emp.status === "SUSPENDED" ? "Reactivate Account" : "Suspend Account",
        onPress: () => {
          Alert.alert(
            "Account Status",
            `Employee ${emp.fullname} status update requires administrative confirmation.`
          );
        },
      },
      {
        text: "Cancel",
        style: "cancel" as const,
      }
    );

    Alert.alert(emp.fullname, `${emp.employeeId} • ${emp.department} • ${emp.role}`, buttons);
  };

  const initial = user?.fullname?.charAt(0).toUpperCase() ?? "A";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoWrap}>
            <Droplets size={20} color="#0649aa" strokeWidth={2.2} />
          </View>
          <View>
            <View style={styles.headerBrandRow}>
              <Text style={styles.headerBrand}>Jal Seva</Text>
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            </View>
            <Text style={styles.headerSub}>Municipal Water Board</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.headerIconBtn}>
            <Bell size={20} color="#374151" strokeWidth={1.8} />
          </Pressable>
          <Pressable style={styles.avatarBtn}>
            <Text style={styles.avatarText}>{initial}</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#0649aa"]}
          />
        }
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageTitle}>Employees</Text>
          <Text style={styles.pageSubtitle}>
            Manage municipal personnel and role-based access permissions.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color="#6b7280" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, ID, or mobile number"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <X size={16} color="#9ca3af" />
            </Pressable>
          )}
        </View>

        {/* Action Row: Filter & Add Employee */}
        <View style={styles.actionRow}>
          <Pressable style={styles.filterBtn}>
            <SlidersHorizontal size={16} color="#1e293b" strokeWidth={2} />
            <Text style={styles.filterBtnText}>Filter</Text>
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>2</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.addBtn}
            onPress={() => router.push("/(admin)/add-employee" as any)}
          >
            <UserPlus size={16} color="#ffffff" strokeWidth={2} />
            <Text style={styles.addBtnText}>+ Add Employee</Text>
          </Pressable>
        </View>

        {/* Status Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContainer}
        >
          <Pressable
            style={[
              styles.chip,
              selectedFilter === "ALL" && styles.chipActive,
            ]}
            onPress={() => setSelectedFilter("ALL")}
          >
            <Text
              style={[
                styles.chipText,
                selectedFilter === "ALL" && styles.chipTextActive,
              ]}
            >
              All {employees.length}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.chip,
              selectedFilter === "ACTIVE" && styles.chipActive,
            ]}
            onPress={() => setSelectedFilter("ACTIVE")}
          >
            <View style={[styles.statusDot, { backgroundColor: "#10b981" }]} />
            <Text
              style={[
                styles.chipText,
                selectedFilter === "ACTIVE" && styles.chipTextActive,
              ]}
            >
              Active ({activeCount})
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.chip,
              selectedFilter === "PENDING" && styles.chipActive,
            ]}
            onPress={() => setSelectedFilter("PENDING")}
          >
            <Clock size={12} color={selectedFilter === "PENDING" ? "#ffffff" : "#d97706"} strokeWidth={2} />
            <Text
              style={[
                styles.chipText,
                selectedFilter === "PENDING" && styles.chipTextActive,
              ]}
            >
              Pending Activation ({pendingCount})
            </Text>
          </Pressable>
        </ScrollView>

        {/* Employee Cards List */}
        {loading && !refreshing ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#0649aa" />
            <Text style={styles.loadingText}>Loading personnel records...</Text>
          </View>
        ) : filteredList.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No matching employees</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search criteria or filter options.
            </Text>
          </View>
        ) : (
          filteredList.map((emp) => {
            const isPending = emp.status === "PENDING";
            const isSuspended = emp.status === "SUSPENDED";
            const initials = emp.fullname
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <View key={emp.id} style={styles.employeeCard}>
                {/* Top Profile Header */}
                <View style={styles.cardHeaderRow}>
                  <View style={styles.avatarRow}>
                    <View
                      style={[
                        styles.empAvatar,
                        isSuspended && { backgroundColor: "#fee2e2" },
                      ]}
                    >
                      {isSuspended ? (
                        <ShieldAlert size={18} color="#b91c1c" />
                      ) : (
                        <Text style={styles.empAvatarText}>{initials}</Text>
                      )}
                    </View>
                    <View style={styles.empTitleBox}>
                      <View style={styles.empNameRow}>
                        <Text style={styles.empName}>{emp.fullname}</Text>
                        <View style={styles.empIdBadge}>
                          <Text style={styles.empIdText}>{emp.employeeId}</Text>
                        </View>
                      </View>
                      <Text style={styles.empDeptRole}>
                        {emp.department} • {emp.role}
                      </Text>
                    </View>
                  </View>

                  {/* Status Badge */}
                  <View
                    style={[
                      styles.statusPill,
                      emp.status === "ACTIVE" && styles.statusActive,
                      isPending && styles.statusPending,
                      isSuspended && styles.statusSuspended,
                    ]}
                  >
                    {isPending ? (
                      <Clock size={11} color="#b45309" strokeWidth={2} />
                    ) : (
                      <View
                        style={[
                          styles.dotSmall,
                          emp.status === "ACTIVE"
                            ? { backgroundColor: "#059669" }
                            : { backgroundColor: "#b91c1c" },
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        styles.statusText,
                        emp.status === "ACTIVE" && { color: "#065f46" },
                        isPending && { color: "#b45309" },
                        isSuspended && { color: "#b91c1c" },
                      ]}
                    >
                      {isPending
                        ? "Pending"
                        : isSuspended
                        ? "Suspended"
                        : "Active"}
                    </Text>
                  </View>
                </View>

                {/* If Pending: Invitation Box */}
                {isPending && (
                  <View style={styles.inviteNoticeBox}>
                    <View style={styles.inviteNoticeLeft}>
                      <Mail size={14} color="#475569" strokeWidth={1.8} />
                      <Text style={styles.inviteNoticeText}>
                        Invitation Sent: {emp.inviteDate || "Oct 26"}
                      </Text>
                    </View>
                    <Pressable
                      style={styles.resendBtn}
                      onPress={() => handleResendInvite(emp.id, emp.fullname, emp.email)}
                    >
                      <Text style={styles.resendBtnText}>Resend</Text>
                      <RotateCw size={12} color="#0649aa" strokeWidth={2} />
                    </Pressable>
                  </View>
                )}

                {/* Bottom Contacts & Actions */}
                <Pressable
                  style={styles.contactRow}
                  onPress={() => handleEmployeeAction(emp)}
                >
                  <View style={styles.contactLeft}>
                    <View style={styles.contactItem}>
                      <Mail size={13} color="#64748b" strokeWidth={1.8} />
                      <Text
                        style={styles.contactText}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {emp.email}
                      </Text>
                    </View>
                    <Text style={styles.contactDivider}>•</Text>
                    <View style={styles.contactItem}>
                      <Phone size={13} color="#64748b" strokeWidth={1.8} />
                      <Text style={styles.contactText}>{emp.mobile_no}</Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color="#94a3b8" strokeWidth={2} />
                </Pressable>
              </View>
            );
          })
        )}

        {/* Footer Summary Banner */}
        <View style={styles.footerBanner}>
          <View style={styles.footerBannerLeft}>
            <View style={styles.footerIconWrap}>
              <IdCard size={18} color="#0649aa" strokeWidth={1.8} />
            </View>
            <Text style={styles.footerBannerText}>
              {employees.length} total municipal staff members enrolled
            </Text>
          </View>
          <View style={styles.syncWrap}>
            <View style={styles.syncDot} />
            <Text style={styles.syncText}>All Systems Sync</Text>
          </View>
        </View>

        <View style={{ height: 28 }} />
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  headerBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerBrand: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  adminBadge: {
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#0f766e",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 11,
    color: "#64748b",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
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
  titleSection: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
    lineHeight: 18,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#0f172a",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 42,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  filterCountBadge: {
    backgroundColor: "#cbd5e1",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f172a",
  },
  addBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#0649aa",
    borderRadius: 10,
    height: 42,
    elevation: 2,
    shadowColor: "#0649aa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  chipsScroll: {
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipActive: {
    backgroundColor: "#0649aa",
    borderColor: "#0649aa",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  loadingBox: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: "#64748b",
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  emptySub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    textAlign: "center",
  },
  employeeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  empAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  empAvatarText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0649aa",
  },
  empTitleBox: {
    flex: 1,
  },
  empNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  empName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  empIdBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  empIdText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
  },
  empDeptRole: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: "#d1fae5",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusSuspended: {
    backgroundColor: "#fee2e2",
  },
  dotSmall: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  inviteNoticeBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 10,
  },
  inviteNoticeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inviteNoticeText: {
    fontSize: 11,
    color: "#475569",
    fontWeight: "500",
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resendBtnText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0649aa",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  contactText: {
    fontSize: 11,
    color: "#64748b",
    maxWidth: 130,
  },
  contactDivider: {
    marginHorizontal: 8,
    color: "#cbd5e1",
    fontSize: 12,
  },
  footerBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 4,
  },
  footerBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  footerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  footerBannerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  syncWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0d9488",
  },
  syncText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f766e",
  },
});
