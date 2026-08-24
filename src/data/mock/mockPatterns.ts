import type { DayPattern, PatternCardData, PatternsData } from "@/types/patterns";

const COLORS = {
  steadyGreen: "#85B58E",
  cautionYellow: "#E5B87E",
  restPink: "#DC6B76",
  helpBadge: "#A8C7A5",
  costBadge: "#E08568",
};

export const MOCK_THIS_WEEK_DAYS: DayPattern[] = [
  { day: "M", type: "steady", size: 36, color: COLORS.steadyGreen },
  { day: "T", type: "steady", size: 36, color: COLORS.steadyGreen },
  { day: "W", type: "caution", size: 32, color: COLORS.cautionYellow },
  { day: "T", type: "caution", size: 32, color: COLORS.cautionYellow },
  { day: "F", type: "caution", size: 28, color: COLORS.cautionYellow },
  { day: "S", type: "rest", size: 26, color: COLORS.restPink },
  { day: "S", type: "rest", size: 26, color: COLORS.restPink },
];

export const MOCK_HELP_PATTERNS: PatternCardData[] = [
  {
    id: "help-1",
    icon: "moon.fill",
    badgeColor: COLORS.helpBadge,
    bodyText:
      "Your energy tends to be steadiest on mornings after eight or more hours of sleep.",
    subtitleText: "Based on 38 mornings.",
  },
  {
    id: "help-2",
    icon: "clock.fill",
    badgeColor: COLORS.helpBadge,
    bodyText:
      "On nights you fall asleep before 11pm, your tank tends to start the next day about a quarter fuller.",
    subtitleText: "Across 6 of the last 8 weeks.",
  },
];

export const MOCK_COST_PATTERNS: PatternCardData[] = [
  {
    id: "cost-1",
    icon: "person.2.fill",
    badgeColor: COLORS.costBadge,
    bodyText:
      "Social time tends to show up in your body two days later, not the same evening.",
    subtitleText: "Noticed across 6 of your last 7 social days.",
  },
  {
    id: "cost-2",
    icon: "bolt.fill",
    badgeColor: COLORS.costBadge,
    bodyText:
      "Long screen stretches — work, admin, anything mentally heavy — seem to drain you almost as fast as standing does.",
    subtitleText: "Strongest on days over 4 hours of screen time.",
  },
  {
    id: "cost-3",
    icon: "sun.max.fill",
    badgeColor: COLORS.costBadge,
    bodyText:
      "Even mildly warm rooms above 25°C pull your tank down quickly, especially in the afternoon.",
    subtitleText: "9 hot days noticed so far — a stronger pattern than most.",
  },
];

export const MOCK_PATTERNS_DATA: PatternsData = {
  learningSinceText: "LEARNING SINCE\nMARCH 14",
  subtitleLeftText: "A few small things we're\nlearning about you.",
  tankTooltipTitle: "HOW IS THE TANK MEASURED?",
  tankTooltipBody:
    "Your tank is measured against your own recent weeks, not a fixed target — so as your baseline shifts, what a 'full tank' means shifts with it.",
  thisWeekDays: MOCK_THIS_WEEK_DAYS,
  helpPatterns: MOCK_HELP_PATTERNS,
  costPatterns: MOCK_COST_PATTERNS,
};
