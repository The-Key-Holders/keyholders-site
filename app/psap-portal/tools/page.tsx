import { HELP_TOOLS, PROCESS_STEPS } from "@/lib/psap-portal/process-path";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";

export default function ToolsIndexPage() {
  return (
    <div className="pb-10">
      <h1 className={portal.h1}>Tools · in project order</h1>
      <p className={portal.lead}>
        Use the numbered path for a full CPE replacement under the new MPA. Skip around only if you
        already know which gate you are on.
      </p>
      <p className="mt-3 text-sm">
        <Link href="/psap-portal/start" className="text-cyanGlow hover:underline">
          First time? Read how this works →
        </Link>
      </p>

      <ol className="mt-8 space-y-3">
        {PROCESS_STEPS.filter((s) => s.step > 1).map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyanGlow/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyanGlow/15 font-[family-name:var(--font-syne)] text-lg font-bold text-cyanGlow">
                {s.step}
              </span>
              <span>
                <span className="block font-[family-name:var(--font-syne)] text-lg font-semibold text-white">
                  {s.label}
                </span>
                <span className="mt-1 block text-sm text-white/50">{s.when}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <h2 className={`${portal.h2} mt-12`}>Anytime (not ordered)</h2>
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
