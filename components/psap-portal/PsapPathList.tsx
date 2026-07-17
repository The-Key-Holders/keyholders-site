"use client";

import { portal } from "@/lib/psap-portal/ui";
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

export default function PsapPathList() {
  const [paths, setPaths] = useState<PathRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/psap-portal/ops/paths");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load paths");
        if (!cancelled) setPaths(data.paths ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mt-10" data-testid="psap-path-list">
      <h2 className={portal.h2}>My compliance paths</h2>
      <p className={`${portal.muted} mt-2`}>
        Live process status shared with your Advisor. Completing a process moves your bucket.
      </p>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      <ul className="mt-4 space-y-2">
        {paths.map((p) => (
          <li key={p.id}>
            <Link
              href={`/psap-portal/path/${p.id}`}
              className={`${portal.cardHover} flex flex-wrap items-center justify-between gap-2`}
              data-testid={`psap-path-${p.id}`}
            >
              <span>
                <span className="font-semibold text-white">{p.psapName}</span>
                <span className="text-white/50"> · {p.pathTypeName}</span>
              </span>
              <span className="text-xs text-cyanGlow">
                {p.effectiveBucket} · {p.status}
              </span>
            </Link>
          </li>
        ))}
        {!error && paths.length === 0 && (
          <li className={portal.muted}>Loading paths…</li>
        )}
      </ul>
    </section>
  );
}
