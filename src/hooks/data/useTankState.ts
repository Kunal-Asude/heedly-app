import { useCallback, useEffect, useState } from "react";

import HeedlyNative from "@heedly/native";
import type { EnergyOrbState } from "@/components/core";

/**
 * The tank, read from the native engine. Nothing is computed here.
 *
 * ⚠️ Provisional: the autonomic reading window and exertion-class tags are
 * still pending client confirmation, so this band is an integration result
 * rather than the final Tank behaviour.
 */

type TankBand = "good_reserves" | "half_tank" | "nearly_empty";
type TankDirection = "building" | "holding" | "draining";
type DataState = "ready" | "thin_data" | "no_data";

/** The tank's vocabulary is the product's; the orb has its own (§6.1). */
const ORB_STATE: Record<TankBand, EnergyOrbState> = {
  good_reserves: "steady",
  half_tank: "caution",
  nearly_empty: "rest",
};

export function useTankState() {
  const [band, setBand] = useState<TankBand | null>(null);
  const [direction, setDirection] = useState<TankDirection | null>(null);
  const [dataState, setDataState] = useState<DataState>("no_data");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const state = await HeedlyNative.getTankState();
      setDataState(state.dataState);
      setBand(state.band);
      setDirection(state.direction);
      setUpdatedAt(state.updatedAt);
    } catch {
      // A read failure is not an empty tank; keep the screen on existing copy.
      setDataState("no_data");
      setBand(null);
      setDirection(null);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // The chain is inline rather than `void refresh()` so the writes sit inside a
  // callback: react-hooks/set-state-in-effect rejects the direct call.
  useEffect(() => {
    let isMounted = true;

    HeedlyNative.getTankState().then(
      (state) => {
        if (!isMounted) return;
        setDataState(state.dataState);
        setBand(state.band);
        setDirection(state.direction);
        setUpdatedAt(state.updatedAt);
        setIsLoaded(true);
      },
      () => {
        // Defaults already read as no data; only the gate needs opening.
        if (isMounted) setIsLoaded(true);
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  // Native tells us when a recompute has been written; we re-read then. No
  // timers: the event is the signal, and it only fires after a successful
  // persist.
  useEffect(() => {
    const subscription = HeedlyNative.addListener("onTankUpdated", () => {
      void refresh();
    });

    return () => subscription.remove();
  }, [refresh]);

  return {
    dataState,
    band,
    direction,
    updatedAt,
    isLoaded,
    /** Null until there is a real band — never a default visual state. */
    orbState: band ? ORB_STATE[band] : null,
    refresh,
  };
}
