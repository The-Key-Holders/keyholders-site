import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  compare_all,
  estimate,
  load_catalog,
  suggest_positions,
  VENDORS,
  _r,
  type Result,
} from "./estimate";

const cat = load_catalog();
const line = (r: Result, k: string) => r.lines.find((l) => l.key === k)!.amount;

describe("CPE Fit engine goldens (Vault Advisor TS port)", () => {
  it("keeps catalog under lib/cpe-fit, not public/", () => {
    expect(existsSync(path.join(process.cwd(), "lib/cpe-fit/catalog.json"))).toBe(true);
    expect(existsSync(path.join(process.cwd(), "public/catalog.json"))).toBe(false);
    expect(existsSync(path.join(process.cwd(), "public/cpe-fit/catalog.json"))).toBe(false);
    expect(existsSync(path.join(process.cwd(), "public/data/catalog.json"))).toBe(false);
  });

  it("SOS 5pos 5yr golden 532576.95", () => {
    expect(estimate({ vendor: "4", positions: 5, years: 5 }, cat).true_cost).toBeCloseTo(532576.95, 2);
  });

  it("SOS GIS 5yr 161148", () => {
    expect(line(estimate({ vendor: "4", gis: true }, cat), "addon_GIS")).toBeCloseTo(161148, 2);
  });

  it("SOS GIS 3yr 131484", () => {
    expect(line(estimate({ vendor: "4", years: 3, gis: true }, cat), "addon_GIS")).toBeCloseTo(131484, 2);
  });

  it("Comtech GIS uses Comtech dollars", () => {
    const gl = line(estimate({ vendor: "1", gis: true }, cat), "addon_GIS");
    const a = cat["1"].addons.GIS;
    expect(gl).toBeCloseTo((a[0] + a[1] + a[2] * 60) * 5, 1);
    expect(Math.abs(gl - 32229.6 * 5)).toBeGreaterThan(0.01);
  });

  it("CST Cloud NOT OFFERED + base 507902.00 (workbook 507901.80)", () => {
    const r = estimate({ vendor: "3", gis: true, logger: "64" }, cat);
    expect(line(r, "addon_GIS")).toBe(0);
    expect(line(r, "addon_LOG64")).toBe(0);
    expect(r.flags).toContain("GIS NOT OFFERED BY VENDOR");
    expect(r.flags).toContain("LOG64 NOT OFFERED BY VENDOR");
    expect(r.true_cost).toBeCloseTo(507902.0, 1);
    expect(r.true_cost).toBeCloseTo(507901.8, 0);
    expect(r.price_missing).toBe(false);
  });

  it.each([4, 15])("Comtech %i pos priced", (pos) => {
    expect(estimate({ vendor: "1", positions: pos }, cat).price_missing).toBe(false);
  });

  it.each([
    ["SA", false, 830106],
    ["HR", true, 1344319],
    ["HR", false, 660819],
  ] as const)("Vesta OP 15 %s host=%s ≈ %s", (mode, host, exp) => {
    expect(
      estimate({ vendor: "7", positions: 15, onprem_mode: mode, include_host: host }, cat).true_cost
    ).toBeCloseTo(exp, 0);
  });

  it("cloud ignores host", () => {
    expect(estimate({ vendor: "4", onprem_mode: "HR", include_host: true }, cat).true_cost).toBe(
      estimate({ vendor: "4" }, cat).true_cost
    );
  });

  it("discount 10 = base maint only", () => {
    const b = estimate({ vendor: "4", gis: true }, cat);
    const d = estimate({ vendor: "4", gis: true, discount_pct: 10 }, cat);
    expect(line(d, "maint")).toBeCloseTo(line(b, "maint") * 0.9, 1);
    expect(line(d, "addon_GIS")).toBe(line(b, "addon_GIS"));
    expect(line(d, "maint")).toBeGreaterThan(0);
  });

  it("blank allotment", () => {
    const r = estimate({ vendor: "4" }, cat);
    expect(r.status).toBe("ALLOTMENT NOT ENTERED");
    expect(r.net_allotment).toBeNull();
    expect(r.over_under).toBeNull();
  });

  it("allotment math", () => {
    const r = estimate({ vendor: "4", allotment: 600000, prior_used: 50000 }, cat);
    expect(r.net_allotment).toBe(550000);
    expect(r.over_under!).toBeCloseTo(532576.95 - 550000, 1);
    expect(r.status).toBe("FITS ALLOTMENT");
    const r2 = estimate({ vendor: "4", allotment: 500000 }, cat);
    expect(r2.status).toBe("OVER ALLOTMENT");
    expect(r2.over_under!).toBeGreaterThan(0);
  });

  it("price missing (25 pos)", () => {
    const r = estimate({ vendor: "4", positions: 25 }, cat);
    expect(r.price_missing).toBe(true);
    expect(r.status).toBe("PRICE MISSING");
  });

  it("qty rules", () => {
    const a = cat["4"].addons;
    const r = estimate({ vendor: "4", displays: 3, ip_phones: 4, net_clock: true, api_tier: "2" }, cat);
    expect(line(r, "addon_DISP")).toBeCloseTo((a.DISP[0] + a.DISP[1] + a.DISP[2] * 60) * 3, 5);
    expect(line(r, "addon_IPPH")).toBeCloseTo(2400, 5);
    expect(line(r, "addon_API2")).toBe(30000);
  });

  it("passthroughs", () => {
    expect(estimate({ vendor: "4", other_onetime: 1000, contingency: 500 }, cat).true_cost).toBeCloseTo(
      534076.95,
      1
    );
  });

  it("CST $0 equipment not price missing", () => {
    for (const v of ["2", "3"]) {
      expect(estimate({ vendor: v }, cat).price_missing).toBe(false);
    }
  });

  it("every vendor/position/mode priced", () => {
    for (const [v, [, , kind]] of Object.entries(VENDORS)) {
      for (let p = 2; p <= 20; p++) {
        const modes = kind === "cloud" ? (["SA"] as const) : (["SA", "HR"] as const);
        for (const m of modes) {
          expect(
            estimate({ vendor: v, positions: p, onprem_mode: m }, cat).price_missing,
            `${v}/${p}/${m}`
          ).toBe(false);
        }
      }
    }
  });

  it("compare_all 12 sorted", () => {
    const rows = compare_all({ positions: 5, allotment: 600000 }, cat);
    expect(rows).toHaveLength(12);
    expect(new Set(rows.map((r) => r.vendor))).toEqual(new Set(Object.keys(VENDORS)));
    for (let k = 1; k < rows.length; k++) {
      expect(
        rows[k - 1].true_cost <= rows[k].true_cost ||
          Number(rows[k - 1].price_missing) < Number(rows[k].price_missing)
      ).toBe(true);
    }
  });

  it("suggest_positions", () => {
    expect(suggest_positions([3000, 2800, 2600], [400, 300, 200]).positions).toBe(3);
    expect(suggest_positions([2000, 2000, 2000], [0, 0, 0]).positions).toBe(2);
    expect(suggest_positions([30000, 30000, 30000], [0, 0, 0]).clamped).toBe(20);
    expect(() => suggest_positions([1, 2], [1, 2])).toThrow(/exactly three months/);
  });

  it("_r matches Python round(x,2) incl. half-even ties", () => {
    expect(_r(0.125)).toBe(0.12);
    expect(_r(0.375)).toBe(0.38);
    expect(_r(2.675)).toBe(2.67);
    expect(_r(-0.125)).toBe(-0.12);
    expect(_r(-0.001)).toBe(0);
  });
});
