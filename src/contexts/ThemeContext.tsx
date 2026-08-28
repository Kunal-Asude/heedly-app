/**
 * ThemeContext
 *
 * Provides the user-selected theme mode ('light' | 'dark' | 'system') app-wide.
 * Screens read the resolved DesignTokens via useAppTheme().
 * The Settings screen writes to it via useThemeMode().
 *
 * Architecture:
 *  - ThemeProvider wraps the entire app in _layout.tsx
 *  - Theme preference is persisted to AsyncStorage so it survives app restarts and reloads
 *  - useAppTheme() returns the resolved DesignTokens (replaces useTheme())
 *  - useThemeMode() returns { themeMode, setThemeMode, isDark, isLoaded } for controls
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
import { appStorage } from "@/utils/storage";

export type AppThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "@heedly/theme_mode";

interface ThemeContextValue {
  themeMode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  resolvedTheme: DesignTokens;
  isDark: boolean;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: "system",
  setThemeMode: () => {},
  resolvedTheme: lightTheme,
  isDark: false,
  isLoaded: false,
});

/**
 * Wrap the application root with this provider.
 * Initialises themeMode from persisted preference.
 */
export function AppThemeProvider({
  children,
  initialMode = "system",
}: {
  children: React.ReactNode;
  initialMode?: AppThemeMode;
}) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [themeMode, setThemeModeState] = useState<AppThemeMode>(initialMode);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on cold start / mount
  useEffect(() => {
    let isMounted = true;
    appStorage
      .getItem(THEME_STORAGE_KEY)
      .then((savedMode) => {
        if (
          isMounted &&
          savedMode &&
          (savedMode === "light" || savedMode === "dark" || savedMode === "system")
        ) {
          setThemeModeState(savedMode as AppThemeMode);
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

  // Resolve to actual light/dark tokens
  const isDark = useMemo(() => {
    if (themeMode === "dark") return true;
    if (themeMode === "light") return false;
    // system: follow device
    return systemScheme === "dark";
  }, [themeMode, systemScheme]);

  const resolvedTheme = useMemo(
    () => (isDark ? darkTheme : lightTheme),
    [isDark]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ themeMode, setThemeMode, resolvedTheme, isDark, isLoaded }),
    [themeMode, setThemeMode, resolvedTheme, isDark, isLoaded]
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
 * useThemeMode — returns the selected mode and a setter.
 * Used by the Settings screen theme selector and layout navigators.
 */
export function useThemeMode(): {
  themeMode: AppThemeMode;
  setThemeMode: (mode: AppThemeMode) => void;
  isDark: boolean;
  isLoaded: boolean;
} {
  const { themeMode, setThemeMode, isDark, isLoaded } = useContext(ThemeContext);
  return { themeMode, setThemeMode, isDark, isLoaded };
}
