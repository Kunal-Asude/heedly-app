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
      border: string;
      labelColor: string;
      shadowColor: string;
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
    };
    background: {
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
  };
}
