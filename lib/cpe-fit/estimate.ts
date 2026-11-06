/** CPE Fit estimate engine — faithful TypeScript port of app/calc.py.
 * No Next.js/React/DOM. Server-side only: never ship the catalog to the client. */
import "server-only";
import { readFileSync } from "node:fs";
import catalogJson from "./catalog.json";

export type Row = [number, number, number, string];
export type Addon = [number, number, number, number | string, string, string];
export interface VendorCatalog {
  SA: Record<string, Row>; HR?: Record<string, Row>; conn?: Record<string, Row>;
  HOST?: Row; addons: Record<string, Addon>; [k: string]: unknown;
}
export type Catalog = Record<string, VendorCatalog>;

export const VENDORS: Record<string, [string, string, "cloud" | "onprem"]> = {
  "1": ["Comtech - Guardian On-Premise", "A261018514", "onprem"],
  "2": ["CentralSquare - Vertex On-Premise", "A261018515", "onprem"],
  "3": ["CentralSquare - Vertex Cloud", "A261016743", "cloud"],
  "4": ["Special Order Systems - Carbyne/Axon Cloud", "A261018547", "cloud"],
  "5": ["AT&T - Viper On-Premise", "A261018523", "onprem"],
  "6": ["AT&T - Viper Cloud", "A261018524", "cloud"],
  "7": ["AT&T - Vesta On-Premise", "A261018525", "onprem"],
  "8": ["AT&T - Vesta NXT Cloud", "A261018526", "cloud"],
  "9": ["Intrado - Viper On-Premise", "A261018538", "onprem"],
  "10": ["Intrado - Viper Cloud", "A261018539", "cloud"],
  "11": ["Motorola - Motorola-Vesta", "A261018549", "onprem"],
  "12": ["Motorola - Motorola-Vesta NXT", "A261018548", "cloud"],
};
export const ADDON_NAMES: Record<string, string> = {
  GIS: "GIS mapping", LOG64: "Logging recorder (up to 64 channels)",
  LOG65: "Logging recorder (65+ channels)", NET: "Network clock",
  DISP: "Status displays", IPPH: "IP admin phones",
  API1: "API integration tier 1", API2: "API integration tier 2", API3: "API integration tier 3",
};
export const POSITIONS: number[] = Array.from({ length: 19 }, (_, i) => i + 2);

const BUNDLED_CATALOG = catalogJson as unknown as Catalog;

/** Load the server-side catalog. Prefer the bundled JSON import; optional path for tests. */
export function load_catalog(path?: string | URL): Catalog {
  if (path) {
    return JSON.parse(readFileSync(path, "utf8")) as Catalog;
  }
  return BUNDLED_CATALOG;
}
export const loadCatalog = load_catalog;

export interface Inputs {
  vendor: string; positions: number; years: number; discount_pct: number;
  onprem_mode: "SA" | "HR"; include_host: boolean; gis: boolean;
  logger: "0" | "64" | "65"; net_clock: boolean; displays: number; ip_phones: number;
  api_tier: "0" | "1" | "2" | "3"; other_onetime: number; contingency: number;
  allotment: number | null; prior_used: number; psap_label: string; letter_date: string;
}
export const DEFAULT_INPUTS: Inputs = {
  vendor: "4", positions: 5, years: 5, discount_pct: 0, onprem_mode: "SA", include_host: false,
  gis: false, logger: "0", net_clock: false, displays: 0, ip_phones: 0, api_tier: "0",
  other_onetime: 0, contingency: 0, allotment: null, prior_used: 0, psap_label: "", letter_date: "",
};
export function makeInputs(p: Partial<Inputs> = {}): Inputs { return { ...DEFAULT_INPUTS, ...p }; }

export interface Line { key: string; label: string; amount: number; cite: string; note: string }
export interface Result {
  vendor: string; vendor_label: string; contract: string; kind: string;
  lines: Line[]; flags: string[]; price_missing: boolean; true_cost: number;
  net_allotment: number | null; over_under: number | null; pct_used: number | null;
  residual: number | null; status: string;
}

/** Round to 2 cents exactly like Python round(x, 2): nearest on the exact binary value, ties to even. */
export function _r(x: number): number {
  x = x + 0;
  const exact = Math.abs(x).toFixed(100); // exact decimal expansion of the double
  const dot = exact.indexOf(".");
  const tail = exact.slice(dot + 3);
  let v = Number(x.toFixed(2)); // nearest; on exact tie picks away-from-zero
  if (/^50*$/.test(tail)) { // exact tie -> half-even
    const lastDigit = Number(exact[dot + 2]);
    const trunc = Number((x < 0 ? "-" : "") + exact.slice(0, dot + 3));
    v = lastDigit % 2 === 0 ? trunc : v;
  }
  return v === 0 ? 0 : v;
}

/** Python 3.12+ sum() of floats uses Neumaier compensated summation; mirror it for cent-exact parity. */
export function pysum(xs: number[]): number {
  let s = 0, c = 0;
  for (const x of xs) { const t = s + x; c += Math.abs(s) >= Math.abs(x) ? (s - t) + x : (x - t) + s; s = t; }
  return s + c;
}
const money = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const g = (n: number) => String(Number(n.toPrecision(6))); // ~ Python :g
const L = (key: string, label: string, amount: number, cite = "", note = ""): Line => ({ key, label, amount, cite, note });

