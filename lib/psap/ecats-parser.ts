import * as XLSX from "xlsx";
import type {
  AnswerTimeSummary,
  ClassOfServiceEntry,
  ECaTSMetadata,
  ECaTSParseResult,
  MonthlyCallStats,
  MonthlyHourlyBuckets,
} from "./types";

function cellStr(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function toInt(value: unknown): number {
  try {
    if (value === null || value === undefined || value === "") return 0;
    return Math.trunc(Number(value));
  } catch {
    return 0;
  }
}

function toFloat(value: unknown): number {
  try {
    if (value === null || value === undefined || value === "") return 0;
    return Math.round(Number(value) * 1e6) / 1e6;
  } catch {
    return 0;
  }
}

function sheetToRows(buffer: ArrayBuffer): unknown[][] {
  const wb = XLSX.read(buffer, { type: "array", cellDates: false });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }) as unknown[][];
}

function extractMetadata(rows: unknown[][]): ECaTSMetadata {
  const meta: ECaTSMetadata = {
    psapName: "",
    county: "",
    reportDateFrom: "",
    reportDateTo: "",
    callType: "911 Calls",
    avgCallDurationSec: 0,
  };
  const flat = rows.flat().map(cellStr).filter(Boolean);
  const text = flat.join(" ");

  for (let i = 0; i < Math.min(12, rows.length); i++) {
    const row = (rows[i] ?? []).map(cellStr);
    const joined = row.join(" ");
    if (!meta.psapName && (i === 1 || i === 2)) {
      const candidate = row[2] ?? "";
      if (candidate && !/report|calls/i.test(candidate) && !/\d{5}|@/.test(candidate)) {
        meta.psapName = candidate;
      }
    }
    const countyMatch = joined.match(/County:\s*([A-Za-z ]+)/);
    if (countyMatch) meta.county = countyMatch[1].trim();
    for (const v of row) {
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
        if (joined.includes("Report Date From:") && !meta.reportDateFrom) meta.reportDateFrom = v;
        if (joined.includes("Report Date To:") && !meta.reportDateTo) meta.reportDateTo = v;
      }
    }
    const ctIdx = row.findIndex((v) => v === "Call Type:");
    if (ctIdx >= 0 && row[ctIdx + 1]) meta.callType = row[ctIdx + 1];
  }

  if (!meta.psapName) {
    const m = text.match(
      /([A-Z][A-Za-z0-9 .'-]+(?:PD|Sheriff|County Sheriff|Communications)[A-Za-z0-9 .'-]*)/
    );
    if (m) meta.psapName = m[1].trim();
  }
  return meta;
}

function mapCallSummaryColumns(header: unknown[]): Record<string, number> {
  const cols: Record<string, number> = { label: 1 };
  header.forEach((raw, idx) => {
    const s = cellStr(raw).toLowerCase();
    if (!s) return;
    if (s === "date") cols.label = idx;
    if (s.includes("average call duration")) cols.avgDuration = idx;
    else if (s === "911" || s === "911.0" || (s.startsWith("911") && !s.includes("abdn") && !s.includes("total")))
      cols.answered ??= idx;
    else if (s.includes("911 abdn") && !s.includes("percentage")) cols.abandoned ??= idx;
    else if (s.includes("total 911")) cols.total ??= idx;
  });
  cols.answered ??= 3;
  cols.abandoned ??= 5;
  cols.total ??= 7;
  return cols;
}

