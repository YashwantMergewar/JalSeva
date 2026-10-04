export interface WaterConnectionDetails {
  consumerNumber: string;
  meterNumber: string;
  consumerName: string;
  connectionType: "Domestic" | "Commercial" | "Industrial";
  status: "Active" | "Pending" | "Suspended" | "Disconnection Requested" | "Disconnected";
  address: string;
  area: string;
  ward: string;
  connectionDate: string;
  pipeDiameter: string;
}

export interface ConnectionServiceRequest {
  id: string;
  requestId: string;
  requestType:
    | "Change in Type of Connection"
    | "Change in Connection Status"
    | "Change in Consumer Name"
    | "Disconnection of Consumer Connection"
    | "Water Quality-related request";
  dateSubmitted: string;
  status: "Submitted" | "Under Review" | "Approved" | "Completed" | "Rejected";
  details: string;
}

let activeConnection: WaterConnectionDetails = {
  consumerNumber: "CONS-482910",
  meterNumber: "MTR-894102",
  consumerName: "Rajesh Kumar Sharma",
  connectionType: "Domestic",
  status: "Active",
  address: "House No. 104, Green Avenue",
  area: "Phase 2",
  ward: "Ward 4 - Sector 12",
  connectionDate: "15 Jan 2024",
  pipeDiameter: "15 mm (0.5 inch)",
};

let serviceRequests: ConnectionServiceRequest[] = [
  {
    id: "req-1",
    requestId: "REQ-2026-4102",
    requestType: "Change in Type of Connection",
    dateSubmitted: "Sep 12, 2026",
    status: "Completed",
    details: "Upgraded from 10mm to 15mm domestic line",
  },
];

export const waterConnectionService = {
  getConnectionDetails: async (): Promise<WaterConnectionDetails> => {
    return Promise.resolve({ ...activeConnection });
  },

  getServiceRequests: async (): Promise<ConnectionServiceRequest[]> => {
    return Promise.resolve([...serviceRequests]);
  },

  requestTypeChange: async (newType: "Domestic" | "Commercial" | "Industrial", reason: string) => {
    const newReq: ConnectionServiceRequest = {
      id: `req-${Date.now()}`,
      requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestType: "Change in Type of Connection",
      dateSubmitted: "Today",
      status: "Submitted",
      details: `Change to ${newType}. Reason: ${reason}`,
    };
    serviceRequests.unshift(newReq);
    return newReq;
  },

  requestStatusChange: async (newStatus: "Active" | "Suspended", reason: string) => {
    const newReq: ConnectionServiceRequest = {
      id: `req-${Date.now()}`,
      requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestType: "Change in Connection Status",
      dateSubmitted: "Today",
      status: "Submitted",
      details: `Request to set status to ${newStatus}. Reason: ${reason}`,
    };
    serviceRequests.unshift(newReq);
    return newReq;
  },

  requestNameChange: async (newName: string, reason: string) => {
    const newReq: ConnectionServiceRequest = {
      id: `req-${Date.now()}`,
      requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestType: "Change in Consumer Name",
      dateSubmitted: "Today",
      status: "Submitted",
      details: `New Consumer Name: ${newName}. Reason: ${reason}`,
    };
    serviceRequests.unshift(newReq);
    return newReq;
  },

  requestDisconnection: async (reason: string) => {
    activeConnection.status = "Disconnection Requested";
    const newReq: ConnectionServiceRequest = {
      id: `req-${Date.now()}`,
      requestId: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      requestType: "Disconnection of Consumer Connection",
      dateSubmitted: "Today",
      status: "Submitted",
      details: `Permanent disconnection requested. Reason: ${reason}`,
    };
    serviceRequests.unshift(newReq);
    return newReq;
  },
};
