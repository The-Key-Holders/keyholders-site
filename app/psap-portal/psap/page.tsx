import { TOP_PAIN_POINTS } from "@/lib/psap-portal/post-award-content";
import { PROCESS_STEPS } from "@/lib/psap-portal/process-path";
import { getNews } from "@/lib/psap-portal/store";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function PsapHomePage() {
  const news = getNews({ publishedOnly: true }).slice(0, 2);
  const tips = TOP_PAIN_POINTS.filter((p) => p.rank <= 7);

  return (
    <div className={portal.page}>
      <p className={portal.badge}>PSAP workspace</p>
      <h1 className={`${portal.h1} mt-3`}>Prepare packages Advisors can approve the first time</h1>
      <p className={portal.lead}>
        Post-award (Sept 2026+), incomplete Advance Notifications, SOWs, and invoices are the top
        delay drivers. Use the path below before you email your county Advisor.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/psap-portal/tools/advance-notification-wizard" className={portal.btnPrimary}>
          Start Advance Notification prep
        </Link>
        <Link href="/psap-portal/tools/cloud-vs-onprem" className={portal.btnSecondary}>
          Cloud vs On-Prem
        </Link>
        <Link href="/psap-portal/tools/submit-question" className={portal.btnSecondary}>
          Ask a question
        </Link>
      </div>

      <section className="mt-10">
        <h2 className={portal.h2}>Your ordered path</h2>
        <ol className="mt-4 space-y-2">
          {PROCESS_STEPS.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm hover:border-cyanGlow/40"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyanGlow/15 text-xs font-bold text-cyanGlow">
                  {s.step}
                </span>
                <span className="font-medium text-white">{s.label}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className={portal.h2}>Avoid the delays Advisors see most</h2>
        <p className={`${portal.muted} mt-2`}>
          Tips distilled from post-award pain-point analysis (top issues).
        </p>
        <div className="mt-4 space-y-3">
          {tips.map((p) => (
            <div key={p.rank} className={portal.card}>
              <p className="text-xs text-gold">
                #{p.rank} · {p.severity}
              </p>
              <h3 className="mt-1 font-semibold text-white">{p.title}</h3>
              <p className={`${portal.muted} mt-2`}>{p.psapFacingTip}</p>
              {p.toolHrefs[0] && (
                <Link
                  href={p.toolHrefs[0]}
                  className="mt-2 inline-block text-sm text-cyanGlow hover:underline"
                >
                  Open related tool →
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className={portal.h2}>News</h2>
        <div className="mt-3 space-y-2">
          {news.map((n) => (
            <Link key={n.id} href="/psap-portal/news" className={`${portal.cardHover} block`}>
              <p className="text-xs text-white/40">{n.date}</p>
              <p className="font-medium text-white">{n.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
