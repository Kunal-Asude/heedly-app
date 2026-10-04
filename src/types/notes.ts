export interface MetricSummary {
  label: string;
  value: string;
  subtext: string;
}

export interface TriggerItem {
  id: string;
  title: string;
  subtitle: string;
  impactText: string;
}

export interface NotesData {
  userName: string;
  dateRange: string;
  /** `null` when the count is unknown. Not 0 — that would claim they have
   *  checked in zero times, which is a different statement. */
  totalCheckInsCount: number | null;
  metrics: MetricSummary[];
  triggers: TriggerItem[];
  summaryParagraph: string;
  generatedDateText: string;
}
