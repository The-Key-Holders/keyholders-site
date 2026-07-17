/**
 * Operational SLA targets for CPE funding path (Slice 3).
 * Sources: lib/psap-portal/post-award-content.ts Advisor process timelines
 * (ack 1–2d, SOW 7–15d, TD e-288 same-day/amend 2–5d, CO 3–14d, invoice triage 1–2d).
 * Calendar days (not business days) for MVP clarity.
 */

export type SlaBand = "ok" | "watch" | "breach";

export type ProcessSlaRule = {
  processCode: string;
  /** Target days from process open/start (or path open if never started) */
  targetDays: number;
  /** Soft warning before breach */
  watchDays: number;
  label: string;
};

/** Default targets aligned to post-award operational framework */
export const PROCESS_SLA_RULES: ProcessSlaRule[] = [
  {
    processCode: "model_select",
    targetDays: 3,
    watchDays: 2,
    label: "Model select",
  },
  {
    processCode: "adv_notice",
    targetDays: 10,
    watchDays: 7,
    label: "Advance Notification / allotment",
  },
  {
    processCode: "sow",
    targetDays: 15,
    watchDays: 10,
    label: "SOW review",
  },
  {
    processCode: "td288",
    targetDays: 20,
    watchDays: 14,
    label: "TD-288 package",
  },
  {
    processCode: "change_order",
    targetDays: 14,
    watchDays: 7,
    label: "Change order",
  },
  {
    processCode: "invoice",
    targetDays: 7,
    watchDays: 4,
    label: "Invoice check",
  },
];

/** Days in current bucket before watch / breach (Advisor board aging) */
export const BUCKET_SLA: Record<
  string,
  { watchDays: number; breachDays: number; label: string }
> = {
  funding_init: { watchDays: 7, breachDays: 12, label: "Funding initiation" },
  planning: { watchDays: 10, breachDays: 18, label: "Planning (SOW)" },
  package: { watchDays: 14, breachDays: 25, label: "TD-288 package" },
  pay: { watchDays: 5, breachDays: 10, label: "Invoice / pay" },
  complete: { watchDays: 999, breachDays: 999, label: "Complete" },
};

export function daysBetween(fromIso: string, to: Date = new Date()): number {
  const a = new Date(fromIso).getTime();
  const b = to.getTime();
  if (Number.isNaN(a)) return 0;
  return Math.max(0, Math.floor((b - a) / (1000 * 60 * 60 * 24)));
}

export function bandForDays(
  days: number,
  watchDays: number,
  breachDays: number
): SlaBand {
  if (days >= breachDays) return "breach";
  if (days >= watchDays) return "watch";
  return "ok";
}

export function processSla(
  processCode: string,
  startedAt: string | undefined,
  status: string,
  now: Date = new Date()
): {
  band: SlaBand;
  daysOpen: number;
  targetDays: number;
  rule?: ProcessSlaRule;
} | null {
  if (status === "completed" || status === "waived") {
    return { band: "ok", daysOpen: 0, targetDays: 0 };
  }
  const rule = PROCESS_SLA_RULES.find((r) => r.processCode === processCode);
  if (!rule || !startedAt) {
    return rule
      ? { band: "ok", daysOpen: 0, targetDays: rule.targetDays, rule }
      : null;
  }
  const daysOpen = daysBetween(startedAt, now);
  return {
    band: bandForDays(daysOpen, rule.watchDays, rule.targetDays),
    daysOpen,
    targetDays: rule.targetDays,
    rule,
  };
}

export function bucketSla(
  bucketCode: string,
  enteredAtApprox: string,
  now: Date = new Date()
): { band: SlaBand; daysInBucket: number; watchDays: number; breachDays: number } {
  const rule = BUCKET_SLA[bucketCode] ?? {
    watchDays: 10,
    breachDays: 20,
    label: bucketCode,
  };
  const daysInBucket = daysBetween(enteredAtApprox, now);
  return {
    band: bandForDays(daysInBucket, rule.watchDays, rule.breachDays),
    daysInBucket,
    watchDays: rule.watchDays,
    breachDays: rule.breachDays,
  };
}
