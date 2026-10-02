import type { SymbolViewProps } from "expo-symbols";

import type { Pattern } from "@heedly/native";

const COST_LAG: Record<number, string> = {
  0: "the same day",
  1: "the next day",
  2: "two days later",
  3: "three days later",
};

/** Labels whose head noun is plural, so the verb has to agree. */
const PLURAL_TAGS = new Set([
  "screens",
  "stairs",
  "visitors",
  "bright_lights",
  "crowds",
  "strong_smells",
  "muscle_aches",
  "swollen_glands",
  "low_fluids",
  "missed_meds",
  "errands_shopping",
]);

function sentenceCase(label: string): string {
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function costSentence(subject: string, verb: string, lag: number): string {
  return `${subject} ${verb} to show up in your body ${COST_LAG[lag]}.`;
}

/** "Followed by" cannot mean same-day, so lag 0 says "comes with". */
function helpSentence(subject: string, verb: string, lag: number): string {
  switch (lag) {
    case 0:
      return `${subject} ${verb} to come with a steadier day.`;
    case 1:
      return `${subject} ${verb} to be followed by a steadier day.`;
    default:
      return `${subject} ${verb} to be followed by steadier days ${COST_LAG[lag]}.`;
  }
}

function subtitle(n: number): string {
  return n === 1 ? "Noticed once so far." : `Noticed across ${n} days so far.`;
}

type SymbolName = SymbolViewProps["name"];

const CATEGORY_ICON: Record<string, SymbolName> = {
  activity: "figure.walk",
  mind_mood: "brain",
  environment: "sun.max",
  symptoms: "waveform",
  body_cycle: "calendar",
  other: "tag",
};

export function categoryIcon(category: string | undefined): SymbolName {
  return (category && CATEGORY_ICON[category]) || "tag";
}

export interface PatternCopy {
  bodyText: string;
  subtitleText: string;
}

/** Null for an unresolved tag — a wordless card beats a sentence about an id. */
export function patternCopy(
  pattern: Pattern,
  label: string | undefined,
): PatternCopy | null {
  if (!label) return null;
  if (!(pattern.lag in COST_LAG)) return null;

  const subject = sentenceCase(label);
  const verb = PLURAL_TAGS.has(pattern.tagId) ? "tend" : "tends";

  return {
    bodyText:
      pattern.kind === "costs"
        ? costSentence(subject, verb, pattern.lag)
        : helpSentence(subject, verb, pattern.lag),
    subtitleText: subtitle(pattern.n),
  };
}
