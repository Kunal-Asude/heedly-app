/**
 * Represents a single daily check-in record.
 *
 * DATE SEMANTICS:
 * - `date` represents the DAY BEING RECORDED (target date in YYYY-MM-DD format).
 *   In Heedly, check-ins are retrospective ("Check in for yesterday").
 *   If a user submits a check-in on Sep 2 about Sep 1, `date` is "2026-09-01".
 *   This enables historical accuracy for pattern tracking, trend analysis,
 *   and future backend synchronization.
 * - `completedAt` is the ISO timestamp when the check-in was first completed.
 * - `updatedAt` is the ISO timestamp of the latest edit/modification.
 *
 * DRAFT vs COMPLETED STATE:
 * - Optional fields represent an in-progress draft check-in.
 * - Once submitted, required fields (energyIndex, bodyIndex, tags) are populated.
 */
export interface CheckInEntry {
  /** The target day being recorded (YYYY-MM-DD), NOT the submission date. */
  date: string;

  /** Rating for yesterday: 'lighter' | 'same' | 'heavier' */
  yesterdayId?: "lighter" | "same" | "heavier" | null;
  yesterdayLabel?: string | null;
  yesterdayIndex?: number | null;

  /** Energy level index (0..4 corresponding to levels 1..5) */
  energyIndex?: number | null;
  energyLabel?: string | null;

  /** Body tenderness level index (0..4 corresponding to levels 1..5) */
  bodyIndex?: number | null;
  bodyLabel?: string | null;

  /** Notable tags selected during noting */
  tags: string[];

  /** Menstrual cycle day/flow details (e.g. "Day 2 · Medium flow") */
  periodInfo?: string | null;

  /** Flag indicating user checked "I'm in a crash" */
  isCrash: boolean;

  /** Flag indicating this is a first-time check-in (skips yesterday rating) */
  isFirstTime: boolean;

  /** ISO 8601 timestamp of initial completion */
  completedAt?: string;

  /** ISO 8601 timestamp of latest edit/modification */
  updatedAt?: string;
}

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
