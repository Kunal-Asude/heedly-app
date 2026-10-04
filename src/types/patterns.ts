import type { SymbolViewProps } from "expo-symbols";

/** `none` = no reading for that day. Never a health state, and deliberately
 *  not omitted: without it a dayless day falls through to "rest". */
export type DayPatternType = "steady" | "caution" | "rest" | "none";

export interface DayPattern {
  day: string;
  type: DayPatternType;
  size: number;
  color: string;
}

export interface PatternCardData {
  id: string;
  icon: SymbolViewProps["name"];
  badgeColor: string;
  bodyText: string;
  subtitleText: string;
}

export interface PatternsData {
  learningSinceText: string;
  subtitleLeftText: string;
  tankTooltipTitle: string;
  tankTooltipBody: string;
  thisWeekDays: DayPattern[];
  helpPatterns: PatternCardData[];
  costPatterns: PatternCardData[];
}
