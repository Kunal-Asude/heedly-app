import type { SymbolViewProps } from "expo-symbols";

export type DayPatternType = "steady" | "caution" | "rest";

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
