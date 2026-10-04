export interface TimelineStage {
  id: string;
  stageNumber: number;
  title: string;
  description: string;
  status: "completed" | "current" | "pending" | "rejected";
  completedAt?: string;
  remarks?: string;
  inspector?: {
    name: string;
    role: string;
    contact: string;
    avatarUrl?: string;
  };
}

export interface ConnectionApplication {
  id: string;
  applicationNumber: string;
  type: string;
  status: "In Progress" | "Under Review" | "Approved" | "Rejected" | "Cancelled";
  dateSubmitted: string;
  estimatedCompletion: string;
  consumerName: string;
  mobileNumber: string;
  email?: string;
  aadhaarNumber: string;
  address: string;
  ward: string;
  connectionType: "Domestic" | "Commercial" | "Industrial";
  pipeSize: string;
  stages: TimelineStage[];
}

export const initialApplication: ConnectionApplication = {
  id: "app-9921",
  applicationNumber: "APP-9921",
  type: "New Connection",
  status: "In Progress",
  dateSubmitted: "Oct 24, 2026",
  estimatedCompletion: "Nov 10, 2026",
  consumerName: "Rajesh Kumar Sharma",
  mobileNumber: "+91 98765 43210",
  email: "rajesh.sharma@example.com",
  aadhaarNumber: "XXXX XXXX 4821",
  address: "House 104, Sector 12, Phase 2",
  ward: "Ward 4",
  connectionType: "Domestic",
  pipeSize: "0.5 inch (15mm)",
  stages: [
    {
      id: "stage-1",
      stageNumber: 1,
      title: "Application Submitted",
      description: "Your application has been received and logged in our system.",
      status: "completed",
      completedAt: "Oct 24, 2026 • 10:30 AM",
      remarks: "Application verified with Aadhaar e-KYC.",
    },
    {
      id: "stage-2",
      stageNumber: 2,
      title: "Field Visit",
      description: "An inspector is evaluating the site for technical feasibility.",
      status: "current",
      remarks: "Field inspection scheduled for pipeline connection feasibility.",
      inspector: {
        name: "Inspector R. Sharma",
        role: "Field Municipal Surveyor",
        contact: "+91 98765 12340",
      },
    },
    {
      id: "stage-3",
      stageNumber: 3,
      title: "Report Submission",
      description: "Site feasibility report prepared by junior engineer.",
      status: "pending",
    },
    {
      id: "stage-4",
      stageNumber: 4,
      title: "Clerk Review",
      description: "Administrative verification of property tax and registry.",
      status: "pending",
    },
    {
      id: "stage-5",
      stageNumber: 5,
      title: "Engineer Review",
      description: "Water Works Executive Engineer final technical sanction.",
      status: "pending",
    },
    {
      id: "stage-6",
      stageNumber: 6,
      title: "Approved / Rejected",
      description: "Final sanction order and installation meter allotment.",
      status: "pending",
    },
  ],
};

let storedApplications: ConnectionApplication[] = [initialApplication];

export const connectionApplicationService = {
  getApplication: async (id?: string): Promise<ConnectionApplication | null> => {
    if (!id || id === "current" || id === "APP-9921") {
      return storedApplications[0] || initialApplication;
    }
    const found = storedApplications.find(
      (a) => a.id === id || a.applicationNumber === id
    );
    return found || storedApplications[0] || null;
  },

  getAllApplications: async (): Promise<ConnectionApplication[]> => {
    return [...storedApplications];
  },

  cancelApplication: async (id: string): Promise<boolean> => {
    const app = storedApplications.find((a) => a.id === id || a.applicationNumber === id);
    if (app && app.status !== "Approved" && app.status !== "Cancelled") {
      app.status = "Cancelled";
      const currentStage = app.stages.find((s) => s.status === "current");
      if (currentStage) {
        currentStage.status = "rejected";
        currentStage.remarks = "Cancelled by citizen request.";
      }
      return true;
    }
    return false;
  },

  submitNewConnection: async (formData: {
    fullName: string;
    mobile: string;
    email?: string;
    aadhaar: string;
    address: string;
    ward: string;
    pincode: string;
    connectionType: "Domestic" | "Commercial" | "Industrial";
    pipeSize: string;
  }): Promise<ConnectionApplication> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newAppNumber = `APP-${randomSuffix}`;
    const todayStr = "Today";

    const newApp: ConnectionApplication = {
      id: `app-${randomSuffix}`,
      applicationNumber: newAppNumber,
      type: "New Connection",
      status: "In Progress",
      dateSubmitted: todayStr,
      estimatedCompletion: "In 15 Days",
      consumerName: formData.fullName,
      mobileNumber: formData.mobile,
      email: formData.email,
      aadhaarNumber: formData.aadhaar,
      address: `${formData.address}, ${formData.ward}`,
      ward: formData.ward,
      connectionType: formData.connectionType,
      pipeSize: formData.pipeSize,
      stages: [
        {
          id: "stg-1",
          stageNumber: 1,
          title: "Application Submitted",
          description: "Your application has been received and logged in our system.",
          status: "completed",
          completedAt: `${todayStr} • Just now`,
        },
        {
          id: "stg-2",
          stageNumber: 2,
          title: "Field Visit",
          description: "An inspector will be scheduled for technical feasibility check.",
          status: "current",
          inspector: {
            name: "Inspector R. Sharma",
            role: "Field Municipal Surveyor",
            contact: "+91 98765 12340",
          },
        },
        {
          id: "stg-3",
          stageNumber: 3,
          title: "Report Submission",
          description: "Site feasibility report preparation.",
          status: "pending",
        },
        {
          id: "stg-4",
          stageNumber: 4,
          title: "Clerk Review",
          description: "Administrative verification of documents.",
          status: "pending",
        },
        {
          id: "stg-5",
          stageNumber: 5,
          title: "Engineer Review",
          description: "Water Works Executive Engineer technical sanction.",
          status: "pending",
        },
        {
          id: "stg-6",
          stageNumber: 6,
          title: "Approved / Rejected",
          description: "Final connection meter dispatch and line tapping.",
          status: "pending",
        },
      ],
    };

    storedApplications.unshift(newApp);
    return newApp;
  },
};
