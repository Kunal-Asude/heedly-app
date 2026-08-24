import "@/global.css";

import { Platform } from "react-native";

// ─── Centralized Design Token System ──────────────────────────────────────
// Import from the new themes system to provide backward compatibility
// while supporting Light, Dark, and True Black themes.
//
// NOTE: For backward compatibility, we export the Light theme tokens here.
// Components should migrate to use the `useTheme()` hook from themes/index.ts
// for full multi-theme support.

import { getTheme, useTheme } from "./themes";
import { lightTheme } from "./themes/light";

export type { DesignTokens, ThemeMode } from "./themes";
export { darkTheme } from "./themes/dark";
export { lightTheme } from "./themes/light";
export { trueBlackTheme } from "./themes/trueBlack";
export { getTheme, useTheme };

// ─── Backward Compatibility Exports (Light Theme as Default) ───────────────

export const INK = lightTheme.ink;
export const CORAL = lightTheme.coral;
export const STATES = lightTheme.states;
export const OAT = lightTheme.accents.oat;
export const SURFACES = lightTheme.surfaces;
export const BORDERS = lightTheme.borders;
export const SHADOWS = lightTheme.shadows;
export const RADII = lightTheme.radii;
export const TYPOGRAPHY = lightTheme.typography;

// ─── Legacy/Compatibility Theme Exports ──────────────────────────────────────

export const Colors = {
  light: {
    text: INK.body,
    background: SURFACES.background,
    backgroundElement: "#F0F0F3",
    backgroundSelected: "#E0E1E6",
    textSecondary: INK.muted,
  },
  dark: {
    text: "#ffffff",
    background: "#000000",
    backgroundElement: "#212225",
    backgroundSelected: "#2E3135",
    textSecondary: "#B0B4BA",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  // Display typography (Comfortaa) - for screen titles, headings, editorial lines
  display: {
    regular: "Comfortaa-Regular",
    medium: "Comfortaa-Medium",
    semiBold: "Comfortaa-SemiBold",
    bold: "Comfortaa-Bold",
  },
  // Wordmark typography (Hanken Grotesk) - lowercase "heedly" brand wordmark only
  wordmark: {
    medium: "HankenGrotesk-Medium",
    semiBold: "HankenGrotesk-SemiBold",
    bold: "HankenGrotesk-Bold",
  },
  // Native system SF Pro stack for body, labels, buttons, tabs, footnotes and UI
  body: Platform.select({
    ios: "System",
    default: "sans-serif",
  }),
  // Platform system fallbacks
  sans: Platform.select({
    ios: "system-ui",
    web: "var(--font-display)",
    default: "normal",
  }),
  serif: Platform.select({
    ios: "ui-serif",
    web: "var(--font-serif)",
    default: "serif",
  }),
  rounded: Platform.select({
    ios: "ui-rounded",
    web: "var(--font-rounded)",
    default: "normal",
  }),
  mono: Platform.select({
    ios: "ui-monospace",
    web: "var(--font-mono)",
    default: "monospace",
  }),
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
