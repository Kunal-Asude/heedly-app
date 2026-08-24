import { useState } from "react";
import { MOCK_NOTES_DATA } from "@/data/mock";
import type { NotesData } from "@/types/notes";

export function useNotes() {
  const [data] = useState<NotesData>(MOCK_NOTES_DATA);

  return {
    notes: data,
    userName: data.userName,
    dateRange: data.dateRange,
    totalCheckInsCount: data.totalCheckInsCount,
    metrics: data.metrics,
    triggers: data.triggers,
    summaryParagraph: data.summaryParagraph,
    generatedDateText: data.generatedDateText,
  };
}
