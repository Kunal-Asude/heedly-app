/**
 * Centralized Theme System
 *
 * This module exports all available themes and provides a hook for using the current theme.
 * Themes support Light, Dark, and True Black variants.
 *
 * For now, the system defaults to Light mode.
 * In the future, this can be connected to useColorScheme() from React Native
 * or a custom ThemeContext for full multi-theme support.
 */

import { useColorScheme } from "react-native";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";
import { DesignTokens } from "./tokens";
import { trueBlackTheme } from "./trueBlack";

export type ThemeMode = "light" | "dark" | "trueBlack";

// ─── Theme Registry ──────────────────────────────────────────────────────

const themes: Record<ThemeMode, DesignTokens> = {
  light: lightTheme,
  dark: darkTheme,
  trueBlack: trueBlackTheme,
};

// ─── Hook: Get Current Theme ─────────────────────────────────────────────

/**
 * Get the current theme tokens based on the system color scheme.
 * Currently maps to Light/Dark; True Black would need explicit user selection.
 */
export function useTheme(): DesignTokens {
  const colorScheme = useColorScheme();

  // For now: only Light and Dark
  // True Black will be enabled when the design is finalized
  if (colorScheme === "dark") {
    return themes.dark;
  }

  return themes.light;
}

/**
 * Get a specific theme without relying on system color scheme.
 * Useful for components that need explicit theme control.
 */
export function getTheme(mode: ThemeMode): DesignTokens {
  return themes[mode];
}

// ─── Direct Exports ──────────────────────────────────────────────────────

export { darkTheme } from "./dark";
export { lightTheme } from "./light";
export { DesignTokens } from "./tokens";
export { trueBlackTheme } from "./trueBlack";

