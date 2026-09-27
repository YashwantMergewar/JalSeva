import { View, Text, StyleSheet } from "react-native";

export default function CitizenBillsRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bills & Payments</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0efea",
    alignItems: "center",
    justifyContent: "center",
  },
  text: { fontSize: 22, fontWeight: "700", color: "#0649aa" },
});
