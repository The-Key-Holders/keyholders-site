"use client";

import BrandLogo from "@/components/BrandLogo";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ventures = [
  {
    name: "Geeks Next Door",
    tagline: "Neighborly tech support",
    href: "https://www.thegeeksnextdoor.com",
    external: true,
    accent: "cyan",
  },
  {
    name: "Key Holders Trade",
    tagline: "ServiceTitan integrations",
    href: "/trade",
    external: false,
    accent: "gold",
  },
  {
    name: "Labs",
    tagline: "Experiments in production",
    href: "/#labs",
    external: false,
    accent: "violet",
  },
  {
    name: "Work",
    tagline: "Shipped mission logs",
    href: "/#work",
    external: false,
    accent: "emerald",
  },
];

const explore = [
  { label: "Hub", href: "/" },
  { label: "Founders", href: "/#founders" },
  { label: "Open Source", href: "/#github" },
  { label: "Connect", href: "/#connect" },
];

export default function OverlayMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isTrade = pathname.startsWith("/trade");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition",
          isTrade
            ? "border-gold/25 bg-gold/5 text-gold hover:border-gold/40"
            : "border-white/15 bg-white/5 text-white/80 hover:border-cyanGlow/30 hover:text-white"
        )}
        aria-expanded={open}
        aria-controls="site-overlay-menu"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
        <span className="hidden sm:inline">Menu</span>
      </button>

      <div
        id="site-overlay-menu"
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[100] transition duration-300",
          open ? "pointer-events-auto visible" : "pointer-events-none invisible"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-vault-950/95 backdrop-blur-xl transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
          aria-hidden
        />

        <div
          className={cn(
            "relative flex h-full flex-col transition duration-500 ease-out",
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          <div className="container-narrow flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
            <BrandLogo variant={isTrade ? "trade" : "parent"} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/15 p-2 text-white/70 transition hover:border-white/30 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="container-narrow flex flex-1 flex-col gap-12 overflow-y-auto px-4 pb-12 sm:px-6 lg:flex-row lg:gap-20 lg:px-8">
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                Ventures
              </p>
              <ul className="mt-6 space-y-1">
                {ventures.map((venture) => {
                  const inner = (
                    <>
                      <span className="block font-display text-2xl font-bold text-white transition group-hover:text-cyanGlow sm:text-3xl lg:text-4xl">
                        {venture.name}
                      </span>
                      <span className="mt-1 block text-sm text-white/45">
                        {venture.tagline}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/35 transition group-hover:text-cyanGlow/80">
                        Explore
                        <span aria-hidden>→</span>
                      </span>
                    </>
                  );

                  return (
                    <li key={venture.name} className="border-b border-white/5 py-6">
                      {venture.external ? (
                        <a
                          href={venture.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block"
                          onClick={() => setOpen(false)}
                        >
                          {inner}
                        </a>
                      ) : (
                        <Link
                          href={venture.href}
                          className="group block"
                          onClick={() => setOpen(false)}
                        >
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="lg:w-64">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/40">
                Explore
              </p>
              <ul className="mt-6 space-y-4">
                {explore.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-display text-lg text-white/70 transition hover:text-cyanGlow"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-12 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-widest text-white/35">Connect</p>
                <a
                  href="mailto:javadkhoshnevisan@gmail.com"
                  className="mt-2 block text-sm text-cyanGlow hover:underline"
                >
                  javadkhoshnevisan@gmail.com
                </a>
                <Link
                  href="https://www.thegeeksnextdoor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6 inline-flex text-xs"
                  onClick={() => setOpen(false)}
                >
                  Get Tech Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}