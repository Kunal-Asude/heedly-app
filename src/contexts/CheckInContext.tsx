import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  clearAllCheckInData,
  clearDraft,
  getCheckIn,
  getRecordedCheckInDate,
  loadDraft,
  saveCheckIn as persistCheckInToHistory,
  saveDraft,
} from "@/services/checkinStorage";
import type { CheckInEntry } from "@/types/checkin";

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
  energyIndex: 2,
  energyLabel: "middling",
  bodyIndex: 2,
  bodyLabel: "tender",
  tags: ["social", "screens", "warm room"],
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
          getCheckIn(targetDate),
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
      const entry = await getCheckIn(date);
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
      energyIndex: activeEntry.energyIndex ?? 2,
      energyLabel: activeEntry.energyLabel ?? "middling",
      bodyIndex: activeEntry.bodyIndex ?? 2,
      bodyLabel: activeEntry.bodyLabel ?? "tender",
      tags: activeEntry.tags ?? ["social", "screens", "warm room"],
      periodInfo: activeEntry.periodInfo ?? null,
      isCrash: activeEntry.isCrash ?? false,
      isFirstTime: activeEntry.isFirstTime ?? false,
      completedAt: activeEntry.completedAt,
      updatedAt: new Date().toISOString(),
    };

    // 1. Commit to history
    await persistCheckInToHistory(completedEntry);

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
    const completed = await getCheckIn(targetDate);
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
