"use client";

import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

type KeyVisualProps = {
  progress: MotionValue<number>;
};

export default function KeyVisual({ progress }: KeyVisualProps) {
  const reduceMotion = useReducedMotion();
  const rotate = useTransform(progress, [0, 0.45, 1], [0, 18, 42]);
  const glow = useTransform(progress, [0, 0.5, 1], [0.35, 0.85, 1]);
  const unlockScale = useTransform(progress, [0.35, 0.55, 1], [1, 1.06, 1.02]);

  return (
    <motion.div
      className="relative mx-auto h-56 w-56 sm:h-72 sm:w-72"
      style={{ scale: reduceMotion ? 1 : unlockScale }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-cyanGlow/20 blur-3xl"
        style={{ opacity: reduceMotion ? 0.5 : glow }}
      />
      <motion.svg
        viewBox="0 0 200 200"
        className="relative h-full w-full drop-shadow-[0_0_35px_rgba(34,211,238,0.35)]"
        style={{ rotate: reduceMotion ? 0 : rotate }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animated key unlocking the vault"
      >
        <defs>
          <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="55%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FDE68A" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="88" stroke="rgba(34,211,238,0.25)" strokeWidth="1" />
        <circle cx="100" cy="100" r="72" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="4 8" />
        <motion.g
          animate={reduceMotion ? undefined : { rotate: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 100px" }}
        >
          <path
            d="M118 62c18 0 32 14 32 32s-14 32-32 32c-8 0-15-3-20-8l-44 44-14-14 30-30-2-2c5-5 8-12 8-20 0-18 14-32 32-32z"
            fill="url(#keyGrad)"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5"
          />
          <circle cx="118" cy="94" r="10" fill="#050810" stroke="#22D3EE" strokeWidth="2" />
        </motion.g>
        <motion.path
          d="M56 144 L72 128"
          stroke="#22D3EE"
          strokeWidth="3"
          strokeLinecap="round"
          animate={reduceMotion ? undefined : { opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </motion.svg>
    </motion.div>
  );
}