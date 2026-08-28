/**
 * Centralized Theme System
 *
 * This module exports all available themes and provides a hook for using
 * the current theme.  The canonical theme hook is useTheme(), which now
 * reads from AppThemeContext so the user-selected preference (Light / Dark /
 * System) is respected.
 *
 * Migration guide:
 *  - Old: import { useTheme } from '@/constants/themes'
 *  - New: same import — useTheme() is now context-aware.
 *
 * getTheme(mode) is still available for static/non-reactive usage.
 */

import { useAppTheme } from "@/contexts/ThemeContext";
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

// ─── Hook: Get Current Theme (context-aware) ─────────────────────────────

/**
 * Returns the resolved DesignTokens for the currently active theme.
 * Reads from AppThemeContext — honours the user's Light / Dark / System
 * preference set in Settings.
 */
export function useTheme(): DesignTokens {
  return useAppTheme();
}

/**
 * Get a specific theme without relying on system color scheme.
 * Useful for components that need explicit theme control or pre-rendering.
 */
export function getTheme(mode: ThemeMode): DesignTokens {
  return themes[mode];
}

// ─── Direct Exports ──────────────────────────────────────────────────────

export { darkTheme } from "./dark";
export { lightTheme } from "./light";
export { DesignTokens } from "./tokens";
export { trueBlackTheme } from "./trueBlack";
