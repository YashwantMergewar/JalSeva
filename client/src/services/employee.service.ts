// ─────────────────────────────────────────────────────────────────────────────
// employee.service.ts  –  Central service / mock-data layer for the Employee
// side of Jal Seva.  All data is kept in module-level mutable arrays so that
// actions (assign, escalate, resolve, reschedule …) are reflected across every
// screen within the same session.
// ─────────────────────────────────────────────────────────────────────────────

// ──────────── Types ────────────

export type ComplaintStatus =
  | "Submitted"
  | "Pending Review"
  | "Assigned"
  | "In Progress"
  | "Escalated"
  | "Resolved"
  | "Rejected";

export type ComplaintPriority = "Low" | "Medium" | "High" | "Urgent";

export type ApplicationStatus =
  | "New"
  | "Field Visit Pending"
  | "Field Visit Done"
  | "Clerk Review"
  | "Engineer Review"
  | "Approved"
  | "Rejected"
  | "Completed";

export type ScheduleStatus = "Active" | "Restricted" | "Cancelled";

export type TaskStatus =
  | "Assigned"
  | "Started"
  | "In Progress"
  | "Field Report Submitted"
  | "Completed";

export type FieldVisitStatus =
  | "Scheduled"
  | "Assigned"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export interface HistoryEvent {
  stage: string;
  timestamp: string;
  note: string;
  by?: string;
  completed: boolean;
}

export interface EmpComplaint {
  id: string;
  complaintNumber: string;
  type: string;
  category: string;
  department: "Water" | "Sanitation";
  priority: ComplaintPriority;
  status: ComplaintStatus;
  citizenName: string;
  consumerNumber?: string;
  contactNumber: string;
  ward: string;
  location: string;
  description: string;
  reportedAt: string;
  assignedTo?: string;
  assignedToRole?: string;
  escalationLevel: "Clerk" | "Engineer" | "Chief Officer";
  history: HistoryEvent[];
  evidenceUris?: string[];
  fieldVisitId?: string;
}

export interface EmployeeTask {
  id: string;
  complaintNumber: string;
  type: string;
  priority: ComplaintPriority;
  status: TaskStatus;
  location: string;
  ward: string;
  assignedTo: string;
  scheduledDate: string;
  instructions?: string;
  fieldReportId?: string;
}

export interface ServiceApplication {
  id: string;
  applicationNumber: string;
  type: string;
  applicantName: string;
  ward: string;
  zone: string;
  status: ApplicationStatus;
  submittedAt: string;
  assignedTo?: string;
  currentStage: "Consumer" | "Plumber" | "Clerk" | "Engineer";
  stageCompleted: number; // 0-4
  documents?: string[];
  fieldReport?: string;
  clerkComments?: string;
  engineerComments?: string;
  history: HistoryEvent[];
}

export interface WaterSchedule {
  id: string;
  ward: string;
  area: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: ScheduleStatus;
  rescheduleReason?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface Consumer {
  id: string;
  consumerNumber: string;
  name: string;
  mobile: string;
  ward: string;
  area: string;
  connectionType: string;
  meterNumber: string;
  connectionDate: string;
  status: "Active" | "Inactive" | "Disconnected";
  address: string;
}

export interface EmployeeNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "complaint" | "schedule" | "application" | "task" | "escalation" | "report";
  read: boolean;
  linkType?: "complaint" | "schedule" | "application" | "task";
  linkId?: string;
}

// ──────────── MOCK DATA ────────────

