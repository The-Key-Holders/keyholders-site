export type Is24x7 =
  | "yes"
  | "no_grandfathered"
  | "no_plan"
  | "no_funding_risk"
  | "unknown";

export type TextTo911 = "ott" | "integrated" | "unknown";

export type EvidenceItem = {
  id: string;
  label: string;
  required: boolean;
  present: boolean;
};

export type ForPackage = {
  meta: {
    version: string;
    generatedAt: string;
    engine: "web" | "desktop";
  };
  cover: {
    psapName: string;
    forDate: string;
    managerName: string;
    address: string;
    phone: string;
    advisorName: string;
    advisorPhone: string;
  };
  fiscal: {
    cpeOnlyCost: number | null;
    ongoingOpsCost: number | null;
    fiveYearEstimate: number | null;
    ataLevel: string;
    ataBalance: number | null;
    reimbursementsPastFy: number | null;
    foreignLanguageCost: number | null;
    misCostNote: string;
    fiscalNotes: string;
  };
  network: {
    totalLines: number | null;
    trunks911: number | null;
    alternateAnswer: number | null;
    alternateAnswerPsap: string;
    notes: string;
  };
  cpe: {
    vendor: string;
    systemType: string;
    stateFundedPositions: number | null;
    mpaContract: string;
    td288Tracking: string;
    td288ApprovalDate: string;
    systemAcceptance: string;
    maint5yrExpiration: string;
    issues: string;
  };
  ops: {
    pctAnswered15s: number | null;
    monthsSampled: number | null;
    avgCallsPerMonth: number | null;
    is24x7: Is24x7;
    countyCoordinatorName: string;
    countyCoordinatorPhone: string;
    countyCoordinatorEmail: string;
    textTo911: TextTo911;
    ttyNotes: string;
    opsNotes: string;
  };
  ng: {
    notes: string;
    pnspConnected: boolean;
    rnspConnected: boolean;
    cloudCpeDiscussed: boolean;
  };
  references: {
    extraLinks: string;
  };
  findings: {
    preMeeting: string;
    postMeeting: string;
  };
  evidence: EvidenceItem[];
};

export type SectionId =
  | "cover"
  | "summary"
  | "section_i"
  | "section_ii"
  | "section_iii"
  | "section_iv"
  | "section_v"
  | "section_vi"
  | "checklist"
  | "findings";

export type RenderedSection = {
  id: SectionId;
  title: string;
  markdown: string;
  html: string;
};

export type PackageValidation = {
  ok: boolean;
  errors: string[];
  warnings: string[];
  requiredEvidenceMissing: string[];
};
