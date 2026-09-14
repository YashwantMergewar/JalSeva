import { Tabs } from "expo-router";
import {
  Bell,
  ClipboardList,
  House,
  UserRound,
} from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0649aa",
        tabBarInactiveTintColor: "#222222",
        tabBarStyle: {
          height: 72,
          borderTopWidth: 1,
          borderTopColor: "#c3c6d6",
          backgroundColor: "#fff",
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House color={color} size={24} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: "Complaints",
          tabBarIcon: ({ color }) => (
            <ClipboardList color={color} size={24} strokeWidth={1.8} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => <Bell color={color} size={24} strokeWidth={1.8} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <UserRound color={color} size={24} strokeWidth={1.8} />,
        }}
      />
    </Tabs>
  );
}
