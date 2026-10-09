export const DEFAULT_REMINDER_TIME = "19:00";

export type ReminderTime = {
  hour: number;
  minute: number;
};

const PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isValidReminderTime(value: string): boolean {
  return PATTERN.test(value);
}

export function parseReminderTime(value: string | null): ReminderTime {
  const source = value !== null && isValidReminderTime(value) ? value : DEFAULT_REMINDER_TIME;
  const [hour, minute] = source.split(":");
  return { hour: Number(hour), minute: Number(minute) };
}

export function toReminderTime({ hour, minute }: ReminderTime): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatReminderTime(value: string | null): string {
  const { hour, minute } = parseReminderTime(value);
  const period = hour < 12 ? "AM" : "PM";
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${String(minute).padStart(2, "0")} ${period}`;
}

export function fromTwelveHour(twelve: number, minute: number, period: "AM" | "PM"): ReminderTime {
  const base = twelve % 12;
  return { hour: period === "AM" ? base : base + 12, minute };
}

export function toTwelveHour({ hour, minute }: ReminderTime): {
  twelve: number;
  minute: number;
  period: "AM" | "PM";
} {
  return {
    twelve: hour % 12 === 0 ? 12 : hour % 12,
    minute,
    period: hour < 12 ? "AM" : "PM",
  };
}

export function reminderAction(enabled: boolean, permissionGranted: boolean): "schedule" | "cancel" {
  return enabled && permissionGranted ? "schedule" : "cancel";
}

/** How many days ahead the reminder is scheduled, so the chain survives a
 *  stretch without the app being opened. iOS caps pending requests at 64. */
export const REMINDER_HORIZON_DAYS = 7;

/**
 * The local moments the reminder should next arrive at.
 *
 * Today is dropped when the person has already recorded the day or its time
 * has passed; later days are always offered, because whether they are still
 * eligible is only knowable on the day and reconciliation re-runs then.
 */
export function reminderOccurrences(
  time: string,
  now: Date,
  recordedToday: boolean,
  days: number = REMINDER_HORIZON_DAYS,
): Date[] {
  if (days <= 0) return [];
  const { hour, minute } = parseReminderTime(time);
  const occurrences: Date[] = [];

  for (let offset = 0; occurrences.length < days; offset += 1) {
    const at = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + offset,
      hour,
      minute,
      0,
      0,
    );
    if (offset === 0 && (recordedToday || at.getTime() <= now.getTime())) continue;
    occurrences.push(at);
  }

  return occurrences;
}
