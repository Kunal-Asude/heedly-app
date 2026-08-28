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
    header: {
      dateColor: "rgba(74, 58, 57, 0.50)",
      greetingColor: "#4a3736",
      settingsBg: "rgba(255, 255, 255, 0.38)",
      settingsBorder: "rgba(255, 255, 255, 0.55)",
      settingsIconColor: "rgba(74, 58, 57, 0.62)",
      settingsShadowColor: "#BE8C8C",
    },
    cta: {
      gradient: ["#F0A07E", "#E8907A", "#E0735F"],
      textColor: "#FFF8F4",
      borderColor: "rgba(255, 255, 255, 0.40)",
      shadowColor: "#6E5656",
      shadowOpacity: 0.16,
    },
    badge: {
      learning: {
        background: "rgba(126, 155, 106, 0.15)",
        border: "rgba(126, 155, 106, 0.24)",
        dot: "#7e9b6a",
        text: "#5d7a52",
      },
      statusText: "rgba(74, 58, 57, 0.72)",
    },
    supportingText: {
      color: "rgba(74, 58, 57, 0.70)",
      noteColor: "rgba(74, 58, 57, 0.66)",
    },
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
      valueColor: "#4f3c3a",
      shadowColor: "#C8A998",
      shadowOpacity: 0.14,
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
      glass: {
        // ── Dawn glass core: warm peach radial ───────────────────────────────
        // Source: Aubade - Today.html .glass
        // background: radial-gradient(circle at 50% 50%, #f8d2bf, #f0bba6 68%, #e8b29c 100%)
        coreInner: '#f9e5da',   // warm peach center
        coreMid: '#f4d1c1',     // 65% mid
        coreOuter: '#ebbca9',   // 100% outer
        coreInnerAlpha: 1,
        coreMidAlpha: 1,
        coreOuterAlpha: 1,

        // ── Dawn per-state bottom glows ──────────────────────────────────────
        // Dawn uses a single warm cream (#ffe6c4) for all states
        steadyGlowColor: '#ffe6c4',
        steadyGlowAlpha: 0.88,
        cautionGlowColor: '#ffe6c4',
        cautionGlowAlpha: 0.88,
        restGlowColor: '#ffe6c4',
        restGlowAlpha: 0.88,

        // ── Dawn brand/empty ember ───────────────────────────────────────────
        // Source: .glass warm bottom glow: rgba(255,222,178,0.95)
        emberColor: '#ffdeb2',  // rgba(255,222,178) as hex
        emberAlpha0: 0.95,
        emberAlpha45: 0,
        emberAlpha68: 0,

        // ── Dawn frosted milky veil (.glass::after) ──────────────────────────
        // Source: radial-gradient(circle at 50% 32%, rgba(255,255,255,0.3), transparent 55%)
        // Note: 0.38 is used in EnergyOrb (higher-fidelity match than the CSS 0.3)
        veilAlpha: 0.42,

        // ── Dawn rim — pure white inset highlights ───────────────────────────
        // Source: .glass box-shadow: inset 0 14px 38px rgba(255,255,255,0.5), ...
        rimColor: '#ffffff',
        rimTopAlpha: 0.5,    // inset 0 14px 38px rgba(255,255,255,0.5) — top inner
        rimBotAlpha: 0.26,   // inset 0 -12px 34px rgba(214,142,112,0.26) — bottom warm depth
        rimRingAlpha: 0,     // Dawn has no 1.5px ring
        rimSideAlpha: 0.18,  // inset 8px 0 30px rgba(255,255,255,0.18) — left side

        // ── Dawn halo: warm peach/pink at 50% 58% ───────────────────────────
        // Source: .orb::before
        // radial-gradient(circle at 50% 58%, rgba(255,206,170,0.45), rgba(247,200,210,0.2) 45%, transparent 70%)
        haloInnerColor: '#ffceaa',  // rgba(255,206,170) — warm peach
        haloInnerAlpha: 0.45,
        haloMidColor: '#f7c8d2',     // rgba(247,200,210)
        haloMidAlpha: 0.20,
        // Rest halo same as above in Dawn
        restHaloInnerColor: '#ffceaa',
        restHaloInnerAlpha: 0.45,
        restHaloMidColor: '#f7c8d2',
        restHaloMidAlpha: 0.20,
        // Brand/empty same as above in Dawn
        brandHaloInnerColor: '#ffceaa',
        brandHaloInnerAlpha: 0.45,
        brandHaloMidColor: '#f7c8d2',
        brandHaloMidAlpha: 0.20,
      },
    },
    background: {
      type: "gradient",
      baseColor: "#F5DDD5",
      baseLinear: {
        start: "#f4e9e1",
        middle: "#f7ded1",
        end: "#f6e2d6",
      },
      radial1: {
        color: "#fbcdb4",
        cx: 288,
        cy: 64,
        r: 260,
        opacity: 0.9,
        stopPercent: "60%",
      },
      radial2: {
        color: "#ecd2e6",
        cx: 64,
        cy: 208,
        r: 260,
        opacity: 0.95,
        stopPercent: "58%",
      },
      radial3: {
        color: "#ffd8bd",
        cx: 200,
        cy: 816,
        r: 320,
        opacity: 0.9,
        stopPercent: "62%",
      },
      radial4: {
        color: "rgba(255, 243, 233, 0.5)",
        cx: 200,
        cy: 480,
        r: 300,
        opacity: 0.5,
        stopPercent: "70%",
      },
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
    onboarding: {
      card: {
        background: "rgba(255, 252, 248, 0.82)",
        border: "rgba(255, 255, 255, 0.75)",
        shadowColor: "#BE968C",
        shadowOpacity: 0.10,
        iconBackground: "#ffe9d6",
        iconColor: "#9a6a52",
        selectedBackground: "rgba(244, 164, 126, 0.14)",
        selectedBorder: "rgba(224, 115, 95, 0.50)",
        selectedIconBackground: "#ffe9d6",
        selectedIconColor: "#9a6a52",
        selectedTextColor: "#4f3c3a",
        selectedActionColor: "#cf6a4c",
        waitingBackground: "rgba(255, 252, 248, 0.60)",
        waitingBorder: "rgba(74, 58, 57, 0.14)",
        waitingIconBackground: "#f3eae4",
        waitingIconColor: "rgba(74, 58, 57, 0.50)",
        waitingActionColor: "rgba(74, 58, 57, 0.55)",
      },
      chip: {
        background: "rgba(255, 252, 248, 0.74)",
        border: "rgba(255, 255, 255, 0.75)",
        textColor: "#4f3c3a",
        checkboxBorder: "rgba(120, 90, 90, 0.32)",
        selectedBackground: "rgba(244, 164, 126, 0.18)",
        selectedBorder: "rgba(224, 115, 95, 0.42)",
        selectedGradient: ["#f0a07e", "#e0735f"] as const,
      },
    },
  },
};
