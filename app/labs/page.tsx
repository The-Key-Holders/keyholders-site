import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Experiments in production — Legacy Vault flagship (multi-chain estate planning in Rust + Next.js) and live FieldHub work-order platform for Geeks Next Door. R&D pipeline before graduation to ventures.",
};

export default function LabsPage() {
  return (
    <div className="bg-vault-950">
      {/* Top nav / back link bar */}
      <div className="border-b border-white/5 bg-vault-900/50">
        <div className="container-narrow flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            ← Back to The Key Holders
          </Link>
          <Link
            href="https://github.com/The-Key-Holders"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40 hover:text-cyanGlow"
          >
            The-Key-Holders on GitHub →
          </Link>
        </div>
      </div>

      {/* Hero / Intro */}
      <section className="section-padding border-b border-white/5">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violetGlow/70">
            003 • Labs
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
            Experiments in production
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-white/65">
            Legacy Vault and early prototypes live here — crypto estate planning, integrations, and tools we ship before they graduate to full ventures. Real code. Real constraints. Shipping in the open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/CupofJavad/Bitcoin_Estate_Planning_Tool_Rust"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Legacy Vault repo
            </a>
            <a
              href="https://github.com/CupofJavad/FieldHub"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              FieldHub repo
            </a>
            <Link href="/#github" className="btn-secondary">
              All curated repos
            </Link>
          </div>
        </div>
      </section>

      {/* Flagship: Legacy Vault — expanded depth */}
      <section className="section-padding border-b border-white/5">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-violetGlow/30 bg-violetGlow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-violetGlow">
              Flagship
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">RUST + NEXT.JS</span>
          </div>

          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">
            Legacy Vault
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/65">
            Multi-chain estate planning — Rust API + Next.js. BTC, XMR, STX timelock policies.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-8">
              <h3 className="font-semibold text-white">What it does</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/65">
                <li>• Timelocked release of private keys and seeds across Bitcoin, Monero, and Stacks</li>
                <li>• Policy engine for heirs, executors, and multi-sig guardians</li>
                <li>• On-chain verification + off-chain encrypted storage</li>
                <li>• Self-custody first: no centralized key escrow</li>
              </ul>
              <p className="mt-6 text-xs text-white/40">
                Bitcoin-native estate planning tool originally prototyped under Neural Key Labs. Actively maintained as Legacy Vault.
              </p>
            </div>

            <div className="glass-card p-8">
              <h3 className="font-semibold text-white">Tech &amp; architecture</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/65">
                <li>• Rust backend: robust crypto primitives, policy DSL, API server</li>
                <li>• Next.js frontend: policy composer UI, simulator, audit trails</li>
                <li>• Multi-chain support via rust-bitcoin, monero-rs, Stacks clarity</li>
                <li>• Optional self-hosted deployment for families and advisors</li>
              </ul>
              <a
                href="https://github.com/CupofJavad/Bitcoin_Estate_Planning_Tool_Rust"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-violetGlow hover:underline"
              >
                View source on GitHub →
              </a>
            </div>
          </div>

          {/* Screenshot / visual placeholders — editorial depth */}
          <div className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              Interface previews
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Policy editor — drag-and-drop timelock conditions with live simulation",
                "Heir dashboard — view pending releases, executor overrides, audit log",
                "Key recovery simulator — test scenarios across BTC / XMR / STX chains",
              ].map((caption, i) => (
                <div
                  key={i}
                  className="aspect-video rounded-2xl border border-white/10 bg-white/[0.015] p-6 text-sm text-white/40 flex items-end"
                >
                  <div>
                    <div className="mb-2 h-2 w-16 rounded bg-white/10" />
                    <p>{caption}</p>
                    <p className="mt-1 text-[10px] text-white/30">(Screenshots &amp; live demo coming as FieldHub integration stabilizes)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline: FieldHub — richer/live per P2 */}
      <section className="section-padding border-b border-white/5 bg-vault-900/30">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-violetGlow/30 bg-violetGlow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-violetGlow">
              Pipeline • Live
            </span>
          </div>

          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">
            FieldHub
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/65">
            2026 work-order brokering platform for Geeks Next Door — receive orders from providers (API, EDI, WebHooks), send to field-tech platforms, manage technicians, get paid. The 2026 version of Service Center Team (SCT).
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="glass-card p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">Core flows</h4>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                <li>• Ingest orders via API / EDI / webhooks</li>
                <li>• Broker to field-tech dispatch platforms</li>
                <li>• Technician management &amp; routing</li>
                <li>• Billing, payments, and reconciliation</li>
              </ul>
            </div>
            <div className="glass-card p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">Status</h4>
              <p className="mt-3 text-sm text-white/65">
                Production deployment complete. Phase 4 (scale, billing, security) shipped. Actively iterated with agent-assisted development and internal checklists.
              </p>
              <a
                href="https://github.com/CupofJavad/FieldHub"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violetGlow hover:underline"
              >
                Explore FieldHub on GitHub →
              </a>
            </div>
            <div className="glass-card p-6 border-violetGlow/20">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">Relationship to Geeks Next Door</h4>
              <p className="mt-3 text-sm text-white/65">
                FieldHub powers the operational backend for neighborly tech support and field service brokering at scale. Prototyped here in Labs; graduates toward consumer product surface.
              </p>
              <a
                href="https://www.thegeeksnextdoor.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow hover:underline"
              >
                Visit Geeks Next Door →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Next in pipeline + call to action */}
      <section className="section-padding">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">Future labs</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">More experiments in the queue</h2>
            <p className="mt-4 text-white/60">
              Scrapers, integration prototypes, and internal tooling surface here first. Follow the curated open source feed or the organization for early drops.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="https://github.com/CupofJavad"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                CupofJavad on GitHub
              </a>
              <Link href="/#github" className="btn-secondary">
                See all repos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="parent" />
    </div>
  );
}
