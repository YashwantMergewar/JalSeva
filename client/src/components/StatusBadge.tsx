import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Droplet, RefreshCw, CheckCircle2, Clock, AlertCircle } from "lucide-react-native";

interface StatusBadgeProps {
  status: string;
  size?: "small" | "medium";
}

export default function StatusBadge({ status, size = "medium" }: StatusBadgeProps) {
  let bg = "#e2e8f0";
  let textCol = "#334155";
  let Icon = Clock;

  const normalized = status.toLowerCase();

  if (normalized.includes("ongoing")) {
    bg = "#8df1e0"; // Mint teal from DESIGN.md
    textCol = "#004d40";
    Icon = Droplet;
  } else if (normalized.includes("progress")) {
    bg = "#8df1e0";
    textCol = "#004d40";
    Icon = RefreshCw;
  } else if (normalized.includes("approved") || normalized.includes("completed") || normalized.includes("resolved") || normalized.includes("active")) {
    bg = "#dcfce7";
    textCol = "#166534";
    Icon = CheckCircle2;
  } else if (normalized.includes("scheduled") || normalized.includes("upcoming") || normalized.includes("review")) {
    bg = "#e0e7ff";
    textCol = "#3730a3";
    Icon = Clock;
  } else if (normalized.includes("delayed") || normalized.includes("warning")) {
    bg = "#fef3c7";
    textCol = "#92400e";
    Icon = AlertCircle;
  } else if (normalized.includes("rejected") || normalized.includes("cancelled") || normalized.includes("disconnect")) {
    bg = "#fee2e2";
    textCol = "#991b1b";
    Icon = AlertCircle;
  }

  const isSmall = size === "small";

  return (
    <View style={[styles.badge, { backgroundColor: bg }, isSmall && styles.badgeSmall]}>
      <Icon size={isSmall ? 11 : 13} color={textCol} strokeWidth={2.2} />
      <Text style={[styles.badgeText, { color: textCol }, isSmall && styles.badgeTextSmall]}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  badgeTextSmall: {
    fontSize: 11,
  },
});