let complaints: EmpComplaint[] = [
  {
    id: "emp-cmp-1",
    complaintNumber: "CMP-8472",
    type: "Water Pipe Leakage",
    category: "Pipeline Leakage",
    department: "Water",
    priority: "High",
    status: "Assigned",
    citizenName: "Rahul Sharma",
    consumerNumber: "WAT-9982-3341",
    contactNumber: "+91 98765 43210",
    ward: "Ward 14",
    location: "42, MG Road, Ward 14, Near City Center Mall, District Central",
    description:
      "There is a significant water leakage from the main supply pipe near the street corner. It has been overflowing for the last 24 hours, causing flooding on the road and reducing water pressure in our homes. Please resolve this urgently as water is being wasted.",
    reportedAt: "Oct 25, 2026 • 09:45 AM",
    assignedTo: "Amit Shinde",
    assignedToRole: "Plumber",
    escalationLevel: "Engineer",
    history: [
      { stage: "Submitted", timestamp: "Oct 25, 2026 • 09:45 AM", note: "Complaint logged by citizen.", by: "Citizen", completed: true },
      { stage: "Pending Review", timestamp: "Oct 25, 2026 • 10:00 AM", note: "Received by clerk for triage.", by: "Sneha Deshmukh (Clerk)", completed: true },
      { stage: "Assigned", timestamp: "Oct 25, 2026 • 10:30 AM", note: "Assigned to Junior Engineer. Pending field verification.", by: "Rahul Patil (Engineer)", completed: true },
      { stage: "In Progress", timestamp: "Pending", note: "Field visit & repair work.", completed: false },
      { stage: "Resolved", timestamp: "Pending", note: "Final closure.", completed: false },
    ],
    evidenceUris: [],
    fieldVisitId: "fv-1",
  },
  {
    id: "emp-cmp-2",
    complaintNumber: "CMP-9824",
    type: "Pipeline Breakdown",
    category: "Pipeline Breakdown",
    department: "Water",
    priority: "Urgent",
    status: "In Progress",
    citizenName: "Meena Kulkarni",
    consumerNumber: "WAT-8801-2204",
    contactNumber: "+91 97654 12345",
    ward: "Ward 14",
    location: "Sector 14, Main Road Near Community Center",
    description:
      "Major pipeline breakdown causing complete water supply disruption for entire sector. Immediate repair needed.",
    reportedAt: "Oct 24, 2026 • 07:00 AM",
    assignedTo: "Amit Shinde",
    assignedToRole: "Plumber",
    escalationLevel: "Engineer",
    history: [
      { stage: "Submitted", timestamp: "Oct 24, 2026 • 07:00 AM", note: "Complaint submitted.", by: "Citizen", completed: true },
      { stage: "Assigned", timestamp: "Oct 24, 2026 • 07:30 AM", note: "Assigned to Amit Shinde (Plumber).", by: "Rahul Patil (Engineer)", completed: true },
      { stage: "In Progress", timestamp: "Oct 24, 2026 • 08:00 AM", note: "Work started on site.", by: "Amit Shinde (Plumber)", completed: true },
      { stage: "Resolved", timestamp: "Pending", completed: false, note: "Awaiting completion." },
    ],
    fieldVisitId: "fv-2",
  },
  {
    id: "emp-cmp-3",
    complaintNumber: "CMP-9810",
    type: "Meter Leakage",
    category: "Pipeline Leakage",
    department: "Water",
    priority: "Medium",
    status: "Assigned",
    citizenName: "Kiran Joshi",
    consumerNumber: "WAT-7720-4412",
    contactNumber: "+91 91234 56789",
    ward: "Ward 7",
    location: "House 42, Block B, Residential Colony",
    description: "Water meter is leaking and causing water loss and bill discrepancy.",
    reportedAt: "Oct 23, 2026 • 02:30 PM",
    assignedTo: "Amit Shinde",
    assignedToRole: "Plumber",
    escalationLevel: "Clerk",
    history: [
      { stage: "Submitted", timestamp: "Oct 23, 2026 • 02:30 PM", note: "Complaint logged.", by: "Citizen", completed: true },
      { stage: "Assigned", timestamp: "Oct 23, 2026 • 04:00 PM", note: "Assigned to Amit Shinde.", by: "Sneha Deshmukh (Clerk)", completed: true },
      { stage: "Resolved", timestamp: "Pending", completed: false, note: "Awaiting completion." },
    ],
  },
  {
    id: "emp-cmp-4",
    complaintNumber: "CMP-9799",
    type: "Blockage Clearance",
    category: "Pipeline Breakdown",
    department: "Sanitation",
    priority: "Medium",
    status: "Assigned",
    citizenName: "Suresh Nair",
    consumerNumber: undefined,
    contactNumber: "+91 88765 99001",
    ward: "Ward 9",
    location: "Market Complex, Sector 9",
    description: "Drainage blockage near market area causing overflow on the road.",
    reportedAt: "Oct 22, 2026 • 11:00 AM",
    assignedTo: "Amit Shinde",
    assignedToRole: "Plumber",
    escalationLevel: "Clerk",
    history: [
      { stage: "Submitted", timestamp: "Oct 22, 2026 • 11:00 AM", note: "Complaint submitted.", by: "Citizen", completed: true },
      { stage: "Assigned", timestamp: "Oct 22, 2026 • 12:00 PM", note: "Assigned for field work.", by: "Sneha Deshmukh (Clerk)", completed: true },
    ],
  },
  {
    id: "emp-cmp-5",
    complaintNumber: "CMP-8901",
    type: "Dirty Water Supply",
    category: "Dirty Water",
    department: "Water",
    priority: "High",
    status: "Escalated",
    citizenName: "Priya Agarwal",
    consumerNumber: "WAT-6601-8829",
    contactNumber: "+91 79999 21212",
    ward: "Ward 3",
    location: "Civil Lines, Phase 2",
    description: "Brownish water coming from taps. Multiple residents in the area affected.",
    reportedAt: "Oct 21, 2026 • 06:00 AM",
    assignedTo: "Rahul Patil",
    assignedToRole: "Engineer",
    escalationLevel: "Chief Officer",
    history: [
      { stage: "Submitted", timestamp: "Oct 21, 2026 • 06:00 AM", note: "Complaint submitted.", by: "Citizen", completed: true },
      { stage: "Assigned", timestamp: "Oct 21, 2026 • 07:30 AM", note: "Assigned to Engineer.", by: "Sneha Deshmukh (Clerk)", completed: true },
      { stage: "Escalated", timestamp: "Oct 21, 2026 • 03:00 PM", note: "Escalated to Chief Officer due to SLA breach.", by: "Rahul Patil (Engineer)", completed: true },
    ],
  },
  {
    id: "emp-cmp-6",
    complaintNumber: "CMP-8340",
    type: "Low Water Pressure",
    category: "Low Pressure",
    department: "Water",
    priority: "Low",
    status: "Resolved",
    citizenName: "Dinesh Verma",
    consumerNumber: "WAT-5500-1122",
    contactNumber: "+91 99887 44556",
    ward: "Ward 6",
    location: "Gandhi Nagar, Block C",
    description: "Low water pressure during morning supply hours.",
    reportedAt: "Oct 18, 2026 • 09:00 AM",
    assignedTo: "Amit Shinde",
    assignedToRole: "Plumber",
    escalationLevel: "Clerk",
    history: [
      { stage: "Submitted", timestamp: "Oct 18, 2026", note: "Complaint logged.", by: "Citizen", completed: true },
      { stage: "Assigned", timestamp: "Oct 18, 2026", note: "Plumber assigned.", completed: true },
      { stage: "Resolved", timestamp: "Oct 19, 2026", note: "Valve adjustment resolved low pressure.", by: "Amit Shinde (Plumber)", completed: true },
    ],
  },
];

