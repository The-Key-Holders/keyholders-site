"use client";

import { usePersona } from "@/components/psap-portal/PersonaProvider";
import { PERSONAS, type PortalPersona } from "@/lib/psap-portal/personas";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type LinkItem = { href: string; label: string; exact?: boolean };

const NAV: Record<PortalPersona, { primary: LinkItem[]; more: LinkItem[] }> = {
  psap: {
    primary: [
      { href: "/psap-portal/psap", label: "PSAP home", exact: true },
      { href: "/psap-portal/pathfinder", label: "Pathfinder" },
      { href: "/psap-portal/start", label: "Start here" },
      { href: "/psap-portal/tools", label: "Tools path" },
      { href: "/psap-portal/faqs", label: "FAQs" },
    ],
    more: [
      { href: "/psap-portal/news", label: "News" },
      { href: "/psap-portal/contracts", label: "Contracts" },
      { href: "/psap-portal/funding", label: "Funding" },
      { href: "/psap-portal/access", label: "Request access" },
      { href: "/psap-portal/tools/advisor-lookup", label: "My Advisor" },
      { href: "/psap-portal/tools/submit-question", label: "Ask a question" },
    ],
  },
  advisor: {
    primary: [
      { href: "/psap-portal/advisor/dashboard", label: "Ops dashboard" },
      { href: "/psap-portal/pathfinder", label: "Pathfinder" },
      { href: "/psap-portal/advisor", label: "Content desk", exact: true },
      { href: "/psap-portal/advisor/process-map", label: "Process map" },
      { href: "/psap-portal/advisor/pain-points", label: "Pain points" },
      { href: "/psap-portal/tools", label: "QC tools" },
    ],
    more: [
      { href: "/psap-portal/advisor/requests", label: "Requests" },
      { href: "/psap-portal/news", label: "News" },
      { href: "/psap-portal/tools/advisor-lookup", label: "Directory" },
      { href: "/psap-portal/admin", label: "Admin / access" },
      { href: "/psap-allotment", label: "Allotment Engine" },
      { href: "/advisor-tools", label: "Advisor Tools hub" },
    ],
  },
  admin: {
    primary: [
      { href: "/psap-portal/admin", label: "Admin console", exact: true },
      { href: "/psap-portal/news", label: "News (public view)" },
      { href: "/psap-portal/psap", label: "PSAP view" },
      { href: "/psap-portal/advisor", label: "Advisor view" },
    ],
    more: [{ href: "/psap-portal/start", label: "About / beta" }],
  },
};

function NavLink({
  href,
  label,
  exact,
  pathname,
}: {
  href: string;
  label: string;
  exact?: boolean;
  pathname: string;
}) {
  const active = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={
        active
          ? "border-b-2 border-cyanGlow pb-0.5 font-semibold text-white"
          : "text-white/50 hover:text-white"
      }
    >
      {label}
    </Link>
  );
}

export default function PortalNav() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { persona, setPersona, clearPersona, ready } = usePersona();

  if (!ready) {
    return <div className="h-8 animate-pulse rounded bg-white/5" />;
  }

  if (!persona) {
    return (
      <p className="text-xs text-white/45">
        Choose a role on the{" "}
        <Link href="/psap-portal" className="text-cyanGlow hover:underline">
          portal entry
        </Link>{" "}
        to load navigation.
      </p>
    );
  }

  const nav = NAV[persona];
  const meta = PERSONAS[persona];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={
            persona === "advisor"
              ? "rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold"
              : persona === "admin"
                ? "rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-200"
                : "rounded-full border border-cyanGlow/40 bg-cyanGlow/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-cyanGlow"
          }
        >
          Viewing as {meta.short}
        </span>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(PERSONAS) as PortalPersona[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setPersona(p);
                router.push(PERSONAS[p].home);
              }}
              className={
                p === persona
                  ? "rounded px-2 py-0.5 text-[10px] font-semibold text-white/90"
                  : "rounded px-2 py-0.5 text-[10px] text-white/40 hover:bg-white/5 hover:text-white/70"
              }
            >
              {PERSONAS[p].short}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              clearPersona();
              router.push("/psap-portal");
            }}
            className="rounded px-2 py-0.5 text-[10px] text-white/30 hover:text-white/60"
          >
            Switch…
          </button>
        </div>
      </div>
      <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" aria-label="Primary">
        {nav.primary.map((l) => (
          <NavLink key={l.href} {...l} pathname={pathname} />
        ))}
      </nav>
      <nav
        className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-white/35"
        aria-label="More"
      >
        <span className="font-semibold uppercase tracking-wider text-white/25">More</span>
        {nav.more.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              pathname.startsWith(l.href) ? "text-cyanGlow/90" : "hover:text-white/70"
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
