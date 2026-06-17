import ChapterSection from "@/components/layout/ChapterSection";
import Link from "next/link";
import Image from "next/image";

export function LabsSection() {
  return (
    <ChapterSection
      id="labs"
      chapter="003"
      label="Labs"
      title="Experiments in production"
      description="Legacy Vault and early prototypes live here — crypto estate planning, integrations, and tools we ship before they graduate to full ventures."
      accent="violet"
      className="bg-vault-900/50"
      align="left"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href="https://github.com/CupofJavad/Bitcoin_Estate_Planning_Tool_Rust"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl border border-violetGlow/20 bg-white/[0.03] p-6 transition hover:border-violetGlow/50"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violetGlow/70">
            Flagship
          </p>
          <h3 className="mt-2 font-display text-xl font-bold text-white">Legacy Vault</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Multi-chain estate planning — Rust API + Next.js. BTC, XMR, STX timelock policies.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/35 transition group-hover:text-violetGlow">
            View repo →
          </span>
        </a>
        <a
          href="/labs"
          className="group rounded-2xl border border-violetGlow/20 bg-white/[0.03] p-6 transition hover:border-violetGlow/50"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-violetGlow/70">
            Pipeline • Live
          </p>
          <h3 className="mt-2 font-display text-xl font-bold text-white">FieldHub</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            2026 work-order brokering platform (Geeks Next Door). Orders via API/EDI/WebHooks → dispatch to field-tech platforms. Production deployed.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/35 transition group-hover:text-violetGlow">
            Explore on /labs &amp; GitHub →
          </span>
        </a>
      </div>

      {/* Teaser for new Reliability Suite depth (salvaged + simulator in /labs) */}
      <p className="mt-4 text-xs text-white/40">
        New in Labs: <Link href="/labs" className="text-violetGlow hover:underline">Reliability Suite</Link> (76-project roadmap + interactive preview).
      </p>
    </ChapterSection>
  );
}

export function WorkSection() {
  return (
    <ChapterSection
      id="work"
      chapter="004"
      label="Work"
      title="Mission logs"
      description="Real integrations and case studies — not roadmap placeholders."
      accent="emerald"
      className="bg-vault-950"
      align="left"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-gold/20 bg-white/[0.03] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/70">Trade</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">Garner Roofing</h3>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            ServiceTitan cleanup, workflow fixes, and field-service optimization for a roofing
            contractor — from at-risk TitanAdvisor status to healthy adoption in eight weeks.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { m: "8 wks", l: "Recovery" },
              { m: "30+", l: "Users" },
              { m: "98%", l: "Mobile" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-white/10 p-3 text-center">
                <p className="font-display text-lg font-bold text-gold">{s.m}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/40">{s.l}</p>
              </div>
            ))}
          </div>
          <Link
            href="/trade#case-study"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow hover:underline"
          >
            Read case study →
          </Link>
        </article>
        <a
          href="https://github.com/The-Key-Holders/currentrms-google-sheets-sync"
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl border border-emeraldGlow/20 bg-white/[0.03] p-6 transition hover:border-emeraldGlow/45"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emeraldGlow/70">
            Integration
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold text-white">
            CurrentRMS ↔ Sheets
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            Daily opportunity sync from Current RMS API to Google Sheets for event production
            reporting.
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/35 transition group-hover:text-emeraldGlow">
            View repo →
          </span>
        </a>
      </div>

      {/* Additive link to dedicated /changelog (new page). Follows existing Link + emerald patterns. */}
      <div className="mt-4">
        <Link href="/changelog" className="text-sm text-emeraldGlow hover:underline">
          Full Changelog (searchable + manual entry) →
        </Link>
      </div>
    </ChapterSection>
  );
}

