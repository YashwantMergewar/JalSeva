import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  CalendarDays,
  AlertTriangle,
  Droplet,
  CheckCheck,
  ChevronRight,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import {
  notificationService,
  CitizenNotification,
} from "../services/notification.service";

export default function CitizenNotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<CitizenNotification[]>([]);

  useEffect(() => {
    notificationService.getNotifications().then(setNotifications);
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    const updated = await notificationService.getNotifications();
    setNotifications([...updated]);
  };

  const handlePressNotification = async (item: CitizenNotification) => {
    await notificationService.markAsRead(item.id);
    const updated = await notificationService.getNotifications();
    setNotifications([...updated]);

    if (item.linkRoute) {
      router.push(item.linkRoute as any);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "schedule":
        return <CalendarDays size={20} color="#0056d2" />;
      case "connection":
        return <Droplet size={20} color="#006b5f" />;
      case "complaint":
        return <AlertTriangle size={20} color="#ba1a1a" />;
      default:
        return <Droplet size={20} color="#0056d2" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Notifications" showBack />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topRow}>
          <Text style={styles.screenTitle}>Notifications</Text>
          <Pressable style={styles.markReadBtn} onPress={handleMarkAllRead}>
            <CheckCheck size={16} color="#0040a1" />
            <Text style={styles.markReadText}>Mark all as read</Text>
          </Pressable>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No notifications yet.</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.notifCard,
                !item.read && styles.notifCardUnread,
              ]}
              onPress={() => handlePressNotification(item)}
            >
              <View style={styles.iconCircle}>{getIcon(item.type)}</View>

              <View style={styles.notifInfo}>
                <View style={styles.notifTitleRow}>
                  <Text
                    style={[
                      styles.notifTitle,
                      !item.read && styles.notifTitleUnread,
                    ]}
                  >
                    {item.title}
                  </Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMsg}>{item.message}</Text>
                <Text style={styles.notifDate}>{item.date}</Text>
              </View>

              <ChevronRight size={18} color="#94a3b8" />
            </Pressable>
          ))
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
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  markReadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markReadText: {
    fontSize: 13,
    color: "#0040a1",
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#64748b",
  },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  notifCardUnread: {
    backgroundColor: "#f0f7ff",
    borderColor: "#bfdbfe",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  notifInfo: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  notifTitleUnread: {
    fontWeight: "700",
    color: "#0040a1",
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#0056d2",
  },
  notifMsg: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 17,
    marginTop: 2,
    marginBottom: 4,
  },
  notifDate: {
    fontSize: 11,
    color: "#94a3b8",
  },
});
