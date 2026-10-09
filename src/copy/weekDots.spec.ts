import assert from "node:assert/strict";

import { energyDot, weekDays } from "./weekDots";

const EMPTY = { size: 12, color: "rgba(140, 120, 130, 0.18)" };

const STEADY = "#94b094";
const CAUTION = "#f0c59e";
const REST = "#da6d82";

function iso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const checks: [string, () => void][] = [
  [
    "energy 1 is the smallest dot, a rest day",
    () => assert.deepEqual(energyDot(1), { size: 17, color: REST }),
  ],
  [
    "energy 2 is small, still a rest day",
    () => assert.deepEqual(energyDot(2), { size: 21.75, color: REST }),
  ],
  [
    "energy 3 is medium, caution",
    () => assert.deepEqual(energyDot(3), { size: 26.5, color: CAUTION }),
  ],
  [
    "energy 4 is large, steady",
    () => assert.deepEqual(energyDot(4), { size: 31.25, color: STEADY }),
  ],
  [
    "energy 5 is the largest dot, steady",
    () => assert.deepEqual(energyDot(5), { size: 36, color: STEADY }),
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
    "colour carries state, so the five levels read as three, never the empty grey",
    () => {
      const colors = [1, 2, 3, 4, 5].map((level) => energyDot(level).color);
      assert.deepEqual(colors, [REST, REST, CAUTION, STEADY, STEADY]);
      assert.equal(new Set(colors).size, 3);
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
        [17, 12, 36, 26.5, 12, 21.75, 31.25],
      );
    },
  ],
  [
    "the strip is seven days and ends today",
    () => {
      const days = weekDays(new Date(2026, 9, 6));
      assert.equal(days.length, 7);
      assert.equal(iso(days[6].date), "2026-10-06");
      assert.equal(iso(days[0].date), "2026-09-30");
    },
  ],
  [
    "the dates are consecutive and earliest first",
    () => {
      const days = weekDays(new Date(2026, 9, 6));
      assert.deepEqual(days.map((d) => iso(d.date)), [
        "2026-09-30",
        "2026-10-01",
        "2026-10-02",
        "2026-10-03",
        "2026-10-04",
        "2026-10-05",
        "2026-10-06",
      ]);
    },
  ],
  [
    "the day letters match the real weekdays",
    () => {
      assert.deepEqual(
        weekDays(new Date(2026, 9, 6)).map((d) => d.day),
        ["W", "T", "F", "S", "S", "M", "T"],
      );
    },
  ],
  [
    "a month boundary does not skip or repeat a day",
    () => {
      const days = weekDays(new Date(2026, 10, 3));
      assert.deepEqual(days.map((d) => iso(d.date)), [
        "2026-10-28",
        "2026-10-29",
        "2026-10-30",
        "2026-10-31",
        "2026-11-01",
        "2026-11-02",
        "2026-11-03",
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
