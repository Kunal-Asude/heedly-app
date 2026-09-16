import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { appStorage } from "@/utils/storage";
import type { StorageKey } from "@/utils/storageKeys";

/**
 * The person's first name, if they gave one.
 *
 * Optional throughout. Heedly asks for no account, no email and no password
 * (Brief §7.1), and a name is not an account — it is only there so the app can
 * address someone warmly. Skipping is a product principle, so every consumer
 * must read `firstName` as "may be empty" and fall back to copy that reads
 * naturally without it.
 *
 * Stored with `appStorage` under the same `@heedly/` convention as the theme
 * preferences and the check-in draft. Deliberately **not** in SQLite: the
 * database is the system of record for health data, and a display string is
 * neither health data nor something the engine reads. It never crosses the
 * bridge.
 */
const FIRST_NAME_STORAGE_KEY: StorageKey = "@heedly/first_name";

interface NameContextValue {
  /** Empty string when the person did not give one. Never null, so callers
   *  cannot accidentally render "null" or "undefined". */
  firstName: string;
  setFirstName: (name: string) => void;
  /** Drops the name from memory after an erase. The key itself is removed by
   *  `clearErasableStorage`, so this must not write to storage. */
  clearFirstName: () => void;
  /** False until the stored value has been read. Screens that greet by name
   *  can wait on this to avoid showing the name-free copy for a frame and then
   *  swapping it. */
  isLoaded: boolean;
}

const NameContext = createContext<NameContextValue | undefined>(undefined);

export function NameProvider({ children }: { children: ReactNode }) {
  const [firstName, setFirstNameState] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Read the saved name on cold start, matching ThemeContext's hydration.
  useEffect(() => {
    let isMounted = true;

    appStorage
      .getItem(FIRST_NAME_STORAGE_KEY)
      .then((saved) => {
        if (isMounted && saved) {
          setFirstNameState(saved);
        }
      })
      .catch((err) => {
        console.warn("[NameContext] Failed to load saved first name:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const setFirstName = useCallback((name: string) => {
    // Trimmed once, here, so every consumer gets the same value and no screen
    // has to decide what a name of spaces means.
    const trimmed = name.trim();
    setFirstNameState(trimmed);
    appStorage.setItem(FIRST_NAME_STORAGE_KEY, trimmed).catch((err) => {
      console.warn("[NameContext] Failed to persist first name:", err);
    });
  }, []);

  const clearFirstName = useCallback(() => setFirstNameState(""), []);

  const value = useMemo(
    () => ({ firstName, setFirstName, clearFirstName, isLoaded }),
    [firstName, setFirstName, clearFirstName, isLoaded],
  );

  return <NameContext.Provider value={value}>{children}</NameContext.Provider>;
}

export function useFirstName(): NameContextValue {
  const context = useContext(NameContext);
  if (context === undefined) {
    throw new Error("useFirstName must be used within a NameProvider");
  }
  return context;
}

/**
 * Builds a greeting that reads correctly with or without a name.
 *
 * Centralised because the alternative is each screen doing its own string
 * concatenation, and that is where the stray comma and the double space come
 * from. `greeting("Hello")` → "Hello." or "Hello, Ada."
 */
export function greetingWithName(base: string, firstName: string): string {
  return firstName ? `${base}, ${firstName}.` : `${base}.`;
}
