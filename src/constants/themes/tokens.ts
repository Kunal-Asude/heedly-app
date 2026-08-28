/**
 * Design Token Types
 *
 * This file defines the complete structure for all design tokens
 * across all three themes: Light, Dark, and True Black.
 *
 * Each theme must implement this interface completely.
 */

export interface DesignTokens {
  // ─── Typography ──────────────────────────────────────────────────────
  typography: {
    editorial: number;
    title: number;
    hello: number;
    cta: number;
    body: number;
    note: number;
    label: number;
    eyebrow: number;
    eyebrowTracking: number;
  };

  // ─── Border Radii ────────────────────────────────────────────────────
  radii: {
    pill: number;
    cta: number;
    card: number;
    tile: number;
    input: number;
  };

  // ─── Colors: Text & Ink ──────────────────────────────────────────────
  ink: {
    display: string;
    body: string;
    subtle: string;
    dark: string;
    soft: string;
    muted: string;
    faint: string;
  };

  // ─── Colors: Semantic (Brand) ────────────────────────────────────────
  coral: {
    primary: string;
    mid: string;
    light: string;
    terracotta: string;
    terracottaDeep: string;
    terracottaHover: string;
  };

  // ─── State Colors ────────────────────────────────────────────────────
  states: {
    steady: {
      color: string;
      chart: string;
      bg: string;
      ring: string;
      ink: string;
      label: string;
    };
    caution: {
      color: string;
      chart: string;
      bg: string;
      ring: string;
      label: string;
    };
    rest: {
      color: string;
      chart: string;
      bg: string;
      ring: string;
      label: string;
    };
  };

  // ─── Surface Colors ──────────────────────────────────────────────────
  surfaces: {
    card: string;
    cream: string;
    glass: string;
    background: string;
  };

  // ─── Borders ──────────────────────────────────────────────────────────
  borders: {
    card: string;
    hairline: string;
    glass: string;
    divider: string;
  };

  // ─── Accents & Highlights ────────────────────────────────────────────
  accents: {
    oat: {
      main: string;
      bg: string;
      border: string;
    };
  };

  // ─── Shadows ──────────────────────────────────────────────────────────
  shadows: {
    chip: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    card: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    cta: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    bar: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };

