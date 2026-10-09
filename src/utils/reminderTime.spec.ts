import assert from "node:assert/strict";

import {
  DEFAULT_REMINDER_TIME,
  formatReminderTime,
  fromTwelveHour,
  isValidReminderTime,
  parseReminderTime,
  reminderAction,
  reminderOccurrences,
  REMINDER_HORIZON_DAYS,
  toReminderTime,
  toTwelveHour,
} from "./reminderTime";

assert.equal(DEFAULT_REMINDER_TIME, "19:00");

assert.equal(isValidReminderTime("09:00"), true);
assert.equal(isValidReminderTime("00:00"), true);
assert.equal(isValidReminderTime("23:59"), true);
assert.equal(isValidReminderTime("19:30"), true);
assert.equal(isValidReminderTime("11:15"), true);
assert.equal(isValidReminderTime("9:00"), false);
assert.equal(isValidReminderTime("24:00"), false);
assert.equal(isValidReminderTime("12:60"), false);
assert.equal(isValidReminderTime(""), false);
assert.equal(isValidReminderTime("09:00:00"), false);
assert.equal(isValidReminderTime("2026-10-08T09:00:00Z"), false);

assert.deepEqual(parseReminderTime("09:00"), { hour: 9, minute: 0 });
assert.deepEqual(parseReminderTime("19:30"), { hour: 19, minute: 30 });
assert.deepEqual(parseReminderTime("00:05"), { hour: 0, minute: 5 });
assert.deepEqual(parseReminderTime(null), { hour: 19, minute: 0 });
assert.deepEqual(parseReminderTime("garbage"), { hour: 19, minute: 0 });
assert.deepEqual(parseReminderTime("24:00"), { hour: 19, minute: 0 });

assert.equal(toReminderTime({ hour: 9, minute: 0 }), "09:00");
assert.equal(toReminderTime({ hour: 19, minute: 30 }), "19:30");
assert.equal(toReminderTime({ hour: 0, minute: 0 }), "00:00");
assert.equal(toReminderTime({ hour: 23, minute: 5 }), "23:05");

assert.equal(formatReminderTime("09:00"), "9:00 AM");
assert.equal(formatReminderTime("19:30"), "7:30 PM");
assert.equal(formatReminderTime("00:00"), "12:00 AM");
assert.equal(formatReminderTime("12:00"), "12:00 PM");
assert.equal(formatReminderTime("11:15"), "11:15 AM");
assert.equal(formatReminderTime("23:59"), "11:59 PM");
assert.equal(formatReminderTime(null), "7:00 PM");

assert.deepEqual(fromTwelveHour(9, 0, "AM"), { hour: 9, minute: 0 });
assert.deepEqual(fromTwelveHour(12, 0, "AM"), { hour: 0, minute: 0 });
assert.deepEqual(fromTwelveHour(12, 0, "PM"), { hour: 12, minute: 0 });
assert.deepEqual(fromTwelveHour(7, 30, "PM"), { hour: 19, minute: 30 });
assert.deepEqual(fromTwelveHour(11, 59, "PM"), { hour: 23, minute: 59 });

assert.deepEqual(toTwelveHour({ hour: 9, minute: 0 }), { twelve: 9, minute: 0, period: "AM" });
assert.deepEqual(toTwelveHour({ hour: 0, minute: 0 }), { twelve: 12, minute: 0, period: "AM" });
assert.deepEqual(toTwelveHour({ hour: 12, minute: 0 }), { twelve: 12, minute: 0, period: "PM" });
assert.deepEqual(toTwelveHour({ hour: 19, minute: 30 }), { twelve: 7, minute: 30, period: "PM" });

for (let hour = 0; hour < 24; hour += 1) {
  for (const minute of [0, 5, 15, 30, 45, 59]) {
    const twelve = toTwelveHour({ hour, minute });
    assert.deepEqual(fromTwelveHour(twelve.twelve, twelve.minute, twelve.period), { hour, minute });
    assert.deepEqual(parseReminderTime(toReminderTime({ hour, minute })), { hour, minute });
  }
}

