export const DEFAULT_REMINDER_TIME = "09:00";

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
