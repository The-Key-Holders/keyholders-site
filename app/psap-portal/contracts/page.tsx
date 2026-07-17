import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function ContractsPage() {
  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Contracts &amp; transition</h1>
      <p className={portal.lead}>
        RFP 26-16743 establishes the new statewide CPE Master Purchase Agreement — cloud or
        on-prem — shifting Advisors toward pool guidance and template compliance.
      </p>
      <div className={`${portal.grid2} mt-8`}>
        <div className={portal.card}>
          <p className={portal.label}>Solicitation</p>
          <p className="mt-2 text-white">RFP 26-16743</p>
          <p className={portal.muted}>Released April 27, 2026</p>
        </div>
        <div className={portal.card}>
          <p className={portal.label}>Est. award / start</p>
          <p className="mt-2 text-white">~Aug 7 / ~Aug 14, 2026</p>
          <p className={portal.muted}>Solicitation estimates — confirm Branch notices</p>
        </div>
        <div className={portal.card}>
          <p className={portal.label}>Term</p>
          <p className="mt-2 text-white">4 years + two 3-year options</p>
        </div>
        <div className={portal.card}>
          <p className={portal.label}>Models</p>
          <p className="mt-2 text-white">Cloud/data-center or on-prem</p>
          <p className={portal.muted}>Not both at one PSAP</p>
        </div>
      </div>
      <div className={`${portal.grid2} mt-8`}>
        <div className="rounded-xl border border-cyanGlow/30 bg-cyanGlow/10 p-5">
          <h2 className="font-semibold text-cyanGlow">CPE</h2>
          <p className={`${portal.muted} mt-2`}>
            Call-handling system · Fixed Allotment · Adv Notice · TD-288/284 · MPA contractors
          </p>
        </div>
        <div className="rounded-xl border border-gold/30 bg-gold/10 p-5">
          <h2 className="font-semibold text-gold">Network</h2>
          <p className={`${portal.muted} mt-2`}>
            Call delivery path · separate contracts/funding · coordinate cutovers with CPE
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/psap-portal/tools/vendor-pool" className={portal.btnPrimary}>
          Vendor pool
        </Link>
        <Link href="/psap-portal/tools/cloud-vs-onprem" className={portal.btnSecondary}>
          Cloud vs On-Prem
        </Link>
        <Link href="/psap-portal/faqs" className={portal.btnSecondary}>
          Buy now or wait?
        </Link>
      </div>
    </div>
  );
}
