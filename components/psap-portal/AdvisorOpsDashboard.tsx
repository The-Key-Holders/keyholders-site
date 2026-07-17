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
};

export default function AdvisorOpsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [buckets, setBuckets] = useState<BucketCount[]>([]);
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
        <a
          href="/api/psap-portal/ops/report"
          className={portal.btnSecondary}
          data-testid="report-csv"
        >
          Export CSV report
        </a>
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
                  <span className="text-xs text-cyanGlow">{p.status}</span>
                </Link>
              </li>
            ))}
            {drill.paths.length === 0 && (
              <li className={portal.muted}>No paths in this bucket.</li>
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
