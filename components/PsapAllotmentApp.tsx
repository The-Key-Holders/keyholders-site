"use client";

import { useState } from "react";
import type { AllotmentResponse } from "@/lib/psap/types";

const FILE_FIELDS = [
  { key: "callSummary", label: "Call Summary (.xls)", required: true },
  { key: "callsPerHour", label: "Calls Per Hour (.xls)", required: false },
  { key: "answerTime", label: "Answer Time (.xls)", required: false },
  { key: "ringTime", label: "Ring Time (.xls)", required: false },
  { key: "classOfService", label: "Class of Service (.xls)", required: false },
] as const;

export default function PsapAllotmentApp() {
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [psapName, setPsapName] = useState("");
  const [county, setCounty] = useState("");
  const [systemType, setSystemType] = useState<"on_premise" | "cloud">("on_premise");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AllotmentResponse | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!files.callSummary) {
      setError("Call Summary is required.");
      return;
    }

    const form = new FormData();
    for (const { key } of FILE_FIELDS) {
      const file = files[key];
      if (file) form.append(key, file);
    }
    form.append("psapName", psapName);
    form.append("county", county);
    form.append("systemType", systemType);

    setLoading(true);
    try {
      const res = await fetch("/api/psap-allotment", { method: "POST", body: form });
      const data = (await res.json()) as AllotmentResponse;
      if (!res.ok || data.status === "error") {
        setError(data.error ?? "Calculation failed.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-cyanGlow/80">Cal OES ITA Tool</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">PSAP Allotment Engine</h1>
        <p className="mt-3 max-w-2xl text-white/65">
          Upload ECaTS exports to calculate Chapter III funding level, provisioning positions, and estimated fixed
          allotment. Advisor review required before official use.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="grid gap-4 sm:grid-cols-2">
          {FILE_FIELDS.map(({ key, label, required }) => (
            <label key={key} className="block text-sm text-white/80">
              {label}
              {required && <span className="text-gold"> *</span>}
              <input
                type="file"
                accept=".xls,.xlsx"
                className="mt-2 w-full rounded-lg border border-white/15 bg-vault-950/60 px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-cyanGlow/20 file:px-3 file:py-1 file:text-cyanGlow"
                onChange={(e) => setFiles((prev) => ({ ...prev, [key]: e.target.files?.[0] ?? null }))}
              />
            </label>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm text-white/80">
            PSAP Name
            <input
              value={psapName}
              onChange={(e) => setPsapName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-vault-950/60 px-3 py-2 text-white"
              placeholder="Placer County Sheriff"
            />
          </label>
          <label className="block text-sm text-white/80">
            County
            <input
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-vault-950/60 px-3 py-2 text-white"
              placeholder="Placer"
            />
          </label>
          <label className="block text-sm text-white/80">
            System Type
            <select
              value={systemType}
              onChange={(e) => setSystemType(e.target.value as "on_premise" | "cloud")}
              className="mt-2 w-full rounded-lg border border-white/15 bg-vault-950/60 px-3 py-2 text-white"
            >
              <option value="on_premise">On-Premise</option>
              <option value="cloud">Cloud</option>
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-cyanGlow px-6 py-3 text-sm font-semibold text-vault-950 transition hover:bg-cyanGlow/90 disabled:opacity-50"
        >
          {loading ? "Calculating…" : "Run Allotment"}
        </button>

        {error && <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
      </form>

      {result && result.status === "ok" && (
        <div className="mt-8 space-y-4 rounded-2xl border border-gold/25 bg-gold/5 p-6">
          <h2 className="font-display text-xl font-bold text-gold">Results — {result.psap}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Funding Level", result.fundingLevel],
              ["Positions", result.positions],
              ["Allotment", `$${result.estimatedAllotmentUsd.toLocaleString()}`],
              ["Avg Duration", `${result.avgCallDurationSec}s`],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-white/10 bg-vault-950/50 p-4">
                <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-vault-950/80 p-4 text-xs text-cyanGlow/90">
            {result.markdown}
          </pre>
        </div>
      )}
    </div>
  );
}