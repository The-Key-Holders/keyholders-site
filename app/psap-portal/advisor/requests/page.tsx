import {
  ADVISOR_PROCESSES,
  EXTERNAL_REQUESTS,
  INTERNAL_REQUESTS,
} from "@/lib/psap-portal/post-award-content";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

function RequestTable({
  title,
  rows,
}: {
  title: string;
  rows: typeof EXTERNAL_REQUESTS;
}) {
  return (
    <section className="mt-10">
      <h2 className={portal.h2}>{title}</h2>
      <div className="mt-4 space-y-4">
        {rows.map((r) => {
          const proc = ADVISOR_PROCESSES.find((p) => p.id === r.processId);
          return (
            <article key={r.id} className={portal.card}>
              <p className="text-xs font-bold text-cyanGlow">
                {r.id} · {r.source}
              </p>
              <h3 className="mt-1 font-semibold text-white">{r.description}</h3>
              <p className={`${portal.muted} mt-1`}>
                Triggers Process {r.processId}
                {proc ? `: ${proc.name}` : ""}
              </p>
              <p className="mt-2 text-xs text-white/40">Timeline: {r.timeline}</p>
              <ol className="mt-2 list-decimal space-y-0.5 pl-4 text-sm text-white/60">
                {r.steps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              {proc && (
                <Link
                  href={`/psap-portal/advisor/process-map#process-${proc.id}`}
                  className="mt-3 inline-block text-sm text-cyanGlow hover:underline"
                >
                  Open process detail →
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function RequestsPage() {
  return (
    <div className={portal.page}>
      <p className={portal.badgeGold}>Advisor · Request catalog</p>
      <h1 className={`${portal.h1} mt-3`}>External &amp; internal requests</h1>
      <p className={portal.lead}>
        Primary triggers that open Advisor processes. Use for intake routing, SLA expectations, and
        training new Advisors.
      </p>
      <RequestTable title="External (E1–E6)" rows={EXTERNAL_REQUESTS} />
      <RequestTable title="Internal (I1–I3)" rows={INTERNAL_REQUESTS} />
    </div>
  );
}
