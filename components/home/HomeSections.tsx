import PortfolioStrip from "@/components/PortfolioStrip";
import ProjectCard from "@/components/ProjectCard";
import { featuredProjects, githubProjects } from "@/lib/projects";
import Link from "next/link";

export function PortfolioSection() {
  return <PortfolioStrip />;
}

export function ProjectsSection() {
  const featured = featuredProjects();
  return (
    <section id="projects" className="section-padding border-t border-white/5 bg-vault-950">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyanGlow/80">Projects</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">One portfolio, many keys</h2>
          <p className="mt-4 text-white/65">
            Ventures, professional tools, and labs — including Advisor Tools shipped for real workflows, not
            demoware. Password-gated tools are labeled; the rest are public.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link href="/projects" className="btn-secondary text-sm">
            Full project directory →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function WorkSection() {
  return (
    <section id="work" className="section-padding bg-vault-900/40">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emeraldGlow/80">Selected work</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Mission logs</h2>
          <p className="mt-4 text-white/65">Real integrations and field outcomes — not roadmap placeholders.</p>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <article className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-gold/80">Trade</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Garner Roofing</h3>
            <p className="mt-3 text-sm text-white/60">
              ServiceTitan cleanup, workflow fixes, and field-service optimization for a roofing contractor.
            </p>
            <Link href="/trade" className="mt-4 inline-block text-sm text-cyanGlow hover:underline">
              See Trade services →
            </Link>
          </article>
          <article className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-emeraldGlow/80">Integration</p>
            <h3 className="mt-2 text-xl font-semibold text-white">CurrentRMS ↔ Sheets</h3>
            <p className="mt-3 text-sm text-white/60">
              Daily opportunity sync from Current RMS API to Google Sheets for event production reporting.
            </p>
            <a
              href="https://github.com/The-Key-Holders/currentrms-google-sheets-sync"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-cyanGlow hover:underline"
            >
              View on GitHub →
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}

export function GithubSection() {
  const repos = githubProjects().filter((p) =>
    ["fieldhub", "legacy-vault", "currentrms-sync", "starter-pack", "web-scraper-gui"].includes(p.id)
  );

  return (
    <section id="github" className="section-padding border-t border-white/5">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white">Open source</h2>
          <p className="mt-4 text-white/60">
            Curated repos from the same catalog — not a raw org dump.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.github || repo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-5 transition hover:border-cyanGlow/40"
            >
              <h3 className="font-semibold text-white">{repo.name}</h3>
              <p className="mt-2 text-sm text-white/60">{repo.summary}</p>
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

export function AboutSection() {
  return (
    <section id="about" className="section-padding border-t border-white/5 bg-vault-900/30">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold text-white">About The Key Holders</h2>
          <p className="mt-6 leading-relaxed text-white/65">
            The Key Holders is an umbrella for ventures that make technology work for real people and real
            operations — neighborly support through{" "}
            <a
              href="https://www.thegeeksnextdoor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyanGlow hover:underline"
            >
              Geeks Next Door
            </a>
            , contractor platforms through{" "}
            <Link href="/trade" className="text-gold hover:underline">
              Key Holders Trade
            </Link>
            , and password-protected{" "}
            <Link href="/advisor-tools" className="text-emeraldGlow hover:underline">
              Advisor Tools
            </Link>{" "}
            for professional 9-1-1 funding workflows — plus labs we ship in the open on GitHub.
          </p>
        </div>
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
            Consumer services, contractor integrations, professional tools, or collabs — we respond within one
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

/** @deprecated Labs folded into Projects catalog — kept for any old imports */
export function LabsSection() {
  return null;
}
