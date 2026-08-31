/**
 * ThemeContext
 *
 * Provides the user-selected theme mode ('light' | 'dark' | 'system') and
 * True Black (OLED) preference app-wide.
 * Screens read the resolved DesignTokens via useAppTheme().
 * The Settings screen writes to it via useThemeMode().
 *
 * Architecture:
 *  - ThemeProvider wraps the entire app in _layout.tsx
 *  - Theme preferences are persisted to AsyncStorage so they survive app restarts and reloads
 *  - useAppTheme() returns the resolved DesignTokens (Light, Dark, or True Black)
 *  - useThemeMode() returns { themeMode, setThemeMode, isTrueBlack, setTrueBlack, isDark, isLoaded }
 *
 * Resolution rule:
 *  - isDark: themeMode === "dark" || (themeMode === "system" && systemScheme === "dark")
 *  - If !isDark -> lightTheme (Dawn)
 *  - If isDark && isTrueBlack -> trueBlackTheme (OLED)
 *  - If isDark && !isTrueBlack -> darkTheme (Dusk)
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import { darkTheme } from "@/constants/themes/dark";
import { lightTheme } from "@/constants/themes/light";
import type { DesignTokens } from "@/constants/themes/tokens";
import { trueBlackTheme } from "@/constants/themes/trueBlack";
import { appStorage } from "@/utils/storage";

export type AppThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "@heedly/theme_mode";
const TRUE_BLACK_STORAGE_KEY = "@heedly/is_true_black";

interface ThemeContextValue {
  themeMode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  isTrueBlack: boolean;
  setTrueBlack: (enabled: boolean) => void;
  resolvedTheme: DesignTokens;
  isDark: boolean;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: "system",
  setThemeMode: () => {},
  isTrueBlack: false,
  setTrueBlack: () => {},
  resolvedTheme: lightTheme,
  isDark: false,
  isLoaded: false,
});

/**
 * Wrap the application root with this provider.
 * Initialises themeMode and isTrueBlack from persisted preferences.
 */
export function AppThemeProvider({
  children,
  initialMode = "system",
  initialTrueBlack = false,
}: {
  children: React.ReactNode;
  initialMode?: AppThemeMode;
  initialTrueBlack?: boolean;
}) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [themeMode, setThemeModeState] = useState<AppThemeMode>(initialMode);
  const [isTrueBlack, setIsTrueBlackState] = useState<boolean>(initialTrueBlack);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preferences on cold start / mount
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      appStorage.getItem(THEME_STORAGE_KEY),
      appStorage.getItem(TRUE_BLACK_STORAGE_KEY),
    ])
      .then(([savedMode, savedTrueBlack]) => {
        if (isMounted) {
          if (
            savedMode &&
            (savedMode === "light" || savedMode === "dark" || savedMode === "system")
          ) {
            setThemeModeState(savedMode as AppThemeMode);
          }
          if (savedTrueBlack !== null && savedTrueBlack !== undefined) {
            setIsTrueBlackState(savedTrueBlack === "true");
          }
        }
      })
      .catch((err) => {
        console.warn("[ThemeContext] Failed to load saved theme mode:", err);
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

  const setThemeMode = useCallback((mode: AppThemeMode) => {
    setThemeModeState(mode);
    appStorage.setItem(THEME_STORAGE_KEY, mode).catch((err) => {
      console.warn("[ThemeContext] Failed to persist theme mode:", err);
    });
  }, []);

  const setTrueBlack = useCallback((enabled: boolean) => {
    setIsTrueBlackState(enabled);
    appStorage.setItem(TRUE_BLACK_STORAGE_KEY, enabled ? "true" : "false").catch((err) => {
      console.warn("[ThemeContext] Failed to persist true black preference:", err);
    });
  }, []);

  // Resolve to actual dark status
  const isDark = useMemo(() => {
    if (themeMode === "dark") return true;
    if (themeMode === "light") return false;
    // system: follow device
    return systemScheme === "dark";
  }, [themeMode, systemScheme]);

  // Three-way resolution: Dawn vs Dusk vs True Black
  const resolvedTheme = useMemo(() => {
    if (!isDark) return lightTheme;
    if (isTrueBlack) return trueBlackTheme;
    return darkTheme;
  }, [isDark, isTrueBlack]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeMode,
      setThemeMode,
      isTrueBlack,
      setTrueBlack,
      resolvedTheme,
      isDark,
      isLoaded,
    }),
    [themeMode, setThemeMode, isTrueBlack, setTrueBlack, resolvedTheme, isDark, isLoaded]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * useAppTheme — returns the resolved DesignTokens for the current theme.
 * Use this instead of the old useTheme() from themes/index.ts.
 */
export function useAppTheme(): DesignTokens {
  return useContext(ThemeContext).resolvedTheme;
}

/**
 * useThemeMode — returns the selected mode, true black setting, and setters.
 * Used by the Settings screen theme selector and layout navigators.
 */
export function useThemeMode(): {
  themeMode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  isTrueBlack: boolean;
  setTrueBlack: (enabled: boolean) => void;
  setIsTrueBlack: (enabled: boolean) => void;
  isDark: boolean;
  isLoaded: boolean;
} {
  const { themeMode, setThemeMode, isTrueBlack, setTrueBlack, isDark, isLoaded } =
    useContext(ThemeContext);
  return {
    themeMode,
    setThemeMode,
    isTrueBlack,
    setTrueBlack,
    setIsTrueBlack: setTrueBlack,
    isDark,
    isLoaded,
  };
}

