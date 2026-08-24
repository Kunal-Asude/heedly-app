import type { SymbolViewProps } from "expo-symbols";

export type DeviceId =
  | "oura"
  | "apple-watch"
  | "apple-health"
  | "garmin"
  | "whoop"
  | "other";

export interface WearableCard {
  id: DeviceId;
  icon: SymbolViewProps["name"];
  label: string;
  subtitle?: string;
}

export interface UserSettings {
  themeMode: "system" | "light" | "dark";
  isTrueBlack: boolean;
  isReduceMotion: boolean;
  isAiInsights: boolean;
  isCycleNotTypical: boolean;
  isDailyReminder: boolean;
  reminderTime: string;
  isHarderDaysReminder: boolean;
  isWeeklyRecap: boolean;
  connectedWearableName: string;
  connectedWearableStatus: string;
}

export interface UserContextData {
  conditions: string[];
  wearables: WearableCard[];
  settings: UserSettings;
}
