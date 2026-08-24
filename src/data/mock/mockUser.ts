import type { UserContextData, UserSettings, WearableCard } from "@/types/user";

export const MOCK_CONDITIONS: string[] = [
  "ME/CFS",
  "Long COVID",
  "POTS",
  "Fibromyalgia",
  "Dysautonomia",
  "MCAS",
  "Something else",
];

export const MOCK_WEARABLES: WearableCard[] = [
  { id: "oura", icon: "circle.circle", label: "Oura" },
  { id: "apple-watch", icon: "applewatch", label: "Apple Watch" },
  {
    id: "apple-health",
    icon: "heart",
    label: "Apple Health",
    subtitle: "Fitbit, Polar,\nWithings & more",
  },
  { id: "garmin", icon: "clock", label: "Garmin" },
  { id: "whoop", icon: "ellipsis.rectangle", label: "Whoop" },
  { id: "other", icon: "waveform.path.ecg", label: "Other" },
];

export const MOCK_USER_SETTINGS: UserSettings = {
  themeMode: "system",
  isTrueBlack: false,
  isReduceMotion: false,
  isAiInsights: true,
  isCycleNotTypical: false,
  isDailyReminder: true,
  reminderTime: "9:00 AM",
  isHarderDaysReminder: true,
  isWeeklyRecap: false,
  connectedWearableName: "Oura Ring",
  connectedWearableStatus: "Connected · syncing in the background",
};

export const MOCK_USER_CONTEXT_DATA: UserContextData = {
  conditions: MOCK_CONDITIONS,
  wearables: MOCK_WEARABLES,
  settings: MOCK_USER_SETTINGS,
};
