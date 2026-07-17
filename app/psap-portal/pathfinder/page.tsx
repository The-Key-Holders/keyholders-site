"use client";

import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Guide = {
  pathId: string;
  psapName: string;
  pathTypeName: string;
  effectiveBucket: string;
  bucketLabel: string;
  pathStatus: string;
  nextAction: {
    name: string;
    toolHref?: string;
    processCode: string;
    status: string;
  } | null;
  steps: Array<{
    processCode: string;
    name: string;
    status: string;
    isNextAction: boolean;
    toolHref?: string;
  }>;
  tips: string[];
};

export default function PathfinderPage() {
  const [options, setOptions] = useState<Array<{ pathId: string; label: string }>>([]);
  const [pathId, setPathId] = useState("");
  const [guide, setGuide] = useState<Guide | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (id?: string) => {
    setError(null);
    try {
      const q = id ? `?pathId=${encodeURIComponent(id)}` : "";
      const res = await fetch(`/api/psap-portal/ops/pathfinder${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setOptions(data.options ?? []);
      setGuide(data.guide);
      if (data.guide?.pathId) setPathId(data.guide.pathId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className={portal.page} data-testid="pathfinder-page">
      <p className={portal.badge}>Pathfinder</p>
      <h1 className={`${portal.h1} mt-3`}>Where am I / what next?</h1>
      <p className={portal.lead}>
        Live guide from your compliance path engine — next process, tools, and tips.
      </p>

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      {options.length > 1 && (
        <label className="mt-6 block max-w-xl text-sm">
          <span className={portal.label}>Path</span>
          <select
            className={`${portal.input} mt-1`}
            value={pathId}
            onChange={(e) => {
              setPathId(e.target.value);
              void load(e.target.value);
            }}
            data-testid="pathfinder-select"
          >
            {options.map((o) => (
              <option key={o.pathId} value={o.pathId}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {guide && (
        <div className="mt-8 space-y-6">
          <div className={portal.card} data-testid="pathfinder-summary">
            <p className="text-xs text-white/45">
              {guide.psapName} · {guide.pathTypeName}
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              Bucket: <span className="text-cyanGlow">{guide.bucketLabel}</span>
              <span className="text-white/40"> · {guide.pathStatus}</span>
            </p>
            {guide.nextAction && (
              <div className="mt-4">
                <p className={portal.label}>Next action</p>
                <p className="mt-1 font-medium text-gold">{guide.nextAction.name}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {guide.nextAction.toolHref && (
                    <Link href={guide.nextAction.toolHref} className={portal.btnPrimary}>
                      Open tool
                    </Link>
                  )}
                  <Link
                    href={`/psap-portal/path/${guide.pathId}`}
                    className={portal.btnSecondary}
                  >
                    Open full path
                  </Link>
                </div>
              </div>
            )}
          </div>

          {guide.tips.length > 0 && (
            <ul className="space-y-2">
              {guide.tips.map((t) => (
                <li key={t} className={portal.alertCyan}>
                  {t}
                </li>
              ))}
            </ul>
          )}

          <section>
            <h2 className={portal.h2}>Process checklist</h2>
            <ol className="mt-3 space-y-2">
              {guide.steps.map((s) => (
                <li
                  key={s.processCode}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    s.isNextAction
                      ? "border-gold/40 bg-gold/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span className="font-medium text-white">{s.name}</span>
                  <span className="text-white/45"> · {s.status}</span>
                  {s.toolHref && (
                    <Link
                      href={s.toolHref}
                      className="ml-2 text-cyanGlow hover:underline"
                    >
                      tool
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}

      {!guide && !error && (
        <p className={`${portal.muted} mt-8`}>No paths visible for your account.</p>
      )}
    </div>
  );
}
