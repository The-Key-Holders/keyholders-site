"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

export type Venture = {
  id: string;
  title: string;
  tagline: string;
  href: string;
  external?: boolean;
  accent: "cyan" | "gold" | "violet" | "emerald";
};

const accentMap = {
  cyan: "from-cyanGlow/20 to-transparent border-cyanGlow/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]",
  gold: "from-gold/20 to-transparent border-gold/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
  violet: "from-violetGlow/20 to-transparent border-violetGlow/40 hover:shadow-[0_0_30px_rgba(167,139,250,0.25)]",
  emerald: "from-emeraldGlow/20 to-transparent border-emeraldGlow/40 hover:shadow-[0_0_30px_rgba(52,211,153,0.25)]",
};

const ventures: Venture[] = [
  {
    id: "geeks",
    title: "Geeks Next Door",
    tagline: "Nationwide tech support — book, pay, track.",
    href: "https://www.thegeeksnextdoor.com",
    external: true,
    accent: "cyan",
  },
  {
    id: "trade",
    title: "Key Holders Trade",
    tagline: "ServiceTitan integrations for contractors.",
    href: "/trade",
    accent: "gold",
  },
  {
    id: "labs",
    title: "Labs",
    tagline: "Legacy Vault, experiments, prototypes.",
    href: "#labs",
    accent: "violet",
  },
  {
    id: "work",
    title: "Work",
    tagline: "Shipped integrations & mission logs.",
    href: "#work",
    accent: "emerald",
  },
];

type VentureOrbitProps = {
  unlocked: boolean;
};

export default function VentureOrbit({ unlocked }: VentureOrbitProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ventures.map((venture, index) => {
        const className = `glass-card group bg-gradient-to-br ${accentMap[venture.accent]} p-5 transition-all duration-300`;
        const content = (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
              Venture
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">{venture.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{venture.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyanGlow group-hover:gap-2 transition-all">
              Enter
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0-5 5m5-5H6" />
              </svg>
            </span>
          </>
        );

        const motionProps = {
          initial: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28, scale: 0.96 },
          animate: unlocked
            ? { opacity: 1, y: 0, scale: 1 }
            : reduceMotion
              ? { opacity: 0.45, y: 0, scale: 1 }
              : { opacity: 0.35, y: 18, scale: 0.98 },
          transition: { duration: 0.55, delay: reduceMotion ? 0 : index * 0.08 },
        };

        if (venture.external) {
          return (
            <motion.a
              key={venture.id}
              href={venture.href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              {...motionProps}
            >
              {content}
            </motion.a>
          );
        }

        return (
          <motion.div key={venture.id} {...motionProps}>
            <Link href={venture.href} className={`block h-full ${className}`}>
              {content}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}