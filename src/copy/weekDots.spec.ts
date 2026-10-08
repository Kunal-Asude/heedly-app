import assert from "node:assert/strict";

import { energyDot, weekDays } from "./weekDots";

const EMPTY = { size: 12, color: "rgba(140, 120, 130, 0.18)" };

function iso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const checks: [string, () => void][] = [
  [
    "energy 1 is the smallest dot, coral",
    () => assert.deepEqual(energyDot(1), { size: 20, color: "#DC6B76" }),
  ],
  [
    "energy 2 is small, orange",
    () => assert.deepEqual(energyDot(2), { size: 24, color: "#E08568" }),
  ],
  [
    "energy 3 is medium, amber",
    () => assert.deepEqual(energyDot(3), { size: 28, color: "#E7B874" }),
  ],
  [
    "energy 4 is large, light green",
    () => assert.deepEqual(energyDot(4), { size: 32, color: "#A5C49F" }),
  ],
  [
    "energy 5 is the largest dot, green",
    () => assert.deepEqual(energyDot(5), { size: 36, color: "#7BA98B" }),
  ],
  ["no check-in is the empty dot", () => assert.deepEqual(energyDot(null), EMPTY)],
  ["a skipped energy answer is the empty dot", () => assert.deepEqual(energyDot(undefined), EMPTY)],
  [
    "an out-of-range level never renders as a reading",
    () => {
      assert.deepEqual(energyDot(0), EMPTY);
      assert.deepEqual(energyDot(6), EMPTY);
    },
  ],
  [
    "size rises strictly with energy",
    () => {
      const sizes = [1, 2, 3, 4, 5].map((level) => energyDot(level).size);
      assert.deepEqual(sizes, [...sizes].sort((a, b) => a - b));
      assert.equal(new Set(sizes).size, 5);
    },
  ],
  [
    "every energy colour is distinct, and none is the empty grey",
    () => {
      const colors = [1, 2, 3, 4, 5].map((level) => energyDot(level).color);
      assert.equal(new Set(colors).size, 5);
      assert.equal(colors.includes(EMPTY.color), false);
    },
  ],
  [
    "the empty dot is smaller than any reading",
    () => {
      const smallest = Math.min(...[1, 2, 3, 4, 5].map((level) => energyDot(level).size));
      assert.equal(EMPTY.size < smallest, true);
    },
  ],
  [
    "mixed levels across seven days keep their own sizes",
    () => {
      const week = [1, null, 5, 3, null, 2, 4].map(energyDot);
      assert.deepEqual(
        week.map((dot) => dot.size),
        [20, 12, 36, 28, 12, 24, 32],
      );
    },
  ],
  [
    "the strip is seven days and ends yesterday",
    () => {
      const days = weekDays(new Date(2026, 9, 6));
      assert.equal(days.length, 7);
      assert.equal(iso(days[6].date), "2026-10-05");
      assert.equal(iso(days[0].date), "2026-09-29");
    },
  ],
  [
    "the dates are consecutive and earliest first",
    () => {
      const days = weekDays(new Date(2026, 9, 6));
      assert.deepEqual(days.map((d) => iso(d.date)), [
        "2026-09-29",
        "2026-09-30",
        "2026-10-01",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-05",
      ]);
    },
  ],
  [
    "the day letters match the real weekdays",
    () => {
      assert.deepEqual(
        weekDays(new Date(2026, 9, 6)).map((d) => d.day),
        ["T", "W", "T", "F", "S", "S", "M"],
      );
    },
  ],
  [
    "a month boundary does not skip or repeat a day",
    () => {
      const days = weekDays(new Date(2026, 10, 3));
      assert.deepEqual(days.map((d) => iso(d.date)), [
        "2026-10-27",
        "2026-10-28",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01",
        "2026-11-02",
      ]);
    },
  ],
  [
    "a leap day is not skipped",
    () => {
      const days = weekDays(new Date(2028, 2, 3));
      assert.equal(days.map((d) => iso(d.date)).includes("2028-02-29"), true);
    },
  ],
];

let passed = 0;
const failures: string[] = [];

for (const [name, check] of checks) {
  try {
    check();
    passed += 1;
  } catch (error) {
    failures.push(`${name}: ${(error as Error).message}`);
  }
}

console.log(`${passed}/${checks.length} week dot checks passed`);
for (const failure of failures) console.log(`FAIL ${failure}`);
if (failures.length > 0) process.exitCode = 1;
