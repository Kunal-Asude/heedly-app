import assert from "node:assert/strict";

import type { Confidence, ForecastDay, ForecastState } from "@heedly/native";

import {
  dayLabel,
  evidenceText,
  forecastRow,
  headline,
  isHedged,
  reasonIcon,
  reasonItem,
  reasonSentence,
  stateWord,
  whyText,
} from "./forecast";

/** Run with `npm run copy:check`. Asserts wording, never engine behaviour. */

const REASON_KEYS = [
  "crash",
  "not_enough_recent_data",
  "wearable_data_stale",
  "recent_check_ins_lower",
  "autonomic_dip_plus_recent_load",
  "load_still_in_pipeline",
  "further_out_less_certain",
  "settled_recent_days",
];

function day(over: Partial<ForecastDay> = {}): ForecastDay {
  return {
    targetDate: "2026-10-04",
    horizon: 0,
    dataState: "ready",
    state: "steady",
    confidence: "high",
    reasonKey: "settled_recent_days",
    reasonParams: {},
    n: 40,
    ...over,
  };
}

const checks: [string, () => void][] = [];
function test(name: string, body: () => void) {
  checks.push([name, body]);
}

test("each state keeps the screen's existing word", () => {
  assert.equal(stateWord(day({ state: "steady" })), "Steady");
  assert.equal(stateWord(day({ state: "slowing" })), "Caution");
  assert.equal(stateWord(day({ state: "rest_day" })), "Rest day");
});

test("no state is no word, not a stand-in", () => {
  assert.equal(stateWord(day({ state: null })), null);
});

test("medium and high speak plainly, low and absent hedge", () => {
  assert.equal(isHedged("high"), false);
  assert.equal(isHedged("medium"), false);
  assert.equal(isHedged("low"), true);
  assert.equal(isHedged(null), true);
});

test("high confidence asserts the state", () => {
  assert.deepEqual(headline(day({ state: "rest_day", confidence: "high" })), {
    headline1: "Today is\n",
    headline2: "one for resting.",
  });
});

test("medium confidence also asserts it", () => {
  assert.deepEqual(headline(day({ state: "slowing", confidence: "medium" })), {
    headline1: "Today asks for\na ",
    headline2: "slower pace.",
  });
});

test("low confidence never asserts a rest day", () => {
  const hedged = headline(day({ state: "rest_day", confidence: "low" }));
  assert.deepEqual(hedged, {
    headline1: "Today may be\n",
    headline2: "one for resting.",
  });
});

test("every state hedges differently from how it asserts", () => {
  const states: ForecastState[] = ["steady", "slowing", "rest_day"];
  for (const state of states) {
    const confident = headline(day({ state, confidence: "high" }));
    const hedged = headline(day({ state, confidence: "low" }));
    assert.ok(confident && hedged);
    assert.notDeepEqual(confident, hedged);
  }
});

test("no confidence hedges too", () => {
  assert.deepEqual(headline(day({ state: "rest_day", confidence: null })), {
    headline1: "Today may be\n",
    headline2: "one for resting.",
  });
});

test("the row labels are the screen's own", () => {
  assert.equal(dayLabel(day({ horizon: 0 })), "TODAY");
  assert.equal(dayLabel(day({ horizon: 1 })), "TOMORROW");
  assert.equal(dayLabel(day({ horizon: 2 })), "DAY AFTER");
});

test("only today gets a headline", () => {
  assert.ok(headline(day({ horizon: 0 })));
  assert.equal(headline(day({ horizon: 1 })), null);
  assert.equal(headline(day({ horizon: 2 })), null);
});

test("only today offers a why link", () => {
  assert.equal(whyText(day({ horizon: 0, state: "rest_day" })), "Why a rest day?");
  assert.equal(whyText(day({ horizon: 2, state: "rest_day" })), null);
});

test("a steady day has nothing to explain away", () => {
  assert.equal(whyText(day({ state: "steady" })), null);
  assert.equal(whyText(day({ state: "slowing" })), "Why caution today?");
});

