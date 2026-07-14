import Link from "next/link";

const pillars = [
  {
    title: "Consumer",
    blurb: "Geeks Next Door — tech help that shows up.",
    href: "https://www.thegeeksnextdoor.com",
    accent: "text-cyanGlow",
    external: true,
  },
  {
    title: "Trade",
    blurb: "Contractor platforms & ServiceTitan work.",
    href: "/trade",
    accent: "text-gold",
    external: false,
  },
  {
    title: "Professional tools",
    blurb: "Advisor automations (sign-in required).",
    href: "/advisor-tools",
    accent: "text-emeraldGlow",
    external: false,
  },
  {
    title: "Labs",
    blurb: "FieldHub, Legacy Vault, open source.",
    href: "/projects",
    accent: "text-violetGlow",
    external: false,
  },
];

export default function PortfolioStrip() {
  return (
    <section className="border-t border-white/5 bg-vault-900/40 py-12">
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
          The portfolio
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => {
            const className =
              "glass-card block p-5 transition hover:border-cyanGlow/35 hover:bg-white/[0.06]";
            const body = (
              <>
                <h3 className={`font-display text-lg font-semibold ${p.accent}`}>{p.title}</h3>
                <p className="mt-2 text-sm text-white/60">{p.blurb}</p>
              </>
            );
            return p.external ? (
              <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer" className={className}>
                {body}
              </a>
            ) : (
              <Link key={p.title} href={p.href} className={className}>
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
