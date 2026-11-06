/**
 * Client-safe serializable shapes for CPE Fit.
 * Do not import `@/lib/cpe-fit/estimate` from client components — that module
 * is `server-only` and loads the price catalog.
 */
export type VendorKind = "cloud" | "onprem";
export type VendorTuple = [string, string, VendorKind];
export type VendorMap = Record<string, VendorTuple>;

export type CpeFitInputs = {
  vendor: string;
  positions: number;
  years: number;
  discount_pct: number;
  onprem_mode: "SA" | "HR";
  include_host: boolean;
  gis: boolean;
  logger: "0" | "64" | "65";
  net_clock: boolean;
  displays: number;
  ip_phones: number;
  api_tier: "0" | "1" | "2" | "3";
  other_onetime: number;
  contingency: number;
  allotment: number | null;
  prior_used: number;
  psap_label: string;
  letter_date: string;
};

export type CpeFitLine = {
  key: string;
  label: string;
  amount: number;
  cite: string;
  note: string;
};

export type CpeFitResult = {
  vendor: string;
  vendor_label: string;
  contract: string;
  kind: string;
  lines: CpeFitLine[];
  flags: string[];
  price_missing: boolean;
  true_cost: number;
  net_allotment: number | null;
  over_under: number | null;
  pct_used: number | null;
  residual: number | null;
  status: string;
};

export type PositionsSuggestion = {
  avg_calls: number;
  avg_abandoned: number;
  raw: number;
  positions: number;
  clamped: number;
};

export const CPE_FIT_BASE = "/advisor-tools/cpe-fit";
export const CPE_FIT_CATALOG_SOURCE =
  "Evaluator v4 extract of CalOES Exhibit C BAFO/BAFO2 workbooks (2026-11-05)";

export const DEFAULT_CPE_FIT_INPUTS: CpeFitInputs = {
  vendor: "4",
  positions: 5,
  years: 5,
  discount_pct: 0,
  onprem_mode: "SA",
  include_host: false,
  gis: false,
  logger: "0",
  net_clock: false,
  displays: 0,
  ip_phones: 0,
  api_tier: "0",
  other_onetime: 0,
  contingency: 0,
  allotment: null,
  prior_used: 0,
  psap_label: "",
  letter_date: "",
};
