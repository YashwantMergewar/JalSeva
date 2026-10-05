import { Tabs, useRouter } from "expo-router";
import {
  House,
  ClipboardList,
  CalendarDays,
  Briefcase,
  UserRound,
  Wrench,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Layers,
  CheckCircle,
} from "lucide-react-native";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../src/context/AuthContext";

/**
 * Employee tab navigator with strict Role-Based Access Control (RBAC).
 *
 * ONLY non-admin employees (Engineers, Plumbers, Field Staff, Clerks)
 * are authorized to view and interact with these screens.
 */
export default function EmployeeTabsLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={guardStyles.center}>
        <ActivityIndicator size="large" color="#0040a1" />
        <Text style={guardStyles.loadingText}>Verifying authorization…</Text>
      </View>
    );
  }

  // Determine role:
  // Role string from role relation or mock
  const roleName = ((user as any)?.role?.name || (user as any)?.roleName || (user as any)?.role || "").toString().toUpperCase();
  const isAdmin = user?.userType === "EMPLOYEE" && (roleName.includes("ADMIN") || (user as any)?.isAdmin);
  const isAuthorizedEmployee = (user?.userType === "EMPLOYEE" || !isAuthenticated) && !isAdmin;

  // Strict check: If user is authenticated as Admin or Citizen, restrict access
  if (isAuthenticated && !isAuthorizedEmployee) {
    if (isAdmin) {
      return (
        <SafeAreaView style={guardStyles.container}>
          <View style={guardStyles.card}>
            <View style={[guardStyles.iconWrap, { backgroundColor: "#fee2e2" }]}>
              <ShieldAlert size={36} color="#dc2626" strokeWidth={2} />
            </View>
            <Text style={guardStyles.title}>Admin Account Detected</Text>
            <Text style={guardStyles.message}>
              This section is reserved for Municipal Field Engineers and Staff Operations. As an Administrator, please access the central Admin Portal.
            </Text>
            <Pressable
              style={guardStyles.primaryBtn}
              onPress={() => router.replace("/(admin)" as any)}
            >
              <Text style={guardStyles.primaryBtnText}>Go to Admin Portal</Text>
              <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
            </Pressable>
            <Pressable style={guardStyles.secondaryBtn} onPress={() => logout()}>
              <LogOut size={16} color="#64748b" strokeWidth={2} />
              <Text style={guardStyles.secondaryBtnText}>Sign Out</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    // Citizen user trying to access employee side
    return (
      <SafeAreaView style={guardStyles.container}>
        <View style={guardStyles.card}>
          <View style={[guardStyles.iconWrap, { backgroundColor: "#fef3c7" }]}>
            <ShieldAlert size={36} color="#d97706" strokeWidth={2} />
          </View>
          <Text style={guardStyles.title}>Employee Access Only</Text>
          <Text style={guardStyles.message}>
            This portal is restricted to Jal Seva Municipal Employees, Field Engineers, and Plumbers. Citizens may track requests in the Citizen Portal.
          </Text>
          <Pressable
            style={guardStyles.primaryBtn}
            onPress={() => router.replace("/(citizen)" as any)}
          >
            <Text style={guardStyles.primaryBtnText}>Switch to Citizen Portal</Text>
            <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
          </Pressable>
          <Pressable style={guardStyles.secondaryBtn} onPress={() => router.replace("/login" as any)}>
            <Text style={guardStyles.secondaryBtnText}>Sign In as Municipal Staff</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0040a1",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          height: 68,
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          backgroundColor: "#ffffff",
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      {/* 1. Home / Executive Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <House
                color={focused ? "#0040a1" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 2. Services */}
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Wrench
                color={focused ? "#0040a1" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 3. Complaints */}
      <Tabs.Screen
        name="complaints"
        options={{
          title: "Complaints",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <ClipboardList
                color={focused ? "#0040a1" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 4. Tasks */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Briefcase
                color={focused ? "#0040a1" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <UserRound
                color={focused ? "#0040a1" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* ── Sub-screens & Deep flows (hidden tab bar) ── */}
      <Tabs.Screen
        name="applications"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="complaint-detail"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="application-detail"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="schedules"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="schedule-detail"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="field-report"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="consumers"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="consumer-detail"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen
        name="infrastructure"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 48,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "#dbeafe",
    width: 58,
    height: 32,
    borderRadius: 16,
  },
});

const guardStyles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#64748b",
  },
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 28,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: "#0040a1",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  secondaryBtnText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
});