assert.equal(reminderAction(true, true), "schedule");
assert.equal(reminderAction(true, false), "cancel");
assert.equal(reminderAction(false, true), "cancel");
assert.equal(reminderAction(false, false), "cancel");

// ── Default time ────────────────────────────────────────────────────────────

assert.equal(DEFAULT_REMINDER_TIME, "19:00");
assert.equal(parseReminderTime(null).hour, 19);
assert.equal(parseReminderTime(null).minute, 0);

// A stored time is the person's, whatever the default becomes.
assert.equal(parseReminderTime("09:00").hour, 9);
assert.equal(parseReminderTime("21:30").hour, 21);
assert.equal(parseReminderTime("21:30").minute, 30);
// Only an unreadable value falls back.
assert.equal(parseReminderTime("25:00").hour, 19);

// ── Which days the reminder is offered on ───────────────────────────────────

const at = (y: number, m: number, d: number, h: number, min = 0) =>
  new Date(y, m - 1, d, h, min, 0, 0);

const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;

// Nothing recorded and the hour still ahead: today is offered first.
const eligible = reminderOccurrences("19:00", at(2026, 10, 9, 10), false);
assert.equal(iso(eligible[0]), "2026-10-09 19:00");
assert.equal(eligible.length, REMINDER_HORIZON_DAYS);

// Recorded today: today is skipped, tomorrow leads, and the chain continues.
const recorded = reminderOccurrences("19:00", at(2026, 10, 9, 10), true);
assert.equal(iso(recorded[0]), "2026-10-10 19:00");
assert.equal(iso(recorded[1]), "2026-10-11 19:00");
assert.equal(recorded.length, REMINDER_HORIZON_DAYS);

// The hour has passed, so today is behind us whether or not anything was logged.
assert.equal(iso(reminderOccurrences("19:00", at(2026, 10, 9, 21), false)[0]), "2026-10-10 19:00");
// Exactly on the minute counts as passed rather than firing immediately.
assert.equal(iso(reminderOccurrences("19:00", at(2026, 10, 9, 19), false)[0]), "2026-10-10 19:00");

// A suppressed day never removes the days after it.
assert.notEqual(reminderOccurrences("19:00", at(2026, 10, 9, 10), true).length, 0);

// The person's own time is the one scheduled.
assert.equal(iso(reminderOccurrences("21:30", at(2026, 10, 9, 10), false)[0]), "2026-10-09 21:30");
assert.equal(iso(reminderOccurrences("09:00", at(2026, 10, 9, 8), false)[0]), "2026-10-09 09:00");

// Month and year boundaries stay real dates.
assert.equal(iso(reminderOccurrences("19:00", at(2026, 10, 31, 21), false)[0]), "2026-11-01 19:00");
assert.equal(iso(reminderOccurrences("19:00", at(2026, 12, 31, 21), false)[0]), "2027-01-01 19:00");

// Each occurrence is a separate, strictly later day — no duplicates.
const ordered = reminderOccurrences("19:00", at(2026, 10, 9, 10), false);
for (let i = 1; i < ordered.length; i += 1) {
  assert.equal(ordered[i].getTime() > ordered[i - 1].getTime(), true);
}
assert.equal(new Set(ordered.map((d) => d.getTime())).size, ordered.length);

// Asking for the same thing twice gives the same answer.
assert.deepEqual(
  reminderOccurrences("19:00", at(2026, 10, 9, 10), false).map(iso),
  reminderOccurrences("19:00", at(2026, 10, 9, 10), false).map(iso),
);

assert.deepEqual(reminderOccurrences("19:00", at(2026, 10, 9, 10), false, 0), []);

console.log("reminderTime.spec: all assertions passed");
