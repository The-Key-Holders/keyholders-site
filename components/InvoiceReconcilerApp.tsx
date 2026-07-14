"use client";

import { useMemo, useState } from "react";
import { runInvoiceReconcile } from "@/lib/invoice-recon/engine";
import type { LineResult, ReconcileSummary, Traffic } from "@/lib/invoice-recon/types";
import Link from "next/link";

const SAMPLE = `PSAP	Tracking	Amount	Notes
9820 Stockton CHP	19280	3933.00	NOT LISTED
1915 LA CSU	24669	8712.00	YR8
3009 Huntington Beach PD	29501-OP	104229.00	CPE INSTALL
3103 Placer County SO	25908	1200.50	MA North`;

const TRAFFIC_BG: Record<Traffic, string> = {
  GREEN: "bg-emerald-500/20 text-emerald-200",
  YELLOW: "bg-amber-500/20 text-amber-100",
  RED: "bg-rose-500/25 text-rose-100",
};

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function InvoiceReconcilerApp() {
  const [batchText, setBatchText] = useState(SAMPLE);
  const [received, setReceived] = useState(todayIso());
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [indexJson, setIndexJson] = useState<unknown>(null);
  const [indexLabel, setIndexLabel] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<ReconcileSummary | null>(null);

  const counts = summary?.counts;

  function onTd288Files(files: FileList | null) {
    if (!files?.length) {
      setFileNames([]);
      return;
    }
    setFileNames(Array.from(files).map((f) => f.name));
  }

  async function onIndexJson(file: File | null) {
    setIndexJson(null);
    setIndexLabel("");
    if (!file) return;
    try {
      const text = await file.text();
      setIndexJson(JSON.parse(text));
      setIndexLabel(file.name);
    } catch {
      setError("Could not parse TD-288 index JSON. Export data/td288_index.json from the desktop tool.");
    }
  }

  function run() {
    setError("");
    setSummary(null);
    try {
      const result = runInvoiceReconcile({
        batchText,
        receivedDate: received,
        td288Filenames: fileNames,
        td288IndexJson: indexJson ?? undefined,
      });
      setSummary(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reconcile failed");
    }
  }

  function downloadCsv(kind: "APPROVE" | "DISPUTE" | "REVIEW") {
    if (!summary) return;
    const rows = summary.lines.filter((r) => r.recommendation === kind);
    const header = [
      "line_no",
      "psap_code",
      "psap_name",
      "tracking",
      "amount",
      "traffic",
      "recommendation",
      "flags",
      "sla_status",
      "days_open",
      "rationale",
    ];
    const body = rows.map((r) =>
      [
        r.line.line_no,
        r.line.psap_code,
        csvEscape(r.line.psap_name),
        r.line.tracking,
        r.line.amount ?? "",
        r.traffic,
        r.recommendation,
        r.flags.join(";"),
        r.sla.status,
        r.sla.days_open,
        csvEscape(r.rationale),
      ].join(",")
    );
    const blob = new Blob([[header.join(","), ...body].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${kind.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const hasIndex = fileNames.length > 0 || !!indexJson;

  const tableRows = useMemo(() => summary?.lines ?? [], [summary]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-white/50">
        <Link href="/advisor-tools" className="text-cyanGlow hover:underline">
          ← Advisor Tools
        </Link>
        <span>·</span>
        <span>Web v1.0.0 · desktop twin available</span>
      </div>

      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-widest text-cyanGlow/80">Cal OES · Funding Advisor</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Invoice ↔ TD-288 Reconciler</h1>
        <p className="mt-3 max-w-3xl text-white/65">
          Paste Victoria’s weekly invoice summary table, match tracking numbers to TD-288 files (by filename or desktop
          index export), apply 5/30/45-day SLA rules, and download approve / dispute lists.{" "}
          <strong className="text-white/80">Does not approve payments</strong> — advisor judgment required.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <label className="block text-sm text-white/80">
            Batch received date (SLA clock)
            <input
              type="date"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              className="mt-2 w-full rounded-lg border border-white/15 bg-vault-950/60 px-3 py-2 text-white"
            />
          </label>

          <label className="block text-sm text-white/80">
            Victoria batch table (paste or edit)
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              rows={12}
              className="mt-2 w-full rounded-lg border border-white/15 bg-vault-950/60 px-3 py-2 font-mono text-xs text-white"
              spellCheck={false}
            />
          </label>

          <div className="rounded-xl border border-white/10 bg-vault-950/40 p-4 text-sm text-white/70">
            <p className="font-medium text-white/90">TD-288 index (pick one or both)</p>
            <label className="mt-3 block">
              Select TD-288 files (filenames only — multi-select OK)
              <input
                type="file"
                multiple
                className="mt-2 w-full text-xs text-white/80 file:mr-3 file:rounded file:border-0 file:bg-cyanGlow/20 file:px-3 file:py-1 file:text-cyanGlow"
                onChange={(e) => onTd288Files(e.target.files)}
              />
              {fileNames.length > 0 && (
                <p className="mt-1 text-xs text-cyanGlow/90">{fileNames.length} file name(s) indexed</p>
              )}
            </label>
            <label className="mt-3 block">
              Or upload desktop <code className="text-cyanGlow">td288_index.json</code>
              <input
                type="file"
                accept=".json,application/json"
                className="mt-2 w-full text-xs text-white/80 file:mr-3 file:rounded file:border-0 file:bg-cyanGlow/20 file:px-3 file:py-1 file:text-cyanGlow"
                onChange={(e) => onIndexJson(e.target.files?.[0] ?? null)}
              />
              {indexLabel && <p className="mt-1 text-xs text-cyanGlow/90">Loaded: {indexLabel}</p>}
            </label>
            {!hasIndex && (
              <p className="mt-2 text-xs text-amber-200/90">
                No index yet — all trackings will show TD288_NOT_FOUND until you add files or JSON.
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
              {error}
            </div>
          )}

          <button type="button" onClick={run} className="btn-primary w-full sm:w-auto">
            Run reconciliation
          </button>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-display text-xl font-semibold text-white">Results</h2>
          {!summary && (
            <p className="mt-4 text-sm text-white/50">Run reconciliation to see traffic-light results here.</p>
          )}
          {summary && counts && (
            <>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-200">
                  GREEN {counts.GREEN}
                </span>
                <span className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-100">
                  YELLOW {counts.YELLOW}
                </span>
                <span className="rounded-full bg-rose-500/20 px-3 py-1 text-rose-100">RED {counts.RED}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-white/70">
                  Index {summary.meta.index_size}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="btn-secondary text-xs" onClick={() => downloadCsv("APPROVE")}>
                  Download approve.csv
                </button>
                <button type="button" className="btn-secondary text-xs" onClick={() => downloadCsv("DISPUTE")}>
                  Download dispute.csv
                </button>
                <button type="button" className="btn-secondary text-xs" onClick={() => downloadCsv("REVIEW")}>
                  Download review.csv
                </button>
              </div>
              <div className="mt-4 max-h-[28rem] overflow-auto rounded-lg border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 bg-vault-950 text-white/70">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">PSAP</th>
                      <th className="p-2">Track</th>
                      <th className="p-2">$</th>
                      <th className="p-2">Light</th>
                      <th className="p-2">Rec</th>
                      <th className="p-2">Flags</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((r: LineResult) => (
                      <tr key={r.line.line_no} className="border-t border-white/5">
                        <td className="p-2">{r.line.line_no}</td>
                        <td className="p-2">
                          {r.line.psap_code} {r.line.psap_name}
                        </td>
                        <td className="p-2 font-mono">{r.line.tracking}</td>
                        <td className="p-2">{r.line.amount != null ? r.line.amount.toLocaleString() : ""}</td>
                        <td className="p-2">
                          <span className={`rounded px-2 py-0.5 font-semibold ${TRAFFIC_BG[r.traffic]}`}>
                            {r.traffic}
                          </span>
                        </td>
                        <td className="p-2">{r.recommendation}</td>
                        <td className="p-2 text-white/60">{r.flags.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-white/40">
                Engine {summary.meta.version} · received {summary.meta.received_date} · draft decision support only
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function csvEscape(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}
