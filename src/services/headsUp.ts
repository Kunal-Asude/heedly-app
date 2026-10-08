import HeedlyNative from "@heedly/native";

import { appStorage } from "@/utils/storage";
import { HEADS_UP_KEY } from "@/utils/storageKeys";

export const HEADS_UP_DEFAULT = true;

/** `null` means never asked. */
export async function readHeadsUpPreference(): Promise<boolean | null> {
  try {
    const stored = await appStorage.getItem(HEADS_UP_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
    return null;
  } catch {
    return null;
  }
}

export async function headsUpEnabled(): Promise<boolean> {
  return (await readHeadsUpPreference()) ?? HEADS_UP_DEFAULT;
}

/** Written both sides: screens read JavaScript, a background run reads native. */
export async function setHeadsUpPreference(enabled: boolean): Promise<void> {
  try {
    await appStorage.setItem(HEADS_UP_KEY, enabled ? "true" : "false");
  } catch {
    // The native copy is what the notification path reads.
  }
  try {
    await HeedlyNative.setHeadsUpEnabled(enabled);
  } catch {
    // A failed mirror leaves the default rather than a wrong value.
  }
}

export async function syncHeadsUpPreference(): Promise<void> {
  try {
    const stored = await readHeadsUpPreference();
    if (stored === null) return;
    if ((await HeedlyNative.getHeadsUpEnabled()) !== null) return;
    await HeedlyNative.setHeadsUpEnabled(stored);
  } catch {
    // Retried on the next launch.
  }
}
