"use client";

import { CPE_FIT_BASE, type PositionsSuggestion } from "@/lib/cpe-fit/public-types";
import Link from "next/link";
import { FormEvent, useState } from "react";

const empty = { c1: "", c2: "", c3: "", a1: "", a2: "", a3: "" };

export default function PositionsHelper() {
  const [vals, setVals] = useState(empty);
  const [out, setOut] = useState<PositionsSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function setField(name: keyof typeof empty, value: string) {
    setVals((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/advisor-tools/cpe-fit/positions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals),
      });
      const data = (await res.json()) as { out: PositionsSuggestion | null; error: string | null };
      if (!res.ok) {
        setError(data.error || "Could not suggest positions.");
        setOut(null);
        return;
      }
      setError(data.error);
      setOut(data.out);
    } catch {
      setError("Network error");
      setOut(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1>Positions helper</h1>
      <p className="muted">
        Funding Level 5 style. From the PSAP&apos;s 911 report, pick the three highest months for Total M. Calls
        (911 column), then copy the 911 Abandoned count for those same three months. This only suggests a
        count. You confirm it.
      </p>
      {error ? <p className="err">{error}</p> : null}
      <form className="card" onSubmit={onSubmit}>
        <div className="grid3">
          {([1, 2, 3] as const).map((i) => (
            <div key={i}>
              <h3>Month {i}</h3>
              <label>
                Total M. Calls (911)
                <input
                  name={`c${i}`}
                  inputMode="numeric"
                  value={vals[`c${i}` as keyof typeof empty]}
                  onChange={(e) => setField(`c${i}` as keyof typeof empty, e.target.value)}
                  required
                />
              </label>
              <label>
                911 Abandoned
                <input
                  name={`a${i}`}
                  inputMode="numeric"
                  value={vals[`a${i}` as keyof typeof empty]}
                  onChange={(e) => setField(`a${i}` as keyof typeof empty, e.target.value)}
                  required
                />
              </label>
            </div>
          ))}
        </div>
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Calculating…" : "Suggest positions"}
        </button>
      </form>
      {out ? (
        <section className="card">
          <h2>Suggested: {out.positions} positions</h2>
          <p className="mono">
            ROUNDUP( {out.avg_calls.toLocaleString("en-US", { minimumFractionDigits: 2 })} / 1000 +{" "}
            {out.avg_abandoned.toLocaleString("en-US", { minimumFractionDigits: 2 })} / 2000 , 0 ) =
            ROUNDUP({out.raw.toFixed(4)}) = {out.positions}
          </p>
          {out.clamped !== out.positions ? (
            <p className="err">
              Contract pricing covers 2 to 20 positions. Using {out.clamped} for the estimate; get a vendor
              quote for the rest.
            </p>
          ) : null}
          <Link className="btn" href={`${CPE_FIT_BASE}/estimate?positions=${out.clamped}`}>
            Use {out.clamped} in an estimate
          </Link>
        </section>
      ) : null}
    </>
  );
}
