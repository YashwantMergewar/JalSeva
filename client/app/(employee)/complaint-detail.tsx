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
  MoreVertical,
  User,
  FileText,
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  CalendarDays,
  ArrowUpCircle,
  Printer,
  Phone,
  MessageSquare,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  employeeService,
  EmpComplaint,
  ComplaintStatus,
} from "../../src/services/employee.service";

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ComplaintStatus }) {
  const config: Record<ComplaintStatus, { bg: string; text: string }> = {
    Submitted: { bg: "#f1f5f9", text: "#475569" },
    "Pending Review": { bg: "#fef9c3", text: "#854d0e" },
    Assigned: { bg: "#dbeafe", text: "#1d4ed8" },
    "In Progress": { bg: "#8df1e0", text: "#006b5f" },
    Escalated: { bg: "#fee2e2", text: "#991b1b" },
    Resolved: { bg: "#dcfce7", text: "#166534" },
    Rejected: { bg: "#f1f5f9", text: "#475569" },
  };
  const c = config[status] ?? { bg: "#f1f5f9", text: "#475569" };
  return (
    <View style={[sb.wrap, { backgroundColor: c.bg }]}>
      <Text style={[sb.text, { color: c.text }]}>{status}</Text>
    </View>
  );
}
const sb = StyleSheet.create({
  wrap: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  text: { fontSize: 12, fontWeight: "700" },
});

