import { useState } from "react";
import { MOCK_CHECKIN_CONFIG } from "@/data/mock";
import type { CheckInConfig } from "@/types/checkin";

export function useCheckInConfig() {
  const [config] = useState<CheckInConfig>(MOCK_CHECKIN_CONFIG);

  return {
    config,
    periodDays: config.periodDays,
    yesterdayOptions: config.yesterdayOptions,
    recurringEnergyLevels: config.recurringEnergyLevels,
    firstTimeEnergyLevels: config.firstTimeEnergyLevels,
    bodyLevels: config.bodyLevels,
    planningDays: config.planningDays,
    planningActivities: config.planningActivities,
    defaultPlanningPrediction: config.defaultPlanningPrediction,
  };
}
