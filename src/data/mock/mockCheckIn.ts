import type {
  CheckInCategory,
  CheckInConfig,
  EnergyLevel,
  BodyLevel,
  PlanningDayItem,
  YesterdayOption,
} from "@/types/checkin";

export const MOCK_CATEGORIES: CheckInCategory[] = [
  {
    id: "activities",
    label: "Activities",
    tags: [
      "physical activity",
      "walking",
      "standing",
      "deep focus",
      "screens",
      "social interaction",
    ],
  },
  {
    id: "mind_mood",
    label: "Mind & mood",
    tags: ["deep focus", "brain fog", "social interaction", "screens"],
  },
  {
    id: "environment",
    label: "Environment",
    tags: ["warm room", "heat exposure", "noise"],
  },
  {
    id: "symptoms",
    label: "Symptoms",
    tags: [
      "brain fog",
      "headache",
      "poor sleep",
      "pain flare",
      "joint pain",
      "sore throat",
      "heart racing",
      "breathlessness",
      "nausea",
      "dizziness",
    ],
  },
  {
    id: "body",
    label: "Body",
    tags: [
      "poor sleep",
      "pain flare",
      "joint pain",
      "sore throat",
      "heart racing",
      "breathlessness",
      "nausea",
      "dizziness",
    ],
  },
  {
    id: "other",
    label: "Other",
    tags: ["noise", "warm room", "heat exposure"],
  },
];

export const MOCK_ALL_TAGS: string[] = [
  "social interaction",
  "screens",
  "warm room",
  "deep focus",
  "physical activity",
  "heat exposure",
  "standing",
  "walking",
  "brain fog",
  "headache",
  "poor sleep",
  "pain flare",
  "joint pain",
  "sore throat",
  "heart racing",
  "breathlessness",
  "nausea",
  "dizziness",
  "noise",
];

export const MOCK_INITIAL_SELECTED_TAGS = [
  "social interaction",
  "screens",
  "warm room",
];

export const MOCK_PERIOD_DAYS = [1, 2, 3, 4, 5, 6, 7];

export const MOCK_YESTERDAY_OPTIONS: YesterdayOption[] = [
  {
    id: "lighter",
    prefix: "Lighter than ",
    emphasis: "usual",
    value: "Lighter than usual",
    dotColor: "#85B58E",
    cardBg: "rgba(225, 238, 227, 0.65)",
    cardBorder: "rgba(133, 181, 142, 0.4)",
  },
  {
    id: "usual",
    prefix: "About the ",
    emphasis: "same",
    value: "About the same",
    dotColor: "#D4B278",
    cardBg: "rgba(247, 241, 230, 0.65)",
    cardBorder: "rgba(212, 178, 120, 0.4)",
  },
  {
    id: "heavier",
    prefix: "Heavier than ",
    emphasis: "usual",
    value: "Heavier than usual",
    dotColor: "#DC7B6E",
    cardBg: "rgba(248, 227, 224, 0.65)",
    cardBorder: "rgba(220, 123, 110, 0.4)",
  },
];

export const MOCK_RECURRING_ENERGY_LEVELS: EnergyLevel[] = [
  { id: 0, label: "drained", color: "#DC6B76", glowColor: "rgba(220, 107, 118, 0.3)" },
  { id: 1, label: "low", color: "#E08568", glowColor: "rgba(224, 133, 104, 0.3)" },
  { id: 2, label: "middling", color: "#E7B874", glowColor: "rgba(231, 184, 116, 0.35)" },
  { id: 3, label: "good", color: "#A5C49F", glowColor: "rgba(165, 196, 159, 0.35)" },
  { id: 4, label: "high", color: "#7BA98B", glowColor: "rgba(123, 169, 139, 0.35)" },
];

export const MOCK_FIRST_TIME_ENERGY_LEVELS: EnergyLevel[] = [
  { id: 0, label: "awful", color: "#DC6B76", glowColor: "rgba(220, 107, 118, 0.3)" },
  { id: 1, label: "poor", color: "#E08568", glowColor: "rgba(224, 133, 104, 0.3)" },
  { id: 2, label: "okay", color: "#E7B874", glowColor: "rgba(231, 184, 116, 0.35)" },
  { id: 3, label: "good", color: "#A5C49F", glowColor: "rgba(165, 196, 159, 0.35)" },
  { id: 4, label: "great", color: "#7BA98B", glowColor: "rgba(123, 169, 139, 0.35)" },
];

export const MOCK_BODY_LEVELS: BodyLevel[] = [
  { id: 0, label: "in a flare", color: "#DC6B76", glowColor: "rgba(220, 107, 118, 0.3)" },
  { id: 1, label: "heavy", color: "#E08568", glowColor: "rgba(224, 133, 104, 0.3)" },
  { id: 2, label: "tender", color: "#E7B874", glowColor: "rgba(231, 184, 116, 0.35)" },
  { id: 3, label: "settled", color: "#A5C49F", glowColor: "rgba(165, 196, 159, 0.35)" },
  { id: 4, label: "calm", color: "#7BA98B", glowColor: "rgba(123, 169, 139, 0.35)" },
];

export const MOCK_PLANNING_DAYS: PlanningDayItem[] = [
  { id: "wed-21", day: "WED", date: 21 },
  { id: "thu-22", day: "THU", date: 22 },
  { id: "fri-23", day: "FRI", date: 23 },
  { id: "sat-24", day: "SAT", date: 24 },
  { id: "sun-25", day: "SUN", date: 25 },
  { id: "mon-26", day: "MON", date: 26 },
];

export const MOCK_PLANNING_ACTIVITIES: string[] = [
  "Social",
  "Work / mental",
  "Physical",
  "Travel",
  "Appointment",
];

export const MOCK_CHECKIN_CONFIG: CheckInConfig = {
  categories: MOCK_CATEGORIES,
  allTags: MOCK_ALL_TAGS,
  initialSelectedTags: MOCK_INITIAL_SELECTED_TAGS,
  periodDays: MOCK_PERIOD_DAYS,
  yesterdayOptions: MOCK_YESTERDAY_OPTIONS,
  recurringEnergyLevels: MOCK_RECURRING_ENERGY_LEVELS,
  firstTimeEnergyLevels: MOCK_FIRST_TIME_ENERGY_LEVELS,
  bodyLevels: MOCK_BODY_LEVELS,
  planningDays: MOCK_PLANNING_DAYS,
  planningActivities: MOCK_PLANNING_ACTIVITIES,
  defaultPlanningPrediction: {
    state: "caution",
    explanationTemplate: "{dayName} follows two heavier days\n— your reserves are likely to be low.",
    recommendation:
      "If it can move, midweek looks easier — or keep Friday light to give yourself room.",
  },
};
