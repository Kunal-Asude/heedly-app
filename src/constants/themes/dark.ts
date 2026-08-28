/**
 * Dark Theme — Dusk
 *
 * All values are extracted VERBATIM from the client design handoff:
 *   /Users/kunalasude/Downloads/design_handoff_themes/tokens/dusk.css
 *   /Users/kunalasude/Downloads/design_handoff_themes/tokens/surfaces.css
 *   /Users/kunalasude/Downloads/design_handoff_themes/reference/Aubade - Dusk (dark).html
 *
 * DO NOT hardcode any of these values inside individual screens.
 * Consume them via useTheme() from src/constants/themes/index.ts.
 */

import { DesignTokens } from "./tokens";

export const darkTheme: DesignTokens = {
  // ─── Typography (unchanged from light — dusk.css confirms same scale) ──
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

  // ─── Border Radii (unchanged — dusk.css: same radii as light) ──────────
  radii: {
    pill: 999,
    cta: 30,
    card: 22,
    tile: 16,
    input: 12,
  },

  // ─── Colors: Text & Ink ──────────────────────────────────────────────────
  // Source: dusk.css — --ink-display, --ink-1, --ink-2, --ink-3, --ink-soft, --ink-muted, --ink-faint
  ink: {
    display: "#F3E7E1",            // --ink-display: #F3E7E1
    body: "#F3E7E1",               // --ink-1: #F3E7E1
    subtle: "#C7B4BF",             // --ink-2: #C7B4BF
    dark: "rgba(199,180,191,0.89)", // --ink-3: rgba(199,180,191,0.89)
    soft: "rgba(199,180,191,0.81)", // --ink-soft: rgba(199,180,191,0.81)
    muted: "rgba(199,180,191,0.68)", // --ink-muted: rgba(199,180,191,0.68)
    faint: "rgba(199,180,191,0.41)", // --ink-faint: rgba(199,180,191,0.41)
  },

  // ─── Colors: Semantic (Brand / Coral — Dusk-adapted) ─────────────────────
  // Source: dusk.css — --coral, --coral-mid, --coral-light, --terracotta, --terracotta-deep, --terracotta-hover
  coral: {
    primary: "#E27A6C",            // --coral: #E27A6C
    mid: "#E28266",                // --coral-mid: #E28266
    light: "#E8907A",              // --coral-light: #E8907A
    terracotta: "#E8907A",         // --terracotta: #E8907A
    terracottaDeep: "#E8907A",     // --terracotta-deep: #E8907A
    terracottaHover: "#F0A28C",    // --terracotta-hover: #F0A28C
  },

  // ─── State Colors ──────────────────────────────────────────────────────────
  // Source: dusk.css — --steady, --steady-chart, --steady-bg, --steady-ink,
  //   --caution, --caution-chart, --caution-bg, --rest, --rest-chart, --rest-bg
  states: {
    steady: {
      color: "#86C4B4",                         // --steady: #86C4B4
      chart: "#94b094",                         // --steady-chart: #94b094
      bg: "rgba(134,196,180,0.18)",             // --steady-bg: rgba(134,196,180,0.18)
      ring: "rgba(134,196,180,0.18)",           // same as bg (no explicit ring token in dusk.css)
      ink: "#B6D8CF",                           // --steady-ink: #B6D8CF
      label: "Steady",
    },
    caution: {
      color: "#E8A87C",                         // --caution: #E8A87C
      chart: "#f0c59e",                         // --caution-chart: #f0c59e
      bg: "rgba(232,168,124,0.18)",             // --caution-bg: rgba(232,168,124,0.18)
      ring: "rgba(232,168,124,0.18)",           // same as bg
      label: "Caution",
    },
    rest: {
      color: "#E27A6C",                         // --rest: #E27A6C
      chart: "#da6d82",                         // --rest-chart: #da6d82
      bg: "rgba(226,122,108,0.16)",             // --rest-bg: rgba(226,122,108,0.16)
      ring: "rgba(226,122,108,0.16)",           // same as bg
      label: "Rest day",
    },
  },

  // ─── Surface Colors ────────────────────────────────────────────────────────
  // Source: dusk.css — --surface-base, --surface-card, --surface-cream, --surface-glass
  surfaces: {
    card: "#3E2F44",               // --surface-card: #3E2F44
    cream: "#3E2F44",              // --surface-cream: #3E2F44 (light-theme alias)
    glass: "rgba(51,37,56,0.72)", // --surface-glass: rgba(51,37,56,0.72)
    background: "#191320",         // --surface-base: #191320
  },

  // ─── Borders ───────────────────────────────────────────────────────────────
  // Source: dusk.css — --border-card, --border-hairline, --border-glass, --divider
  borders: {
    card: "rgba(255,255,255,0.09)",     // --border-card: rgba(255,255,255,0.09)
    hairline: "rgba(255,255,255,0.09)", // --border-hairline: rgba(255,255,255,0.09)
    glass: "rgba(199,180,191,0.14)",    // --border-glass: rgba(199,180,191,0.14)
    divider: "rgba(85,68,91,0.3)",      // --divider: rgba(85,68,91,0.3)
  },

  // ─── Accents & Highlights ──────────────────────────────────────────────────
  // Source: dusk.css — --oat, --oat-bg, --oat-border
  accents: {
    oat: {
      main: "#cdb488",                        // --oat: #cdb488
      bg: "rgba(232,168,124,0.18)",           // --oat-bg: rgba(232,168,124,0.18)
      border: "rgba(232,168,124,0.4)",        // --oat-border: rgba(232,168,124,0.4)
    },
  },

  // ─── Shadows ───────────────────────────────────────────────────────────────
  // Source: dusk.css — --shadow-chip, --shadow-card, --shadow-cta, --shadow-bar
  // Note: React Native shadows use numeric values; inset is not supported (omitted).
  shadows: {
    chip: {
      // --shadow-chip: 0 4px 12px rgba(0,0,0,0.14)
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.14,
      shadowRadius: 12,
      elevation: 2,
    },
    card: {
      // --shadow-card: 0 10px 26px rgba(0,0,0,0.29)
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.29,
      shadowRadius: 26,
      elevation: 5,
    },
    cta: {
      // --shadow-cta: 0 8px 20px rgba(0,0,0,0.29)
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.29,
      shadowRadius: 20,
      elevation: 5,
    },
    bar: {
      // --shadow-bar: 0 12px 30px rgba(0,0,0,0.4)
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 30,
      elevation: 8,
    },
  },

  // ─── Component-Specific Tokens ─────────────────────────────────────────────
  components: {
    header: {
      dateColor: "rgba(199, 180, 191, 0.68)",
      greetingColor: "#F3E7E1",
      settingsBg: "rgba(62, 47, 68, 0.60)",
      settingsBorder: "rgba(255, 255, 255, 0.09)",
      settingsIconColor: "rgba(199, 180, 191, 0.84)",
      settingsShadowColor: "#000000",
    },
    cta: {
      gradient: ["#634256", "#8A5D7C", "#9E768E"],
      textColor: "#FFF6F1",
      borderColor: "rgba(255, 255, 255, 0.09)",
      shadowColor: "#000000",
      shadowOpacity: 0.29,
    },
    badge: {
      learning: {
        background: "rgba(134, 196, 180, 0.16)",
        border: "rgba(134, 196, 180, 0.36)",
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
      background: "#312334",
      border: "rgba(255, 255, 255, 0.09)",
      selectedPill: "#543949",
      selectedText: "#FFF6F1",
      unselectedText: "rgba(199, 180, 191, 0.78)",
      shadowColor: "#000000",
    },
    forecastCard: {
      background: "rgba(62,47,68,0.72)",
      gradient: [
        "rgba(46, 39, 56, 0.72)",  // deep plum/purple on left
        "rgba(67, 49, 67, 0.72)",  // muted purple/plum in middle
        "rgba(102, 73, 73, 0.72)", // warmer muted mauve/brown on right
      ],
      border: "rgba(255, 255, 255, 0.08)", // subtle, thin, low opacity border
      labelColor: "rgba(199, 180, 191, 0.74)",
      valueColor: "#F3E7E1",
      shadowColor: "#000000",
      shadowOpacity: 0.18,
      divider: "rgba(199, 180, 191, 0.10)",
    },
    energyOrb: {
      // Source: dusk.css — --orb-steady-top/bot/alpha, --orb-caution-top/bot/alpha, --orb-rest-top/bot/alpha
      // Note: CSS var triplets "R G B" → converted to rgb() for RN
      steady: {
        topColor: "rgb(142, 206, 196)",  // --orb-steady-top: 142 206 196
        botColor: "rgb(74, 172, 184)",   // --orb-steady-bot: 74 172 184
        alphaTop: 0.20,                  // --orb-steady-alpha: 0.20
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.40)", // --orb-wave
      },
      caution: {
        topColor: "rgb(250, 198, 170)",  // --orb-caution-top: 250 198 170
        botColor: "rgb(243, 176, 142)",  // --orb-caution-bot: 243 176 142
        alphaTop: 0.20,                  // --orb-caution-alpha: 0.20
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.40)",
      },
      rest: {
        topColor: "rgb(224, 110, 146)",  // --orb-rest-top: 224 110 146
        botColor: "rgb(188, 62, 104)",   // --orb-rest-bot: 188 62 104
        alphaTop: 0.22,                  // --orb-rest-alpha: 0.22
        alphaBot: 0.32,
        crestColor: "rgba(255, 255, 255, 0.40)",
      },
      wearableRead: {
        // Same liquid as steady (same orb tokens apply)
        topColor: "rgb(142, 206, 196)",
        botColor: "rgb(74, 172, 184)",
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.40)",
      },
      learning: {
        // Same as steady
        topColor: "rgb(142, 206, 196)",
        botColor: "rgb(74, 172, 184)",
        alphaTop: 0.20,
        alphaBot: 0.30,
        crestColor: "rgba(255, 255, 255, 0.40)",
      },
      glass: {
        // ── Dusk glass core: dark plum radial (--orb-glass) ─────────────────
        // Source: dusk.css
        //   --orb-glass: radial-gradient(circle at 50% 46%,
        //     rgba(58,42,63,0.58), rgba(52,38,58,0.62) 68%, rgba(44,32,50,0.7) 100%);
        coreInner: "rgb(58,42,63)",    // center plum
        coreMid: "rgb(52,38,58)",      // 68% stop
        coreOuter: "rgb(44,32,50)",    // 100% stop
        coreInnerAlpha: 0.58,
        coreMidAlpha: 0.62,
        coreOuterAlpha: 0.7,

        // ── Dusk per-state bottom glows ──────────────────────────────────────
        // Source: Aubade - Dusk (dark).html
        // .s-steady .glass: radial-gradient(120% 85% at 50% 110%, rgba(213,233,198,0.28), ...)
        steadyGlowColor: "rgb(213,233,198)",   // sage/green
        steadyGlowAlpha: 0.28,
        // .s-caution .glass: radial-gradient(120% 80% at 50% 112%, rgba(250,198,170,0.26), ...)
        cautionGlowColor: "rgb(250,198,170)",  // peach
        cautionGlowAlpha: 0.26,
        // .s-rest .glass: radial-gradient(130% 65% at 50% 118%, rgba(232,132,140,0.24), ...)
        restGlowColor: "rgb(232,132,140)",     // rose
        restGlowAlpha: 0.24,

        // ── Dusk brand/empty ember (--orb-ember) ─────────────────────────────
        // Source: dusk.css
        //   --orb-ember: radial-gradient(95% 70% at 50% 98%,
        //     rgba(232,180,154,0.5), rgba(232,180,154,0.16) 45%, rgba(232,180,154,0) 68%)
        // Also: Dusk HTML .ob-orb .glass, .fd-orb-sm .glass, .pw-orb .glass:
        //   radial-gradient(95% 70% at 50% 98%, rgba(232,180,154,0.5), rgba(232,180,154,0.16) 45%, ...)
        emberColor: "rgb(232,180,154)",   // warm ember
        emberAlpha0: 0.50,
        emberAlpha45: 0.16,
        emberAlpha68: 0.0,

        // ── Dusk frosted veil (--orb-veil) ───────────────────────────────────
        // Source: dusk.css
        //   --orb-veil: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.12), transparent 55%)
        // Confirmed by HTML: .s-steady .glass::after, .ob-orb .glass::after
        veilAlpha: 0.12,

        // ── Dusk rim inset highlights (--orb-rim) ────────────────────────────
        // Source: dusk.css
        //   --orb-rim:
        //     inset 0 -10px 30px rgba(233,214,226,0.12),  ← rimBotAlpha
        //     inset 0 12px 30px rgba(233,214,226,0.18),   ← rimTopAlpha
        //     inset 0 0 0 1.5px rgba(233,214,226,0.26),   ← rimRingAlpha
        //     inset 6px 0 24px rgba(255,255,255,0.07);    ← rimSideAlpha
        rimColor: "rgb(233,214,226)",  // warm lilac rim highlight
        rimTopAlpha: 0.18,
        rimBotAlpha: 0.12,
        rimRingAlpha: 0.26,
        rimSideAlpha: 0.07,

        // ── Dusk halo (outer glow removed per request — keeping only inner glow) ───
        // ── Dusk ambient outer halo (.orb::before) ──────────────────────────
        // Source: Aubade - Dusk (dark).html (.ob-orb .orb::before)
        // radial-gradient(circle at 50% 70%, rgba(255,206,170,0.2), rgba(247,190,176,0.09) 45%, transparent 70%)
        haloInnerColor: "rgb(212, 232, 196)",
        haloInnerAlpha: 0.16,
        haloMidColor: "rgb(255, 206, 170)",
        haloMidAlpha: 0.08,
        restHaloInnerColor: "rgb(236, 142, 148)",
        restHaloInnerAlpha: 0.15,
        restHaloMidColor: "rgb(255, 192, 182)",
        restHaloMidAlpha: 0.07,
        brandHaloInnerColor: "rgb(255, 206, 170)",
        brandHaloInnerAlpha: 0.20,
        brandHaloMidColor: "rgb(247, 190, 176)",
        brandHaloMidAlpha: 0.09,
      },
    },
    background: {
      type: "solid",
      baseColor: "#191320", // --surface-base / #191320
      // Radial 1: Top-left violet/indigo bloom at 6% 7% (24, 56), spread 55% 30% (r=240), stop 70%
      // Radial 1: Top-left violet/indigo bloom
      radial1: {
        color: "rgb(62, 52, 88)",
        cx: 24,
        cy: 56,
        r: 210,
        opacity: 0.75,
        stopPercent: "100%",
      },
      // Radial 2: Top-right rust/warm bloom
      radial2: {
        color: "rgb(69, 49, 45)",
        cx: 384,
        cy: 64,
        r: 210,
        opacity: 0.75,
        stopPercent: "100%",
      },
      // Radial 3: Subtle soft warm rose-plum ambient glow centered behind the orb
      radial3: {
        color: "rgb(88, 62, 78)",
        cx: 200,
        cy: 245,
        r: 175,
        opacity: 0.25,
        stopPercent: "100%",
      },
      // Radial 4: Subtle warm base wash at bottom
      radial4: {
        color: "rgb(53, 43, 40)",
        cx: 200,
        cy: 824,
        r: 260,
        opacity: 0.70,
        stopPercent: "100%",
      },
      dawnBase: {
        start: "#191320",
        middle: "#191320",
        end: "#191320",
      },
      dawnRadial1: {
        color: "rgba(62,52,88,0.75)",
      },
      dawnRadial2: {
        color: "rgba(69,49,45,0.75)",
      },
      dawnRadial3: {
        color: "rgba(108,80,98,0.72)",
      },
      dawnRadial4: {
        color: "rgba(53,43,40,0.75)",
      },
    },
    onboarding: {
      card: {
        background: "rgba(51, 37, 56, 0.72)",          // --surface-glass: rgba(51,37,56,0.72)
        border: "rgba(199, 180, 191, 0.14)",           // --border-glass: rgba(199,180,191,0.14)
        shadowColor: "#000000",
        shadowOpacity: 0.18,
        iconBackground: "rgba(99, 66, 86, 0.70)",      // .ob-card .ic: rgba(99,66,86,0.7)
        iconColor: "#C9A3B9",                           // .ob-card .ic: #C9A3B9
        selectedBackground: "rgba(226, 122, 108, 0.17)",// --surface-selected: rgba(226,122,108,0.17)
        selectedBorder: "rgba(255, 255, 255, 0.09)",    // .ob-card.connected border-color
        selectedIconBackground: "rgba(99, 66, 86, 0.70)",
        selectedIconColor: "#C9A3B9",
        selectedTextColor: "#F3E7E1",
        selectedActionColor: "#E8907A",
        waitingBackground: "rgba(46, 39, 56, 0.72)",
        waitingBorder: "rgba(199, 180, 191, 0.14)",
        waitingIconBackground: "rgba(51, 37, 56, 0.90)",
        waitingIconColor: "rgba(199, 180, 191, 0.60)",
        waitingActionColor: "rgba(199, 180, 191, 0.68)",
      },
      chip: {
        background: "rgba(51, 37, 56, 0.72)",          // .ob-chip
        border: "rgba(199, 180, 191, 0.14)",
        textColor: "#F3E7E1",
        checkboxBorder: "rgba(199, 180, 191, 0.40)",
        selectedBackground: "rgba(226, 122, 108, 0.17)",// .ob-chip.sel
        selectedBorder: "rgba(255, 255, 255, 0.09)",
        selectedGradient: ["#E28266", "#D9735A"] as const,
      },
    },
  },
};
