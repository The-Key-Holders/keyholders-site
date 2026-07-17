import type { CheckResult } from "./types";

export type CpeModel = "cloud" | "onprem";

export type SowCheckerInput = {
  model: CpeModel;
  equipmentListWithQtyAndPrices: boolean;
  monthlyMaintenanceCosts: boolean;
  designNetworkDetails: boolean;
  integrationsCadRadioLoggingUps: boolean;
  scheduleTiedToTd288: boolean;
  trainingPlan: boolean;
  maintenancePlan: boolean;
  responsibilitiesDefined: boolean;
  changeRequestRequiresPsapAndBranch: boolean;
  signOffs: boolean;
  // on-prem emphasized
  siteCertification: boolean;
  floorPlans: boolean;
  licensedInstallerC7: boolean;
  // cloud emphasized
  bandwidthIntegrationNotes: boolean;
  remoteMaintNotes: boolean;
};

export function scoreSowCompleteness(input: SowCheckerInput): CheckResult {
  const missingRequired: string[] = [];
  const missingRecommended: string[] = [];
  const notes: string[] = [
    "Based on Attachment 16 Sample SOW structure (RFP 26-16743). Confirm live template after award.",
    "Change requests require approval from both the PSAP and the CA 9-1-1 Branch.",
  ];

  const req: Array<[boolean, string]> = [
    [input.equipmentListWithQtyAndPrices, "Equipment list with quantities and hardware prices"],
    [input.monthlyMaintenanceCosts, "Monthly maintenance costs identified"],
    [input.designNetworkDetails, "Design / network details (NG circuits, gateways, etc.)"],
    [input.integrationsCadRadioLoggingUps, "Integrations (CAD / radio / logging / UPS / time sync as applicable)"],
    [input.scheduleTiedToTd288, "Installation schedule tied to Branch funding approval / TD-288"],
    [input.trainingPlan, "Training plan"],
    [input.maintenancePlan, "Maintenance plan"],
    [input.responsibilitiesDefined, "Responsibilities (PSAP / Contractor / Branch)"],
    [input.changeRequestRequiresPsapAndBranch, "Change-request clause (PSAP + Branch approval)"],
    [input.signOffs, "Sign-offs present"],
  ];

  for (const [ok, label] of req) {
    if (!ok) missingRequired.push(label);
  }

  if (input.model === "onprem") {
    if (!input.siteCertification) missingRequired.push("Site certification appendix (on-prem)");
    if (!input.floorPlans) missingRequired.push("Floor plans appendix (on-prem)");
    if (!input.licensedInstallerC7) {
      missingRecommended.push("Licensed installation contractor notes (C-7 where applicable)");
    }
  } else {
    if (!input.bandwidthIntegrationNotes) {
      missingRequired.push("Bandwidth / data-center / integration notes (cloud)");
    }
    if (!input.remoteMaintNotes) {
      missingRecommended.push("Remote maintenance / support model notes (cloud)");
    }
  }

  notes.push(
    input.model === "cloud"
      ? "Cloud SOWs emphasize connectivity, MRC, and remote support — not dual cloud+on-prem cores at one PSAP."
      : "On-prem SOWs emphasize physical site readiness, install licensing, and appendices."
  );

  let status: CheckResult["status"] = "Ready";
  if (missingRequired.length) status = "Blocked";
  else if (missingRecommended.length) status = "Needs work";
  return { status, missingRequired, missingRecommended, notes };
}
