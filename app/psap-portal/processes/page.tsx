import { PROCESS_STEPS, HELP_TOOLS } from "@/lib/psap-portal/process-path";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function ProcessesPage() {
  return (
    <div className={portal.page}>
      <h1 className={portal.h1}>Processes · order of operations</h1>
      <p className={portal.lead}>
        Same sequence as the header rail. Advisors gatekeep this path under the new MPA — complete
        each step before the next.
      </p>
      <Link href="/psap-portal/start" className="text-sm text-cyanGlow hover:underline">
        First time? How this works →
      </Link>
      <ol className="mt-8 space-y-3">
        {PROCESS_STEPS.map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyanGlow/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyanGlow/15 font-[family-name:var(--font-syne)] text-lg font-bold text-cyanGlow">
                {s.step}
              </span>
              <span>
                <span className="block font-semibold text-white">{s.label}</span>
                <span className="mt-1 block text-sm text-white/50">{s.when}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <h2 className={`${portal.h2} mt-10`}>Anytime</h2>
      <div className={`${portal.grid2} mt-4`}>
        {HELP_TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className={portal.cardHover}>
            <h3 className="font-semibold text-white">{t.label}</h3>
            <p className={`${portal.muted} mt-1`}>{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
