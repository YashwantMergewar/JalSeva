import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { ArrowLeft, Bell, User } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { notificationService } from "../services/notification.service";

interface CitizenHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  subtitle?: string;
}

export default function CitizenHeader({
  title = "Municipal Water",
  showBack = false,
  onBack,
  subtitle,
}: CitizenHeaderProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    notificationService.getUnreadCount().then(setUnreadCount).catch(() => {});
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleAvatarPress = () => {
    router.push("/(citizen)/profile" as any);
  };

  const handleNotificationPress = () => {
    router.push("/(citizen)/notifications" as any);
  };

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            hitSlop={10}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
            <Text style={styles.backText}>{title}</Text>
          </Pressable>
        ) : (
          <View style={styles.brandingRow}>
            <Pressable
              onPress={handleAvatarPress}
              style={styles.avatarCircle}
              accessibilityLabel="View profile"
              accessibilityRole="button"
            >
              <User size={18} color="#ffffff" strokeWidth={2.2} />
            </Pressable>
            <View>
              <Text style={styles.brandTitle}>{title}</Text>
              {subtitle ? <Text style={styles.brandSubtitle}>{subtitle}</Text> : null}
            </View>
          </View>
        )}
      </View>

      <Pressable
        onPress={handleNotificationPress}
        style={styles.bellButton}
        hitSlop={10}
        accessibilityLabel="Notifications"
        accessibilityRole="button"
      >
        <Bell size={22} color="#0040a1" strokeWidth={1.8} />
        {unreadCount > 0 && <View style={styles.notificationDot} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  brandingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0040a1",
    letterSpacing: -0.2,
  },
  brandSubtitle: {
    fontSize: 11,
    color: "#64748b",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0040a1",
  },
  bellButton: {
    padding: 6,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0056d2",
  },
});
