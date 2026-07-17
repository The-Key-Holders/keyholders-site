"use client";

import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";
import { useState } from "react";

export default function CloudVsOnPremPage() {
  const [facility, setFacility] = useState<"constrained" | "ok" | "">("");
  const [ng, setNg] = useState<"soon" | "later" | "">("");
  const [ops, setOps] = useState<"cloud-ok" | "local" | "">("");

  let lean = "Need more inputs — complete the questions or schedule multi-vendor demos.";
  if (facility === "constrained" || (ng === "soon" && ops === "cloud-ok")) {
    lean = "Lean Cloud / data-center: reduced backroom footprint, strong NG/i3 alignment — still need edge devices, power, and vendor connectivity.";
  } else if (facility === "ok" && ops === "local") {
    lean = "Lean On-Prem: existing room investment and local control — confirm i3 readiness, site cert, floor plans, and licensed install.";
  }

  return (
    <div className="pb-10">
      <h1 className={portal.h1}>Cloud vs On-Prem</h1>
      <p className={portal.lead}>
        New SOW: native cloud/data-center <strong>or</strong> on-premise — not both at one PSAP.
        Advisors will spend more time on fit assessment inside the awarded pool; use this page first.
      </p>
      <div className={`${portal.alert} mt-4`}>
        No brand preference. After award, only authorized MPA contractors. We do not invent unit
        prices here.
      </div>

      <div className={`${portal.grid2} mt-8`}>
        <div className={portal.card}>
          <p className={portal.label}>Cloud / data-center</p>
          <ul className={`${portal.muted} mt-3 list-disc space-y-1 pl-5`}>
            <li>Native cloud service (not legacy hosted)</li>
            <li>MRC / recurring cost emphasis</li>
            <li>Bandwidth + remote support focus in SOW</li>
            <li>Reduced server-room footprint; edge still required</li>
          </ul>
        </div>
        <div className={portal.card}>
          <p className={portal.label}>On-premise</p>
          <ul className={`${portal.muted} mt-3 list-disc space-y-1 pl-5`}>
            <li>PSAP equipment room core</li>
            <li>One-time equipment/labor + maint package</li>
            <li>Site cert, floor plans, C-7 install themes</li>
            <li>Physical infrastructure readiness critical</li>
          </ul>
        </div>
      </div>

      <div className={`${portal.card} mt-8 max-w-xl space-y-4`}>
        <h2 className={portal.h2}>Quick fit questions</h2>
        <label className="block text-sm text-white/60">
          Facility constraints (space/power/HVAC)?
          <select className={`${portal.input} mt-1`} value={facility} onChange={(e) => setFacility(e.target.value as typeof facility)}>
            <option value="">Select…</option>
            <option value="constrained">Constrained — limited room</option>
            <option value="ok">Adequate for servers</option>
          </select>
        </label>
        <label className="block text-sm text-white/60">
          NG9-1-1 cutover timing?
          <select className={`${portal.input} mt-1`} value={ng} onChange={(e) => setNg(e.target.value as typeof ng)}>
            <option value="">Select…</option>
            <option value="soon">Within ~6–12 months</option>
            <option value="later">Later / unknown</option>
          </select>
        </label>
        <label className="block text-sm text-white/60">
          Ops preference?
          <select className={`${portal.input} mt-1`} value={ops} onChange={(e) => setOps(e.target.value as typeof ops)}>
            <option value="">Select…</option>
            <option value="cloud-ok">Comfortable with cloud vendor SLAs</option>
            <option value="local">Prefer local control of core</option>
          </select>
        </label>
        <div className={portal.alertCyan} data-testid="model-lean">
          {lean}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className={portal.btnPrimary} href="/psap-portal/tools/advance-notification-wizard">
            Continue to Adv Notice prep
          </Link>
          <Link className={portal.btnSecondary} href="/psap-portal/tools/sow-checker">
            SOW checker
          </Link>
        </div>
      </div>
    </div>
  );
}
