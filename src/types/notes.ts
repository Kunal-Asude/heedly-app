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
  totalCheckInsCount: number;
  metrics: MetricSummary[];
  triggers: TriggerItem[];
  summaryParagraph: string;
  generatedDateText: string;
}
