import { CheckInEntry } from "@/types/checkin";
import { appStorage } from "@/utils/storage";

// ─── Storage Keys ─────────────────────────────────────────────────────────────

export const STORAGE_KEYS = {
  /** In-progress partial check-in; survives reloads/backgrounding; cleared on complete */
  DRAFT: "@heedly/checkin_draft",
  /** Completed check-ins dictionary: Record<string, CheckInEntry> keyed by target date */
  HISTORY: "@heedly/checkin_history",
  /** Convenience reference to the most recently completed check-in date (YYYY-MM-DD) */
  LAST_CHECKIN_DATE: "@heedly/last_checkin_date",
} as const;

// ─── Date Helpers ─────────────────────────────────────────────────────────────

/** Formats a Date object to local YYYY-MM-DD string */
export function formatDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns the target date for a standard daily check-in ("Check in for yesterday").
 * Retrospective by definition: calendar date minus 1 day.
 */
export function getRecordedCheckInDate(referenceDate: Date = new Date()): string {
  const target = new Date(referenceDate);
  target.setDate(target.getDate() - 1);
  return formatDateString(target);
}

/** Returns today's calendar date string (YYYY-MM-DD) */
export function getTodayDateString(referenceDate: Date = new Date()): string {
  return formatDateString(referenceDate);
}

// ─── Draft Storage Operations ─────────────────────────────────────────────────

/**
 * Loads the active in-progress check-in draft, if any.
 * Returns null if no draft exists or if parsing fails.
 */
export async function loadDraft(): Promise<Partial<CheckInEntry> | null> {
  try {
    const raw = await appStorage.getItem(STORAGE_KEYS.DRAFT);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as Partial<CheckInEntry>;
    }
    return null;
  } catch (error) {
    console.warn("[checkinStorage] Error loading draft:", error);
    return null;
  }
}

/**
 * Persists an in-progress check-in draft to storage.
 */
export async function saveDraft(draft: Partial<CheckInEntry>): Promise<void> {
  try {
    await appStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(draft));
  } catch (error) {
    console.warn("[checkinStorage] Error saving draft:", error);
  }
}

/**
 * Clears the active draft upon check-in completion or explicit discard.
 */
export async function clearDraft(): Promise<void> {
  try {
    await appStorage.removeItem(STORAGE_KEYS.DRAFT);
  } catch (error) {
    console.warn("[checkinStorage] Error clearing draft:", error);
  }
}

// ─── History Storage Operations ───────────────────────────────────────────────

/**
 * Retrieves the entire dictionary of completed check-ins.
 * Returns an empty object if uninitialized or upon error.
 */
export async function getAllCheckIns(): Promise<Record<string, CheckInEntry>> {
  try {
    const raw = await appStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, CheckInEntry>;
    }
    return {};
  } catch (error) {
    console.warn("[checkinStorage] Error loading check-in history:", error);
    return {};
  }
}

/**
 * Retrieves the completed check-in record for a specific date (YYYY-MM-DD).
 */
export async function getCheckIn(date: string): Promise<CheckInEntry | null> {
  try {
    const history = await getAllCheckIns();
    return history[date] ?? null;
  } catch (error) {
    console.warn(`[checkinStorage] Error retrieving check-in for date ${date}:`, error);
    return null;
  }
}

/**
 * Saves a completed check-in entry to history.
 * - Keyed by entry.date (the day being recorded)
 * - Updates @heedly/last_checkin_date
 * - Does not alter completedAt if updating an existing record
 */
export async function saveCheckIn(entry: CheckInEntry): Promise<void> {
  try {
    const history = await getAllCheckIns();
    const existing = history[entry.date];

    const now = new Date().toISOString();
    const mergedEntry: CheckInEntry = {
      ...entry,
      completedAt: existing?.completedAt ?? entry.completedAt ?? now,
      updatedAt: now,
    };

    history[entry.date] = mergedEntry;

    await Promise.all([
      appStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history)),
      appStorage.setItem(STORAGE_KEYS.LAST_CHECKIN_DATE, entry.date),
    ]);
  } catch (error) {
    console.warn(`[checkinStorage] Error saving check-in for date ${entry.date}:`, error);
  }
}

/**
 * Removes a specific date's check-in entry from history.
 */
export async function deleteCheckIn(date: string): Promise<void> {
  try {
    const history = await getAllCheckIns();
    if (history[date]) {
      delete history[date];
      await appStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    }
  } catch (error) {
    console.warn(`[checkinStorage] Error deleting check-in for date ${date}:`, error);
  }
}

/**
 * Retrieves the date string of the most recently completed check-in.
 */
export async function getLastCheckInDate(): Promise<string | null> {
  try {
    return await appStorage.getItem(STORAGE_KEYS.LAST_CHECKIN_DATE);
  } catch (error) {
    console.warn("[checkinStorage] Error loading last check-in date:", error);
    return null;
  }
}

/**
 * Deletes all check-in history, drafts, and last check-in references from storage.
 */
export async function clearAllCheckInData(): Promise<void> {
  try {
    await Promise.all([
      appStorage.removeItem(STORAGE_KEYS.DRAFT),
      appStorage.removeItem(STORAGE_KEYS.HISTORY),
      appStorage.removeItem(STORAGE_KEYS.LAST_CHECKIN_DATE),
    ]);
  } catch (error) {
    console.warn("[checkinStorage] Error clearing all check-in data:", error);
  }
}
