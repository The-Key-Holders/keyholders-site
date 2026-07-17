import type { BucketDef, Path, PathType, Process, ProcessStatus } from "./types";

const DONE: ProcessStatus[] = ["completed", "waived"];

export function isProcessDone(status: ProcessStatus): boolean {
  return DONE.includes(status);
}

/** Compute current bucket from process completion (ignores override pin). */
export function computeBucketCode(
  pathType: PathType,
  processes: Process[]
): { bucketCode: string; pathComplete: boolean } {
  const byCode = new Map(processes.map((p) => [p.templateCode, p]));
  const ordered = [...pathType.buckets].sort((a, b) => a.sortOrder - b.sortOrder);

  for (const bucket of ordered) {
    if (bucket.code === "complete" || bucket.requiredProcessCodes.length === 0) {
      continue;
    }
    const allDone = bucket.requiredProcessCodes.every((code) => {
      const p = byCode.get(code);
      return p ? isProcessDone(p.status) : false;
    });
    if (!allDone) {
      return { bucketCode: bucket.code, pathComplete: false };
    }
  }

  const terminal = ordered.find((b) => b.code === "complete") ?? ordered[ordered.length - 1];
  return { bucketCode: terminal.code, pathComplete: true };
}

export function effectiveBucketCode(path: Path): string {
  if (path.overrideBucketCode) return path.overrideBucketCode;
  return path.currentBucketCode;
}

export function bucketLabel(buckets: BucketDef[], code: string): string {
  return buckets.find((b) => b.code === code)?.label ?? code;
}
