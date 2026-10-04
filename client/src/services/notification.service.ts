export interface CitizenNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "schedule" | "complaint" | "connection" | "announcement";
  read: boolean;
  linkRoute?: string;
}

let storedNotifications: CitizenNotification[] = [
  {
    id: "notif-1",
    title: "Schedule Maintenance Alert",
    message: "Scheduled pipeline maintenance in Sector 4 today. Supply delay of approx 2 hours.",
    date: "10 mins ago",
    type: "schedule",
    read: false,
    linkRoute: "/(citizen)/schedule",
  },
  {
    id: "notif-2",
    title: "Application Field Visit Assigned",
    message: "Inspector R. Sharma has been assigned for technical site survey for Application #APP-9921.",
    date: "2 hours ago",
    type: "connection",
    read: false,
    linkRoute: "/(citizen)/application-tracking",
  },
  {
    id: "notif-3",
    title: "Complaint Status Update",
    message: "Your complaint CMP-2026-1049 (Pipeline Leakage) is currently Work In Progress.",
    date: "Yesterday",
    type: "complaint",
    read: true,
    linkRoute: "/(citizen)/complaint-details",
  },
  {
    id: "notif-4",
    title: "Water Quality Testing Completed",
    message: "Routine turbidity and chlorine tests for Ward 4 cleared within municipal safety standards.",
    date: "3 days ago",
    type: "announcement",
    read: true,
  },
];

export const notificationService = {
  getNotifications: async (): Promise<CitizenNotification[]> => {
    return Promise.resolve([...storedNotifications]);
  },
  getUnreadCount: async (): Promise<number> => {
    return Promise.resolve(storedNotifications.filter((n) => !n.read).length);
  },
  markAsRead: async (id: string): Promise<void> => {
    const item = storedNotifications.find((n) => n.id === id);
    if (item) item.read = true;
  },
  markAllAsRead: async (): Promise<void> => {
    storedNotifications.forEach((n) => (n.read = true));
  },
};
