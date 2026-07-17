import { effectiveBucketCode, bucketLabel } from "./buckets";
import {
  canAccessPsap,
  canOverride,
  demoUserForRole,
  visiblePsapIds,
} from "./authz";
import {
  getActiveOverride,
  getActivityForPath,
  getPath,
  getPathType,
  getProcess,
  getProcessesForPath,
  getTasksForPath,
  listPaths,
  listPsaps,
  listAllProcesses,
  replacePathState,
} from "./store";
import {
  completeProcess,
  reverseOverride,
  setOverride,
} from "./transitions";
import { bucketSla, processSla, type SlaBand } from "./sla";
import type {
  Actor,
  BucketCount,
  DashboardMetrics,
  PathDetail,
  Path,
  Process,
  Role,
} from "./types";

export type AgingRow = {
  pathId: string;
  psapName: string;
  county: string;
  pathTypeName: string;
  effectiveBucket: string;
  daysInBucket: number;
  bucketBand: SlaBand;
  openProcessCode?: string;
  openProcessDays?: number;
  processBand?: SlaBand;
  dueAt?: string;
};

export function actorFromRole(role: Role): Actor {
  return demoUserForRole(role);
}

function allowedPsapIdSet(actor: Actor): Set<string> {
  const vis = visiblePsapIds(actor);
  if (vis.has("*")) return new Set(listPsaps().map((p) => p.id));
  return vis;
}

export function getDashboard(actor: Actor): {
  metrics: DashboardMetrics;
  buckets: BucketCount[];
  aging: AgingRow[];
  slaSummary: { ok: number; watch: number; breach: number };
} {
  const allowedPsapIds = allowedPsapIdSet(actor);
  const psaps = listPsaps();
  const psapById = new Map(psaps.map((p) => [p.id, p]));

  const paths = listPaths().filter((p) => allowedPsapIds.has(p.psapId));
  const metrics: DashboardMetrics = {
    totalPsapsAssigned: allowedPsapIds.size,
    pathsCompleted: paths.filter((p) => p.status === "completed").length,
    pathsOpen: paths.filter((p) => p.status === "open").length,
    pathsNotCompleted: paths.filter((p) => {
      if (p.status !== "open") return false;
      const procs = getProcessesForPath(p.id).filter((x) => x.required);
      return procs.some((x) => x.status !== "completed" && x.status !== "waived");
    }).length,
  };

  const bucketMap = new Map<string, BucketCount>();
  const aging: AgingRow[] = [];
  const slaSummary = { ok: 0, watch: 0, breach: 0 };

  for (const path of paths) {
    const pt = getPathType(path.pathTypeId);
    if (!pt) continue;
    const code = effectiveBucketCode(path);
    const bdef = pt.buckets.find((b) => b.code === code);
    const key = `${path.pathTypeCode}::${code}`;
    const existing = bucketMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      bucketMap.set(key, {
        pathTypeCode: path.pathTypeCode,
        pathTypeName: path.pathTypeName,
        bucketCode: code,
        bucketLabel: bdef?.label ?? code,
        sortOrder: bdef?.sortOrder ?? 99,
        count: 1,
      });
    }

    if (path.status !== "open") continue;
    // Approx entered bucket: last activity or path openedAt
    const enteredAt = path.openedAt;
    const bSla = bucketSla(code, enteredAt);
    const procs = getProcessesForPath(path.id);
    const openProc =
      procs.find((p) => p.status === "open") ||
      procs.find(
        (p) =>
          p.required && p.status !== "completed" && p.status !== "waived"
      );
    const pSla = openProc
      ? processSla(
          openProc.templateCode,
          openProc.startedAt || path.openedAt,
          openProc.status
        )
      : null;
    const worst: SlaBand =
      bSla.band === "breach" || pSla?.band === "breach"
        ? "breach"
        : bSla.band === "watch" || pSla?.band === "watch"
          ? "watch"
          : "ok";
    slaSummary[worst] += 1;
    const psap = psapById.get(path.psapId);
    aging.push({
      pathId: path.id,
      psapName: psap?.name ?? path.psapId,
      county: psap?.county ?? "",
      pathTypeName: path.pathTypeName,
      effectiveBucket: code,
      daysInBucket: bSla.daysInBucket,
      bucketBand: bSla.band,
      openProcessCode: openProc?.templateCode,
      openProcessDays: pSla?.daysOpen,
      processBand: pSla?.band,
      dueAt: openProc?.dueAt,
    });
  }

  aging.sort((a, b) => {
    const rank = (x: SlaBand) => (x === "breach" ? 0 : x === "watch" ? 1 : 2);
    const ra = rank(a.bucketBand);
    const rb = rank(b.bucketBand);
    if (ra !== rb) return ra - rb;
    return b.daysInBucket - a.daysInBucket;
  });

  const buckets = Array.from(bucketMap.values()).sort((a, b) => {
    if (a.pathTypeCode !== b.pathTypeCode)
      return a.pathTypeCode.localeCompare(b.pathTypeCode);
    return a.sortOrder - b.sortOrder;
  });

  return { metrics, buckets, aging, slaSummary };
}

