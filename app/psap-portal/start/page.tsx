import { CREATOR, HELP_TOOLS, PROCESS_STEPS } from "@/lib/psap-portal/process-path";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export const metadata = {
  title: "Start here · How it works · About",
};

export default function StartHerePage() {
  return (
    <div className={portal.page}>
      <p className={portal.badge}>First time here · How this works · About</p>
      <h1 className={`${portal.h1} mt-3`}>Welcome to the PSAP Funding Support Portal</h1>
      <p className={portal.lead}>
        A private beta under <strong className="text-white">The Key Holders</strong> — built so
        California PSAPs can self-serve the new CPE contract path without flooding county Advisors.
      </p>

      {/* Why free — top as requested */}
      <section className={`${portal.alertCyan} mt-8`} id="why-free">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cyanGlow">
          Why this is free right now
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/85">
          Access is free because the portal is in a <strong className="text-white">beta stage</strong>
          . You (as a PSAP) were invited by someone close to the developer — not a public
          statewide rollout. Expect rough edges, sample Advisor data, and rapid iteration. Nothing
          here replaces official Cal OES letters, forms, or your assigned Branch Advisor.
        </p>
      </section>

      <section className="mt-10" id="purpose">
        <h2 className={portal.h2}>What this site is for</h2>
        <p className={`${portal.muted} mt-3 max-w-3xl`}>
          Under <strong className="text-white/80">RFP 26-16743</strong>, CPE procurement becomes a
          statewide contracted vendor pool with standardized Advance Notification, SOWs, TD-288
          packages, and invoices. County Advisors shift from ad-hoc procurement coaches to{" "}
          <strong className="text-white/80">process coordinators and compliance gatekeepers</strong>
          . That creates a short-term email and rework spike — incomplete notices, messy SOWs,
          invoice rejects, and “who can we buy from?” loops.
        </p>
        <p className={`${portal.muted} mt-3 max-w-3xl`}>
          This portal aims to <strong className="text-white/80">deflect that volume</strong> with
          ordered tools, checklists, and a Grok support agent that points PSAPs to the right step
          before they open an Advisor inbox.
        </p>
      </section>

      <section className="mt-10" id="solves">
        <h2 className={portal.h2}>What it aims to solve (and how)</h2>
        <div className={`${portal.grid2} mt-4`}>
          {[
            {
              t: "Wrong-order chaos",
              d: "Numbered CPE path (model → vendors → Adv Notice → SOW → TD-288 → invoice) so packages arrive complete.",
            },
            {
              t: "Template thrash",
              d: "Attachment 11 / 16 / 14–15 checkers catch missing fields before Advisors bounce them.",
            },
            {
              t: "CPE vs network mix-ups",
              d: "Contracts and funding pages keep money pots separate; agent reinforces the split.",
            },
            {
              t: "“Who is my Advisor?”",
              d: "Lookup tool + structured Submit a Question when self-serve is not enough.",
            },
            {
              t: "Transition rumor mill",
              d: "News feed + Admin publish path for award-day facts (not hallway speculation).",
            },
            {
              t: "After-hours how-to",
              d: "Grok agent on every page, trained on portal + process digests — guidance only, never a funding approval.",
            },
          ].map((x) => (
            <div key={x.t} className={portal.card}>
              <h3 className="font-semibold text-white">{x.t}</h3>
              <p className={`${portal.muted} mt-2`}>{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10" id="how-it-works">
        <h2 className={portal.h2}>How this all works</h2>
        <p className={`${portal.muted} mt-2`}>
          Follow the path in order for a full CPE replacement. Use “Anytime” tools whenever you are
          stuck.
        </p>
        <ol className="mt-4 space-y-2">
          {PROCESS_STEPS.map((s) => (
            <li key={s.id}>
              <Link
                href={s.href}
                className="flex flex-wrap items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-cyanGlow/40"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyanGlow/20 text-xs font-bold text-cyanGlow">
                  {s.step}
                </span>
                <span>
                  <span className="font-semibold text-white">{s.label}</span>
                  <span className="mt-0.5 block text-sm text-white/50">{s.when}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">Anytime help</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {HELP_TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className={portal.btnSecondary + " !text-xs"}>
                {t.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={PROCESS_STEPS[1].href} className={portal.btnPrimary}>
            Begin step 2 · Cloud vs On-Prem
          </Link>
          <Link href="/psap-portal/tools" className={portal.btnSecondary}>
            See all tools
          </Link>
        </div>
      </section>

      <section className="mt-12" id="about">
        <h2 className={portal.h2}>About · creators</h2>
        <div className={`${portal.card} mt-4 max-w-2xl`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gold">
            The Key Holders
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-syne)] text-xl font-bold text-white">
            {CREATOR.handle}
          </h3>
          <p className={`${portal.muted} mt-2`}>{CREATOR.blurb}</p>
          <p className={`${portal.muted} mt-3`}>
            Portfolio home:{" "}
            <a
              href="https://www.thekeyholders.org"
              className="text-cyanGlow hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              thekeyholders.org
            </a>
            . This portal sits beside other Advisor Tools (allotment engine, invoice reconciler, FOR
            engine) for professional 9-1-1 funding workflows.
          </p>
          <p className="mt-4 text-xs text-white/35">
            Not an official Cal OES product. Policy of record remains the live Operations Manual,
            current forms, and your assigned CA 9-1-1 Branch Advisor.
          </p>
        </div>
      </section>
    </div>
  );
}