let tasks: EmployeeTask[] = [
  {
    id: "task-1",
    complaintNumber: "CMP-9824",
    type: "Pipeline Breakdown",
    priority: "Urgent",
    status: "In Progress",
    location: "Sector 14, Main Road Near Community Center",
    ward: "Ward 14",
    assignedTo: "EMP-0008",
    scheduledDate: "Oct 24, 2026",
    instructions: "Inspect and repair main pipeline. Carry replacement collar pipes.",
  },
  {
    id: "task-2",
    complaintNumber: "CMP-9810",
    type: "Meter Leakage",
    priority: "Medium",
    status: "Assigned",
    location: "House 42, Block B, Residential Colony",
    ward: "Ward 7",
    assignedTo: "EMP-0008",
    scheduledDate: "Oct 24, 2026",
    instructions: "Inspect meter connection and replace faulty washer if needed.",
  },
  {
    id: "task-3",
    complaintNumber: "CMP-9799",
    type: "Blockage Clearance",
    priority: "Medium",
    status: "Assigned",
    location: "Market Complex, Sector 9",
    ward: "Ward 9",
    assignedTo: "EMP-0008",
    scheduledDate: "Oct 24, 2026",
    instructions: "Clear drainage blockage using jetting machine.",
  },
];

let applications: ServiceApplication[] = [
  {
    id: "app-1",
    applicationNumber: "APP-2023-8942",
    type: "New Water Connection",
    applicantName: "Rajesh Kumar",
    ward: "Ward 4",
    zone: "Zone 4",
    status: "Engineer Review",
    submittedAt: "Oct 20, 2026",
    assignedTo: "EMP-0007",
    currentStage: "Engineer",
    stageCompleted: 3,
    documents: ["ID Proof", "Address Proof", "NOC"],
    fieldReport: "Site inspected. Infrastructure adequate for new connection. Meter location marked.",
    clerkComments: "Documents verified. Forwarded to Engineer for approval.",
    history: [
      { stage: "Submitted", timestamp: "Oct 20, 2026", note: "Application submitted by citizen.", completed: true },
      { stage: "Field Visit", timestamp: "Oct 21, 2026", note: "Plumber Amit Shinde conducted site visit.", completed: true },
      { stage: "Clerk Review", timestamp: "Oct 22, 2026", note: "Documents verified by Sneha Deshmukh.", completed: true },
      { stage: "Engineer Review", timestamp: "Oct 23, 2026", note: "Pending Engineer approval.", completed: false },
    ],
  },
  {
    id: "app-2",
    applicationNumber: "APP-2023-8945",
    type: "Sewer Line Repair",
    applicantName: "Anita Desai",
    ward: "Ward 1",
    zone: "Zone 1",
    status: "Field Visit Pending",
    submittedAt: "Oct 22, 2026",
    currentStage: "Plumber",
    stageCompleted: 1,
    history: [
      { stage: "Submitted", timestamp: "Oct 22, 2026", note: "Application submitted.", completed: true },
      { stage: "Field Visit", timestamp: "Pending", note: "Awaiting plumber assignment.", completed: false },
    ],
  },
  {
    id: "app-3",
    applicationNumber: "APP-2023-8938",
    type: "Change in Consumer Name",
    applicantName: "Pradeep Mishra",
    ward: "Ward 8",
    zone: "Zone 2",
    status: "New",
    submittedAt: "Oct 23, 2026",
    currentStage: "Consumer",
    stageCompleted: 0,
    history: [
      { stage: "Submitted", timestamp: "Oct 23, 2026", note: "Application received.", completed: true },
    ],
  },
  {
    id: "app-4",
    applicationNumber: "APP-2023-8929",
    type: "Change in Connection Status",
    applicantName: "Geeta Rao",
    ward: "Ward 12",
    zone: "Zone 3",
    status: "Approved",
    submittedAt: "Oct 15, 2026",
    assignedTo: "EMP-0007",
    currentStage: "Engineer",
    stageCompleted: 4,
    engineerComments: "Application approved. Reconnection authorized.",
    history: [
      { stage: "Submitted", timestamp: "Oct 15, 2026", note: "Application submitted.", completed: true },
      { stage: "Field Visit", timestamp: "Oct 16, 2026", note: "Site inspected.", completed: true },
      { stage: "Clerk Review", timestamp: "Oct 17, 2026", note: "Documents verified.", completed: true },
      { stage: "Approved", timestamp: "Oct 18, 2026", note: "Approved by Engineer Rahul Patil.", completed: true },
    ],
  },
];

