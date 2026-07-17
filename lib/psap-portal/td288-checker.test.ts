import { describe, expect, it } from "vitest";
import { scoreTd288Package } from "./td288-checker";

describe("scoreTd288Package", () => {
  it("blocks when required items missing", () => {
    const r = scoreTd288Package({
      advanceNotification: false,
      allotmentLetter: false,
      authorizedVendorQuote: false,
      sowComplete: false,
      tde285IfResiduals: false,
      residualsPlanned: false,
      modelSelected: false,
      networkImpactAck: false,
      facilityReadiness: false,
      residualListOnly: false,
    });
    expect(r.status).toBe("Blocked");
    expect(r.missingRequired.length).toBeGreaterThan(0);
  });

  it("ready when all required complete", () => {
    const r = scoreTd288Package({
      advanceNotification: true,
      allotmentLetter: true,
      authorizedVendorQuote: true,
      sowComplete: true,
      tde285IfResiduals: false,
      residualsPlanned: false,
      modelSelected: true,
      networkImpactAck: true,
      facilityReadiness: true,
      residualListOnly: false,
    });
    expect(r.status).toBe("Ready");
    expect(r.missingRequired).toEqual([]);
  });

  it("requires TDe-285 when residuals planned", () => {
    const r = scoreTd288Package({
      advanceNotification: true,
      allotmentLetter: true,
      authorizedVendorQuote: true,
      sowComplete: true,
      tde285IfResiduals: false,
      residualsPlanned: true,
      modelSelected: true,
      networkImpactAck: true,
      facilityReadiness: true,
      residualListOnly: true,
    });
    expect(r.status).toBe("Blocked");
    expect(r.missingRequired.some((m) => /TDe-285/i.test(m))).toBe(true);
  });
});
