import type { Confidence, ForecastDay, ForecastState } from "@heedly/native";

/**
 * Wording for the forecast the engine already computed. Nothing here decides
 * anything. The orb, band and direction stay Tank's, so no indicator wording.
 */

/** `slowing` has always shown as "Caution" on this screen. */
const STATE_WORD: Record<ForecastState, string> = {
  steady: "Steady",
  slowing: "Caution",
  rest_day: "Rest day",
};

const HORIZON_LABEL = ["TODAY", "TOMORROW", "DAY AFTER"];

export interface ForecastHeadline {
  headline1: string;
  headline2: string;
}

const CONFIDENT_HEADLINE: Record<ForecastState, ForecastHeadline> = {
  steady: { headline1: "Today, you have\n", headline2: "good reserves." },
  slowing: { headline1: "Today asks for\na ", headline2: "slower pace." },
  rest_day: { headline1: "Today is\n", headline2: "one for resting." },
};

/** Below medium, §6 hedges rather than asserts. */
const HEDGED_HEADLINE: Record<ForecastState, ForecastHeadline> = {
  steady: { headline1: "Today looks\n", headline2: "steady so far." },
  slowing: { headline1: "Today may ask for\na ", headline2: "slower pace." },
  rest_day: { headline1: "Today may be\n", headline2: "one for resting." },
};

const WHY_TEXT: Record<ForecastState, string | null> = {
  steady: "Why is today steady?",
  slowing: "Why caution today?",
  rest_day: "Why a rest day?",
};

export function isHedged(confidence: Confidence | null): boolean {
  return confidence !== "medium" && confidence !== "high";
}

/** Null whenever the engine said nothing. Never a stand-in word. */
export function stateWord(day: ForecastDay): string | null {
  return day.state ? STATE_WORD[day.state] : null;
}

export function dayLabel(day: ForecastDay): string | null {
  return HORIZON_LABEL[day.horizon] ?? null;
}

/** Today only: "Today is one for resting" cannot describe tomorrow. */
export function headline(day: ForecastDay): ForecastHeadline | null {
  if (day.horizon !== 0 || !day.state) return null;

  return isHedged(day.confidence)
    ? HEDGED_HEADLINE[day.state]
    : CONFIDENT_HEADLINE[day.state];
}

export function whyText(day: ForecastDay): string | null {
  if (day.horizon !== 0 || !day.state) return null;
  return WHY_TEXT[day.state];
}

function dayCount(params: Record<string, string>): number | null {
  const raw = params.days;
  if (raw === undefined) return null;

  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function plural(count: number, word: string): string {
  return count === 1 ? `1 ${word}` : `${count} ${word}s`;
}

function crashSentence(count: number | null): string {
  switch (count) {
    case 0:
      return "You logged a crash today.";
    case 1:
      return "You logged a crash yesterday.";
    case 2:
      return "You logged a crash two days ago.";
    default:
      return count === null
        ? "You logged a crash recently."
        : `You logged a crash ${count} days ago.`;
  }
}

/** Unknown keys read as nothing — a new key must not surface as an id. */
export function reasonSentence(day: ForecastDay): string | null {
  if (!day.reasonKey) return null;
  const count = dayCount(day.reasonParams);

  switch (day.reasonKey) {
    case "crash":
      return crashSentence(count);
    case "not_enough_recent_data":
      return "There isn't enough recent data to go on yet.";
    case "wearable_data_stale":
      return count === null
        ? "Your wearable hasn't synced recently."
        : `Your wearable hasn't synced in ${plural(count, "day")}.`;
    case "recent_check_ins_lower":
      return "Your own check-ins have been lower than usual lately.";
    case "autonomic_dip_plus_recent_load":
      return "Your overnight readings dipped after a busier stretch.";
    case "load_still_in_pipeline":
      return "Recent activity is still working its way through.";
    case "further_out_less_certain":
      return "This one is further out, so it's less certain.";
    case "settled_recent_days":
      return "Your recent days have been settled.";
    default:
      return null;
  }
}

const REASON_ICON: Record<string, string> = {
  crash: "bolt.slash",
  not_enough_recent_data: "hourglass",
  wearable_data_stale: "antenna.radiowaves.left.and.right.slash",
  recent_check_ins_lower: "arrow.down.right",
  autonomic_dip_plus_recent_load: "waveform.path.ecg",
  load_still_in_pipeline: "square.stack.3d.up",
  further_out_less_certain: "calendar",
  settled_recent_days: "checkmark.circle",
};

export function reasonIcon(reasonKey: string | null): string | null {
  if (!reasonKey) return null;
  return REASON_ICON[reasonKey] ?? null;
}

export function evidenceText(n: number): string {
  if (n === 0) return "No rated days behind this yet.";
  return n === 1
    ? "Based on 1 rated day of your own."
    : `Based on ${n} rated days of your own.`;
}

export interface ForecastReasonItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

/** The one reason the engine chose. Drill-down is v2 per `specs/bridge.ts`. */
export function reasonItem(day: ForecastDay): ForecastReasonItem | null {
  const sentence = reasonSentence(day);
  const icon = reasonIcon(day.reasonKey);
  if (!sentence || !icon || !day.reasonKey) return null;

  return {
    id: day.reasonKey,
    icon,
    title: sentence,
    description: evidenceText(day.n),
  };
}

export interface ForecastRowItem {
  dayLabel: string;
  value: string;
}

/** A day the engine could not call is left out rather than filled in. */
export function forecastRow(days: ForecastDay[]): ForecastRowItem[] {
  return days.flatMap((day) => {
    const label = dayLabel(day);
    const value = stateWord(day);
    return label && value ? [{ dayLabel: label, value }] : [];
  });
}