const WARDS = [
  "Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5",
  "Ward 6", "Ward 7", "Ward 8", "Ward 9", "Ward 10",
  "Ward 11", "Ward 12", "Ward 13", "Ward 14", "Ward 15",
];

const WARD_AREAS: Record<string, string> = {
  "Ward 1": "Shivaji Nagar", "Ward 2": "Peth Area", "Ward 3": "Civil Lines",
  "Ward 4": "Sector 12", "Ward 5": "Market Zone", "Ward 6": "Gandhi Nagar",
  "Ward 7": "Residential Colony", "Ward 8": "Old City", "Ward 9": "Sector 9",
  "Ward 10": "Industrial Area", "Ward 11": "Subhash Nagar", "Ward 12": "Laxmi Nagar",
  "Ward 13": "Nehru Nagar", "Ward 14": "MG Road Zone", "Ward 15": "New Colony",
};

let schedules: WaterSchedule[] = WARDS.map((ward, i) => ({
  id: `sched-${i + 1}`,
  ward,
  area: WARD_AREAS[ward],
  date: "Oct 24, 2026",
  startTime: i % 3 === 0 ? "06:00 AM" : i % 3 === 1 ? "07:00 AM" : "08:00 AM",
  endTime: i % 3 === 0 ? "07:00 AM" : i % 3 === 1 ? "08:00 AM" : "09:00 AM",
  durationMinutes: 60,
  status: i === 2 ? "Restricted" : "Active",
  updatedBy: "Rahul Patil (Engineer)",
  updatedAt: "Oct 23, 2026 • 06:00 PM",
  rescheduleReason: i === 2 ? "Main pipeline maintenance in the area." : undefined,
}));

