import HeedlyNative from "@/services/heedlyNative";

import { formatDateString, getRecordedCheckInDate } from "./checkinStorage";

/** The one editable day: the day before the normal check-in's date. */
export function editableEarlierDate(
  recorded: string = getRecordedCheckInDate(),
): string {
  const [y, m, d] = recorded.split("-").map(Number);
  return formatDateString(new Date(y, m - 1, d - 1));
}

export function dayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
  });
}

export async function hasCheckIn(date: string): Promise<boolean> {
  try {
    return (await HeedlyNative.getCheckIn(date)) !== null;
  } catch {
    return false;
  }
}
