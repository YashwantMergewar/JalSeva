import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

const COLORS = {
  background: "#f8f8f5",
  panel: "#e8eff7",
  primary: "#0d4d8f",
  primarySoft: "#dfeaf7",
  secondary: "#0a7f73",
  text: "#1b1c1c",
  textMuted: "#394754",
  line: "#dce4ee",
  white: "#ffffff",
  step: "#c8d7e9",
  softBadge: "#dfe9ed",
};

const slides = [
  {
    id: "stay-updated",
    title: "Stay Updated",
    subtitle: "Get real-time alerts and check the water supply schedule in your area.",
    type: "schedule",
  },
  {
    id: "easy-reporting",
    title: "Easy Reporting",
    subtitle: "Report water leaks or sanitation issues and track their resolution status.",
    type: "reporting",
  },
  {
    id: "seamless-applications",
    title: "Seamless\nApplications",
    subtitle: "Apply for new water connections or service requests directly from the app.",
    type: "application",
  },
  {
    id: "quick-payments",
    title: "Quick Payments",
    subtitle: "View your billing history and pay your water bills securely within seconds.",
    type: "payments",
  },
] as const;

const useFloatingAnimation = () => {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: -8, duration: 1400, useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [value]);

  return value;
};

function FloatingCheck({ style, size = 62 }: { style?: any; size?: number }) {
  const y = useFloatingAnimation();

  return (
    <Animated.View
      style={[
        styles.floatingCheckBase,
        { width: size, height: size, borderRadius: size / 2, transform: [{ translateY: y }] },
        style,
      ]}
    >
      <Text style={styles.floatingCheckText}>✓</Text>
    </Animated.View>
  );
}

