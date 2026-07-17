"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY = [
  { href: "/psap-portal/start", label: "Start here" },
  { href: "/psap-portal", label: "Home", exact: true },
  { href: "/psap-portal/tools", label: "Tools path" },
  { href: "/psap-portal/faqs", label: "FAQs" },
  { href: "/psap-portal/news", label: "News" },
];

const MORE = [
  { href: "/psap-portal/contracts", label: "Contracts" },
  { href: "/psap-portal/funding", label: "Funding" },
  { href: "/psap-portal/processes", label: "Processes" },
  { href: "/psap-portal/support", label: "Support" },
  { href: "/psap-portal/documents", label: "Documents" },
  { href: "/psap-portal/admin", label: "Admin" },
];

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
  return (
    <div className="flex flex-col gap-2">
      <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" aria-label="Primary">
        {PRIMARY.map((l) => (
          <NavLink key={l.href} {...l} pathname={pathname} />
        ))}
      </nav>
      <nav
        className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-white/35"
        aria-label="More"
      >
        <span className="font-semibold uppercase tracking-wider text-white/25">More</span>
        {MORE.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              pathname.startsWith(l.href)
                ? "text-cyanGlow/90"
                : "hover:text-white/70"
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
