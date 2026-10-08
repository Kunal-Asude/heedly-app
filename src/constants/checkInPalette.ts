import { useThemeMode } from "@/contexts/ThemeContext";

/**
 * Check-in colours (.ci-*, .ob-* in Aubade - Today / Dusk Dark Mode / OLED).
 * One entry per theme so screens read values instead of nesting ternaries.
 */
export type CheckInPalette = {
  back: string;
  skip: string;
  dotOff: string;
  dotOn: [string, string];
  eyebrow: string;
  heading: string;
  accent: string;
  sub: string;
  lab: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  pillDot: string;
  crash: string;
  crashLine: string;
  foot: string;
  /** .ci-dot-0 … .ci-dot-4 */
  scale: [string, string, string, string, string];
  /** .ci-dot-N.sel ring */
  scaleGlow: [string, string, string, string, string];
  cta: [string, string, ...string[]];
  ctaHorizontal: boolean;
  ctaText: string;
  ctaShadowOpacity: number;
  /** .ci-tag; tagOnBg null = the light theme's coral gradient */
  tagBg: string;
  tagBorder: string;
  tagText: string;
  tagOnBg: string | null;
  tagOnBorder: string;
  tagOnText: string;
  tagCheck: string;
  /** .ci-browse / .ci-browse-chip */
  browseBg: string;
  browseBorder: string;
  browseLabel: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  /** .ci-filter-btn / .ci-search */
  fieldBg: string;
  fieldBorder: string;
  fieldIcon: string;
  filterOnBg: string;
  filterOnBorder: string;
  filterOnIcon: string;
  searchText: string;
  searchIcon: string;
  /** .ci-scrim / .ci-sheet / .ci-day */
  scrim: string;
  sheetBg: string;
  sheetBorder: string | null;
  grip: string;
  sheetSub: string;
  dayBg: string;
  dayBorder: string;
  dayText: string;
  dayOnBorder: string;
  dayOnText: string;
  sheetSkip: string;
  /** .ci-ypill.sage / .oat / .coral: [background, border, dot] */
  ypTones: Record<"sage" | "oat" | "coral", [string, string, string]>;
  ypText: string;
  ypRing: string;
  ypSkip: string;
  ypSkipLine: string;
  /** .ci-done-icon.check / .moon */
  doneCheck: [string, string, ...string[]];
  doneCheckIcon: string;
  doneMoon: [string, string, ...string[]];
  doneMoonIcon: string;
  lead: string;
  /** .ci-summary / .ci-srow */
  summaryBg: string;
  summaryBorder: string;
  summaryDivider: string;
  summaryKey: string;
  summaryValue: string;
  summaryNote: string;
  summaryDotOn: string;
  summaryDotOff: string;
  editHint: string;
  /** .ci-secondary */
  secondary: [string, string, ...string[]];
  secondaryHorizontal: boolean;
  secondaryBorder: string;
  secondaryText: string;
};

