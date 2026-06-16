import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Mission logs — real integrations and case studies from The Key Holders. Garner Roofing ServiceTitan recovery (8 weeks, 30+ users, 98% mobile) and CurrentRMS ↔ Google Sheets sync for event production. Not roadmap placeholders.",
};

export default function WorkPage() {
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
            href="/trade"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-gold/70 hover:text-gold"
          >
            Contractor services (Trade) →
          </Link>
        </div>
      </div>

      {/* Hero / Intro */}
      <section className="section-padding border-b border-white/5">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emeraldGlow/70">
            004 • Work
          </p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-tighter text-white sm:text-6xl lg:text-7xl">
            Mission logs
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-relaxed text-white/65">
            Real integrations and case studies — not roadmap placeholders. Every engagement ships working systems, trains teams, and leaves measurable outcomes.
          </p>
          <div className="mt-8">
            <Link href="/trade#case-study" className="inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow hover:underline">
              Read the Garner case study in context on Trade →
            </Link>
          </div>
        </div>
      </section>

      {/* Garner Roofing — VERBATIM §16 narrative, metrics, work performed, disclaimer from MODEL_HANDOFF */}
      <section className="section-padding border-b border-white/5">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              Trade • Case Study
            </span>
          </div>

          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">
            Garner Roofing
          </h2>

          <div className="mx-auto mt-6 max-w-3xl">
            {/* Exact narrative from §16 */}
            <p className="text-lg leading-relaxed text-white/70">
              ServiceTitan instance at-risk (TitanAdvisor); dispatchers worked around system; field techs skipped mobile; reporting unreliable.
            </p>

            {/* Exact metrics from §16 / trade condensed version expanded here */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { metric: "8 weeks", label: "At-risk → healthy status" },
                { metric: "30+", label: "Active users onboarded" },
                { metric: "98%", label: "Mobile adoption (field team)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card border-gold/20 p-6 text-center"
                >
                  <p className="text-3xl font-bold text-gold">{stat.metric}</p>
                  <p className="mt-1 text-sm text-white/55">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Integrated generated on-theme cinematic image (dark vault editorial with gold key/service motifs) + additional for depth */}
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/reliability-operations.jpg"
                alt="Garner Roofing case study - cinematic dark scene with glowing gold key motifs and field-service tech, vault editorial"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vault-950/80 to-transparent p-6 flex items-end">
                <p className="text-sm text-white/80">High-tech field-service rescue — matching the dark cinematic vault theme with gold/teal glows</p>
              </div>
            </div>
            <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/field-tech-key.jpg"
                alt="Mission log visual - field production with glowing key motifs in editorial dark style"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vault-950/70 to-transparent p-6 flex items-end">
                <p className="text-sm text-white/80">Ship. Measure. Hand off. — additional cinematic context for CurrentRMS + Garner integrations</p>
              </div>
            </div>
            {/* Additional generated on-theme image integration for Garner (enhanced /work per winner bundle; dark vault, gold key/service motifs, glass overlay + editorial caption) */}
            <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/images/garner-gold-service.jpg"
                alt="Garner Roofing field-service cinematic with glowing gold key motifs in dark vault-950, editorial premium"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vault-950/80 to-transparent p-6 flex items-end">
                <p className="text-sm text-white/80">Garner mission log • ServiceTitan recovery with vault-key editorial</p>
              </div>
            </div>

            {/* Exact work performed bullets from §16 */}
            <div className="glass-card mt-8 p-8">
              <h3 className="font-semibold text-white">Work performed</h3>
              <ul className="mt-4 space-y-2 text-sm text-white/65">
                <li>• Health Check for workflow/integration gaps</li>
                <li>• Dispatch board rules + job-type automations rebuilt</li>
                <li>• Pricebook Pro sync fixes</li>
                <li>• Three role-based training sprints</li>
                <li>• Weekly check-ins for 8 weeks</li>
              </ul>

              {/* Exact disclaimer from §16 */}
              <p className="mt-6 text-sm italic text-white/40">
                Single-client results; outcomes vary.
              </p>
            </div>

            <p className="mt-6 text-sm text-white/55">
              Full context and the Health Check guarantee live on the{" "}
              <Link href="/trade#case-study" className="text-cyanGlow underline underline-offset-2">
                Trade case study page
              </Link>
              . The same engagement is also surfaced under contractor services for prospects.
            </p>
          </div>
        </div>
      </section>

      {/* CurrentRMS Integration — expanded from GitHub section */}
      <section className="section-padding border-b border-white/5 bg-vault-900/30">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-emeraldGlow/30 bg-emeraldGlow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emeraldGlow">
              Integration
            </span>
          </div>

          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">
            CurrentRMS ↔ Google Sheets Sync
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/65">
            Daily opportunity sync from Current RMS API to Google Sheets for event production reporting. Keeps leadership and ops teams aligned without manual exports.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-8">
              <h3 className="font-semibold text-white">Problem solved</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/65">
                <li>• Event production company needed reliable daily rollups of opportunities and jobs</li>
                <li>• CurrentRMS API access existed but reporting was fragmented across tools</li>
                <li>• Leadership relied on stale or manually copied data in Sheets</li>
              </ul>
            </div>
            <div className="glass-card p-8">
              <h3 className="font-semibold text-white">Delivery</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/65">
                <li>• Authenticated sync job running daily (serverless or scheduled)</li>
                <li>• Clean mapping of opportunities, statuses, and custom fields into Sheets</li>
                <li>• Idempotent writes + clear error logging for ops visibility</li>
                <li>• Zero ongoing maintenance after handoff</li>
              </ul>
              <a
                href="https://github.com/The-Key-Holders/currentrms-google-sheets-sync"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emeraldGlow hover:underline"
              >
                View source on GitHub →
              </a>
            </div>
          </div>

          {/* Added on-theme visual for CurrentRMS integration depth */}
          <div className="mt-6 relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 mx-auto">
            <Image
              src="/images/keys-chain.jpg"
              alt="CurrentRMS sync — linked keys and data chains cinematic dark vault editorial with emerald accents"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-vault-950/70 to-transparent p-5 flex items-end">
              <p className="text-xs text-white/70">Daily sync • Idempotent • Zero-maintenance handoff</p>
            </div>
          </div>
          {/* Additional image integration + overlay for CurrentRMS (per winner bundle enhanced /work) */}
          <div className="mt-4 relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 mx-auto">
            <Image
              src="/images/keys-interlock.jpg"
              alt="Interlocking keys for data sync — cinematic vault-950 editorial with emerald accents"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-vault-950/70 to-transparent p-5 flex items-end">
              <p className="text-xs text-white/70">Linked systems • Reliable handoff</p>
            </div>
          </div>
          {/* Additional generated on-theme image (work-field-cinematic.jpg) co-located in CurrentRMS section (exact fill/object-cover/gradient editorial caption pattern) */}
          <div className="mt-4 relative aspect-video w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 mx-auto">
            <Image
              src="/images/work-field-cinematic.jpg"
              alt="Work field cinematic — mission log visual with key motifs in dark vault editorial"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-vault-950/70 to-transparent p-5 flex items-end">
              <p className="text-xs text-white/70">Field ops • Cinematic context</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy / next logs */}
      <section className="section-padding">
        <div className="container-narrow px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">How we work</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">Ship. Measure. Hand off.</h2>
            <p className="mt-4 text-white/60">
              Every log here represents completed work with real clients or internal tooling that powers the ventures. No vaporware, no decks. When a project graduates from Labs or Trade, the mission log moves here.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/trade" className="btn-gold">
                Explore contractor services
              </Link>
              <a
                href="https://github.com/The-Key-Holders"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                Follow the org on GitHub
              </a>
              <Link href="/" className="btn-secondary">
                Return to hub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="parent" />
    </div>
  );
}
