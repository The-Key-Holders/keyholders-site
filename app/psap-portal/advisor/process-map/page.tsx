import { ADVISOR_PROCESSES, FLOW_OVERVIEW } from "@/lib/psap-portal/post-award-content";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function ProcessMapPage() {
  return (
    <div className={portal.page}>
      <p className={portal.badgeGold}>Advisor · Process map</p>
      <h1 className={`${portal.h1} mt-3`}>Post-award process map</h1>
      <p className={portal.lead}>
        Integrated framework for Funding/Compliance Advisors after CPE award (RFP 26-16743). Use
        for onboarding, desk reference, and SLA coaching.
      </p>

      <section className="mt-8">
        <h2 className={portal.h2}>End-to-end flow</h2>
        <ol className="mt-3 space-y-1 text-sm text-white/65">
          {FLOW_OVERVIEW.map((l, i) => (
            <li key={l} className="rounded border border-white/10 px-3 py-1.5">
              {i + 1}. {l}
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 space-y-8">
        {ADVISOR_PROCESSES.map((pr) => (
          <article
            key={pr.id}
            id={`process-${pr.id}`}
            className="scroll-mt-36 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-cyanGlow">
              Process {pr.id} · {pr.phase}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-syne)] text-xl font-semibold text-white">
              {pr.name}
            </h2>
            <p className={`${portal.muted} mt-2`}>{pr.summary}</p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className={portal.label}>Triggers</p>
                <ul className="mt-1 list-disc pl-4 text-sm text-white/60">
                  {pr.triggers.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={portal.label}>Timeline</p>
                <p className="mt-1 text-sm text-white/70">{pr.timeline}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className={portal.label}>Key tasks</p>
              <ol className="mt-1 list-decimal space-y-0.5 pl-4 text-sm text-white/60">
                {pr.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ol>
            </div>

            <div className="mt-4">
              <p className={portal.label}>Forms</p>
              <p className="mt-1 text-sm text-white/60">{pr.keyForms.join(" · ")}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase text-white/35">
                Pain points: {pr.painPointRanks.map((r) => `#${r}`).join(" ")}
              </span>
              {pr.toolHrefs.map((h) => (
                <Link key={h} href={h} className="text-xs text-cyanGlow hover:underline">
                  {h.replace("/psap-portal/", "/")}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
