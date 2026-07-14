import type { EvidenceItem, ForPackage } from "./types";

export const ENGINE_VERSION = "1.0.0-web";

export const DEFAULT_EVIDENCE: EvidenceItem[] = [
  { id: "psap_history", label: "PSAP History File reviewed (CPE / residual)", required: true, present: false },
  { id: "td288", label: "TD-288 CPE/Maintenance docs available", required: true, present: false },
  { id: "fiscal_workbook", label: "Fiscal Summary figures prepared", required: true, present: false },
  { id: "ecats_asa", label: "ECaTS speed-of-answer sample (12 mo preferred)", required: true, present: false },
  { id: "network_record", label: "Network / telco customer record requested or on file", required: false, present: false },
  { id: "ata", label: "ATA level / spending reviewed", required: false, present: false },
  { id: "language_line", label: "Foreign language interpretation costs (if available)", required: false, present: false },
  { id: "text911", label: "Text-to-911 posture confirmed (OTT vs integrated)", required: true, present: false },
  { id: "coordinator", label: "County Coordinator contact current", required: false, present: false },
];

export function emptyForPackage(partial?: Partial<ForPackage>): ForPackage {
  const base: ForPackage = {
    meta: {
      version: ENGINE_VERSION,
      generatedAt: new Date().toISOString(),
      engine: "web",
    },
    cover: {
      psapName: "",
      forDate: new Date().toISOString().slice(0, 10),
      managerName: "",
      address: "",
      phone: "",
      advisorName: "",
      advisorPhone: "",
    },
    fiscal: {
      cpeOnlyCost: null,
      ongoingOpsCost: null,
      fiveYearEstimate: null,
      ataLevel: "",
      ataBalance: null,
      reimbursementsPastFy: null,
      foreignLanguageCost: null,
      misCostNote:
        "ECaTS MIS costs are Branch-funded and typically reflected as a standard per-PSAP allocation on the Summary (see current Branch guidance).",
      fiscalNotes: "",
    },
    network: {
      totalLines: null,
      trunks911: null,
      alternateAnswer: null,
      alternateAnswerPsap: "",
      notes: "",
    },
    cpe: {
      vendor: "",
      systemType: "",
      stateFundedPositions: null,
      mpaContract: "",
      td288Tracking: "",
      td288ApprovalDate: "",
      systemAcceptance: "",
      maint5yrExpiration: "",
      issues: "",
    },
    ops: {
      pctAnswered15s: null,
      monthsSampled: 12,
      avgCallsPerMonth: null,
      is24x7: "unknown",
      countyCoordinatorName: "",
      countyCoordinatorPhone: "",
      countyCoordinatorEmail: "",
      textTo911: "unknown",
      ttyNotes: "",
      opsNotes: "",
    },
    ng: {
      notes: "",
      pnspConnected: false,
      rnspConnected: false,
      cloudCpeDiscussed: false,
    },
    references: {
      extraLinks: "",
    },
    findings: {
      preMeeting: "",
      postMeeting: "",
    },
    evidence: DEFAULT_EVIDENCE.map((e) => ({ ...e })),
  };

  if (!partial) return base;
  return {
    ...base,
    ...partial,
    meta: { ...base.meta, ...partial.meta },
    cover: { ...base.cover, ...partial.cover },
    fiscal: { ...base.fiscal, ...partial.fiscal },
    network: { ...base.network, ...partial.network },
    cpe: { ...base.cpe, ...partial.cpe },
    ops: { ...base.ops, ...partial.ops },
    ng: { ...base.ng, ...partial.ng },
    references: { ...base.references, ...partial.references },
    findings: { ...base.findings, ...partial.findings },
    evidence: partial.evidence ?? base.evidence,
  };
}

/** Simple five-year estimate heuristic when not overridden. */
export function suggestFiveYearEstimate(pkg: ForPackage): number | null {
  if (pkg.fiscal.fiveYearEstimate != null && !Number.isNaN(pkg.fiscal.fiveYearEstimate)) {
    return pkg.fiscal.fiveYearEstimate;
  }
  const ongoing = pkg.fiscal.ongoingOpsCost;
  const cpe = pkg.fiscal.cpeOnlyCost ?? 0;
  if (ongoing == null) return null;
  // Prep docs: ongoing × 5 + last CPE is a common starting point; Advisor may override.
  return Math.round(ongoing * 5 + cpe);
}
