import { describe, expect, it } from "vitest";
import { scoreInvoiceReadiness } from "./invoice-checker";

describe("scoreInvoiceReadiness", () => {
  it("blocks without TD-288 tracking number", () => {
    const r = scoreInvoiceReadiness({
      td288TrackingNumber: false,
      oneTimeChargesBrokenOut: true,
      monthlyMaintAmount: true,
      monthlyMaintTermDates: true,
      systemAcceptanceDate: true,
      countyCode: true,
      psapNumber: true,
      serviceNumber: true,
      vendorAbbreviation: true,
      invoiceTotal: 100,
      approvedTd288Total: 200,
    });
    expect(r.status).toBe("Blocked");
  });

  it("blocks when invoice exceeds approved TD-288", () => {
    const r = scoreInvoiceReadiness({
      td288TrackingNumber: true,
      oneTimeChargesBrokenOut: true,
      monthlyMaintAmount: true,
      monthlyMaintTermDates: true,
      systemAcceptanceDate: true,
      countyCode: true,
      psapNumber: true,
      serviceNumber: true,
      vendorAbbreviation: true,
      invoiceTotal: 5000,
      approvedTd288Total: 1000,
    });
    expect(r.status).toBe("Blocked");
    expect(r.missingRequired.some((m) => /exceeds/i.test(m))).toBe(true);
  });
});
