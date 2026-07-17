/**
 * Post-award operational content distilled from docs/for-reference-grok
 * (Process Map, Top 20 Pain Points, Operational Framework) — Sept 2026+ frame.
 */

export type AdvisorProcess = {
  id: number;
  name: string;
  phase: string;
  summary: string;
  triggers: string[];
  keyForms: string[];
  timeline: string;
  tasks: string[];
  painPointRanks: number[];
  toolHrefs: string[];
};

export type PainPoint = {
  rank: number;
  title: string;
  description: string;
  rootCause: string;
  severity: "HIGH" | "MEDIUM-HIGH" | "MEDIUM";
  frequency: string;
  mitigations: string[];
  processIds: number[];
  toolHrefs: string[];
  psapFacingTip: string;
};

export type ExternalRequest = {
  id: string;
  source: string;
  description: string;
  processId: number;
  steps: string[];
  timeline: string;
};

export const ADVISOR_PROCESSES: AdvisorProcess[] = [
  {
    id: 1,
    name: "Advance Notification & Allotment (TD e-288 created)",
    phase: "Phase 1 · Funding initiation",
    summary:
      "Receive Att. 11 Advance Notification, verify completeness/eligibility, issue allotment via TD e-288, notify PSAP of next steps.",
    triggers: ["E1 · PSAP submits Advance Notification (Cloud or On-Prem)"],
    keyForms: ["Advance Notification (Att. 11)", "TD e-288", "County tracker"],
    timeline: "Ack 1–2 days · Decision 5–10 days · TD e-288 same day as decision",
    tasks: [
      "Intake & log (PSAP, county, Cloud/On-Prem, FY)",
      "Completeness & eligibility review",
      "Allotment determination",
      "Create TD e-288 and notify PSAP",
      "Update county tracker / handoff",
    ],
    painPointRanks: [4, 5, 11],
    toolHrefs: [
      "/psap-portal/tools/advance-notification-wizard",
      "/psap-portal/tools/cloud-vs-onprem",
      "/psap-portal/psap",
    ],
  },
  {
    id: 2,
    name: "SOW Review, Coordination & Approval",
    phase: "Phase 2 · Planning",
    summary:
      "Review draft SOW against Attachment 16, pricing vs Exhibit C, technical soundness; approve or return comments; link to TD e-288.",
    triggers: ["E2 · PSAP or Vendor submits draft SOW"],
    keyForms: ["SOW (Att. 16)", "Vendor quote / Exhibit C refs", "TD e-288"],
    timeline: "Initial 3–5 days · Full approval 7–15 days",
    tasks: [
      "Log receipt",
      "Completeness check (Att. 16 subsections)",
      "Pricing & scope validation",
      "Technical/integration review as needed",
      "Comments or approval; link TD e-288",
    ],
    painPointRanks: [1, 8, 10, 16],
    toolHrefs: ["/psap-portal/tools/sow-checker", "/psap-portal/tools/vendor-pool"],
  },
  {
    id: 3,
    name: "TD e-288 Management, Tracking & Amendment",
    phase: "Phase 2 · Planning",
    summary:
      "Create, maintain, amend, and reconcile the central funding authorization (single source of truth for spend).",
    triggers: ["E5 · Vendor requests TD e-288 confirmation", "Change-order amendments"],
    keyForms: ["TD e-288", "Change orders", "Invoices (reconcile)"],
    timeline: "Create same day as allotment · Amendments 2–5 days after CO approval",
    tasks: [
      "Create initial record at allotment",
      "Link PSAP project + vendor",
      "Monitor spend vs approved total",
      "Process amendments",
      "Status to PSAP/vendor; reconcile at closeout",
    ],
    painPointRanks: [6, 3],
    toolHrefs: ["/psap-portal/tools/td288-checker", "/psap-portal/advisor/pain-points"],
  },
  {
    id: 4,
    name: "Change Order Review & Branch Approval",
    phase: "Phase 3 · Execution",
    summary:
      "Assess impact of scope/cost/timeline changes; PSAP concurrence + Branch approval; update TD e-288 if funding changes.",
    triggers: ["E3 · Vendor Change Order Request"],
    keyForms: ["Change Order form", "Approved SOW", "Updated TD e-288"],
    timeline: "Simple 3–7 days · Complex 7–14 days",
    tasks: [
      "Log request",
      "Impact assessment",
      "PSAP concurrence",
      "Approve / reject / negotiate",
      "Update TD e-288; distribute",
    ],
    painPointRanks: [3, 12, 13],
    toolHrefs: ["/psap-portal/advisor/requests", "/psap-portal/advisor/pain-points"],
  },
  {
    id: 5,
    name: "Invoice Verification & Payment Coordination",
    phase: "Phase 4 · Delivery",
    summary:
      "Validate Att. 14/15 invoice fields against TD e-288, SOW, acceptance; triage CA911Invoicing queue issues.",
    triggers: ["E4 · Invoice status inquiries", "I2 · Finance verification"],
    keyForms: ["Invoice Att. 14/15", "TD e-288", "SOW + COs", "TD284"],
    timeline: "Triage 1–2 days · Verify 3–7 days",
    tasks: [
      "Format check (Att. 14/15)",
      "Line items vs TD e-288",
      "Acceptance date / service period",
      "Flag discrepancies; coordinate payment",
    ],
    painPointRanks: [2, 6],
    toolHrefs: [
      "/psap-portal/tools/invoice-checker",
      "/advisor-tools/invoice-reconciler",
    ],
  },
  {
    id: 6,
    name: "Project Timeline Monitoring & Status Reporting",
    phase: "Cross-cutting",
    summary:
      "County trackers, risk flags, supervisor reports, ad-hoc status for PSAPs and other branches.",
    triggers: ["I1 · Supervisor status", "E6 · Cross-branch reports"],
    keyForms: ["County tracker / dashboard", "SOW schedule", "Monthly status template"],
    timeline: "Ongoing · Formal monthly · Ad-hoc 1–3 days",
    tasks: [
      "Update milestones",
      "Flag risks/delays",
      "Internal reports",
      "Respond to status requests",
      "Escalate systemic issues",
    ],
    painPointRanks: [15, 11],
    toolHrefs: ["/psap-portal/advisor", "/psap-portal/advisor/process-map"],
  },
  {
    id: 7,
    name: "Acceptance Testing Coordination (TD284)",
    phase: "Phase 4 · Delivery",
    summary:
      "Coordinate TD284 checklist, testing, PSAP sign-off; start maintenance billing period.",
    triggers: ["SOW acceptance window", "Install complete"],
    keyForms: ["TD284 checklist", "Test results", "Acceptance sign-off"],
    timeline: "Testing per SOW (often 5–10 days) · Sign-off 1–3 days",
    tasks: [
      "Confirm TD284 use",
      "Coordinate schedule",
      "Collect authorized PSAP sign-off",
      "Record acceptance date; punch list",
    ],
    painPointRanks: [7, 10],
    toolHrefs: ["/psap-portal/tools/td288-checker", "/psap-portal/advisor/pain-points"],
  },
  {
    id: 8,
    name: "Post-Acceptance MACs",
    phase: "Phase 4 · Delivery",
    summary:
      "Classify Minor MAC (maintenance) vs Major (change order); prevent scope creep after acceptance.",
    triggers: ["PSAP or Vendor MAC request"],
    keyForms: ["MAC request", "SOW", "Change Order if major"],
    timeline: "Minor 1–3 days · Major follows CO timeline",
    tasks: [
      "Log request",
      "Classify minor vs major",
      "Minor: confirm with vendor",
      "Major: route to Process 4",
    ],
    painPointRanks: [13],
    toolHrefs: ["/psap-portal/advisor/pain-points", "/psap-portal/advisor/job-aids"],
  },
  {
    id: 9,
    name: "Training Coordination & Documentation",
    phase: "Phase 4 · Delivery",
    summary:
      "Ensure SOW training plan delivery, attendance, manuals; file completion records.",
    triggers: ["SOW training schedule"],
    keyForms: ["SOW §k", "Training sign-off", "Manuals delivery record"],
    timeline: "Coord 5–10 days before · Docs within 2 days of completion",
    tasks: [
      "Confirm dates/content",
      "Logistics with PSAP/vendor",
      "Collect sign-offs",
      "File completion",
    ],
    painPointRanks: [14],
    toolHrefs: ["/psap-portal/advisor/job-aids"],
  },
  {
    id: 10,
    name: "Project Closeout, Archiving & Compliance Prep",
    phase: "Phase 4 · Closeout",
    summary:
      "Verify deliverables, final payment reconciliation, complete project file, close TD e-288, audit readiness.",
    triggers: ["Final acceptance + payment"],
    keyForms: [
      "Project file checklist",
      "Final invoice",
      "TD284",
      "Closeout checklist",
      "Archive index",
    ],
    timeline: "Closeout 5–10 days after final accept/pay · Archive within 10 days",
    tasks: [
      "Verify deliverables",
      "Reconcile final invoice to TD e-288",
      "Archive complete file",
      "Update county history",
      "Close TD e-288 as Complete",
    ],
    painPointRanks: [18, 19],
    toolHrefs: ["/psap-portal/advisor/job-aids", "/psap-portal/advisor/process-map"],
  },
];

