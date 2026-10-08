import HeedlyNative from "@heedly/native";

import { formatDateString } from "./checkinStorage";
import { appStorage } from "@/utils/storage";
import { START_DATE_KEY } from "@/utils/storageKeys";

/** Mirrors the start date natively, where a background recompute can read it.
 *  Idempotent, and never overwrites an existing native value. */
export async function syncTrackingStartDate(): Promise<void> {
  try {
    const stored = await appStorage.getItem(START_DATE_KEY);
    if (!stored) return;

    const day = formatDateString(new Date(stored));
    if (day.includes("NaN")) return;

    if ((await HeedlyNative.getTrackingStartDate()) !== null) return;
    await HeedlyNative.setTrackingStartDate(day);
  } catch {
    // The screens still read the JavaScript value; only the background path waits.
  }
}
