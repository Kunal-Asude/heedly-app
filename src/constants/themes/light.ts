/**
 * Light Theme
 *
 * Uses the current Aubade/Heedly design handoff values as-is.
 * This is the baseline design that must remain visually unchanged.
 */

import { DesignTokens } from "./tokens";

export const lightTheme: DesignTokens = {
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
    display: "#463332",
    body: "#4a3a39",
    subtle: "#4f3c3a",
    dark: "#5a4644",
    soft: "rgba(74, 58, 57, 0.7)",
    muted: "rgba(74, 58, 57, 0.55)",
    faint: "rgba(74, 58, 57, 0.38)",
  },

  // ─── Colors: Semantic (Brand) ────────────────────────────────────────
  coral: {
    primary: "#e0735f",
    mid: "#ea846a",
    light: "#f4a47e",
    terracotta: "#b05334",
    terracottaDeep: "#b0532f",
    terracottaHover: "#c9603f",
  },

  // ─── State Colors ────────────────────────────────────────────────────
  states: {
    steady: {
      color: "#7e9b6a",
      chart: "#94b094",
      bg: "rgba(126, 155, 106, 0.15)",
      ring: "rgba(126, 155, 106, 0.16)",
      ink: "#5d7a52",
      label: "Steady",
    },
    caution: {
      color: "#d99843",
      chart: "#f0c59e",
      bg: "rgba(217, 152, 67, 0.15)",
      ring: "rgba(217, 152, 67, 0.16)",
      label: "Caution",
    },
    rest: {
      color: "#e0735f",
      chart: "#da6d82",
      bg: "rgba(224, 115, 95, 0.13)",
      ring: "rgba(224, 115, 95, 0.16)",
      label: "Rest day",
    },
  },

  // ─── Surface Colors ──────────────────────────────────────────────────
  surfaces: {
    card: "#fffdfa",
    cream: "rgba(255, 252, 248, 0.82)",
    glass: "rgba(255, 255, 255, 0.42)",
    background: "#F5DDD5",
  },

  // ─── Borders ──────────────────────────────────────────────────────────
  borders: {
    card: "rgba(120, 90, 80, 0.16)",
    hairline: "rgba(120, 90, 80, 0.13)",
    glass: "rgba(255, 255, 255, 0.6)",
    divider: "rgba(120, 90, 90, 0.12)",
  },

  // ─── Accents & Highlights ────────────────────────────────────────────
  accents: {
    oat: {
      main: "#cdb488",
      bg: "rgba(233, 215, 188, 0.34)",
      border: "rgba(209, 184, 148, 0.5)",
    },
  },

  // ─── Shadows ──────────────────────────────────────────────────────────
  shadows: {
    chip: {
      shadowColor: "#BE968C",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.07,
      shadowRadius: 9,
      elevation: 2,
    },
    card: {
      shadowColor: "#BE8C8C",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
      elevation: 4,
    },
    cta: {
      shadowColor: "#6E5656",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 20,
      elevation: 5,
    },
    bar: {
      shadowColor: "#B48282",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.22,
      shadowRadius: 30,
      elevation: 8,
    },
  },

  // ─── Component-Specific Tokens ──────────────────────────────────────
  components: {
    tabBar: {
      background: "#ffefe8ff",
      border: "rgba(255, 255, 255, 0.95)",
      selectedPill: "#FFFFFF",
      selectedText: "#AC4E30",
      unselectedText: "rgba(95, 68, 58, 0.65)",
      shadowColor: "#9C7668",
    },
    forecastCard: {
      background: "rgba(248, 236, 225, 0.85)",
      border: "rgba(255, 255, 255, 0.6)",
      labelColor: "rgba(74, 58, 57, 0.55)",
      shadowColor: "#C8A998",
      divider: "rgba(120, 90, 90, 0.12)",
    },
    energyOrb: {
      steady: {
        // STATES[0]: tintTop "142 206 196", tintBot "74 172 184", alpha .20
        topColor: 'rgb(142, 206, 196)',
        botColor: 'rgb(74, 172, 184)',
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: 'rgba(255, 255, 255, 0.40)',
      },
      caution: {
        // STATES[1]: tintTop "250 198 170", tintBot "243 176 142", alpha .20
        topColor: 'rgb(250, 198, 170)',
        botColor: 'rgb(243, 176, 142)',
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: 'rgba(255, 255, 255, 0.40)',
      },
      rest: {
        // STATES[2]: tintTop "224 110 146", tintBot "188 62 104", alpha .22
        topColor: 'rgb(224, 110, 146)',
        botColor: 'rgb(188, 62, 104)',
        alphaTop: 0.22,
        alphaBot: 0.32,
        crestColor: 'rgba(255, 255, 255, 0.40)',
      },
      wearableRead: {
        // Same as steady (first-read uses steady fill appearance)
        topColor: 'rgb(142, 206, 196)',
        botColor: 'rgb(74, 172, 184)',
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: 'rgba(255, 255, 255, 0.40)',
      },
      learning: {
        topColor: 'rgb(142, 206, 196)',
        botColor: 'rgb(74, 172, 184)',
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: 'rgba(255, 255, 255, 0.40)',
      },
    },
    background: {
      dawnBase: {
        start: "#f4e9e1",
        middle: "#f7ded1",
        end: "#f6e2d6",
      },
      dawnRadial1: {
        color: "#fbcdb4",
      },
      dawnRadial2: {
        color: "#ecd2e6",
      },
      dawnRadial3: {
        color: "#ffd8bd",
      },
      dawnRadial4: {
        color: "#fff3e9",
      },
    },
  },
};
