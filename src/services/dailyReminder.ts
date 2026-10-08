import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { hasNotificationPermission } from "@/services/notifications";
import { appStorage } from "@/utils/storage";
import {
  DEFAULT_REMINDER_TIME,
  isValidReminderTime,
  parseReminderTime,
  reminderAction,
} from "@/utils/reminderTime";
import { DAILY_REMINDER_KEY, DAILY_REMINDER_TIME_KEY } from "@/utils/storageKeys";

export const DAILY_REMINDER_DEFAULT = false;

export const DAILY_REMINDER_IDENTIFIER = "heedly.checkin.reminder";

const TITLE = "How did yesterday land?";
const BODY = "A gentle check-in whenever you're ready — even lying down.";

export async function readDailyReminderEnabled(): Promise<boolean> {
  try {
    return (await appStorage.getItem(DAILY_REMINDER_KEY)) === "true";
  } catch {
    return DAILY_REMINDER_DEFAULT;
  }
}

export async function readDailyReminderTime(): Promise<string> {
  try {
    const stored = await appStorage.getItem(DAILY_REMINDER_TIME_KEY);
    return stored !== null && isValidReminderTime(stored) ? stored : DEFAULT_REMINDER_TIME;
  } catch {
    return DEFAULT_REMINDER_TIME;
  }
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === "web") return;
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_IDENTIFIER);
  } catch {
    // Nothing scheduled under that identifier.
  }
}

async function scheduleDailyReminder(time: string): Promise<void> {
  if (Platform.OS === "web") return;
  const { hour, minute } = parseReminderTime(time);
  await cancelDailyReminder();
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_IDENTIFIER,
    content: {
      title: TITLE,
      body: BODY,
      sound: true,
      data: { screen: "check-in" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function reconcileDailyReminder(): Promise<"scheduled" | "cancelled"> {
  const enabled = await readDailyReminderEnabled();
  const granted = enabled ? await hasNotificationPermission() : false;

  if (reminderAction(enabled, granted) === "cancel") {
    await cancelDailyReminder();
    return "cancelled";
  }

  try {
    await scheduleDailyReminder(await readDailyReminderTime());
    return "scheduled";
  } catch {
    await cancelDailyReminder();
    return "cancelled";
  }
}

export async function setDailyReminderEnabled(enabled: boolean): Promise<void> {
  try {
    await appStorage.setItem(DAILY_REMINDER_KEY, enabled ? "true" : "false");
  } catch {
    // The schedule below is what actually delivers; a failed write re-reads as off.
  }
  await reconcileDailyReminder();
}

export async function setDailyReminderTime(time: string): Promise<void> {
  if (!isValidReminderTime(time)) return;
  try {
    await appStorage.setItem(DAILY_REMINDER_TIME_KEY, time);
  } catch {
    return;
  }
  await reconcileDailyReminder();
}

export async function scheduledDailyReminderCount(): Promise<number> {
  if (Platform.OS === "web") return 0;
  try {
    const pending = await Notifications.getAllScheduledNotificationsAsync();
    return pending.filter((request) => request.identifier === DAILY_REMINDER_IDENTIFIER).length;
  } catch {
    return 0;
  }
}
