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
    header: {
      dateColor: "rgba(199, 180, 191, 0.68)",
      greetingColor: "#F3E7E1",
      settingsBg: "rgba(26, 26, 26, 0.7)",
      settingsBorder: "rgba(255, 255, 255, 0.1)",
      settingsIconColor: "rgba(199, 180, 191, 0.84)",
      settingsShadowColor: "#000000",
    },
    cta: {
      gradient: ["#634256", "#8A5D7C", "#9E768E"],
      textColor: "#FFF6F1",
      borderColor: "rgba(255, 255, 255, 0.1)",
      shadowColor: "#000000",
      shadowOpacity: 0.29,
    },
    badge: {
      learning: {
        background: "rgba(134, 196, 180, 0.18)",
        border: "rgba(134, 196, 180, 0.24)",
        dot: "#86C4B4",
        text: "#86C4B4",
      },
      statusText: "rgba(199, 180, 191, 0.97)",
    },
    supportingText: {
      color: "rgba(199, 180, 191, 0.95)",
      noteColor: "rgba(199, 180, 191, 0.89)",
    },
    tabBar: {
      background: "#111111", // PLACEHOLDER
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
      valueColor: "#F3E7E1", // PLACEHOLDER
      shadowColor: "#000000", // PLACEHOLDER
      shadowOpacity: 0.25,
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
        topColor: "rgb(142, 206, 196)", // PLACEHOLDER — matches dark Dusk
        botColor: "rgb(74, 172, 184)",  // PLACEHOLDER
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.5)", // PLACEHOLDER
      },
      glass: {
        // PLACEHOLDER — OLED glass treatment is not yet specified in the design handoff.
        // Using Dusk values as stand-in until OLED design is finalized.
        coreInner: "rgb(58,42,63)",
        coreMid: "rgb(52,38,58)",
        coreOuter: "rgb(44,32,50)",
        coreInnerAlpha: 0.80,
        coreMidAlpha: 0.88,
        coreOuterAlpha: 0.95,
        steadyGlowColor: "rgb(213,233,198)",
        steadyGlowAlpha: 0.20,
        cautionGlowColor: "rgb(250,198,170)",
        cautionGlowAlpha: 0.20,
        restGlowColor: "rgb(232,132,140)",
        restGlowAlpha: 0.18,
        emberColor: "rgb(232,180,154)",
        emberAlpha0: 0.5,
        emberAlpha45: 0.16,
        emberAlpha68: 0,
        veilAlpha: 0.10,
        rimColor: "rgb(233,214,226)",
        rimTopAlpha: 0.14,
        rimBotAlpha: 0.09,
        rimRingAlpha: 0.20,
        rimSideAlpha: 0.05,
        haloInnerColor: "rgb(212,232,196)",
        haloInnerAlpha: 0.12,
        haloMidColor: "rgb(255,206,170)",
        haloMidAlpha: 0.06,
        restHaloInnerColor: "rgb(236,142,148)",
        restHaloInnerAlpha: 0.11,
        restHaloMidColor: "rgb(255,192,182)",
        restHaloMidAlpha: 0.05,
        brandHaloInnerColor: "rgb(255,206,170)",
        brandHaloInnerAlpha: 0.15,
        brandHaloMidColor: "rgb(247,190,176)",
        brandHaloMidAlpha: 0.07,
      },
    },
    background: {
      type: "solid",
      baseColor: "#000000",
      radial1: {
        color: "transparent",
        cx: 24,
        cy: 56,
        r: 240,
        opacity: 0,
        stopPercent: "70%",
      },
      radial2: {
        color: "transparent",
        cx: 384,
        cy: 64,
        r: 240,
        opacity: 0,
        stopPercent: "70%",
      },
      radial3: {
        color: "transparent",
        cx: 200,
        cy: 352,
        r: 280,
        opacity: 0,
        stopPercent: "72%",
      },
      radial4: {
        color: "transparent",
        cx: 200,
        cy: 824,
        r: 450,
        opacity: 0,
        stopPercent: "78%",
      },
      dawnBase: {
        start: "#000000",
        middle: "#000000",
        end: "#000000",
      },
      dawnRadial1: {
        color: "transparent",
      },
      dawnRadial2: {
        color: "transparent",
      },
      dawnRadial3: {
        color: "transparent",
      },
      dawnRadial4: {
        color: "transparent",
      },
    },
    onboarding: {
      card: {
        background: "rgba(22, 22, 24, 0.85)",
        border: "rgba(255, 255, 255, 0.12)",
        shadowColor: "#000000",
        shadowOpacity: 0.30,
        iconBackground: "rgba(35, 35, 38, 0.90)",
        iconColor: "#E0E0E0",
        selectedBackground: "rgba(226, 122, 108, 0.20)",
        selectedBorder: "rgba(255, 255, 255, 0.20)",
        selectedIconBackground: "rgba(45, 45, 48, 0.90)",
        selectedIconColor: "#E8907A",
        selectedTextColor: "#FFFFFF",
        selectedActionColor: "#E8907A",
        waitingBackground: "rgba(18, 18, 20, 0.80)",
        waitingBorder: "rgba(255, 255, 255, 0.08)",
        waitingIconBackground: "rgba(28, 28, 30, 0.90)",
        waitingIconColor: "rgba(255, 255, 255, 0.50)",
        waitingActionColor: "rgba(255, 255, 255, 0.55)",
      },
      chip: {
        background: "rgba(22, 22, 24, 0.85)",
        border: "rgba(255, 255, 255, 0.12)",
        textColor: "#FFFFFF",
        checkboxBorder: "rgba(255, 255, 255, 0.35)",
        selectedBackground: "rgba(226, 122, 108, 0.20)",
        selectedBorder: "rgba(255, 255, 255, 0.20)",
        selectedGradient: ["#E28266", "#D9735A"] as const,
      },
    },
  },
};
