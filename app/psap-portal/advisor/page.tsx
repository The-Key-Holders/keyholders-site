import {
  ADVISOR_PROCESSES,
  FLOW_OVERVIEW,
  TOP_PAIN_POINTS,
} from "@/lib/psap-portal/post-award-content";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function AdvisorDeskPage() {
  const top7 = TOP_PAIN_POINTS.filter((p) => p.rank <= 7);

  return (
    <div className={portal.page}>
      <p className={portal.badgeGold}>Advisor workspace · Post-award Sept 2026+</p>
      <h1 className={`${portal.h1} mt-3`}>Funding &amp; Compliance desk</h1>
      <p className={portal.lead}>
        Operational framework for county Advisors once RFP 26-16743 CPE contracts are live: process
        map, request catalog, pain points, and QC tools that cut incomplete PSAP packages.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/psap-portal/advisor/dashboard" className={portal.btnPrimary}>
          Ops dashboard (buckets)
        </Link>
        <Link href="/psap-portal/advisor/process-map" className={portal.btnSecondary}>
          Full process map (10)
        </Link>
        <Link href="/psap-portal/advisor/pain-points" className={portal.btnSecondary}>
          Top 20 pain points
        </Link>
        <Link href="/psap-portal/advisor/requests" className={portal.btnSecondary}>
          E1–E6 / I1–I3 requests
        </Link>
        <Link href="/psap-portal/tools" className={portal.btnSecondary}>
          QC tools
        </Link>
      </div>

      <section className="mt-10">
        <h2 className={portal.h2}>High-level flow</h2>
        <ol className="mt-4 space-y-1.5 text-sm text-white/65">
          {FLOW_OVERVIEW.map((line, i) => (
            <li
              key={line}
              className="flex gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2"
            >
              <span className="text-cyanGlow/80">{i + 1}.</span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className={portal.h2}>Highest-impact pain points (fix 7)</h2>
        <p className={`${portal.muted} mt-2`}>
          Prioritize job aids and coaching here in the first 60–90 days after award.
        </p>
        <div className="mt-4 space-y-2">
          {top7.map((p) => (
            <Link
              key={p.rank}
              href={`/psap-portal/advisor/pain-points#pp-${p.rank}`}
              className={`${portal.cardHover} block`}
            >
              <p className="text-xs text-gold">
                #{p.rank} · {p.severity}
              </p>
              <p className="font-semibold text-white">{p.title}</p>
              <p className={`${portal.muted} mt-1 line-clamp-2`}>{p.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className={portal.h2}>10 processes at a glance</h2>
        <div className={`${portal.grid2} mt-4`}>
          {ADVISOR_PROCESSES.map((pr) => (
            <Link
              key={pr.id}
              href={`/psap-portal/advisor/process-map#process-${pr.id}`}
              className={portal.cardHover}
            >
              <p className="text-xs text-cyanGlow">
                Process {pr.id} · {pr.phase}
              </p>
              <p className="mt-1 font-semibold text-white">{pr.name}</p>
              <p className={`${portal.muted} mt-1 line-clamp-2`}>{pr.timeline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${portal.alert} mt-10`}>
        <strong className="text-gold">Cross-cutting controls:</strong> Advance Notification (Att.
        11), TD e-288, SOW (Att. 16), TD284, Invoice (Att. 14/15), Change Order + approval record.
        Highest volume: SOW compliance, invoice rejects, change orders, TD e-288 backlog.
      </section>
    </div>
  );
}
