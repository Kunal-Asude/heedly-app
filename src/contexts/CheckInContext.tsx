import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import HeedlyNative from "@heedly/native";

import {
  fromNativeCheckIn,
  toNativeCheckIn,
  toVerdictValue,
} from "@/services/checkinBridge";
// Drafts stay here. An in-progress check-in is app state, not an answer, and
// the native contract has no concept of one — only completed records cross.
//
// `clearAllCheckInData` also stays, and is now incomplete: it clears the draft
// keys but not the store, which is where completed check-ins now live. The
// bridge has no delete method, and what "Delete all my data" must cover is a
// product question rather than something to guess at, so it is deliberately
// left as it was rather than half-migrated.
import {
  clearAllCheckInData,
  clearDraft,
  getRecordedCheckInDate,
  loadDraft,
  saveDraft,
} from "@/services/checkinStorage";
import type { CheckInEntry } from "@/types/checkin";

/**
 * Reads a completed check-in from the store.
 *
 * Two records, because the store keeps them apart: the check-in and the verdict
 * for the same day have different edit rules. `null` means no check-in exists —
 * a real answer, not a failure, so it is returned rather than thrown.
 */
async function readCompletedCheckIn(date: string): Promise<CheckInEntry | null> {
  const checkIn = await HeedlyNative.getCheckIn(date);
  if (!checkIn) return null;
  const verdict = await HeedlyNative.getVerdict(date);
  return fromNativeCheckIn(checkIn, verdict);
}

// ─── Types & Contract ─────────────────────────────────────────────────────────

export interface CheckInContextValue {
  /** The active check-in entry currently being drafted or edited */
  activeEntry: Partial<CheckInEntry>;
  /** True while the context is reading initial draft/history from storage */
  isHydrating: boolean;
  /** True if currently editing an already completed check-in */
  isEditing: boolean;
  /** Date (YYYY-MM-DD) currently being edited, if in edit mode */
  editingDate: string | null;
  /** True if the target recorded date (yesterday) already has a completed check-in */
  isTodayCompleted: boolean;
  /** The completed check-in record for the target recorded date, if completed */
  todayEntry: CheckInEntry | null;
  /** Updates the active entry immediately in state and debounced/asynchronously to draft */
  updateEntry: (updates: Partial<CheckInEntry>) => void;
  /** Initializes or resets a fresh check-in draft for the target recorded date */
  startNewCheckIn: (isFirstTime?: boolean) => void;
  /** Loads an existing historical check-in into active state for review/editing */
  loadExistingCheckIn: (date: string) => Promise<boolean>;
  /** Commits the active entry to history and clears draft (or updates existing record) */
  saveCheckIn: () => Promise<void>;
  /** Discards the current in-progress draft from storage and resets state */
  discardDraft: () => Promise<void>;
  /** Refreshes completed check-in status from history */
  refreshStatus: () => Promise<void>;
  /** Deletes all check-in history, drafts, and resets check-in state to initial */
  resetAllData: () => Promise<void>;
}

const defaultEntry: Partial<CheckInEntry> = {
  date: getRecordedCheckInDate(),
  yesterdayId: null,
  yesterdayLabel: null,
  yesterdayIndex: null,
  // Unanswered, not middling. These seed a *fresh* draft, and `handleSkip` on
  // the energy/body screens navigates without writing — so a non-null value
  // here is what a skipped answer would be recorded as. The screens already
  // fall back to the middle position for *display* when this is null, so the
  // UI is unchanged; only the recorded value is.
  energyIndex: null,
  energyLabel: null,
  bodyIndex: null,
  bodyLabel: null,
  tags: [],
  periodInfo: null,
  isCrash: false,
  isFirstTime: false,
};

const CheckInContext = createContext<CheckInContextValue | null>(null);

// ─── Provider Component ───────────────────────────────────────────────────────