export const TOP_PAIN_POINTS: PainPoint[] = [
  {
    rank: 1,
    title: "SOW template compliance & completeness",
    description:
      "Incomplete/non-compliant SOWs missing Att. 16 sections cause revision cycles and delays.",
    rootCause: "Mandatory structured Att. 16 vs prior informal proposals",
    severity: "HIGH",
    frequency: "Very high first 6–9 months",
    mitigations: [
      "1-page SOW Completeness Checklist (portal SOW checker)",
      "Example SOW outlines (Cloud / On-Prem)",
      "Vendor orientation within 30 days of award",
      "Optional pre-submission review",
    ],
    processIds: [2],
    toolHrefs: ["/psap-portal/tools/sow-checker"],
    psapFacingTip:
      "Run the SOW completeness checker before you send a draft to your Advisor. Incomplete SOWs are the #1 delay.",
  },
  {
    rank: 2,
    title: "Invoice rejections & payment delays",
    description:
      "Old formats or missing mandatory fields (TD e-288 ref, breakdowns, acceptance date) delay payment.",
    rootCause: "Prescriptive Att. 14/15 template + central CA911Invoicing mailbox",
    severity: "HIGH",
    frequency: "High once projects invoice",
    mitigations: [
      "Invoice Quick Reference + portal invoice checker",
      "Internal validation checklist",
      "Pre-submission review option",
      "Weekly top mistakes feedback to vendors",
    ],
    processIds: [5],
    toolHrefs: ["/psap-portal/tools/invoice-checker", "/advisor-tools/invoice-reconciler"],
    psapFacingTip:
      "Use the invoice readiness checker against your TD e-288 before anything hits CA911Invoicing@.",
  },
  {
    rank: 3,
    title: "Change order bottleneck",
    description:
      "Every material change needs Branch approval as well as PSAP — backlog slows installs.",
    rootCause: "Formal multi-party change control to protect funding",
    severity: "HIGH",
    frequency: "High year one",
    mitigations: [
      "Standard Change Order form with impact fields",
      "Approval thresholds (e.g. small cost expedite)",
      "Shared CO tracker + 48–72h SLA target",
      "Clear MAC minor vs major criteria",
    ],
    processIds: [4, 3, 8],
    toolHrefs: ["/psap-portal/advisor/requests", "/psap-portal/advisor/job-aids"],
    psapFacingTip:
      "Expect Branch approval on scope/cost/timeline changes. Document impact early — informal emails stall projects.",
  },
  {
    rank: 4,
    title: "Incomplete Advance Notification forms",
    description:
      "Missing fields or unclear Cloud vs On-Prem delays allotment and poisons downstream work.",
    rootCause: "New mandatory Att. 11 with explicit solution-type selection",
    severity: "HIGH",
    frequency: "Very high first 3–6 months",
    mitigations: [
      "Fillable form + required-field guidance",
      "One-pager how-to + portal Adv Notice wizard",
      "Admin completeness triage before Advisor deep review",
      "Cloud vs On-Prem attachment",
    ],
    processIds: [1],
    toolHrefs: [
      "/psap-portal/tools/advance-notification-wizard",
      "/psap-portal/tools/cloud-vs-onprem",
    ],
    psapFacingTip:
      "Complete the Advance Notification prep wizard so Cloud/On-Prem and FY are unambiguous before emailing your Advisor.",
  },
  {
    rank: 5,
    title: "Cloud vs On-Prem funding model confusion",
    description:
      "MRC vs one-time costs, bandwidth, support models — Advisors spend heavy time explaining.",
    rootCause: "Dual solution types with separate cost structures",
    severity: "HIGH",
    frequency: "High first 12–18 months",
    mitigations: [
      "One-page comparison matrix (portal tool)",
      "Decision-support questions on Adv Notice path",
      "Model-aware SOW checklist branches",
    ],
    processIds: [1, 2],
    toolHrefs: ["/psap-portal/tools/cloud-vs-onprem", "/psap-portal/tools/sow-checker"],
    psapFacingTip:
      "Pick one model per PSAP (not both). Cloud emphasizes bandwidth/MRC; On-Prem emphasizes site readiness and install licensing.",
  },
  {
    rank: 6,
    title: "TD e-288 backlog",
    description:
      "Creation/amendment delays stall vendors who will not proceed without written funding confirmation.",
    rootCause: "TD e-288 is single financial source of truth with stricter controls",
    severity: "HIGH",
    frequency: "High when projects active",
    mitigations: [
      "Standard intake with pre-populate from Adv Notice",
      "Visible TD e-288 tracker with aging",
      "Internal SLAs (new ~2 days, amendments ~3 days)",
      "Package completeness before create (portal TD-288 checker)",
    ],
    processIds: [1, 3, 5],
    toolHrefs: ["/psap-portal/tools/td288-checker"],
    psapFacingTip:
      "Vendors often wait on TD e-288 confirmation. Complete package materials first so your Advisor can issue tracking without rework.",
  },
  {
    rank: 7,
    title: "PSAP multi-party sign-off delays",
    description:
      "Director/IT/Ops/Counsel chains delay SOW and TD284 sign-off and cascade timelines.",
    rootCause: "Formal documented sign-off requirements",
    severity: "HIGH",
    frequency: "Persistent",
    mitigations: [
      "Recommended review timeline in SOW",
      "Track average sign-off time by county",
      "Pre-socialize SOW with stakeholders early",
    ],
    processIds: [2, 7],
    toolHrefs: ["/psap-portal/advisor/job-aids"],
    psapFacingTip:
      "Start internal SOW and acceptance routing early — multi-signature delays are a top timeline killer.",
  },
  {
    rank: 8,
    title: "Pricing/scope misalignment with awarded contract",
    description: "SOW line items not matching Exhibit C awarded rates.",
    rootCause: "Locked competitive pricing; SOW-time adjustments",
    severity: "MEDIUM-HIGH",
    frequency: "Medium-high year one",
    mitigations: [
      "Require Exhibit C line-item references",
      "Return non-compliant SOWs within 48 hours",
      "Quick internal cross-check step",
    ],
    processIds: [2],
    toolHrefs: ["/psap-portal/tools/sow-checker", "/psap-portal/tools/vendor-pool"],
    psapFacingTip:
      "Quotes should align with awarded MPA pricing. Mismatches delay SOW approval.",
  },
  {
    rank: 9,
    title: "On-Prem site readiness delays",
    description: "Power/HVAC/cabling/space underestimate delays installs.",
    rootCause: "On-Prem physical work + site cert/floor plan emphasis",
    severity: "MEDIUM-HIGH",
    frequency: "High for On-Prem",
    mitigations: [
      "Site certification & floor plan in SOW appendices",
      "Early facilities walkthrough",
      "C-7 licensed install awareness",
    ],
    processIds: [2, 7],
    toolHrefs: ["/psap-portal/tools/cloud-vs-onprem", "/psap-portal/tools/sow-checker"],
    psapFacingTip:
      "On-Prem: document site readiness before SOW final. Facilities lag is a common install delay.",
  },
  {
    rank: 10,
    title: "CAD/radio/NG integration gaps late",
    description: "Legacy integrations surface in testing → COs and acceptance delays.",
    rootCause: "Integration section required but hard to fully document upfront",
    severity: "MEDIUM-HIGH",
    frequency: "Common in testing",
    mitigations: [
      "Early Integration Discovery Workshop",
      "Document known limitations in SOW",
      "Library of common integration issues",
    ],
    processIds: [2, 7],
    toolHrefs: ["/psap-portal/tools/sow-checker"],
    psapFacingTip:
      "Inventory CAD/radio/logging interfaces early and put them in the SOW integrations section.",
  },
  {
    rank: 11,
    title: "Initial simultaneous submission spike",
    description: "Wave of Adv Notices/SOWs overwhelms Advisors in months 1–4.",
    rootCause: "Pent-up demand + new standardized path opens at once",
    severity: "MEDIUM-HIGH",
    frequency: "Very high months 1–4",
    mitigations: [
      "Admin triage for completeness",
      "Published SLAs",
      "Surge capacity first 90–120 days",
      "PSAP self-serve tools to reduce incomplete packages",
    ],
    processIds: [1, 2, 6],
    toolHrefs: ["/psap-portal/psap", "/psap-portal/tools"],
    psapFacingTip:
      "Self-complete checklists first — incomplete packages amplify the post-award spike for everyone.",
  },
  {
    rank: 12,
    title: "Unclear escalation when PSAP & vendor disagree",
    description: "Missing mediation paths prolong disputes.",
    rootCause: "Formal multi-party process vs prior informal relationships",
    severity: "MEDIUM",
    frequency: "When conflicts arise",
    mitigations: [
      "3-step escalation matrix with timeframes",
      "Document common dispute types",
    ],
    processIds: [4],
    toolHrefs: ["/psap-portal/advisor/job-aids", "/psap-portal/support"],
    psapFacingTip:
      "Document disagreements in writing with SOW references; ask your Advisor for the Branch escalation path early.",
  },
  {
    rank: 13,
    title: "Post-acceptance MAC scope creep",
    description: "Major changes handled informally under maintenance.",
    rootCause: "Need clear minor MAC vs major CO distinction",
    severity: "MEDIUM",
    frequency: "Ongoing",
    mitigations: ["Minor vs major criteria", "MAC request log reviewed monthly"],
    processIds: [8],
    toolHrefs: ["/psap-portal/advisor/job-aids"],
    psapFacingTip:
      "After TD284, major moves/adds/changes may need a formal change order — not only a maintenance ticket.",
  },
  {
    rank: 14,
    title: "Training documentation gaps",
    description: "Missing attendance/sign-off creates later disputes.",
    rootCause: "SOW §k formalizes training documentation",
    severity: "MEDIUM",
    frequency: "Common",
    mitigations: [
      "Mandatory Training Completion & Sign-off form",
      "5-day submission requirement after training",
    ],
    processIds: [9, 10],
    toolHrefs: ["/psap-portal/advisor/job-aids"],
    psapFacingTip: "Keep training sign-in sheets and manual delivery records in the project file.",
  },
  {
    rank: 15,
    title: "Real-time multi-county tracking burden",
    description: "Trackers go stale with 10–20+ active projects.",
    rootCause: "Higher structured project volume",
    severity: "MEDIUM",
    frequency: "Persistent",
    mitigations: [
      "Standard county tracker template + weekly cadence",
      "Data steward + monthly quality checks",
      "Low-code dashboards when available",
    ],
    processIds: [6],
    toolHrefs: ["/psap-portal/advisor"],
    psapFacingTip:
      "Send concise status updates with milestone dates when asked — it keeps your county tracker accurate.",
  },
  {
    rank: 16,
    title: "New vendors unfamiliar with Branch culture",
    description: "Under-documentation and weak approval-chain habits.",
    rootCause: "Competitive award may bring new vendors",
    severity: "MEDIUM",
    frequency: "Higher first 12 months",
    mitigations: [
      "Working with Cal OES orientation",
      "Primary Advisor contact first 3–6 months",
    ],
    processIds: [2, 5],
    toolHrefs: ["/psap-portal/tools/vendor-pool"],
    psapFacingTip:
      "Share portal job aids with your vendor early so they follow Att. 16 / invoice templates.",
  },
  {
    rank: 17,
    title: "Cloud bandwidth / connectivity delays",
    description: "Circuit/data-center readiness lags discovered late.",
    rootCause: "Cloud SOW bandwidth requirements",
    severity: "MEDIUM",
    frequency: "Cloud projects",
    mitigations: [
      "Bandwidth notes required in SOW",
      "Early carrier/data-center checklist",
    ],
    processIds: [2],
    toolHrefs: ["/psap-portal/tools/cloud-vs-onprem", "/psap-portal/tools/sow-checker"],
    psapFacingTip:
      "For Cloud, confirm bandwidth/connectivity timelines before install commitments.",
  },
  {
    rank: 18,
    title: "Audit trail gaps in transition",
    description: "Missing SOW versions, CO approvals, TD284 in project files.",
    rootCause: "Rigor jump from informal processes",
    severity: "MEDIUM",
    frequency: "High risk at audit",
    mitigations: [
      "Standard project file checklist",
      "Random 10% file audits year one",
      "File-complete sign-off before close",
    ],
    processIds: [10],
    toolHrefs: ["/psap-portal/advisor/job-aids"],
    psapFacingTip:
      "Keep versioned SOWs, change approvals, invoices, and TD284 in one project folder.",
  },
  {
    rank: 19,
    title: "Confidentiality / personnel onboarding gaps",
    description: "New personnel without Att. 10 post-award confidentiality.",
    rootCause: "Post-award confidentiality requirements",
    severity: "MEDIUM",
    frequency: "Ongoing compliance risk",
    mitigations: [
      "Signed statements before new personnel start",
      "Central log per project",
    ],
    processIds: [10],
    toolHrefs: ["/psap-portal/advisor/job-aids"],
    psapFacingTip:
      "Vendors must onboard staff under contract confidentiality rules — ask for confirmation if new techs appear mid-project.",
  },
  {
    rank: 20,
    title: "End-of-fiscal-year rush",
    description: "Spike near FYE creates errors and carryover backlog.",
    rootCause: "Funding cycles + multi-gate process",
    severity: "MEDIUM",
    frequency: "Predictable annual",
    mitigations: [
      "Communicate FY cutoffs early",
      "Prioritize by fiscal urgency",
      "PSAP prep tools year-round",
    ],
    processIds: [1, 2, 5],
    toolHrefs: ["/psap-portal/tools/advance-notification-wizard"],
    psapFacingTip:
      "Do not wait for fiscal year-end to start Advance Notification and SOW work.",
  },
];

