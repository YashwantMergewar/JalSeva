import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ArrowRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  background: "#f8f8f5",
  panel: "#e8eff7",
  primary: "#0d4d8f",
  textMuted: "#394754",
  white: "#ffffff",
  step: "#c8d7e9",
};

const slides = [
  {
    id: "stay-updated",
    title: "Stay Updated",
    subtitle:
      "Get real-time alerts and check the water supply schedule in your area.",
    type: "schedule",
  },
  {
    id: "easy-reporting",
    title: "Easy Reporting",
    subtitle:
      "Report water leaks or sanitation issues and track their resolution status.",
    type: "reporting",
  },
  {
    id: "seamless-applications",
    title: "Seamless\nApplications",
    subtitle:
      "Apply for new water connections or service requests directly from the app.",
    type: "application",
  },
  {
    id: "quick-payments",
    title: "Quick Payments",
    subtitle:
      "View your billing history and pay your water bills securely within seconds.",
    type: "payments",
  },
] as const;

type IllustrationType = (typeof slides)[number]["type"];

const illustrationSources: Record<IllustrationType, number> = {
  schedule: require("../assets/onboarding/Online calendar.gif"),
  reporting: require("../assets/images/Mobile inbox-rafiki.png"),
  application: require("../assets/onboarding/Mobile user.gif"),
  payments: require("../assets/onboarding/Payment Information.gif"),
};

const illustrationLabels: Record<IllustrationType, string> = {
  schedule: "Online calendar",
  reporting: "Mobile inbox for easy issue reporting",
  application: "Mobile application services",
  payments: "Secure payment information",
};

const useFloatingAnimation = () => {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: -8,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [value]);

  return value;
};

function Illustration({ type }: { type: IllustrationType }) {
  const y = useFloatingAnimation();

  return (
    <Animated.View
      style={[styles.artCircle, { transform: [{ translateY: y }] }]}
    >
      <Image
        accessibilityLabel={illustrationLabels[type]}
        resizeMode="contain"
        source={illustrationSources[type]}
        style={styles.illustrationImage}
      />
    </Animated.View>
  );
}

type OnboardingFlowProps = {
  onSkip: () => void;
  onComplete: () => void;
};

export default function OnboardingFlow({
  onSkip,
  onComplete,
}: OnboardingFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideX = useRef(new Animated.Value(260)).current;

  useEffect(() => {
    slideX.setValue(260);
    const animation = Animated.spring(slideX, {
      toValue: 0,
      friction: 10,
      tension: 60,
      useNativeDriver: true,
    });
    animation.start();

    return () => animation.stop();
  }, [currentIndex, slideX]);

  const currentSlide = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <Pressable
        accessibilityRole="button"
        style={styles.skipButton}
        onPress={onSkip}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <Animated.View
        style={[
          styles.illustrationFrame,
          { transform: [{ translateX: slideX }] },
        ]}
      >
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
        <Text style={styles.primaryText}>
          {isLast ? "Get Started" : "Next"}
        </Text>
        <ArrowRight color={COLORS.white} size={22} strokeWidth={2.4} />
      </Pressable>
    </SafeAreaView>
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
    overflow: "hidden",
  },
  illustrationImage: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 27,
    fontWeight: "800",
    lineHeight: 34,
    color: COLORS.primary,
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
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
    minHeight: 48,
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
    fontSize: 16,
    fontWeight: "700",
  },
  primaryArrow: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    marginLeft: 8,
  },
});