  // ─── Component-Specific Tokens ──────────────────────────────────────
  components: {
    header: {
      dateColor: string;
      greetingColor: string;
      settingsBg: string;
      settingsBorder: string;
      settingsIconColor: string;
      settingsShadowColor: string;
    };
    cta: {
      gradient: [string, string, ...string[]];
      textColor: string;
      borderColor: string;
      shadowColor: string;
      shadowOpacity: number;
    };
    badge: {
      learning: {
        background: string;
        border: string;
        dot: string;
        text: string;
      };
      statusText: string;
    };
    supportingText: {
      color: string;
      noteColor: string;
    };
    tabBar: {
      background: string;
      border: string;
      selectedPill: string;
      selectedText: string;
      unselectedText: string;
      shadowColor: string;
    };
    forecastCard: {
      background: string;
      gradient?: [string, string, ...string[]];
      border: string;
      labelColor: string;
      valueColor: string;
      shadowColor: string;
      shadowOpacity: number;
      divider: string;
    };
    energyOrb: {
      steady: {
        topColor: string;
        botColor: string;
        alphaTop: number;
        alphaBot: number;
        crestColor: string;
      };
      caution: {
        topColor: string;
        botColor: string;
        alphaTop: number;
        alphaBot: number;
        crestColor: string;
      };
      rest: {
        topColor: string;
        botColor: string;
        alphaTop: number;
        alphaBot: number;
        crestColor: string;
      };
      wearableRead: {
        topColor: string;
        botColor: string;
        alphaTop: number;
        alphaBot: number;
        crestColor: string;
      };
      learning: {
        topColor: string;
        botColor: string;
        alphaTop: number;
        alphaBot: number;
        crestColor: string;
      };
      /**
       * Glass sphere visual treatment tokens.
       * These differ between Dawn (warm peach) and Dusk (dark plum glass).
       * All values are sourced directly from the design handoff HTML/CSS.
       */
      glass: {
        /** Core radial gradient stops for the glass sphere headspace.
         *  Dawn: warm peach core (#f9e5da → #f4d1c1 → #ebbca9)
         *  Dusk: dark plum — --orb-glass:
         *    rgba(58,42,63,0.58) → rgba(52,38,58,0.62) 68% → rgba(44,32,50,0.7) 100%
         */
        coreInner: string;   // center stop color
        coreMid: string;     // 68% stop color
        coreOuter: string;   // 100% stop color
        coreInnerAlpha: number;
        coreMidAlpha: number;
        coreOuterAlpha: number;

        /** Per-state bottom glow (tinted reflection at base of headspace).
         *  Each is a radial-gradient color + opacity for the bottom bloom.
         *  Dusk steady:  rgba(213,233,198,0.28)  — sage/green
         *  Dusk caution: rgba(250,198,170,0.26)  — peach
         *  Dusk rest:    rgba(232,132,140,0.24)  — rose
         *  Dawn uses its own warm cream glows (bottomGlow: #ffe6c4)
         */
        steadyGlowColor: string;
        steadyGlowAlpha: number;
        cautionGlowColor: string;
        cautionGlowAlpha: number;
        restGlowColor: string;
        restGlowAlpha: number;

        /** Brand/empty orb ember glow (bottom-center warm accent, no waterline).
         *  Dusk: --orb-ember rgba(232,180,154,0.5) → rgba(232,180,154,0.16) → rgba(232,180,154,0)
         *  Dawn: rgba(255,222,178,0.95) warm cream
         */
        emberColor: string;
        emberAlpha0: number;  // 0% stop
        emberAlpha45: number; // 45% stop
        emberAlpha68: number; // 68% stop (= 0 in Dusk)

        /** Frosted milky veil (.glass::after).
         *  Dusk: --orb-veil rgba(255,255,255,0.12) at 50% 30%
         *  Dawn: rgba(255,255,255,0.38) at 50% 32%
         */
        veilAlpha: number;

        /** Rim inset shadow highlight colors (--orb-rim).
         *  Dusk: rgba(233,214,226,…) warm lilac  Dawn: rgba(255,255,255,…) white
         */
        rimColor: string;     // base rim color (raw rgb, no alpha)
        rimTopAlpha: number;  // inset 0 12px  — top inner rim
        rimBotAlpha: number;  // inset 0 -10px — bottom inner shadow
        rimRingAlpha: number; // inset 0 0 0 1.5px — thin ring
        rimSideAlpha: number; // inset 6px 0 24px  — left side light

        /** Outer halo gradient for the three stateful states (steady/caution/wearableRead).
         *  Dusk steady/caution/wearableRead:
         *    rgba(212,232,196,0.16) → rgba(255,206,170,0.08) at 45% → transparent 70%
         *  Dusk rest:
         *    rgba(236,142,148,0.15) → rgba(255,192,182,0.07) at 45% → transparent 70%
         *  Brand / empty:
         *    rgba(255,206,170,0.2) → rgba(247,190,176,0.09) at 45% → transparent 70%
         *  Dawn: rgba(255,206,170,0.45) → rgba(247,200,210,0.2) at 45% → transparent 70%
         */
        haloInnerColor: string;   // center stop for steady/caution/wearableRead halo
        haloInnerAlpha: number;
        haloMidColor: string;     // 45% stop
        haloMidAlpha: number;
        restHaloInnerColor: string;  // rest-specific center
        restHaloInnerAlpha: number;
        restHaloMidColor: string;
        restHaloMidAlpha: number;
        brandHaloInnerColor: string; // brand/empty
        brandHaloInnerAlpha: number;
        brandHaloMidColor: string;
        brandHaloMidAlpha: number;
      };
    };
    background: {
      type: "gradient" | "solid";
      baseColor: string;
      baseLinear?: {
        start: string;
        middle: string;
        end: string;
      };
      radial1: {
        color: string;
        cx: number;
        cy: number;
        r: number;
        opacity: number;
        stopPercent: string;
      };
      radial2: {
        color: string;
        cx: number;
        cy: number;
        r: number;
        opacity: number;
        stopPercent: string;
      };
      radial3: {
        color: string;
        cx: number;
        cy: number;
        r: number;
        opacity: number;
        stopPercent: string;
      };
      radial4: {
        color: string;
        cx: number;
        cy: number;
        r: number;
        opacity: number;
        stopPercent: string;
      };
      dawnBase: {
        start: string;
        middle: string;
        end: string;
      };
      dawnRadial1: {
        color: string;
      };
      dawnRadial2: {
        color: string;
      };
      dawnRadial3: {
        color: string;
      };
      dawnRadial4: {
        color: string;
      };
    };
    onboarding: {
      card: {
        background: string;
        border: string;
        shadowColor: string;
        shadowOpacity: number;
        iconBackground: string;
        iconColor: string;
        selectedBackground: string;
        selectedBorder: string;
        selectedIconBackground: string;
        selectedIconColor: string;
        selectedTextColor: string;
        selectedActionColor: string;
        waitingBackground: string;
        waitingBorder: string;
        waitingIconBackground: string;
        waitingIconColor: string;
        waitingActionColor: string;
      };
      chip: {
        background: string;
        border: string;
        textColor: string;
        checkboxBorder: string;
        selectedBackground: string;
        selectedBorder: string;
        selectedGradient: readonly [string, string];
      };
    };
  };
}