function Illustration({ type }: { type: (typeof slides)[number]["type"] }) {
  const y = useFloatingAnimation();

  if (type === "schedule") {
    return (
      <Animated.View style={[styles.artCircle, { transform: [{ translateY: y }] }]}>
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <View style={styles.waterDrop} />
            <Text style={styles.calendarLabel}>NOVEMBER 2023</Text>
          </View>

          <View style={styles.calendarGrid}>
            {Array.from({ length: 35 }).map((_, index) => {
              const isActive = index === 8;
              return (
                <View key={index} style={[styles.dayCell, isActive && styles.dayCellActive]}>
                  <Text style={[styles.dayText, isActive && styles.dayTextActive]}>
                    {index < 30 ? index + 1 : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Animated.View>
    );
  }

  if (type === "reporting") {
    return (
      <Animated.View style={[styles.artCircle, { transform: [{ translateY: y }] }]}>
        <View style={styles.reportingScene}>
          <View style={styles.reportArchitectural} />

          <View style={styles.personFigure}>
            <View style={styles.personHair} />
            <View style={styles.personFace} />
            <View style={styles.personBody} />
            <View style={styles.personCollar} />
            <View style={styles.personArm} />
            <View style={styles.personPhone} />
          </View>

          <View style={styles.reportCard}>
            <Text style={styles.reportHeading}>CITY SERVICES</Text>
            <Text style={styles.reportTitle}>My Complaint #89321</Text>
            <View style={styles.reportRow}>
              <View style={styles.reportDot} />
              <Text style={styles.reportText}>Submitted</Text>
            </View>
            <View style={styles.reportRow}>
              <View style={styles.reportDotSoft} />
              <Text style={styles.reportText}>In Progress</Text>
            </View>
          </View>

          <View style={styles.reportBadge}>
            <Text style={styles.reportBadgeText}>✓</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  if (type === "application") {
    return (
      <Animated.View style={[styles.artCircle, { transform: [{ translateY: y }] }]}>
        <View style={styles.applicationScene}>
          <View style={styles.filePaper}>
            <View style={styles.fileLineShort} />
            <View style={styles.fileLineLong} />
            <View style={styles.fileLineMedium} />
          </View>
          <View style={styles.fileBadge}>
            <View style={styles.fileIcon} />
          </View>
        </View>
        <FloatingCheck style={{ right: 42, top: 32 }} size={64} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.artCircle, { transform: [{ translateY: y }] }]}>
      <View style={styles.paymentScene}>
        <View style={styles.paymentPaper}>
          <View style={styles.fileLineShort} />
          <View style={styles.fileLineLong} />
          <View style={styles.fileLineMedium} />
        </View>
        <FloatingCheck style={{ right: 44, top: 20 }} size={64} />
      </View>
    </Animated.View>
  );
}

type OnboardingFlowProps = {
  onSkip: () => void;
  onComplete: () => void;
};

export default function OnboardingFlow({ onSkip, onComplete }: OnboardingFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideX = useRef(new Animated.Value(260)).current;

  useEffect(() => {
    slideX.setValue(260);
    Animated.spring(slideX, {
      toValue: 0,
      friction: 10,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, slideX]);

  const currentSlide = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <Pressable style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <Animated.View style={[styles.illustrationFrame, { transform: [{ translateX: slideX }] }]}>
        <Illustration type={currentSlide.type} />
      </Animated.View>

      <Text style={styles.title}>{currentSlide.title}</Text>
      <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

      <View style={styles.progressRow}>
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
              index === currentIndex && styles.dotLarge,
            ]}
          />
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          if (isLast) {
            onComplete();
            return;
          }
          setCurrentIndex((index) => index + 1);
        }}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryText}>{isLast ? "Get Started" : "Next"}</Text>
        <Text style={styles.primaryArrow}>→</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 18,
    paddingHorizontal: 20,
    paddingBottom: 26,
    alignItems: "center",
    justifyContent: "space-between",
  },
  skipButton: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  skipText: {
    marginTop: 10,
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "500",
  },
  illustrationFrame: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  artCircle: {
    width: 332,
    height: 300,
    borderRadius: 170,
    backgroundColor: COLORS.panel,
    borderWidth: 2,
    borderColor: "#bfd4ea",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  scheduleCard: {
    width: 220,
    minHeight: 150,
    backgroundColor: "rgba(255,255,255,0.56)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(121, 136, 159, 0.35)",
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  waterDrop: {
    width: 12,
    height: 18,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    marginRight: 8,
    transform: [{ rotate: "180deg" }],
  },
  calendarLabel: {
    fontSize: 11,
    letterSpacing: 0.7,
    color: "#5c697c",
    fontWeight: "700",
  },
  calendarGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
  dayCell: {
    width: "12.5%",
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  dayCellActive: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    width: 22,
    height: 20,
  },
  dayText: {
    fontSize: 9,
    color: "#4f6272",
    fontWeight: "600",
  },
  dayTextActive: {
    color: COLORS.white,
  },
  reportingScene: {
    width: 318,
    height: 250,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  reportArchitectural: {
    position: "absolute",
    left: 26,
    bottom: 22,
    width: 110,
    height: 102,
    opacity: 0.28,
    borderWidth: 2,
    borderColor: "#aebdd0",
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  personFigure: {
    width: 180,
    height: 180,
    position: "relative",
    marginLeft: 20,
  },
  personHair: {
    position: "absolute",
    width: 116,
    height: 94,
    backgroundColor: "#1f2d35",
    borderRadius: 58,
    left: 26,
    top: 12,
  },
  personFace: {
    position: "absolute",
    width: 68,
    height: 80,
    backgroundColor: "#f2cfac",
    borderRadius: 34,
    left: 54,
    top: 28,
  },
  personBody: {
    position: "absolute",
    width: 140,
    height: 118,
    backgroundColor: "#f7f9fa",
    borderRadius: 30,
    left: 20,
    top: 92,
    borderWidth: 1,
    borderColor: "#d7e0ea",
  },
  personCollar: {
    position: "absolute",
    width: 26,
    height: 18,
    backgroundColor: "#f2f3f5",
    left: 70,
    top: 104,
    borderRadius: 6,
    transform: [{ rotate: "18deg" }],
  },
  personArm: {
    position: "absolute",
    width: 82,
    height: 18,
    backgroundColor: "#f2cfac",
    borderRadius: 14,
    left: 4,
    top: 134,
    transform: [{ rotate: "18deg" }],
  },
  personPhone: {
    position: "absolute",
    width: 92,
    height: 120,
    backgroundColor: "#1e2a39",
    borderRadius: 18,
    left: 120,
    top: 104,
    borderWidth: 2,
    borderColor: "#444f61",
  },
  reportCard: {
    position: "absolute",
    right: 12,
    top: 34,
    width: 132,
    backgroundColor: "#f2f3f4",
    borderRadius: 18,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  reportHeading: {
    fontSize: 8,
    letterSpacing: 0.7,
    fontWeight: "700",
    color: COLORS.primary,
  },
  reportTitle: {
    fontSize: 9,
    fontWeight: "700",
    marginTop: 6,
    color: "#1f2a34",
  },
  reportRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  reportDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
    marginRight: 5,
  },
  reportDotSoft: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#b7d4ee",
    marginRight: 5,
  },
  reportText: {
    fontSize: 7,
    color: "#2b3c4f",
  },
  reportBadge: {
    position: "absolute",
    right: 42,
    top: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.softBadge,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  reportBadgeText: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: "700",
  },
  applicationScene: {
    width: 300,
    height: 220,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  filePaper: {
    width: 170,
    height: 145,
    backgroundColor: "#f4f4f3",
    borderRadius: 18,
    padding: 16,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  fileLineShort: {
    width: 90,
    height: 10,
    borderRadius: 8,
    backgroundColor: "#d7d9db",
    marginBottom: 14,
  },
  fileLineMedium: {
    width: 120,
    height: 10,
    borderRadius: 8,
    backgroundColor: "#d7d9db",
    marginBottom: 12,
  },
  fileLineLong: {
    width: 140,
    height: 10,
    borderRadius: 8,
    backgroundColor: "#d7d9db",
  },
  fileBadge: {
    position: "absolute",
    right: 18,
    top: 94,
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  fileIcon: {
    width: 32,
    height: 40,
    borderRadius: 8,
    borderWidth: 4,
    borderColor: COLORS.white,
    borderTopWidth: 0,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  paymentScene: {
    width: 300,
    height: 220,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentPaper: {
    width: 200,
    height: 150,
    borderRadius: 18,
    backgroundColor: "#f4f4f3",
    padding: 18,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  floatingCheckBase: {
    position: "absolute",
    backgroundColor: COLORS.secondary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  floatingCheckText: {
    color: COLORS.white,
    fontSize: 28,
    lineHeight: 28,
    fontWeight: "700",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 46,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: "center",
    color: COLORS.textMuted,
    maxWidth: 360,
    marginTop: 8,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  dot: {
    width: 7,
    height: 8,
    borderRadius: 10,
    backgroundColor: COLORS.step,
    marginHorizontal: 7,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
  dotLarge: {
    width: 40,
    height: 12,
    borderRadius: 12,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 10,
    minHeight: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.24,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 10 },
  },
  primaryText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  primaryArrow: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 8,
  },
});
