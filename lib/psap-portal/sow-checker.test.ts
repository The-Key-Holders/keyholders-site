import { describe, expect, it } from "vitest";
import { scoreSowCompleteness } from "./sow-checker";

const completeBase = {
  equipmentListWithQtyAndPrices: true,
  monthlyMaintenanceCosts: true,
  designNetworkDetails: true,
  integrationsCadRadioLoggingUps: true,
  scheduleTiedToTd288: true,
  trainingPlan: true,
  maintenancePlan: true,
  responsibilitiesDefined: true,
  changeRequestRequiresPsapAndBranch: true,
  signOffs: true,
  siteCertification: true,
  floorPlans: true,
  licensedInstallerC7: true,
  bandwidthIntegrationNotes: true,
  remoteMaintNotes: true,
};

describe("scoreSowCompleteness", () => {
  it("blocks on-prem without floor plans", () => {
    const r = scoreSowCompleteness({
      ...completeBase,
      model: "onprem",
      floorPlans: false,
    });
    expect(r.status).toBe("Blocked");
    expect(r.missingRequired.some((m) => /floor/i.test(m))).toBe(true);
  });

  it("blocks cloud without bandwidth notes", () => {
    const r = scoreSowCompleteness({
      ...completeBase,
      model: "cloud",
      bandwidthIntegrationNotes: false,
    });
    expect(r.status).toBe("Blocked");
    expect(r.missingRequired.some((m) => /bandwidth/i.test(m))).toBe(true);
  });

  it("ready when cloud complete", () => {
    const r = scoreSowCompleteness({ ...completeBase, model: "cloud" });
    expect(r.status).toBe("Ready");
  });
});
