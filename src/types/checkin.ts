export interface CheckInCategory {
  id: string;
  label: string;
  tags: string[];
}

export interface EnergyLevel {
  id: number;
  label: string;
  color: string;
  glowColor: string;
}

export interface YesterdayOption {
  id: string;
  prefix: string;
  emphasis: string;
  value: string;
  dotColor: string;
  cardBg: string;
  cardBorder: string;
}

export interface BodyLevel {
  id: number;
  label: string;
  color: string;
  glowColor: string;
}

export interface PlanningDayItem {
  id: string;
  day: string;
  date: number;
}

export interface PlanningPrediction {
  state: "caution" | "steady" | "rest";
  explanationTemplate: string;
  recommendation: string;
}

export interface CheckInConfig {
  categories: CheckInCategory[];
  allTags: string[];
  initialSelectedTags: string[];
  periodDays: number[];
  yesterdayOptions: YesterdayOption[];
  recurringEnergyLevels: EnergyLevel[];
  firstTimeEnergyLevels: EnergyLevel[];
  bodyLevels: BodyLevel[];
  planningDays: PlanningDayItem[];
  planningActivities: string[];
  defaultPlanningPrediction: PlanningPrediction;
}
