import assert from "node:assert/strict";

import {
  editableEarlierDate,
  formatDateString,
  getCheckInDate,
  getTodayDateString,
  verdictDateFor,
} from "./checkinDate";

const at = (y: number, m: number, d: number, h = 12, min = 0) => new Date(y, m - 1, d, h, min);

assert.equal(formatDateString(at(2026, 10, 9)), "2026-10-09");
assert.equal(formatDateString(at(2026, 1, 5)), "2026-01-05");
assert.equal(getTodayDateString(at(2026, 10, 9)), "2026-10-09");

// A check-in records the day it is made (Brief §7.3).
assert.equal(getCheckInDate(at(2026, 10, 9)), "2026-10-09");
assert.equal(getCheckInDate(at(2026, 10, 8)), "2026-10-08");
assert.equal(getCheckInDate(at(2026, 10, 9)), getTodayDateString(at(2026, 10, 9)));

// The verdict rates the day before, and is never the check-in's own date (§4.3).
assert.equal(verdictDateFor("2026-10-09"), "2026-10-08");
assert.equal(verdictDateFor("2026-10-01"), "2026-09-30");
assert.notEqual(verdictDateFor(getCheckInDate(at(2026, 10, 9))), getCheckInDate(at(2026, 10, 9)));

assert.equal(editableEarlierDate("2026-10-09"), "2026-10-08");
assert.equal(editableEarlierDate(getCheckInDate(at(2026, 10, 9))), "2026-10-08");

for (let day = 1; day <= 28; day += 1) {
  const checkIn = getCheckInDate(at(2026, 2, day));
  assert.notEqual(editableEarlierDate(checkIn), checkIn);
  assert.notEqual(verdictDateFor(checkIn), checkIn);
}

// Left open across midnight: the day before must not stay authoritative.
const beforeMidnight = at(2026, 10, 8, 23, 59);
const afterMidnight = at(2026, 10, 9, 0, 1);
const stale = getCheckInDate(beforeMidnight);
const refreshed = getCheckInDate(afterMidnight);

assert.equal(stale, "2026-10-08");
assert.equal(refreshed, "2026-10-09");
assert.notEqual(stale, refreshed);
assert.equal(verdictDateFor(refreshed), stale);

// Month, year and leap boundaries.
assert.equal(verdictDateFor(getCheckInDate(at(2026, 3, 1))), "2026-02-28");
assert.equal(verdictDateFor(getCheckInDate(at(2026, 1, 1))), "2025-12-31");
assert.equal(verdictDateFor(getCheckInDate(at(2028, 3, 1))), "2028-02-29");
assert.equal(editableEarlierDate(getCheckInDate(at(2026, 1, 1))), "2025-12-31");

// The calendar day never depends on the hour it is read at.
for (let hour = 0; hour < 24; hour += 1) {
  assert.equal(getCheckInDate(at(2026, 10, 9, hour)), "2026-10-09");
  assert.equal(verdictDateFor(getCheckInDate(at(2026, 10, 9, hour))), "2026-10-08");
}

console.log("checkinDate.spec: all assertions passed");
