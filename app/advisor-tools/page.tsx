import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advisor Tools Hub",
  description:
    "Cal OES 9-1-1 Funding Advisor automation tools — allotment, invoice TD-288 reconciliation, and upcoming FOR engine.",
};

type ToolCard = {
  href: string;
  status: "live" | "beta" | "planned";
  title: string;
  blurb: string;
  tags: string[];
};

const TOOLS: ToolCard[] = [
  {
    href: "/psap-allotment",
    status: "live",
    title: "PSAP Allotment Engine",
    blurb:
      "Upload ECaTS Call Summary (and related exports) to calculate Chapter III funding level, positions, and estimated fixed allotment.",
    tags: ["CPE funding", "ECaTS", "Chapter III"],
  },
  {
    href: "/advisor-tools/invoice-reconciler",
    status: "live",
    title: "Invoice ↔ TD-288 Reconciler",
    blurb:
      "Paste Victoria’s weekly invoice table, match TD-288 tracking numbers, apply 5/30/45 SLA rules, export approve/dispute lists.",
    tags: ["Fiscal", "TD-288", "SLA"],
  },
  {
    href: "/advisor-tools#roadmap",
    status: "planned",
    title: "FOR Assembly Engine",
    blurb:
      "Planned next: assemble Fiscal & Operational Review packages from ECaTS + section templates (Cover / Summary / Section IV MVP).",
    tags: ["FOR", "ECaTS", "Coming soon"],
  },
  {
    href: "/advisor-tools#roadmap",
    status: "planned",
    title: "CPE Package / Residual Gate",
    blurb:
      "Planned: post-allotment completeness checklist (SOW, quotes, STD-65, TD-288, residual deadlines).",
    tags: ["Procurement", "Residuals"],
  },
];

const STATUS_STYLE = {
  live: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  beta: "bg-cyanGlow/15 text-cyanGlow border-cyanGlow/30",
  planned: "bg-white/10 text-white/60 border-white/15",
} as const;

export default function AdvisorToolsHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-widest text-cyanGlow/80">The Keyholders · Cal OES</p>
      <h1 className="mt-2 font-display text-4xl font-bold text-white">Advisor Tools Hub</h1>
      <p className="mt-4 max-w-2xl text-lg text-white/65">
        Browser-based automations for Javad’s Funding Advisor role — usable from any environment with a modern
        browser. Each tool is fully tested in desktop form first; web ports ship when parity is solid.
      </p>

      <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-50/90">
        <strong>Important:</strong> These tools support advisor review only. They do not submit to Fi$Cal, send
        official letters, or replace Branch policy judgment. Do not upload confidential state data you are not
        authorized to process in a browser. Access is password-gated for authorized users only.
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {TOOLS.map((tool) => {
          const isLink = tool.status !== "planned";
          const card = (
            <article
              key={tool.title}
              className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyanGlow/40 hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-white">{tool.title}</h2>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLE[tool.status]}`}
                >
                  {tool.status}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/65">{tool.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {tool.tags.map((t) => (
                  <span key={t} className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/50">
                    {t}
                  </span>
                ))}
              </div>
              {isLink && (
                <span className="mt-4 text-sm font-medium text-cyanGlow">Open tool →</span>
              )}
            </article>
          );
          return isLink ? (
            <Link key={tool.title} href={tool.href} className="block h-full">
              {card}
            </Link>
          ) : (
            <div key={tool.title}>{card}</div>
          );
        })}
      </div>

      <section id="roadmap" className="mt-14 rounded-2xl border border-white/10 bg-vault-950/50 p-6">
        <h2 className="font-display text-2xl font-semibold text-white">Roadmap</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm text-white/70">
          <li>
            <strong className="text-white/90">Done (desktop + web):</strong> PSAP Allotment Engine
          </li>
          <li>
            <strong className="text-white/90">Done (desktop) · Beta (web):</strong> Invoice ↔ TD-288 Reconciler
          </li>
          <li>
            <strong className="text-white/90">Next:</strong> FOR Assembly Engine (desktop MVP → web hub card)
          </li>
          <li>CPE package / residual gate tools</li>
          <li>Optional: Allotment v2 (Top Busiest Hours + Erlang import)</li>
        </ol>
        <p className="mt-4 text-xs text-white/45">
          Source workspace: local <code className="text-white/60">caloes-process-automations</code> with version
          registry. Production site: <code className="text-white/60">thekeyholders.org</code> (this Next.js app).
        </p>
      </section>
    </div>
  );
}
