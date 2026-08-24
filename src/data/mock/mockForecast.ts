import type { ForecastData, TodayStatusMode, StatusConfig, WhyModalData } from "@/types/forecast";

const COLORS = {
  greenDot: "#7E9B6A",
  cautionDot: "#D99843",
  restDot: "#E0735F",
};

export const MOCK_STATUS_CONFIGS: Record<TodayStatusMode, StatusConfig> = {
  "fd-empty": {
    headline1: "Still learning ",
    headline2: "you.",
    indicatorText: "LEARNING",
    indicatorDotColor: "#7E9B6A",
    microText: "Getting to know your patterns.",
    noteText:
      "Your forecast appears once I've learned your rhythm — usually a few days.",
    ctaText: "Start your first check-in",
    footerNote: "You can do this lying down.",
    isFirstDay: true,
    waterState: "empty",
  },
  "fd-wearable": {
    headline1: "An early ",
    headline2: "read.",
    indicatorText: "LEARNING",
    indicatorDotColor: "#7E9B6A",
    microText: "A first read from your wearable.",
    noteText: "These get sharper as I learn you.",
    ctaText: "How is it going?",
    isFirstDay: true,
    waterState: "wearableRead",
    forecast: [
      { dayLabel: "TODAY", value: "Steady", dotColor: COLORS.greenDot },
      { dayLabel: "TOMORROW", value: "Steady", dotColor: COLORS.greenDot },
      { dayLabel: "DAY AFTER", value: "Steady", dotColor: COLORS.greenDot },
    ],
  },
  steady: {
    headline1: "Today, you have\n",
    headline2: "good reserves.",
    indicatorText: "holding steady",
    indicatorDotColor: COLORS.greenDot,
    ctaText: "How is it going?",
    footerNote: "Planning something this week?",
    waterState: "steady",
    forecast: [
      { dayLabel: "TODAY", value: "Steady", dotColor: COLORS.greenDot },
      { dayLabel: "TOMORROW", value: "Steady", dotColor: COLORS.greenDot },
      { dayLabel: "DAY AFTER", value: "Caution", dotColor: COLORS.cautionDot },
    ],
  },
  caution: {
    headline1: "Today asks for\n",
    headline2: "a slower pace.",
    indicatorText: "caution today",
    indicatorDotColor: COLORS.cautionDot,
    whyText: "Why caution today?",
    ctaText: "How is it going?",
    footerNote: "Planning something this week?",
    waterState: "caution",
    forecast: [
      { dayLabel: "TODAY", value: "Caution", dotColor: COLORS.cautionDot },
      { dayLabel: "TOMORROW", value: "Steady", dotColor: COLORS.greenDot },
      { dayLabel: "DAY AFTER", value: "Steady", dotColor: COLORS.greenDot },
    ],
  },
  rest: {
    headline1: "Today is\n",
    headline2: "one for resting.",
    indicatorText: "resting today",
    indicatorDotColor: COLORS.restDot,
    whyText: "Why a rest day?",
    ctaText: "How is it going?",
    footerNote: "Planning something this week?",
    waterState: "rest",
    forecast: [
      { dayLabel: "TODAY", value: "Rest day", dotColor: COLORS.restDot },
      { dayLabel: "TOMORROW", value: "Caution", dotColor: COLORS.cautionDot },
      { dayLabel: "DAY AFTER", value: "Steady", dotColor: COLORS.greenDot },
    ],
  },
};

export const MOCK_WHY_MODAL_CONFIGS: Record<"caution" | "rest", WhyModalData> = {
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
    items: [
      {
        id: "c1",
        icon: "square.stack.3d.up",
        title: "A heavier couple of days",
        description: "Your tank hasn't fully refilled since the weekend.",
      },
      {
        id: "c2",
        icon: "waveform.path.ecg",
        title: "Your overnight heart rate ran a little high",
        description:
          "Often an early sign your body's working harder to recover.",
      },
      {
        id: "c3",
        icon: "moon.fill",
        title: "A short night this week",
        description:
          "Shorter sleep tends to catch up with you a day or two later.",
      },
    ],
  },
  rest: {
    badgeLabel: "Rest day",
    badgeBg: "#FCE4E6",
    badgeDotColor: "#DC6B76",
    badgeTextColor: "#DC6B76",
    headingPrefix: "Why a ",
    headingAccent: "rest day?",
    subtitleText:
      "Tomorrow looks like a day to go easy. Here's what we've been seeing:",
    reassuranceText:
      "Nothing you did wrong — a body like yours just needs the recovery. We'll keep tomorrow light for you.",
    items: [
      {
        id: "r1",
        icon: "square.stack.3d.up",
        title: "Three heavier days in a row",
        description: "Your tank hasn't had a chance to refill since Tuesday.",
      },
      {
        id: "r2",
        icon: "waveform.path.ecg",
        title: "Your overnight heart rate stayed high",
        description:
          "Often an early sign your body's working harder to recover.",
      },
      {
        id: "r3",
        icon: "moon.fill",
        title: "Two late nights this week",
        description:
          "Shorter sleep tends to catch up with you a day or two later.",
      },
    ],
  },
};

export const MOCK_FORECAST_DATA: ForecastData = {
  statusConfigs: MOCK_STATUS_CONFIGS,
  whyModalConfigs: MOCK_WHY_MODAL_CONFIGS,
};
