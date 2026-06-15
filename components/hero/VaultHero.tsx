"use client";

import BrandLogo from "@/components/BrandLogo";
import KeyVisual, { UNLOCK_THRESHOLD } from "@/components/hero/KeyVisual";
import ParticleField from "@/components/hero/ParticleField";
import VentureOrbit from "@/components/hero/VentureOrbit";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

export default function VaultHero() {
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [unlocked, setUnlocked] = useState(!!reduceMotion);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  const headlineOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0.88]);
  const headlineY = useTransform(smoothProgress, [0, 0.38], [0, -28]);
  const statusOpacity = useTransform(smoothProgress, [0, 0.3, UNLOCK_THRESHOLD, 0.6], [0, 0.4, 1, 1]);
  const vignetteIntensity = useTransform(smoothProgress, [0, UNLOCK_THRESHOLD, 1], [0.55, 0.75, 0.9]);
  const cinematicShift = useTransform(smoothProgress, [0, UNLOCK_THRESHOLD, 1], [0, -12, -20]);

  useMotionValueEvent(smoothProgress, "change", (v) => {
    if (reduceMotion) return;
    setUnlocked(v >= UNLOCK_THRESHOLD);
  });

  return (
    <section
      ref={containerRef}
      className="relative min-h-[125vh] overflow-hidden bg-vault-gradient"
    >
      <ParticleField unlocked={unlocked} />

      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_38%,transparent_0%,rgba(5,8,16,0.55)_72%,#050810_100%)]"
        style={{ opacity: reduceMotion ? 0.7 : vignetteIntensity }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(5,8,16,0.75)_82%,#050810_100%)]" />

      <div className="container-narrow relative z-10 px-4 pb-28 pt-28 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
          style={{
            opacity: headlineOpacity,
            y: reduceMotion ? 0 : headlineY,
          }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <BrandLogo variant="parent" className="brightness-110 contrast-110" />
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-cyanGlow/80"
          >
            The Key Holders
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl"
          >
            Unlock your{" "}
            <span className="bg-gradient-to-r from-cyanGlow via-gold to-goldLight bg-clip-text text-transparent">
              digital universe
            </span>
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.7 }}
            className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg"
          >
            A high-tech venture hub — consumer tech, contractor integrations, labs,
            and shipped work. Scroll to turn the key.
          </motion.p>
        </motion.div>

        <motion.div
          className="relative mx-auto mt-10 max-w-5xl"
          style={{ y: reduceMotion ? 0 : cinematicShift }}
        >
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="flex justify-center"
          >
            <KeyVisual progress={smoothProgress} />
          </motion.div>

          <motion.div
            className="mt-6 flex items-center justify-center gap-3 text-sm text-white/55"
            style={{ opacity: reduceMotion ? 1 : statusOpacity }}
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors duration-500 ${
                unlocked
                  ? "bg-cyanGlow shadow-[0_0_12px_#22D3EE]"
                  : "animate-pulse bg-gold/70"
              }`}
            />
            {unlocked ? "Vault unlocked — ventures online" : "Authenticating… scroll to unlock"}
          </motion.div>

          <VentureOrbit unlocked={unlocked} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex justify-center lg:mt-28"
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/40"
          >
            <span>Explore</span>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}