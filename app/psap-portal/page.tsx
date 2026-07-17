import { getNews } from "@/lib/psap-portal/store";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

const ACTIONS = [
  {
    href: "/psap-portal/tools/advance-notification-wizard",
    title: "Advance Notification prep",
    blurb: "Cloud vs On-Prem + FY before you email your Advisor (Att 11).",
    tag: "Shift 2",
  },
  {
    href: "/psap-portal/tools/cloud-vs-onprem",
    title: "Cloud vs On-Prem",
    blurb: "Pick one model per PSAP. Fit, readiness, and SOW differences.",
    tag: "Shift 5",
  },
  {
    href: "/psap-portal/tools/vendor-pool",
    title: "Vendor pool & evaluation",
    blurb: "Pre-qualified contractors — not ad-hoc RFPs for direct path.",
    tag: "Shift 1",
  },
  {
    href: "/psap-portal/tools/td288-checker",
    title: "TD-288 package checker",
    blurb: "Funding package spine before Commitment to Fund.",
    tag: "Core",
  },
  {
    href: "/psap-portal/tools/sow-checker",
    title: "SOW completeness",
    blurb: "Attachment 16 structure — reduce bounce-backs.",
    tag: "Shift 3",
  },
  {
    href: "/psap-portal/tools/invoice-checker",
    title: "Invoice readiness",
    blurb: "Att 14/15 fields + TD-288 amount guard.",
    tag: "Shift 4",
  },
  {
    href: "/psap-portal/tools/advisor-lookup",
    title: "Find my Advisor",
    blurb: "Sample directory — replace with live assignments via Admin.",
    tag: "Core",
  },
  {
    href: "/psap-portal/tools/submit-question",
    title: "Submit a question",
    blurb: "Structured ticket instead of free-form email.",
    tag: "Core",
  },
];

export default function PsapPortalHomePage() {
  const news = getNews({ publishedOnly: true }).slice(0, 3);

  return (
    <div className={portal.page}>
      <p className={portal.badge}>Password-gated · RFP 26-16743 transition</p>
      <h1 className={`${portal.h1} mt-3`}>
        Your hub for CPE funding, contracts, and package quality
      </h1>
      <p className={portal.lead}>
        Built so PSAPs self-serve the template-driven process Advisors now gatekeep: evaluate →
        Advance Notification → SOW → TD-288 → acceptance → invoice — under the new statewide CPE
        MPA.
      </p>

      <div className={`${portal.alert} mt-6`}>
        <strong className="text-gold">Transition focus:</strong> After the new MPA is active, use
        authorized contractors only. Historical 2020 MPA price sheets are archive-only. Official
        allotments come from Branch letters — tools here are guidance.
      </div>

      <section className="mt-10">
        <h2 className={portal.h2}>How the Advisor role is changing</h2>
        <p className={`${portal.muted} mt-2 max-w-3xl`}>
          Less ad-hoc vendor vetting; more directing PSAPs to the awarded pool, processing
          standardized Advance Notifications, SOW completeness, TD-288 packages, and invoice
          compliance. Use the tools below before you email your county Advisor.
        </p>
        <div className={`${portal.grid2} mt-4`}>
          {[
            ["1 · Vendor pool", "Select from awarded contractors; evaluate fit within the pool."],
            ["2 · Advance Notification", "Mandatory front gate with Cloud vs On-Prem + FY."],
            ["3 · Standard SOW", "Attachment 16; change requests need PSAP + Branch."],
            ["4 · Invoices", "Prescriptive fields tied to TDe-288; avoid payment delays."],
            ["5 · Cloud vs On-Prem", "Different cost structures, site needs, and SOW emphasis."],
            ["6 · Template-driven ops", "Checkers + Grok agent absorb transition volume."],
          ].map(([t, d]) => (
            <div key={t} className={portal.card}>
              <p className={portal.label}>{t}</p>
              <p className={`${portal.muted} mt-2`}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className={portal.h2}>Quick tools</h2>
          <Link href="/psap-portal/tools" className="text-sm text-cyanGlow hover:underline">
            All tools →
          </Link>
        </div>
        <div className={`${portal.grid3} mt-4`}>
          {ACTIONS.map((a) => (
            <Link key={a.href} href={a.href} className={portal.cardHover}>
              <p className={portal.badge}>{a.tag}</p>
              <h3 className="mt-2 font-[family-name:var(--font-syne)] text-base font-semibold text-white">
                {a.title}
              </h3>
              <p className={`${portal.muted} mt-1`}>{a.blurb}</p>
            </Link>
          ))}
        </div>
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
              <p className={`${portal.muted} mt-2 line-clamp-3`}>{n.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link href="/psap-portal/contracts" className={portal.cardHover}>
          <p className={portal.label}>Learn</p>
          <h3 className="mt-1 font-semibold">Contracts & transition</h3>
        </Link>
        <Link href="/psap-portal/faqs" className={portal.cardHover}>
          <p className={portal.label}>Decide</p>
          <h3 className="mt-1 font-semibold">FAQs & buy/wait wizard</h3>
        </Link>
        <Link href="/psap-portal/admin" className={portal.cardHover}>
          <p className={portal.label}>Admin</p>
          <h3 className="mt-1 font-semibold">News · questions · data</h3>
        </Link>
      </section>
    </div>
  );
}
