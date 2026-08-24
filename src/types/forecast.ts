export type TodayStatusMode =
  | "fd-empty"
  | "fd-wearable"
  | "steady"
  | "caution"
  | "rest";

export type WaterState =
  | "empty"
  | "wearableRead"
  | "steady"
  | "caution"
  | "rest";

export interface DayForecastItem {
  dayLabel: string;
  value: string;
  dotColor: string;
}

export interface StatusConfig {
  headline1: string;
  headline2: string;
  indicatorText: string;
  indicatorDotColor: string;
  whyText?: string;
  microText?: string;
  noteText?: string;
  ctaText: string;
  footerNote?: string;
  isFirstDay?: boolean;
  orbSize?: number;
  waterState: WaterState;
  forecast?: DayForecastItem[];
}

export interface WhyModalItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface WhyModalData {
  badgeLabel: string;
  badgeBg: string;
  badgeDotColor: string;
  badgeTextColor: string;
  headingPrefix: string;
  headingAccent: string;
  subtitleText: string;
  reassuranceText: string;
  items: WhyModalItem[];
}

export interface ForecastData {
  statusConfigs: Record<TodayStatusMode, StatusConfig>;
  whyModalConfigs: Record<"caution" | "rest", WhyModalData>;
}
