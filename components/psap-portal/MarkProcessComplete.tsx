"use client";

import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

/** Optional CTA on tools when opened with ?processId= */
export default function MarkProcessComplete() {
  const sp = useSearchParams();
  const processId = sp.get("processId");
  const pathId = sp.get("pathId");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!processId) return null;

  async function complete() {
    setBusy(true);
    setMsg(null);
    try {
      // Persist tool context before complete
      await fetch("/api/psap-portal/ops/tool-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolCode: "mark-complete-cta",
          pathId: pathId || undefined,
          processId,
          status: "complete_requested",
          result: { source: "MarkProcessComplete" },
        }),
      });
      const res = await fetch(
        `/api/psap-portal/ops/processes/${processId}/complete`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(data.noop ? "Already complete." : "Process marked complete.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className={`${portal.alertCyan} mb-6 flex flex-wrap items-center justify-between gap-3`}
      data-testid="mark-process-complete"
    >
      <div>
        <p className="font-semibold text-white">Linked path process</p>
        <p className="text-sm text-white/70">
          After your checklist looks good, mark the process complete so Advisors see progress.
        </p>
        {msg && <p className="mt-1 text-sm text-cyanGlow">{msg}</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={portal.btnPrimary}
          disabled={busy}
          onClick={() => complete()}
          data-testid="tool-mark-complete"
        >
          {busy ? "Saving…" : "Mark process complete"}
        </button>
        {pathId && (
          <Link href={`/psap-portal/path/${pathId}`} className={portal.btnSecondary}>
            View path
          </Link>
        )}
      </div>
    </div>
  );
}
