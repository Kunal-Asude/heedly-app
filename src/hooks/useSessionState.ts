import { useState } from "react";

const sessionValues = new Map<string, unknown>();

/**
 * useState whose value outlives the screen for the rest of the app session.
 * Tab screens remount on every visit (see ResetOnBlur in app-tabs), which
 * resets plain useState — use this for choices the person made, not for
 * transient UI like an open dropdown.
 */
// ponytail: memory only, lost when the app restarts. Swap for appStorage once these settings are persisted.
export function useSessionState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() =>
    sessionValues.has(key) ? (sessionValues.get(key) as T) : initial,
  );
  const set = (next: T) => {
    sessionValues.set(key, next);
    setValue(next);
  };
  return [value, set] as const;
}
