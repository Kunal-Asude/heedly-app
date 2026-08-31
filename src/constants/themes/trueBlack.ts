/**
 * True Black Theme — OLED (Accessibility Theme)
 *
 * All values are extracted VERBATIM from the client design handoff:
 *   design_handoff_themes/tokens/oled.css
 *   design_handoff_themes/reference/Aubade - True Black (OLED).html
 *   design_handoff_themes/README.md
 *
 * Designed for minimum emitted light for users with severe light sensitivity.
 * Flattened surfaces (#16111B), zero blooms, zero gradients on cards/sheets,
 * no shadows, 1px subtle hairlines (rgba(255,255,255,0.07)), dimmed ink (#E9DDD6),
 * and an ember-anchored EnergyOrb.
 */

import { DesignTokens } from "./tokens";

export const trueBlackTheme: DesignTokens = {
  // ─── Typography (identical across all themes per typography.css) ────────────
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

  // ─── Border Radii (identical across all themes per oled.css) ────────────────
  radii: {
    pill: 999,
    cta: 30,
    card: 22,
    tile: 16,
    input: 12,
  },

  // ─── Colors: Text & Ink ───────────────────────────────────────────────────
  // Source: oled.css — --ink-display, --ink-1, --ink-2, --ink-3, --ink-soft, --ink-muted, --ink-faint
  ink: {
    display: "#E9DDD6",              // --ink-display: #E9DDD6
    body: "#E9DDD6",                 // --ink-1: #E9DDD6
    subtle: "#A8979E",               // --ink-2: #A8979E
    dark: "#9A8A91",                 // --ink-3: #9A8A91
    soft: "#9A8A91",                 // --ink-soft: #9A8A91
    muted: "#9A8A91",                // --ink-muted: #9A8A91
    faint: "rgba(168,151,158,0.55)", // --ink-faint: rgba(168,151,158,0.55)
  },

  // ─── Colors: Semantic (Brand / Coral — Deeply Dimmed) ──────────────────────
  // Source: oled.css — --coral, --coral-mid, --coral-light, --terracotta, --terracotta-deep, --terracotta-hover
  coral: {
    primary: "#BE6A5C",              // --coral: #BE6A5C
    mid: "#B85F47",                  // --coral-mid: #B85F47
    light: "#C97B60",                // --coral-light: #C97B60
    terracotta: "#C97B60",           // --terracotta: #C97B60
    terracottaDeep: "#C97B60",       // Italic headline accent & links: #C97B60
    terracottaHover: "#D8896D",      // --terracotta-hover: #D8896D
  },

  // ─── State Colors ─────────────────────────────────────────────────────────
  // Source: oled.css — --steady, --steady-bg, --steady-ink, --caution, --caution-bg, --rest, --rest-bg
  states: {
    steady: {
      color: "#6E9678",                         // --steady: #6E9678
      chart: "#6E9678",
      bg: "rgba(110,150,120,0.14)",             // --steady-bg: rgba(110,150,120,0.14)
      ring: "rgba(110,150,120,0.14)",
      ink: "#8FAFA4",                           // --steady-ink: #8FAFA4
      label: "Steady",
    },
    caution: {
      color: "#C29A5F",                         // --caution: #C29A5F
      chart: "#C29A5F",
      bg: "rgba(194,154,95,0.14)",             // --caution-bg: rgba(194,154,95,0.14)
      ring: "rgba(194,154,95,0.14)",
      label: "Caution",
    },
    rest: {
      color: "#BE6A5C",                         // --rest: #BE6A5C
      chart: "#BE6A5C",
      bg: "rgba(190,106,92,0.14)",             // --rest-bg: rgba(190,106,92,0.14)
      ring: "rgba(190,106,92,0.14)",
      label: "Rest day",
    },
  },

  // ─── Surface Colors ───────────────────────────────────────────────────────
  // Source: oled.css — --surface-base, --surface-card, --surface-card-deep, --surface-glass, --surface-well
  surfaces: {
    card: "#16111B",               // --surface-card: #16111B
    cream: "#16111B",              // --surface-card alias
    glass: "#16111B",              // --surface-glass: #16111B
    background: "#000000",         // --surface-base: #000000 (pure black)
  },

  // ─── Borders ──────────────────────────────────────────────────────────────
  // Source: oled.css — --border-card, --border-hairline, --border-glass, --divider
  borders: {
    card: "rgba(255,255,255,0.07)",     // --border-card: rgba(255,255,255,0.07)
    hairline: "rgba(255,255,255,0.07)", // --border-hairline: rgba(255,255,255,0.07)
    glass: "rgba(255,255,255,0.07)",    // --border-glass: rgba(255,255,255,0.07)
    divider: "rgba(255,255,255,0.07)",  // --divider: rgba(255,255,255,0.07)
  },

  // ─── Accents & Highlights ─────────────────────────────────────────────────
  accents: {
    oat: {
      main: "#C29A5F",
      bg: "rgba(194,154,95,0.14)",
      border: "rgba(194,154,95,0.4)",
    },
  },

  // ─── Shadows (All none in OLED — defined by 1px hairlines) ────────────────
  // Source: oled.css — --shadow-chip: none, --shadow-card: none, --shadow-bar: none
  shadows: {
    chip: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    card: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    cta: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    bar: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },

  // ─── Component-Specific Tokens ────────────────────────────────────────────
  components: {
    header: {
      dateColor: "#9A8A91",
      greetingColor: "#E9DDD6",
      settingsBg: "#16111B",
      settingsBorder: "rgba(255, 255, 255, 0.07)",
      settingsIconColor: "#9A8A91",
      settingsShadowColor: "#000000",
    },
    cta: {
      // Source: oled.css — --grad-cta: linear-gradient(135deg, #574049 0%, #241A20 100%)
      gradient: ["#574049", "#241A20"],
      textColor: "#EADCD4", // --grad-cta-ink: #EADCD4
      borderColor: "rgba(255, 255, 255, 0.06)",
      shadowColor: "#000000",
      shadowOpacity: 0,
    },
    badge: {
      learning: {
        background: "rgba(110, 150, 120, 0.14)", // --steady-bg: rgba(110,150,120,0.14)
        border: "rgba(110, 150, 120, 0.14)",
        dot: "#6E9678",                         // --steady: #6E9678
        text: "#6E9678",                        // --steady: #6E9678
      },
      statusText: "#E9DDD6",
    },
    supportingText: {
      color: "#9A8A91",
      noteColor: "#9A8A91",
    },
    tabBar: {
      background: "#16111B",
      border: "rgba(255, 255, 255, 0.07)",
      selectedPill: "rgba(190, 106, 92, 0.14)", // --surface-selected
      selectedText: "#E9DDD6",
      unselectedText: "#9A8A91",
      shadowColor: "#000000",
    },
    forecastCard: {
      background: "#16111B",
      gradient: ["#16111B", "#16111B"], // flat #16111B
      border: "rgba(255, 255, 255, 0.07)",
      labelColor: "#9A8A91",
      valueColor: "#E9DDD6",
      shadowColor: "#000000",
      shadowOpacity: 0,
      divider: "rgba(255, 255, 255, 0.07)",
    },
    energyOrb: {
      // Source: oled.css & Aubade - True Black (OLED).html
      steady: {
        topColor: "rgb(96, 140, 112)",  // --orb-steady-ember: 96 140 112
        botColor: "rgb(96, 140, 112)",
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "#E9DDD6",          // --orb-wave: rgba(233,221,214,0.16)
      },
      caution: {
        topColor: "rgb(160, 110, 58)",  // --orb-caution-ember: 160 110 58
        botColor: "rgb(160, 110, 58)",
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "#E9DDD6",
      },
      rest: {
        topColor: "rgb(150, 72, 86)",   // --orb-rest-ember: 150 72 86
        botColor: "rgb(150, 72, 86)",
        alphaTop: 0.22,
        alphaBot: 0.32,
        crestColor: "#E9DDD6",
      },
      wearableRead: {
        topColor: "rgb(96, 140, 112)",
        botColor: "rgb(96, 140, 112)",
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "#E9DDD6",
      },
      learning: {
        topColor: "rgb(96, 140, 112)",
        botColor: "rgb(96, 140, 112)",
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "#E9DDD6",
      },
      glass: {
        // ── OLED glass core: near-black headspace (--orb-glass) ───────────────
        // Source: oled.css
        //   --orb-glass: radial-gradient(circle at 50% 46%,
        //     rgba(14,10,17,0.86), rgba(10,7,13,0.9) 68%, rgba(6,4,8,0.94) 100%);
        coreInner: "rgb(14,10,17)",
        coreMid: "rgb(10,7,13)",
        coreOuter: "rgb(6,4,8)",
        coreInnerAlpha: 0.86,
        coreMidAlpha: 0.90,
        coreOuterAlpha: 0.94,

        // ── OLED per-state bottom glows ───────────────────────────────────────
        steadyGlowColor: "rgb(96,140,112)",
        steadyGlowAlpha: 0.62,
        cautionGlowColor: "rgb(160,110,58)",
        cautionGlowAlpha: 0.62,
        restGlowColor: "rgb(150,72,86)",
        restGlowAlpha: 0.62,

        // ── OLED brand/empty ember (--orb-ember) ──────────────────────────────
        // Source: oled.css
        //   --orb-ember: radial-gradient(95% 70% at 50% 98%,
        //     rgba(150,88,58,0.55), rgba(150,88,58,0.16) 45%, rgba(150,88,58,0) 68%)
        emberColor: "rgb(150,88,58)",
        emberAlpha0: 0.55,
        emberAlpha45: 0.16,
        emberAlpha68: 0.0,

        // ── OLED frosted veil (--orb-veil) ────────────────────────────────────
        // Source: oled.css
        //   --orb-veil: radial-gradient(circle at 50% 32%, rgba(255,255,255,0.045), transparent 55%)
        veilAlpha: 0.045,

        // ── OLED rim inset highlights (--orb-rim) ─────────────────────────────
        // Source: oled.css
        //   --orb-rim: inset 0 0 0 1px rgba(255,255,255,0.07), inset 0 10px 24px rgba(255,255,255,0.03)
        rimColor: "rgb(255,255,255)",
        rimTopAlpha: 0.03,
        rimBotAlpha: 0,
        rimRingAlpha: 0.07,
        rimSideAlpha: 0,

        // ── OLED halo: REMOVED ENTIRELY (--orb-halo: none) ────────────────────
        haloInnerColor: "transparent",
        haloInnerAlpha: 0,
        haloMidColor: "transparent",
        haloMidAlpha: 0,
        restHaloInnerColor: "transparent",
        restHaloInnerAlpha: 0,
        restHaloMidColor: "transparent",
        restHaloMidAlpha: 0,
        brandHaloInnerColor: "transparent",
        brandHaloInnerAlpha: 0,
        brandHaloMidColor: "transparent",
        brandHaloMidAlpha: 0,
      },
    },
    background: {
      type: "solid",
      baseColor: "#000000", // pure black, flat
      radial1: {
        color: "transparent",
        cx: 24,
        cy: 56,
        r: 240,
        opacity: 0,
        stopPercent: "100%",
      },
      radial2: {
        color: "transparent",
        cx: 384,
        cy: 64,
        r: 240,
        opacity: 0,
        stopPercent: "100%",
      },
      radial3: {
        color: "transparent",
        cx: 200,
        cy: 352,
        r: 280,
        opacity: 0,
        stopPercent: "100%",
      },
      radial4: {
        color: "transparent",
        cx: 200,
        cy: 824,
        r: 450,
        opacity: 0,
        stopPercent: "100%",
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
        background: "#16111B",
        border: "rgba(255, 255, 255, 0.07)",
        shadowColor: "#000000",
        shadowOpacity: 0,
        iconBackground: "#241A24",
        iconColor: "#A8979E",
        selectedBackground: "rgba(190, 106, 92, 0.14)", // --surface-selected
        selectedBorder: "rgba(255, 255, 255, 0.07)",
        selectedIconBackground: "#241A24",
        selectedIconColor: "#C97B60",
        selectedTextColor: "#E9DDD6",
        selectedActionColor: "#C97B60",
        waitingBackground: "#16111B",
        waitingBorder: "rgba(255, 255, 255, 0.07)",
        waitingIconBackground: "#241A24",
        waitingIconColor: "#9A8A91",
        waitingActionColor: "#9A8A91",
      },
      chip: {
        background: "#16111B",
        border: "rgba(255, 255, 255, 0.07)",
        textColor: "#E9DDD6",
        checkboxBorder: "rgba(255, 255, 255, 0.18)",
        selectedBackground: "rgba(190, 106, 92, 0.14)",
        selectedBorder: "rgba(255, 255, 255, 0.07)",
        selectedGradient: ["#B85F47", "#B85F47"] as const,
      },
    },
  },
};

