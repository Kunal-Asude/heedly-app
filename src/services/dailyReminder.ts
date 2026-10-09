import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { getCheckInDate } from "@/services/checkinDate";
import HeedlyNative from "@/services/heedlyNative";
import { hasNotificationPermission } from "@/services/notifications";
import { appStorage } from "@/utils/storage";
import {
  DEFAULT_REMINDER_TIME,
  REMINDER_HORIZON_DAYS,
  isValidReminderTime,
  reminderAction,
  reminderOccurrences,
} from "@/utils/reminderTime";
import { DAILY_REMINDER_KEY, DAILY_REMINDER_TIME_KEY } from "@/utils/storageKeys";

export const DAILY_REMINDER_DEFAULT = false;

export const DAILY_REMINDER_IDENTIFIER = "heedly.checkin.reminder";

export const DAILY_REMINDER_TITLE = "A quick check-in?";
export const DAILY_REMINDER_BODY = "Three questions, under a minute.";

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

function occurrenceIdentifier(index: number): string {
  return `${DAILY_REMINDER_IDENTIFIER}.${index}`;
}

export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === "web") return;
  // The bare identifier is the repeating request earlier builds scheduled. It
  // is cancelled too, or an upgraded install keeps delivering the old copy.
  const identifiers = [
    DAILY_REMINDER_IDENTIFIER,
    ...Array.from({ length: REMINDER_HORIZON_DAYS }, (_, index) => occurrenceIdentifier(index)),
  ];
  for (const identifier of identifiers) {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch {
      // Nothing scheduled under that identifier.
    }
  }
}

/** True when today already holds a check-in — a completed one or a crash, which
 *  is the same row with its flag set. A read failure is not an absent day, so
 *  it leaves the reminder alone rather than suppressing it. */
export async function hasRecordForToday(): Promise<boolean> {
  try {
    return (await HeedlyNative.getCheckIn(getCheckInDate())) !== null;
  } catch {
    return false;
  }
}

/** One request per upcoming day rather than a repeating one: a repeating
 *  trigger cannot skip the day the person has already recorded. */
async function scheduleDailyReminder(time: string, recordedToday: boolean): Promise<void> {
  if (Platform.OS === "web") return;
  await cancelDailyReminder();

  const occurrences = reminderOccurrences(time, new Date(), recordedToday);
  for (const [index, at] of occurrences.entries()) {
    await Notifications.scheduleNotificationAsync({
      identifier: occurrenceIdentifier(index),
      content: {
        title: DAILY_REMINDER_TITLE,
        body: DAILY_REMINDER_BODY,
        sound: true,
        data: { screen: "check-in" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: at,
      },
    });
  }
}

export async function reconcileDailyReminder(): Promise<"scheduled" | "cancelled"> {
  const enabled = await readDailyReminderEnabled();
  const granted = enabled ? await hasNotificationPermission() : false;

  if (reminderAction(enabled, granted) === "cancel") {
    await cancelDailyReminder();
    return "cancelled";
  }

  try {
    await scheduleDailyReminder(await readDailyReminderTime(), await hasRecordForToday());
    return "scheduled";
  } catch {
    // Leaves nothing half-scheduled. The preference is untouched, so the next
    // reconciliation can still put it back.
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
    return pending.filter((request) =>
      request.identifier.startsWith(DAILY_REMINDER_IDENTIFIER),
    ).length;
  } catch {
    return 0;
  }
}
