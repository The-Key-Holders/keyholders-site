import { beforeEach, describe, expect, it } from "vitest";
import { computeBucketCode } from "./buckets";
import { demoUserForRole } from "./authz";
import {
  completeProcessForActor,
  getDashboard,
  getPathDetail,
  listPathsForActor,
  overridePathForActor,
  reverseOverrideForActor,
} from "./service";
import { getPathType, getProcessesForPath, resetOpsStore } from "./store";
import { completeProcess, setOverride } from "./transitions";
import { getSnapshot } from "./store";

beforeEach(() => {
  resetOpsStore();
});

describe("computeBucketCode", () => {
  it("starts at funding_init when nothing complete", () => {
    const snap = getSnapshot();
    const path = snap.paths[0];
    const pt = getPathType(path.pathTypeId)!;
    const procs = getProcessesForPath(path.id);
    const { bucketCode, pathComplete } = computeBucketCode(pt, procs);
    expect(bucketCode).toBe("funding_init");
    expect(pathComplete).toBe(false);
  });
});

describe("completeProcess transition", () => {
  it("is idempotent when already completed", () => {
    const snap = getSnapshot();
    const path = snap.paths[0];
    const pt = getPathType(path.pathTypeId)!;
    const procs = getProcessesForPath(path.id);
    const tasks = snap.tasks.filter((t) =>
      procs.some((p) => p.id === t.processId)
    );
    const actor = demoUserForRole("psap");
    const first = procs.find((p) => p.templateCode === "adv_notice")!;
    const r1 = completeProcess(
      { path, pathType: pt, processes: procs, tasks },
      first.id,
      actor
    );
    expect(r1.noop).toBeFalsy();
    const r2 = completeProcess(
      {
        path: r1.path,
        pathType: pt,
        processes: r1.processes,
        tasks: r1.tasks,
      },
      first.id,
      actor
    );
    expect(r2.noop).toBe(true);
  });

  it("advances bucket after adv_notice complete", () => {
    const actor = demoUserForRole("psap");
    const paths = listPathsForActor(actor);
    const pathId = paths[0].id;
    const procs = getProcessesForPath(pathId);
    const adv = procs.find((p) => p.templateCode === "adv_notice")!;
    const res = completeProcessForActor(actor, adv.id);
    expect(res.ok).toBe(true);
    const detail = getPathDetail(actor, pathId)!;
    expect(detail.path.currentBucketCode).toBe("planning");
    expect(detail.path.overrideBucketCode == null || detail.path.overrideBucketCode === null).toBe(
      true
    );
    expect(detail.activity.some((a) => a.kind === "process.complete")).toBe(true);
  });
});

describe("override", () => {
  it("requires reason and pins bucket", () => {
    const actor = demoUserForRole("advisor");
    const pathId = listPathsForActor(actor)[0].id;
    const bad = overridePathForActor(actor, pathId, "package", "short");
    expect(bad.ok).toBe(false);

    const ok = overridePathForActor(
      actor,
      pathId,
      "package",
      "Manual hold pending Branch guidance"
    );
    expect(ok.ok).toBe(true);
    const detail = getPathDetail(actor, pathId)!;
    expect(detail.path.overrideBucketCode).toBe("package");
    expect(detail.activeOverride?.toBucket).toBe("package");
    expect(detail.activity.some((a) => a.kind === "override.set")).toBe(true);
  });

  it("reverse restores computed bucket", () => {
    const actor = demoUserForRole("advisor");
    const pathId = listPathsForActor(actor)[0].id;
    overridePathForActor(
      actor,
      pathId,
      "pay",
      "Temporary jump for demo drill"
    );
    const rev = reverseOverrideForActor(actor, pathId);
    expect(rev.ok).toBe(true);
    const detail = getPathDetail(actor, pathId)!;
    expect(detail.path.overrideBucketCode == null || detail.path.overrideBucketCode === null).toBe(
      true
    );
    expect(detail.path.currentBucketCode).toBe("funding_init");
    expect(detail.activeOverride).toBeNull();
  });

  it("psap cannot override", () => {
    const psap = demoUserForRole("psap");
    const pathId = listPathsForActor(psap)[0].id;
    const r = overridePathForActor(psap, pathId, "planning", "Should not work at all");
    expect(r.ok).toBe(false);
  });
});

describe("dashboard metrics", () => {
  it("counts assigned PSAPs and open paths", () => {
    const advisor = demoUserForRole("advisor");
    const { metrics, buckets } = getDashboard(advisor);
    expect(metrics.totalPsapsAssigned).toBe(3);
    // 3 cloud + 1 on-prem sample
    expect(metrics.pathsOpen).toBe(4);
    expect(metrics.pathsCompleted).toBe(0);
    expect(metrics.pathsNotCompleted).toBe(4);
    expect(
      buckets.some((b) => b.bucketCode === "funding_init" && b.count >= 3)
    ).toBe(true);
  });
});

describe("psap scope", () => {
  it("demo PSAP only sees Roseville paths", () => {
    const psap = demoUserForRole("psap");
    const paths = listPathsForActor(psap);
    expect(paths.length).toBe(1);
    expect(paths[0].psapName).toMatch(/Roseville/i);
  });
});

describe("pure setOverride", () => {
  it("writes audit with reason", () => {
    const snap = getSnapshot();
    const path = snap.paths[0];
    const pt = getPathType(path.pathTypeId)!;
    const r = setOverride(
      {
        path,
        pathType: pt,
        processes: getProcessesForPath(path.id),
        tasks: snap.tasks.filter((t) =>
          getProcessesForPath(path.id).some((p) => p.id === t.processId)
        ),
      },
      "planning",
      "Need to re-open SOW review window",
      demoUserForRole("advisor")
    );
    expect(r.override?.reason).toMatch(/SOW/);
    expect(r.audit[0].action).toBe("override.set");
  });
});
