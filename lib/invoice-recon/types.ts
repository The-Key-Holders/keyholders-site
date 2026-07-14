export type Traffic = "GREEN" | "YELLOW" | "RED";
export type Recommendation = "APPROVE" | "HOLD" | "DISPUTE" | "REVIEW";

export interface BatchLine {
  line_no: number;
  psap_code: string;
  psap_name: string;
  tracking: string;
  amount: number | null;
  notes: string;
  raw: string;
}

export interface Td288Entry {
  tracking: string;
  paths: string[];
  filenames: string[];
}

export interface SlaStatus {
  received: string;
  days_open: number;
  status: "OK" | "WARN" | "CRITICAL";
  action: string;
  held_reason: string;
  reviewed: boolean;
}

export interface LineResult {
  line: BatchLine;
  traffic: Traffic;
  recommendation: Recommendation;
  flags: string[];
  td288_hit: boolean;
  td288_paths: string[];
  sla: SlaStatus;
  rationale: string;
}

export interface ReconcileMeta {
  received_date: string;
  version: string;
  index_size: number;
  title: string;
}

export interface ReconcileSummary {
  meta: ReconcileMeta;
  counts: Record<Traffic, number>;
  recommendations: Record<string, number>;
  lines: LineResult[];
}
