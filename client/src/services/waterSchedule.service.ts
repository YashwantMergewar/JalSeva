export interface WaterScheduleItem {
  id: string;
  wardNumber: number;
  wardName: string;
  areaName: string;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: "Scheduled" | "Ongoing" | "Completed" | "Delayed" | "Cancelled" | "Upcoming";
  pressureLevel?: "Normal" | "High" | "Low";
  isCitizenWard?: boolean;
}

export interface WaterAnnouncement {
  id: string;
  title: string;
  description: string;
  wardAffected?: string;
  severity: "info" | "warning" | "urgent";
  validUntil: string;
  date: string;
}

// 15 Wards for the municipality
export const MUNICIPAL_WARDS = [
  { id: 1, name: "Ward 1 - Old City / Market" },
  { id: 2, name: "Ward 2 - Gandhi Nagar" },
  { id: 3, name: "Ward 3 - Shivaji Chowk" },
  { id: 4, name: "Ward 4 - Sector 12, Phase 2" },
  { id: 5, name: "Ward 5 - Sector 15, Vasant Vihar" },
  { id: 6, name: "Ward 6 - Sector 4, Industrial Area" },
  { id: 7, name: "Ward 7 - Sector 8, Civil Lines" },
  { id: 8, name: "Ward 8 - Ram Nagar" },
  { id: 9, name: "Ward 9 - Subhash Colony" },
  { id: 10, name: "Ward 10 - Tilak Road" },
  { id: 11, name: "Ward 11 - Green Park" },
  { id: 12, name: "Ward 12 - Model Town" },
  { id: 13, name: "Ward 13 - Station Road" },
  { id: 14, name: "Ward 14 - Nehru Nagar" },
  { id: 15, name: "Ward 15 - Bypass Extension" },
];

export const mockAnnouncement: WaterAnnouncement = {
  id: "ann-01",
  title: "Important Announcement",
  description: "Scheduled maintenance on main line. Supply in Sector 4 will be delayed by 2 hours today.",
  wardAffected: "Ward 6 / Sector 4",
  severity: "urgent",
  validUntil: "Today, 6:00 PM",
  date: "Today",
};

export const mockServiceAnnouncement = {
  title: "Service Announcement",
  description: "Scheduled maintenance in Sector 4 on coming Sunday. Water supply may be affected between 10 AM and 2 PM.",
  ward: "Sector 4",
};

export const mockTodaySchedules: WaterScheduleItem[] = [
  {
    id: "sch-01",
    wardNumber: 4,
    wardName: "Ward 4",
    areaName: "Sector 12, Phase 2",
    date: "Today",
    dayOfWeek: "Tuesday",
    startTime: "6:00 AM",
    endTime: "7:00 AM",
    duration: "1 Hour",
    status: "Ongoing",
    pressureLevel: "Normal",
    isCitizenWard: true,
  },
  {
    id: "sch-02",
    wardNumber: 5,
    wardName: "Ward 5",
    areaName: "Sector 15, Vasant Vihar",
    date: "Today",
    dayOfWeek: "Tuesday",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    duration: "1 Hour",
    status: "Upcoming",
    pressureLevel: "Normal",
  },
  {
    id: "sch-03",
    wardNumber: 6,
    wardName: "Ward 6",
    areaName: "Sector 4, Industrial Area",
    date: "Today",
    dayOfWeek: "Tuesday",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    duration: "1 Hour",
    status: "Delayed",
    pressureLevel: "Low",
  },
  {
    id: "sch-04",
    wardNumber: 7,
    wardName: "Ward 7",
    areaName: "Sector 8, Civil Lines",
    date: "Today",
    dayOfWeek: "Tuesday",
    startTime: "6:00 PM",
    endTime: "7:00 PM",
    duration: "1 Hour",
    status: "Scheduled",
    pressureLevel: "Normal",
  },
  {
    id: "sch-05",
    wardNumber: 1,
    wardName: "Ward 1",
    areaName: "Old City Market",
    date: "Today",
    dayOfWeek: "Tuesday",
    startTime: "5:00 AM",
    endTime: "6:00 AM",
    duration: "1 Hour",
    status: "Completed",
    pressureLevel: "Normal",
  },
  {
    id: "sch-06",
    wardNumber: 2,
    wardName: "Ward 2",
    areaName: "Gandhi Nagar",
    date: "Today",
    dayOfWeek: "Tuesday",
    startTime: "7:30 AM",
    endTime: "8:30 AM",
    duration: "1 Hour",
    status: "Completed",
    pressureLevel: "Normal",
  },
  {
    id: "sch-07",
    wardNumber: 8,
    wardName: "Ward 8",
    areaName: "Ram Nagar",
    date: "Today",
    dayOfWeek: "Tuesday",
    startTime: "8:00 PM",
    endTime: "9:00 PM",
    duration: "1 Hour",
    status: "Scheduled",
    pressureLevel: "Normal",
  },
];

