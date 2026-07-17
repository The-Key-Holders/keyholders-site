"use client";

import PathWorkspace from "@/components/psap-portal/PathWorkspace";
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
import { useCallback, useEffect, useState } from "react";

type Detail = {
  path: Path;
  psap: Psap;
  processes: Process[];
  tasks: Task[];
  activity: ActivityEvent[];
  buckets: BucketDef[];
  activeOverride: Override | null;
  effectiveBucket: string;
  actor: { role: Role };
};

export default function PathDetailClient({ pathId }: { pathId: string }) {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/psap-portal/ops/paths/${pathId}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Not found");
      setDetail({
        path: data.path,
        psap: data.psap,
        processes: data.processes,
        tasks: data.tasks,
        activity: data.activity,
        buckets: data.buckets,
        activeOverride: data.activeOverride ?? null,
        effectiveBucket: data.effectiveBucket,
        actor: data.actor,
      });
    } catch (e) {
      setDetail(null);
      setError(e instanceof Error ? e.message : "Failed to load path");
    } finally {
      setLoading(false);
    }
  }, [pathId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className={portal.page}>
        <p className={portal.muted}>Loading path…</p>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className={portal.page}>
        <p className="text-sm text-red-300">{error || "Path not found"}</p>
        <Link href="/psap-portal/psap" className="mt-4 inline-block text-cyanGlow">
          ← Back
        </Link>
      </div>
    );
  }

  const role = detail.actor.role;

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        <Link
          href={
            role === "advisor"
              ? "/psap-portal/advisor/dashboard"
              : "/psap-portal/psap"
          }
          className="text-sm text-cyanGlow hover:underline"
        >
          ← Back
        </Link>
      </div>
      <PathWorkspace
        path={detail.path}
        psap={detail.psap}
        processes={detail.processes}
        tasks={detail.tasks}
        activity={detail.activity}
        buckets={detail.buckets}
        activeOverride={detail.activeOverride}
        effectiveBucket={detail.effectiveBucket}
        actorRole={role}
        onChanged={() => void load()}
      />
    </>
  );
}
