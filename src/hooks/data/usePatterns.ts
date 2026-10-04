import { useEffect, useState } from "react";

// import { MOCK_PATTERNS_DATA } from "@/data/mock";
//   ^ No longer read. Patterns now shows only what can be derived from the
//     person's own data; the mock stays in the tree for the shapes it
//     documents, and for when the pattern engine can fill them.
import HeedlyNative from "@heedly/native";
import type { Pattern, PatternsSummary } from "@heedly/native";

import { categoryIcon, patternCopy } from "@/copy/patterns";
import { formatDateString } from "@/services/checkinStorage";
import type { DayPattern, PatternCardData, PatternsData } from "@/types/patterns";
import { appStorage } from "@/utils/storage";
import { START_DATE_KEY } from "@/utils/storageKeys";

import { useTagCatalogue } from "./useTagCatalogue";

/**
 * Patterns, showing only what can actually be derived.
 *
 * Costs and helps are real. The seven-dot week has no source yet, so it stays
 * empty: an empty card is honest, a plausible one is not.
 */

/** Neutral, and never one of the three state colours. */
const NO_DATA_DOT = "rgba(140, 120, 130, 0.18)";

/** Uniform: size encodes energy on this card ("Bigger dot = more energy"), so
 *  varying it with nothing to vary by would be inventing a reading. */
const DOT_SIZE = 36;

const WEEKDAY_LETTERS = ["M", "T", "W", "T", "F", "S", "S"];

const EMPTY_WEEK: DayPattern[] = WEEKDAY_LETTERS.map((day) => ({
  day,
  type: "none",
  size: DOT_SIZE,
  color: NO_DATA_DOT,
}));

/** Keeps the card's shape; only the claims go. */
const emptyCard = (id: string, icon: PatternCardData["icon"]): PatternCardData => ({
  id,
  icon,
  badgeColor: "transparent",
  bodyText: "",
  subtitleText: "",
});

// Unfilled, matching what the screen rendered before the icon map existed.
const EMPTY_HELP: PatternCardData[] = [
  emptyCard("help-1", "moon"),
  emptyCard("help-2", "clock"),
];

const EMPTY_COST: PatternCardData[] = [
  emptyCard("cost-1", "person.2"),
  emptyCard("cost-2", "bolt"),
  emptyCard("cost-3", "sun.max"),
];

const KIND_BADGE: Record<Pattern["kind"], string> = {
  helps: "rgba(126, 155, 106, 0.18)",
  costs: "rgba(224, 115, 95, 0.18)",
};

interface TagInfo {
  label: string;
  category: string;
}

/** Real patterns first, then the section's empty slots. Never fewer than the
 *  design's card count, and never capped when there are more. */
function toCards(
  patterns: Pattern[],
  tags: Map<string, TagInfo>,
  slots: PatternCardData[],
): PatternCardData[] {
  const cards = patterns.flatMap((pattern) => {
    const tag = tags.get(pattern.tagId);
    const copy = patternCopy(pattern, tag?.label);
    if (!copy) return [];

    return [
      {
        id: `${pattern.kind}-${pattern.tagId}-${pattern.lag}`,
        icon: categoryIcon(tag?.category),
        badgeColor: KIND_BADGE[pattern.kind],
        bodyText: copy.bodyText,
        subtitleText: copy.subtitleText,
      },
    ];
  });

  return [...cards, ...slots.slice(cards.length)];
}

/** "SEPTEMBER 19" — the style already on the screen. */
function formatStartDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date
    .toLocaleDateString(undefined, { month: "long", day: "numeric" })
    .toUpperCase();
}

export function usePatterns() {
  const { allTags } = useTagCatalogue();
  const [trackingSince, setTrackingSince] = useState<string>("");
  const [summary, setSummary] = useState<PatternsSummary | null>(null);
  // Mirrors NameContext: screens can wait rather than show a blank and then the
  // value a frame later.
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      let stored: string | null = null;
      try {
        stored = await appStorage.getItem(START_DATE_KEY);
      } catch {
        stored = null;
      }
      if (!isMounted) return;

      // Absent on an install predating the key. It stays blank: nothing stored
      // records when someone started, and a first check-in or a HealthKit date
      // answers a different question.
      setTrackingSince(stored ? formatStartDate(stored) : "");

      // The engine needs the local day, not the stored UTC timestamp.
      const startDate = stored ? formatDateString(new Date(stored)) : null;

      try {
        const result = await HeedlyNative.getPatterns(startDate);
        if (isMounted) setSummary(result);
      } catch {
        // A failed read is not an empty history. Leave it null rather than
        // report "no patterns" for a storage error.
        if (isMounted) setSummary(null);
      }

      if (isMounted) setIsLoaded(true);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const costs = (summary?.patterns ?? []).filter((p) => p.kind === "costs");
  const helps = (summary?.patterns ?? []).filter((p) => p.kind === "helps");

  const tags = new Map(
    allTags.map((tag) => [tag.id, { label: tag.label, category: tag.category }]),
  );

  const data: PatternsData = {
    learningSinceText: trackingSince,
    subtitleLeftText: "A few small things we're\nseeing in your patterns.",
    tankTooltipTitle: "HOW IS THE TANK MEASURED?",
    tankTooltipBody:
      "Your tank is measured against your own recent weeks, not a fixed target — so as your baseline shifts, what a 'full tank' means shifts with it.",
    thisWeekDays: EMPTY_WEEK,
    helpPatterns: toCards(helps, tags, EMPTY_HELP),
    costPatterns: toCards(costs, tags, EMPTY_COST),
  };

  return {
    patterns: data,
    isLoaded,
    thisWeekDays: data.thisWeekDays,
    helpPatterns: data.helpPatterns,
    costPatterns: data.costPatterns,
    learningSinceText: data.learningSinceText,
    subtitleLeftText: data.subtitleLeftText,
    tankTooltipTitle: data.tankTooltipTitle,
    tankTooltipBody: data.tankTooltipBody,
    dataState: summary?.dataState ?? "no_data",
    learningSince: summary?.learningSince ?? null,
    evidenceCount: summary?.n ?? 0,
    costs,
    helps,
  };
}
