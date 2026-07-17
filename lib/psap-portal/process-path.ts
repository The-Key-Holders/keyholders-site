/**
 * Canonical CPE funding path for navigation and tool ordering.
 * Order matches Advisor gatekeeping under RFP 26-16743.
 */

export type ProcessStep = {
  step: number;
  id: string;
  label: string;
  short: string;
  href: string;
  phase: "orient" | "decide" | "package" | "pay" | "help";
  when: string;
};

/** Primary sequential path PSAPs should follow for a CPE project */
export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    id: "orient",
    label: "Start here",
    short: "Orient",
    href: "/psap-portal/start",
    phase: "orient",
    when: "First visit — purpose, beta access, how tools fit together",
  },
  {
    step: 2,
    id: "model",
    label: "Cloud vs On-Prem",
    short: "Model",
    href: "/psap-portal/tools/cloud-vs-onprem",
    phase: "decide",
    when: "Before Advance Notification — pick one model per PSAP",
  },
  {
    step: 3,
    id: "vendors",
    label: "Vendor pool",
    short: "Vendors",
    href: "/psap-portal/tools/vendor-pool",
    phase: "decide",
    when: "Evaluate contractors inside the awarded MPA pool",
  },
  {
    step: 4,
    id: "adv-notice",
    label: "Advance Notification",
    short: "Notify",
    href: "/psap-portal/tools/advance-notification-wizard",
    phase: "package",
    when: "Signal funding need + Cloud/On-Prem + FY to your Advisor",
  },
  {
    step: 5,
    id: "sow",
    label: "SOW check",
    short: "SOW",
    href: "/psap-portal/tools/sow-checker",
    phase: "package",
    when: "Before TD-288 — Attachment 16 completeness",
  },
  {
    step: 6,
    id: "td288",
    label: "TD-288 package",
    short: "Package",
    href: "/psap-portal/tools/td288-checker",
    phase: "package",
    when: "Full funding package before Commitment to Fund",
  },
  {
    step: 7,
    id: "invoice",
    label: "Invoice check",
    short: "Invoice",
    href: "/psap-portal/tools/invoice-checker",
    phase: "pay",
    when: "After acceptance — Att 14/15 fields vs TD-288",
  },
];

/** Anytime helpers (not strictly sequential) */
export const HELP_TOOLS = [
  {
    href: "/psap-portal/tools/advisor-lookup",
    label: "Find my Advisor",
    desc: "County / PSAP assignment (sample until live data)",
  },
  {
    href: "/psap-portal/tools/submit-question",
    label: "Submit a question",
    desc: "Structured ticket when self-serve is not enough",
  },
  {
    href: "/psap-portal/faqs",
    label: "FAQs & buy/wait",
    desc: "Common answers + decision wizard",
  },
  {
    href: "/psap-portal/contracts",
    label: "Contracts 101",
    desc: "RFP 26-16743 · CPE vs network",
  },
  {
    href: "/psap-portal/funding",
    label: "Funding basics",
    desc: "Allotment tiers · process spine",
  },
] as const;

export function matchProcessStep(pathname: string): ProcessStep | null {
  if (!pathname) return null;
  // Prefer longest href match
  const hits = PROCESS_STEPS.filter(
    (s) => pathname === s.href || pathname.startsWith(s.href + "/")
  );
  if (hits.length) return hits[hits.length - 1];
  if (pathname.startsWith("/psap-portal/start")) return PROCESS_STEPS[0];
  return null;
}

export const CREATOR = {
  handle: "Vault Keywright",
  org: "The Key Holders",
  blurb:
    "Crafts keys into the funding vault — process tools that unlock CPE packages without jamming the Advisor switchboard.",
} as const;
