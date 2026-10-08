import { appStorage } from "@/utils/storage";

/** `erase` = the person's own data. `preserve` = a UI preference that says nothing about them. */
export type ErasurePolicy = "erase" | "preserve";

/**
 * Every @heedly/ key in appStorage and what "Delete all my data" does with it.
 * Key constants are typed `StorageKey`, so a key missing here is a type error
 * at its use site.
 */
export const STORAGE_KEY_POLICY = {
  "@heedly/checkin_draft": "erase",
  "@heedly/checkin_history": "erase",
  "@heedly/last_checkin_date": "erase",
  "@heedly/first_name": "erase",
  "@heedly/onboarding_complete": "erase",
  "@heedly/start_date": "erase",
  "@heedly/heads_up_enabled": "erase",
  "@heedly/daily_reminder_enabled": "erase",
  "@heedly/daily_reminder_time": "erase",
  "@heedly/theme_mode": "preserve",
  "@heedly/is_true_black": "preserve",
} as const satisfies Record<`@heedly/${string}`, ErasurePolicy>;

export type StorageKey = keyof typeof STORAGE_KEY_POLICY;

/** Set on finishing onboarding; its absence sends the app back through it. */
export const ONBOARDING_COMPLETE_KEY: StorageKey = "@heedly/onboarding_complete";

/**
 * When this person started using Heedly, ISO-8601, written once at the end of
 * onboarding. Personal, so it is erased with everything else — a surviving
 * start date would report a history the erase promised to forget.
 *
 * Nothing else can stand in for it: the first check-in can be days later, and
 * every HealthKit timestamp describes the data rather than the person. An
 * install from before this key existed has no recoverable date and shows none.
 */
export const START_DATE_KEY: StorageKey = "@heedly/start_date";

/** Whether the person wants a heads-up before harder days. Absent = never asked. */
export const HEADS_UP_KEY: StorageKey = "@heedly/heads_up_enabled";

/** Whether the person wants a daily check-in reminder. Absent = off. */
export const DAILY_REMINDER_KEY: StorageKey = "@heedly/daily_reminder_enabled";

/** Local wall-clock "HH:mm" the reminder fires at. Absent = 09:00. */
export const DAILY_REMINDER_TIME_KEY: StorageKey = "@heedly/daily_reminder_time";

const ERASABLE_KEYS = (Object.keys(STORAGE_KEY_POLICY) as StorageKey[]).filter(
  (key) => STORAGE_KEY_POLICY[key] === "erase",
);

/**
 * Removes every key marked `erase`. Errors propagate: the screen tells the
 * person their data is gone, so a failure has to reach them.
 */
export async function clearErasableStorage(): Promise<void> {
  await Promise.all(ERASABLE_KEYS.map((key) => appStorage.removeItem(key)));
}
