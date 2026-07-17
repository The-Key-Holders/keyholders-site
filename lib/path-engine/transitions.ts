import { computeBucketCode, isProcessDone } from "./buckets";
import { newId, nowIso } from "./id";
import type {
  ActivityEvent,
  Actor,
  AuditEvent,
  Override,
  Path,
  PathType,
  Process,
  Task,
} from "./types";

export type TransitionDb = {
  path: Path;
  pathType: PathType;
  processes: Process[];
  tasks: Task[];
};

export type TransitionResult = {
  path: Path;
  processes: Process[];
  tasks: Task[];
  activity: ActivityEvent[];
  audit: AuditEvent[];
  override?: Override;
  noop?: boolean;
};

function audit(
  actor: Actor,
  action: string,
  entityType: string,
  entityId: string,
  before: unknown,
  after: unknown,
  reason?: string
): AuditEvent {
  return {
    id: newId("aud"),
    actorUserId: actor.userId,
    actorRole: actor.role,
    action,
    entityType,
    entityId,
    before,
    after,
    reason,
    createdAt: nowIso(),
  };
}

function activity(
  actor: Actor,
  pathId: string,
  kind: string,
  summary: string,
  processId?: string
): ActivityEvent {
  return {
    id: newId("act"),
    pathId,
    processId,
    actorUserId: actor.userId,
    actorRole: actor.role,
    actorName: actor.displayName,
    kind,
    summary,
    createdAt: nowIso(),
  };
}

function applyBucket(
  path: Path,
  pathType: PathType,
  processes: Process[]
): Path {
  if (path.overrideBucketCode) {
    return { ...path, version: path.version + 1 };
  }
  const { bucketCode, pathComplete } = computeBucketCode(pathType, processes);
  return {
    ...path,
    currentBucketCode: bucketCode,
    status: pathComplete ? "completed" : "open",
    closedAt: pathComplete ? nowIso() : undefined,
    version: path.version + 1,
  };
}

/** Complete a process (idempotent if already completed). */
export function completeProcess(
  db: TransitionDb,
  processId: string,
  actor: Actor
): TransitionResult {
  const proc = db.processes.find((p) => p.id === processId);
  if (!proc || proc.pathId !== db.path.id) {
    throw new Error("Process not found on path");
  }

  if (isProcessDone(proc.status)) {
    return {
      path: db.path,
      processes: db.processes,
      tasks: db.tasks,
      activity: [],
      audit: [],
      noop: true,
    };
  }

  const before = { ...proc };
  const ts = nowIso();
  const processes = db.processes.map((p) =>
    p.id === processId
      ? {
          ...p,
          status: "completed" as const,
          completedAt: ts,
          completedByUserId: actor.userId,
          startedAt: p.startedAt ?? ts,
          version: p.version + 1,
        }
      : p
  );

  const tasks = db.tasks.map((t) =>
    t.processId === processId && t.status !== "completed" && t.status !== "waived"
      ? {
          ...t,
          status: "completed" as const,
          completedAt: ts,
          completedByUserId: actor.userId,
        }
      : t
  );

  const path = applyBucket(db.path, db.pathType, processes);
  const after = processes.find((p) => p.id === processId)!;

  return {
    path,
    processes,
    tasks,
    activity: [
      activity(
        actor,
        db.path.id,
        "process.complete",
        `${actor.displayName} completed “${proc.name}”`,
        processId
      ),
    ],
    audit: [
      audit(actor, "process.complete", "process", processId, before, after),
      audit(
        actor,
        "path.bucket",
        "path",
        db.path.id,
        { bucket: db.path.currentBucketCode, status: db.path.status },
        { bucket: path.currentBucketCode, status: path.status }
      ),
    ],
  };
}

/** Advisor override: pin path to a target bucket. */
export function setOverride(
  db: TransitionDb,
  toBucketCode: string,
  reason: string,
  actor: Actor
): TransitionResult {
  if (actor.role !== "advisor" && actor.role !== "admin") {
    throw new Error("Only advisor or admin can override");
  }
  const trimmed = reason.trim();
  if (trimmed.length < 8) {
    throw new Error("Override reason must be at least 8 characters");
  }
  const bucket = db.pathType.buckets.find((b) => b.code === toBucketCode);
  if (!bucket) {
    throw new Error(`Unknown bucket: ${toBucketCode}`);
  }

  const fromBucket = db.path.overrideBucketCode ?? db.path.currentBucketCode;
  const ov: Override = {
    id: newId("ovr"),
    pathId: db.path.id,
    fromBucket,
    toBucket: toBucketCode,
    reason: trimmed,
    actorUserId: actor.userId,
    actorName: actor.displayName,
    createdAt: nowIso(),
  };

  const before = { ...db.path };
  // Also recompute base currentBucket from processes (for when override reverses)
  const computed = computeBucketCode(db.pathType, db.processes);
  const path: Path = {
    ...db.path,
    currentBucketCode: computed.bucketCode,
    overrideBucketCode: toBucketCode,
    activeOverrideId: ov.id,
    status: toBucketCode === "complete" ? "completed" : "open",
    closedAt: toBucketCode === "complete" ? nowIso() : undefined,
    version: db.path.version + 1,
  };

  return {
    path,
    processes: db.processes,
    tasks: db.tasks,
    override: ov,
    activity: [
      activity(
        actor,
        db.path.id,
        "override.set",
        `${actor.displayName} overrode path to “${bucket.label}”: ${trimmed}`
      ),
    ],
    audit: [
      audit(actor, "override.set", "path", db.path.id, before, path, trimmed),
    ],
  };
}

/** Reverse active override; recompute bucket from processes. */
export function reverseOverride(
  db: TransitionDb,
  override: Override,
  actor: Actor
): TransitionResult & { override: Override } {
  if (actor.role !== "advisor" && actor.role !== "admin") {
    throw new Error("Only advisor or admin can reverse override");
  }
  if (override.reversedAt) {
    return {
      path: db.path,
      processes: db.processes,
      tasks: db.tasks,
      activity: [],
      audit: [],
      override,
      noop: true,
    };
  }

  const reversed: Override = {
    ...override,
    reversedAt: nowIso(),
    reversedByUserId: actor.userId,
  };

  const computed = computeBucketCode(db.pathType, db.processes);
  const before = { ...db.path };
  const path: Path = {
    ...db.path,
    overrideBucketCode: null,
    activeOverrideId: null,
    currentBucketCode: computed.bucketCode,
    status: computed.pathComplete ? "completed" : "open",
    closedAt: computed.pathComplete ? nowIso() : undefined,
    version: db.path.version + 1,
  };

  return {
    path,
    processes: db.processes,
    tasks: db.tasks,
    override: reversed,
    activity: [
      activity(
        actor,
        db.path.id,
        "override.reverse",
        `${actor.displayName} reversed override; bucket is now “${computed.bucketCode}”`
      ),
    ],
    audit: [
      audit(actor, "override.reverse", "path", db.path.id, before, path),
    ],
  };
}
