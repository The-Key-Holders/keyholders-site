"use client";

import { useState } from "react";
import { Play, Download, Shield, TrendingUp } from "lucide-react";

/**
 * ReliabilitySimulator
 * Low-cost interactive preview / Design Lab element.
 * Salvaged concept from The-Key-Holders/reliability-infrastructure-roadmap.
 * Matches vault dark theme, cyan/gold/violet/emerald accents, glass UI.
 * No new dependencies. Uses native range + simple state + optional micro interaction.
 * "Run Scan" triggers simulated processing + score recalc.
 * Purely demonstrative — real tools live in the roadmap projects.
 */
export default function ReliabilitySimulator() {
  const [drift, setDrift] = useState(18);
  const [resilience, setResilience] = useState(72);
  const [chaos, setChaos] = useState(24);
  const [score, setScore] = useState(86);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);

  // Thematic score: higher resilience wins, drift + chaos penalize. Tuned for editorial feel.
  function computeScore(d: number, r: number, c: number): number {
    const base = 92;
    const penalty = Math.round(d * 0.42 + c * 0.38);
    const bonus = Math.round((r - 50) * 0.28);
    const raw = Math.max(42, Math.min(98, base - penalty + bonus));
    return Math.round(raw);
  }

  const currentScore = computeScore(drift, resilience, chaos);

  function runScan() {
    setIsScanning(true);

    // Micro "processing" delay for cinematic feel (no heavy libs)
    setTimeout(() => {
      const newScore = computeScore(drift, resilience, chaos);
      setScore(newScore);
      setLastScan(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setIsScanning(false);
    }, 680);
  }

  function exportReport() {
    const report = `Reliability Suite Preview Report
Score: ${currentScore}%
Drift Delta: ${drift}%
Resilience Factor: ${resilience}%
Chaos Load: ${chaos}%
Scanned: ${lastScan || "just now"}

Salvaged concept from The Key Holders Reliability Infrastructure Roadmap.
Production tools: zero-downtime-migration-orchestrator, resilience-testing-toolkit + 70+ more.
`;
    // Simple client download (no server needed)
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reliability-preview-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const scoreColor =
    currentScore >= 88 ? "text-emeraldGlow" : currentScore >= 72 ? "text-cyanGlow" : "text-gold";

  return (
    <div className="glass-card border-white/10 p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-cyanGlow/80">
            <Shield className="h-3.5 w-3.5" /> Design Lab Preview
          </div>
          <h3 className="mt-3 font-display text-2xl font-bold text-white">
            Reliability Score Simulator
          </h3>
          <p className="mt-1 max-w-md text-sm text-white/55">
            Interactive mock of concepts from the 76-project Reliability Infrastructure Roadmap. Adjust parameters; run a scan.
          </p>
        </div>
        <div className="text-right">
          <div className={`font-display text-6xl font-bold tabular-nums transition-colors ${scoreColor}`}>
            {currentScore}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 -mt-1">RELIABILITY</div>
          {lastScan && (
            <div className="mt-1 text-[10px] text-white/30">last scan {lastScan}</div>
          )}
        </div>
      </div>

      {/* Live visual bar */}
      <div className="mt-6 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${currentScore}%`,
            background: currentScore >= 88 
              ? "linear-gradient(to right, #34D399, #14B8A6)" 
              : currentScore >= 72 
                ? "linear-gradient(to right, #22D3EE, #34D399)" 
                : "linear-gradient(to right, #F59E0B, #FDE68A)",
          }}
        />
      </div>

      {/* Controls - on-theme glass sliders */}
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {[
          { label: "Drift Delta", value: drift, setter: setDrift, min: 0, max: 55, unit: "%", hint: "Infra/config deviation" },
          { label: "Resilience Factor", value: resilience, setter: setResilience, min: 35, max: 95, unit: "%", hint: "Recovery & testing strength" },
          { label: "Chaos Load", value: chaos, setter: setChaos, min: 5, max: 60, unit: "%", hint: "Injected failure rate" },
        ].map((ctrl, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold text-white/80">{ctrl.label}</span>
              <span className="tabular-nums text-cyanGlow/90">{ctrl.value}{ctrl.unit}</span>
            </div>
            <input
              type="range"
              min={ctrl.min}
              max={ctrl.max}
              value={ctrl.value}
              onChange={(e) => ctrl.setter(Number(e.target.value))}
              className="w-full accent-cyanGlow"
              aria-label={ctrl.label}
            />
            <p className="text-[10px] text-white/35">{ctrl.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
        <button
          onClick={runScan}
          disabled={isScanning}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-70"
        >
          <Play className="h-4 w-4" />
          {isScanning ? "Scanning vault..." : "Run Scan"}
        </button>

        <button
          onClick={exportReport}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export mock report
        </button>

        <span className="ml-auto text-[10px] text-white/30">
          Salvaged preview • Full suite in <a href="https://github.com/The-Key-Holders/reliability-infrastructure-roadmap" target="_blank" rel="noopener noreferrer" className="underline hover:text-cyanGlow">roadmap repo</a>
        </span>
      </div>

      <p className="mt-4 text-[10px] text-white/30">
        Real production implementations (resilience-testing-toolkit, infrastructure-drift-detector, zero-downtime-migration-orchestrator and 70+ others) live under the org. This is an editorial demonstration only.
      </p>
    </div>
  );
}
