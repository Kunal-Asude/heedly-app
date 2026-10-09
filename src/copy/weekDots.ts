/** Reported check-in energy for the Patterns week strip. Not tank, not forecast. */

const STATE_COLOR = {
  steady: "#94b094",
  caution: "#f0c59e",
  rest: "#da6d82",
} as const;

type EnergyState = keyof typeof STATE_COLOR;

const EMPTY_SIZE = 12;
const EMPTY_COLOR = "rgba(140, 120, 130, 0.18)";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

/** OLED (patterns-oled.jsx): the same states in the dimmed True Black palette. */
const OLED_STATE_COLOR: Record<string, string> = {
  [STATE_COLOR.steady]: "#6E9678",
  [STATE_COLOR.caution]: "#C29A5F",
  [STATE_COLOR.rest]: "#BE6A5C",
};

/** A week-dot or legend colour as True Black shows it; other colours pass through. */
export function oledDotColor(color: string): string {
  return OLED_STATE_COLOR[color] ?? color;
}

export const ENERGY_LEGEND = [
  { label: "Steady", color: STATE_COLOR.steady },
  { label: "Caution", color: STATE_COLOR.caution },
  { label: "Rest day", color: STATE_COLOR.rest },
];

export interface DotStyle {
  size: number;
  color: string;
}

export interface WeekDay {
  date: Date;
  day: string;
}

/** Smallest dot stays legible at 17px, largest fills the 36px zone. */
function dotSize(energy: number): number {
  return 17 + ((energy - 1) / 4) * 19;
}

function dotState(energy: number): EnergyState {
  if (energy >= 4) return "steady";
  if (energy === 3) return "caution";
  return "rest";
}

export function energyDot(energy: number | null | undefined): DotStyle {
  if (energy == null || !Number.isInteger(energy) || energy < 1 || energy > 5) {
    return { size: EMPTY_SIZE, color: EMPTY_COLOR };
  }
  return { size: dotSize(energy), color: STATE_COLOR[dotState(energy)] };
}

/** Seven days ending today — the newest day a check-in can record. */
export function weekDays(today: Date): WeekDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 6 + index,
    );
    return { date, day: DAY_LETTERS[date.getDay()] };
  });
}
