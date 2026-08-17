/**
 * Dark Theme (Placeholder)
 *
 * Structure is ready for the dark theme design values.
 * Placeholder values are included and must be replaced with actual design values.
 * This will be provided by the design team in the next phase.
 */

import { DesignTokens } from "./tokens";

export const darkTheme: DesignTokens = {
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
    display: "#E0D5D0", // PLACEHOLDER: Light text for dark mode
    body: "#D4C5BF", // PLACEHOLDER
    subtle: "#C8B5AE", // PLACEHOLDER
    dark: "#A89B94", // PLACEHOLDER
    soft: "rgba(212, 197, 191, 0.7)", // PLACEHOLDER
    muted: "rgba(212, 197, 191, 0.55)", // PLACEHOLDER
    faint: "rgba(212, 197, 191, 0.38)", // PLACEHOLDER
  },

  // ─── Colors: Semantic (Brand) ────────────────────────────────────────
  coral: {
    primary: "#F5845F", // PLACEHOLDER: Brighter for dark backgrounds
    mid: "#F6927A", // PLACEHOLDER
    light: "#F9A885", // PLACEHOLDER
    terracotta: "#D97A4A", // PLACEHOLDER
    terracottaDeep: "#C96940", // PLACEHOLDER
    terracottaHover: "#E5895F", // PLACEHOLDER
  },

  // ─── State Colors ────────────────────────────────────────────────────
  states: {
    steady: {
      color: "#A8D088", // PLACEHOLDER: Brighter for dark background
      chart: "#B8DD98", // PLACEHOLDER
      bg: "rgba(168, 208, 136, 0.25)", // PLACEHOLDER
      ring: "rgba(168, 208, 136, 0.3)", // PLACEHOLDER
      ink: "#B0D080", // PLACEHOLDER
      label: "Steady",
    },
    caution: {
      color: "#F5B870", // PLACEHOLDER: Brighter for dark background
      chart: "#FFC895", // PLACEHOLDER
      bg: "rgba(245, 184, 112, 0.25)", // PLACEHOLDER
      ring: "rgba(245, 184, 112, 0.3)", // PLACEHOLDER
      label: "Caution",
    },
    rest: {
      color: "#F5945F", // PLACEHOLDER: Brighter for dark background
      chart: "#F09099", // PLACEHOLDER
      bg: "rgba(245, 148, 95, 0.25)", // PLACEHOLDER
      ring: "rgba(245, 148, 95, 0.3)", // PLACEHOLDER
      label: "Rest day",
    },
  },

  // ─── Surface Colors ──────────────────────────────────────────────────
  surfaces: {
    card: "#2A2420", // PLACEHOLDER: Dark surface for dark mode
    cream: "rgba(42, 36, 32, 0.82)", // PLACEHOLDER
    glass: "rgba(255, 255, 255, 0.08)", // PLACEHOLDER
    background: "#1A1410", // PLACEHOLDER: Very dark background
  },

  // ─── Borders ──────────────────────────────────────────────────────────
  borders: {
    card: "rgba(255, 255, 255, 0.12)", // PLACEHOLDER
    hairline: "rgba(255, 255, 255, 0.08)", // PLACEHOLDER
    glass: "rgba(255, 255, 255, 0.15)", // PLACEHOLDER
    divider: "rgba(255, 255, 255, 0.08)", // PLACEHOLDER
  },

  // ─── Accents & Highlights ────────────────────────────────────────────
  accents: {
    oat: {
      main: "#A89478", // PLACEHOLDER: Adjusted for dark mode
      bg: "rgba(168, 148, 120, 0.2)", // PLACEHOLDER
      border: "rgba(168, 148, 120, 0.4)", // PLACEHOLDER
    },
  },

  // ─── Shadows ──────────────────────────────────────────────────────────
  shadows: {
    chip: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 9,
      elevation: 2,
    },
    card: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 24,
      elevation: 4,
    },
    cta: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 20,
      elevation: 5,
    },
    bar: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 30,
      elevation: 8,
    },
  },

  // ─── Component-Specific Tokens ──────────────────────────────────────
  components: {
    tabBar: {
      background: "#332A24", // PLACEHOLDER
      border: "rgba(255, 255, 255, 0.15)", // PLACEHOLDER
      selectedPill: "#4A3F38", // PLACEHOLDER
      selectedText: "#F5845F", // PLACEHOLDER
      unselectedText: "rgba(212, 197, 191, 0.6)", // PLACEHOLDER
      shadowColor: "#000000", // PLACEHOLDER
    },
    forecastCard: {
      background: "rgba(42, 36, 32, 0.6)", // PLACEHOLDER
      border: "rgba(255, 255, 255, 0.12)", // PLACEHOLDER
      labelColor: "rgba(212, 197, 191, 0.6)", // PLACEHOLDER
      shadowColor: "#000000", // PLACEHOLDER
      divider: "rgba(255, 255, 255, 0.08)", // PLACEHOLDER
    },
    energyOrb: {
      steady: {
        topColor: "#B8DD98", // PLACEHOLDER
        botColor: "#A8D080", // PLACEHOLDER
        crestColor: "rgba(255, 255, 255, 0.4)", // PLACEHOLDER
      },
      caution: {
        topColor: "#F5C895", // PLACEHOLDER
        botColor: "#EDB87C", // PLACEHOLDER
        crestColor: "rgba(255, 255, 255, 0.4)", // PLACEHOLDER
      },
      rest: {
        topColor: "#F5A285", // PLACEHOLDER
        botColor: "#EB8875", // PLACEHOLDER
        crestColor: "rgba(255, 255, 255, 0.4)", // PLACEHOLDER
      },
      wearableRead: {
        topColor: "#B0C8A8", // PLACEHOLDER
        botColor: "#6EBD7A", // PLACEHOLDER
        crestColor: "rgba(255, 255, 255, 0.5)", // PLACEHOLDER
      },
      learning: {
        topColor: "#B8DD98", // PLACEHOLDER
        botColor: "#9FC585", // PLACEHOLDER
        crestColor: "rgba(255, 255, 255, 0.4)", // PLACEHOLDER
      },
    },
    background: {
      dawnBase: {
        start: "#2A241F", // PLACEHOLDER
        middle: "#261F1A", // PLACEHOLDER
        end: "#1F1815", // PLACEHOLDER
      },
      dawnRadial1: {
        color: "#4A3F38", // PLACEHOLDER
      },
      dawnRadial2: {
        color: "#3A2E28", // PLACEHOLDER
      },
      dawnRadial3: {
        color: "#4A3F38", // PLACEHOLDER
      },
      dawnRadial4: {
        color: "#35281F", // PLACEHOLDER
      },
    },
  },
};
