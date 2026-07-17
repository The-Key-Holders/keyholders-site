import type { CheckResult } from "./types";

export type Td288PackageInput = {
  advanceNotification: boolean;
  allotmentLetter: boolean;
  authorizedVendorQuote: boolean;
  sowComplete: boolean;
  tde285IfResiduals: boolean;
  residualsPlanned: boolean;
  modelSelected: boolean; // cloud or on-prem chosen
  networkImpactAck: boolean;
  facilityReadiness: boolean;
  residualListOnly: boolean;
};

export function scoreTd288Package(input: Td288PackageInput): CheckResult {
  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];
  const notes: string[] = [];

  if (!input.advanceNotification) {
    missingRequired.push("Advance Notification for CPE Funding on file");
  }
  if (!input.allotmentLetter) {
    missingRequired.push("Fixed Allotment / pre-authorization letter");
  }
  if (!input.authorizedVendorQuote) {
    missingRequired.push("Quote from authorized active-MPA contractor");
  }
  if (!input.sowComplete) {
    missingRequired.push("SOW complete (use Attachment 16 structure + SOW checker)");
  }
  if (!input.modelSelected) {
    missingRequired.push("Cloud vs On-Prem model selected (not both at one PSAP)");
  }
  if (input.residualsPlanned && !input.tde285IfResiduals) {
    missingRequired.push("TDe-285 spending plan covering residual items");
  }
  if (input.residualsPlanned && !input.residualListOnly) {
    missingRequired.push("Residual items limited to current approved list");
  }

  if (!input.networkImpactAck) {
    missingRecommended.push("Network / NG impact acknowledged with provider coordination plan");
  }
  if (!input.facilityReadiness) {
    missingRecommended.push("Site survey / facility readiness documented");
  }

  notes.push(
    "TD-288 is issued by the Branch after a complete package — this checker is decision support only."
  );
  if (input.residualsPlanned) {
    notes.push("Plan residual quotes within policy window (commonly 90 days after TD-284).");
  }

  let status: CheckResult["status"] = "Ready";
  if (missingRequired.length) status = "Blocked";
  else if (missingRecommended.length) status = "Needs work";

  return { status, missingRequired, missingRecommended, notes };
}
