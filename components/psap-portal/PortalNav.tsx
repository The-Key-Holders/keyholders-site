"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/psap-portal", label: "Home" },
  { href: "/psap-portal/contracts", label: "Contracts" },
  { href: "/psap-portal/funding", label: "Funding" },
  { href: "/psap-portal/faqs", label: "FAQs" },
  { href: "/psap-portal/tools", label: "Tools" },
  { href: "/psap-portal/news", label: "News" },
  { href: "/psap-portal/admin", label: "Admin" },
];

export default function PortalNav() {
  const pathname = usePathname() || "";
  return (
    <nav className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {LINKS.map((l) => {
        const active =
          l.href === "/psap-portal"
            ? pathname === "/psap-portal"
            : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={
              active
                ? "border-b-2 border-cyanGlow pb-0.5 font-semibold text-white"
                : "text-white/50 hover:text-white"
            }
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
