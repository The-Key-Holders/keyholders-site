import { bucketLabel, effectiveBucketCode, isProcessDone } from "./buckets";
import { canAccessPsap } from "./authz";
import {
  getPath,
  getPathType,
  getProcessesForPath,
  listPaths,
  listPsaps,
} from "./store";
import type { Actor, PathfinderResult, PathfinderStep } from "./types";

export function buildPathfinder(
  actor: Actor,
  pathId?: string
): PathfinderResult | null {
  const paths = listPaths().filter((p) => canAccessPsap(actor, p.psapId));
  if (!paths.length) return null;

  const path = pathId
    ? paths.find((p) => p.id === pathId) ?? null
    : paths.find((p) => p.status === "open") ?? paths[0];
  if (!path) return null;
  if (!canAccessPsap(actor, path.psapId)) return null;

  const full = getPath(path.id);
  if (!full) return null;
  const pt = getPathType(full.pathTypeId);
  if (!pt) return null;
  const psap = listPsaps().find((p) => p.id === full.psapId);
  const processes = getProcessesForPath(full.id);
  const bucket = effectiveBucketCode(full);

  let nextFound = false;
  const steps: PathfinderStep[] = [...pt.processes]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((tpl) => {
      const proc = processes.find((p) => p.templateCode === tpl.code);
      const status = proc?.status ?? "n/a";
      const done = proc ? isProcessDone(proc.status) : false;
      const isNext =
        !done &&
        !nextFound &&
        (tpl.required || status === "open" || status === "not_started");
      if (isNext) nextFound = true;
      return {
        processCode: tpl.code,
        processId: proc?.id,
        name: tpl.name,
        status: status as PathfinderStep["status"],
        bucketCode: tpl.bucketCode,
        toolHref: tpl.toolHref
          ? `${tpl.toolHref}?pathId=${full.id}${proc ? `&processId=${proc.id}` : ""}`
          : undefined,
        isCurrent: tpl.bucketCode === bucket && !done,
        isNextAction: isNext,
      };
    });

  // Prefer first incomplete required process as next
  const nextRequired = steps.find(
    (s) =>
      s.isNextAction ||
      (s.status !== "completed" &&
        s.status !== "waived" &&
        pt.processes.find((p) => p.code === s.processCode)?.required)
  );
  const nextAction =
    steps.find((s) => s.isNextAction) ??
    nextRequired ??
    null;

  const tips: string[] = [];
  if (full.overrideBucketCode) {
    tips.push("An Advisor override is pinning your bucket — check activity for reason.");
  }
  if (nextAction?.toolHref) {
    tips.push(`Use the linked tool for “${nextAction.name}”, then mark the process complete.`);
  }
  if (full.status === "completed") {
    tips.push("This path is complete. Start a residual or maintenance process with your Advisor if needed.");
  }

  return {
    pathId: full.id,
    psapName: psap?.name ?? full.psapId,
    pathTypeName: full.pathTypeName,
    effectiveBucket: bucket,
    bucketLabel: bucketLabel(pt.buckets, bucket),
    pathStatus: full.status,
    nextAction: nextAction?.isNextAction || nextAction ? nextAction : null,
    steps,
    tips,
  };
}

export function listPathfinderOptions(actor: Actor): Array<{
  pathId: string;
  label: string;
}> {
  return listPaths()
    .filter((p) => canAccessPsap(actor, p.psapId))
    .map((p) => {
      const psap = listPsaps().find((x) => x.id === p.psapId);
      return {
        pathId: p.id,
        label: `${psap?.name ?? p.psapId} · ${p.pathTypeName} · ${p.status}`,
      };
    });
}
