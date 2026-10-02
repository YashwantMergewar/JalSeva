import { Tabs } from "expo-router";
import {
  LayoutDashboard,
  Users,
  Droplets,
  ClipboardList,
  Settings,
} from "lucide-react-native";
import { View, StyleSheet } from "react-native";

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0649aa",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          height: 64,
          borderTopWidth: 1,
          borderTopColor: "#e2e8f0",
          backgroundColor: "#ffffff",
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <LayoutDashboard
                color={focused ? "#0649aa" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: "Employees",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Users
                color={focused ? "#0649aa" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="water"
        options={{
          title: "Water",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Droplets
                color={focused ? "#0649aa" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: "Complaints",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <ClipboardList
                color={focused ? "#0649aa" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <Settings
                color={focused ? "#0649aa" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* Hidden sub-flow screens */}
      <Tabs.Screen
        name="add-employee"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="review-employee"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="employee-created"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="activate-account"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="activation-success"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "#eff6ff",
  },
});
