export interface ComplaintItem {
  id: string;
  complaintNumber: string;
  category: string;
  description: string;
  ward: string;
  location: string;
  status: "Submitted" | "Under Review" | "Assigned" | "In Progress" | "Resolved" | "Rejected";
  dateSubmitted: string;
  assignedTo?: {
    name: string;
    role: string;
    contact?: string;
  };
  escalationLevel: "Clerk" | "Engineer" | "Chief Officer";
  history: Array<{
    stage: string;
    timestamp: string;
    note: string;
    completed: boolean;
  }>;
  evidenceUris?: string[];
}

export const COMPLAINT_CATEGORIES = [
  { id: "pipeline-breakdown", name: "Pipeline Breakdown", icon: "Wrench" },
  { id: "pump-breakdown", name: "Pump Breakdown", icon: "Zap" },
  { id: "pipeline-leakage", name: "Pipeline Leakage", icon: "Droplets" },
  { id: "dirty-water", name: "Dirty Water", icon: "AlertTriangle" },
  { id: "low-pressure", name: "Low Pressure", icon: "Gauge" },
  { id: "water-quality", name: "Water Quality", icon: "FlaskConical" },
  { id: "other", name: "Other Issue", icon: "HelpCircle" },
];

let storedComplaints: ComplaintItem[] = [
  {
    id: "cmp-101",
    complaintNumber: "CMP-2026-1049",
    category: "Pipeline Leakage",
    description: "Main supply pipe leakage near street corner causing low water pressure and pool on road.",
    ward: "Ward 4 - Sector 12",
    location: "Lane 3, Opposite Community Hall, Sector 12",
    status: "In Progress",
    dateSubmitted: "Oct 24, 2026 • 09:15 AM",
    assignedTo: {
      name: "Suresh Patil",
      role: "Junior Maintenance Engineer",
      contact: "+91 98220 54321",
    },
    escalationLevel: "Engineer",
    history: [
      { stage: "Submitted", timestamp: "Oct 24, 2026 • 09:15 AM", note: "Complaint logged by citizen.", completed: true },
      { stage: "Under Review", timestamp: "Oct 24, 2026 • 10:00 AM", note: "Clerk reviewed and verified municipal zone.", completed: true },
      { stage: "Assigned", timestamp: "Oct 24, 2026 • 11:30 AM", note: "Assigned to Ward 4 maintenance team.", completed: true },
      { stage: "Work in Progress", timestamp: "Oct 24, 2026 • 02:00 PM", note: "Team dispatched with replacement collar pipe.", completed: true },
      { stage: "Resolved", timestamp: "Pending", note: "Awaiting final pressure test and closure.", completed: false },
    ],
  },
  {
    id: "cmp-102",
    complaintNumber: "CMP-2026-0982",
    category: "Dirty Water",
    description: "Water has brownish turbidity and faint odor during morning 6 AM supply slot.",
    ward: "Ward 4 - Sector 12",
    location: "Plot 104, Green Avenue",
    status: "Resolved",
    dateSubmitted: "Oct 18, 2026 • 07:00 AM",
    assignedTo: {
      name: "Water Quality Lab Team",
      role: "Testing Analyst",
    },
    escalationLevel: "Clerk",
    history: [
      { stage: "Submitted", timestamp: "Oct 18, 2026 • 07:00 AM", note: "Complaint registered.", completed: true },
      { stage: "Assigned", timestamp: "Oct 18, 2026 • 09:00 AM", note: "Pipeline flush requested.", completed: true },
      { stage: "Resolved", timestamp: "Oct 19, 2026 • 04:00 PM", note: "End-line valve flushed and quality verified clean.", completed: true },
    ],
  },
];

export const complaintService = {
  getComplaints: async (): Promise<ComplaintItem[]> => {
    return Promise.resolve([...storedComplaints]);
  },

  getComplaintById: async (id: string): Promise<ComplaintItem | null> => {
    const item = storedComplaints.find((c) => c.id === id || c.complaintNumber === id);
    return Promise.resolve(item || storedComplaints[0] || null);
  },

  submitComplaint: async (params: {
    category: string;
    description: string;
    ward: string;
    location: string;
    evidenceUris?: string[];
  }): Promise<ComplaintItem> => {
    const newNumber = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint: ComplaintItem = {
      id: `cmp-${Date.now()}`,
      complaintNumber: newNumber,
      category: params.category,
      description: params.description,
      ward: params.ward,
      location: params.location,
      status: "Submitted",
      dateSubmitted: "Today • Just now",
      escalationLevel: "Clerk",
      history: [
        {
          stage: "Submitted",
          timestamp: "Today • Just now",
          note: "Complaint submitted successfully via citizen portal.",
          completed: true,
        },
        {
          stage: "Under Review",
          timestamp: "Pending",
          note: "Assigned to Municipal Clerk for triage.",
          completed: false,
        },
        {
          stage: "Assigned",
          timestamp: "Pending",
          note: "Field team assignment.",
          completed: false,
        },
        {
          stage: "Work in Progress",
          timestamp: "Pending",
          note: "Technical resolution.",
          completed: false,
        },
        {
          stage: "Resolved",
          timestamp: "Pending",
          note: "Final verification.",
          completed: false,
        },
      ],
      evidenceUris: params.evidenceUris || [],
    };

    storedComplaints.unshift(newComplaint);
    return newComplaint;
  },

  cancelComplaint: async (id: string): Promise<boolean> => {
    const complaint = storedComplaints.find((c) => c.id === id || c.complaintNumber === id);
    if (complaint && complaint.status !== "Resolved" && complaint.status !== "Rejected") {
      complaint.status = "Rejected";
      complaint.history.push({
        stage: "Cancelled",
        timestamp: "Today",
        note: "Cancelled by citizen.",
        completed: true,
      });
      return true;
    }
    return false;
  },
};