let consumers: Consumer[] = [
  { id: "con-1", consumerNumber: "WAT-9021", name: "Rajesh Kumar", mobile: "+91 98765 43210", ward: "Ward 4", area: "Sector 12", connectionType: "Residential", meterNumber: "MTR-4421", connectionDate: "Jan 15, 2020", status: "Active", address: "42, MG Road, Sector 12" },
  { id: "con-2", consumerNumber: "WAT-8801", name: "Meena Kulkarni", mobile: "+91 97654 12345", ward: "Ward 14", area: "MG Road Zone", connectionType: "Residential", meterNumber: "MTR-8812", connectionDate: "Mar 10, 2019", status: "Active", address: "15, Shivaji Park, Ward 14" },
  { id: "con-3", consumerNumber: "WAT-7720", name: "Kiran Joshi", mobile: "+91 91234 56789", ward: "Ward 7", area: "Residential Colony", connectionType: "Residential", meterNumber: "MTR-7701", connectionDate: "Jul 22, 2021", status: "Active", address: "House 42, Block B, Residential Colony" },
  { id: "con-4", consumerNumber: "WAT-6601", name: "Priya Agarwal", mobile: "+91 79999 21212", ward: "Ward 3", area: "Civil Lines", connectionType: "Residential", meterNumber: "MTR-6610", connectionDate: "Feb 1, 2018", status: "Active", address: "Plot 7, Civil Lines Phase 2" },
  { id: "con-5", consumerNumber: "WAT-5500", name: "Dinesh Verma", mobile: "+91 99887 44556", ward: "Ward 6", area: "Gandhi Nagar", connectionType: "Commercial", meterNumber: "MTR-5522", connectionDate: "Nov 5, 2022", status: "Active", address: "Shop 3, Gandhi Nagar Block C" },
  { id: "con-6", consumerNumber: "WAT-4401", name: "Sunita Patil", mobile: "+91 88901 55678", ward: "Ward 2", area: "Peth Area", connectionType: "Residential", meterNumber: "MTR-4401", connectionDate: "Aug 11, 2017", status: "Inactive", address: "14, Peth Lane, Ward 2" },
  { id: "con-7", consumerNumber: "WAT-3321", name: "Vijay More", mobile: "+91 77812 34567", ward: "Ward 11", area: "Subhash Nagar", connectionType: "Residential", meterNumber: "MTR-3321", connectionDate: "Dec 20, 2023", status: "Active", address: "C-12, Subhash Nagar, Ward 11" },
  { id: "con-8", consumerNumber: "WAT-2201", name: "Rekha Shinde", mobile: "+91 66543 21098", ward: "Ward 15", area: "New Colony", connectionType: "Residential", meterNumber: "MTR-2211", connectionDate: "Apr 3, 2024", status: "Active", address: "House 5, New Colony, Ward 15" },
];

