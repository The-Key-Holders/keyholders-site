"use client";

import { usePersona } from "@/components/psap-portal/PersonaProvider";
import { PERSONAS, type PortalPersona } from "@/lib/psap-portal/personas";
import { portal } from "@/lib/psap-portal/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PortalEntryPage() {
  const { persona, ready, setPersona } = usePersona();
  const router = useRouter();

  useEffect(() => {
    if (ready && persona) {
      router.replace(PERSONAS[persona].home);
    }
  }, [ready, persona, router]);

  function choose(p: PortalPersona) {
    setPersona(p);
    router.push(PERSONAS[p].home);
  }

  if (!ready || persona) {
    return (
      <div className={portal.page}>
        <p className={portal.muted}>Loading your workspace…</p>
      </div>
    );
  }

  return (
    <div className={portal.page}>
      <p className={portal.badge}>Choose your workspace</p>
      <h1 className={`${portal.h1} mt-3`}>Who is visiting today?</h1>
      <p className={portal.lead}>
        Navigation, home screens, and emphasis change by role — same portal, three experiences.
        You can switch roles anytime from the header.
      </p>

      <div className={`${portal.alertCyan} mt-6`}>
        <strong className="text-cyanGlow">Free private beta.</strong> Invited access only while we
        prove post-award package quality and Advisor workload relief.{" "}
        <Link href="/psap-portal/start#why-free" className="underline">
          Why free?
        </Link>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {(Object.keys(PERSONAS) as PortalPersona[]).map((id) => {
          const p = PERSONAS[id];
          const border =
            id === "advisor"
              ? "hover:border-gold/50"
              : id === "admin"
                ? "hover:border-violet-400/50"
                : "hover:border-cyanGlow/50";
          const badge =
            id === "advisor"
              ? portal.badgeGold
              : id === "admin"
                ? "inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-200"
                : portal.badge;
          return (
            <button
              key={id}
              type="button"
              onClick={() => choose(id)}
              className={`rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition ${border}`}
              data-testid={`role-${id}`}
            >
              <span className={badge}>{p.short}</span>
              <h2 className="mt-3 font-[family-name:var(--font-syne)] text-xl font-bold text-white">
                {p.label}
              </h2>
              <p className={`${portal.muted} mt-2`}>{p.blurb}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-cyanGlow">
                Enter workspace →
              </span>
            </button>
          );
        })}
      </div>

      <p className={`${portal.muted} mt-10`}>
        New here? Read{" "}
        <Link href="/psap-portal/start" className="text-cyanGlow hover:underline">
          purpose, how it works, and about
        </Link>{" "}
        first.
      </p>
    </div>
  );
}
