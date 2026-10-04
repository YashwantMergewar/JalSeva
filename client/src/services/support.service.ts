export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "connection" | "schedule" | "complaint" | "general";
}

export const FAQ_LIST: FaqItem[] = [
  {
    id: "faq-1",
    question: "How do I apply for a new domestic water connection?",
    answer:
      "Go to the Services tab, select 'New Water Connection', and complete the 5-step application with your Aadhaar, property ownership proof, and address details. An inspector will be assigned for site feasibility within 3-5 working days.",
    category: "connection",
  },
  {
    id: "faq-2",
    question: "What should I do if water supply is delayed or low pressure?",
    answer:
      "Check the 'Water Schedule' tab for live ward announcements. If no scheduled maintenance is ongoing, tap 'Report Issue' or submit a complaint under 'Low Pressure' category.",
    category: "schedule",
  },
  {
    id: "faq-3",
    question: "What is the typical turnaround time for resolving a pipeline leak?",
    answer:
      "Municipal maintenance teams are dispatched within 2 to 4 hours of complaint verification by the ward clerk. You can track progress live in the Complaints tab.",
    category: "complaint",
  },
  {
    id: "faq-4",
    question: "How can I request disconnection or change of consumer name?",
    answer:
      "Navigate to the Services tab or 'My Water Connection' screen. Select 'Change in Consumer Name' or 'Disconnection of Consumer Connection' and provide the required supporting information.",
    category: "connection",
  },
];

export const MUNICIPAL_CONTACT_INFO = {
  tollFreeHelpline: "1800-XXX-JAL (Placeholder)",
  controlRoomPhone: "07232-XXXXXX (Municipal Water Control)",
  email: "water.grievance@jalseva.gov.in",
  officeAddress: "Water Works Department, Municipal Council Main Building, Civil Lines",
  workingHours: "Monday to Saturday: 9:00 AM – 6:00 PM (Control room 24/7 for emergencies)",
};
