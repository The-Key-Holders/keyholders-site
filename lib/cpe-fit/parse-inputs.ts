import { DEFAULT_INPUTS, VENDORS, type Inputs } from "./estimate";

function num(raw: unknown, fallback = 0): number {
  const s = String(raw ?? "")
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .trim();
  if (s === "") return fallback;
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

function str(raw: unknown): string {
  return raw == null ? "" : String(raw);
}

/** Parse estimate/compare POST bodies. Mirrors the FastAPI `_parse` checks (not the gate). */
export function parseEstimateInputs(body: Record<string, unknown>): { inp: Inputs; errors: string[] } {
  const errors: string[] = [];
  let vendor = str(body.vendor || "4");
  if (!(vendor in VENDORS)) {
    errors.push("Pick a vendor.");
    vendor = "4";
  }
  let pos = Math.trunc(num(body.positions, 5));
  if (!(pos >= 2 && pos <= 20)) {
    errors.push("Positions must be 2 to 20. Larger centers need a custom quote; use Other one-time.");
    pos = Math.min(Math.max(pos, 2), 20);
  }
  let yrs = Math.trunc(num(body.years, 5));
  if (!(yrs >= 1 && yrs <= 10)) {
    errors.push("Maintenance years must be 1 to 10.");
    yrs = Math.min(Math.max(yrs, 1), 10);
  }
  let disc = num(body.discount_pct, 0);
  if (!(disc >= 0 && disc <= 100)) {
    errors.push("Discount must be 0 to 100 percent.");
    disc = 0;
  }
  const allotRaw = str(body.allotment).trim();
  const loggerRaw = str(body.logger);
  const logger: Inputs["logger"] = loggerRaw === "64" || loggerRaw === "65" ? loggerRaw : "0";
  const apiRaw = str(body.api_tier);
  const api_tier: Inputs["api_tier"] =
    apiRaw === "1" || apiRaw === "2" || apiRaw === "3" ? apiRaw : "0";

  const inp: Inputs = {
    ...DEFAULT_INPUTS,
    vendor,
    positions: pos,
    years: yrs,
    discount_pct: disc,
    onprem_mode: str(body.onprem_mode) === "HR" ? "HR" : "SA",
    include_host: body.include_host === true || str(body.include_host) === "1",
    gis: body.gis === true || str(body.gis) === "1",
    logger,
    net_clock: body.net_clock === true || str(body.net_clock) === "1",
    displays: Math.max(0, Math.trunc(num(body.displays, 0))),
    ip_phones: Math.max(0, Math.trunc(num(body.ip_phones, 0))),
    api_tier,
    other_onetime: Math.max(0, num(body.other_onetime, 0)),
    contingency: Math.max(0, num(body.contingency, 0)),
    allotment: allotRaw ? num(allotRaw, NaN) : null,
    prior_used: Math.max(0, num(body.prior_used, 0)),
    psap_label: str(body.psap_label).slice(0, 120),
    letter_date: str(body.letter_date).slice(0, 20),
  };
  if (inp.allotment !== null && !Number.isFinite(inp.allotment)) {
    inp.allotment = null;
  }
  return { inp, errors };
}

export function parsePositionMonths(body: Record<string, unknown>): {
  calls: number[];
  abandoned: number[];
  error: string | null;
} {
  const keys = ["c1", "c2", "c3", "a1", "a2", "a3"] as const;
  const vals = keys.map((k) =>
    String(body[k] ?? "")
      .replace(/,/g, "")
      .trim()
  );
  if (vals.some((v) => v === "" || !Number.isFinite(Number(v)) || Number(v) < 0)) {
    return {
      calls: [],
      abandoned: [],
      error: "Enter all six numbers from the 911 report. Nothing is guessed for you.",
    };
  }
  return {
    calls: [Number(vals[0]), Number(vals[1]), Number(vals[2])],
    abandoned: [Number(vals[3]), Number(vals[4]), Number(vals[5])],
    error: null,
  };
}
