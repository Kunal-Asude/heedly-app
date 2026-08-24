import { useState } from "react";
import { MOCK_PATTERNS_DATA } from "@/data/mock";
import type { PatternsData } from "@/types/patterns";

export function usePatterns() {
  const [data] = useState<PatternsData>(MOCK_PATTERNS_DATA);

  return {
    patterns: data,
    thisWeekDays: data.thisWeekDays,
    helpPatterns: data.helpPatterns,
    costPatterns: data.costPatterns,
    learningSinceText: data.learningSinceText,
    subtitleLeftText: data.subtitleLeftText,
    tankTooltipTitle: data.tankTooltipTitle,
    tankTooltipBody: data.tankTooltipBody,
  };
}
