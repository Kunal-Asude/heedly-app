import type {
  StatusConfig,
  TodayStatusMode,
  WhyModalData,
} from "@/types/forecast";

/** The chrome around the forecast. Nothing here describes the person's data. */
export const TODAY_STATUS_COPY: Record<TodayStatusMode, StatusConfig> = {
  "fd-empty": {
    headline1: "Early days ",
    headline2: "yet.",
    indicatorText: "EARLY DAYS",
    indicatorDotColor: "#7E9B6A",
    microText: "Tracking your patterns.",
    noteText:
      "Your forecast appears once your personal pattern takes shape — usually a few days.",
    ctaText: "Start your first check-in",
    footerNote: "You can do this lying down.",
    isFirstDay: true,
    orbSize: 152,
    waterState: "empty",
  },
  "fd-wearable": {
    headline1: "An early ",
    headline2: "read.",
    indicatorText: "EARLY DAYS",
    indicatorDotColor: "#7E9B6A",
    microText: "A first read from your wearable.",
    noteText: "These get sharper as your baseline fills in.",
    ctaText: "What's going on",
    isFirstDay: true,
    orbSize: 254,
    waterState: "wearableRead",
  },
  steady: {
    headline1: "Today, you have\n",
    headline2: "good reserves.",
    indicatorText: "holding steady",
    indicatorDotColor: "#7E9B6A",
    ctaText: "How is it going?",
    footerNote: "Planning something this week?",
    waterState: "steady",
  },
  caution: {
    headline1: "Today asks for\n",
    headline2: "a slower pace.",
    indicatorText: "caution today",
    indicatorDotColor: "#D99843",
    whyText: "Why caution today?",
    ctaText: "How is it going?",
    footerNote: "Planning something this week?",
    waterState: "caution",
  },
  rest: {
    headline1: "Today is\n",
    headline2: "one for resting.",
    indicatorText: "resting today",
    indicatorDotColor: "#E0735F",
    whyText: "Why a rest day?",
    ctaText: "How is it going?",
    footerNote: "Planning something this week?",
    waterState: "rest",
  },
};

/** The modal's frame. Its reasons come from the engine via `reasonItem`. */
export const WHY_MODAL_COPY: Record<"caution" | "rest", WhyModalData> = {
  caution: {
    badgeLabel: "Caution",
    badgeBg: "#F4E2C7",
    badgeDotColor: "#D4A545",
    badgeTextColor: "#B57E32",
    headingPrefix: "Why caution ",
    headingAccent: "today?",
    subtitleText:
      "Today asks for a slower pace. Here's what we've been seeing:",
    reassuranceText:
      "Nothing you did wrong — today just calls for a gentler pace. We'll keep an eye on it with you.",
    items: [],
  },
  rest: {
    badgeLabel: "Rest day",
    badgeBg: "#FCE4E6",
    badgeDotColor: "#DC6B76",
    badgeTextColor: "#DC6B76",
    headingPrefix: "Why a ",
    headingAccent: "rest day?",
    subtitleText:
      "Today looks like a day to go easy. Here's what we've been seeing:",
    reassuranceText:
      "Nothing you did wrong — a body like yours just needs the recovery.",
    items: [],
  },
};
