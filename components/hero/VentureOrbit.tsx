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

/** Orbital offsets for desktop cinematic ring (tl, tr, bl, br) */
const orbitOffsets = [
  { x: "-108%", y: "-72%", rotate: -4 },
  { x: "8%", y: "-78%", rotate: 3 },
  { x: "-112%", y: "12%", rotate: 2 },
  { x: "4%", y: "18%", rotate: -3 },
] as const;

type VentureOrbitProps = {
  unlocked: boolean;
};

function VentureCard({
  venture,
  className,
}: {
  venture: Venture;
  className: string;
}) {
  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Venture
      </p>
      <h3 className="mt-2 text-base font-semibold text-white sm:text-lg">{venture.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/65">{venture.tagline}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cyanGlow transition-all group-hover:gap-2">
        Enter
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0-5 5m5-5H6" />
        </svg>
      </span>
    </>
  );

  if (venture.external) {
    return (
      <a
        href={venture.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={venture.href} className={`block h-full ${className}`}>
      {content}
    </Link>
  );
}

export default function VentureOrbit({ unlocked }: VentureOrbitProps) {
  const reduceMotion = useReducedMotion();

  const cardClass = (venture: Venture) =>
    `glass-card group bg-gradient-to-br ${accentMap[venture.accent]} p-4 transition-all duration-300 sm:p-5`;

  const motionFor = (index: number, orbital: boolean) => {
    const offset = orbitOffsets[index];
    if (reduceMotion) {
      return {
        initial: { opacity: 1, y: 0, scale: 1 },
        animate: { opacity: 1, y: 0, scale: 1, x: 0 },
        transition: { duration: 0 },
      };
    }
    if (unlocked) {
      return {
        initial: orbital
          ? { opacity: 0, scale: 0.88, x: 0, y: 24, rotate: 0 }
          : { opacity: 0, y: 28, scale: 0.96 },
        animate: orbital
          ? { opacity: 1, scale: 1, x: offset.x, y: offset.y, rotate: offset.rotate }
          : { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const },
      };
    }
    return {
      initial: orbital
        ? { opacity: 0.2, scale: 0.92, x: 0, y: 12 }
        : { opacity: 0.35, y: 18, scale: 0.98 },
      animate: orbital
        ? { opacity: 0.25, scale: 0.94, x: 0, y: 16 }
        : { opacity: 0.35, y: 18, scale: 0.98 },
      transition: { duration: 0.4 },
    };
  };

  return (
    <>
      {/* Desktop orbital ring */}
      <div className="relative mx-auto mt-6 hidden h-0 max-w-4xl lg:block">
        <div className="pointer-events-none absolute left-1/2 top-[-18rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-white/[0.04]" />
        <div className="pointer-events-none absolute left-1/2 top-[-18rem] h-[22rem] w-[22rem] -translate-x-1/2 rounded-full border border-dashed border-cyanGlow/10" />
        {ventures.map((venture, index) => (
          <motion.div
            key={venture.id}
            className="pointer-events-auto absolute left-1/2 top-[-18rem] w-52 -translate-x-1/2"
            {...motionFor(index, true)}
          >
            <VentureCard venture={venture} className={cardClass(venture)} />
          </motion.div>
        ))}
      </div>

      {/* Mobile / tablet grid fallback */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
        {ventures.map((venture, index) => (
          <motion.div key={venture.id} {...motionFor(index, false)}>
            <VentureCard venture={venture} className={cardClass(venture)} />
          </motion.div>
        ))}
      </div>
    </>
  );
}