import type { CheckResult } from "./types";

export type InvoiceCheckerInput = {
  td288TrackingNumber: boolean;
  oneTimeChargesBrokenOut: boolean; // equipment, labor, others, taxes
  monthlyMaintAmount: boolean;
  monthlyMaintTermDates: boolean;
  systemAcceptanceDate: boolean;
  countyCode: boolean;
  psapNumber: boolean;
  serviceNumber: boolean;
  vendorAbbreviation: boolean;
  invoiceTotal: number | null;
  approvedTd288Total: number | null;
};

export function scoreInvoiceReadiness(input: InvoiceCheckerInput): CheckResult {
  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];
  const notes: string[] = [
    "Invoice format follows Attachment 14/15 CPE Service Invoice instructions (RFP 26-16743 package).",
    "Direct invoices typically route to CA911Invoicing@caloes.ca.gov — confirm current Branch instructions.",
  ];

  if (!input.td288TrackingNumber) {
    missingRequired.push("Contract / Tracking No. referencing TDe-288 (mandatory)");
  }
  if (!input.oneTimeChargesBrokenOut) {
    missingRequired.push("One-time charges broken out (Equipment, Labor, Others, Taxes/Surcharges)");
  }
  if (!input.monthlyMaintAmount) {
    missingRequired.push("Monthly maintenance amount");
  }
  if (!input.monthlyMaintTermDates) {
    missingRequired.push("Monthly maintenance effective-to-expired dates");
  }
  if (!input.systemAcceptanceDate) {
    missingRequired.push("System Acceptance Date");
  }
  if (!input.countyCode) missingRequired.push("County Code");
  if (!input.psapNumber) missingRequired.push("PSAP Number");
  if (!input.serviceNumber) missingRecommended.push("Service Number");
  if (!input.vendorAbbreviation) missingRecommended.push("Vendor Abbreviation");

  if (
    input.invoiceTotal != null &&
    input.approvedTd288Total != null &&
    Number.isFinite(input.invoiceTotal) &&
    Number.isFinite(input.approvedTd288Total)
  ) {
    if (input.invoiceTotal > input.approvedTd288Total + 0.009) {
      missingRequired.push(
        `Invoice total ($${input.invoiceTotal.toFixed(2)}) exceeds approved TD-288 total ($${input.approvedTd288Total.toFixed(2)})`
      );
    }
  } else {
    missingRecommended.push("Enter invoice total and approved TD-288 total to verify amount cap");
  }

  let status: CheckResult["status"] = "Ready";
  if (missingRequired.length) status = "Blocked";
  else if (missingRecommended.length) status = "Needs work";

  if (status !== "Ready") {
    notes.push("Do not submit the invoice until required fields are complete — incomplete invoices delay payment.");
  }

  return { status, missingRequired, missingRecommended, notes };
}
