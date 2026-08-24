import { useState } from "react";
import { MOCK_FORECAST_DATA } from "@/data/mock";
import type { ForecastData, TodayStatusMode, StatusConfig, WhyModalData } from "@/types/forecast";

export function useForecast(currentMode: TodayStatusMode = "steady") {
  // In the future, this state/fetcher will be backed by a query/API call
  const [data] = useState<ForecastData>(MOCK_FORECAST_DATA);

  const statusConfig: StatusConfig = data.statusConfigs[currentMode];
  const whyModalConfig: WhyModalData | undefined =
    currentMode === "caution" || currentMode === "rest"
      ? data.whyModalConfigs[currentMode]
      : undefined;

  return {
    statusConfigs: data.statusConfigs,
    currentStatusConfig: statusConfig,
    whyModalConfigs: data.whyModalConfigs,
    currentWhyModalConfig: whyModalConfig,
  };
}
