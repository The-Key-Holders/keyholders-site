import erlangTable from "./config/erlang_b_p01.json";
import mpaRates from "./config/mpa_rates.example.json";
import type { ECaTSParseResult, FundingCalculation, SystemType } from "./types";

function topNMonthAverage(monthly: ECaTSParseResult["monthlyStats"], n = 3): number {
  const totals = monthly.map((m) => m.answered).filter(Boolean).sort((a, b) => b - a);
  if (!totals.length) return 0;
  const pick = totals.slice(0, Math.min(n, totals.length));
  return pick.reduce((a, b) => a + b, 0) / pick.length;
}

function topBusyHoursInPeakMonth(
  monthlyHourly: ECaTSParseResult["monthlyHourly"],
  n = 10
): { avg: number; topHours: number[]; peakLabel: string } {
  let bestLabel = "";
  let bestTop: number[] = [];
  for (const month of monthlyHourly) {
    const ranked = [...month.hourlyCounts].sort((a, b) => b - a);
    const top = ranked.slice(0, Math.min(n, ranked.length));
    if (top.reduce((a, b) => a + b, 0) > bestTop.reduce((a, b) => a + b, 0)) {
      bestTop = top;
      bestLabel = month.monthLabel;
    }
  }
  if (!bestTop.length) return { avg: 0, topHours: [], peakLabel: "" };
  return { avg: bestTop.reduce((a, b) => a + b, 0) / bestTop.length, topHours: bestTop, peakLabel: bestLabel };
}

function topBusyHours(totals: number[], n = 10): { avg: number; topHours: number[] } {
  if (!totals.length) return { avg: 0, topHours: [] };
  const ranked = [...totals].sort((a, b) => b - a);
  const top = ranked.slice(0, Math.min(n, ranked.length));
  return { avg: top.reduce((a, b) => a + b, 0) / top.length, topHours: top };
}

function erlangBPositions(erlangs: number): number {
  for (const entry of erlangTable.entries) {
    if (erlangs <= entry.erlangs_max) return entry.positions;
  }
  return erlangTable.entries[erlangTable.entries.length - 1].positions;
}

function levelFivePositions(answered: number, abandoned: number): number {
  const capped = Math.min(abandoned, answered * 0.2);
  return Math.ceil(answered / 1000 + capped / 2000);
}

function cloudHourlyTier(busyHourCalls: number): string {
  const tiers: [number, string][] = [
    [100, "0-100 calls/hour"],
    [300, "101-300 calls/hour"],
    [750, "301-750 calls/hour"],
    [1450, "751-1450 calls/hour"],
    [3600, "1451-3600 calls/hour"],
  ];
  for (const [limit, label] of tiers) {
    if (busyHourCalls <= limit) return label;
  }
  return "3600+ calls/hour";
}

function estimateAllotment(positions: number, systemType: SystemType): number {
  if (systemType === "cloud") {
    const r = mpaRates.cloud;
    return r.base_system_cost + r.backroom_cost + positions * r.per_position_monthly_annualized;
  }
  const r = mpaRates.on_premise;
  return r.base_system_cost + r.backroom_cost + positions * r.per_position_cost;
}