export const EXTERNAL_REQUESTS: ExternalRequest[] = [
  {
    id: "E1",
    source: "PSAP",
    description: "Advance Notification for CPE Funding (Cloud or On-Prem)",
    processId: 1,
    steps: [
      "Log & acknowledge",
      "Completeness & eligibility",
      "Allotment decision",
      "Create TD e-288",
      "Notify PSAP + vendor evaluation window",
    ],
    timeline: "Ack 1–2 days · Full 5–10 days",
  },
  {
    id: "E2",
    source: "PSAP / Vendor",
    description: "Draft SOW for review (Att. 16)",
    processId: 2,
    steps: [
      "Completeness check",
      "Pricing/schedule alignment",
      "Technical review if needed",
      "Comments or approval",
      "Link TD e-288",
    ],
    timeline: "Initial 3–5 days · Full 7–15 days",
  },
  {
    id: "E3",
    source: "Vendor",
    description: "Change Order requiring Branch approval",
    processId: 4,
    steps: [
      "Log & assess impact",
      "PSAP concurrence",
      "Approve/reject/negotiate",
      "Update TD e-288 if needed",
      "Distribute",
    ],
    timeline: "Simple 3–7 days · Complex 7–14 days",
  },
  {
    id: "E4",
    source: "PSAP",
    description: "Invoice status / payment delay inquiry",
    processId: 5,
    steps: [
      "Locate invoice",
      "Verify vs TD e-288 & SOW",
      "Explain status or issue",
      "Escalate Finance if needed",
    ],
    timeline: "Response 1–3 days",
  },
  {
    id: "E5",
    source: "Vendor",
    description: "Written confirmation TD e-288 / funding issued",
    processId: 3,
    steps: [
      "Verify TD e-288 status",
      "Confirm amount/conditions",
      "Provide formal confirmation",
      "Copy PSAP",
    ],
    timeline: "Same day–2 days (scheduling critical)",
  },
  {
    id: "E6",
    source: "Other Branch units",
    description: "Aggregate status / funding utilization report",
    processId: 6,
    steps: [
      "Pull tracker data",
      "Compile summary",
      "QA",
      "Deliver + offer context",
    ],
    timeline: "Standard 2–5 days · Complex 5–10 days",
  },
];

