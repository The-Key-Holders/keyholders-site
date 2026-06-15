"use client";

import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";

export const UNLOCK_THRESHOLD = 0.38;

type KeyVisualProps = {
  progress: MotionValue<number>;
};

export default function KeyVisual({ progress }: KeyVisualProps) {
  const reduceMotion = useReducedMotion();

  const keyRotate = useTransform(
    progress,
    [0, UNLOCK_THRESHOLD, 0.7, 1],
    [0, 68, 74, 78]
  );
  const outerRingRotate = useTransform(progress, [0, 1], [0, -32]);
  const innerRingRotate = useTransform(progress, [0, 1], [0, 48]);
  const glowOpacity = useTransform(
    progress,
    [0, 0.18, UNLOCK_THRESHOLD, 0.55, 1],
    [0.25, 0.55, 1, 0.75, 0.65]
  );
  const containerScale = useTransform(
    progress,
    [0, UNLOCK_THRESHOLD - 0.04, UNLOCK_THRESHOLD + 0.08, 1],
    [0.94, 1, 1.07, 1.03]
  );
  const shackleLift = useTransform(
    progress,
    [0, UNLOCK_THRESHOLD - 0.06, UNLOCK_THRESHOLD, 1],
    [0, 0, 1, 1]
  );
  const boltRetract = useTransform(
    progress,
    [0, UNLOCK_THRESHOLD - 0.08, UNLOCK_THRESHOLD, 1],
    [0, 0, 1, 1]
  );
  const unlockPulse = useTransform(
    progress,
    [UNLOCK_THRESHOLD - 0.03, UNLOCK_THRESHOLD, UNLOCK_THRESHOLD + 0.18],
    [0, 1, 0]
  );
  const unlockPulseScale = useTransform(unlockPulse, [0, 1], [0.85, 1.15]);
  const keyGlow = useTransform(
    progress,
    [0, UNLOCK_THRESHOLD, 1],
    ["rgba(34,211,238,0.25)", "rgba(245,158,11,0.55)", "rgba(34,211,238,0.35)"]
  );
  const keyDropShadow = useTransform(
    keyGlow,
    (c) => `drop-shadow(0 0 40px ${c})`
  );
  const boltY = useTransform(boltRetract, [0, 1], [0, 14]);
  const shackleRotate = useTransform(shackleLift, [0, 1], [0, -38]);
  const shackleY = useTransform(shackleLift, [0, 1], [0, -6]);
  const lockOpacity = useTransform(shackleLift, [0, 0.5, 1], [1, 0.85, 0.55]);

  if (reduceMotion) {
    return (
      <div className="relative mx-auto h-56 w-56 sm:h-72 sm:w-72">
        <div className="absolute inset-0 rounded-full bg-cyanGlow/25 blur-3xl" />
        <svg
          viewBox="0 0 240 240"
          className="relative h-full w-full drop-shadow-[0_0_35px_rgba(34,211,238,0.35)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Vault key unlocked"
        >
          <VaultSvgDefs />
          <VaultRings />
          <StaticVaultLock unlocked />
          <StaticKeyShape unlocked />
        </svg>
      </div>
    );
  }

  return (
    <motion.div
      className="relative mx-auto h-56 w-56 sm:h-72 sm:w-72"
      style={{ scale: containerScale }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-cyanGlow/20 blur-3xl"
        style={{ opacity: glowOpacity }}
      />
      <motion.div
        className="absolute inset-[-12%] rounded-full border border-gold/20"
        style={{ opacity: unlockPulse, scale: unlockPulseScale }}
      />
      <motion.svg
        viewBox="0 0 240 240"
        className="relative h-full w-full"
        style={{ filter: keyDropShadow }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Animated key unlocking the vault"
      >
        <VaultSvgDefs />
        <motion.g style={{ rotate: outerRingRotate, transformOrigin: "120px 120px" }}>
          <circle cx="120" cy="120" r="108" stroke="rgba(34,211,238,0.18)" strokeWidth="1" />
          <circle
            cx="120"
            cy="120"
            r="108"
            stroke="url(#ringGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 14"
            strokeLinecap="round"
            opacity="0.6"
          />
        </motion.g>
        <motion.g style={{ rotate: innerRingRotate, transformOrigin: "120px 120px" }}>
          <circle cx="120" cy="120" r="88" stroke="rgba(245,158,11,0.22)" strokeWidth="1" />
          <circle
            cx="120"
            cy="120"
            r="88"
            stroke="rgba(34,211,238,0.15)"
            strokeWidth="1"
            strokeDasharray="3 9"
          />
        </motion.g>
        <AnimatedVaultLock
          boltY={boltY}
          shackleRotate={shackleRotate}
          shackleY={shackleY}
          lockOpacity={lockOpacity}
        />
        <motion.g style={{ rotate: keyRotate, transformOrigin: "132px 108px" }}>
          <AnimatedKeyShape />
        </motion.g>
        <motion.circle
          cx="120"
          cy="120"
          r="52"
          stroke="rgba(245,158,11,0.35)"
          strokeWidth="2"
          fill="none"
          style={{ opacity: unlockPulse }}
        />
      </motion.svg>
    </motion.div>
  );
}

function VaultSvgDefs() {
  return (
    <defs>
      <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22D3EE" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
        <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="vaultFace" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#111827" />
        <stop offset="100%" stopColor="#050810" />
      </radialGradient>
    </defs>
  );
}

function VaultRings() {
  return (
    <>
      <circle cx="120" cy="120" r="108" stroke="rgba(34,211,238,0.18)" strokeWidth="1" />
      <circle
        cx="120"
        cy="120"
        r="108"
        stroke="url(#ringGrad)"
        strokeWidth="1.5"
        strokeDasharray="6 14"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="120" cy="120" r="88" stroke="rgba(245,158,11,0.22)" strokeWidth="1" />
      <circle
        cx="120"
        cy="120"
        r="88"
        stroke="rgba(34,211,238,0.15)"
        strokeWidth="1"
        strokeDasharray="3 9"
      />
    </>
  );
}

function StaticVaultLock({ unlocked }: { unlocked: boolean }) {
  return (
    <g>
      <circle cx="120" cy="120" r="64" fill="url(#vaultFace)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="56" stroke="rgba(34,211,238,0.12)" strokeWidth="1" strokeDasharray="2 6" />
      <rect x="98" y="108" width="44" height="36" rx="6" fill="#0a0e1a" stroke="rgba(245,158,11,0.45)" strokeWidth="1.5" />
      <rect x="104" y="114" width="32" height="8" rx="2" fill="rgba(34,211,238,0.15)" />
      <rect x="108" y="142" width="6" height="12" rx="1" fill="rgba(34,211,238,0.3)" />
      <rect x="126" y="142" width="6" height="12" rx="1" fill="rgba(34,211,238,0.3)" />
      <g
        style={{
          transform: unlocked ? "translateY(-6px) rotate(-38deg)" : undefined,
          transformOrigin: "120px 108px",
          opacity: unlocked ? 0.55 : 1,
        }}
      >
        <path
          d="M104 108 C104 88 136 88 136 108"
          stroke="#F59E0B"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <circle cx="120" cy="132" r="5" fill="#050810" stroke="#22D3EE" strokeWidth="1.5" />
      <rect x="118" y="132" width="4" height="8" rx="1" fill="#050810" />
    </g>
  );
}

function AnimatedVaultLock({
  boltY,
  shackleRotate,
  shackleY,
  lockOpacity,
}: {
  boltY: MotionValue<number>;
  shackleRotate: MotionValue<number>;
  shackleY: MotionValue<number>;
  lockOpacity: MotionValue<number>;
}) {
  return (
    <g>
      <circle cx="120" cy="120" r="64" fill="url(#vaultFace)" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      <circle cx="120" cy="120" r="56" stroke="rgba(34,211,238,0.12)" strokeWidth="1" strokeDasharray="2 6" />
      <rect x="98" y="108" width="44" height="36" rx="6" fill="#0a0e1a" stroke="rgba(245,158,11,0.45)" strokeWidth="1.5" />
      <rect x="104" y="114" width="32" height="8" rx="2" fill="rgba(34,211,238,0.15)" />
      <motion.rect x="108" y="128" width="6" height="12" rx="1" fill="#22D3EE" style={{ y: boltY }} />
      <motion.rect x="126" y="128" width="6" height="12" rx="1" fill="#22D3EE" style={{ y: boltY }} />
      <motion.g
        style={{
          rotate: shackleRotate,
          y: shackleY,
          opacity: lockOpacity,
          transformOrigin: "120px 108px",
        }}
      >
        <path
          d="M104 108 C104 88 136 88 136 108"
          stroke="#F59E0B"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>
      <circle cx="120" cy="132" r="5" fill="#050810" stroke="#22D3EE" strokeWidth="1.5" />
      <rect x="118" y="132" width="4" height="8" rx="1" fill="#050810" />
    </g>
  );
}

function StaticKeyShape({ unlocked }: { unlocked: boolean }) {
  return (
    <g>
      <path
        d="M138 72c20 0 36 16 36 36s-16 36-36 36c-9 0-17-3-22-9L64 128 48 112l34-34-2-2c5-6 9-14 9-22 0-20 16-36 36-36z"
        fill="url(#keyGrad)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      <circle cx="138" cy="108" r="11" fill="#050810" stroke="#22D3EE" strokeWidth="2" />
      <path
        d="M58 152 L76 134"
        stroke="#22D3EE"
        strokeWidth="3"
        strokeLinecap="round"
        opacity={unlocked ? 0.6 : 0.4}
      />
    </g>
  );
}

function AnimatedKeyShape() {
  return (
    <g>
      <path
        d="M138 72c20 0 36 16 36 36s-16 36-36 36c-9 0-17-3-22-9L64 128 48 112l34-34-2-2c5-6 9-14 9-22 0-20 16-36 36-36z"
        fill="url(#keyGrad)"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      <circle cx="138" cy="108" r="11" fill="#050810" stroke="#22D3EE" strokeWidth="2" />
      <motion.path
        d="M58 152 L76 134"
        stroke="#22D3EE"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ opacity: [0.15, 1, 0.15] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
    </g>
  );
}