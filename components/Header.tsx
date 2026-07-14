"use client";

import BrandLogo from "@/components/BrandLogo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/trade", label: "Trade" },
  { href: "/support", label: "Support" },
  { href: "/advisor-tools", label: "Tools" },
  { href: "/#connect", label: "Connect" },
];

function linkActive(pathname: string, href: string, isHome: boolean): boolean {
  if (href === "/") return isHome;
  if (href.startsWith("/#")) return isHome;
  if (href === "/advisor-tools") {
    return pathname.startsWith("/advisor-tools") || pathname.startsWith("/psap-allotment");
  }
  return pathname.startsWith(href);
}

export default function Header() {
  const pathname = usePathname();
  const isTrade = pathname.startsWith("/trade");
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-colors",
        isTrade ? "border-gold/20 bg-vault-950/90" : "border-white/10 bg-vault-950/75"
      )}
    >
      <div className="container-narrow flex h-[4.25rem] items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <BrandLogo variant={isTrade ? "trade" : "parent"} size="header" />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = linkActive(pathname, link.href, isHome);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? isTrade
                      ? "bg-gold/15 text-gold"
                      : "bg-cyanGlow/10 text-cyanGlow"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="https://www.thegeeksnextdoor.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden text-xs sm:inline-flex sm:px-4 sm:py-2"
          >
            Get Tech Help
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 p-2 text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-vault-950/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium",
                  linkActive(pathname, link.href, isHome)
                    ? "bg-cyanGlow/10 text-cyanGlow"
                    : "text-white/75 hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://www.thegeeksnextdoor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-2 justify-center text-sm"
            >
              Get Tech Help
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