let empNotifications: EmployeeNotification[] = [
  { id: "en-1", title: "Schedule Updated – Ward 12", message: "Water schedule for Ward 12 has been rescheduled from 6:00 AM to 7:30 AM due to pipeline maintenance.", date: "10 mins ago", type: "schedule", read: false, linkType: "schedule", linkId: "sched-12" },
  { id: "en-2", title: "Complaint Assigned – CMP-8472", message: "Complaint CMP-8472 (Pipeline Leakage, Ward 14) has been assigned to you.", date: "1 hour ago", type: "complaint", read: false, linkType: "complaint", linkId: "emp-cmp-1" },
  { id: "en-3", title: "Field Report Submitted – CMP-9824", message: "Amit Shinde has submitted a field report for complaint CMP-9824 (Pipeline Breakdown).", date: "3 hours ago", type: "report", read: false, linkType: "complaint", linkId: "emp-cmp-2" },
  { id: "en-4", title: "Application Requires Review – APP-2023-8942", message: "Service application APP-2023-8942 (New Water Connection, Rajesh Kumar) requires your review.", date: "Yesterday", type: "application", read: true, linkType: "application", linkId: "app-1" },
  { id: "en-5", title: "Complaint Escalated – CMP-8901", message: "Complaint CMP-8901 has been escalated to Chief Officer due to SLA breach.", date: "Yesterday", type: "escalation", read: true, linkType: "complaint", linkId: "emp-cmp-5" },
  { id: "en-6", title: "Field Visit Scheduled", message: "Field visit for CMP-8472 has been scheduled for tomorrow at 10:00 AM.", date: "2 days ago", type: "task", read: true },
];

// ──────────── Dashboard Stats ────────────

export interface DashboardStats {
  totalComplaints: number;
  pendingComplaints: number;
  escalated: number;
  visitsToday: number;
  assignedToStaff: number;
  pendingApplications: number;
  resolvedThisWeek: number[];
  receivedThisWeek: number[];
}

// ──────────── Service Object ────────────

