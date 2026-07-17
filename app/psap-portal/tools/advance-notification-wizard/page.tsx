"use client";

import { portal } from "@/lib/psap-portal/ui";
import { useMemo, useState } from "react";

type Model = "cloud" | "onprem" | "";

export default function AdvanceNotificationWizardPage() {
  const [step, setStep] = useState(0);
  const [td284, setTd284] = useState("");
  const [eligible, setEligible] = useState<"yes" | "no" | "unsure">("unsure");
  const [fy, setFy] = useState("");
  const [model, setModel] = useState<Model>("");
  const [psap, setPsap] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");

  const yearsSince = useMemo(() => {
    if (!td284) return null;
    const d = new Date(td284);
    if (Number.isNaN(d.getTime())) return null;
    const ms = Date.now() - d.getTime();
    return Math.floor(ms / (365.25 * 24 * 3600 * 1000));
  }, [td284]);

  const draft = useMemo(() => {
    return [
      "Subject: Advance Notification — CPE Funding",
      "",
      `PSAP: ${psap || "[PSAP name]"}`,
      `Contact: ${contact || "[name]"} <${email || "[email]"}>`,
      `Last TD-284 / acceptance date: ${td284 || "[date]"}`,
      `Approx. years since acceptance: ${yearsSince ?? "n/a"}`,
      `Self-assessed eligibility (5-year cycle): ${eligible}`,
      `Target fiscal year: ${fy || "[FY]"}`,
      `Preferred model: ${model || "[cloud|on-prem]"}`,
      "",
      "We are preparing Advance Notification for CPE Funding (Attachment 11 themes) so the Branch can budget and so we can evaluate contractors under the active/new MPA pool.",
      "",
      "Please confirm next steps and any current form version we should use.",
    ].join("\n");
  }, [psap, contact, email, td284, yearsSince, eligible, fy, model]);

  const steps = ["Eligibility", "Fiscal year", "Cloud vs On-Prem", "Contact", "Summary"];

  return (
    <div className="pb-10">
      <h1 className={portal.h1}>Advance Notification prep</h1>
      <p className={portal.lead}>
        Attachment 11 themes: give PSAPs time to evaluate contractors and signal Cloud vs On-Prem +
        FY to the Branch. This wizard does <strong>not</strong> submit the official form — it
        prepares a complete package for your Advisor.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {steps.map((s, i) => (
          <span
            key={s}
            className={
              i === step
                ? portal.badge
                : "rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40"
            }
          >
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <div className={`${portal.card} mt-6 max-w-xl space-y-4`}>
        {step === 0 && (
          <>
            <label className="block text-sm text-white/60">
              Last TD-284 / system acceptance date
              <input
                type="date"
                className={`${portal.input} mt-1`}
                value={td284}
                onChange={(e) => setTd284(e.target.value)}
              />
            </label>
            {yearsSince != null && (
              <p className={portal.muted}>≈ {yearsSince} year(s) since acceptance</p>
            )}
            <label className="block text-sm text-white/60">
              Do you believe you are in the year-5 refresh window?
              <select
                className={`${portal.input} mt-1`}
                value={eligible}
                onChange={(e) => setEligible(e.target.value as typeof eligible)}
              >
                <option value="unsure">Unsure — Advisor will confirm</option>
                <option value="yes">Yes — near/at 5 years</option>
                <option value="no">No — earlier than year 5</option>
              </select>
            </label>
          </>
        )}
        {step === 1 && (
          <label className="block text-sm text-white/60">
            Target fiscal year for funding (e.g. 2026/27)
            <input
              className={`${portal.input} mt-1`}
              value={fy}
              onChange={(e) => setFy(e.target.value)}
              placeholder="2026/27"
            />
          </label>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className={portal.muted}>
              Att 11 explicitly distinguishes Cloud vs On-Premises. You may not deploy both cores at
              one PSAP under the new SOW.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className={model === "cloud" ? portal.btnPrimary : portal.btnSecondary}
                onClick={() => setModel("cloud")}
              >
                Cloud
              </button>
              <button
                type="button"
                className={model === "onprem" ? portal.btnPrimary : portal.btnSecondary}
                onClick={() => setModel("onprem")}
              >
                On-Prem
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <>
            <label className="block text-sm text-white/60">
              PSAP name
              <input className={`${portal.input} mt-1`} value={psap} onChange={(e) => setPsap(e.target.value)} />
            </label>
            <label className="block text-sm text-white/60">
              Contact name
              <input className={`${portal.input} mt-1`} value={contact} onChange={(e) => setContact(e.target.value)} />
            </label>
            <label className="block text-sm text-white/60">
              Contact email
              <input className={`${portal.input} mt-1`} value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
          </>
        )}
        {step === 4 && (
          <div>
            <p className={portal.label}>Draft email to Advisor</p>
            <pre
              className="mt-2 whitespace-pre-wrap rounded-lg border border-white/10 bg-[#050810] p-3 text-xs text-white/70"
              data-testid="adv-notice-draft"
            >
              {draft}
            </pre>
            <button
              type="button"
              className={`${portal.btnSecondary} mt-3`}
              onClick={() => void navigator.clipboard?.writeText(draft)}
            >
              Copy draft
            </button>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button
            type="button"
            className={portal.btnSecondary}
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              className={portal.btnPrimary}
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            >
              Next
            </button>
          ) : (
            <a className={portal.btnPrimary} href="/psap-portal/tools/advisor-lookup">
              Find my Advisor
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