export const CHECK_IN_PALETTE: Record<"light" | "dusk" | "oled", CheckInPalette> = {
  light: {
    back: "rgba(74, 58, 57, 0.6)",
    skip: "rgba(74, 58, 57, 0.5)",
    dotOff: "rgba(74, 58, 57, 0.18)",
    dotOn: ["#f0a07e", "#e0735f"],
    eyebrow: "rgba(74, 58, 57, 0.5)",
    heading: "#463332",
    accent: "#b0532f",
    sub: "rgba(74, 58, 57, 0.66)",
    lab: "rgba(74, 58, 57, 0.55)",
    pillBg: "rgba(244, 164, 126, 0.16)",
    pillBorder: "rgba(255, 255, 255, 0.5)",
    pillText: "#4f3c3a",
    pillDot: "#ec7d5e",
    crash: "rgba(176, 83, 52, 0.85)",
    crashLine: "rgba(176, 83, 52, 0.4)",
    foot: "rgba(74, 58, 57, 0.5)",
    scale: ["#da6d82", "#e58d6f", "#f0c59e", "#bcc39c", "#94b094"],
    scaleGlow: [
      "rgba(218, 109, 130, 0.30)",
      "rgba(229, 141, 111, 0.30)",
      "rgba(240, 197, 158, 0.42)",
      "rgba(188, 195, 156, 0.42)",
      "rgba(148, 176, 148, 0.36)",
    ],
    cta: ["#f4a47e", "#ea846a", "#e0735f"],
    ctaHorizontal: false,
    ctaText: "#fff8f4",
    ctaShadowOpacity: 0.16,
    tagBg: "rgba(255, 252, 248, 0.76)",
    tagBorder: "rgba(255, 255, 255, 0.8)",
    tagText: "#5a4644",
    tagOnBg: null,
    tagOnBorder: "transparent",
    tagOnText: "#fff8f4",
    tagCheck: "#ffffff",
    browseBg: "rgba(255, 252, 248, 0.7)",
    browseBorder: "rgba(255, 255, 255, 0.8)",
    browseLabel: "rgba(74, 58, 57, 0.5)",
    chipBg: "rgba(255, 255, 255, 0.72)",
    chipBorder: "rgba(255, 255, 255, 0.85)",
    chipText: "#5a4644",
    fieldBg: "rgba(255, 252, 248, 0.82)",
    fieldBorder: "rgba(255, 255, 255, 0.8)",
    fieldIcon: "rgba(74, 58, 57, 0.6)",
    filterOnBg: "rgba(244, 164, 126, 0.2)",
    filterOnBorder: "rgba(224, 115, 95, 0.42)",
    filterOnIcon: "#c9603f",
    searchText: "#4f3c3a",
    searchIcon: "rgba(74, 58, 57, 0.42)",
    scrim: "rgba(74, 58, 57, 0.34)",
    sheetBg: "#fbf3ec",
    sheetBorder: null,
    grip: "rgba(120, 90, 90, 0.2)",
    sheetSub: "rgba(74, 58, 57, 0.6)",
    dayBg: "rgba(255, 255, 255, 0.72)",
    dayBorder: "rgba(255, 255, 255, 0.85)",
    dayText: "#5a4644",
    dayOnBorder: "transparent",
    dayOnText: "#fff8f4",
    sheetSkip: "rgba(74, 58, 57, 0.5)",
    ypTones: {
      sage: ["rgba(148, 176, 148, 0.14)", "rgba(148, 176, 148, 0.42)", "#94b094"],
      oat: ["rgba(233, 215, 188, 0.34)", "rgba(209, 184, 148, 0.5)", "#cdb488"],
      coral: ["rgba(224, 115, 95, 0.13)", "rgba(224, 115, 95, 0.42)", "#e0735f"],
    },
    ypText: "#4f3c3a",
    ypRing: "rgba(74, 58, 57, 0.28)",
    ypSkip: "#b05334",
    ypSkipLine: "rgba(176, 83, 52, 0.4)",
    doneCheck: ["#d3e5d6", "#a7c7b5"],
    doneCheckIcon: "#4f7359",
    doneMoon: ["#f4a47e", "#ea846a", "#e0735f"],
    doneMoonIcon: "#fff8f4",
    lead: "rgba(74, 58, 57, 0.7)",
    summaryBg: "rgba(255, 252, 248, 0.72)",
    summaryBorder: "rgba(255, 255, 255, 0.8)",
    summaryDivider: "rgba(120, 90, 90, 0.1)",
    summaryKey: "rgba(74, 58, 57, 0.5)",
    summaryValue: "#4f3c3a",
    summaryNote: "#5a4644",
    summaryDotOn: "#ec7d5e",
    summaryDotOff: "rgba(120, 90, 90, 0.18)",
    editHint: "rgba(74, 58, 57, 0.5)",
    secondary: ["rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.7)"],
    secondaryHorizontal: false,
    secondaryBorder: "rgba(255, 255, 255, 0.85)",
    secondaryText: "#5a4644",
  },
  dusk: {
    back: "rgba(199, 180, 191, 0.81)",
    skip: "rgba(199, 180, 191, 0.68)",
    dotOff: "rgba(199, 180, 191, 0.24)",
    dotOn: ["#E28266", "#D9735A"],
    eyebrow: "rgba(199, 180, 191, 0.68)",
    heading: "#F3E7E1",
    accent: "#E8907A",
    sub: "rgba(199, 180, 191, 0.89)",
    lab: "rgba(199, 180, 191, 0.74)",
    pillBg: "rgba(226, 122, 108, 0.16)",
    pillBorder: "rgba(255, 255, 255, 0.09)",
    pillText: "#F3E7E1",
    pillDot: "#D9735A",
    crash: "rgba(232, 144, 122, 0.98)",
    crashLine: "rgba(232, 144, 122, 0.46)",
    foot: "rgba(199, 180, 191, 0.68)",
    scale: ["#da6d82", "#e58d6f", "#f0c59e", "#bcc39c", "#86C4B4"],
    scaleGlow: [
      "rgba(226, 122, 140, 0.30)",
      "rgba(229, 141, 111, 0.30)",
      "rgba(240, 197, 158, 0.42)",
      "rgba(188, 195, 156, 0.42)",
      "rgba(134, 196, 180, 0.36)",
    ],
    cta: ["#634256", "#8A5D7C", "#9E768E"],
    ctaHorizontal: true,
    ctaText: "#FFF6F1",
    ctaShadowOpacity: 0.29,
    tagBg: "rgba(51, 37, 56, 0.72)",
    tagBorder: "rgba(255, 255, 255, 0.09)",
    tagText: "#F3E7E1",
    tagOnBg: "rgba(226, 122, 108, 0.17)",
    tagOnBorder: "rgba(255, 255, 255, 0.09)",
    tagOnText: "#F3E7E1",
    tagCheck: "#E8907A",
    browseBg: "rgba(51, 37, 56, 0.72)",
    browseBorder: "rgba(255, 255, 255, 0.09)",
    browseLabel: "rgba(199, 180, 191, 0.68)",
    chipBg: "rgba(51, 37, 56, 0.72)",
    chipBorder: "rgba(255, 255, 255, 0.09)",
    chipText: "#F3E7E1",
    fieldBg: "rgba(51, 37, 56, 0.72)",
    fieldBorder: "rgba(255, 255, 255, 0.09)",
    fieldIcon: "rgba(199, 180, 191, 0.81)",
    filterOnBg: "rgba(226, 122, 108, 0.17)",
    filterOnBorder: "rgba(255, 255, 255, 0.09)",
    filterOnIcon: "#E8907A",
    searchText: "#F3E7E1",
    searchIcon: "rgba(199, 180, 191, 0.57)",
    scrim: "rgba(18, 10, 20, 0.55)",
    sheetBg: "rgba(51, 37, 56, 0.72)",
    sheetBorder: null,
    grip: "rgba(199, 180, 191, 0.28)",
    sheetSub: "rgba(199, 180, 191, 0.81)",
    dayBg: "rgba(51, 37, 56, 0.72)",
    dayBorder: "rgba(199, 180, 191, 0.14)",
    dayText: "#F3E7E1",
    dayOnBorder: "rgba(255, 255, 255, 0.09)",
    dayOnText: "#F3E7E1",
    sheetSkip: "rgba(199, 180, 191, 0.68)",
    ypTones: {
      sage: ["rgba(134, 196, 180, 0.14)", "rgba(134, 196, 180, 0.42)", "#86C4B4"],
      oat: ["rgba(232, 168, 124, 0.18)", "rgba(232, 168, 124, 0.4)", "#cdb488"],
      coral: ["rgba(226, 122, 108, 0.13)", "rgba(226, 122, 108, 0.42)", "#E27A6C"],
    },
    ypText: "#F3E7E1",
    ypRing: "rgba(199, 180, 191, 0.38)",
    ypSkip: "#E8907A",
    ypSkipLine: "rgba(232, 144, 122, 0.46)",
    doneCheck: ["#4A6B55", "#33503F"],
    doneCheckIcon: "#C6DFCB",
    doneMoon: ["#8A4B3C", "#7A4234", "#6B3A2E"],
    doneMoonIcon: "#F3D9CD",
    lead: "rgba(199, 180, 191, 0.95)",
    summaryBg: "rgba(51, 37, 56, 0.72)",
    summaryBorder: "rgba(255, 255, 255, 0.09)",
    summaryDivider: "rgba(85, 68, 91, 0.3)",
    summaryKey: "rgba(199, 180, 191, 0.68)",
    summaryValue: "#F3E7E1",
    summaryNote: "#F3E7E1",
    summaryDotOn: "#D9735A",
    summaryDotOff: "rgba(85, 68, 91, 0.54)",
    editHint: "rgba(199, 180, 191, 0.68)",
    secondary: ["#634256", "#8A5D7C", "#9E768E"],
    secondaryHorizontal: true,
    secondaryBorder: "transparent",
    secondaryText: "#FFF6F1",
  },
  oled: {
    back: "#A8979E",
    skip: "#9A8A91",
    dotOff: "rgba(255, 255, 255, 0.07)",
    dotOn: ["#B85F47", "#B85F47"],
    eyebrow: "#9A8A91",
    heading: "#E9DDD6",
    accent: "#C97B60",
    sub: "#A8979E",
    lab: "#9A8A91",
    pillBg: "rgba(190, 106, 92, 0.14)",
    pillBorder: "rgba(255, 255, 255, 0.07)",
    pillText: "#E9DDD6",
    pillDot: "#B85F47",
    crash: "rgba(201, 123, 96, 0.98)",
    crashLine: "rgba(201, 123, 96, 0.46)",
    foot: "#9A8A91",
    scale: ["#A05A66", "#A56E55", "#B09270", "#8A9070", "#6E9678"],
    scaleGlow: [
      "rgba(190, 106, 92, 0.30)",
      "rgba(165, 110, 85, 0.30)",
      "rgba(176, 146, 112, 0.42)",
      "rgba(138, 144, 112, 0.42)",
      "rgba(110, 150, 120, 0.36)",
    ],
    // .screen .ob-cta override in the OLED file
    cta: ["#574049", "#241A20"],
    ctaHorizontal: false,
    ctaText: "#EADCD4",
    ctaShadowOpacity: 0,
    tagBg: "#16111B",
    tagBorder: "rgba(255, 255, 255, 0.07)",
    tagText: "#E9DDD6",
    tagOnBg: "rgba(190, 106, 92, 0.14)",
    tagOnBorder: "rgba(255, 255, 255, 0.07)",
    tagOnText: "#E9DDD6",
    tagCheck: "#C97B60",
    browseBg: "#16111B",
    browseBorder: "rgba(255, 255, 255, 0.07)",
    browseLabel: "#9A8A91",
    chipBg: "#16111B",
    chipBorder: "rgba(255, 255, 255, 0.07)",
    chipText: "#E9DDD6",
    fieldBg: "#16111B",
    fieldBorder: "rgba(255, 255, 255, 0.07)",
    fieldIcon: "#A8979E",
    filterOnBg: "rgba(190, 106, 92, 0.14)",
    filterOnBorder: "rgba(255, 255, 255, 0.07)",
    filterOnIcon: "#C97B60",
    searchText: "#E9DDD6",
    searchIcon: "#9A8A91",
    scrim: "rgba(18, 10, 20, 0.55)",
    sheetBg: "#16111B",
    sheetBorder: "rgba(255, 255, 255, 0.07)",
    grip: "rgba(255, 255, 255, 0.07)",
    sheetSub: "#A8979E",
    dayBg: "#16111B",
    dayBorder: "rgba(255, 255, 255, 0.07)",
    dayText: "#E9DDD6",
    dayOnBorder: "rgba(255, 255, 255, 0.07)",
    dayOnText: "#E9DDD6",
    sheetSkip: "#9A8A91",
    ypTones: {
      sage: ["rgba(110, 150, 120, 0.14)", "rgba(110, 150, 120, 0.42)", "#6E9678"],
      oat: ["rgba(194, 154, 95, 0.14)", "rgba(194, 154, 95, 0.4)", "#C29A5F"],
      coral: ["rgba(190, 106, 92, 0.14)", "rgba(190, 106, 92, 0.42)", "#BE6A5C"],
    },
    ypText: "#E9DDD6",
    ypRing: "rgba(255, 255, 255, 0.16)",
    ypSkip: "#C97B60",
    ypSkipLine: "rgba(201, 123, 96, 0.46)",
    doneCheck: ["#2C4235", "#2C4235"],
    doneCheckIcon: "#9FB8A6",
    doneMoon: ["#5A3128", "#5A3128"],
    doneMoonIcon: "#D8BFB4",
    lead: "#A8979E",
    summaryBg: "#16111B",
    summaryBorder: "rgba(255, 255, 255, 0.07)",
    summaryDivider: "rgba(255, 255, 255, 0.07)",
    summaryKey: "#9A8A91",
    summaryValue: "#E9DDD6",
    summaryNote: "#E9DDD6",
    summaryDotOn: "#B85F47",
    summaryDotOff: "rgba(255, 255, 255, 0.07)",
    editHint: "#9A8A91",
    // .screen .ci-secondary override in the OLED file
    secondary: ["#574049", "#241A20"],
    secondaryHorizontal: false,
    secondaryBorder: "transparent",
    secondaryText: "#EADCD4",
  },
};

export function useCheckInPalette() {
  const { isDark, isTrueBlack } = useThemeMode();
  return CHECK_IN_PALETTE[isDark ? (isTrueBlack ? "oled" : "dusk") : "light"];
}
