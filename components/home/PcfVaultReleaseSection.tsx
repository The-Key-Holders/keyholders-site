import Link from "next/link";

const HIGHLIGHTS = [
  {
    title: "Funding Paths",
    body: "Shared PSAP ↔ Advisor workspace: processes, TD-288 clocks, Cloud XOR On-Prem, dual-era profiles.",
  },
  {
    title: "PortablePost allotment",
    body: "Chapter III fixed allotment in-browser — ECaTS import, variance controls, Erlang, MPA $ worksheet.",
  },
  {
    title: "Invoice recon & FOR",
    body: "Victoria-style TD-288 match with traffic lights, plus FOR package tools for Branch desks.",
  },
  {
    title: "NorCal Branch polish",
    body: "Bear mark, Tower Bridge mood, badge-on-lanyard UI — professional, human, not a spreadsheet graveyard.",
  },
];

/**
 * Homepage feature strip for PCF Vault release — sits above the general projects grid.
 */
export default function PcfVaultReleaseSection() {
  return (
    <section
      id="pcf-vault"
      className="relative overflow-hidden border-t border-gold/20 bg-vault-950 section-padding"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "url(/pcf-vault/brand/bg-tower-bridge.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-vault-950 via-vault-950/92 to-vault-950" />
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-cyanGlow/10 blur-3xl" />

      <div className="container-narrow relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
            New release · July 2026
          </p>
          <div className="mt-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pcf-vault/brand/mark-bear-shield.jpg"
              alt="PCF Vault mark"
              className="h-20 w-20 rounded-2xl object-cover shadow-lg ring-2 ring-gold/30"
              width={80}
              height={80}
            />
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-gold via-goldLight to-cyanGlow bg-clip-text text-transparent">
              PCF Vault
            </span>
          </h2>
          <p className="mt-2 text-lg font-medium text-white/90">
            Path to Compliance &amp; Funding
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/65 sm:text-base">
            The CA 9-1-1 Branch desk app for PSAPs, Advisors, Supervisors, and vendors — Funding
            Paths, dual-era forms, PortablePost allotment, invoice recon, and role-aware coaching.
            Built for NorCal Branch reality: business casual, badge on a lanyard, zero robot voice.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pcf-vault/"
              className="btn-primary text-sm shadow-[0_0_24px_rgba(212,175,55,0.25)]"
            >
              Open PCF Vault →
            </Link>
            <Link href="/psap-portal" className="btn-secondary text-sm">
              Legacy PSAP portal
            </Link>
            <Link href="/advisor-tools" className="btn-secondary text-sm">
              Advisor tools hub
            </Link>
          </div>
          <p className="mt-3 text-xs text-white/45">
            Demo logins inside the vault · self-host beta on this site at{" "}
            <code className="text-cyanGlow/80">/pcf-vault</code>
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <article
              key={h.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition hover:border-gold/35 hover:bg-white/[0.07]"
            >
              <h3 className="text-sm font-semibold text-gold">{h.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-white/60">{h.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-widest text-white/40">
          <span>Cal OES CA 9-1-1</span>
          <span className="text-gold/50">·</span>
          <span>Chapter III Funding</span>
          <span className="text-gold/50">·</span>
          <span>TD-288 ≠ PO</span>
          <span className="text-gold/50">·</span>
          <span>Cloud XOR On-Prem</span>
        </div>
      </div>
    </section>
  );
}
