import type { BatchLine } from "./types";

export const DEFAULT_RULES = {
  sla_days: { review: 5, hold: 30, payment: 45 },
  traffic: {
    RED: ["NO_TRACKING", "TD288_NOT_FOUND", "CPE_INSTALL", "SLA_CRITICAL"],
    YELLOW: ["NOT_LISTED", "YR_EXTENDED", "SLA_WARN", "TRACKING_UNCLEAR", "DISPUTE_HINT", "OVERBILLED"],
    GREEN_requires: ["TD288_FOUND"],
  },
  dispute_blurbs: {
    CPE_INSTALL: "Install charge appears on maintenance batch — verify vs TD-288 scope.",
    YR_EXTENDED: "Extended maintenance year flag — verify authorized years.",
    TD288_NOT_FOUND: "Tracking number not found in local TD-288 index.",
    NOT_LISTED: "Marked NOT LISTED in batch notes.",
    NO_TRACKING: "No TD-288 tracking number on line.",
    SLA_CRITICAL: "Past 45-day prompt payment window — escalate to fiscal.",
    SLA_WARN: "SLA review window exceeded or hold aging.",
  } as Record<string, string>,
};

export function applyFlags(line: BatchLine): string[] {
  const flags: string[] = [];
  const blob = `${line.psap_name} ${line.tracking} ${line.notes} ${line.raw}`;
  if (!(line.tracking || "").trim()) flags.push("NO_TRACKING");
  if (/YR\s*[-]?\s*([6-9]|\d+\s*\+\s*\d+)/i.test(blob)) flags.push("YR_EXTENDED");
  if (/NOT\s+LISTED/i.test(blob)) flags.push("NOT_LISTED");
  if (/CPE\s+INSTALL/i.test(blob)) flags.push("CPE_INSTALL");
  if (/OVERBILLED/i.test(blob)) flags.push("OVERBILLED");
  if (/STD\s*209|\bdispute\b/i.test(blob)) flags.push("DISPUTE_HINT");
  return Array.from(new Set(flags));
}
