import assert from "node:assert/strict";

import {
  DEFAULT_REMINDER_TIME,
  formatReminderTime,
  fromTwelveHour,
  isValidReminderTime,
  parseReminderTime,
  reminderAction,
  toReminderTime,
  toTwelveHour,
} from "./reminderTime";

assert.equal(DEFAULT_REMINDER_TIME, "09:00");

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
assert.deepEqual(parseReminderTime(null), { hour: 9, minute: 0 });
assert.deepEqual(parseReminderTime("garbage"), { hour: 9, minute: 0 });
assert.deepEqual(parseReminderTime("24:00"), { hour: 9, minute: 0 });

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
assert.equal(formatReminderTime(null), "9:00 AM");

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

console.log("reminderTime.spec: all assertions passed");
