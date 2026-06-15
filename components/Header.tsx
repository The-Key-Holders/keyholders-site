"use client";

import BrandLogo from "@/components/BrandLogo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Hub" },
  { href: "/#labs", label: "Labs" },
  { href: "/#work", label: "Work" },
  { href: "/trade", label: "Trade" },
  { href: "/#connect", label: "Connect" },
];

export default function Header() {
  const pathname = usePathname();
  const isTrade = pathname.startsWith("/trade");
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md transition-colors",
        isTrade
          ? "border-gold/20 bg-vault-950/90"
          : "border-white/10 bg-vault-950/75"
      )}
    >
      <div className="container-narrow flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo variant={isTrade ? "trade" : "parent"} />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? isHome
                : link.href.startsWith("/#")
                  ? isHome
                  : pathname.startsWith(link.href);

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

        <Link
          href="https://www.thegeeksnextdoor.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary hidden text-xs sm:inline-flex sm:px-4 sm:py-2"
        >
          Get Tech Help
        </Link>
      </div>
    </header>
  );
}