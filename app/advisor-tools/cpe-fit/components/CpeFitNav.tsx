"use client";

import { CPE_FIT_BASE } from "@/lib/cpe-fit/public-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default function CpeFitNav() {
  const pathname = usePathname() || "";
  const estimateActive = pathname.startsWith(`${CPE_FIT_BASE}/estimate`);
  const positionsActive = pathname.startsWith(`${CPE_FIT_BASE}/positions`);
  const homeActive = pathname === CPE_FIT_BASE || pathname === `${CPE_FIT_BASE}/`;

  return (
    <header className="top">
      <Link className="brand" href={CPE_FIT_BASE}>
        CPE <b>Fit</b>
      </Link>
      <nav>
        <Link href={CPE_FIT_BASE} aria-current={homeActive ? "page" : undefined}>
          How it works
        </Link>
        <Link href={`${CPE_FIT_BASE}/estimate`} aria-current={estimateActive ? "page" : undefined}>
          Estimate
        </Link>
        <Link
          href={`${CPE_FIT_BASE}/positions`}
          aria-current={positionsActive ? "page" : undefined}
        >
          Positions helper
        </Link>
        <SignOutButton />
      </nav>
    </header>
  );
}