export function calculateFunding(
  ecats: ECaTSParseResult,
  systemType: SystemType = "on_premise",
  avgCallDurationSec = 80
): FundingCalculation {
  const notes: string[] = [];
  const busyMonth = topNMonthAverage(ecats.monthlyStats, 3);

  let busyHourAvg = 0;
  let topHours: number[] = [];
  let peakMonthLabel = "";

  if (ecats.monthlyHourly.length) {
    const peak = topBusyHoursInPeakMonth(ecats.monthlyHourly, 10);
    busyHourAvg = peak.avg;
    topHours = peak.topHours;
    peakMonthLabel = peak.peakLabel;
  } else {
    const flat = topBusyHours(ecats.hourlyTotals, 10);
    busyHourAvg = flat.avg;
    topHours = flat.topHours;
  }

  const abandonedSorted = [...ecats.monthlyStats].sort((a, b) => b.answered - a.answered);
  const top3 = abandonedSorted.slice(0, 3);
  const abandonedMonth = top3.reduce((s, m) => s + m.abandoned, 0) / Math.max(top3.length, 1);

  if (busyMonth <= 0 && !ecats.monthlyStats.length) {
    notes.push("No monthly call data found in ECaTS Call Summary export.");
  }

  let level: number;
  let basis: string;
  let positions: number;
  let erlangs: number | null = null;
  let cloudTier: string | null = null;

  if (busyMonth > 15000) {
    level = 5;
    basis = "Level 5: >15,000 calls/month (busy month formula)";
    positions = levelFivePositions(busyMonth, abandonedMonth);
  } else if (busyMonth > (systemType === "on_premise" ? 1200 : 1201)) {
    level = 4;
    basis = "Level 4: busy hour Erlang B @ P.01";
    const multiplier = systemType === "on_premise" ? 2 : 3;
    erlangs = ((busyHourAvg * multiplier) * (avgCallDurationSec + 60)) / 3600;
    positions = erlangBPositions(erlangs);
    cloudTier = cloudHourlyTier(Math.max(...topHours, busyHourAvg));
    if (peakMonthLabel) notes.push(`Level 4 busy-hour analysis uses peak month: ${peakMonthLabel}.`);
    notes.push(
      "ECaTS 'Calls Per Hour' with Period Group=Month aggregates each clock-hour across all days; validate against ECaTS daily busy-hour drilldown when available."
    );
    if (topHours.length >= 2 && topHours[0] > 0) {
      const delta = Math.abs(topHours[0] - topHours[1]) / topHours[0];
      if (delta > 0.1) {
        notes.push(
          `Busy hour #1 vs #2 delta is ${(delta * 100).toFixed(1)}%; Chapter III requires <=10% for Level 4 selection.`
        );
      }
    }
  } else if (busyMonth >= 801) {
    level = 3;
    basis = "Level 3: 801-1,200 calls/month (top 3 months / 18 months)";
    positions = Math.max(2, Math.round(busyMonth / 100));
    notes.push("Level 2/3 position count should be validated against current MPA pricing workbook.");
  } else {
    level = 2;
    basis = "Level 2: 0-800 calls/month (top 3 months / 18 months)";
    positions = Math.max(2, Math.round(busyMonth / 150));
    notes.push("Level 2 PSAPs are encouraged to consider regionalized/consolidated dispatch.");
  }

  if (ecats.answerTime?.totalCalls) {
    const at = ecats.answerTime;
    notes.push(
      `ECaTS Answer Time (12 mo): ${(at.pctWithin10Sec * 100).toFixed(1)}% within 10s, ${(at.pctWithin15Sec * 100).toFixed(1)}% within 15s (seizure-to-answer).`
    );
  }
  if (ecats.ringTime?.totalCalls) {
    const rt = ecats.ringTime;
    notes.push(
      `ECaTS Ring Time (12 mo): ${(rt.pctWithin10Sec * 100).toFixed(1)}% within 10s, ${(rt.pctWithin15Sec * 100).toFixed(1)}% within 15s (ring-to-answer).`
    );
  }
  if (ecats.classOfService.length) {
    const top = [...ecats.classOfService].sort((a, b) => b.callCount - a.callCount).slice(0, 3);
    notes.push(`ECaTS Class of Service top classes: ${top.map((e) => `${e.serviceClass} (${e.callCount})`).join(", ")}.`);
  }

  notes.push("Allotment estimate uses configurable MPA rates; replace with current price sheets before issuing letter.");

  return {
    fundingLevel: level,
    basis,
    typicalBusyMonthCalls: Math.round(busyMonth * 100) / 100,
    typicalBusyHourCalls: Math.round(busyHourAvg * 100) / 100,
    avgCallDurationSec,
    erlangs: erlangs !== null ? Math.round(erlangs * 1000) / 1000 : null,
    provisioningPositions: positions,
    cloudHourlyTier: cloudTier,
    estimatedAllotmentUsd: Math.round(estimateAllotment(positions, systemType) * 100) / 100,
    notes,
  };
}