export const INTERNAL_REQUESTS: ExternalRequest[] = [
  {
    id: "I1",
    source: "Supervisor",
    description: "County pipeline / risk / status summary",
    processId: 6,
    steps: [
      "Update trackers",
      "Identify risks",
      "Prepare summary",
      "Review escalations",
    ],
    timeline: "Weekly standing · Ad-hoc same/next day",
  },
  {
    id: "I2",
    source: "Finance / Invoicing",
    description: "Verify invoice ≤ approved TD e-288 before pay",
    processId: 5,
    steps: [
      "Pull TD e-288",
      "Compare remaining balance",
      "Confirm or flag overage",
      "Written verification",
    ],
    timeline: "Same day–2 days",
  },
  {
    id: "I3",
    source: "Teammate / Advisor",
    description: "PSAP history, contacts, lessons learned",
    processId: 6,
    steps: ["Search files", "Summarize", "Share docs/notes"],
    timeline: "Simple same day · Complex 1–2 days",
  },
];

export const JOB_AIDS = [
  {
    id: "aid-sow",
    title: "SOW Completeness Checklist (Att. 16)",
    audience: "both" as const,
    href: "/psap-portal/tools/sow-checker",
    pain: 1,
  },
  {
    id: "aid-inv",
    title: "Invoice Quick Validation (Att. 14/15)",
    audience: "both" as const,
    href: "/psap-portal/tools/invoice-checker",
    pain: 2,
  },
  {
    id: "aid-adv",
    title: "Advance Notification prep (Att. 11)",
    audience: "both" as const,
    href: "/psap-portal/tools/advance-notification-wizard",
    pain: 4,
  },
  {
    id: "aid-model",
    title: "Cloud vs On-Prem decision support",
    audience: "both" as const,
    href: "/psap-portal/tools/cloud-vs-onprem",
    pain: 5,
  },
  {
    id: "aid-td288",
    title: "TD-288 / TD e-288 package gate",
    audience: "both" as const,
    href: "/psap-portal/tools/td288-checker",
    pain: 6,
  },
  {
    id: "aid-vendor",
    title: "Vendor pool evaluation checklist",
    audience: "psap" as const,
    href: "/psap-portal/tools/vendor-pool",
    pain: 16,
  },
  {
    id: "aid-close",
    title: "Project file / closeout checklist themes",
    audience: "advisor" as const,
    href: "/psap-portal/advisor/job-aids#closeout",
    pain: 18,
  },
  {
    id: "aid-mac",
    title: "Minor MAC vs Major Change criteria",
    audience: "advisor" as const,
    href: "/psap-portal/advisor/job-aids#mac",
    pain: 13,
  },
  {
    id: "aid-esc",
    title: "Escalation matrix (3-step)",
    audience: "advisor" as const,
    href: "/psap-portal/advisor/job-aids#escalation",
    pain: 12,
  },
];

export const FLOW_OVERVIEW = [
  "PSAP submits Advance Notification (E1)",
  "Process 1: Funding notification & allotment (TD e-288 created)",
  "PSAP engages awarded vendor → draft SOW (E2)",
  "Process 2: SOW review & approval",
  "Process 3: TD e-288 finalization / linking",
  "Execution + Process 6 status reporting",
  "Change orders as needed (E3 → Process 4)",
  "Install → testing → acceptance (Process 7: TD284)",
  "Invoicing (Process 5) + Training (Process 9)",
  "Post-acceptance MACs (Process 8)",
  "Process 10: Closeout & archiving",
];