export const employeeService = {
  // ── Dashboard ──
  getDashboardStats: async (): Promise<DashboardStats> => {
    return Promise.resolve({
      totalComplaints: 1248,
      pendingComplaints: 342,
      escalated: 28,
      visitsToday: 15,
      assignedToStaff: 878,
      pendingApplications: 156,
      resolvedThisWeek: [50, 60, 55, 80, 70, 75, 40],
      receivedThisWeek: [70, 65, 80, 85, 65, 60, 60],
    });
  },

  // ── Complaints ──
  getComplaints: async (filters?: {
    status?: ComplaintStatus;
    priority?: ComplaintPriority;
    department?: string;
    search?: string;
  }): Promise<EmpComplaint[]> => {
    let result = [...complaints];
    if (filters?.status) result = result.filter((c) => c.status === filters.status);
    if (filters?.priority) result = result.filter((c) => c.priority === filters.priority);
    if (filters?.department) result = result.filter((c) => c.department === filters.department);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.complaintNumber.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.type.toLowerCase().includes(q) ||
          c.citizenName.toLowerCase().includes(q)
      );
    }
    return Promise.resolve(result);
  },

  getComplaintById: async (id: string): Promise<EmpComplaint | null> => {
    return Promise.resolve(
      complaints.find((c) => c.id === id || c.complaintNumber === id) || null
    );
  },

  assignComplaint: async (id: string, employeeName: string, role: string): Promise<EmpComplaint | null> => {
    const c = complaints.find((x) => x.id === id);
    if (c) {
      c.assignedTo = employeeName;
      c.assignedToRole = role;
      c.status = "Assigned";
      c.history.push({ stage: "Assigned", timestamp: new Date().toLocaleString(), note: `Assigned to ${employeeName} (${role}).`, by: "Rahul Patil (Engineer)", completed: true });
    }
    return Promise.resolve(c || null);
  },

  escalateComplaint: async (id: string, reason: string): Promise<EmpComplaint | null> => {
    const c = complaints.find((x) => x.id === id);
    if (c) {
      c.status = "Escalated";
      if (c.escalationLevel === "Clerk") c.escalationLevel = "Engineer";
      else if (c.escalationLevel === "Engineer") c.escalationLevel = "Chief Officer";
      c.history.push({ stage: "Escalated", timestamp: new Date().toLocaleString(), note: reason, by: "Rahul Patil (Engineer)", completed: true });
    }
    return Promise.resolve(c || null);
  },

  resolveComplaint: async (id: string, note: string): Promise<EmpComplaint | null> => {
    const c = complaints.find((x) => x.id === id);
    if (c) {
      c.status = "Resolved";
      c.history.push({ stage: "Resolved", timestamp: new Date().toLocaleString(), note, by: "Rahul Patil (Engineer)", completed: true });
    }
    return Promise.resolve(c || null);
  },

  // ── Tasks ──
  getTasks: async (employeeId?: string): Promise<EmployeeTask[]> => {
    return Promise.resolve([...tasks]);
  },

  getTaskById: async (id: string): Promise<EmployeeTask | null> => {
    return Promise.resolve(tasks.find((t) => t.id === id) || null);
  },

  updateTaskStatus: async (id: string, status: TaskStatus): Promise<EmployeeTask | null> => {
    const t = tasks.find((x) => x.id === id);
    if (t) {
      t.status = status;
      // Keep complaint status in sync
      const cmp = complaints.find((c) => c.complaintNumber === t.complaintNumber);
      if (cmp && status === "In Progress") cmp.status = "In Progress";
      if (cmp && status === "Completed") cmp.status = "Resolved";
    }
    return Promise.resolve(t || null);
  },

  // ── Applications ──
  getApplications: async (statusFilter?: string): Promise<ServiceApplication[]> => {
    if (!statusFilter || statusFilter === "All Statuses") return Promise.resolve([...applications]);
    return Promise.resolve(applications.filter((a) => a.status === statusFilter));
  },

  getApplicationById: async (id: string): Promise<ServiceApplication | null> => {
    return Promise.resolve(applications.find((a) => a.id === id || a.applicationNumber === id) || null);
  },

  reviewApplication: async (id: string, action: "Approved" | "Rejected" | "Request Correction", comments: string): Promise<ServiceApplication | null> => {
    const app = applications.find((a) => a.id === id);
    if (app) {
      app.status = action === "Approved" ? "Approved" : action === "Rejected" ? "Rejected" : "Clerk Review";
      app.engineerComments = comments;
      app.history.push({ stage: action, timestamp: new Date().toLocaleString(), note: comments, by: "Rahul Patil (Engineer)", completed: true });
    }
    return Promise.resolve(app || null);
  },

  // ── Schedules ──
  getSchedules: async (): Promise<WaterSchedule[]> => Promise.resolve([...schedules]),

  getScheduleByWard: async (ward: string): Promise<WaterSchedule | null> => {
    return Promise.resolve(schedules.find((s) => s.ward === ward) || null);
  },

  updateSchedule: async (
    id: string,
    updates: Partial<Pick<WaterSchedule, "startTime" | "endTime" | "durationMinutes" | "status" | "date">>,
    reason?: string,
    updatedBy?: string
  ): Promise<WaterSchedule | null> => {
    const s = schedules.find((x) => x.id === id);
    if (s) {
      Object.assign(s, updates);
      if (reason) s.rescheduleReason = reason;
      s.updatedBy = updatedBy || "Rahul Patil (Engineer)";
      s.updatedAt = new Date().toLocaleString();
      // Create a notification
      empNotifications.unshift({
        id: `en-sched-${Date.now()}`,
        title: `Schedule Updated – ${s.ward}`,
        message: `Water schedule for ${s.ward} updated to ${s.startTime} – ${s.endTime}. Reason: ${reason || "Updated by engineer."}`,
        date: "Just now",
        type: "schedule",
        read: false,
        linkType: "schedule",
        linkId: id,
      });
    }
    return Promise.resolve(s || null);
  },

  getAllWards: (): string[] => WARDS,

  // ── Consumers ──
  getConsumers: async (search?: string, ward?: string): Promise<Consumer[]> => {
    let result = [...consumers];
    if (ward && ward !== "All") result = result.filter((c) => c.ward === ward);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.consumerNumber.toLowerCase().includes(q) ||
          c.area.toLowerCase().includes(q)
      );
    }
    return Promise.resolve(result);
  },

  getConsumerById: async (id: string): Promise<Consumer | null> => {
    return Promise.resolve(consumers.find((c) => c.id === id || c.consumerNumber === id) || null);
  },

  // ── Notifications ──
  getEmpNotifications: async (): Promise<EmployeeNotification[]> => Promise.resolve([...empNotifications]),

  getEmpUnreadCount: async (): Promise<number> => Promise.resolve(empNotifications.filter((n) => !n.read).length),

  markEmpNotificationRead: async (id: string): Promise<void> => {
    const n = empNotifications.find((x) => x.id === id);
    if (n) n.read = true;
  },

  markAllEmpNotificationsRead: async (): Promise<void> => {
    empNotifications.forEach((n) => (n.read = true));
  },
};
