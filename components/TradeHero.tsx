"use client";

import BrandLogo from "@/components/BrandLogo";
import ParticleField from "@/components/hero/ParticleField";
import { motion, useReducedMotion } from "framer-motion";

export default function TradeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-trade-gradient">
      <ParticleField unlocked />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(5,8,16,0.7)_85%,#050810_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,158,11,0.12),transparent)]" />

      <div className="container-narrow relative z-10 section-padding px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="mb-8 flex justify-center">
            <BrandLogo variant="trade" onDark className="drop-shadow-[0_0_28px_rgba(245,158,11,0.2)]" />
          </div>

          <p className="mb-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            ServiceTitan Contractor Integrations
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            You run the trucks.{" "}
            <span className="bg-gradient-to-r from-gold via-goldLight to-gold bg-clip-text text-transparent">
              We run the tech behind them.
            </span>
          </h1>

          <p className="mt-6 text-lg text-white/70 sm:text-xl">
            Fixed-price integrations, reporting, and automations for HVAC, plumbing,
            roofing, and electrical shops — from an implementer who rescued an
            at-risk ServiceTitan rollout.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#services" className="btn-gold">
              View Services &amp; Buy
            </a>
            <a href="#case-study" className="btn-secondary">
              See Case Study
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-[0.2em] text-white/40">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_8px_#F59E0B]" />
              Fixed-price
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyanGlow shadow-[0_0_8px_#22D3EE]" />
              ServiceTitan
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emeraldGlow shadow-[0_0_8px_#34D399]" />
              At-risk rescue
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}