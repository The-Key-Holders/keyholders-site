import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GitHub",
  description:
    "Curated open source from The Key Holders ecosystem. Not full org dump — FieldHub, Legacy Vault, CurrentRMS Sync, Starter Pack, Reliability Suite tools and more we actively stand behind.",
};

const curatedRepos = [
  {
    name: "FieldHub",
    desc: "Geeks Next Door 2026 work-order brokering monorepo. Orders via API/EDI/WebHooks → dispatch.",
    href: "https://github.com/CupofJavad/FieldHub",
    org: "CupofJavad",
  },
  {
    name: "Legacy Vault",
    desc: "Bitcoin-native estate planning — Rust + Next.js. Multi-chain timelocks for BTC, XMR, STX.",
    href: "https://github.com/CupofJavad/Bitcoin_Estate_Planning_Tool_Rust",
    org: "CupofJavad",
  },
  {
    name: "CurrentRMS Sync",
    desc: "Event production API → Google Sheets pipeline. Daily opportunity sync reporting.",
    href: "https://github.com/The-Key-Holders/currentrms-google-sheets-sync",
    org: "The-Key-Holders",
  },
  {
    name: "Starter Pack",
    desc: "Opinionated template for serious small apps. Every project should start here.",
    href: "https://github.com/CupofJavad/Starter_Pack",
    org: "CupofJavad",
  },
  {
    name: "Reliability Infrastructure Roadmap",
    desc: "Public portfolio & roadmap of 76 reliability and infrastructure projects.",
    href: "https://github.com/The-Key-Holders/reliability-infrastructure-roadmap",
    org: "The-Key-Holders",
  },
  {
    name: "Resilience Testing Toolkit",
    desc: "Safe chaos engineering • failure injection & latency shaping for small teams.",
    href: "https://github.com/The-Key-Holders/resilience-testing-toolkit",
    org: "The-Key-Holders",
  },
  {
    name: "Personal Temporal Assistant",
    desc: "AI command center for Gmail, Calendar, and partner planning. Constraint-aware governance.",
    href: "https://github.com/CupofJavad/Personal_Assistant",
    org: "CupofJavad",
  },
  {
    name: "Zero-Downtime Migration Orchestrator",
    desc: "Coordinated database & infra migrations. From the active reliability track.",
    href: "https://github.com/The-Key-Holders/zero-downtime-migration-orchestrator",
    org: "The-Key-Holders",
  },
];

export default function GitHubPage() {
  return (
    <div className="bg-vault-950">
      {/* Top nav / back link bar - matches /work /labs /changelog patterns exactly */}
      <div className="border-b border-white/5 bg-vault-900/50">
        <div className="container-narrow flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-white"
          >
            ← Back to The Key Holders
          </Link>
          <a
            href="https://github.com/The-Key-Holders"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-cyanGlow/70 hover:text-cyanGlow"
          >
            The-Key-Holders on GitHub →
          </a>
        </div>
      </div>

      {/* Hero / Intro - numbered 005 per handoff + home chapters */}
      <section className="section-padding border-b border-white/5">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyanGlow/70">
            005 • Open Source
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
            Curated repos
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-white/65">
            Not the full org dump — projects we stand behind and actively maintain. Ecosystem hub for thekeyholders.org. Real code under real constraints.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://github.com/The-Key-Holders/keyholders-site"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              This site on GitHub
            </a>
            <Link href="/changelog" className="btn-secondary">
              View Changelog →
            </Link>
            <Link href="/labs" className="btn-secondary">
              Reliability Suite in Labs →
            </Link>
          </div>
        </div>
      </section>

      {/* Curated cards - reuses exact glass-card + hover + accent patterns from labs/work + globals.css */}
      <section className="section-padding">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {curatedRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card group p-6 transition hover:border-cyanGlow/35"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{repo.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest text-white/30">{repo.org}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{repo.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/30 transition group-hover:text-cyanGlow">
                  View on GitHub →
                </span>
              </a>
            ))}
          </div>

          {/* Integrate advanced systems: link versions + changelog + api (glass-card for pattern match) */}
          <div className="mt-12">
            <div className="glass-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-2">
                Ecosystem advanced systems
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <Link href="/changelog" className="text-emeraldGlow hover:underline">Full Changelog (searchable, manual entries)</Link>
                <a href="/api/versions" target="_blank" rel="noopener" className="text-cyanGlow hover:underline">/api/versions (file tracking JSON)</a>
                <Link href="/work" className="text-emeraldGlow hover:underline">Work logs + file versions display</Link>
                <Link href="/labs" className="text-violetGlow hover:underline">Reliability Suite + simulators</Link>
              </div>
              <p className="mt-4 text-[10px] text-white/40">
                Tracked via lib/file-versions.ts (salvaged from GitHub MCP). Error logging in lib/utils. All tied to personas + tests. See docs/MODEL_HANDOFF.md.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <a
              href="https://github.com/The-Key-Holders"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow hover:underline"
            >
              Browse full The-Key-Holders organization →
            </a>
            <span className="mx-3 text-white/20">•</span>
            <a
              href="https://github.com/CupofJavad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow hover:underline"
            >
              CupofJavad personal →
            </a>
          </div>
        </div>
      </section>

      <Footer variant="parent" />
    </div>
  );
}