export function estimate(partial: Partial<Inputs>, cat: Catalog): Result {
  const inp = makeInputs(partial);
  const v = cat[inp.vendor];
  const [name, contract, kind] = VENDORS[inp.vendor];
  const res: Result = { vendor: inp.vendor, vendor_label: name, contract, kind, lines: [], flags: [],
    price_missing: false, true_cost: 0, net_allotment: null, over_under: null, pct_used: null, residual: null, status: "" };
  const yrs = inp.years, months = inp.years * 12;
  const disc = 1 - (inp.discount_pct || 0) / 100;
  const p = String(inp.positions);
  let row: Row | undefined, mode_label: string;
  if (kind === "cloud") { row = v.SA[p]; mode_label = "Cloud system (22.1)"; }
  else if (inp.onprem_mode === "HR") { row = v.HR?.[p]; mode_label = "On-Prem Host Remote (22.7)"; }
  else { row = v.SA[p]; mode_label = "On-Prem Basic Stand Alone"; }
  if (!row || row[0] + row[1] + row[2] === 0) {
    res.price_missing = true;
    res.flags.push(`PRICE MISSING for ${name} at ${p} positions (${mode_label})`);
    row = [0, 0, 0, ""];
  }
  const [e, i, m, cite] = row;
  res.lines.push(
    L("equip", `Equipment, ${mode_label}`, _r(e), cite),
    L("impl", "Implementation", _r(i), cite),
    L("maint", `Maintenance (${yrs} yr` + (inp.discount_pct ? `, ${g(inp.discount_pct)}% discount` : "") + ")",
      _r(m * months * disc), cite, `$${money(m)}/mo`),
  );
  if (kind === "cloud") {
    const c = v.conn?.[p];
    if (c) res.lines.push(L("conn", `Connectivity (${yrs} yr)`, _r(c[0] / 5 * yrs), c[3]));
    else { res.flags.push("Connectivity price not found; shown as $0"); res.lines.push(L("conn", "Connectivity", 0)); }
  } else if (inp.onprem_mode === "HR" && inp.include_host) {
    const h = v.HOST;
    if (h) {
      res.lines.push(L("host1", "Host backroom Side A+B, one-time", _r(h[0] + h[1]), h[3]));
      res.lines.push(L("host2", `Host backroom maintenance (${yrs} yr)`, _r(h[2] * months * disc), h[3]));
    } else res.flags.push("Host backroom price not found");
  }
  const qty: Record<string, number> = {
    GIS: inp.gis ? inp.positions : 0, LOG64: inp.logger === "64" ? 1 : 0, LOG65: inp.logger === "65" ? 1 : 0,
    NET: inp.net_clock ? 1 : 0, DISP: Math.max(0, inp.displays), IPPH: Math.max(0, inp.ip_phones),
  };
  for (const t of ["1", "2", "3"]) qty["API" + t] = inp.api_tier === t ? 1 : 0;
  for (const [code, q] of Object.entries(qty)) {
    if (!q) continue;
    const a = v.addons[code];
    const label = `${ADDON_NAMES[code]} x${q}`;
    if (!a || a[4] === "N") {
      res.flags.push(`${code} NOT OFFERED BY VENDOR`);
      res.lines.push(L("addon_" + code, label, 0, a ? a[5] : "", "Not offered by vendor"));
      continue;
    }
    res.lines.push(L("addon_" + code, label, _r((a[0] + a[1] + a[2] * months) * q), a[5],
      a[4] === "Mandatory" ? "Mandatory offering" : ""));
  }
  if (inp.other_onetime) res.lines.push(L("other", "Other one-time quote", _r(inp.other_onetime)));
  if (inp.contingency) res.lines.push(L("cont", "Contingency", _r(inp.contingency)));
  res.true_cost = _r(pysum(res.lines.map((l) => l.amount)));
  if (inp.allotment === null || inp.allotment === undefined) res.status = "ALLOTMENT NOT ENTERED";
  else {
    res.net_allotment = _r(inp.allotment - (inp.prior_used || 0));
    res.over_under = _r(res.true_cost - res.net_allotment);
    res.residual = _r(-res.over_under);
    res.pct_used = res.net_allotment > 0 ? (res.true_cost / res.net_allotment) * 100 : null;
    res.status = res.over_under > 0 ? "OVER ALLOTMENT" : "FITS ALLOTMENT";
  }
  if (res.price_missing) res.status = "PRICE MISSING";
  return res;
}

export function compare_all(inp: Partial<Inputs>, cat: Catalog): Result[] {
  const out = Object.keys(VENDORS).map((vid) => estimate({ ...inp, vendor: vid }, cat));
  return out.sort((a, b) => (Number(a.price_missing) - Number(b.price_missing)) || (a.true_cost - b.true_cost));
}
export const compareAll = compare_all;

export function suggest_positions(top3_calls: number[], top3_abandoned: number[]) {
  if (top3_calls.length !== 3 || top3_abandoned.length !== 3) throw new Error("Enter exactly three months");
  const ac = top3_calls.reduce((s, x) => s + x, 0) / 3, aa = top3_abandoned.reduce((s, x) => s + x, 0) / 3;
  const raw = ac / 1000 + aa / 2000;
  const pos = Math.ceil(Number(raw.toFixed(9)));
  return { avg_calls: ac, avg_abandoned: aa, raw, positions: pos, clamped: Math.min(Math.max(pos, 2), 20) };
}
export const suggestPositions = suggest_positions;
