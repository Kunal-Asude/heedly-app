import assert from "node:assert/strict";

import type { Pattern } from "@heedly/native";

import { patternCards, type PatternCard, type TagInfo } from "./patterns";

const TAGS = new Map<string, TagInfo>([
  ["nap_rested", { label: "nap/rested", category: "other" }],
  ["walking", { label: "walking", category: "activity" }],
  ["warm_room", { label: "warm room", category: "environment" }],
  ["work", { label: "work", category: "activity" }],
]);

function help(tagId: string, lag: Pattern["lag"] = 1): Pattern {
  return { kind: "helps", tagId, lift: 1.9, lag, n: 11, isEarlyPattern: true };
}

function cost(tagId: string, lag: Pattern["lag"] = 1): Pattern {
  return { kind: "costs", tagId, lift: 2.4, lag, n: 14, isEarlyPattern: false };
}

function isFiller(card: PatternCard): boolean {
  return card.bodyText === "" || card.subtitleText === "";
}

const checks: [string, () => void][] = [];
function test(name: string, body: () => void) {
  checks.push([name, body]);
}

test("no helps renders no cards at all", () => {
  assert.deepEqual(patternCards([], TAGS), []);
});

test("one help renders exactly one card", () => {
  assert.equal(patternCards([help("nap_rested")], TAGS).length, 1);
});

test("two helps render exactly two cards", () => {
  assert.equal(patternCards([help("nap_rested"), help("walking")], TAGS).length, 2);
});

test("three helps render exactly three cards", () => {
  const cards = patternCards(
    [help("nap_rested"), help("walking"), help("warm_room")],
    TAGS,
  );
  assert.equal(cards.length, 3);
});

test("no help section ever contains a filler card", () => {
  for (const count of [0, 1, 2, 3]) {
    const helps = ["nap_rested", "walking", "warm_room"]
      .slice(0, count)
      .map((tagId) => help(tagId));
    const cards = patternCards(helps, TAGS);

    assert.equal(cards.length, count);
    assert.ok(!cards.some(isFiller), `${count} helps produced a filler card`);
  }
});

test("no card is duplicated", () => {
  const cards = patternCards(
    [help("nap_rested"), help("walking"), help("warm_room")],
    TAGS,
  );
  assert.equal(new Set(cards.map((card) => card.id)).size, cards.length);
});

test("the same tag at two lags is two cards, not a duplicate", () => {
  const cards = patternCards([help("nap_rested", 0), help("nap_rested", 2)], TAGS);

  assert.equal(cards.length, 2);
  assert.equal(new Set(cards.map((card) => card.id)).size, 2);
});

test("every card's text comes from its own pattern", () => {
  const cards = patternCards([help("nap_rested"), help("walking")], TAGS);

  for (const card of cards) {
    assert.ok(card.bodyText.length > 0);
    assert.ok(card.subtitleText.length > 0);
    assert.ok(!card.bodyText.includes("undefined"));
  }
  assert.ok(cards[0].bodyText.toLowerCase().includes("nap"));
  assert.ok(cards[1].bodyText.toLowerCase().includes("walking"));
});

test("an unresolved tag is dropped rather than carded", () => {
  assert.equal(patternCards([help("nap_rested"), help("unknown_tag")], TAGS).length, 1);
});

test("nothing here pads or caps what the engine sent", () => {
  const cards = patternCards(
    [help("nap_rested"), help("walking"), help("warm_room"), help("work")],
    TAGS,
  );
  assert.equal(cards.length, 4);
});

test("costs follow the same rule as helps", () => {
  for (const count of [0, 1, 2, 3]) {
    const costs = ["walking", "work", "warm_room"]
      .slice(0, count)
      .map((tagId) => cost(tagId));
    const cards = patternCards(costs, TAGS);

    assert.equal(cards.length, count);
    assert.ok(!cards.some(isFiller), `${count} costs produced a filler card`);
  }
});

test("one cost renders one card, not one plus two blanks", () => {
  const cards = patternCards([cost("walking")], TAGS);

  assert.equal(cards.length, 1);
  assert.ok(!isFiller(cards[0]));
});

test("help qualification is not re-decided here", () => {
  const weak: Pattern = {
    kind: "helps",
    tagId: "nap_rested",
    lift: 1.5,
    lag: 3,
    n: 5,
    isEarlyPattern: true,
  };

  assert.equal(patternCards([weak], TAGS).length, 1);
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

console.log(`${passed}/${checks.length} pattern card checks passed`);
for (const failure of failures) console.log(`FAIL ${failure}`);
if (failures.length > 0) process.exitCode = 1;