export function GithubSection() {
  const repos = [
    {
      name: "FieldHub",
      desc: "Geeks Next Door 2026 work-order brokering monorepo.",
      href: "https://github.com/CupofJavad/FieldHub",
    },
    {
      name: "Legacy Vault",
      desc: "Bitcoin-native estate planning — Rust + Next.js.",
      href: "https://github.com/CupofJavad/Bitcoin_Estate_Planning_Tool_Rust",
    },
    {
      name: "CurrentRMS Sync",
      desc: "Event production API → Google Sheets pipeline.",
      href: "https://github.com/The-Key-Holders/currentrms-google-sheets-sync",
    },
    {
      name: "Reliability Infrastructure Roadmap",
      desc: "Public portfolio & roadmap of 76 reliability and infrastructure projects.",
      href: "https://github.com/The-Key-Holders/reliability-infrastructure-roadmap",
    },
    {
      name: "Resilience Testing Toolkit",
      desc: "Safe chaos engineering • failure injection & latency shaping for small teams.",
      href: "https://github.com/The-Key-Holders/resilience-testing-toolkit",
    },
    {
      name: "Personal Temporal Assistant",
      desc: "AI command center for Gmail, Calendar, and partner planning. Constraint-aware governance.",
      href: "https://github.com/CupofJavad/Personal_Assistant",
    },
    {
      name: "Starter Pack",
      desc: "Opinionated template for serious small apps.",
      href: "https://github.com/CupofJavad/Starter_Pack",
    },
    {
      name: "Infrastructure Drift Detector",
      desc: "Terraform / CDK drift detection — part of the 76-project reliability suite.",
      href: "https://github.com/The-Key-Holders/infrastructure-drift-detector",
    },
    {
      name: "Zero-Downtime Migration Orchestrator",
      desc: "Coordinated database & infra migrations. From the active reliability development track.",
      href: "https://github.com/The-Key-Holders/zero-downtime-migration-orchestrator",
    },
    {
      name: "Incident Postmortems Collection",
      desc: "Educational incident reports + reliability practices (completed & battle-tested).",
      href: "https://github.com/The-Key-Holders/incident-postmortems-collection",
    },
  ];

  return (
    <ChapterSection
      id="github"
      chapter="005"
      label="Open Source"
      title="Curated repos"
      description="Not the full org dump — projects we stand behind and actively maintain."
      accent="cyan"
      className="bg-vault-900/40"
    >
      {/* Visual polish: cinematic key banner using generated vault asset with glass overlay + additional new generated reliability grid for depth */}
      <div className="relative mb-8 aspect-[16/6] w-full overflow-hidden rounded-2xl border border-white/10">
        <Image
          src="/images/keys-chain.jpg"
          alt="Cinematic interlocking keys and chains in deep vault — open source curation visual"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-vault-950/85 via-vault-950/40 to-transparent" />
        <div className="absolute inset-0 flex items-center p-8">
          <p className="text-sm text-white/70 max-w-xs">Real code. Real constraints. Shipping in the open — including the full reliability portfolio. See full depth + interactive preview in <span className="text-cyanGlow/80">/labs</span>.</p>
        </div>
      </div>
      <div className="relative mb-6 aspect-[16/5] w-full overflow-hidden rounded-2xl border border-white/10">
        <Image
          src="/images/reliability-grid.jpg"
          alt="Reliability infrastructure grid cinematic dark with emerald cyan node/key motifs — curated OSS visual"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vault-950/80 to-transparent p-6 flex items-end">
          <p className="text-sm text-white/80">76 projects across foundational, active, and stable — drift detectors, resilience toolkits, policy guardrails, and production patterns now part of the curated feed.</p>
        </div>
      </div>
      {/* Additional on-theme banner integration in GithubSection (home) using generated vault editorial image for full bundle visuals */}
      <div className="relative mb-6 aspect-[16/5] w-full overflow-hidden rounded-2xl border border-white/10">
        <Image
          src="/images/reliability-suite.jpg"
          alt="Reliability Suite dashboard preview cinematic dark vault-950 with glowing cyan/gold keys and infra nodes, editorial"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vault-950/80 to-transparent p-6 flex items-end">
          <p className="text-sm text-white/80">Reliability Suite preview • Interactive simulator + full roadmap in /labs</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyanGlow/35"
          >
            <h3 className="font-semibold text-white">{repo.name}</h3>
            <p className="mt-2 text-sm text-white/55">{repo.desc}</p>
            <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-white/30 transition group-hover:text-cyanGlow">
              GitHub →
            </span>
          </a>
        ))}
      </div>
      <p className="mt-8">
        <Link href="/github" className="text-sm font-semibold text-cyanGlow hover:underline">
          Full curated list + ecosystem tools →
        </Link>
        <span className="mx-2 text-white/20">•</span>
        <a
          href="https://github.com/The-Key-Holders"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-cyanGlow hover:underline"
        >
          The-Key-Holders on GitHub →
        </a>
      </p>
    </ChapterSection>
  );
}

export function ContactSection() {
  return (
    <ChapterSection
      id="connect"
      chapter="007"
      label="Connect"
      title="Start a conversation"
      description="Consumer services, contractor integrations, or collabs — we respond within one business day."
      accent="cyan"
    >
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">Email</p>
        <a
          href="mailto:javadkhoshnevisan@gmail.com"
          className="mt-3 block font-display text-xl font-bold text-cyanGlow hover:underline sm:text-2xl"
        >
          javadkhoshnevisan@gmail.com
        </a>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="https://www.thegeeksnextdoor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Get Tech Help
          </a>
          <Link href="/trade" className="btn-secondary">
            Contractor Services
          </Link>
        </div>
      </div>
    </ChapterSection>
  );
}