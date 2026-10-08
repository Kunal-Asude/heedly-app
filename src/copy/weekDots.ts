/** Reported check-in energy for the Patterns week strip. Not tank, not forecast. */

const ENERGY_SIZE: Record<number, number> = { 1: 20, 2: 24, 3: 28, 4: 32, 5: 36 };

const ENERGY_COLOR: Record<number, string> = {
  1: "#DC6B76",
  2: "#E08568",
  3: "#E7B874",
  4: "#A5C49F",
  5: "#7BA98B",
};

const EMPTY_SIZE = 12;
const EMPTY_COLOR = "rgba(140, 120, 130, 0.18)";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export const ENERGY_LEGEND = [
  { label: "Drained", color: ENERGY_COLOR[1] },
  { label: "Middling", color: ENERGY_COLOR[3] },
  { label: "High", color: ENERGY_COLOR[5] },
];

export interface DotStyle {
  size: number;
  color: string;
}

export interface WeekDay {
  date: Date;
  day: string;
}

export function energyDot(energy: number | null | undefined): DotStyle {
  if (energy == null || !(energy in ENERGY_SIZE)) {
    return { size: EMPTY_SIZE, color: EMPTY_COLOR };
  }
  return { size: ENERGY_SIZE[energy], color: ENERGY_COLOR[energy] };
}

/** Seven days ending yesterday — the newest day a check-in can record. */
export function weekDays(today: Date): WeekDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7 + index,
    );
    return { date, day: DAY_LETTERS[date.getDay()] };
  });
}
