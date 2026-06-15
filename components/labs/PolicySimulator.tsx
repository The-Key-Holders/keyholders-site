"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PolicySimulator() {
  const [days, setDays] = useState(90);
  const [heirs, setHeirs] = useState(2);
  const [applied, setApplied] = useState(false);

  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + days);

  const progress = Math.min(100, Math.floor((days / 365) * 100));

  const handleApply = () => {
    setApplied(true);
    // auto-reset visual state after a beat for re-play
    setTimeout(() => setApplied(false), 2200);
  };

  return (
    <div className="glass-card p-8 border-violetGlow/20">
      <div className="flex items-center gap-3 mb-4">
        <span className="rounded-full border border-violetGlow/30 bg-violetGlow/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-violetGlow">
          Design Lab
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-white/40">INTERACTIVE PREVIEW</span>
      </div>

      <h3 className="font-display text-2xl font-bold text-white mb-2">Timelock Policy Simulator</h3>
      <p className="text-sm text-white/60 mb-6">
        Low-cost prototype preview of Legacy Vault policy engine. Adjust parameters — live simulation of release window and beneficiary split. (Reuses site motion + vault theme.)
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-white/50 mb-2">
              Days until release: <span className="font-mono text-violetGlow">{days}</span>
            </label>
            <input
              type="range"
              min={7}
              max={730}
              step={1}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full accent-violetGlow"
            />
            <div className="flex justify-between text-[10px] text-white/40 mt-1">
              <span>1 week</span>
              <span>2 years</span>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.25em] text-white/50 mb-2">
              Number of heirs / guardians: <span className="font-mono text-violetGlow">{heirs}</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setHeirs(n)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${heirs === n ? "border-violetGlow bg-violetGlow/10 text-white" : "border-white/15 bg-white/5 text-white/70 hover:border-white/30"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleApply}
            className="btn-primary w-full text-sm"
          >
            Apply Timelock Policy
          </button>
        </div>

        {/* Live visual output */}
        <div className="rounded-2xl border border-white/10 bg-vault-950/60 p-6 flex flex-col">
          <div className="text-xs uppercase tracking-[0.25em] text-white/40 mb-3">Simulated release</div>

          <div className="font-display text-4xl font-bold text-white tracking-tighter mb-1">
            {releaseDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </div>
          <div className="text-sm text-white/55 mb-6">({days} days • {heirs} beneficiary{heirs > 1 ? "ies" : ""} • allocation 100%)</div>

          <div className="mt-auto">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-white/40 mb-1.5">
              <span>Time to unlock</span>
              <span>{progress}% of max window</span>
            </div>
            <div className="h-2 rounded bg-white/10 overflow-hidden">
              <motion.div
                className="h-2 bg-gradient-to-r from-violetGlow to-cyanGlow"
                initial={{ width: 0 }}
                animate={{ width: applied ? `${progress}%` : `${Math.max(8, progress * 0.7)}%` }}
                transition={{ duration: applied ? 0.6 : 0.3, ease: "easeOut" }}
              />
            </div>
            <p className="mt-3 text-[10px] text-white/40">
              {applied ? "Policy committed to chain • audit log appended" : "Drag controls then apply to simulate on-chain verification"}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-[10px] text-white/30">Salvaged concept from Legacy Vault Rust+Next.js engine. Real implementation includes full auth, multi-sig guardians, and encrypted off-chain storage.</p>
    </div>
  );
}
