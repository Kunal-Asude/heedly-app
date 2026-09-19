import { useEffect, useState } from "react";

// import { MOCK_PATTERNS_DATA } from "@/data/mock";
//   ^ No longer read. Patterns now shows only what can be derived from the
//     person's own data; the mock stays in the tree for the shapes it
//     documents, and for when the pattern engine can fill them.
import type { DayPattern, PatternCardData, PatternsData } from "@/types/patterns";
import { appStorage } from "@/utils/storage";
import { START_DATE_KEY } from "@/utils/storageKeys";

/**
 * Patterns, showing only what can actually be derived today.
 *
 * That is currently one value: when the person started using Heedly. Everything
 * else needs pattern detection, which does not exist — so the cards and dots
 * come back empty rather than filled with examples. The UI keeps them: an empty
 * card is honest, a plausible one is not.
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

const EMPTY_HELP: PatternCardData[] = [
  emptyCard("help-1", "moon.fill"),
  emptyCard("help-2", "clock.fill"),
];

const EMPTY_COST: PatternCardData[] = [
  emptyCard("cost-1", "person.2.fill"),
  emptyCard("cost-2", "bolt.fill"),
  emptyCard("cost-3", "sun.max.fill"),
];

/** "SEPTEMBER 19" — the style already on the screen. */
function formatStartDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date
    .toLocaleDateString(undefined, { month: "long", day: "numeric" })
    .toUpperCase();
}

export function usePatterns() {
  // const [data] = useState<PatternsData>(MOCK_PATTERNS_DATA);
  //   ^ Replaced by the real start date plus empty placeholders below.
  const [trackingSince, setTrackingSince] = useState<string>("");
  // Mirrors NameContext: screens can wait rather than show a blank and then the
  // value a frame later.
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    appStorage
      .getItem(START_DATE_KEY)
      .then((stored) => {
        if (!isMounted) return;
        // Absent on an install predating the key. It stays blank: nothing
        // stored records when someone started, and a first check-in or a
        // HealthKit date answers a different question.
        setTrackingSince(stored ? formatStartDate(stored) : "");
      })
      .catch(() => {
        if (isMounted) setTrackingSince("");
      })
      .finally(() => {
        if (isMounted) setIsLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const data: PatternsData = {
    learningSinceText: trackingSince,
    subtitleLeftText: "A few small things we're\nseeing in your patterns.",
    tankTooltipTitle: "HOW IS THE TANK MEASURED?",
    tankTooltipBody:
      "Your tank is measured against your own recent weeks, not a fixed target — so as your baseline shifts, what a 'full tank' means shifts with it.",
    thisWeekDays: EMPTY_WEEK,
    helpPatterns: EMPTY_HELP,
    costPatterns: EMPTY_COST,
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
  };
}
