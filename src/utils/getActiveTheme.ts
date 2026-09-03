import { Appearance } from "react-native";

import { appStorage } from "@/utils/storage";

/**
 * Resolves the user's active theme without React context.
 * Safe to call from notification services, background tasks, and non-React code.
 *
 * Reads persisted keys written by ThemeContext:
 *   @heedly/theme_mode   — "light" | "dark" | "system"
 *   @heedly/is_true_black — "true" | "false"
 *
 * Resolution:
 *   !isDark                   → "dawn"
 *   isDark && !isTrueBlack    → "dusk"
 *   isDark && isTrueBlack     → "oled"
 */
export type ActiveThemeName = "dawn" | "dusk" | "oled";

export async function getActiveTheme(): Promise<ActiveThemeName> {
  const [mode, trueBlackRaw] = await Promise.all([
    appStorage.getItem("@heedly/theme_mode"),
    appStorage.getItem("@heedly/is_true_black"),
  ]);

  // Resolve isDark: follow the same logic as ThemeContext
  let isDark = false;
  if (mode === "dark") {
    isDark = true;
  } else if (mode === "system" || mode === null) {
    // Fall back to the current system color scheme
    const systemScheme = Appearance.getColorScheme();
    isDark = systemScheme === "dark";
  }

  const isTrueBlack = trueBlackRaw === "true";

  if (isDark && isTrueBlack) return "oled";
  if (isDark) return "dusk";
  return "dawn";
}
