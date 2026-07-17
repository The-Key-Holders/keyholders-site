import { getNews } from "@/lib/psap-portal/store";
import { CREATOR, PROCESS_STEPS } from "@/lib/psap-portal/process-path";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function PsapPortalHomePage() {
  const news = getNews({ publishedOnly: true }).slice(0, 3);

  return (
    <div className={portal.page}>
      <div className="flex flex-wrap items-center gap-2">
        <p className={portal.badge}>Private beta · Invited access</p>
        <p className={portal.badgeGold}>RFP 26-16743 transition</p>
      </div>
      <h1 className={`${portal.h1} mt-3`}>
        Your hub for CPE funding, contracts, and package quality
      </h1>
      <p className={portal.lead}>
        Self-serve the template-driven path Advisors now gatekeep: model → vendors → Advance
        Notification → SOW → TD-288 → invoice — so routine questions do not flood the Branch.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/psap-portal/start" className={portal.btnPrimary}>
          First time here? Start here
        </Link>
        <Link href={PROCESS_STEPS[1].href} className={portal.btnSecondary}>
          Jump to step 2 · Cloud vs On-Prem
        </Link>
        <Link href="/psap-portal/tools" className={portal.btnSecondary}>
          Full tools path
        </Link>
      </div>

      <div className={`${portal.alertCyan} mt-6`}>
        <strong className="text-cyanGlow">Why free?</strong> Beta stage — you were invited by
        someone close to the developer. Not a public statewide product.{" "}
        <Link href="/psap-portal/start#why-free" className="underline hover:text-white">
          Full explanation
        </Link>
      </div>

      <div className={`${portal.alert} mt-4`}>
        <strong className="text-gold">Transition focus:</strong> After the new MPA is active, use
        authorized contractors only. Historical 2020 MPA price sheets are archive-only. Official
        allotments come from Branch letters — tools here are guidance.
      </div>

      <section className="mt-10">
        <h2 className={portal.h2}>Recommended order of operations</h2>
        <p className={`${portal.muted} mt-2`}>
          Follow the rail in the header, or work the list below. Each step deep-links a tool.
        </p>
        <ol className="mt-4 space-y-2">
          {PROCESS_STEPS.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm transition hover:border-cyanGlow/40"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyanGlow/15 text-xs font-bold text-cyanGlow">
                  {s.step}
                </span>
                <span className="font-medium text-white">{s.label}</span>
                <span className="hidden text-white/40 sm:inline">— {s.when}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className={portal.h2}>Why Advisors need this</h2>
        <p className={`${portal.muted} mt-2 max-w-3xl`}>
          Under RFP 26-16743, Advisors move from ad-hoc procurement support to structured
          gatekeeping (vendor pool, Att 11 notices, Att 16 SOWs, Att 14/15 invoices). This portal
          absorbs the education and completeness work so humans handle exceptions.
        </p>
        <Link href="/psap-portal/start#solves" className="mt-3 inline-block text-sm text-cyanGlow hover:underline">
          What we solve and how →
        </Link>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className={portal.h2}>Latest news</h2>
          <Link href="/psap-portal/news" className="text-sm text-cyanGlow hover:underline">
            All news →
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {news.map((n) => (
            <article key={n.id} className={portal.card}>
              <p className="text-xs text-white/40">{n.date}</p>
              <h3 className="mt-1 font-semibold text-white">{n.title}</h3>
              <p className={`${portal.muted} mt-2 line-clamp-2`}>{n.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${portal.card} mt-10`}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gold">Created by</p>
        <p className="mt-1 font-[family-name:var(--font-syne)] text-lg font-semibold text-white">
          {CREATOR.handle}
        </p>
        <p className={`${portal.muted} mt-1`}>{CREATOR.blurb}</p>
        <Link href="/psap-portal/start#about" className="mt-2 inline-block text-sm text-cyanGlow hover:underline">
          About this portal →
        </Link>
      </section>
    </div>
  );
}
