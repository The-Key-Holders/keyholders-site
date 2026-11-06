"use client";

import {
  CPE_FIT_BASE,
  DEFAULT_CPE_FIT_INPUTS,
  type CpeFitInputs,
  type CpeFitResult,
  type VendorMap,
} from "@/lib/cpe-fit/public-types";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { money, statusClass } from "../lib/money";

const STORAGE_KEY = "cpefit:last";

type View = "form" | "results" | "compare";

function payloadFromInputs(inp: CpeFitInputs): Record<string, unknown> {
  return {
    ...inp,
    allotment: inp.allotment == null ? "" : String(inp.allotment),
    include_host: inp.include_host ? "1" : "",
    gis: inp.gis ? "1" : "",
    net_clock: inp.net_clock ? "1" : "",
  };
}

function readStoredForm(initialPositions?: number): CpeFitInputs {
  const base: CpeFitInputs = {
    ...DEFAULT_CPE_FIT_INPUTS,
    positions: initialPositions ?? DEFAULT_CPE_FIT_INPUTS.positions,
  };
  if (typeof window === "undefined") return base;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const s = JSON.parse(raw) as Record<string, string>;
    return {
      ...base,
      psap_label: s.psap_label ?? base.psap_label,
      letter_date: s.letter_date ?? base.letter_date,
      allotment: s.allotment ? Number(String(s.allotment).replace(/[$,]/g, "")) : null,
      prior_used: s.prior_used ? Number(String(s.prior_used).replace(/[$,]/g, "")) : 0,
      vendor: s.vendor || base.vendor,
      positions: initialPositions ?? (s.positions ? Number(s.positions) : base.positions),
      years: s.years ? Number(s.years) : base.years,
      discount_pct: s.discount_pct ? Number(s.discount_pct) : 0,
      onprem_mode: s.onprem_mode === "HR" ? "HR" : "SA",
      include_host: s.include_host === "1",
      gis: s.gis === "1",
      logger: s.logger === "64" || s.logger === "65" ? s.logger : "0",
      net_clock: s.net_clock === "1",
      displays: s.displays ? Number(s.displays) : 0,
      ip_phones: s.ip_phones ? Number(s.ip_phones) : 0,
      api_tier: s.api_tier === "1" || s.api_tier === "2" || s.api_tier === "3" ? s.api_tier : "0",
      other_onetime: s.other_onetime ? Number(s.other_onetime) : 0,
      contingency: s.contingency ? Number(s.contingency) : 0,
    };
  } catch {
    return base;
  }
}

function persistForm(inp: CpeFitInputs) {
  const o: Record<string, string> = {
    psap_label: inp.psap_label,
    letter_date: inp.letter_date,
    allotment: inp.allotment == null ? "" : String(inp.allotment),
    prior_used: String(inp.prior_used),
    vendor: inp.vendor,
    positions: String(inp.positions),
    years: String(inp.years),
    discount_pct: String(inp.discount_pct),
    onprem_mode: inp.onprem_mode,
    include_host: inp.include_host ? "1" : "",
    gis: inp.gis ? "1" : "",
    logger: inp.logger,
    net_clock: inp.net_clock ? "1" : "",
    displays: String(inp.displays),
    ip_phones: String(inp.ip_phones),
    api_tier: inp.api_tier,
    other_onetime: String(inp.other_onetime),
    contingency: String(inp.contingency),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(o));
}

function pillFor(status: string): "good" | "bad" | "warn" {
  if (status === "FITS ALLOTMENT") return "good";
  if (status === "OVER ALLOTMENT" || status === "PRICE MISSING") return "bad";
  return "warn";
}

function fitLabel(status: string): string {
  if (status === "FITS ALLOTMENT") return "FITS";
  if (status === "OVER ALLOTMENT") return "OVER";
  return status;
}

