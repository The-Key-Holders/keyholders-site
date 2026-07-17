import { TOP_PAIN_POINTS } from "@/lib/psap-portal/post-award-content";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function PainPointsPage() {
  return (
    <div className={portal.page}>
      <p className={portal.badgeGold}>Advisor · Top 20 pain points</p>
      <h1 className={`${portal.h1} mt-3`}>Post-award pain points &amp; mitigations</h1>
      <p className={portal.lead}>
        Ranked by impact on timelines, compliance, PSAP satisfaction, Advisor workload, and audit
        exposure. Each item links portal tools and includes a PSAP-facing tip you can share.
      </p>

      <div className="mt-8 space-y-6">
        {TOP_PAIN_POINTS.map((p) => (
          <article
            key={p.rank}
            id={`pp-${p.rank}`}
            className="scroll-mt-36 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-[family-name:var(--font-syne)] text-2xl font-bold text-gold">
                #{p.rank}
              </span>
              <span
                className={
                  p.severity === "HIGH"
                    ? "rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-200"
                    : p.severity === "MEDIUM-HIGH"
                      ? "rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold"
                      : "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/50"
                }
              >
                {p.severity}
              </span>
              <span className="text-xs text-white/40">{p.frequency}</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold text-white">{p.title}</h2>
            <p className={`${portal.muted} mt-2`}>{p.description}</p>
            <p className="mt-3 text-sm text-white/50">
              <span className="text-white/70">Root cause:</span> {p.rootCause}
            </p>
            <div className="mt-4">
              <p className={portal.label}>Mitigations</p>
              <ul className="mt-1 list-disc space-y-1 pl-4 text-sm text-white/65">
                {p.mitigations.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
            <div className={`${portal.alertCyan} mt-4`}>
              <span className="text-xs font-bold uppercase text-cyanGlow">Share with PSAP</span>
              <p className="mt-1 text-sm">{p.psapFacingTip}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.toolHrefs.map((h) => (
                <Link key={h} href={h} className={portal.btnSecondary + " !py-1 !text-xs"}>
                  Tool
                </Link>
              ))}
              <Link
                href={`/psap-portal/advisor/process-map#process-${p.processIds[0]}`}
                className={portal.btnSecondary + " !py-1 !text-xs"}
              >
                Process {p.processIds[0]}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
