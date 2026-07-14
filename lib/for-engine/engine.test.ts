import { describe, expect, it } from "vitest";
import { assembleForPackage, emptyForPackage, suggestFiveYearEstimate } from "./index";

describe("FOR Engine", () => {
  it("requires core cover fields", () => {
    const result = assembleForPackage(emptyForPackage());
    expect(result.validation.ok).toBe(false);
    expect(result.validation.errors.join(" ")).toMatch(/PSAP name/i);
  });

  it("assembles a complete draft package with ASA substandard warning", () => {
    const pkg = emptyForPackage({
      cover: {
        psapName: "Test City PD",
        forDate: "2026-07-14",
        managerName: "Jane Manager",
        address: "1 Main St",
        phone: "555-0100",
        advisorName: "Advisor Example",
        advisorPhone: "555-0199",
      },
      fiscal: {
        cpeOnlyCost: 100000,
        ongoingOpsCost: 50000,
        fiveYearEstimate: null,
        ataLevel: "Level 2",
        ataBalance: 1200,
        reimbursementsPastFy: 3000,
        foreignLanguageCost: 800,
        misCostNote: "Standard MIS allocation",
        fiscalNotes: "",
      },
      network: {
        totalLines: 12,
        trunks911: 8,
        alternateAnswer: 2,
        alternateAnswerPsap: "County SO",
        notes: "",
      },
      cpe: {
        vendor: "Example Vendor",
        systemType: "Cloud CPE",
        stateFundedPositions: 6,
        mpaContract: "MPA-1",
        td288Tracking: "24669",
        td288ApprovalDate: "2024-01-15",
        systemAcceptance: "2024-06-01",
        maint5yrExpiration: "2029-06-01",
        issues: "Extended maintenance discussion",
      },
      ops: {
        pctAnswered15s: 85,
        monthsSampled: 12,
        avgCallsPerMonth: 4200,
        is24x7: "yes",
        countyCoordinatorName: "Coord Name",
        countyCoordinatorPhone: "555-0111",
        countyCoordinatorEmail: "coord@example.com",
        textTo911: "integrated",
        ttyNotes: "Auto TTY on screen",
        opsNotes: "",
      },
      ng: {
        notes: "",
        pnspConnected: true,
        rnspConnected: true,
        cloudCpeDiscussed: true,
      },
      findings: {
        preMeeting: "Discuss ASA",
        postMeeting: "",
      },
      evidence: emptyForPackage().evidence.map((e) => ({ ...e, present: true })),
    });

    const result = assembleForPackage(pkg);
    expect(result.validation.ok).toBe(true);
    expect(result.validation.warnings.some((w) => /below the 90%/i.test(w))).toBe(true);
    expect(result.package.fiscal.fiveYearEstimate).toBe(suggestFiveYearEstimate(pkg));
    expect(result.markdown).toMatch(/Test City PD/);
    expect(result.markdown).toMatch(/Section IV/);
    expect(result.markdown).toMatch(/substandard/i);
    expect(result.html).toMatch(/<!DOCTYPE html>/i);
    expect(result.sections.length).toBeGreaterThanOrEqual(8);
  });

  it("suggests five-year estimate from ongoing × 5 + cpe", () => {
    const pkg = emptyForPackage({
      fiscal: {
        ...emptyForPackage().fiscal,
        cpeOnlyCost: 100,
        ongoingOpsCost: 10,
        fiveYearEstimate: null,
      },
    });
    expect(suggestFiveYearEstimate(pkg)).toBe(150);
  });
});
