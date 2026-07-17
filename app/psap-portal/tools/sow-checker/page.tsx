"use client";

import CheckboxField from "@/components/psap-portal/CheckboxField";
import StatusBanner from "@/components/psap-portal/StatusBanner";
import {
  scoreSowCompleteness,
  type CpeModel,
  type SowCheckerInput,
} from "@/lib/psap-portal/sow-checker";
import { portal } from "@/lib/psap-portal/ui";
import { useMemo, useState } from "react";

function base(model: CpeModel): SowCheckerInput {
  return {
    model,
    equipmentListWithQtyAndPrices: false,
    monthlyMaintenanceCosts: false,
    designNetworkDetails: false,
    integrationsCadRadioLoggingUps: false,
    scheduleTiedToTd288: false,
    trainingPlan: false,
    maintenancePlan: false,
    responsibilitiesDefined: false,
    changeRequestRequiresPsapAndBranch: false,
    signOffs: false,
    siteCertification: false,
    floorPlans: false,
    licensedInstallerC7: false,
    bandwidthIntegrationNotes: false,
    remoteMaintNotes: false,
  };
}

export default function SowCheckerPage() {
  const [form, setForm] = useState<SowCheckerInput>(base("cloud"));
  const result = useMemo(() => scoreSowCompleteness(form), [form]);
  const set = (k: keyof SowCheckerInput) => (v: boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="pb-10">
      <h1 className={portal.h1}>SOW completeness checker</h1>
      <p className={portal.lead}>
        Attachment 16 structure for RFP 26-16743 engagements. Model-aware requirements reduce
        Advisor bounce-backs before TD-288.
      </p>
      <div className="mt-6 flex gap-2">
        {(["cloud", "onprem"] as CpeModel[]).map((m) => (
          <button
            key={m}
            type="button"
            className={form.model === m ? portal.btnPrimary : portal.btnSecondary}
            onClick={() => setForm((f) => ({ ...f, model: m }))}
          >
            {m === "cloud" ? "Cloud" : "On-Prem"}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-2">
          <CheckboxField checked={form.equipmentListWithQtyAndPrices} onChange={set("equipmentListWithQtyAndPrices")} label="Equipment list with qty + hardware prices" />
          <CheckboxField checked={form.monthlyMaintenanceCosts} onChange={set("monthlyMaintenanceCosts")} label="Monthly maintenance costs" />
          <CheckboxField checked={form.designNetworkDetails} onChange={set("designNetworkDetails")} label="Design / network details" />
          <CheckboxField checked={form.integrationsCadRadioLoggingUps} onChange={set("integrationsCadRadioLoggingUps")} label="CAD / radio / logging / UPS / time sync integrations" />
          <CheckboxField checked={form.scheduleTiedToTd288} onChange={set("scheduleTiedToTd288")} label="Schedule tied to funding approval / TD-288" />
          <CheckboxField checked={form.trainingPlan} onChange={set("trainingPlan")} label="Training plan" />
          <CheckboxField checked={form.maintenancePlan} onChange={set("maintenancePlan")} label="Maintenance plan" />
          <CheckboxField checked={form.responsibilitiesDefined} onChange={set("responsibilitiesDefined")} label="Responsibilities (PSAP / Contractor / Branch)" />
          <CheckboxField checked={form.changeRequestRequiresPsapAndBranch} onChange={set("changeRequestRequiresPsapAndBranch")} label="Change requests require PSAP + Branch" />
          <CheckboxField checked={form.signOffs} onChange={set("signOffs")} label="Sign-offs present" />
          {form.model === "onprem" ? (
            <>
              <CheckboxField checked={form.siteCertification} onChange={set("siteCertification")} label="Site certification appendix" />
              <CheckboxField checked={form.floorPlans} onChange={set("floorPlans")} label="Floor plans appendix" />
              <CheckboxField checked={form.licensedInstallerC7} onChange={set("licensedInstallerC7")} label="Licensed install notes (C-7 as applicable)" />
            </>
          ) : (
            <>
              <CheckboxField checked={form.bandwidthIntegrationNotes} onChange={set("bandwidthIntegrationNotes")} label="Bandwidth / data-center integration notes" />
              <CheckboxField checked={form.remoteMaintNotes} onChange={set("remoteMaintNotes")} label="Remote maintenance model notes" />
            </>
          )}
        </div>
        <div className="space-y-4" data-testid="sow-result">
          <StatusBanner status={result.status} />
          {!!result.missingRequired.length && (
            <div className={portal.card}>
              <p className={portal.label}>Required missing</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-rose-200/90">
                {result.missingRequired.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {!!result.missingRecommended.length && (
            <div className={portal.card}>
              <p className={portal.label}>Recommended</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-gold/90">
                {result.missingRecommended.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={portal.alertCyan}>
            Change requests mid-project need approval from both the PSAP and the CA 9-1-1 Branch.
          </div>
        </div>
      </div>
    </div>
  );
}
