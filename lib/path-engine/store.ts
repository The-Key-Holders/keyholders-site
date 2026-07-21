/**
 * Ops store: in-memory working set + durable snapshot (Neon or file).
 * Call ensureOpsStore() at the start of API handlers / server entry.
 * Vitest: OPS_STORE=memory / VITEST — pure memory, resetOpsStore() between tests.
 */

import { buildSeedSnapshot } from "./seed";
import { newId, nowIso } from "./id";
import {
  loadPersistedSnapshot,
  savePersistedSnapshot,
  isMemoryOnlyStore,
} from "./persist";
import type {
  ActivityEvent,
  Assignment,
  AuditEvent,
  OpsSnapshot,
  Override,
  Path,
  PathType,
  Process,
  Psap,
  Task,
  User,
} from "./types";

type G = {
  __pathOpsStore?: OpsSnapshot;
  __pathOpsLoadPromise?: Promise<void>;
  __pathOpsReady?: boolean;
};

function g(): G {
  return globalThis as unknown as G;
}

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

function normalizeSnapshot(snap: OpsSnapshot): OpsSnapshot {
  if (!snap.accessRequests) snap.accessRequests = [];
  if (!snap.magicTokens) snap.magicTokens = [];
  if (!snap.toolRuns) snap.toolRuns = [];
  // Ensure demo PSAP is assignment-scoped if old snapshot
  const psapUser = snap.users?.find((u) => u.id === "user_psap_demo");
  if (psapUser && (!psapUser.psapIds || !psapUser.psapIds.length)) {
    psapUser.psapIds = ["psap_roseville"];
  }
  return snap;
}

function seedFresh(): OpsSnapshot {
  const snap = normalizeSnapshot(buildSeedSnapshot());
  seedDemoPaths(snap);
  return snap;
}

/** Await once per process before serving ops APIs. */
export async function ensureOpsStore(): Promise<void> {
  const glob = g();
  if (glob.__pathOpsReady && glob.__pathOpsStore) return;

  if (!glob.__pathOpsLoadPromise) {
    glob.__pathOpsLoadPromise = (async () => {
      if (isMemoryOnlyStore()) {
        if (!glob.__pathOpsStore) glob.__pathOpsStore = seedFresh();
        glob.__pathOpsReady = true;
        return;
      }
      const persisted = await loadPersistedSnapshot();
      if (persisted && Array.isArray(persisted.paths)) {
        glob.__pathOpsStore = normalizeSnapshot(persisted);
      } else {
        glob.__pathOpsStore = seedFresh();
        await savePersistedSnapshot(glob.__pathOpsStore);
      }
      glob.__pathOpsReady = true;
    })();
  }
  await glob.__pathOpsLoadPromise;
}

export function getSnapshot(): OpsSnapshot {
  const glob = g();
  if (!glob.__pathOpsStore) {
    glob.__pathOpsStore = seedFresh();
    glob.__pathOpsReady = isMemoryOnlyStore() ? true : glob.__pathOpsReady;
  }
  return glob.__pathOpsStore;
}

export function persistSoon(): void {
  if (isMemoryOnlyStore()) return;
  const snap = getSnapshot();
  void savePersistedSnapshot(clone(snap));
}

export function mutateSnapshot(fn: (snap: OpsSnapshot) => void): void {
  const snap = getSnapshot();
  fn(snap);
  persistSoon();
}

export function getUserById(id: string): User | undefined {
  const u = getSnapshot().users.find((x) => x.id === id);
  return u ? clone(u) : undefined;
}

export function getUserByEmail(email: string): User | undefined {
  const needle = email.trim().toLowerCase();
  const u = getSnapshot().users.find((x) => x.email.toLowerCase() === needle);
  return u ? clone(u) : undefined;
}

export function resetOpsStore(): void {
  const glob = g();
  glob.__pathOpsStore = seedFresh();
  glob.__pathOpsReady = true;
  glob.__pathOpsLoadPromise = Promise.resolve();
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString();
}

export function createPathFromType(
  snap: OpsSnapshot,
  psapId: string,
  pathType: PathType
): { path: Path; processes: Process[]; tasks: Task[] } {
  const openedAt = nowIso();
  const pathId = newId("path");
  const firstBucket =
    [...pathType.buckets].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.code ??
    "funding_init";

  const path: Path = {
    id: pathId,
    psapId,
    pathTypeId: pathType.id,
    pathTypeCode: pathType.code,
    pathTypeName: pathType.name,
    status: "open",
    currentBucketCode: firstBucket,
    overrideBucketCode: null,
    activeOverrideId: null,
    openedAt,
    version: 1,
  };

  const processes: Process[] = [];
  const tasks: Task[] = [];

  const ordered = [...pathType.processes].sort((a, b) => a.sortOrder - b.sortOrder);
  const firstRequired = ordered.find((p) => p.required) ?? ordered[0];
  for (const pt of ordered) {
    const processId = newId("proc");
    const isFirst = firstRequired ? pt.code === firstRequired.code : false;
    processes.push({
      id: processId,
      pathId,
      templateCode: pt.code,
      name: pt.name,
      sortOrder: pt.sortOrder,
      bucketCode: pt.bucketCode,
      status: isFirst ? "open" : "not_started",
      required: pt.required,
      toolHref: pt.toolHref,
      dueAt: addDays(openedAt, pt.etaDays),
      startedAt: isFirst ? openedAt : undefined,
      version: 1,
    });

    const tpls = pathType.tasksByProcess[pt.code] ?? [];
    for (const tt of tpls) {
      tasks.push({
        id: newId("task"),
        processId,
        templateCode: tt.code,
        label: tt.label,
        sortOrder: tt.sortOrder,
        status: isFirst && tt.sortOrder === 1 ? "open" : "not_started",
      });
    }
  }

  return { path, processes, tasks };
}