export function listPathsForActor(
  actor: Actor,
  filter?: { bucketCode?: string; pathTypeCode?: string }
): Array<
  Path & {
    psapName: string;
    county: string;
    effectiveBucket: string;
    daysInBucket: number;
    slaBand: SlaBand;
  }
> {
  const psaps = listPsaps();
  const psapById = new Map(psaps.map((p) => [p.id, p]));
  const allowed = allowedPsapIdSet(actor);

  return listPaths()
    .filter((p) => allowed.has(p.psapId))
    .filter((p) => !filter?.pathTypeCode || p.pathTypeCode === filter.pathTypeCode)
    .filter((p) => {
      if (!filter?.bucketCode) return true;
      return effectiveBucketCode(p) === filter.bucketCode;
    })
    .map((p) => {
      const psap = psapById.get(p.psapId);
      const bucket = effectiveBucketCode(p);
      const bSla = bucketSla(bucket, p.openedAt);
      return {
        ...p,
        psapName: psap?.name ?? p.psapId,
        county: psap?.county ?? "",
        effectiveBucket: bucket,
        daysInBucket: bSla.daysInBucket,
        slaBand: bSla.band,
      };
    });
}

export function getPathDetail(actor: Actor, pathId: string): PathDetail | null {
  const path = getPath(pathId);
  if (!path) return null;
  if (!canAccessPsap(actor, path.psapId)) return null;
  const psap = listPsaps().find((p) => p.id === path.psapId);
  if (!psap) return null;
  const pathType = getPathType(path.pathTypeId);
  if (!pathType) return null;
  return {
    path,
    psap,
    processes: getProcessesForPath(pathId),
    tasks: getTasksForPath(pathId),
    activity: getActivityForPath(pathId),
    buckets: pathType.buckets,
    activeOverride: getActiveOverride(pathId) ?? null,
  };
}

export function completeProcessForActor(
  actor: Actor,
  processId: string
): { ok: true; pathId: string; noop?: boolean } | { ok: false; error: string } {
  const proc = getProcess(processId);
  if (!proc) return { ok: false, error: "Process not found" };
  const path = getPath(proc.pathId);
  if (!path) return { ok: false, error: "Path not found" };
  if (!canAccessPsap(actor, path.psapId))
    return { ok: false, error: "Forbidden" };
  const pathType = getPathType(path.pathTypeId);
  if (!pathType) return { ok: false, error: "Path type missing" };

  const result = completeProcess(
    {
      path,
      pathType,
      processes: getProcessesForPath(path.id),
      tasks: getTasksForPath(path.id),
    },
    processId,
    actor
  );

  if (!result.noop) {
    replacePathState({
      path: result.path,
      processes: result.processes,
      tasks: result.tasks,
      activity: result.activity,
      audit: result.audit,
    });
  }

  return { ok: true, pathId: path.id, noop: result.noop };
}