export function CheckInProvider({ children }: { children: React.ReactNode }) {
  const [activeEntry, setActiveEntry] = useState<Partial<CheckInEntry>>(defaultEntry);
  const [isHydrating, setIsHydrating] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [todayCompleted, setTodayCompleted] = useState<boolean>(false);
  const [todayEntry, setTodayEntry] = useState<CheckInEntry | null>(null);

  const targetDate = useMemo(() => getRecordedCheckInDate(), []);

  // ── Initial Hydration from Storage ──────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [completed, draft] = await Promise.all([
          readCompletedCheckIn(targetDate),
          loadDraft(),
        ]);

        if (!isMounted) return;

        if (completed) {
          setTodayCompleted(true);
          setTodayEntry(completed);
        } else {
          setTodayCompleted(false);
          setTodayEntry(null);
        }

        if (draft) {
          setActiveEntry((prev) => ({
            ...prev,
            ...draft,
            date: draft.date ?? targetDate,
          }));
        } else if (completed) {
          setActiveEntry(completed);
        } else {
          setActiveEntry({
            ...defaultEntry,
            date: targetDate,
          });
        }
      } catch (error) {
        console.warn("[CheckInContext] Hydration error:", error);
      } finally {
        if (isMounted) {
          setIsHydrating(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [targetDate]);

  // ── Update Active Entry ─────────────────────────────────────────────────────
  const updateEntry = useCallback(
    (updates: Partial<CheckInEntry>) => {
      setActiveEntry((prev) => {
        const next = { ...prev, ...updates };
        // Save to draft storage if not in historical edit mode
        if (!isEditing) {
          saveDraft(next);
        }
        return next;
      });
    },
    [isEditing]
  );

  // ── Start New Check-In ──────────────────────────────────────────────────────
  const startNewCheckIn = useCallback(
    (isFirstTime = false) => {
      setIsEditing(false);
      setEditingDate(null);
      const fresh: Partial<CheckInEntry> = {
        ...defaultEntry,
        date: targetDate,
        isFirstTime,
      };
      setActiveEntry(fresh);
      saveDraft(fresh);
    },
    [targetDate]
  );

  // ── Load Existing Check-In (Review / Edit Mode) ──────────────────────────────
  const loadExistingCheckIn = useCallback(async (date: string): Promise<boolean> => {
    try {
      const entry = await readCompletedCheckIn(date);
      if (entry) {
        setActiveEntry(entry);
        setIsEditing(true);
        setEditingDate(date);
        return true;
      }
      return false;
    } catch (error) {
      console.warn(`[CheckInContext] Failed to load check-in for ${date}:`, error);
      return false;
    }
  }, []);

  // ── Save Check-In (Commit to History) ───────────────────────────────────────
  const saveCheckIn = useCallback(async () => {
    const checkInDate = editingDate ?? activeEntry.date ?? targetDate;
    const completedEntry: CheckInEntry = {
      date: checkInDate,
      yesterdayId: activeEntry.yesterdayId ?? null,
      yesterdayLabel: activeEntry.yesterdayLabel ?? null,
      yesterdayIndex: activeEntry.yesterdayIndex ?? null,
      energyIndex: activeEntry.energyIndex ?? null,
      energyLabel: activeEntry.energyLabel ?? null,
      bodyIndex: activeEntry.bodyIndex ?? null,
      bodyLabel: activeEntry.bodyLabel ?? null,
      tags: activeEntry.tags ?? [],
      periodInfo: activeEntry.periodInfo ?? null,
      isCrash: activeEntry.isCrash ?? false,
      isFirstTime: activeEntry.isFirstTime ?? false,
      completedAt: activeEntry.completedAt,
      updatedAt: new Date().toISOString(),
    };

    // 1. Commit to history — the native store, which is what the engine reads.
    //
    // Both calls are awaited and neither is wrapped: if the store cannot be
    // written, this must reject so the screen can say so. Swallowing it would
    // report a saved check-in that does not exist (§2 — a false reassurance is
    // worse than a false alarm).
    //
    // The verdict is a separate record with its own edit rules, so it is a
    // separate call. It is skipped entirely when the day was not rated —
    // "not rated" is an absent row, not a value.
    await HeedlyNative.saveCheckIn(toNativeCheckIn(completedEntry));

    const verdictValue = toVerdictValue(completedEntry.yesterdayId);
    if (verdictValue) {
      await HeedlyNative.saveVerdict(checkInDate, verdictValue);
    }

    // 2. Clear draft if not in edit mode
    if (!isEditing) {
      await clearDraft();
    }

    // 3. Update local state
    if (checkInDate === targetDate) {
      setTodayCompleted(true);
      setTodayEntry(completedEntry);
    }
    setActiveEntry(completedEntry);
    setIsEditing(false);
    setEditingDate(null);
  }, [activeEntry, editingDate, isEditing, targetDate]);

  // ── Discard Draft ───────────────────────────────────────────────────────────
  const discardDraft = useCallback(async () => {
    await clearDraft();
    setActiveEntry({
      ...defaultEntry,
      date: targetDate,
    });
    setIsEditing(false);
    setEditingDate(null);
  }, [targetDate]);

  // ── Refresh Status ──────────────────────────────────────────────────────────
  const refreshStatus = useCallback(async () => {
    const completed = await readCompletedCheckIn(targetDate);
    if (completed) {
      setTodayCompleted(true);
      setTodayEntry(completed);
    } else {
      setTodayCompleted(false);
      setTodayEntry(null);
    }
  }, [targetDate]);

  // ── Reset All Check-In Data ──────────────────────────────────────────────────
  const resetAllData = useCallback(async () => {
    await clearAllCheckInData();
    setTodayCompleted(false);
    setTodayEntry(null);
    setActiveEntry({
      ...defaultEntry,
      date: targetDate,
    });
    setIsEditing(false);
    setEditingDate(null);
  }, [targetDate]);

  const value = useMemo<CheckInContextValue>(
    () => ({
      activeEntry,
      isHydrating,
      isEditing,
      editingDate,
      isTodayCompleted: todayCompleted,
      todayEntry,
      updateEntry,
      startNewCheckIn,
      loadExistingCheckIn,
      saveCheckIn,
      discardDraft,
      refreshStatus,
      resetAllData,
    }),
    [
      activeEntry,
      isHydrating,
      isEditing,
      editingDate,
      todayCompleted,
      todayEntry,
      updateEntry,
      startNewCheckIn,
      loadExistingCheckIn,
      saveCheckIn,
      discardDraft,
      refreshStatus,
      resetAllData,
    ]
  );

  return <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>;
}

// ─── Consumer Hook ────────────────────────────────────────────────────────────

export function useCheckIn(): CheckInContextValue {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error("useCheckIn must be used within a CheckInProvider");
  }
  return context;
}
