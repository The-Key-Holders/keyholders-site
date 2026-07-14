import { applyFlags, DEFAULT_RULES } from "./rules";
import { assessSla } from "./sla";
import type { BatchLine, LineResult, Recommendation, Td288Entry, Traffic } from "./types";

function lookup(
  index: Record<string, Td288Entry>,
  tracking: string
): Td288Entry | undefined {
  if (!tracking) return undefined;
  const key = tracking.replace(/\D/g, "");
  if (index[key]) return index[key];
  if (key.length > 5 && index[key.slice(0, 5)]) return index[key.slice(0, 5)];
  return index[tracking];
}

function trafficAndReco(flags: string[], td288_hit: boolean): [Traffic, Recommendation] {
  const red = new Set(DEFAULT_RULES.traffic.RED);
  const yellow = new Set(DEFAULT_RULES.traffic.YELLOW);
  const isRed = flags.some((f) => red.has(f));
  const isYellow = flags.some((f) => yellow.has(f));
  if (isRed) {
    const hard = new Set(["CPE_INSTALL", "SLA_CRITICAL", "NO_TRACKING"]);
    if (flags.some((f) => hard.has(f))) return ["RED", "DISPUTE"];
    if (flags.includes("TD288_NOT_FOUND")) return ["RED", "REVIEW"];
    return ["RED", "DISPUTE"];
  }
  if (isYellow) return ["YELLOW", "REVIEW"];
  if (td288_hit && flags.includes("TD288_FOUND")) return ["GREEN", "APPROVE"];
  return ["YELLOW", "REVIEW"];
}

export function reconcile(
  lines: BatchLine[],
  index: Record<string, Td288Entry>,
  opts: { received: Date; today?: Date; reviewed?: boolean }
): LineResult[] {
  const blurbs = DEFAULT_RULES.dispute_blurbs;
  return lines.map((line) => {
    const flags = applyFlags(line);
    const entry = line.tracking ? lookup(index, line.tracking) : undefined;
    const td288_hit = !!entry;
    const paths = entry?.paths ?? [];
    if (line.tracking && td288_hit) flags.push("TD288_FOUND");
    else if (line.tracking && !td288_hit) flags.push("TD288_NOT_FOUND");

    const sla = assessSla({
      received: opts.received,
      today: opts.today,
      reviewed: opts.reviewed,
      review_days: DEFAULT_RULES.sla_days.review,
      hold_days: DEFAULT_RULES.sla_days.hold,
      payment_days: DEFAULT_RULES.sla_days.payment,
    });
    if (sla.status === "CRITICAL") flags.push("SLA_CRITICAL");
    else if (sla.status === "WARN") flags.push("SLA_WARN");

    const flags_u = Array.from(new Set(flags));
    const [traffic, recommendation] = trafficAndReco(flags_u, td288_hit);
    const reasons = flags_u.filter((f) => blurbs[f]).map((f) => blurbs[f]);
    if (td288_hit) reasons.push(`TD-288 index hit (${paths.length} path(s)).`);
    return {
      line,
      traffic,
      recommendation,
      flags: flags_u,
      td288_hit,
      td288_paths: paths,
      sla,
      rationale: reasons.join(" ") || "No special flags.",
    };
  });
}

export function summarize(results: LineResult[], meta: { received_date: string; version: string; index_size: number }) {
  const counts = { GREEN: 0, YELLOW: 0, RED: 0 };
  const recommendations: Record<string, number> = { APPROVE: 0, DISPUTE: 0, REVIEW: 0, HOLD: 0 };
  for (const r of results) {
    counts[r.traffic] += 1;
    recommendations[r.recommendation] = (recommendations[r.recommendation] || 0) + 1;
  }
  return {
    meta: { ...meta, title: "Invoice ↔ TD-288 Reconciliation Report" },
    counts,
    recommendations,
    lines: results,
  };
}
