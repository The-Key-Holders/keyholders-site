import { getVendors } from "@/lib/psap-portal/store";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function VendorPoolPage() {
  const vendors = getVendors();

  return (
    <div className="pb-10">
      <h1 className={portal.h1}>Vendor pool &amp; evaluation</h1>
      <p className={portal.lead}>
        Under RFP 26-16743, direct-path CPE purchases use the awarded statewide contractor pool —
        not ad-hoc sole-source RFPs. Advisors direct PSAPs here; less time on vendor vetting,
        more on fit within the pool.
      </p>
      <div className={`${portal.alert} mt-4`}>
        Placeholders until award. Replace via Admin export/import when Branch publishes authorized
        contractors. Do not treat 2020-era marketing lists as current.
      </div>

      <div className={`${portal.grid2} mt-8`}>
        {vendors.map((v) => (
          <article key={v.id} className={portal.card}>
            <p className={v.status === "placeholder" ? portal.badgeGold : portal.badge}>
              {v.status}
            </p>
            <h2 className="mt-2 font-semibold text-white">{v.name}</h2>
            <p className={`${portal.muted} mt-1`}>
              Models: {v.models.join(", ")}
            </p>
            {v.notes && <p className={`${portal.muted} mt-2`}>{v.notes}</p>}
          </article>
        ))}
      </div>

      <section className="mt-10">
        <h2 className={portal.h2}>Evaluation checklist (within the pool)</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/65">
          {[
            "Multi-vendor demos with comparable position counts and interfaces",
            "Cloud vs On-Prem already decided (not both at one PSAP)",
            "NG/i3 readiness and cutover plan with network provider",
            "SOW uses Attachment 16 structure; change-control understood",
            "Install clock awareness (180 days from TD-288 under new SOW unless revised)",
            "Maintenance term (5 years + optional extended) and MRC vs one-time clarity",
            "References / lab validation posture per Branch rules",
            "Quote comparison matrix before TDe-285 / TD-288 package",
          ].map((item) => (
            <li key={item} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/psap-portal/tools/cloud-vs-onprem" className={portal.btnSecondary}>
            Cloud vs On-Prem
          </Link>
          <Link href="/psap-portal/tools/sow-checker" className={portal.btnPrimary}>
            SOW checker
          </Link>
        </div>
      </section>
    </div>
  );
}
