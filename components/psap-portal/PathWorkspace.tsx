"use client";

import { portal } from "@/lib/psap-portal/ui";
import type {
  ActivityEvent,
  BucketDef,
  Override,
  Path,
  Process,
  Psap,
  Role,
  Task,
} from "@/lib/path-engine/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type PathWorkspaceProps = {
  path: Path;
  psap: Psap;
  processes: Process[];
  tasks: Task[];
  activity: ActivityEvent[];
  buckets: BucketDef[];
  activeOverride: Override | null;
  effectiveBucket: string;
  actorRole: Role;
  /** Prefer over router.refresh when parent loads via client fetch */
  onChanged?: () => void;
};

export default function PathWorkspace(props: PathWorkspaceProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [toBucket, setToBucket] = useState(props.effectiveBucket);

  function refresh() {
    if (props.onChanged) props.onChanged();
    else router.refresh();
  }

  const canOverride = props.actorRole === "advisor" || props.actorRole === "admin";
  const bucketLabel = useMemo(() => {
    return (
      props.buckets.find((b) => b.code === props.effectiveBucket)?.label ??
      props.effectiveBucket
    );
  }, [props.buckets, props.effectiveBucket]);

  async function completeProcess(processId: string) {
    setBusy(processId);
    setError(null);
    try {
      const res = await fetch(
        `/api/psap-portal/ops/processes/${processId}/complete`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Complete failed");
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Complete failed");
    } finally {
      setBusy(null);
    }
  }

  async function applyOverride() {
    setBusy("override");
    setError(null);
    try {
      const res = await fetch(
        `/api/psap-portal/ops/paths/${props.path.id}/override`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toBucketCode: toBucket, reason }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Override failed");
      setReason("");
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Override failed");
    } finally {
      setBusy(null);
    }
  }

  async function reverseOverride() {
    setBusy("reverse");
    setError(null);
    try {
      const res = await fetch(
        `/api/psap-portal/ops/paths/${props.path.id}/override`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "reverse" }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reverse failed");
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reverse failed");
    } finally {
      setBusy(null);
    }
  }

  const tasksByProcess = useMemo(() => {
    const m = new Map<string, Task[]>();
    for (const t of props.tasks) {
      const list = m.get(t.processId) ?? [];
      list.push(t);
      m.set(t.processId, list);
    }
    return m;
  }, [props.tasks]);

  return (
    <div className={portal.page} data-testid="path-workspace">
      <p className={props.actorRole === "advisor" ? portal.badgeGold : portal.badge}>
        {props.psap.name} · {props.psap.county}
      </p>
      <h1 className={`${portal.h1} mt-3`}>{props.path.pathTypeName}</h1>
      <p className={portal.lead}>
        Path status: <strong className="text-white">{props.path.status}</strong>
        {" · "}
        Bucket: <strong className="text-cyanGlow">{bucketLabel}</strong>
        {props.activeOverride ? (
          <span className="text-gold"> (override active)</span>
        ) : null}
      </p>

      {error && (
        <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}

      <section className="mt-8">
        <h2 className={portal.h2}>Processes</h2>
        <ul className="mt-4 space-y-3">
          {props.processes.map((proc) => {
            const done = proc.status === "completed" || proc.status === "waived";
            const tasks = (tasksByProcess.get(proc.id) ?? []).sort(
              (a, b) => a.sortOrder - b.sortOrder
            );
            return (
              <li key={proc.id} className={portal.card} data-testid={`process-${proc.templateCode}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-white/40">
                      {proc.templateCode} · {proc.status}
                      {proc.dueAt
                        ? ` · due ${proc.dueAt.slice(0, 10)}`
                        : ""}
                    </p>
                    <p className="mt-1 font-semibold text-white">{proc.name}</p>
                    {tasks.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-white/55">
                        {tasks.map((t) => (
                          <li key={t.id}>
                            {t.status === "completed" ? "✓" : "○"} {t.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {proc.toolHref && (
                      <Link
                        href={`${proc.toolHref}?pathId=${props.path.id}&processId=${proc.id}`}
                        className="text-sm text-cyanGlow hover:underline"
                      >
                        Open tool →
                      </Link>
                    )}
                    {!done && (
                      <button
                        type="button"
                        data-testid={`complete-${proc.templateCode}`}
                        disabled={busy === proc.id}
                        onClick={() => completeProcess(proc.id)}
                        className={portal.btnPrimary}
                      >
                        {busy === proc.id ? "Saving…" : "Mark complete"}
                      </button>
                    )}
                    {done && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                        Complete
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {canOverride && (
        <section className={`${portal.card} mt-8 border-gold/30`} data-testid="override-panel">
          <h2 className={portal.h2}>Advisor override</h2>
          <p className={`${portal.muted} mt-2`}>
            Pin this path to a bucket. Requires a reason (audited + visible on PSAP activity).
          </p>
          {props.activeOverride && (
            <div className="mt-3 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 text-sm text-white/80">
              Active: {props.activeOverride.fromBucket} → {props.activeOverride.toBucket}
              <br />
              “{props.activeOverride.reason}” — {props.activeOverride.actorName}
              <button
                type="button"
                className={`${portal.btnSecondary} mt-2`}
                disabled={busy === "reverse"}
                onClick={() => reverseOverride()}
                data-testid="override-reverse"
              >
                Reverse override
              </button>
            </div>
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className={portal.label}>Target bucket</span>
              <select
                className={`${portal.input} mt-1`}
                value={toBucket}
                onChange={(e) => setToBucket(e.target.value)}
                data-testid="override-bucket"
              >
                {props.buckets.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className={portal.label}>Reason (min 8 chars)</span>
              <textarea
                className={`${portal.input} mt-1 min-h-[72px]`}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why are you overriding automatic bucket movement?"
                data-testid="override-reason"
              />
            </label>
          </div>
          <button
            type="button"
            className={`${portal.btnPrimary} mt-3`}
            disabled={busy === "override" || reason.trim().length < 8}
            onClick={() => applyOverride()}
            data-testid="override-submit"
          >
            {busy === "override" ? "Applying…" : "Apply override"}
          </button>
        </section>
      )}

      <section className="mt-10">
        <h2 className={portal.h2}>Activity</h2>
        <ul className="mt-4 space-y-2" data-testid="path-activity">
          {props.activity.length === 0 && (
            <li className={portal.muted}>No activity yet.</li>
          )}
          {props.activity.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm"
            >
              <p className="text-xs text-white/40">
                {a.createdAt.slice(0, 19).replace("T", " ")} · {a.actorName} ({a.actorRole})
              </p>
              <p className="text-white/85">{a.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
