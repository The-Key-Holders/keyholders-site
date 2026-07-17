"use client";

import { portal } from "@/lib/psap-portal/ui";
import { useCallback, useEffect, useState } from "react";

type Req = {
  id: string;
  email: string;
  displayName: string;
  roleRequested: string;
  psapName?: string;
  county?: string;
  note?: string;
  status: string;
  createdAt: string;
};

export default function AdminAccessPanel() {
  const [requests, setRequests] = useState<Req[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [magic, setMagic] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/psap-portal/ops/access");
    if (!res.ok) return;
    const data = await res.json();
    setRequests(data.requests ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function decide(id: string, decision: "approved" | "denied") {
    setMsg(null);
    setMagic(null);
    const res = await fetch("/api/psap-portal/ops/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "decide",
        requestId: id,
        decision,
        psapId: "psap_roseville",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "Failed");
      return;
    }
    if (data.magicUrlPath) {
      const full =
        typeof window !== "undefined"
          ? `${window.location.origin}${data.magicUrlPath}`
          : data.magicUrlPath;
      setMagic(full);
      setMsg(data.magicLinkHint || "Approved — share magic link.");
    } else {
      setMsg(decision === "denied" ? "Denied." : "Updated.");
    }
    void load();
  }

  return (
    <section className="mt-10" data-testid="admin-access-panel">
      <h2 className={portal.h2}>Access requests</h2>
      <p className={`${portal.muted} mt-1`}>
        Approve to create a user and issue a magic sign-in link (no email provider required — copy
        link).
      </p>
      {msg && <p className="mt-2 text-sm text-cyanGlow">{msg}</p>}
      {magic && (
        <p className="mt-2 break-all rounded-lg border border-gold/30 bg-gold/10 p-3 text-xs text-white/90" data-testid="magic-link">
          {magic}
        </p>
      )}
      <ul className="mt-4 space-y-2">
        {requests.map((r) => (
          <li key={r.id} className={portal.card} data-testid={`access-req-${r.id}`}>
            <p className="text-xs text-white/40">
              {r.status} · {r.roleRequested} · {r.createdAt.slice(0, 10)}
            </p>
            <p className="font-semibold text-white">
              {r.displayName} · {r.email}
            </p>
            <p className={portal.muted}>
              {r.psapName || "—"} · {r.county || "—"}
            </p>
            {r.note && <p className="mt-1 text-sm text-white/70">{r.note}</p>}
            {r.status === "pending" && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={portal.btnPrimary}
                  onClick={() => decide(r.id, "approved")}
                  data-testid={`approve-${r.id}`}
                >
                  Approve + magic link
                </button>
                <button
                  type="button"
                  className={portal.btnSecondary}
                  onClick={() => decide(r.id, "denied")}
                >
                  Deny
                </button>
              </div>
            )}
          </li>
        ))}
        {requests.length === 0 && (
          <li className={portal.muted}>No access requests yet.</li>
        )}
      </ul>
    </section>
  );
}
