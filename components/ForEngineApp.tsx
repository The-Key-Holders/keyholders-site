"use client";

import {
  assembleForPackage,
  emptyForPackage,
  suggestFiveYearEstimate,
  type ForPackage,
} from "@/lib/for-engine";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

const STEPS = [
  { id: "cover", label: "Cover" },
  { id: "fiscal", label: "I Fiscal" },
  { id: "network", label: "II Network" },
  { id: "cpe", label: "III CPE" },
  { id: "ops", label: "IV Ops" },
  { id: "ng", label: "V NG9-1-1" },
  { id: "refs", label: "VI Refs" },
  { id: "checklist", label: "Checklist" },
  { id: "package", label: "Package" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

function numOrNull(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t.replace(/[$,]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function downloadBlob(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm text-white/80">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-vault-950/60 px-3 py-2 text-sm text-white";

export default function ForEngineApp() {
  const [step, setStep] = useState<StepId>("cover");
  const [pkg, setPkg] = useState<ForPackage>(() => emptyForPackage());
  const [assembledMd, setAssembledMd] = useState<string | null>(null);
  const [assembledHtml, setAssembledHtml] = useState<string | null>(null);
  const [assembledJson, setAssembledJson] = useState<string | null>(null);
  const [validationMsg, setValidationMsg] = useState<string>("");

  const previewFiveYear = useMemo(() => suggestFiveYearEstimate(pkg), [pkg]);

  function patchCover(p: Partial<ForPackage["cover"]>) {
    setPkg((prev) => ({ ...prev, cover: { ...prev.cover, ...p } }));
  }
  function patchFiscal(p: Partial<ForPackage["fiscal"]>) {
    setPkg((prev) => ({ ...prev, fiscal: { ...prev.fiscal, ...p } }));
  }
  function patchNetwork(p: Partial<ForPackage["network"]>) {
    setPkg((prev) => ({ ...prev, network: { ...prev.network, ...p } }));
  }
  function patchCpe(p: Partial<ForPackage["cpe"]>) {
    setPkg((prev) => ({ ...prev, cpe: { ...prev.cpe, ...p } }));
  }
  function patchOps(p: Partial<ForPackage["ops"]>) {
    setPkg((prev) => ({ ...prev, ops: { ...prev.ops, ...p } }));
  }
  function patchNg(p: Partial<ForPackage["ng"]>) {
    setPkg((prev) => ({ ...prev, ng: { ...prev.ng, ...p } }));
  }

  function assemble() {
    const result = assembleForPackage(pkg);
    setValidationMsg(
      [
        ...result.validation.errors.map((e) => `Error: ${e}`),
        ...result.validation.warnings.map((w) => `Warning: ${w}`),
      ].join("\n")
    );
    if (!result.validation.ok) {
      setAssembledMd(null);
      setAssembledHtml(null);
      setAssembledJson(null);
      return;
    }
    setPkg(result.package);
    setAssembledMd(result.markdown);
    setAssembledHtml(result.html);
    setAssembledJson(result.json);
  }

  function loadDemo() {
    setPkg(
      emptyForPackage({
        cover: {
          psapName: "Demo City Police Department",
          forDate: new Date().toISOString().slice(0, 10),
          managerName: "Alex Manager",
          address: "100 Civic Center Dr",
          phone: "(555) 010-2000",
          advisorName: "Funding Advisor",
          advisorPhone: "(916) 555-0100",
        },
        fiscal: {
          cpeOnlyCost: 425000,
          ongoingOpsCost: 86000,
          fiveYearEstimate: null,
          ataLevel: "Level 3",
          ataBalance: 4500,
          reimbursementsPastFy: 12000,
          foreignLanguageCost: 2100,
          misCostNote: "Standard Branch MIS/ECaTS allocation (see current FY guidance).",
          fiscalNotes: "Demo figures for engine testing only.",
        },
        network: {
          totalLines: 14,
          trunks911: 8,
          alternateAnswer: 2,
          alternateAnswerPsap: "County Sheriff",
          notes: "Verify BTNs at meeting.",
        },
        cpe: {
          vendor: "Example CPE Vendor",
          systemType: "Cloud-based CPE",
          stateFundedPositions: 8,
          mpaContract: "MPA-DEMO",
          td288Tracking: "25908",
          td288ApprovalDate: "2023-11-02",
          systemAcceptance: "2024-03-15",
          maint5yrExpiration: "2029-03-15",
          issues: "Discuss extended maintenance options.",
        },
        ops: {
          pctAnswered15s: 92,
          monthsSampled: 12,
          avgCallsPerMonth: 3800,
          is24x7: "yes",
          countyCoordinatorName: "Jordan Coordinator",
          countyCoordinatorPhone: "(555) 010-3000",
          countyCoordinatorEmail: "coord@example.county.gov",
          textTo911: "integrated",
          ttyNotes: "Integrated TTY on call-taker screens demonstrated.",
          opsNotes: "",
        },
        ng: {
          notes: "PNSP/RNSP paths reviewed at high level.",
          pnspConnected: true,
          rnspConnected: true,
          cloudCpeDiscussed: true,
        },
        findings: {
          preMeeting: "Confirm network inventory and MSAG escalation path.",
          postMeeting: "",
        },
        evidence: emptyForPackage().evidence.map((e) => ({ ...e, present: true })),
      })
    );
    setStep("package");
    setValidationMsg("");
    setAssembledMd(null);
    setAssembledHtml(null);
    setAssembledJson(null);
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-white/50">
        <Link href="/advisor-tools" className="text-cyanGlow hover:underline">
          ← Advisor Tools
        </Link>
        <span>·</span>
        <span>FOR Engine v1.0.0-web</span>
      </div>

      <p className="text-sm font-medium uppercase tracking-widest text-cyanGlow/80">
        Cal OES · Funding Advisor
      </p>
      <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
        FOR Assembly Engine
      </h1>
      <p className="mt-3 max-w-3xl text-white/65">
        Assemble a Fiscal &amp; Operational Review draft package (Cover → Sections I–VI → Summary →
        checklist). Decision support only — does not replace Branch policy judgment or systems of
        record.
      </p>

      <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-50/90">
        <strong>Important:</strong> Do not upload confidential PSAP data you are not authorized to
        process in a browser. Prefer de-identified dry runs. No package is stored on the server.
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              step === s.id
                ? "border-cyanGlow/50 bg-cyanGlow/15 text-cyanGlow"
                : "border-white/10 bg-white/5 text-white/60 hover:border-white/25"
            }`}
          >
            {i + 1}. {s.label}
          </button>
        ))}
        <button type="button" onClick={loadDemo} className="btn-secondary ml-auto text-xs">
          Load demo PSAP
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-3">
          {step === "cover" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="PSAP name *">
                <input
                  className={inputClass}
                  value={pkg.cover.psapName}
                  onChange={(e) => patchCover({ psapName: e.target.value })}
                />
              </Field>
              <Field label="FOR date *">
                <input
                  type="date"
                  className={inputClass}
                  value={pkg.cover.forDate}
                  onChange={(e) => patchCover({ forDate: e.target.value })}
                />
              </Field>
              <Field label="PSAP manager">
                <input
                  className={inputClass}
                  value={pkg.cover.managerName}
                  onChange={(e) => patchCover({ managerName: e.target.value })}
                />
              </Field>
              <Field label="PSAP phone">
                <input
                  className={inputClass}
                  value={pkg.cover.phone}
                  onChange={(e) => patchCover({ phone: e.target.value })}
                />
              </Field>
              <Field label="PSAP address">
                <input
                  className={inputClass}
                  value={pkg.cover.address}
                  onChange={(e) => patchCover({ address: e.target.value })}
                />
              </Field>
              <Field label="Advisor name *">
                <input
                  className={inputClass}
                  value={pkg.cover.advisorName}
                  onChange={(e) => patchCover({ advisorName: e.target.value })}
                />
              </Field>
              <Field label="Advisor phone">
                <input
                  className={inputClass}
                  value={pkg.cover.advisorPhone}
                  onChange={(e) => patchCover({ advisorPhone: e.target.value })}
                />
              </Field>
            </div>
          )}

          {step === "fiscal" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="CPE / last upgrade cost ($)">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={pkg.fiscal.cpeOnlyCost ?? ""}
                  onChange={(e) => patchFiscal({ cpeOnlyCost: numOrNull(e.target.value) })}
                />
              </Field>
              <Field label="Ongoing ops cost past FY ($)">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={pkg.fiscal.ongoingOpsCost ?? ""}
                  onChange={(e) => patchFiscal({ ongoingOpsCost: numOrNull(e.target.value) })}
                />
              </Field>
              <Field label={`Five-year estimate ($) — suggested ${previewFiveYear ?? "—"}`}>
                <input
                  className={inputClass}
                  inputMode="decimal"
                  placeholder={previewFiveYear != null ? String(previewFiveYear) : ""}
                  value={pkg.fiscal.fiveYearEstimate ?? ""}
                  onChange={(e) =>
                    patchFiscal({ fiveYearEstimate: numOrNull(e.target.value) })
                  }
                />
              </Field>
              <Field label="ATA funding level">
                <input
                  className={inputClass}
                  value={pkg.fiscal.ataLevel}
                  onChange={(e) => patchFiscal({ ataLevel: e.target.value })}
                />
              </Field>
              <Field label="ATA balance remaining ($)">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={pkg.fiscal.ataBalance ?? ""}
                  onChange={(e) => patchFiscal({ ataBalance: numOrNull(e.target.value) })}
                />
              </Field>
              <Field label="Reimbursements past FY ($)">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={pkg.fiscal.reimbursementsPastFy ?? ""}
                  onChange={(e) =>
                    patchFiscal({ reimbursementsPastFy: numOrNull(e.target.value) })
                  }
                />
              </Field>
              <Field label="Foreign language cost ($)">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={pkg.fiscal.foreignLanguageCost ?? ""}
                  onChange={(e) =>
                    patchFiscal({ foreignLanguageCost: numOrNull(e.target.value) })
                  }
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Fiscal notes">
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={pkg.fiscal.fiscalNotes}
                    onChange={(e) => patchFiscal({ fiscalNotes: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === "network" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Total telephone lines">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={pkg.network.totalLines ?? ""}
                  onChange={(e) => patchNetwork({ totalLines: numOrNull(e.target.value) })}
                />
              </Field>
              <Field label="9-1-1 trunks">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={pkg.network.trunks911 ?? ""}
                  onChange={(e) => patchNetwork({ trunks911: numOrNull(e.target.value) })}
                />
              </Field>
              <Field label="Alternate answer lines">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={pkg.network.alternateAnswer ?? ""}
                  onChange={(e) =>
                    patchNetwork({ alternateAnswer: numOrNull(e.target.value) })
                  }
                />
              </Field>
              <Field label="Alternate answer PSAP">
                <input
                  className={inputClass}
                  value={pkg.network.alternateAnswerPsap}
                  onChange={(e) => patchNetwork({ alternateAnswerPsap: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Network notes">
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={pkg.network.notes}
                    onChange={(e) => patchNetwork({ notes: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === "cpe" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["vendor", "CPE vendor"],
                  ["systemType", "System type"],
                  ["mpaContract", "MPA contract #"],
                  ["td288Tracking", "TD-288 tracking"],
                  ["td288ApprovalDate", "TD-288 approval date"],
                  ["systemAcceptance", "System acceptance"],
                  ["maint5yrExpiration", "5-year maint expiration"],
                ] as const
              ).map(([key, label]) => (
                <Field key={key} label={label}>
                  <input
                    className={inputClass}
                    value={pkg.cpe[key]}
                    onChange={(e) => patchCpe({ [key]: e.target.value })}
                  />
                </Field>
              ))}
              <Field label="State-funded positions">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={pkg.cpe.stateFundedPositions ?? ""}
                  onChange={(e) =>
                    patchCpe({ stateFundedPositions: numOrNull(e.target.value) })
                  }
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Issues of particular interest">
                  <textarea
                    className={inputClass}
                    rows={3}
                    value={pkg.cpe.issues}
                    onChange={(e) => patchCpe({ issues: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === "ops" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="% answered within 15 seconds (ECaTS)">
                <input
                  className={inputClass}
                  inputMode="decimal"
                  value={pkg.ops.pctAnswered15s ?? ""}
                  onChange={(e) => patchOps({ pctAnswered15s: numOrNull(e.target.value) })}
                />
              </Field>
              <Field label="Months sampled">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={pkg.ops.monthsSampled ?? ""}
                  onChange={(e) => patchOps({ monthsSampled: numOrNull(e.target.value) })}
                />
              </Field>
              <Field label="Avg 9-1-1 calls / month">
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={pkg.ops.avgCallsPerMonth ?? ""}
                  onChange={(e) => patchOps({ avgCallsPerMonth: numOrNull(e.target.value) })}
                />
              </Field>
              <Field label="24/7 posture">
                <select
                  className={inputClass}
                  value={pkg.ops.is24x7}
                  onChange={(e) =>
                    patchOps({ is24x7: e.target.value as ForPackage["ops"]["is24x7"] })
                  }
                >
                  <option value="unknown">Unknown / confirm at meeting</option>
                  <option value="yes">Answering 24/7</option>
                  <option value="no_grandfathered">Not 24/7 — grandfathered funding</option>
                  <option value="no_plan">Not 24/7 — plan in development</option>
                  <option value="no_funding_risk">Not 24/7 — funding risk advised</option>
                </select>
              </Field>
              <Field label="Text-to-911">
                <select
                  className={inputClass}
                  value={pkg.ops.textTo911}
                  onChange={(e) =>
                    patchOps({ textTo911: e.target.value as ForPackage["ops"]["textTo911"] })
                  }
                >
                  <option value="unknown">Unknown</option>
                  <option value="ott">OTT (e.g. RapidDeploy-style)</option>
                  <option value="integrated">Integrated in CPE</option>
                </select>
              </Field>
              <Field label="County Coordinator name">
                <input
                  className={inputClass}
                  value={pkg.ops.countyCoordinatorName}
                  onChange={(e) => patchOps({ countyCoordinatorName: e.target.value })}
                />
              </Field>
              <Field label="Coordinator phone">
                <input
                  className={inputClass}
                  value={pkg.ops.countyCoordinatorPhone}
                  onChange={(e) => patchOps({ countyCoordinatorPhone: e.target.value })}
                />
              </Field>
              <Field label="Coordinator email">
                <input
                  className={inputClass}
                  value={pkg.ops.countyCoordinatorEmail}
                  onChange={(e) => patchOps({ countyCoordinatorEmail: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="TTY notes">
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={pkg.ops.ttyNotes}
                    onChange={(e) => patchOps({ ttyNotes: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          )}

          {step === "ng" && (
            <div className="space-y-4">
              {(
                [
                  ["pnspConnected", "PNSP connectivity discussed"],
                  ["rnspConnected", "RNSP connectivity discussed"],
                  ["cloudCpeDiscussed", "Cloud CPE options discussed"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={pkg.ng[key]}
                    onChange={(e) => patchNg({ [key]: e.target.checked })}
                    className="h-4 w-4 rounded border-white/30"
                  />
                  {label}
                </label>
              ))}
              <Field label="NG / Cloud notes">
                <textarea
                  className={inputClass}
                  rows={4}
                  value={pkg.ng.notes}
                  onChange={(e) => patchNg({ notes: e.target.value })}
                />
              </Field>
            </div>
          )}

          {step === "refs" && (
            <div className="space-y-4">
              <Field label="Extra references / links (one per line)">
                <textarea
                  className={inputClass}
                  rows={5}
                  value={pkg.references.extraLinks}
                  onChange={(e) =>
                    setPkg((p) => ({
                      ...p,
                      references: { extraLinks: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Preliminary findings for discussion">
                <textarea
                  className={inputClass}
                  rows={4}
                  value={pkg.findings.preMeeting}
                  onChange={(e) =>
                    setPkg((p) => ({
                      ...p,
                      findings: { ...p.findings, preMeeting: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          )}

          {step === "checklist" && (
            <div className="space-y-3">
              <p className="text-sm text-white/65">
                Mark evidence present before exporting a “ready” package. Required items should be
                complete for a full binder prep.
              </p>
              {pkg.evidence.map((e, idx) => (
                <label
                  key={e.id}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-vault-950/40 px-3 py-2 text-sm text-white/80"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4"
                    checked={e.present}
                    onChange={(ev) => {
                      setPkg((prev) => {
                        const evidence = [...prev.evidence];
                        evidence[idx] = { ...evidence[idx], present: ev.target.checked };
                        return { ...prev, evidence };
                      });
                    }}
                  />
                  <span>
                    {e.required && (
                      <span className="mr-1 text-[10px] font-semibold uppercase text-amber-200/90">
                        Required
                      </span>
                    )}
                    {e.label}
                  </span>
                </label>
              ))}
            </div>
          )}

          {step === "package" && (
            <div className="space-y-4">
              <p className="text-sm text-white/65">
                Generate draft Markdown, print-ready HTML, and JSON. Summary is assembled from
                sections I–VI (write order per Branch prep: complete sections first, then summarize).
              </p>
              <button type="button" className="btn-primary" onClick={assemble}>
                Assemble FOR package
              </button>
              {validationMsg && (
                <pre className="whitespace-pre-wrap rounded-lg border border-white/10 bg-vault-950/50 p-3 text-xs text-amber-100/90">
                  {validationMsg}
                </pre>
              )}
              {assembledMd && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-secondary text-xs"
                    onClick={() =>
                      downloadBlob(
                        `FOR_${pkg.cover.psapName.replace(/\W+/g, "_") || "draft"}.md`,
                        assembledMd,
                        "text/markdown"
                      )
                    }
                  >
                    Download package.md
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-xs"
                    onClick={() =>
                      downloadBlob(
                        `FOR_${pkg.cover.psapName.replace(/\W+/g, "_") || "draft"}.html`,
                        assembledHtml || "",
                        "text/html"
                      )
                    }
                  >
                    Download package.html
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-xs"
                    onClick={() =>
                      downloadBlob(
                        `FOR_${pkg.cover.psapName.replace(/\W+/g, "_") || "draft"}.json`,
                        assembledJson || "",
                        "application/json"
                      )
                    }
                  >
                    Download package.json
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <button
              type="button"
              className="btn-secondary text-xs"
              disabled={stepIndex <= 0}
              onClick={() => setStep(STEPS[stepIndex - 1].id)}
            >
              ← Back
            </button>
            <button
              type="button"
              className="btn-primary text-xs"
              disabled={stepIndex >= STEPS.length - 1}
              onClick={() => setStep(STEPS[stepIndex + 1].id)}
            >
              Next →
            </button>
          </div>
        </section>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-white">Live snapshot</h2>
          <dl className="mt-4 space-y-2 text-sm text-white/70">
            <div>
              <dt className="text-white/40">PSAP</dt>
              <dd className="text-white">{pkg.cover.psapName || "—"}</dd>
            </div>
            <div>
              <dt className="text-white/40">FOR date</dt>
              <dd>{pkg.cover.forDate || "—"}</dd>
            </div>
            <div>
              <dt className="text-white/40">Advisor</dt>
              <dd>{pkg.cover.advisorName || "—"}</dd>
            </div>
            <div>
              <dt className="text-white/40">ASA (15s)</dt>
              <dd>
                {pkg.ops.pctAnswered15s != null ? `${pkg.ops.pctAnswered15s}%` : "—"}
                {pkg.ops.pctAnswered15s != null && pkg.ops.pctAnswered15s < 90 && (
                  <span className="ml-2 text-rose-200">below 90%</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-white/40">5-year estimate (suggested)</dt>
              <dd>
                {previewFiveYear != null
                  ? previewFiveYear.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-white/40">Required evidence</dt>
              <dd>
                {pkg.evidence.filter((e) => e.required && e.present).length}/
                {pkg.evidence.filter((e) => e.required).length} marked present
              </dd>
            </div>
          </dl>
          {assembledMd && (
            <div className="mt-4 max-h-80 overflow-auto rounded-lg border border-white/10 bg-vault-950/50 p-3 font-mono text-[10px] leading-relaxed text-white/60">
              {assembledMd.slice(0, 2500)}
              {assembledMd.length > 2500 ? "\n…" : ""}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
