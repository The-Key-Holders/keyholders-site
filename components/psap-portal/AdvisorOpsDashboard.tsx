"use client";

import { portal } from "@/lib/psap-portal/ui";
import type { BucketCount, DashboardMetrics } from "@/lib/path-engine/types";
import Link from "next/link";
import { useEffect, useState } from "react";

type PathRow = {
  id: string;
  psapName: string;
  county: string;
  pathTypeName: string;
  status: string;
  effectiveBucket: string;
  daysInBucket?: number;
  slaBand?: string;
};

type AgingRow = {
  pathId: string;
  psapName: string;
  county: string;
  pathTypeName: string;
  effectiveBucket: string;
  daysInBucket: number;
  bucketBand: string;
  openProcessCode?: string;
  openProcessDays?: number;
  processBand?: string;
};

export default function AdvisorOpsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [buckets, setBuckets] = useState<BucketCount[]>([]);
  const [aging, setAging] = useState<AgingRow[]>([]);
  const [slaSummary, setSlaSummary] = useState<{
    ok: number;
    watch: number;
    breach: number;
  } | null>(null);
  const [drill, setDrill] = useState<{
    bucketCode: string;
    bucketLabel: string;
    paths: PathRow[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/psap-portal/ops/dashboard");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Dashboard failed");
        if (!cancelled) {
          setMetrics(data.metrics);
          setBuckets(data.buckets ?? []);
          setAging(data.aging ?? []);
          setSlaSummary(data.slaSummary ?? null);
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Dashboard failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function openBucket(b: BucketCount) {
    setError(null);
    try {
      const q = new URLSearchParams({
        bucket: b.bucketCode,
        pathType: b.pathTypeCode,
      });
      const res = await fetch(`/api/psap-portal/ops/paths?${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "List failed");
      setDrill({
        bucketCode: b.bucketCode,
        bucketLabel: b.bucketLabel,
        paths: data.paths ?? [],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "List failed");
    }
  }

  return (
    <div data-testid="advisor-ops-dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className={portal.badgeGold}>Ops ERP · Slice 1</p>
          <h2 className={`${portal.h2} mt-2`}>Assigned workload</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/api/psap-portal/ops/report"
            className={portal.btnSecondary}
            data-testid="report-csv"
          >
            Paths CSV
          </a>
          <a
            href="/api/psap-portal/ops/report?kind=sla"
            className={portal.btnSecondary}
            data-testid="report-sla-csv"
          >
            SLA aging CSV
          </a>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-300">{error}</p>
      )}

      {metrics && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="ops-metrics">
          {[
            { label: "PSAPs assigned", value: metrics.totalPsapsAssigned },
            { label: "Paths completed", value: metrics.pathsCompleted },
            { label: "Paths open", value: metrics.pathsOpen },
            { label: "Not completed", value: metrics.pathsNotCompleted },
          ].map((m) => (
            <div key={m.label} className={portal.card}>
              <p className="text-xs uppercase tracking-wide text-white/45">{m.label}</p>
              <p className="mt-1 font-[family-name:var(--font-syne)] text-3xl font-bold text-white">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {slaSummary && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3" data-testid="sla-summary">
          <div className={portal.card}>
            <p className="text-xs uppercase text-emerald-300/80">SLA OK</p>
            <p className="text-2xl font-bold text-emerald-300">{slaSummary.ok}</p>
          </div>
          <div className={portal.card}>
            <p className="text-xs uppercase text-amber-300/80">Watch</p>
            <p className="text-2xl font-bold text-amber-300">{slaSummary.watch}</p>
          </div>
          <div className={portal.card}>
            <p className="text-xs uppercase text-red-300/80">Breach</p>
            <p className="text-2xl font-bold text-red-300">{slaSummary.breach}</p>
          </div>
        </div>
      )}

      <section className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-cyanGlow">
          Bucket board
        </h3>
        <p className={`${portal.muted} mt-1`}>
          Live counts by scenario path type and E2E position. Click a bucket to drill down.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="bucket-board">
          {buckets.map((b) => (
            <button
              key={`${b.pathTypeCode}-${b.bucketCode}`}
              type="button"
              onClick={() => openBucket(b)}
              className={`${portal.cardHover} w-full text-left`}
              data-testid={`bucket-${b.bucketCode}`}
            >
              <p className="text-xs text-white/40">{b.pathTypeName}</p>
              <p className="mt-1 font-semibold text-white">{b.bucketLabel}</p>
              <p className="mt-2 text-2xl font-bold text-gold">{b.count}</p>
            </button>
          ))}
          {buckets.length === 0 && !error && (
            <p className={portal.muted}>Loading buckets…</p>
          )}
        </div>
      </section>

      {drill && (
        <section className="mt-8" data-testid="bucket-drilldown">
          <h3 className={portal.h2}>
            PSAPs in “{drill.bucketLabel}”
          </h3>
          <ul className="mt-3 space-y-2">
            {drill.paths.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/psap-portal/path/${p.id}`}
                  className={`${portal.cardHover} flex flex-wrap items-center justify-between gap-2`}
                  data-testid={`path-link-${p.id}`}
                >
                  <span>
                    <span className="font-semibold text-white">{p.psapName}</span>
                    <span className="text-white/45"> · {p.county}</span>
                  </span>
                  <span className="text-xs text-cyanGlow">
                    {p.status}
                    {typeof p.daysInBucket === "number"
                      ? ` · ${p.daysInBucket}d · ${p.slaBand ?? "ok"}`
                      : ""}
                  </span>
                </Link>
              </li>
            ))}
            {drill.paths.length === 0 && (
              <li className={portal.muted}>No paths in this bucket.</li>
            )}
          </ul>
        </section>
      )}

      {aging.length > 0 && (
        <section className="mt-10" data-testid="sla-aging-table">
          <h3 className={portal.h2}>Open path aging (SLA)</h3>
          <p className={`${portal.muted} mt-1`}>
            Targets from post-award process timelines (calendar days). Watch → approaching;
            Breach → past target.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-white/80">
              <thead className="text-xs uppercase text-white/40">
                <tr>
                  <th className="py-2 pr-2">PSAP</th>
                  <th className="py-2 pr-2">Bucket</th>
                  <th className="py-2 pr-2">Days</th>
                  <th className="py-2 pr-2">Band</th>
                  <th className="py-2 pr-2">Open process</th>
                </tr>
              </thead>
              <tbody>
                {aging.map((a) => (
                  <tr key={a.pathId} className="border-t border-white/10">
                    <td className="py-2 pr-2">
                      <Link
                        href={`/psap-portal/path/${a.pathId}`}
                        className="text-cyanGlow hover:underline"
                      >
                        {a.psapName}
                      </Link>
                      <span className="text-white/40"> · {a.county}</span>
                    </td>
                    <td className="py-2 pr-2">{a.effectiveBucket}</td>
                    <td className="py-2 pr-2">{a.daysInBucket}</td>
                    <td className="py-2 pr-2">
                      <span
                        className={
                          a.bucketBand === "breach"
                            ? "text-red-300"
                            : a.bucketBand === "watch"
                              ? "text-amber-300"
                              : "text-emerald-300"
                        }
                      >
                        {a.bucketBand}
                      </span>
                    </td>
                    <td className="py-2 pr-2">
                      {a.openProcessCode ?? "—"}
                      {typeof a.openProcessDays === "number"
                        ? ` (${a.openProcessDays}d · ${a.processBand})`
                        : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