// ─── Action Sheet Modal ───────────────────────────────────────────────────────
interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  submitLabel: string;
  onSubmit: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
}
function ActionModal({
  visible,
  onClose,
  title,
  inputLabel,
  inputPlaceholder,
  submitLabel,
  onSubmit,
  multiline = true,
  required = false,
}: ActionModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (required && !value.trim()) {
      setError("This field is required.");
      return;
    }
    onSubmit(value.trim());
    setValue("");
    setError("");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <Text style={modal.title}>{title}</Text>
          {inputLabel && (
            <>
              <Text style={modal.label}>{inputLabel}</Text>
              <TextInput
                style={[modal.input, multiline && modal.inputMulti]}
                placeholder={inputPlaceholder || ""}
                placeholderTextColor="#94a3b8"
                value={value}
                onChangeText={(t) => { setValue(t); setError(""); }}
                multiline={multiline}
                textAlignVertical={multiline ? "top" : "center"}
              />
              {error ? <Text style={modal.error}>{error}</Text> : null}
            </>
          )}
          <View style={modal.actions}>
            <Pressable style={modal.cancelBtn} onPress={onClose}>
              <Text style={modal.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={modal.submitBtn} onPress={handleSubmit}>
              <Text style={modal.submitText}>{submitLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Assign Staff Modal ────────────────────────────────────────────────────────
const STAFF_OPTIONS = [
  { name: "Amit Shinde", role: "Plumber", id: "EMP-0008" },
  { name: "Suresh Patil", role: "Plumber", id: "EMP-0009" },
  { name: "Rahul Patil", role: "Engineer", id: "EMP-0007" },
  { name: "Sneha Deshmukh", role: "Junior Clerk", id: "EMP-0010" },
];

function AssignModal({
  visible,
  onClose,
  onAssign,
}: {
  visible: boolean;
  onClose: () => void;
  onAssign: (name: string, role: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modal.overlay}>
        <View style={modal.sheet}>
          <Text style={modal.title}>Assign Staff</Text>
          {STAFF_OPTIONS.map((s) => (
            <Pressable
              key={s.id}
              style={modal.staffRow}
              onPress={() => {
                onAssign(s.name, s.role);
                onClose();
              }}
            >
              <View style={modal.staffAvatar}>
                <Text style={modal.staffInitial}>{s.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={modal.staffName}>{s.name}</Text>
                <Text style={modal.staffRole}>{s.role} · {s.id}</Text>
              </View>
              <ChevronRight size={14} color="#94a3b8" strokeWidth={2} />
            </Pressable>
          ))}
          <Pressable style={modal.cancelBtn} onPress={onClose}>
            <Text style={modal.cancelText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
  },
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  label: { fontSize: 13, fontWeight: "600", color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#111827",
  },
  inputMulti: { minHeight: 100 },
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
    flex: 1,
    backgroundColor: "#0040a1",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  staffRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  staffAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
  },
  staffInitial: { fontSize: 15, fontWeight: "700", color: "#fff" },
  staffName: { fontSize: 14, fontWeight: "600", color: "#111827" },
  staffRole: { fontSize: 12, color: "#64748b" },
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
    backgroundColor: "#ffffff",
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

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={ir.row}>
      <Text style={ir.label}>{label}</Text>
      <Text style={ir.value}>{value}</Text>
    </View>
  );
}
const ir = StyleSheet.create({
  row: { marginBottom: 10 },
  label: { fontSize: 12, color: "#94a3b8", marginBottom: 2 },
  value: { fontSize: 14, fontWeight: "500", color: "#111827" },
});

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
        {!isLast && <View style={[hi.line, completed ? hi.lineDone : hi.linePending]} />}
      </View>
      <View style={hi.content}>
        <Text style={hi.stage}>{stage}</Text>
        <Text style={hi.timestamp}>{timestamp}</Text>
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
  line: { width: 2, flex: 1, minHeight: 30, marginTop: 2 },
  lineDone: { backgroundColor: "#0040a1" },
  linePending: { backgroundColor: "#e2e8f0" },
  content: { flex: 1, paddingBottom: 14 },
  stage: { fontSize: 13, fontWeight: "700", color: "#111827" },
  timestamp: { fontSize: 11, color: "#94a3b8", marginVertical: 2 },
  note: { fontSize: 13, color: "#374151", lineHeight: 18 },
  by: { fontSize: 11, color: "#64748b", marginTop: 2 },
});

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function ComplaintDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [complaint, setComplaint] = useState<EmpComplaint | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAssign, setShowAssign] = useState(false);
  const [showEscalate, setShowEscalate] = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadComplaint = useCallback(async () => {
    if (!id) return;
    try {
      const data = await employeeService.getComplaintById(id);
      setComplaint(data);
    } catch {
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadComplaint(); }, [loadComplaint]);

  const handleAssign = async (name: string, role: string) => {
    if (!complaint) return;
    setActionLoading(true);
    try {
      const updated = await employeeService.assignComplaint(complaint.id, name, role);
      if (updated) setComplaint({ ...updated });
      Alert.alert("Assigned", `Complaint assigned to ${name} (${role}).`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async (reason: string) => {
    if (!complaint) return;
    setActionLoading(true);
    try {
      const updated = await employeeService.escalateComplaint(complaint.id, reason);
      if (updated) setComplaint({ ...updated });
      Alert.alert("Escalated", "Complaint has been escalated to the next level.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolve = async (note: string) => {
    if (!complaint) return;
    setActionLoading(true);
    try {
      const updated = await employeeService.resolveComplaint(complaint.id, note || "Complaint resolved by Engineer.");
      if (updated) setComplaint({ ...updated });
      Alert.alert("Resolved", "Complaint has been marked as resolved.");
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

  if (!complaint) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>Complaint Detail</Text>
        </View>
        <View style={styles.loadingCenter}>
          <Text style={styles.errorText}>Complaint not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isResolved = complaint.status === "Resolved" || complaint.status === "Rejected";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={22} color="#0040a1" strokeWidth={2} />
          </Pressable>
          <Text style={styles.headerTitle}>#{complaint.complaintNumber}</Text>
        </View>
        <View style={styles.headerRight}>
          <StatusBadge status={complaint.status} />
          <Pressable style={styles.moreBtn}>
            <MoreVertical size={20} color="#374151" strokeWidth={2} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Complaint Title + Meta */}
        <View style={styles.titleCard}>
          <Text style={styles.complaintType}>{complaint.type}</Text>
          <Text style={styles.complaintMeta}>
            ID: #{complaint.complaintNumber} · Logged on {complaint.reportedAt}
          </Text>

          {/* Print Button */}
          <Pressable style={styles.printBtn}>
            <Printer size={14} color="#374151" strokeWidth={2} />
            <Text style={styles.printText}>Print</Text>
          </Pressable>
        </View>

        {/* Complainant Details */}
        <SectionCard
          icon={<User size={16} color="#0040a1" strokeWidth={2} />}
          title="Complainant Details"
        >
          <InfoRow label="Citizen Name" value={complaint.citizenName} />
          {complaint.consumerNumber && (
            <InfoRow label="Consumer No." value={complaint.consumerNumber} />
          )}
          <InfoRow label="Contact Number" value={complaint.contactNumber} />
          <InfoRow label="Department" value={complaint.department} />
          <InfoRow label="Category" value={complaint.category} />
          <View style={styles.contactActions}>
            <Pressable style={styles.contactBtn}>
              <Phone size={14} color="#0040a1" strokeWidth={2} />
              <Text style={styles.contactBtnText}>Call</Text>
            </Pressable>
            <Pressable style={styles.contactBtn}>
              <MessageSquare size={14} color="#0040a1" strokeWidth={2} />
              <Text style={styles.contactBtnText}>Message</Text>
            </Pressable>
          </View>
        </SectionCard>

        {/* Complaint Description */}
        <SectionCard
          icon={<FileText size={16} color="#0040a1" strokeWidth={2} />}
          title="Complaint Description"
        >
          <Text style={styles.description}>{complaint.description}</Text>
          {complaint.evidenceUris && complaint.evidenceUris.length > 0 && (
            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceLabel}>Attached Evidence</Text>
              <View style={styles.evidenceRow}>
                {complaint.evidenceUris.map((uri, i) => (
                  <View key={i} style={styles.evidencePlaceholder}>
                    <Text style={styles.evidencePlaceholderText}>Photo {i + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {(!complaint.evidenceUris || complaint.evidenceUris.length === 0) && (
            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceLabel}>Attached Evidence</Text>
              <Text style={styles.noEvidence}>No photos attached by citizen.</Text>
            </View>
          )}
        </SectionCard>

        {/* Location */}
        <SectionCard
          icon={<MapPin size={16} color="#0040a1" strokeWidth={2} />}
          title="Location"
        >
          <View style={styles.mapPlaceholder}>
            <MapPin size={28} color="#94a3b8" strokeWidth={1.5} />
            <Text style={styles.mapPlaceholderText}>Map View</Text>
          </View>
          <Text style={styles.locationText}>{complaint.location}</Text>
          <Text style={styles.wardText}>{complaint.ward}</Text>
        </SectionCard>

        {/* Assignment Info */}
        {complaint.assignedTo && (
          <SectionCard
            icon={<UserCheck size={16} color="#0040a1" strokeWidth={2} />}
            title="Currently Assigned"
          >
            <View style={styles.assignedRow}>
              <View style={styles.assignedAvatar}>
                <Text style={styles.assignedInitial}>
                  {complaint.assignedTo[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.assignedName}>{complaint.assignedTo}</Text>
                <Text style={styles.assignedRole}>
                  {complaint.assignedToRole} · Level: {complaint.escalationLevel}
                </Text>
              </View>
            </View>
          </SectionCard>
        )}

        {/* Tracking History */}
        <SectionCard
          icon={<Clock size={16} color="#0040a1" strokeWidth={2} />}
          title="Tracking History"
        >
          {complaint.history.map((h, i) => (
            <HistoryItem
              key={i}
              stage={h.stage}
              timestamp={h.timestamp}
              note={h.note}
              by={h.by}
              completed={h.completed}
              isLast={i === complaint.history.length - 1}
            />
          ))}
        </SectionCard>

        {/* Action Buttons */}
        {!isResolved && (
          <View style={styles.actionsSection}>
            <View style={styles.actionsRow}>
              <Pressable
                style={styles.actionOutline}
                onPress={() => router.push({
                  pathname: "/(employee)/schedules" as any,
                  params: { complaintId: complaint.id },
                })}
              >
                <CalendarDays size={15} color="#0040a1" strokeWidth={2} />
                <Text style={styles.actionOutlineText}>Schedule Visit</Text>
              </Pressable>
              <Pressable
                style={styles.actionOutline}
                onPress={() => setShowNote(true)}
              >
                <FileText size={15} color="#0040a1" strokeWidth={2} />
                <Text style={styles.actionOutlineText}>Add Note</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.assignBtn}
              onPress={() => setShowAssign(true)}
            >
              <UserCheck size={16} color="#fff" strokeWidth={2} />
              <Text style={styles.assignBtnText}>Assign Staff</Text>
            </Pressable>

            <View style={styles.actionsRow}>
              <Pressable
                style={[styles.actionOutline, { borderColor: "#d97706" }]}
                onPress={() => setShowEscalate(true)}
              >
                <ArrowUpCircle size={15} color="#d97706" strokeWidth={2} />
                <Text style={[styles.actionOutlineText, { color: "#d97706" }]}>
                  Escalate
                </Text>
              </Pressable>
              <Pressable
                style={[styles.actionOutline, { borderColor: "#16a34a", backgroundColor: "#f0fdf4" }]}
                onPress={() => setShowResolve(true)}
              >
                <CheckCircle2 size={15} color="#16a34a" strokeWidth={2} />
                <Text style={[styles.actionOutlineText, { color: "#16a34a" }]}>
                  Resolve
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {isResolved && (
          <View style={styles.resolvedBanner}>
            <CheckCircle2 size={18} color="#16a34a" strokeWidth={2} />
            <Text style={styles.resolvedBannerText}>
              This complaint has been {complaint.status.toLowerCase()}.
            </Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modals */}
      <AssignModal
        visible={showAssign}
        onClose={() => setShowAssign(false)}
        onAssign={handleAssign}
      />

      <ActionModal
        visible={showEscalate}
        onClose={() => setShowEscalate(false)}
        title="Escalate Complaint"
        inputLabel="Reason for Escalation *"
        inputPlaceholder="Enter the reason for escalating this complaint..."
        submitLabel="Escalate"
        onSubmit={handleEscalate}
        required
      />

      <ActionModal
        visible={showResolve}
        onClose={() => setShowResolve(false)}
        title="Resolve Complaint"
        inputLabel="Resolution Notes"
        inputPlaceholder="Describe the resolution (optional)..."
        submitLabel="Mark Resolved"
        onSubmit={handleResolve}
      />

      <ActionModal
        visible={showNote}
        onClose={() => setShowNote(false)}
        title="Add Internal Note"
        inputLabel="Note"
        inputPlaceholder="Add an internal note for this complaint..."
        submitLabel="Save Note"
        onSubmit={(note) => Alert.alert("Note Saved", "Internal note has been added.")}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  backBtn: { padding: 6 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#0040a1" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  moreBtn: { padding: 6 },

  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 15, color: "#94a3b8" },

  scroll: { flex: 1 },
  scrollContent: { padding: 14 },

  // Title card
  titleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
    gap: 4,
  },
  complaintType: { fontSize: 20, fontWeight: "700", color: "#111827" },
  complaintMeta: { fontSize: 12, color: "#64748b" },
  printBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 6,
  },
  printText: { fontSize: 13, fontWeight: "500", color: "#374151" },

  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 21,
    marginBottom: 12,
  },
  evidenceSection: { gap: 6 },
  evidenceLabel: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  evidenceRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  evidencePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  evidencePlaceholderText: { fontSize: 11, color: "#94a3b8" },
  noEvidence: { fontSize: 13, color: "#94a3b8" },

  mapPlaceholder: {
    height: 120,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  mapPlaceholderText: { fontSize: 13, color: "#94a3b8" },
  locationText: { fontSize: 14, color: "#374151", lineHeight: 20 },
  wardText: { fontSize: 12, color: "#94a3b8", marginTop: 2 },

  assignedRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  assignedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0040a1",
    alignItems: "center",
    justifyContent: "center",
  },
  assignedInitial: { fontSize: 16, fontWeight: "700", color: "#fff" },
  assignedName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  assignedRole: { fontSize: 12, color: "#64748b" },

  contactActions: { flexDirection: "row", gap: 8, marginTop: 4 },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#f0f7ff",
  },
  contactBtnText: { fontSize: 13, fontWeight: "600", color: "#0040a1" },

  // Action Buttons
  actionsSection: { gap: 10, marginTop: 4 },
  actionsRow: { flexDirection: "row", gap: 10 },
  actionOutline: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: "#0040a1",
    borderRadius: 10,
    paddingVertical: 11,
  },
  actionOutlineText: { fontSize: 13, fontWeight: "600", color: "#0040a1" },
  assignBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#0040a1",
    borderRadius: 10,
    paddingVertical: 14,
    shadowColor: "#0040a1",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  assignBtnText: { fontSize: 15, fontWeight: "700", color: "#ffffff" },

  resolvedBanner: {
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
  resolvedBannerText: { fontSize: 14, fontWeight: "600", color: "#166534", flex: 1 },
});
