import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  FileText,
  User,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ChevronRight,
  ClipboardList,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  employeeService,
  ServiceApplication,
} from "../../src/services/employee.service";

// ─── Stage Progress ───────────────────────────────────────────────────────────
const STAGES = ["Consumer", "Plumber", "Clerk", "Engineer"] as const;
type Stage = typeof STAGES[number];

function StageProgress({
  currentStage,
  stageCompleted,
}: {
  currentStage: Stage;
  stageCompleted: number;
}) {
  return (
    <View style={prog.container}>
      {STAGES.map((stage, i) => {
        const done = i < stageCompleted;
        const active = stage === currentStage && !done;
        return (
          <React.Fragment key={stage}>
            <View style={prog.stageCol}>
              <View
                style={[
                  prog.dot,
                  done
                    ? prog.dotDone
                    : active
                    ? prog.dotActive
                    : prog.dotPending,
                ]}
              >
                {done && (
                  <CheckCircle2 size={13} color="#fff" strokeWidth={2.5} />
                )}
              </View>
              <Text
                style={[
                  prog.label,
                  done
                    ? prog.labelDone
                    : active
                    ? prog.labelActive
                    : prog.labelPending,
                ]}
              >
                {stage}
              </Text>
            </View>
            {i < STAGES.length - 1 && (
              <View
                style={[prog.line, done ? prog.lineDone : prog.linePending]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const prog = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  stageCol: { alignItems: "center", gap: 4 },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: { backgroundColor: "#0040a1" },
  dotActive: {
    backgroundColor: "#0040a1",
    borderWidth: 3,
    borderColor: "#bfdbfe",
  },
  dotPending: { backgroundColor: "#e2e8f0" },
  line: { flex: 1, height: 2, marginTop: 12, marginHorizontal: 2 },
  lineDone: { backgroundColor: "#0040a1" },
  linePending: { backgroundColor: "#e2e8f0" },
  label: { fontSize: 11, fontWeight: "600" },
  labelDone: { color: "#0040a1" },
  labelActive: { color: "#0040a1" },
  labelPending: { color: "#94a3b8" },
});

// ─── Action Modal ─────────────────────────────────────────────────────────────
function ReviewModal({
  visible,
  action,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  action: "Approved" | "Rejected" | "Request Correction" | null;
  onClose: () => void;
  onSubmit: (comments: string) => void;
}) {
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");

  const config = {
    Approved: {
      title: "Approve Application",
      subtitle: "Confirm that this application meets all requirements.",
      placeholder: "Add approval comments (optional)…",
      btnLabel: "Approve",
      btnColor: "#16a34a",
      required: false,
    },
    Rejected: {
      title: "Reject Application",
      subtitle: "Please provide a reason for rejection.",
      placeholder: "Enter reason for rejection…",
      btnLabel: "Reject",
      btnColor: "#dc2626",
      required: true,
    },
    "Request Correction": {
      title: "Request Correction",
      subtitle: "Specify what needs to be corrected by the applicant.",
      placeholder: "Describe what needs to be corrected…",
      btnLabel: "Send Back",
      btnColor: "#d97706",
      required: true,
    },
  };

  if (!action) return null;
  const c = config[action];

  const handleSubmit = () => {
    if (c.required && !comments.trim()) {
      setError("This field is required.");
      return;
    }
    onSubmit(comments.trim());
    setComments("");
    setError("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={rmod.overlay}>
        <View style={rmod.sheet}>
          <Text style={rmod.title}>{c.title}</Text>
          <Text style={rmod.subtitle}>{c.subtitle}</Text>

          <TextInput
            style={[rmod.input, error && rmod.inputError]}
            placeholder={c.placeholder}
            placeholderTextColor="#94a3b8"
            value={comments}
            onChangeText={(t) => {
              setComments(t);
              setError("");
            }}
            multiline
            textAlignVertical="top"
          />
          {error ? <Text style={rmod.error}>{error}</Text> : null}

          <View style={rmod.actions}>
            <Pressable style={rmod.cancelBtn} onPress={onClose}>
              <Text style={rmod.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[rmod.submitBtn, { backgroundColor: c.btnColor }]}
              onPress={handleSubmit}
            >
              <Text style={rmod.submitText}>{c.btnLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const rmod = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 10,
  },
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 13, color: "#64748b", lineHeight: 18 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    minHeight: 100,
  },
  inputError: { borderColor: "#dc2626" },
  error: { fontSize: 12, color: "#dc2626" },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { fontSize: 14, fontWeight: "600", color: "#374151" },
  submitBtn: {
    flex: 1.2,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={sec.card}>
      <View style={sec.header}>
        {icon}
        <Text style={sec.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const sec = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  title: { fontSize: 14, fontWeight: "700", color: "#111827" },
});

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: "500", color: "#111827" }}>
        {value}
      </Text>
    </View>
  );
}

// ─── History Item ─────────────────────────────────────────────────────────────
function HistoryItem({
  stage,
  timestamp,
  note,
  by,
  completed,
  isLast,
}: {
  stage: string;
  timestamp: string;
  note: string;
  by?: string;
  completed: boolean;
  isLast: boolean;
}) {
  return (
    <View style={hi.row}>
      <View style={hi.timeline}>
        <View style={[hi.dot, completed ? hi.dotDone : hi.dotPending]} />
        {!isLast && (
          <View style={[hi.line, completed ? hi.lineDone : hi.linePending]} />
        )}
      </View>
      <View style={hi.content}>
        <Text style={hi.stage}>{stage}</Text>
        <Text style={hi.ts}>{timestamp}</Text>
        <Text style={hi.note}>{note}</Text>
        {by && <Text style={hi.by}>By: {by}</Text>}
      </View>
    </View>
  );
}

const hi = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginBottom: 4 },
  timeline: { alignItems: "center", width: 16 },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 2 },
  dotDone: { backgroundColor: "#0040a1" },
  dotPending: { backgroundColor: "#d1d5db" },
  line: { width: 2, flex: 1, minHeight: 28, marginTop: 2 },
  lineDone: { backgroundColor: "#0040a1" },
  linePending: { backgroundColor: "#e2e8f0" },
  content: { flex: 1, paddingBottom: 14 },
  stage: { fontSize: 13, fontWeight: "700", color: "#111827" },
  ts: { fontSize: 11, color: "#94a3b8", marginVertical: 2 },
  note: { fontSize: 13, color: "#374151", lineHeight: 18 },
  by: { fontSize: 11, color: "#64748b", marginTop: 2 },
});

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    New: { bg: "#f1f5f9", text: "#475569" },
    "Field Visit Pending": { bg: "#dbeafe", text: "#1d4ed8" },
    "Clerk Review": { bg: "#fef9c3", text: "#854d0e" },
    "Engineer Review": { bg: "#fee2e2", text: "#991b1b" },
    Approved: { bg: "#dcfce7", text: "#166534" },
    Rejected: { bg: "#fee2e2", text: "#991b1b" },
    Completed: { bg: "#dcfce7", text: "#166534" },
  };
  const c = map[status] ?? { bg: "#f1f5f9", text: "#475569" };
  return (
    <View style={[{ borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, backgroundColor: c.bg }]}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: c.text }}>{status}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ApplicationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [app, setApp] = useState<ServiceApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewAction, setReviewAction] = useState<
    "Approved" | "Rejected" | "Request Correction" | null
  >(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const data = await employeeService.getApplicationById(id);
    setApp(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReview = async (comments: string) => {
    if (!app || !reviewAction) return;
    setActionLoading(true);
    try {
      const updated = await employeeService.reviewApplication(
        app.id,
        reviewAction as "Approved" | "Rejected" | "Request Correction",
        comments || `Application ${reviewAction} by Engineer.`
      );
      if (updated) setApp({ ...updated });
      Alert.alert(
        reviewAction,
        `Application has been ${reviewAction.toLowerCase()}.`
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
        </View>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#0040a1" />
        </View>
      </SafeAreaView>
    );
  }

  if (!app) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>Application Detail</Text>
        </View>
        <View style={styles.loadingCenter}>
          <Text style={{ color: "#94a3b8" }}>Application not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isFinalized =
    app.status === "Approved" ||
    app.status === "Rejected" ||
    app.status === "Completed";
  const canReview = app.status === "Engineer Review";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>{app.applicationNumber}</Text>
            <Text style={styles.headerSub}>{app.type}</Text>
          </View>
        </View>
        <StatusBadge status={app.status} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Workflow Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Workflow Progress</Text>
          <StageProgress
            currentStage={app.currentStage}
            stageCompleted={app.stageCompleted}
          />
          <Text style={styles.progressMeta}>
            Submitted: {app.submittedAt} · {app.zone}
          </Text>
        </View>

        {/* Applicant Details */}
        <SectionCard
          icon={<User size={16} color="#0040a1" strokeWidth={2} />}
          title="Applicant Details"
        >
          <InfoRow label="Applicant Name" value={app.applicantName} />
          <InfoRow label="Ward / Zone" value={`${app.ward} · ${app.zone}`} />
          <InfoRow label="Application Type" value={app.type} />
          <InfoRow label="Submitted On" value={app.submittedAt} />
        </SectionCard>

        {/* Documents */}
        {app.documents && app.documents.length > 0 && (
          <SectionCard
            icon={<FileText size={16} color="#0040a1" strokeWidth={2} />}
            title="Submitted Documents"
          >
            {app.documents.map((doc, i) => (
              <Pressable key={i} style={styles.docRow}>
                <View style={styles.docIcon}>
                  <FileText size={14} color="#0040a1" strokeWidth={2} />
                </View>
                <Text style={styles.docName}>{doc}</Text>
                <Text style={styles.docStatus}>✓ Verified</Text>
              </Pressable>
            ))}
          </SectionCard>
        )}

        {/* Field Report */}
        {app.fieldReport && (
          <SectionCard
            icon={<ClipboardList size={16} color="#006b5f" strokeWidth={2} />}
            title="Plumber Field Report"
          >
            <Text style={styles.fieldReportText}>{app.fieldReport}</Text>
          </SectionCard>
        )}

        {/* Clerk Comments */}
        {app.clerkComments && (
          <SectionCard
            icon={<ClipboardList size={16} color="#d97706" strokeWidth={2} />}
            title="Clerk Comments"
          >
            <Text style={styles.fieldReportText}>{app.clerkComments}</Text>
          </SectionCard>
        )}

        {/* Engineer Comments (if already reviewed) */}
        {app.engineerComments && (
          <SectionCard
            icon={<CheckCircle2 size={16} color="#0040a1" strokeWidth={2} />}
            title="Engineer Review"
          >
            <Text style={styles.fieldReportText}>{app.engineerComments}</Text>
          </SectionCard>
        )}

        {/* Workflow History */}
        <SectionCard
          icon={<Clock size={16} color="#0040a1" strokeWidth={2} />}
          title="Workflow History"
        >
          {app.history.map((h, i) => (
            <HistoryItem
              key={i}
              stage={h.stage}
              timestamp={h.timestamp}
              note={h.note}
              by={h.by}
              completed={h.completed}
              isLast={i === app.history.length - 1}
            />
          ))}
        </SectionCard>

        {/* Action Buttons */}
        {canReview && !isFinalized && (
          <View style={styles.actionsSection}>
            <Text style={styles.actionsLabel}>Engineer Decision</Text>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: "#16a34a" }]}
              onPress={() => setReviewAction("Approved")}
              disabled={actionLoading}
            >
              <CheckCircle2 size={16} color="#fff" strokeWidth={2} />
              <Text style={styles.actionBtnText}>Approve Application</Text>
            </Pressable>
            <View style={styles.actionRow}>
              <Pressable
                style={[styles.actionBtnOutline, { borderColor: "#d97706" }]}
                onPress={() => setReviewAction("Request Correction")}
                disabled={actionLoading}
              >
                <RotateCcw size={14} color="#d97706" strokeWidth={2} />
                <Text style={[styles.actionBtnOutlineText, { color: "#d97706" }]}>
                  Request Correction
                </Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtnOutline, { borderColor: "#dc2626" }]}
                onPress={() => setReviewAction("Rejected")}
                disabled={actionLoading}
              >
                <XCircle size={14} color="#dc2626" strokeWidth={2} />
                <Text style={[styles.actionBtnOutlineText, { color: "#dc2626" }]}>
                  Reject
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {isFinalized && (
          <View style={styles.finalizedBanner}>
            <CheckCircle2
              size={16}
              color={app.status === "Rejected" ? "#dc2626" : "#16a34a"}
              strokeWidth={2}
            />
            <Text
              style={[
                styles.finalizedText,
                { color: app.status === "Rejected" ? "#dc2626" : "#16a34a" },
              ]}
            >
              This application has been {app.status.toLowerCase()}.
            </Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      <ReviewModal
        visible={reviewAction !== null}
        action={reviewAction}
        onClose={() => setReviewAction(null)}
        onSubmit={handleReview}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 15, fontWeight: "700", color: "#0040a1" },
  headerSub: { fontSize: 11, color: "#64748b" },

  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },

  scroll: { flex: 1 },
  scrollContent: { padding: 14 },

  progressCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
  },
  progressTitle: { fontSize: 14, fontWeight: "700", color: "#374151", marginBottom: 4 },
  progressMeta: { fontSize: 11, color: "#94a3b8", marginTop: 4 },

  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  docIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  docName: { flex: 1, fontSize: 14, fontWeight: "500", color: "#374151" },
  docStatus: { fontSize: 12, fontWeight: "600", color: "#16a34a" },

  fieldReportText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
  },

  actionsSection: { gap: 10, marginTop: 4 },
  actionsLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 2,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 15,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  actionBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  actionRow: { flexDirection: "row", gap: 10 },
  actionBtnOutline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
  },
  actionBtnOutlineText: { fontSize: 13, fontWeight: "700" },

  finalizedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 10,
    padding: 14,
    marginTop: 4,
  },
  finalizedText: { fontSize: 14, fontWeight: "600", flex: 1 },
});
