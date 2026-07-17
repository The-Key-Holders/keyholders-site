"use client";

import {
  HELP_TOOLS,
  PROCESS_STEPS,
  matchProcessStep,
} from "@/lib/psap-portal/process-path";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProcessRail({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname() || "";
  const current = matchProcessStep(pathname);

  return (
    <div
      className={
        compact
          ? "border-b border-white/10 bg-[#0a0e1a]/80"
          : "rounded-xl border border-white/10 bg-white/[0.03] p-4"
      }
    >
      <div className={compact ? "mx-auto max-w-5xl px-4 py-2.5 sm:px-6" : ""}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            CPE project path · use tools in order
          </p>
          <Link
            href="/psap-portal/start"
            className="text-[11px] text-cyanGlow hover:underline"
          >
            First time here?
          </Link>
        </div>
        <ol className="flex flex-wrap gap-1.5">
          {PROCESS_STEPS.map((s) => {
            const active = current?.id === s.id;
            const done =
              current != null && s.step < current.step && current.phase !== "orient";
            return (
              <li key={s.id}>
                <Link
                  href={s.href}
                  title={s.when}
                  className={
                    active
                      ? "inline-flex items-center gap-1.5 rounded-full bg-cyanGlow px-2.5 py-1 text-[11px] font-bold text-[#050810]"
                      : done
                        ? "inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-200/90 hover:border-emerald-300/50"
                        : "inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/55 hover:border-cyanGlow/40 hover:text-white"
                  }
                >
                  <span
                    className={
                      active
                        ? "flex h-4 w-4 items-center justify-center rounded-full bg-[#050810]/20 text-[10px]"
                        : "flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[10px]"
                    }
                  >
                    {s.step}
                  </span>
                  <span className="hidden sm:inline">{s.short}</span>
                </Link>
              </li>
            );
          })}
        </ol>
        {!compact && (
          <div className="mt-3 flex flex-wrap gap-2 border-t border-white/10 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/35">
              Anytime
            </span>
            {HELP_TOOLS.slice(0, 3).map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="text-[11px] text-white/50 hover:text-cyanGlow"
              >
                {t.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
