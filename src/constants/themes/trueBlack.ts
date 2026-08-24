/**
 * True Black Theme (Placeholder)
 *
 * Structure is ready for the true black theme design values.
 * Placeholder values are included and must be replaced with actual design values.
 * This will be provided by the design team in the next phase.
 *
 * True Black is typically used for OLED/high-contrast displays where pure blacks
 * save energy and provide maximum contrast.
 */

import { DesignTokens } from "./tokens";

export const trueBlackTheme: DesignTokens = {
  // ─── Typography ──────────────────────────────────────────────────────
  typography: {
    editorial: 33,
    title: 30,
    hello: 25,
    cta: 17,
    body: 14.5,
    note: 14,
    label: 13,
    eyebrow: 11,
    eyebrowTracking: 1.8,
  },

  // ─── Border Radii ────────────────────────────────────────────────────
  radii: {
    pill: 999,
    cta: 30,
    card: 22,
    tile: 16,
    input: 12,
  },

  // ─── Colors: Text & Ink ──────────────────────────────────────────────
  ink: {
    display: "#FFFFFF", // PLACEHOLDER: Pure white for true black mode
    body: "#F5F5F5", // PLACEHOLDER
    subtle: "#E8E8E8", // PLACEHOLDER
    dark: "#D0D0D0", // PLACEHOLDER
    soft: "rgba(245, 245, 245, 0.7)", // PLACEHOLDER
    muted: "rgba(245, 245, 245, 0.55)", // PLACEHOLDER
    faint: "rgba(245, 245, 245, 0.38)", // PLACEHOLDER
  },

  // ─── Colors: Semantic (Brand) ────────────────────────────────────────
  coral: {
    primary: "#FF8A6B", // PLACEHOLDER: Vivid coral for true black
    mid: "#FF9A7B", // PLACEHOLDER
    light: "#FFAA8B", // PLACEHOLDER
    terracotta: "#FF7050", // PLACEHOLDER
    terracottaDeep: "#E85A40", // PLACEHOLDER
    terracottaHover: "#FF9A6B", // PLACEHOLDER
  },

  // ─── State Colors ────────────────────────────────────────────────────
  states: {
    steady: {
      color: "#ADDB90", // PLACEHOLDER: Vivid green for true black
      chart: "#BDEB9F", // PLACEHOLDER
      bg: "rgba(173, 219, 144, 0.25)", // PLACEHOLDER
      ring: "rgba(173, 219, 144, 0.3)", // PLACEHOLDER
      ink: "#C5E5A0", // PLACEHOLDER
      label: "Steady",
    },
    caution: {
      color: "#FFD699", // PLACEHOLDER: Vivid orange for true black
      chart: "#FFE5B3", // PLACEHOLDER
      bg: "rgba(255, 214, 153, 0.25)", // PLACEHOLDER
      ring: "rgba(255, 214, 153, 0.3)", // PLACEHOLDER
      label: "Caution",
    },
    rest: {
      color: "#FF9A7B", // PLACEHOLDER: Vivid red for true black
      chart: "#FFB3A0", // PLACEHOLDER
      bg: "rgba(255, 154, 123, 0.25)", // PLACEHOLDER
      ring: "rgba(255, 154, 123, 0.3)", // PLACEHOLDER
      label: "Rest day",
    },
  },

  // ─── Surface Colors ──────────────────────────────────────────────────
  surfaces: {
    card: "#1A1A1A", // PLACEHOLDER: Near-black surface
    cream: "rgba(26, 26, 26, 0.82)", // PLACEHOLDER
    glass: "rgba(255, 255, 255, 0.08)", // PLACEHOLDER
    background: "#000000", // PLACEHOLDER: Pure black background
  },

  // ─── Borders ──────────────────────────────────────────────────────────
  borders: {
    card: "rgba(255, 255, 255, 0.1)", // PLACEHOLDER
    hairline: "rgba(255, 255, 255, 0.06)", // PLACEHOLDER
    glass: "rgba(255, 255, 255, 0.15)", // PLACEHOLDER
    divider: "rgba(255, 255, 255, 0.08)", // PLACEHOLDER
  },

  // ─── Accents & Highlights ────────────────────────────────────────────
  accents: {
    oat: {
      main: "#B89968", // PLACEHOLDER: Adjusted for true black
      bg: "rgba(184, 153, 104, 0.2)", // PLACEHOLDER
      border: "rgba(184, 153, 104, 0.4)", // PLACEHOLDER
    },
  },

  // ─── Shadows ──────────────────────────────────────────────────────────
  shadows: {
    chip: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 9,
      elevation: 2,
    },
    card: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 24,
      elevation: 4,
    },
    cta: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.7,
      shadowRadius: 20,
      elevation: 5,
    },
    bar: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.8,
      shadowRadius: 30,
      elevation: 8,
    },
  },

  // ─── Component-Specific Tokens ──────────────────────────────────────
  components: {
    tabBar: {
      background: "#1A1A1A", // PLACEHOLDER
      border: "rgba(255, 255, 255, 0.15)", // PLACEHOLDER
      selectedPill: "#333333", // PLACEHOLDER
      selectedText: "#FF8A6B", // PLACEHOLDER
      unselectedText: "rgba(245, 245, 245, 0.6)", // PLACEHOLDER
      shadowColor: "#000000", // PLACEHOLDER
    },
    forecastCard: {
      background: "rgba(26, 26, 26, 0.7)", // PLACEHOLDER
      border: "rgba(255, 255, 255, 0.1)", // PLACEHOLDER
      labelColor: "rgba(245, 245, 245, 0.6)", // PLACEHOLDER
      shadowColor: "#000000", // PLACEHOLDER
      divider: "rgba(255, 255, 255, 0.08)", // PLACEHOLDER
    },
    energyOrb: {
      steady: {
        topColor: "#BDEB9F", // PLACEHOLDER
        botColor: "#ADDB90", // PLACEHOLDER
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.5)", // PLACEHOLDER
      },
      caution: {
        topColor: "#FFE5B3", // PLACEHOLDER
        botColor: "#FFD699", // PLACEHOLDER
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.5)", // PLACEHOLDER
      },
      rest: {
        topColor: "#FFB3A0", // PLACEHOLDER
        botColor: "#FF9A7B", // PLACEHOLDER
        alphaTop: 0.22,
        alphaBot: 0.32,
        crestColor: "rgba(255, 255, 255, 0.5)", // PLACEHOLDER
      },
      wearableRead: {
        topColor: "#C5E5A0", // PLACEHOLDER
        botColor: "#87DB6B", // PLACEHOLDER
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.6)", // PLACEHOLDER
      },
      learning: {
        topColor: "#BDEB9F", // PLACEHOLDER
        botColor: "#A8DB80", // PLACEHOLDER
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.5)", // PLACEHOLDER
      },
    },
    background: {
      dawnBase: {
        start: "#0F0F0F", // PLACEHOLDER
        middle: "#0A0A0A", // PLACEHOLDER
        end: "#000000", // PLACEHOLDER
      },
      dawnRadial1: {
        color: "#2A2A2A", // PLACEHOLDER
      },
      dawnRadial2: {
        color: "#1A1A1A", // PLACEHOLDER
      },
      dawnRadial3: {
        color: "#2A2A2A", // PLACEHOLDER
      },
      dawnRadial4: {
        color: "#151515", // PLACEHOLDER
      },
    },
  },
};
