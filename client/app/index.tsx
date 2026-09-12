import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import OnboardingFlow from "../src/components/OnboardingFlow";

export default function HomeScreen() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (!showOnboarding) {
    return (
      <View style={styles.entryScreen}>
        <Text style={styles.entryText}>Welcome to Jal Seva</Text>
      </View>
    );
  }

  return (
    <OnboardingFlow
      onSkip={() => setShowOnboarding(false)}
      onComplete={() => setShowOnboarding(false)}
    />
  );
}

const styles = StyleSheet.create({
  entryScreen: {
    flex: 1,
    backgroundColor: "#f8f8f5",
    alignItems: "center",
    justifyContent: "center",
  },
  entryText: {
    color: "#0d4d8f",
    fontSize: 30,
    fontWeight: "700",
  },
});