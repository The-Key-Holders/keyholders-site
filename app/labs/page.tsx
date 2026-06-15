import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PolicySimulator from "@/components/labs/PolicySimulator";
import ReliabilitySimulator from "@/components/ReliabilitySimulator";

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
                <li>• Backend: Rust + Axum + SQLx + PostgreSQL (production primitives, migrations on startup)</li>
                <li>• Frontend: Next.js (in frontend/) — policy composer, simulator, audit trails; points to Rust API</li>
                <li>• API surface (MVP): /health, full CRUD for estate-plans, beneficiaries, timelock-policies (allocation ≤100%)</li>
                <li>• Multi-chain: BTC / XMR / STX timelocks with roles, heirs, executors, self-custody first</li>
                <li>• Dev: Docker Postgres, app-manager script, default admin, Lunaverse deploy docs</li>
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Expanded with additional generated on-theme cinematic images (cyan key chains, violet cluster, policy editor mock, close chains) + existing for rich editorial previews */}
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/images/vault-key-hero.jpg"
                  alt="Legacy Vault cinematic dark vault with glowing cyan key and subtle gold chains, premium editorial style"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vault-950/75 via-vault-950/15 to-transparent p-5 text-sm text-white/90 flex items-end">
                  <div>
                    <p>Policy editor — drag-and-drop timelock conditions with live simulation</p>
                    <p className="mt-1 text-[10px] text-cyanGlow/80">Cinematic vault visual • Legacy Vault flagship</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/images/legacy-vault-violet-cluster.jpg"
                  alt="Close-up ornate key with violet and emerald rim glows in deep vault — heir dashboard preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vault-950/75 via-vault-950/15 to-transparent p-5 text-sm text-white/90 flex items-end">
                  <div>
                    <p>Heir dashboard — view pending releases, executor overrides, audit log</p>
                    <p className="mt-1 text-[10px] text-violetGlow/70">Salvaged vault motif • Multi-chain estate planning</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/images/policy-editor-preview.jpg"
                  alt="Premium editorial key close-up with cyan and gold glows on matte vault black — key recovery simulator visual"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vault-950/75 via-vault-950/15 to-transparent p-5 text-sm text-white/90 flex items-end">
                  <div>
                    <p>Key recovery simulator — test scenarios across BTC / XMR / STX chains</p>
                    <p className="mt-1 text-[10px] text-emeraldGlow/70">Editorial key visuals • Self-custody first</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src="/images/key-chains-close.jpg"
                  alt="Close-up heavy chains and glowing key macro in cinematic dark vault"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vault-950/70 via-vault-950/15 to-transparent p-5 text-sm text-white/90 flex items-end">
                  <div>
                    <p>Timelock chains — on-chain verification + off-chain encrypted storage</p>
                    <p className="mt-1 text-[10px] text-cyanGlow/80">New generated asset • Premium macro detail</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Creative low-cost interactive preview — Design Lab */}
            <div className="mt-10">
              <PolicySimulator />
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

      {/* Reliability Suite — salvaged from The-Key-Holders / CupofJavad portfolio (76 projects) — consolidated richer version with interactive + project grid + visuals */}
      <section className="section-padding border-b border-white/5 bg-vault-900/30">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-violetGlow/30 bg-violetGlow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-violetGlow">
              Salvaged • Reliability
            </span>
          </div>

          <div className="mt-4 grid gap-8 lg:grid-cols-5 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-display text-4xl font-bold tracking-tight text-white">Reliability Suite</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/65">
                Battle-tested tools from the public roadmap of 76 reliability &amp; infrastructure projects. Reduce toil. Prevent incidents. Production patterns salvaged directly from The Key Holders org and founder repos.
              </p>
              <a
                href="https://github.com/The-Key-Holders/reliability-infrastructure-roadmap"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violetGlow hover:underline"
              >
                Full roadmap (76 projects) →
              </a>
            </div>

            <div className="lg:col-span-3 relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/reliability-infra.jpg"
                alt="Reliability infrastructure cinematic dark vault grid with emerald cyan key/node motifs, editorial high-tech"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vault-950/80 via-vault-950/30 to-transparent" />
              {/* Overlay note for new generated asset */}
              <div className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/60">New generated • infra grid</div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Infrastructure Drift Detector", desc: "Terraform/CDK drift detection. Catch config drift before it becomes an outage.", href: "https://github.com/The-Key-Holders/infrastructure-drift-detector" },
              { name: "Incident Communication Bot", desc: "Unified incident comms across Slack, email, status pages. Battle-tested templates included.", href: "https://github.com/The-Key-Holders/incident-communication-bot" },
              { name: "Zero-Downtime Migration Orchestrator", desc: "Coordinated database + service migrations with automated rollback safety.", href: "https://github.com/The-Key-Holders/zero-downtime-migration-orchestrator" },
              { name: "Feature Flag & Experimentation SDKs", desc: "Vendor-agnostic flags + experimentation. Strong typing and gradual rollout.", href: "https://github.com/The-Key-Holders/feature-flag-experimentation-sdks" },
              { name: "Queue & Job Processing Framework", desc: "Reliable background jobs with idempotency, retries, and observability.", href: "https://github.com/The-Key-Holders/queue-job-processing-framework" },
              { name: "Resilience Testing Toolkit", desc: "Safe chaos engineering for non-prod. Failure injection, latency shaping, guardrails.", href: "https://github.com/The-Key-Holders/resilience-testing-toolkit" },
            ].map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violetGlow/40 flex flex-col"
              >
                <h4 className="font-semibold text-white group-hover:text-violetGlow transition">{p.name}</h4>
                <p className="mt-2 text-sm text-white/60 flex-1">{p.desc}</p>
                <span className="mt-4 text-xs uppercase tracking-[0.2em] text-violetGlow/70 group-hover:text-violetGlow">View on GitHub →</span>
              </a>
            ))}
          </div>
          <p className="mt-6 text-[10px] text-white/35">Sourced directly from The-Key-Holders/reliability-infrastructure-roadmap + linked founder projects. All on-brand with the vault mission.</p>
        </div>
      </section>

      {/* Creative Prototypes — salvaged Personal Assistant + more */}
      <section className="section-padding border-b border-white/5">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full border border-cyanGlow/30 bg-cyanGlow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyanGlow">
              Creative Tools
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-bold tracking-tight text-white">Personal Temporal Assistant</h2>
              <p className="mt-4 text-lg text-white/65">
                One central AI command center to manage Gmail inbox, Google Calendar, and plans with a partner (weekend trips, gifts, distance). Constraint-aware temporal governance.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-white/65">
                <li>• Command center view: events + emails + suggested actions</li>
                <li>• Email intent parsing → calendar event creation</li>
                <li>• Plans subsystem with partner coordination</li>
                <li>• Systems for versioning, testing, structured error audit</li>
              </ul>
              <a
                href="https://github.com/CupofJavad/Personal_Assistant"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow hover:underline"
              >
                Explore Personal Assistant repo →
              </a>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/reliability-operations.jpg"
                alt="Abstract high-tech operations with glowing key motifs in cinematic dark vault — creative tooling visual"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vault-950/70 to-transparent p-6 flex items-end">
                <p className="text-sm text-white/80">Salvaged creative tooling • AI-augmented personal ops surface</p>
              </div>
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
              Scrapers, integration prototypes, internal tooling, and the full 76-project reliability suite surface here first. Follow the curated open source feed or the organization for early drops.
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
