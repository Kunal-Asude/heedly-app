import { useCallback, useState } from "react";

// import { MOCK_PATTERNS_DATA } from "@/data/mock";
//   ^ No longer read. Patterns now shows only what can be derived from the
//     person's own data; the mock stays in the tree for the shapes it
//     documents, and for when the pattern engine can fill them.
import HeedlyNative from "@heedly/native";
import type { PatternsSummary } from "@heedly/native";

import { patternCards } from "@/copy/patterns";
import { energyDot, weekDays } from "@/copy/weekDots";
import { formatDateString } from "@/services/checkinStorage";
import type { DayPattern, PatternsData } from "@/types/patterns";
import { appStorage } from "@/utils/storage";
import { START_DATE_KEY } from "@/utils/storageKeys";

import { useTagCatalogue } from "./useTagCatalogue";

/**
 * Patterns, showing only what can actually be derived.
 *
 * The week strip is reported check-in energy, read a day at a time. A day with
 * no check-in stays empty rather than borrowing a neighbour's value.
 */

/** Seven empty dots, so the row holds its shape before the reads land. */
function blankWeek(today: Date): DayPattern[] {
  return weekDays(today).map(({ date, day }) => ({
    day,
    date: formatDateString(date),
    ...energyDot(null),
  }));
}

/** A read failure is not an absent check-in, but it cannot be drawn either. */
async function readWeek(today: Date): Promise<DayPattern[]> {
  return Promise.all(
    weekDays(today).map(async ({ date, day }) => {
      const iso = formatDateString(date);
      let energy: number | null = null;
      try {
        energy = (await HeedlyNative.getCheckIn(iso))?.energyLevel ?? null;
      } catch {
        energy = null;
      }
      return { day, date: iso, ...energyDot(energy) };
    }),
  );
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
  const [week, setWeek] = useState<DayPattern[]>(() => blankWeek(new Date()));
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    let stored: string | null = null;
    try {
      stored = await appStorage.getItem(START_DATE_KEY);
    } catch {
      stored = null;
    }

    setTrackingSince(stored ? formatStartDate(stored) : "");

    const startDate = stored ? formatDateString(new Date(stored)) : null;

    try {
      setSummary(await HeedlyNative.getPatterns(startDate));
    } catch {
      setSummary(null);
    }

    setWeek(await readWeek(new Date()));
    setIsLoaded(true);
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
    thisWeekDays: week,
    helpPatterns: patternCards(helps, tags),
    costPatterns: patternCards(costs, tags),
  };

  return {
    patterns: data,
    isLoaded,
    refresh,
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
