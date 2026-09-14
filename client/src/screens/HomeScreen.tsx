import {
  Building2,
  CalendarDays,
  Droplets,
  House,
  Landmark,
  LogIn,
  Megaphone,
  Menu,
  ShieldAlert,
  Wrench,
} from "lucide-react-native";
import { NavigationBar } from "expo-navigation-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type HomeScreenProps = { onLogin: () => void };

const icon = (name: "drop" | "menu" | "home" | "login", color: string, size = 24) => {
  const Icon = name === "drop" ? Droplets : name === "menu" ? Menu : name === "home" ? House : LogIn;
  return <Icon color={color} size={size} strokeWidth={1.8} />;
};

export default function HomeScreen({ onLogin }: HomeScreenProps) {
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right", "bottom"]}
    >
      <NavigationBar style="light" hidden={false} />
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          {icon("drop", "#0649aa")}
          <Text style={styles.headerText}>
            Jal Seva <Text style={styles.guest}>Guest</Text>
          </Text>
        </View>
        <Pressable onPress={onLogin}>
          {icon("menu", "#222222")}
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle}>Welcome to Jal Seva</Text>
          <Text style={styles.welcomeText}>
            Access your municipal water accounts,{`\n`}view schedules, and
            submit complaints{`\n`}by registering for an account.
          </Text>
          <Pressable style={styles.welcomeLogin} onPress={onLogin}>
            {icon("login", "#0649aa", 16)}
            <Text style={styles.welcomeLoginText}>Login</Text>
          </Pressable>
          <Pressable style={styles.register}>
            <Text style={styles.registerText}>Register</Text>
          </Pressable>
        </View>
        <Text style={styles.section}>Public Information</Text>
        <InfoCard
          color="#075ad5"
          iconName="calendar"
          title="Water Schedule"
          body="Check supply timings for your sector and plan accordingly."
          action="View Timings  →"
        />
        <InfoCard
          color="#8df1e0"
          iconName="building.2.fill"
          title="Department Info"
          body="Learn about ongoing projects and department structure."
          action="Read More  →"
        />
        <InfoCard
          color="#63676a"
          iconName="building.columns.fill"
          title="Sanitation"
          body="Guidelines and schedules for waste collection and area sanitation."
          action="View Guidelines  →"
        />
        <InfoCard
          color="#d9e2ff"
          iconName="wrench.and.screwdriver.fill"
          title="Available Services"
          body="Request new connections, report leaks, or apply for commercial water supply. Login required for service requests."
          action="New Connection    Leak Repair    Meter Reading"
        />
        <Pressable style={styles.announcements}>
          <View style={styles.announcementHeading}>
            <Megaphone color="#0649aa" size={16} strokeWidth={1.8} />
            <Text style={styles.announcementTitle}>Announcements</Text>
          </View>
          <Text style={styles.red}>Important Update</Text>
          <Text style={styles.announcementText}>
            Scheduled maintenance in Sector 42 on Tuesday.
          </Text>
          <View style={styles.divider} />
          <Text style={styles.blue}>New Service</Text>
          <Text style={styles.announcementText}>
            Online bill payment is now live for all sectors.
          </Text>
          <Text style={styles.all}>All Announcements</Text>
        </Pressable>
        <Pressable style={styles.emergency}>
          <View style={styles.sos}>
            <ShieldAlert color="#ffffff" size={18} strokeWidth={1.8} />
          </View>
          <View>
            <Text style={styles.emergencyTitle}>Emergency Contact</Text>
            <Text style={styles.emergencyText}>
              Report massive pipe bursts or{`\n`}critical contamination{`\n`}
              immediately.
            </Text>
            <Text style={styles.phone}>☎ 1800-XXX-XXXX</Text>
            </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoCard({
  color,
  iconName,
  title,
  body,
  action,
}: {
  color: string;
  iconName: string;
  title: string;
  body: string;
  action: string;
}) {
  const CardIcon = iconName === "calendar" ? CalendarDays : iconName === "building.2.fill" ? Building2 : iconName === "building.columns.fill" ? Landmark : Wrench;
  return (
    <Pressable style={styles.infoCard}>
      <View style={[styles.infoIcon, { backgroundColor: color }]}>
        <CardIcon color={color === "#8df1e0" ? "#006b5f" : "#ffffff"} size={18} strokeWidth={1.8} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardBody}>{body}</Text>
      <Text style={styles.cardAction}>{action}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf9f8" },
  header: {
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: "#c3c6d6",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBrand: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerText: { color: "#0649aa", fontSize: 16 },
  guest: { fontWeight: "600" },
  scroll: { padding: 16, paddingBottom: 28 },
  welcome: { backgroundColor: "#2166bb", borderRadius: 8, padding: 17 },
  welcomeTitle: { color: "#fff", fontWeight: "700", fontSize: 22 },
  welcomeText: { color: "#fff", lineHeight: 19, marginTop: 6 },
  welcomeLogin: {
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  welcomeLoginText: { color: "#0649aa" },
  register: {
    height: 38,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,
  },
  registerText: { color: "#fff" },
  section: { fontSize: 16, color: "#111", marginVertical: 20 },
  infoCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c3c6d6",
    borderRadius: 9,
    padding: 14,
    marginBottom: 12,
    minHeight: 176,
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cardTitle: { color: "#111", fontSize: 16, fontWeight: "500" },
  cardBody: { color: "#3f4350", lineHeight: 18, marginTop: 6 },
  cardAction: { color: "#0649aa", fontSize: 12, marginTop: 22 },
  announcements: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c3c6d6",
    borderRadius: 9,
    padding: 14,
    minHeight: 220,
  },
  announcementTitle: { color: "#111", fontSize: 16, fontWeight: "500" },
  announcementHeading: { flexDirection: "row", alignItems: "center", gap: 6 },
  red: { color: "#c40000", fontSize: 11, marginTop: 22 },
  blue: { color: "#0649aa", fontSize: 11, marginTop: 12 },
  announcementText: { color: "#222", lineHeight: 18, marginTop: 4 },
  divider: { height: 1, backgroundColor: "#d5d8df", marginTop: 10 },
  all: { color: "#0649aa", textAlign: "center", fontSize: 11, marginTop: 22 },
  emergency: {
    backgroundColor: "#ffd8d5",
    borderWidth: 1,
    borderColor: "#ffaaa4",
    borderRadius: 9,
    padding: 16,
    marginTop: 22,
    flexDirection: "row",
    gap: 12,
  },
  sos: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#c40000",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyTitle: { color: "#a90000", fontSize: 16, fontWeight: "600" },
  emergencyText: { color: "#a90000", lineHeight: 18, marginTop: 4 },
  phone: {
    backgroundColor: "#c40000",
    color: "#fff",
    borderRadius: 20,
    padding: 10,
    textAlign: "center",
    marginTop: 12,
  },
});
