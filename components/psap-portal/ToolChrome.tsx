"use client";

import { PROCESS_STEPS, matchProcessStep } from "@/lib/psap-portal/process-path";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";

/** Prev / next controls for sequential tools */
export default function ToolChrome({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname() || "";
  const current = matchProcessStep(pathname);
  if (!current || current.step < 2) return children ? <>{children}</> : null;

  const prev = PROCESS_STEPS.find((s) => s.step === current.step - 1);
  const next = PROCESS_STEPS.find((s) => s.step === current.step + 1);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
      <div className="text-xs text-white/45">
        <span className="font-semibold text-cyanGlow">Step {current.step} of 7</span>
        <span className="mx-2 text-white/20">·</span>
        <span>{current.when}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {prev && (
          <Link href={prev.href} className={portal.btnSecondary + " !py-1.5 !text-xs"}>
            ← {prev.short}
          </Link>
        )}
        {next && (
          <Link href={next.href} className={portal.btnPrimary + " !py-1.5 !text-xs"}>
            Next: {next.short} →
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}
