import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  HelpCircle,
} from "lucide-react-native";
import CitizenHeader from "../components/CitizenHeader";
import { FAQ_LIST, MUNICIPAL_CONTACT_INFO } from "../services/support.service";

export default function SupportCenterScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleCall = () => {
    Alert.alert("Helpline", `Municipal Control Room: ${MUNICIPAL_CONTACT_INFO.tollFreeHelpline}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <CitizenHeader title="Support Center" showBack />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Support & Grievances</Text>
        <Text style={styles.screenSubtitle}>
          Get assistance with municipal water connections, schedule timings, and grievance escalation.
        </Text>

        {/* ── Helpline Card ── */}
        <View style={styles.helplineCard}>
          <Text style={styles.helplineTitle}>Municipal Water Helpline</Text>
          <Text style={styles.helplineSub}>
            Reach out directly to the Jal Seva Water Works Department control room.
          </Text>

          <View style={styles.contactList}>
            <Pressable style={styles.contactRow} onPress={handleCall}>
              <Phone size={18} color="#0056d2" />
              <View>
                <Text style={styles.contactLabel}>Toll-Free Helpline</Text>
                <Text style={styles.contactValue}>
                  {MUNICIPAL_CONTACT_INFO.tollFreeHelpline}
                </Text>
              </View>
            </Pressable>

            <View style={styles.contactRow}>
              <Mail size={18} color="#0056d2" />
              <View>
                <Text style={styles.contactLabel}>Grievance Email</Text>
                <Text style={styles.contactValue}>
                  {MUNICIPAL_CONTACT_INFO.email}
                </Text>
              </View>
            </View>

            <View style={styles.contactRow}>
              <MapPin size={18} color="#0056d2" />
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Office Address</Text>
                <Text style={styles.contactValue}>
                  {MUNICIPAL_CONTACT_INFO.officeAddress}
                </Text>
              </View>
            </View>

            <View style={styles.contactRow}>
              <Clock size={18} color="#0056d2" />
              <View style={{ flex: 1 }}>
                <Text style={styles.contactLabel}>Operational Hours</Text>
                <Text style={styles.contactValue}>
                  {MUNICIPAL_CONTACT_INFO.workingHours}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── FAQs Section ── */}
        <View style={styles.faqSection}>
          <View style={styles.faqHeader}>
            <FileQuestion size={20} color="#0040a1" />
            <Text style={styles.faqSectionTitle}>Frequently Asked Questions</Text>
          </View>

          {FAQ_LIST.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <View key={faq.id} style={styles.faqCard}>
                <Pressable
                  style={styles.faqQuestionRow}
                  onPress={() => toggleFaq(faq.id)}
                >
                  <Text style={styles.faqQuestionText}>{faq.question}</Text>
                  {isExpanded ? (
                    <ChevronUp size={18} color="#64748b" />
                  ) : (
                    <ChevronDown size={18} color="#64748b" />
                  )}
                </Pressable>

                {isExpanded && (
                  <View style={styles.faqAnswerWrap}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

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
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 20,
  },

  /* Helpline Card */
  helplineCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  helplineTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0040a1",
    marginBottom: 4,
  },
  helplineSub: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 16,
  },
  contactList: {
    gap: 14,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  contactLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  contactValue: {
    fontSize: 13,
    color: "#0f172a",
    fontWeight: "600",
    marginTop: 2,
  },

  /* FAQ */
  faqSection: {
    gap: 12,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  faqSectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  faqCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
  },
  faqQuestionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
    flex: 1,
    paddingRight: 10,
  },
  faqAnswerWrap: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  faqAnswerText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 19,
  },
});
