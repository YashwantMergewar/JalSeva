import { Tabs } from "expo-router";
import {
  House,
  Waves,
  CalendarDays,
  AlertCircle,
  UserRound,
} from "lucide-react-native";
import { View, StyleSheet, Text } from "react-native";

export default function CitizenTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#004d40",
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
      {/* 1. Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <House
                color={focused ? "#004d40" : color}
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
              <Waves
                color={focused ? "#004d40" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 3. Water Schedule */}
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <CalendarDays
                color={focused ? "#004d40" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* 4. Complaints */}
      <Tabs.Screen
        name="complaints"
        options={{
          title: "Complaints",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <AlertCircle
                color={focused ? "#004d40" : color}
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
                color={focused ? "#004d40" : color}
                size={22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          ),
        }}
      />

      {/* ── Sub-flow screens (Hidden from bottom tabs) ── */}
      <Tabs.Screen
        name="application-tracking"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="new-connection"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="my-connection"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="submit-complaint"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="complaint-details"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="support"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      {/* Bills tab removed from scope */}
      <Tabs.Screen
        name="bills"
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
    width: 48,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "#8df1e0", // Mint teal from DESIGN.md and screenshots
    width: 58,
    height: 32,
    borderRadius: 16,
  },
});
