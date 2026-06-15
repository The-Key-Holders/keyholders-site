import ChapterSection from "@/components/layout/ChapterSection";
import Link from "next/link";

const metrics = [
  { value: "3", label: "Active ventures" },
  { value: "6+", label: "Shipped integrations" },
  { value: "1", label: "Human + AI founding team" },
];

const ventures = [
  {
    name: "Geeks Next Door",
    chapter: "Consumer",
    description:
      "Neighborly tech support for homes and small businesses — the front door to The Key Holders.",
    href: "https://www.thegeeksnextdoor.com",
    external: true,
    cta: "Visit site",
    accent: "border-cyanGlow/25 hover:border-cyanGlow/50",
  },
  {
    name: "Key Holders Trade",
    chapter: "Contractors",
    description:
      "ServiceTitan diagnostics, integrations, and training for HVAC, plumbing, and roofing teams.",
    href: "/trade",
    external: false,
    cta: "Explore Trade",
    accent: "border-gold/25 hover:border-gold/50",
  },
  {
    name: "Labs",
    chapter: "R&D",
    description:
      "Legacy Vault, FieldHub prototypes, and experiments we ship before they graduate to full ventures.",
    href: "/labs",
    external: false,
    cta: "See labs",
    accent: "border-violetGlow/25 hover:border-violetGlow/50",
  },
];

export default function VenturesSection() {
  return (
    <ChapterSection
      id="ventures"
      chapter="002"
      label="Ventures"
      title="Built for operators, not slide decks"
      description="Each venture solves a specific job — consumer support, contractor systems, or early R&D. One umbrella, multiple keys."
      accent="cyan"
      className="bg-vault-950"
      align="left"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center sm:text-left"
          >
            <p className="font-display text-4xl font-bold text-cyanGlow">{m.value}</p>
            <p className="mt-1 text-sm text-white/50">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {ventures.map((v) => {
          const card = (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                {v.chapter}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold text-white">{v.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">
                {v.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyanGlow/80">
                {v.cta}
                <span aria-hidden>→</span>
              </span>
            </>
          );

          const className = `flex flex-col rounded-2xl border bg-white/[0.02] p-6 transition duration-300 ${v.accent}`;

          return v.external ? (
            <a
              key={v.name}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {card}
            </a>
          ) : (
            <Link key={v.name} href={v.href} className={className}>
              {card}
            </Link>
          );
        })}
      </div>
    </ChapterSection>
  );
}