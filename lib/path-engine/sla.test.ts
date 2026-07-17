import { describe, expect, it } from "vitest";
import { bandForDays, bucketSla, daysBetween, processSla } from "./sla";

describe("sla rules", () => {
  it("bands calendar days", () => {
    expect(bandForDays(1, 7, 12)).toBe("ok");
    expect(bandForDays(7, 7, 12)).toBe("watch");
    expect(bandForDays(12, 7, 12)).toBe("breach");
  });

  it("adv_notice uses ~10d target", () => {
    const started = new Date();
    started.setUTCDate(started.getUTCDate() - 11);
    const r = processSla("adv_notice", started.toISOString(), "open");
    expect(r?.band).toBe("breach");
    expect(r?.targetDays).toBe(10);
  });

  it("bucket funding_init watch at 7d", () => {
    const entered = new Date();
    entered.setUTCDate(entered.getUTCDate() - 8);
    const r = bucketSla("funding_init", entered.toISOString());
    expect(r.band).toBe("watch");
    expect(r.daysInBucket).toBeGreaterThanOrEqual(8);
  });

  it("daysBetween non-negative", () => {
    expect(daysBetween(new Date().toISOString())).toBe(0);
  });
});
