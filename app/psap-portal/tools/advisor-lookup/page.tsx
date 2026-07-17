"use client";

import { portal } from "@/lib/psap-portal/ui";
import type { AdvisorRecord } from "@/lib/psap-portal/types";
import { useEffect, useState } from "react";

export default function AdvisorLookupPage() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<AdvisorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      fetch(`/api/psap-portal/advisors?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d: { advisors?: AdvisorRecord[] }) => setRows(d.advisors || []))
        .finally(() => setLoading(false));
    }, 150);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className={portal.page}>
      <p className={portal.badge}>Sample data</p>
      <h1 className={`${portal.h1} mt-2`}>Find my Advisor</h1>
      <p className={portal.lead}>
        Search by county, name, or email. This directory is <strong>sample data</strong> — replace
        via Admin → Advisors / Export-Import with live Branch assignments.
      </p>
      <input
        className={`${portal.input} mt-6 max-w-md`}
        placeholder="e.g. Alameda, Sacramento, CHP…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        data-testid="advisor-search"
      />
      {loading ? (
        <p className={`${portal.muted} mt-6`}>Loading…</p>
      ) : (
        <div className={`${portal.grid2} mt-6`} data-testid="advisor-results">
          {rows.map((a) => (
            <article key={a.id} className={portal.card}>
              <h2 className="font-semibold text-white">{a.name}</h2>
              <p className={`${portal.muted} mt-1`}>{a.email}</p>
              <p className={portal.muted}>{a.phone}</p>
              <p className="mt-3 text-xs text-cyanGlow">{a.counties.join(" · ")}</p>
              {a.notes && <p className="mt-2 text-xs text-white/35">{a.notes}</p>}
            </article>
          ))}
          {!rows.length && (
            <p className={portal.muted}>No matches. Try another county name.</p>
          )}
        </div>
      )}
    </div>
  );
}