export function parseCallSummary(buffer: ArrayBuffer, sourceName = "call_summary.xls"): ECaTSParseResult {
  const rows = sheetToRows(buffer);
  const result: ECaTSParseResult = {
    metadata: extractMetadata(rows),
    monthlyStats: [],
    monthlyHourly: [],
    hourlyTotals: [],
    sourceFiles: [sourceName],
    classOfService: [],
  };

  let headerRow = -1;
  for (let i = 0; i < rows.length; i++) {
    const row = (rows[i] ?? []).map(cellStr);
    if (row.some((v) => v.toLowerCase() === "date") && row.some((v) => v.includes("911"))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow < 0) return result;

  const cols = mapCallSummaryColumns(rows[headerRow] ?? []);
  const durations: number[] = [];

  for (let i = headerRow + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const label = cellStr(row[cols.label]);
    const lower = label.toLowerCase();
    if (!label || lower.includes("total") || lower.includes("average") || lower.includes("psap")) continue;
    if (!/\d{4}/.test(label)) continue;

    const answered = toInt(row[cols.answered]);
    const abandoned = toInt(row[cols.abandoned]);
    const total = toInt(row[cols.total]) || answered + abandoned;
    if (cols.avgDuration !== undefined) {
      const d = toFloat(row[cols.avgDuration]);
      if (d > 0) durations.push(d);
    }
    if (answered > 20000 || total > 25000) continue;
    if (answered || abandoned || total) {
      result.monthlyStats.push({ monthLabel: label, answered, abandoned, total });
    }
  }

  if (durations.length) {
    result.metadata.avgCallDurationSec =
      Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10;
  }
  return result;
}

export function parseCallsPerHour(buffer: ArrayBuffer): MonthlyHourlyBuckets[] {
  const rows = sheetToRows(buffer);
  const monthly: MonthlyHourlyBuckets[] = [];
  let headerRow = -1;

  for (let i = 0; i < rows.length; i++) {
    const row = (rows[i] ?? []).map(cellStr);
    if (row.length > 1 && row[1].toLowerCase() === "date") {
      headerRow = i;
      break;
    }
  }
  if (headerRow < 0) return monthly;

  for (let i = headerRow + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const label = cellStr(row[1]);
    if (!label) continue;
    const lower = label.toLowerCase();
    if (lower.includes("total") || lower.includes("abandoned")) continue;

    const buckets: number[] = [];
    for (let c = 2; c < row.length; c++) {
      const s = cellStr(row[c]);
      if (s.toLowerCase() === "total") break;
      if (/^\d+$/.test(s)) buckets.push(parseInt(s, 10));
      else if (typeof row[c] === "number") buckets.push(Math.trunc(row[c] as number));
      if (buckets.length >= 24) break;
    }
    if (buckets.length) monthly.push({ monthLabel: label, hourlyCounts: buckets });
  }
  return monthly;
}

function findHeaderRow(rows: unknown[][], markers: string[]): number {
  for (let i = 0; i < rows.length; i++) {
    const row = (rows[i] ?? []).map((v) => cellStr(v).toLowerCase());
    if (markers.every((m) => row.some((c) => c.includes(m)))) return i;
  }
  return -1;
}

function parseAnswerRingTime(buffer: ArrayBuffer): AnswerTimeSummary {
  const rows = sheetToRows(buffer);
  const headerRow = findHeaderRow(rows, ["total calls", "percent answered within 10"]);
  if (headerRow < 0) return { totalCalls: 0, pctWithin10Sec: 0, pctWithin15Sec: 0, pctWithin20Sec: 0, pctWithin40Sec: 0, pctWithin60Sec: 0, pctWithin120Sec: 0 };

  const header = (rows[headerRow] ?? []).map((v) => cellStr(v).toLowerCase());
  const colMap: Record<string, number> = {};
  header.forEach((label, idx) => {
    if (label === "total calls") colMap.totalCalls = idx;
    else if (label.includes("within 10")) colMap.pct10 = idx;
    else if (label.includes("within 15")) colMap.pct15 = idx;
    else if (label.includes("within 20")) colMap.pct20 = idx;
    else if (label.includes("within 40")) colMap.pct40 = idx;
    else if (label.includes("within 60")) colMap.pct60 = idx;
    else if (label.includes("within 120")) colMap.pct120 = idx;
  });

  for (let i = headerRow + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const cells = row.map(cellStr);
    if (!cells.some((c) => c.toLowerCase() === "total")) continue;
    return {
      totalCalls: toInt(row[colMap.totalCalls]),
      pctWithin10Sec: toFloat(row[colMap.pct10]),
      pctWithin15Sec: toFloat(row[colMap.pct15]),
      pctWithin20Sec: toFloat(row[colMap.pct20]),
      pctWithin40Sec: toFloat(row[colMap.pct40]),
      pctWithin60Sec: toFloat(row[colMap.pct60]),
      pctWithin120Sec: toFloat(row[colMap.pct120]),
    };
  }
  return { totalCalls: 0, pctWithin10Sec: 0, pctWithin15Sec: 0, pctWithin20Sec: 0, pctWithin40Sec: 0, pctWithin60Sec: 0, pctWithin120Sec: 0 };
}

export function parseClassOfService(buffer: ArrayBuffer): ClassOfServiceEntry[] {
  const rows = sheetToRows(buffer);
  const entries: ClassOfServiceEntry[] = [];
  let headerRow = -1;

  for (let i = 0; i < rows.length; i++) {
    const row = (rows[i] ?? []).map((v) => cellStr(v).toLowerCase());
    if (row.some((c) => c.includes("call count"))) {
      headerRow = i;
      break;
    }
  }
  if (headerRow < 0) return entries;

  for (let i = headerRow + 1; i < rows.length; i++) {
    const row = rows[i] ?? [];
    const serviceClass = cellStr(row[2]);
    if (!serviceClass || ["total", "class"].includes(serviceClass.toLowerCase())) continue;
    const callCount = toInt(row[6]);
    const percentage = toFloat(row[7]);
    if (callCount <= 0) continue;
    entries.push({ serviceClass, callCount, percentage });
  }
  return entries;
}

export function mergeEcatsResults(
  callSummary: ECaTSParseResult,
  options: {
    callsPerHour?: ArrayBuffer;
    answerTime?: ArrayBuffer;
    ringTime?: ArrayBuffer;
    classOfService?: ArrayBuffer;
  } = {}
): ECaTSParseResult {
  if (options.callsPerHour) {
    const monthlyHourly = parseCallsPerHour(options.callsPerHour);
    callSummary.monthlyHourly = monthlyHourly;
    callSummary.hourlyTotals = monthlyHourly.flatMap((m) => m.hourlyCounts);
    callSummary.sourceFiles.push("calls_per_hour.xls");
  }
  if (options.answerTime) {
    callSummary.answerTime = parseAnswerRingTime(options.answerTime);
    callSummary.sourceFiles.push("answer_time.xls");
  }
  if (options.ringTime) {
    callSummary.ringTime = parseAnswerRingTime(options.ringTime);
    callSummary.sourceFiles.push("ring_time.xls");
  }
  if (options.classOfService) {
    callSummary.classOfService = parseClassOfService(options.classOfService);
    callSummary.sourceFiles.push("class_of_service.xls");
  }
  return callSummary;
}