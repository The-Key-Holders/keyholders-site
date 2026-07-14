import BrandLogo from "@/components/BrandLogo";
import { projectsByKind, toolProjects } from "@/lib/projects";
import Link from "next/link";

interface FooterProps {
  variant?: "parent" | "trade";
}

export default function Footer({ variant = "parent" }: FooterProps) {
  const year = new Date().getFullYear();
  const ventures = projectsByKind("venture");
  const tools = toolProjects().filter((t) => t.status !== "planned" || t.id === "for-engine");

  if (variant === "trade") {
    return (
      <footer className="border-t border-gold/20 bg-vault-950">
        <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:items-start">
            <div className="flex flex-col items-center gap-3 sm:items-start">
              <BrandLogo variant="trade" size="footer" />
              <p className="text-sm text-white/45">a Key Holders company</p>
              <Link href="/" className="text-sm text-cyanGlow hover:underline">
                ← Back to The Key Holders
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/55">
              <Link href="/" className="transition hover:text-cyanGlow">
                Home
              </Link>
              <Link href="/projects" className="transition hover:text-cyanGlow">
                Projects
              </Link>
              <Link href="/trade#services" className="transition hover:text-gold">
                Services
              </Link>
              <Link href="/support" className="transition hover:text-cyanGlow">
                Support
              </Link>
              <Link href="/advisor-tools" className="transition hover:text-emeraldGlow">
                Tools
              </Link>
              <a href="mailto:javadkhoshnevisan@gmail.com" className="transition hover:text-gold">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/40">
            &copy; {year} Key Holders Trade. All rights reserved.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/10 bg-vault-950">
      <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <BrandLogo variant="parent" size="footer" />
            <p className="mt-4 text-sm text-white/50">
              Unlock your digital universe — ventures, tools, and labs under one roof.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Ventures</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              {ventures.map((v) => (
                <li key={v.id}>
                  {v.external || v.href.startsWith("http") ? (
                    <a href={v.href} target="_blank" rel="noopener noreferrer" className="hover:text-cyanGlow">
                      {v.name}
                    </a>
                  ) : (
                    <Link href={v.href} className="hover:text-cyanGlow">
                      {v.name}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <a
                  href="https://www.thegeeksnextdoor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyanGlow"
                >
                  Geeks Next Door
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Tools</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              {tools.map((t) => (
                <li key={t.id}>
                  <Link href={t.href} className="hover:text-emeraldGlow">
                    {t.name}
                    {t.gated ? " · gated" : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li>
                <Link href="/projects" className="hover:text-cyanGlow">
                  All projects
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-cyanGlow">
                  Support (Grok)
                </Link>
              </li>
              <li>
                <Link href="/#connect" className="hover:text-cyanGlow">
                  Connect
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/The-Key-Holders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyanGlow"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          &copy; {year} The Key Holders. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
