import { Tabs } from "expo-router";
import {
  ClipboardList,
  House,
  Receipt,
  Settings,
  UserRound,
} from "lucide-react-native";
import { View, StyleSheet } from "react-native";

export default function CitizenTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0649aa",
        tabBarInactiveTintColor: "#666666",
        tabBarStyle: {
          height: 72,
          borderTopWidth: 1,
          borderTopColor: "#d8d8d0",
          backgroundColor: "#ffffff",
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "500" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
              <House
                color={focused ? "#ffffff" : color}
                size={22}
                strokeWidth={1.8}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: "Services",
          tabBarIcon: ({ color }) => (
            <Settings color={color} size={22} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: "Complaints",
          tabBarIcon: ({ color }) => (
            <View>
              <ClipboardList color={color} size={22} strokeWidth={1.8} />
              {/* Red badge dot */}
              <View style={styles.badge} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: "Bills",
          tabBarIcon: ({ color }) => (
            <Receipt color={color} size={22} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <UserRound color={color} size={22} strokeWidth={1.8} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 40,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "#0649aa",
    width: 52,
    height: 32,
    borderRadius: 16,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ba1a1a",
  },
});