export function overridePathForActor(
  actor: Actor,
  pathId: string,
  toBucketCode: string,
  reason: string
): { ok: true } | { ok: false; error: string } {
  if (!canOverride(actor)) return { ok: false, error: "Forbidden" };
  const path = getPath(pathId);
  if (!path) return { ok: false, error: "Path not found" };
  if (!canAccessPsap(actor, path.psapId))
    return { ok: false, error: "Forbidden" };
  const pathType = getPathType(path.pathTypeId);
  if (!pathType) return { ok: false, error: "Path type missing" };

  try {
    const result = setOverride(
      {
        path,
        pathType,
        processes: getProcessesForPath(pathId),
        tasks: getTasksForPath(pathId),
      },
      toBucketCode,
      reason,
      actor
    );
    replacePathState({
      path: result.path,
      processes: result.processes,
      tasks: result.tasks,
      activity: result.activity,
      audit: result.audit,
      override: result.override,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Override failed" };
  }
}

export function reverseOverrideForActor(
  actor: Actor,
  pathId: string
): { ok: true } | { ok: false; error: string } {
  if (!canOverride(actor)) return { ok: false, error: "Forbidden" };
  const path = getPath(pathId);
  if (!path) return { ok: false, error: "Path not found" };
  if (!canAccessPsap(actor, path.psapId))
    return { ok: false, error: "Forbidden" };
  const ov = getActiveOverride(pathId);
  if (!ov) return { ok: false, error: "No active override" };
  const pathType = getPathType(path.pathTypeId);
  if (!pathType) return { ok: false, error: "Path type missing" };

  const result = reverseOverride(
    {
      path,
      pathType,
      processes: getProcessesForPath(pathId),
      tasks: getTasksForPath(pathId),
    },
    ov,
    actor
  );
  replacePathState({
    path: result.path,
    processes: result.processes,
    tasks: result.tasks,
    activity: result.activity,
    audit: result.audit,
    override: result.override,
  });
  return { ok: true };
}

export function buildCsvReport(actor: Actor): string {
  const rows = listPathsForActor(actor);
  const header = [
    "path_id",
    "psap",
    "county",
    "path_type",
    "status",
    "bucket",
    "days_in_bucket",
    "sla_band",
    "override",
    "opened_at",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    const cells = [
      r.id,
      r.psapName,
      r.county,
      r.pathTypeCode,
      r.status,
      r.effectiveBucket,
      r.daysInBucket,
      r.slaBand,
      r.overrideBucketCode ?? "",
      r.openedAt,
    ].map((c) => `"${String(c).replace(/"/g, '""')}"`);
    lines.push(cells.join(","));
  }
  const procs = listAllProcesses();
  lines.push("");
  lines.push(
    '"process_id","path_id","code","name","status","due_at","days_open","sla_band"'
  );
  for (const p of procs) {
    if (!rows.some((r) => r.id === p.pathId)) continue;
    const path = rows.find((r) => r.id === p.pathId);
    const s = processSla(
      p.templateCode,
      p.startedAt || path?.openedAt,
      p.status
    );
    lines.push(
      [
        p.id,
        p.pathId,
        p.templateCode,
        p.name,
        p.status,
        p.dueAt ?? "",
        s?.daysOpen ?? "",
        s?.band ?? "",
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    );
  }
  return lines.join("\n");
}

/** Aging-only CSV for Advisor SLA desk */
export function buildSlaCsvReport(actor: Actor): string {
  const { aging } = getDashboard(actor);
  const header = [
    "path_id",
    "psap",
    "county",
    "path_type",
    "bucket",
    "days_in_bucket",
    "bucket_sla",
    "open_process",
    "process_days",
    "process_sla",
    "due_at",
  ];
  const lines = [header.join(",")];
  for (const a of aging) {
    lines.push(
      [
        a.pathId,
        a.psapName,
        a.county,
        a.pathTypeName,
        a.effectiveBucket,
        a.daysInBucket,
        a.bucketBand,
        a.openProcessCode ?? "",
        a.openProcessDays ?? "",
        a.processBand ?? "",
        a.dueAt ?? "",
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    );
  }
  return lines.join("\n");
}

export function describeBucket(path: Path): string {
  const pt = getPathType(path.pathTypeId);
  if (!pt) return effectiveBucketCode(path);
  return bucketLabel(pt.buckets, effectiveBucketCode(path));
}

export type { Process };
