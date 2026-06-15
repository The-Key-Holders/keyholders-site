"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  layer: "far" | "mid" | "near";
  tone: "cyan" | "gold";
};

type ParticleFieldProps = {
  unlocked?: boolean;
};

export default function ParticleField({ unlocked = false }: ParticleFieldProps) {
  const reduceMotion = useReducedMotion();

  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: reduceMotion ? 10 : 36 }, (_, id) => {
        const layerRoll = Math.random();
        const layer: Particle["layer"] =
          layerRoll > 0.66 ? "near" : layerRoll > 0.33 ? "mid" : "far";
        return {
          id,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: layer === "near" ? Math.random() * 2 + 1.5 : layer === "mid" ? Math.random() * 1.5 + 1 : Math.random() + 0.5,
          delay: Math.random() * 5,
          duration: Math.random() * 7 + (layer === "far" ? 12 : 8),
          layer,
          tone: Math.random() > 0.72 ? "gold" : "cyan",
        };
      }),
    [reduceMotion]
  );

  const burstParticles = useMemo(
    () =>
      reduceMotion
        ? []
        : Array.from({ length: 8 }, (_, id) => ({
            id,
            angle: (id / 8) * 360,
            delay: id * 0.04,
          })),
    [reduceMotion]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(20,184,166,0.1),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(245,158,11,0.06),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_100%,rgba(5,8,16,0.4),transparent)]" />

      {particles.map((p) => {
        const opacityBase = p.layer === "far" ? 0.2 : p.layer === "mid" ? 0.35 : 0.5;
        const colorClass = p.tone === "gold" ? "bg-gold/50" : "bg-cyanGlow/55";

        return (
          <motion.span
            key={p.id}
            className={`absolute rounded-full ${colorClass}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={
              reduceMotion
                ? { opacity: opacityBase * 0.7 }
                : {
                    opacity: [opacityBase * 0.4, opacityBase, opacityBase * 0.4],
                    y: [0, p.layer === "far" ? -8 : p.layer === "mid" ? -14 : -22, 0],
                    x: [0, p.layer === "near" ? 4 : -3, 0],
                  }
            }
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}

      {unlocked &&
        !reduceMotion &&
        burstParticles.map((b) => (
          <motion.span
            key={`burst-${b.id}`}
            className="absolute left-1/2 top-[42%] h-1 w-1 rounded-full bg-gold/80"
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0, 1.2, 0.4],
              x: Math.cos((b.angle * Math.PI) / 180) * 80,
              y: Math.sin((b.angle * Math.PI) / 180) * 80,
            }}
            transition={{ duration: 1.2, delay: b.delay, ease: "easeOut" }}
          />
        ))}
    </div>
  );
}