import Link from "next/link";

export function LabsSection() {
  return (
    <section id="labs" className="section-padding border-t border-white/5 bg-vault-900/50">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violetGlow/80">
            Labs
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Experiments in production
          </h2>
          <p className="mt-4 text-white/65">
            Legacy Vault and early prototypes live here — crypto estate planning,
            integrations, and tools we ship before they graduate to full ventures.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <a
            href="https://github.com/CupofJavad/Bitcoin_Estate_Planning_Tool_Rust"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card border-violetGlow/30 p-6 transition hover:border-violetGlow/60"
          >
            <h3 className="text-lg font-semibold text-white">Legacy Vault</h3>
            <p className="mt-2 text-sm text-white/60">
              Multi-chain estate planning — Rust API + Next.js. BTC, XMR, STX timelock
              policies.
            </p>
          </a>
          <div className="glass-card border-white/10 p-6 opacity-80">
            <h3 className="text-lg font-semibold text-white">More labs soon</h3>
            <p className="mt-2 text-sm text-white/60">
              FieldHub, scrapers, and integration prototypes — curated on{" "}
              <Link href="#github" className="text-cyanGlow hover:underline">
                /github
              </Link>{" "}
              when ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WorkSection() {
  return (
    <section id="work" className="section-padding bg-vault-950">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emeraldGlow/80">
            Work
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Mission logs
          </h2>
          <p className="mt-4 text-white/65">
            Real integrations and case studies — not roadmap placeholders.
          </p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <article className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-gold/80">Trade</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Garner Roofing</h3>
            <p className="mt-3 text-sm text-white/60">
              ServiceTitan cleanup, workflow fixes, and field-service optimization for a
              roofing contractor.
            </p>
            <Link href="/trade" className="mt-4 inline-block text-sm text-cyanGlow hover:underline">
              See Trade services →
            </Link>
          </article>
          <a
            href="https://github.com/The-Key-Holders/currentrms-google-sheets-sync"
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-6 transition hover:border-emeraldGlow/40"
          >
            <p className="text-xs uppercase tracking-widest text-emeraldGlow/80">Integration</p>
            <h3 className="mt-2 text-xl font-semibold text-white">CurrentRMS ↔ Sheets</h3>
            <p className="mt-3 text-sm text-white/60">
              Daily opportunity sync from Current RMS API to Google Sheets for event
              production reporting.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="section-padding border-t border-white/5">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-white">About The Key Holders</h2>
          <p className="mt-6 leading-relaxed text-white/65">
            The Key Holders is an umbrella for ventures that make technology work for
            real people — from neighborly tech support through{" "}
            <a
              href="https://www.thegeeksnextdoor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyanGlow hover:underline"
            >
              Geeks Next Door
            </a>
            , to contractor platform work through{" "}
            <Link href="/trade" className="text-gold hover:underline">
              Key Holders Trade
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
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
      name: "Starter Pack",
      desc: "Opinionated template for serious small apps.",
      href: "https://github.com/CupofJavad/Starter_Pack",
    },
  ];

  return (
    <section id="github" className="section-padding bg-vault-900/40">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white">Open source</h2>
          <p className="mt-4 text-white/60">Curated repos — not the full org dump.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {repos.map((repo) => (
            <a
              key={repo.name}
              href={repo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-5 transition hover:border-cyanGlow/40"
            >
              <h3 className="font-semibold text-white">{repo.name}</h3>
              <p className="mt-2 text-sm text-white/60">{repo.desc}</p>
            </a>
          ))}
        </div>
        <p className="mt-8 text-center">
          <a
            href="https://github.com/The-Key-Holders"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-cyanGlow hover:underline"
          >
            The-Key-Holders on GitHub →
          </a>
        </p>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="connect" className="section-padding border-t border-white/5">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-bold text-white">Connect</h2>
          <p className="mt-4 text-white/60">
            Consumer services, contractor integrations, or collabs — we respond within one
            business day.
          </p>
          <div className="glass-card mt-8 p-6 text-left">
            <p className="text-sm text-white/45">Email</p>
            <a
              href="mailto:javadkhoshnevisan@gmail.com"
              className="mt-1 block text-lg font-semibold text-cyanGlow hover:underline"
            >
              javadkhoshnevisan@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}