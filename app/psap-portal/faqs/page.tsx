"use client";

import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";
import { useState } from "react";

type Step = {
  title: string;
  hint?: string;
  options?: { label: string; next: string }[];
  result?: { heading: string; body: string; href?: string };
};

const STEPS: Record<string, Step> = {
  start: {
    title: "Eligibility",
    hint: "Years since last TD-284?",
    options: [
      { label: "Less than 5 years", next: "early" },
      { label: "About 5 years", next: "eligible" },
      { label: "Years 6–7", next: "y67" },
      { label: "Year 8+", next: "y8" },
    ],
  },
  early: {
    title: "Not yet full refresh",
    result: {
      heading: "Plan — don't full-replace yet",
      body: "Use demos and track new MPA. Exceptions need Advisor.",
      href: "/psap-portal/tools/cloud-vs-onprem",
    },
  },
  eligible: {
    title: "Open TD-288?",
    hint: "Already issued under a prior package?",
    options: [
      { label: "Yes — finish current package", next: "finish" },
      { label: "No — starting fresh", next: "mpa" },
    ],
  },
  finish: {
    title: "Finish project",
    result: {
      heading: "Complete under current TD-288",
      body: "Don't restart under a new vehicle unless Branch directs.",
      href: "/psap-portal/tools/td288-checker",
    },
  },
  mpa: {
    title: "New MPA active?",
    options: [
      { label: "Yes — quote authorized contractors", next: "new" },
      { label: "No / unsure", next: "wait" },
    ],
  },
  new: {
    title: "Proceed new MPA",
    result: {
      heading: "Quotes under active MPA only",
      body: "Use vendor pool + Adv Notice + SOW checkers.",
      href: "/psap-portal/tools/vendor-pool",
    },
  },
  wait: {
    title: "Confirm first",
    result: {
      heading: "Ask Advisor before locking quotes",
      body: "Submit Adv Notice prep and watch award news.",
      href: "/psap-portal/tools/advance-notification-wizard",
    },
  },
  y67: {
    title: "Extended maint",
    result: {
      heading: "Years 6–7 path",
      body: "Pre-approval for extended maint; refresh often still recommended.",
      href: "/psap-portal/tools/advisor-lookup",
    },
  },
  y8: {
    title: "Beyond window",
    result: {
      heading: "Escalate",
      body: "Maint generally local — contact Advisor for options.",
      href: "/psap-portal/tools/submit-question",
    },
  },
};

export default function FaqsPage() {
  const [key, setKey] = useState("start");
  const step = STEPS[key];

  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>FAQs &amp; decision support</h1>
      <p className={portal.lead}>Buy now or wait — plus high-volume answers for the contract shift.</p>

      <div className={`${portal.card} mt-8 max-w-xl`} id="buy-wait">
        <h2 className={portal.h2}>{step.title}</h2>
        {step.hint && <p className={`${portal.muted} mt-1`}>{step.hint}</p>}
        {step.options && (
          <div className="mt-4 space-y-2">
            {step.options.map((o) => (
              <button
                key={o.label}
                type="button"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-sm text-white hover:border-cyanGlow/40"
                onClick={() => setKey(o.next)}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
        {step.result && (
          <div className="mt-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3" data-testid="buy-wait-result">
            <p className="font-semibold text-emerald-200">{step.result.heading}</p>
            <p className="mt-1 text-sm text-white/70">{step.result.body}</p>
            {step.result.href && (
              <Link href={step.result.href} className={`${portal.btnSecondary} mt-3`}>
                Open tool
              </Link>
            )}
          </div>
        )}
        {key !== "start" && (
          <button type="button" className={`${portal.btnSecondary} mt-4`} onClick={() => setKey("start")}>
            Start over
          </button>
        )}
      </div>

      <div className="mt-10 space-y-2">
        {[
          ["Are we eligible for CPE replacement?", "Generally 5 years from last TD-284 acceptance."],
          ["Do we use 2020 MPA prices?", "Not for new purchases once the new MPA is active."],
          ["CPE vs network funding?", "Different contracts and pots — see Contracts page."],
          ["What is TD-288?", "Commitment to Fund — before authorized spend on direct path."],
          ["Invoice delays?", "Use Invoice readiness checker (Att 14/15 fields + TD-288 #)."],
        ].map(([q, a]) => (
          <details key={q} className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <summary className="cursor-pointer font-medium text-white">{q}</summary>
            <p className={`${portal.muted} mt-2`}>{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
