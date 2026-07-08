export type SystemType = "on_premise" | "cloud";

export interface ECaTSMetadata {
  psapName: string;
  county: string;
  reportDateFrom: string;
  reportDateTo: string;
  callType: string;
  avgCallDurationSec: number;
}

export interface MonthlyCallStats {
  monthLabel: string;
  answered: number;
  abandoned: number;
  total: number;
}

export interface MonthlyHourlyBuckets {
  monthLabel: string;
  hourlyCounts: number[];
}

export interface ClassOfServiceEntry {
  serviceClass: string;
  callCount: number;
  percentage: number;
}

export interface AnswerTimeSummary {
  totalCalls: number;
  pctWithin10Sec: number;
  pctWithin15Sec: number;
  pctWithin20Sec: number;
  pctWithin40Sec: number;
  pctWithin60Sec: number;
  pctWithin120Sec: number;
}

export interface ECaTSParseResult {
  metadata: ECaTSMetadata;
  monthlyStats: MonthlyCallStats[];
  monthlyHourly: MonthlyHourlyBuckets[];
  hourlyTotals: number[];
  sourceFiles: string[];
  classOfService: ClassOfServiceEntry[];
  answerTime?: AnswerTimeSummary;
  ringTime?: AnswerTimeSummary;
}

export interface FundingCalculation {
  fundingLevel: number;
  basis: string;
  typicalBusyMonthCalls: number;
  typicalBusyHourCalls: number;
  avgCallDurationSec: number;
  erlangs: number | null;
  provisioningPositions: number;
  cloudHourlyTier: string | null;
  estimatedAllotmentUsd: number;
  notes: string[];
}

export interface AllotmentRequest {
  callSummary: ArrayBuffer;
  callsPerHour?: ArrayBuffer;
  answerTime?: ArrayBuffer;
  ringTime?: ArrayBuffer;
  classOfService?: ArrayBuffer;
  psapName?: string;
  county?: string;
  systemType?: SystemType;
  avgCallDuration?: number;
  acceptanceDate?: string;
  advisor?: string;
}

export interface AllotmentResponse {
  status: "ok" | "error";
  psap: string;
  fundingLevel: number;
  positions: number;
  estimatedAllotmentUsd: number;
  avgCallDurationSec: number;
  calculation: FundingCalculation;
  supplementalEcats: Record<string, unknown>;
  markdown: string;
  error?: string;
}