export const mockUpcomingSchedules: WaterScheduleItem[] = [
  {
    id: "sch-up-01",
    wardNumber: 4,
    wardName: "Ward 4",
    areaName: "Sector 12, Phase 2",
    date: "Tomorrow",
    dayOfWeek: "Wednesday",
    startTime: "6:00 AM",
    endTime: "7:00 AM",
    duration: "1 Hour",
    status: "Scheduled",
    isCitizenWard: true,
  },
  {
    id: "sch-up-02",
    wardNumber: 5,
    wardName: "Ward 5",
    areaName: "Sector 15, Vasant Vihar",
    date: "Tomorrow",
    dayOfWeek: "Wednesday",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    duration: "1 Hour",
    status: "Scheduled",
  },
  {
    id: "sch-up-03",
    wardNumber: 6,
    wardName: "Ward 6",
    areaName: "Sector 4, Industrial Area",
    date: "Tomorrow",
    dayOfWeek: "Wednesday",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    duration: "1 Hour",
    status: "Scheduled",
  },
  {
    id: "sch-up-04",
    wardNumber: 4,
    wardName: "Ward 4",
    areaName: "Sector 12, Phase 2",
    date: "Thursday",
    dayOfWeek: "Thursday",
    startTime: "6:00 AM",
    endTime: "7:00 AM",
    duration: "1 Hour",
    status: "Scheduled",
    isCitizenWard: true,
  },
];

export const mockWeeklySchedules = [
  { day: "Monday", time: "6:00 AM - 7:00 AM", status: "Completed", date: "Oct 23" },
  { day: "Tuesday", time: "6:00 AM - 7:00 AM", status: "Ongoing", date: "Oct 24" },
  { day: "Wednesday", time: "6:00 AM - 7:00 AM", status: "Scheduled", date: "Oct 25" },
  { day: "Thursday", time: "6:00 AM - 7:00 AM", status: "Scheduled", date: "Oct 26" },
  { day: "Friday", time: "6:00 AM - 7:00 AM", status: "Scheduled", date: "Oct 27" },
  { day: "Saturday", time: "6:00 AM - 7:00 AM", status: "Scheduled", date: "Oct 28" },
  { day: "Sunday (Maint)", time: "8:00 AM - 9:00 AM", status: "Rescheduled", date: "Oct 29" },
];

export const waterScheduleService = {
  getTodaySchedules: async (): Promise<WaterScheduleItem[]> => {
    return Promise.resolve(mockTodaySchedules);
  },
  getCitizenActiveSchedule: async (): Promise<WaterScheduleItem> => {
    return Promise.resolve(mockTodaySchedules[0]);
  },
  getUpcomingSchedules: async (): Promise<WaterScheduleItem[]> => {
    return Promise.resolve(mockUpcomingSchedules);
  },
  getWeeklySchedules: async () => {
    return Promise.resolve(mockWeeklySchedules);
  },
  getAnnouncement: async (): Promise<WaterAnnouncement> => {
    return Promise.resolve(mockAnnouncement);
  },
};
