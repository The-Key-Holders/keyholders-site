"use client";

import CheckboxField from "@/components/psap-portal/CheckboxField";
import StatusBanner from "@/components/psap-portal/StatusBanner";
import { scoreTd288Package, type Td288PackageInput } from "@/lib/psap-portal/td288-checker";
import { portal } from "@/lib/psap-portal/ui";
import { useMemo, useState } from "react";

const INITIAL: Td288PackageInput = {
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
};

export default function Td288CheckerPage() {
  const [form, setForm] = useState(INITIAL);
  const result = useMemo(() => scoreTd288Package(form), [form]);
  const set = (k: keyof Td288PackageInput) => (v: boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="pb-10">
      <h1 className={portal.h1}>TD-288 package checker</h1>
      <p className={portal.lead}>
        Confirm funding-package readiness before the Branch issues a Commitment to Fund. Guidance
        only — not an official approval.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-2">
          <CheckboxField
            checked={form.advanceNotification}
            onChange={set("advanceNotification")}
            label="Advance Notification on file"
          />
          <CheckboxField
            checked={form.allotmentLetter}
            onChange={set("allotmentLetter")}
            label="Allotment / pre-authorization letter received"
          />
          <CheckboxField
            checked={form.modelSelected}
            onChange={set("modelSelected")}
            label="Cloud or On-Prem selected (not both)"
          />
          <CheckboxField
            checked={form.authorizedVendorQuote}
            onChange={set("authorizedVendorQuote")}
            label="Quote from authorized active-MPA contractor"
          />
          <CheckboxField
            checked={form.sowComplete}
            onChange={set("sowComplete")}
            label="SOW complete (run SOW checker)"
            hint="Use /psap-portal/tools/sow-checker"
          />
          <CheckboxField
            checked={form.residualsPlanned}
            onChange={set("residualsPlanned")}
            label="Residuals planned with this project"
          />
          {form.residualsPlanned && (
            <>
              <CheckboxField
                checked={form.tde285IfResiduals}
                onChange={set("tde285IfResiduals")}
                label="TDe-285 covers residual items"
              />
              <CheckboxField
                checked={form.residualListOnly}
                onChange={set("residualListOnly")}
                label="Residual items on current approved list only"
              />
            </>
          )}
          <CheckboxField
            checked={form.networkImpactAck}
            onChange={set("networkImpactAck")}
            label="Network / NG impact acknowledged"
          />
          <CheckboxField
            checked={form.facilityReadiness}
            onChange={set("facilityReadiness")}
            label="Facility readiness / site survey documented"
          />
        </div>
        <div className="space-y-4" data-testid="td288-result">
          <StatusBanner status={result.status} />
          {!!result.missingRequired.length && (
            <div className={portal.card}>
              <p className={portal.label}>Required missing</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-200/90">
                {result.missingRequired.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {!!result.missingRecommended.length && (
            <div className={portal.card}>
              <p className={portal.label}>Recommended</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gold/90">
                {result.missingRecommended.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={portal.card}>
            <p className={portal.label}>Notes</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/55">
              {result.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