test("a crash names when it was", () => {
  const crash = (days: string) =>
    reasonSentence(day({ reasonKey: "crash", reasonParams: { days } }));

  assert.equal(crash("0"), "You logged a crash today.");
  assert.equal(crash("1"), "You logged a crash yesterday.");
  assert.equal(crash("2"), "You logged a crash two days ago.");
});

test("a crash with no count still reads as a sentence", () => {
  assert.equal(
    reasonSentence(day({ reasonKey: "crash", reasonParams: {} })),
    "You logged a crash recently.",
  );
});

test("every reason key the engine can emit has wording", () => {
  for (const reasonKey of REASON_KEYS) {
    const sentence = reasonSentence(day({ reasonKey, reasonParams: { days: "3" } }));
    assert.ok(sentence, `no wording for ${reasonKey}`);
    assert.ok(sentence!.endsWith("."), `${reasonKey} is not a sentence`);
    assert.ok(!sentence!.includes("_"), `${reasonKey} leaked its id`);
  }
});

test("the eight sentences are all different", () => {
  const sentences = REASON_KEYS.map((reasonKey) =>
    reasonSentence(day({ reasonKey, reasonParams: { days: "3" } })),
  );
  assert.equal(new Set(sentences).size, REASON_KEYS.length);
});

test("staleness counts days, and agrees on the plural", () => {
  const stale = (days: string) =>
    reasonSentence(day({ reasonKey: "wearable_data_stale", reasonParams: { days } }));

  assert.equal(stale("1"), "Your wearable hasn't synced in 1 day.");
  assert.equal(stale("4"), "Your wearable hasn't synced in 4 days.");
});

test("the further-out day says it is less certain", () => {
  assert.equal(
    reasonSentence(day({ horizon: 2, reasonKey: "further_out_less_certain" })),
    "This one is further out, so it's less certain.",
  );
});

test("no reason is no sentence", () => {
  assert.equal(reasonSentence(day({ reasonKey: null })), null);
});

test("an unknown key reads as nothing rather than as an id", () => {
  assert.equal(reasonSentence(day({ reasonKey: "something_new" })), null);
});

test("a malformed day count does not reach the sentence", () => {
  assert.equal(
    reasonSentence(day({ reasonKey: "wearable_data_stale", reasonParams: { days: "x" } })),
    "Your wearable hasn't synced recently.",
  );
});

test("a no-data day produces no wording at all", () => {
  const empty = day({
    dataState: "no_data",
    state: null,
    confidence: null,
    reasonKey: null,
    reasonParams: {},
    n: 0,
  });

  assert.equal(stateWord(empty), null);
  assert.equal(headline(empty), null);
  assert.equal(whyText(empty), null);
  assert.equal(reasonSentence(empty), null);
});

test("thin data still speaks, hedged", () => {
  const thin = day({ dataState: "thin_data", state: "rest_day", confidence: "low" });

  assert.equal(stateWord(thin), "Rest day");
  assert.equal(headline(thin)!.headline1, "Today may be\n");
});

test("three callable days give three row items", () => {
  const row = forecastRow([
    day({ horizon: 0, state: "steady" }),
    day({ horizon: 1, state: "slowing" }),
    day({ horizon: 2, state: "rest_day" }),
  ]);

  assert.deepEqual(row, [
    { dayLabel: "TODAY", value: "Steady" },
    { dayLabel: "TOMORROW", value: "Caution" },
    { dayLabel: "DAY AFTER", value: "Rest day" },
  ]);
});

test("an uncallable day is dropped, not filled in", () => {
  const row = forecastRow([
    day({ horizon: 0, state: "steady" }),
    day({ horizon: 1, state: null }),
    day({ horizon: 2, state: null }),
  ]);

  assert.deepEqual(row, [{ dayLabel: "TODAY", value: "Steady" }]);
});

test("no data gives an empty row rather than placeholders", () => {
  const row = forecastRow([
    day({ horizon: 0, state: null }),
    day({ horizon: 1, state: null }),
    day({ horizon: 2, state: null }),
  ]);

  assert.deepEqual(row, []);
});

