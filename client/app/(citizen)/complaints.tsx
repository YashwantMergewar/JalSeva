import { View, Text, StyleSheet } from "react-native";

export default function CitizenComplaintsRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Complaints</Text>
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