function seedDemoPaths(snap: OpsSnapshot): void {
  const cloud = snap.pathTypes.find((p) => p.code.includes("cloud")) ?? snap.pathTypes[0];
  const onprem = snap.pathTypes.find((p) => p.code.includes("onprem"));
  if (!cloud) return;

  for (const psap of snap.psaps) {
    const { path, processes, tasks } = createPathFromType(snap, psap.id, cloud);
    snap.paths.push(path);
    snap.processes.push(...processes);
    snap.tasks.push(...tasks);
    snap.activity.push({
      id: newId("act"),
      pathId: path.id,
      actorUserId: "user_admin_demo",
      actorRole: "admin",
      actorName: "Portal Admin",
      kind: "path.created",
      summary: `Path opened for ${psap.name} (${cloud.name})`,
      createdAt: path.openedAt,
    });
  }

  // Second scenario type for Sample Valley
  if (onprem) {
    const sample = snap.psaps.find((p) => p.id === "psap_sample");
    if (sample) {
      const { path, processes, tasks } = createPathFromType(snap, sample.id, onprem);
      snap.paths.push(path);
      snap.processes.push(...processes);
      snap.tasks.push(...tasks);
      snap.activity.push({
        id: newId("act"),
        pathId: path.id,
        actorUserId: "user_admin_demo",
        actorRole: "admin",
        actorName: "Portal Admin",
        kind: "path.created",
        summary: `Path opened for ${sample.name} (${onprem.name})`,
        createdAt: path.openedAt,
      });
    }
  }
}

export function recordToolRun(input: {
  toolCode: string;
  pathId?: string;
  processId?: string;
  result: unknown;
  status?: string;
  createdByUserId: string;
}): void {
  mutateSnapshot((snap) => {
    if (!snap.toolRuns) snap.toolRuns = [];
    snap.toolRuns.push({
      id: newId("trun"),
      toolCode: input.toolCode,
      pathId: input.pathId,
      processId: input.processId,
      result: input.result,
      status: input.status,
      createdByUserId: input.createdByUserId,
      createdAt: nowIso(),
    });
  });
}

export function listToolRuns(filter?: {
  pathId?: string;
  processId?: string;
}): import("./types").ToolRun[] {
  let rows = clone(getSnapshot().toolRuns ?? []);
  if (filter?.pathId) rows = rows.filter((r) => r.pathId === filter.pathId);
  if (filter?.processId) rows = rows.filter((r) => r.processId === filter.processId);
  return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listUsers(): User[] {
  return clone(getSnapshot().users);
}

export function listPsaps(): Psap[] {
  return clone(getSnapshot().psaps);
}

export function listAssignments(): Assignment[] {
  return clone(getSnapshot().assignments);
}

export function getPathType(idOrCode: string): PathType | undefined {
  const snap = getSnapshot();
  return clone(
    snap.pathTypes.find((p) => p.id === idOrCode || p.code === idOrCode)
  );
}

export function getPath(pathId: string): Path | undefined {
  return clone(getSnapshot().paths.find((p) => p.id === pathId));
}

export function getProcessesForPath(pathId: string): Process[] {
  return clone(
    getSnapshot()
      .processes.filter((p) => p.pathId === pathId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );
}

export function getTasksForPath(pathId: string): Task[] {
  const procIds = new Set(
    getSnapshot().processes.filter((p) => p.pathId === pathId).map((p) => p.id)
  );
  return clone(
    getSnapshot()
      .tasks.filter((t) => procIds.has(t.processId))
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );
}

export function getProcess(processId: string): Process | undefined {
  return clone(getSnapshot().processes.find((p) => p.id === processId));
}

export function getActivityForPath(pathId: string): ActivityEvent[] {
  return clone(
    getSnapshot()
      .activity.filter((a) => a.pathId === pathId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export function getOverride(id: string): Override | undefined {
  return clone(getSnapshot().overrides.find((o) => o.id === id));
}

export function getActiveOverride(pathId: string): Override | undefined {
  const path = getSnapshot().paths.find((p) => p.id === pathId);
  if (!path?.activeOverrideId) return undefined;
  return getOverride(path.activeOverrideId);
}

export function replacePathState(input: {
  path: Path;
  processes: Process[];
  tasks: Task[];
  activity?: ActivityEvent[];
  audit?: AuditEvent[];
  override?: Override;
}): void {
  const snap = getSnapshot();
  const pi = snap.paths.findIndex((p) => p.id === input.path.id);
  if (pi >= 0) snap.paths[pi] = clone(input.path);
  else snap.paths.push(clone(input.path));

  for (const proc of input.processes) {
    const i = snap.processes.findIndex((p) => p.id === proc.id);
    if (i >= 0) snap.processes[i] = clone(proc);
    else snap.processes.push(clone(proc));
  }
  for (const task of input.tasks) {
    const i = snap.tasks.findIndex((t) => t.id === task.id);
    if (i >= 0) snap.tasks[i] = clone(task);
    else snap.tasks.push(clone(task));
  }
  if (input.activity) {
    for (const a of input.activity) snap.activity.push(clone(a));
  }
  if (input.audit) {
    for (const a of input.audit) snap.audit.push(clone(a));
  }
  if (input.override) {
    const i = snap.overrides.findIndex((o) => o.id === input.override!.id);
    if (i >= 0) snap.overrides[i] = clone(input.override);
    else snap.overrides.push(clone(input.override));
  }
  persistSoon();
}

export function listPaths(): Path[] {
  return clone(getSnapshot().paths);
}

export function listAllProcesses(): Process[] {
  return clone(getSnapshot().processes);
}
