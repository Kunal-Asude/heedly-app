import { useCallback, useEffect, useState } from "react";

import HeedlyNative from "@/services/heedlyNative";
import type { ForecastDay } from "@heedly/native";

import { TODAY_STATUS_COPY, WHY_MODAL_COPY } from "@/copy/today";
import { formatDateString } from "@/services/checkinStorage";
import type { TodayStatusMode } from "@/types/forecast";
import { appStorage } from "@/utils/storage";
import { START_DATE_KEY } from "@/utils/storageKeys";

/** The engine needs the local day, not the stored UTC timestamp. */
async function startDate(): Promise<string | null> {
  try {
    const stored = await appStorage.getItem(START_DATE_KEY);
    return stored ? formatDateString(new Date(stored)) : null;
  } catch {
    return null;
  }
}

/** The forecast, read from the native engine. Nothing is computed here. */
export function useForecast() {
  const [days, setDays] = useState<ForecastDay[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setDays(await HeedlyNative.getForecast(await startDate()));
    } catch {
      // A read failure is not an empty forecast; say nothing rather than guess.
      setDays([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Inline rather than `void refresh()`, as `useTankState` does for the same
  // lint rule.
  useEffect(() => {
    let isMounted = true;

    startDate()
      .then((start) => HeedlyNative.getForecast(start))
      .then(
        (result) => {
          if (!isMounted) return;
          setDays(result);
          setIsLoaded(true);
        },
        () => {
          if (isMounted) setIsLoaded(true);
        },
      );

    return () => {
      isMounted = false;
    };
  }, []);

  const today = days.find((day) => day.horizon === 0) ?? null;

  return { days, today, isLoaded, refresh };
}

/**
 * The screen's non-forecast chrome — CTA label, orb size, early-days notes and
 * the why-modal frame. Static copy, not forecast.
 */
export function useTodayChrome(mode: TodayStatusMode) {
  return {
    statusConfigs: TODAY_STATUS_COPY,
    currentStatusConfig: TODAY_STATUS_COPY[mode],
    whyModalConfigs: WHY_MODAL_COPY,
  };
}
