import { JOB_AIDS } from "@/lib/psap-portal/post-award-content";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function JobAidsPage() {
  return (
    <div className={portal.page}>
      <p className={portal.badgeGold}>Advisor · Job aids</p>
      <h1 className={`${portal.h1} mt-3`}>Job aids &amp; checklists</h1>
      <p className={portal.lead}>
        First 60–90 days after award: prioritize SOW, invoice, Advance Notification, Cloud/On-Prem,
        and TD e-288 aids. Portal tools implement several mitigations interactively.
      </p>

      <div className={`${portal.grid2} mt-8`}>
        {JOB_AIDS.map((a) => (
          <Link key={a.id} href={a.href} className={portal.cardHover}>
            <p className="text-xs text-gold">Pain #{a.pain} · {a.audience}</p>
            <h2 className="mt-1 font-semibold text-white">{a.title}</h2>
          </Link>
        ))}
      </div>

      <section id="mac" className={`${portal.card} mt-10 scroll-mt-36`}>
        <h2 className={portal.h2}>Minor MAC vs Major Change</h2>
        <div className={`${portal.grid2} mt-4 text-sm text-white/65`}>
          <div>
            <p className="font-semibold text-emerald-200">Minor MAC (maintenance path)</p>
            <ul className="mt-2 list-disc pl-4">
              <li>Covered under monthly maintenance terms</li>
              <li>No material cost/timeline/scope change to funded project</li>
              <li>Log request; confirm with vendor; update records</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-rose-200">Major change (change order path)</p>
            <ul className="mt-2 list-disc pl-4">
              <li>Scope, cost, or schedule material change</li>
              <li>Requires PSAP + Branch approval (Process 4)</li>
              <li>May amend TD e-288 before work proceeds</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="escalation" className={`${portal.card} mt-6 scroll-mt-36`}>
        <h2 className={portal.h2}>3-step escalation matrix</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-white/65">
          <li>
            <strong className="text-white">Advisor facilitation</strong> — document SOW refs,
            positions of PSAP vs vendor, propose resolution (48–72h target).
          </li>
          <li>
            <strong className="text-white">Unit supervisor</strong> — policy interpretation,
            threshold decisions, multi-county patterns.
          </li>
          <li>
            <strong className="text-white">Program leadership / technical partners</strong> —
            systemic issues, NG integration disputes, funding exceptions.
          </li>
        </ol>
      </section>

      <section id="closeout" className={`${portal.card} mt-6 scroll-mt-36`}>
        <h2 className={portal.h2}>Project file / closeout themes</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/65">
          <li>Final SOW + all approved change orders</li>
          <li>TD e-288 history (create + amendments)</li>
          <li>TD284 acceptance + test evidence</li>
          <li>Invoices + payment records reconciled to TD e-288</li>
          <li>Training sign-offs / manuals delivery</li>
          <li>Confidentiality / personnel logs as applicable</li>
          <li>Close TD e-288 as Complete; archive per retention</li>
        </ul>
      </section>
    </div>
  );
}