export default function EstimateApp({
  vendors,
  positionChoices,
  initialPositions,
}: {
  vendors: VendorMap;
  positionChoices: number[];
  initialPositions?: number;
}) {
  const [inp, setInp] = useState<CpeFitInputs>({
    ...DEFAULT_CPE_FIT_INPUTS,
    positions: initialPositions ?? DEFAULT_CPE_FIT_INPUTS.positions,
  });
  const [allotmentText, setAllotmentText] = useState("");
  const [view, setView] = useState<View>("form");
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<CpeFitResult | null>(null);
  const [rows, setRows] = useState<CpeFitResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const stored = readStoredForm(initialPositions);
    setInp(stored);
    setAllotmentText(stored.allotment == null ? "" : String(stored.allotment));
  }, [initialPositions]);

  const kind = vendors[inp.vendor]?.[2] ?? "cloud";
  const isCloud = kind === "cloud";
  const showHost = !isCloud && inp.onprem_mode === "HR";

  const currentInputs = useMemo((): CpeFitInputs => {
    const trimmed = allotmentText.replace(/[$,]/g, "").trim();
    return {
      ...inp,
      allotment: trimmed === "" ? null : Number(trimmed),
    };
  }, [inp, allotmentText]);

  async function postJson<T>(url: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as T & { error?: string };
    if (!res.ok) {
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
  }

  async function runEstimate(nextVendor?: string) {
    setBusy(true);
    setLoadError("");
    const body = payloadFromInputs({
      ...currentInputs,
      vendor: nextVendor ?? currentInputs.vendor,
    });
    persistForm({ ...currentInputs, vendor: nextVendor ?? currentInputs.vendor });
    try {
      const data = await postJson<{ result: CpeFitResult; inputs: CpeFitInputs; errors: string[] }>(
        "/api/advisor-tools/cpe-fit/estimate",
        body
      );
      setErrors(data.errors || []);
      setResult(data.result);
      if (data.inputs) {
        setInp(data.inputs);
        setAllotmentText(data.inputs.allotment == null ? "" : String(data.inputs.allotment));
      }
      setView("results");
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Estimate failed");
    } finally {
      setBusy(false);
    }
  }

  async function runCompare() {
    setBusy(true);
    setLoadError("");
    const body = payloadFromInputs(currentInputs);
    persistForm(currentInputs);
    try {
      const data = await postJson<{ rows: CpeFitResult[]; inputs: CpeFitInputs; errors: string[] }>(
        "/api/advisor-tools/cpe-fit/compare",
        body
      );
      setErrors(data.errors || []);
      setRows(data.rows || []);
      if (data.inputs) {
        setInp(data.inputs);
        setAllotmentText(data.inputs.allotment == null ? "" : String(data.inputs.allotment));
      }
      setView("compare");
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Compare failed");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void runEstimate();
  }

  if (view === "results" && result) {
    return (
      <ResultsView
        inp={currentInputs}
        res={result}
        errors={errors}
        loadError={loadError}
        busy={busy}
        onCompare={() => void runCompare()}
        onEdit={() => setView("form")}
      />
    );
  }

  if (view === "compare") {
    return (
      <CompareView
        inp={currentInputs}
        rows={rows}
        errors={errors}
        loadError={loadError}
        busy={busy}
        onDetails={(vendor) => void runEstimate(vendor)}
        onEdit={() => setView("form")}
      />
    );
  }

  return (
    <>
      <h1>New estimate</h1>
      <p className="muted">
        Four short steps. Hints sit next to each field. Your last entries stay in this browser tab only.
      </p>
      {loadError ? <p className="err">{loadError}</p> : null}
      {errors.map((e) => (
        <p key={e} className="err">
          {e}
        </p>
      ))}
      <form id="est" className="wizard" onSubmit={onSubmit}>
        <fieldset className="card">
          <legend>
            <span className="step">1</span> The PSAP and its letter
          </legend>
          <label>
            PSAP name or ID <small>Optional label for your printout.</small>
            <input
              name="psap_label"
              maxLength={120}
              value={inp.psap_label}
              onChange={(e) => setInp((p) => ({ ...p, psap_label: e.target.value }))}
            />
          </label>
          <label>
            Letter date <small>Date on the signed allotment letter.</small>
            <input
              type="date"
              name="letter_date"
              value={inp.letter_date}
              onChange={(e) => setInp((p) => ({ ...p, letter_date: e.target.value }))}
            />
          </label>
          <label>
            Allotment $ <small>From the signed letter only. Leave blank if there&apos;s no letter yet.</small>
            <input
              name="allotment"
              inputMode="decimal"
              placeholder="e.g. 600000"
              value={allotmentText}
              onChange={(e) => setAllotmentText(e.target.value)}
            />
          </label>
          <label>
            Prior residual used $ <small>Anything already spent from this allotment.</small>
            <input
              name="prior_used"
              inputMode="decimal"
              value={inp.prior_used}
              onChange={(e) => setInp((p) => ({ ...p, prior_used: Number(e.target.value) || 0 }))}
            />
          </label>
        </fieldset>

        <fieldset className="card">
          <legend>
            <span className="step">2</span> The system
          </legend>
          <label>
            Vendor and contract <small>Cloud contracts include connectivity. On-Prem contracts unlock layout options.</small>
            <select
              name="vendor"
              id="vendor"
              value={inp.vendor}
              onChange={(e) => setInp((p) => ({ ...p, vendor: e.target.value }))}
            >
              {Object.entries(vendors).map(([k, v]) => (
                <option key={k} value={k} data-kind={v[2]}>
                  {k} · {v[0]} ({v[1]})
                </option>
              ))}
            </select>
          </label>
          <label>
            Positions <small>Call-taking seats, 2 to 20. Use the positions helper if unsure.</small>
            <select
              name="positions"
              value={inp.positions}
              onChange={(e) => setInp((p) => ({ ...p, positions: Number(e.target.value) }))}
            >
              {positionChoices.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label>
            Maintenance years <small>Default 5, matching the contract term.</small>
            <input
              type="number"
              name="years"
              min={1}
              max={10}
              value={inp.years}
              onChange={(e) => setInp((p) => ({ ...p, years: Number(e.target.value) || 5 }))}
            />
          </label>
          <label>
            Maintenance discount % <small>Applies to system maintenance only, never add-ons. 10 means 10%.</small>
            <input
              name="discount_pct"
              inputMode="decimal"
              value={inp.discount_pct}
              onChange={(e) => setInp((p) => ({ ...p, discount_pct: Number(e.target.value) || 0 }))}
            />
          </label>
          <div id="onprem" className="sub" hidden={isCloud}>
            <label>
              On-Prem layout <small>Host Remote uses 22.7 pricing.</small>
              <select
                name="onprem_mode"
                value={inp.onprem_mode}
                disabled={isCloud}
                onChange={(e) =>
                  setInp((p) => ({ ...p, onprem_mode: e.target.value === "HR" ? "HR" : "SA" }))
                }
              >
                <option value="SA">Basic Stand Alone</option>
                <option value="HR">Host Remote</option>
              </select>
            </label>
            <label className="check" id="hostwrap" hidden={!showHost}>
              <input
                type="checkbox"
                name="include_host"
                value="1"
                checked={inp.include_host}
                disabled={!showHost}
                onChange={(e) => setInp((p) => ({ ...p, include_host: e.target.checked }))}
              />{" "}
              Include Side A+B host backroom <small>Only if this PSAP pays for the host site.</small>
            </label>
          </div>
        </fieldset>

        <fieldset className="card">
          <legend>
            <span className="step">3</span> Add-ons
          </legend>
          <p className="muted">
            Priced from each vendor&apos;s own sheet. If a vendor doesn&apos;t offer one, you&apos;ll see it flagged, not
            filled in.
          </p>
          <label className="check">
            <input
              type="checkbox"
              name="gis"
              value="1"
              checked={inp.gis}
              onChange={(e) => setInp((p) => ({ ...p, gis: e.target.checked }))}
            />{" "}
            GIS mapping <small>One per position.</small>
          </label>
          <label>
            Logging recorder
            <select
              name="logger"
              value={inp.logger}
              onChange={(e) =>
                setInp((p) => ({
                  ...p,
                  logger: e.target.value === "64" || e.target.value === "65" ? e.target.value : "0",
                }))
              }
            >
              <option value="0">None</option>
              <option value="64">Up to 64 channels</option>
              <option value="65">65+ channels</option>
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              name="net_clock"
              value="1"
              checked={inp.net_clock}
              onChange={(e) => setInp((p) => ({ ...p, net_clock: e.target.checked }))}
            />{" "}
            Network clock
          </label>
          <label>
            Status displays
            <input
              type="number"
              name="displays"
              min={0}
              max={200}
              value={inp.displays}
              onChange={(e) => setInp((p) => ({ ...p, displays: Number(e.target.value) || 0 }))}
            />
          </label>
          <label>
            IP admin phones
            <input
              type="number"
              name="ip_phones"
              min={0}
              max={500}
              value={inp.ip_phones}
              onChange={(e) => setInp((p) => ({ ...p, ip_phones: Number(e.target.value) || 0 }))}
            />
          </label>
          <label>
            API integration
            <select
              name="api_tier"
              value={inp.api_tier}
              onChange={(e) =>
                setInp((p) => ({
                  ...p,
                  api_tier:
                    e.target.value === "1" || e.target.value === "2" || e.target.value === "3"
                      ? e.target.value
                      : "0",
                }))
              }
            >
              <option value="0">None</option>
              <option value="1">Tier 1</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
            </select>
          </label>
        </fieldset>

        <fieldset className="card">
          <legend>
            <span className="step">4</span> Anything else
          </legend>
          <label>
            Other one-time quote $ <small>Vendor quotes for items not in Exhibit C.</small>
            <input
              name="other_onetime"
              inputMode="decimal"
              value={inp.other_onetime}
              onChange={(e) => setInp((p) => ({ ...p, other_onetime: Number(e.target.value) || 0 }))}
            />
          </label>
          <label>
            Contingency $ <small>A cushion you choose. Not a contract price.</small>
            <input
              name="contingency"
              inputMode="decimal"
              value={inp.contingency}
              onChange={(e) => setInp((p) => ({ ...p, contingency: Number(e.target.value) || 0 }))}
            />
          </label>
        </fieldset>

        <div className="actions">
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Calculating…" : "See the estimate"}
          </button>
          <button className="btn ghost" type="button" disabled={busy} onClick={() => void runCompare()}>
            Compare all 12 vendors
          </button>
        </div>
      </form>
    </>
  );
}

function ResultsView({
  inp,
  res,
  errors,
  loadError,
  busy,
  onCompare,
  onEdit,
}: {
  inp: CpeFitInputs;
  res: CpeFitResult;
  errors: string[];
  loadError: string;
  busy: boolean;
  onCompare: () => void;
  onEdit: () => void;
}) {
  const layout =
    res.kind === "onprem" ? (inp.onprem_mode === "HR" ? "Host Remote" : "Basic Stand Alone") : null;
  return (
    <>
      <div className="watermark" aria-hidden="true">
        DRAFT / INTERNAL
      </div>
      {loadError ? <p className="err">{loadError}</p> : null}
      {errors.map((e) => (
        <p key={e} className="err">
          {e}
        </p>
      ))}
      <section className="summary card">
        <div>
          <p className="eyebrow">
            {inp.psap_label || "Unnamed PSAP"}
            {inp.letter_date ? ` · letter ${inp.letter_date}` : ""}
          </p>
          <h1>{res.vendor_label}</h1>
          <p className="muted">
            {res.contract} · {inp.positions} positions · {inp.years} yr
            {layout ? ` · ${layout}` : ""}
          </p>
        </div>
        <div className="kpis">
          <div>
            <span>True cost</span>
            <b>${money(res.true_cost)}</b>
          </div>
          {res.net_allotment != null ? (
            <>
              <div>
                <span>Net allotment</span>
                <b>${money(res.net_allotment)}</b>
              </div>
              <div className={(res.over_under ?? 0) > 0 ? "bad" : "good"}>
                <span>{(res.over_under ?? 0) > 0 ? "Over by" : "Under by"}</span>
                <b>${money(Math.abs(res.over_under ?? 0))}</b>
              </div>
              <div>
                <span>Allotment used</span>
                <b>{res.pct_used != null ? `${res.pct_used.toFixed(1)}%` : "n/a"}</b>
              </div>
            </>
          ) : (
            <div className="warn">
              <span>Allotment</span>
              <b>ALLOTMENT NOT ENTERED</b>
            </div>
          )}
        </div>
        <p className={`status ${statusClass(res.status)}`}>{res.status}</p>
        {res.net_allotment != null ? (
          <progress className="meter" max={100} value={Math.min(res.pct_used || 0, 100)} />
        ) : null}
      </section>
      {res.flags.length > 0 ? (
        <section className="card flags">
          <h2>Heads up</h2>
          <ul>
            {res.flags.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <section className="card">
        <h2>Itemized</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th className="num">Amount</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {res.lines.map((l) => (
              <tr key={l.key}>
                <td>
                  {l.label}
                  {l.note ? <small className="muted"> {l.note}</small> : null}
                </td>
                <td className="num">${money(l.amount)}</td>
                <td className="cite">{l.cite}</td>
              </tr>
            ))}
            <tr className="total">
              <td>True cost</td>
              <td className="num">${money(res.true_cost)}</td>
              <td />
            </tr>
            {res.residual != null ? (
              <tr>
                <td>Residual remaining after purchase</td>
                <td className="num">${money(res.residual)}</td>
                <td />
              </tr>
            ) : null}
          </tbody>
        </table>
        <p className="muted small">
          Prices are Exhibit C contract maximums and are not a quote. Excess over allotment is the PSAP&apos;s
          responsibility. Language interpretation and CAD interfaces are excluded.
        </p>
      </section>
      <div className="actions noprint">
        <button className="btn" type="button" disabled={busy} onClick={onCompare}>
          Compare all 12 vendors
        </button>
        <button className="btn ghost" type="button" onClick={() => window.print()}>
          Print internal one-pager
        </button>
        <button className="btn ghost" type="button" onClick={onEdit}>
          Edit inputs
        </button>
      </div>
    </>
  );
}

function CompareView({
  inp,
  rows,
  errors,
  loadError,
  busy,
  onDetails,
  onEdit,
}: {
  inp: CpeFitInputs;
  rows: CpeFitResult[];
  errors: string[];
  loadError: string;
  busy: boolean;
  onDetails: (vendor: string) => void;
  onEdit: () => void;
}) {
  return (
    <>
      <div className="watermark" aria-hidden="true">
        DRAFT / INTERNAL
      </div>
      <h1>All 12 contracts, same inputs</h1>
      <p className="muted">
        {inp.psap_label || "Unnamed PSAP"} · {inp.positions} positions · {inp.years} yr · On-Prem as{" "}
        {inp.onprem_mode === "HR" ? "Host Remote" : "Basic Stand Alone"}. Sorted lowest cost first. Listing
        order is not a recommendation.
      </p>
      {loadError ? <p className="err">{loadError}</p> : null}
      {errors.map((e) => (
        <p key={e} className="err">
          {e}
        </p>
      ))}
      <section className="card">
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Type</th>
              <th className="num">True cost</th>
              <th className="num">Over / under</th>
              <th>Fit</th>
              <th>Gaps</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.vendor}>
                <td>
                  {r.vendor_label}
                  <br />
                  <small className="muted">{r.contract}</small>
                </td>
                <td>{r.kind === "cloud" ? "Cloud" : "On-Prem"}</td>
                <td className="num">${money(r.true_cost)}</td>
                <td className="num">
                  {r.over_under != null
                    ? `${r.over_under > 0 ? "+" : "-"}$${money(Math.abs(r.over_under))}`
                    : "n/a"}
                </td>
                <td>
                  <span className={`pill ${pillFor(r.status)}`}>{fitLabel(r.status)}</span>
                </td>
                <td className="small">{r.flags.join("; ")}</td>
                <td>
                  <button className="link" type="button" disabled={busy} onClick={() => onDetails(r.vendor)}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="actions noprint">
        <button className="btn ghost" type="button" onClick={() => window.print()}>
          Print
        </button>
        <button className="btn ghost" type="button" onClick={onEdit}>
          Edit inputs
        </button>
        <Link className="btn ghost" href={`${CPE_FIT_BASE}/estimate`}>
          New estimate
        </Link>
      </div>
    </>
  );
}