test("the same day always reads the same way", () => {
  const fixed = day({
    state: "slowing",
    confidence: "medium",
    reasonKey: "load_still_in_pipeline",
  });

  assert.deepEqual(headline(fixed), headline(fixed));
  assert.equal(reasonSentence(fixed), reasonSentence(fixed));
  assert.deepEqual(forecastRow([fixed]), forecastRow([fixed]));
});

test("nothing internal leaks into any sentence", () => {
  const banned = ["risk", "strain", "z-score", "lift", "baseline", "trigger"];
  const states: ForecastState[] = ["steady", "slowing", "rest_day"];
  const levels: (Confidence | null)[] = ["high", "medium", "low", null];

  for (const state of states) {
    for (const confidence of levels) {
      for (const reasonKey of REASON_KEYS) {
        const subject = day({ state, confidence, reasonKey, reasonParams: { days: "2" } });
        const text = [
          headline(subject)?.headline1,
          headline(subject)?.headline2,
          whyText(subject),
          reasonSentence(subject),
          stateWord(subject),
        ]
          .join(" ")
          .toLowerCase();

        for (const word of banned) {
          assert.ok(!text.includes(word), `"${word}" reached the screen`);
        }
      }
    }
  }
});

/** Only a day count may be a number. A score never reaches the screen. */
test("no number appears except a day count", () => {
  for (const reasonKey of REASON_KEYS) {
    const withCount = reasonSentence(day({ reasonKey, reasonParams: { days: "2" } }));
    const withoutCount = reasonSentence(day({ reasonKey, reasonParams: {} }));

    for (const digit of (withoutCount ?? "").match(/\d+/g) ?? []) {
      assert.fail(`${reasonKey} carries the number ${digit} with no count given`);
    }
    for (const digit of (withCount ?? "").match(/\d+/g) ?? []) {
      assert.equal(digit, "2", `${reasonKey} carries an unexpected number`);
    }
  }
});

test("every reason key the engine can emit has an icon", () => {
  for (const reasonKey of REASON_KEYS) {
    assert.ok(reasonIcon(reasonKey), `no icon for ${reasonKey}`);
  }
});

test("the eight icons are distinguishable", () => {
  const icons = REASON_KEYS.map(reasonIcon);
  assert.equal(new Set(icons).size, REASON_KEYS.length);
});

test("an unknown or absent key has no icon", () => {
  assert.equal(reasonIcon("something_new"), null);
  assert.equal(reasonIcon(null), null);
});

test("the modal item carries the sentence, an icon and the evidence", () => {
  const item = reasonItem(
    day({ reasonKey: "load_still_in_pipeline", reasonParams: {}, n: 24 }),
  );

  assert.ok(item);
  assert.equal(item!.id, "load_still_in_pipeline");
  assert.equal(item!.title, "Recent activity is still working its way through.");
  assert.equal(item!.description, "Based on 24 rated days of your own.");
  assert.ok(item!.icon);
});

test("an unknown key yields no modal item rather than a raw id", () => {
  const item = reasonItem(day({ reasonKey: "something_new" }));
  assert.equal(item, null);
});

test("no reason yields no modal item", () => {
  assert.equal(reasonItem(day({ reasonKey: null })), null);
});

test("every known key yields an item whose title is never an id", () => {
  for (const reasonKey of REASON_KEYS) {
    const item = reasonItem(day({ reasonKey, reasonParams: { days: "2" } }));
    assert.ok(item, `no item for ${reasonKey}`);
    assert.notEqual(item!.title, reasonKey);
    assert.ok(!item!.title.includes("_"));
  }
});

test("the evidence line agrees on the plural and admits zero", () => {
  assert.equal(evidenceText(0), "No rated days behind this yet.");
  assert.equal(evidenceText(1), "Based on 1 rated day of your own.");
  assert.equal(evidenceText(2), "Based on 2 rated days of your own.");
});

let passed = 0;
const failures: string[] = [];

for (const [name, body] of checks) {
  try {
    body();
    passed += 1;
  } catch (error) {
    failures.push(`${name}: ${(error as Error).message}`);
  }
}

console.log(`${passed}/${checks.length} forecast copy checks passed`);
for (const failure of failures) console.log(`FAIL ${failure}`);
if (failures.length > 0) process.exitCode = 1;
