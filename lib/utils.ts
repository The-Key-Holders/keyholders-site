import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Structured error logging (minimal, follows lib/ patterns exactly: get* env helpers, graceful degradation like getStripe/getBuyButtonId) ---
// Levels + context obj. Always emits to console (Vercel captures + queries natively in dashboard/Functions logs).
// Optional Supabase REST storage/query (no new deps; native fetch; gated on env; silent fail).
// Compatible w/ unit tests (skips remote on NODE_ENV=test; console-spy friendly).
// Agents/personas: import { logger, queryLogs } from "@/lib/utils"; for debug + auto-analysis via sub-agents.
// See docs/MODEL_HANDOFF.md for ecosystem (Vercel central, Supabase optional across projects).

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
  level: LogLevel
  message: string
  context?: Record<string, unknown>
  timestamp: string
}

const isTestEnv = process.env.NODE_ENV === "test" || process.env.DISABLE_LOG_REMOTE === "1"

function emit(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  const entry: LogEntry = {
    level,
    message,
    context: context ?? {},
    timestamp: new Date().toISOString(),
  }
  // Structured output (matches existing webhook style in app/api/webhooks/stripe/route.ts)
  const prefix = `[${level.toUpperCase()}]`
  if (level === "error") console.error(prefix, message, entry)
  else if (level === "warn") console.warn(prefix, message, entry)
  else console.log(prefix, message, entry)
  return entry
}

export function log(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  const entry = emit(level, message, context)

  if (isTestEnv) return entry

  // Vercel: native (console) — query via Vercel dashboard or grok_com tools / log drains.
  // Supabase integration (REST only; requires table `logs (level, message, context jsonb, timestamp, source text)`):
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (url && key && typeof window === "undefined") {
    // server-only remote; fire-and-forget
    fetch(`${url}/rest/v1/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        level: entry.level,
        message: entry.message,
        context: entry.context,
        timestamp: entry.timestamp,
        source: "keyholders-site",
      }),
    }).catch(() => {
      /* silent; never block request path */
    })
  }
  return entry
}

// Convenience (exact small API for use everywhere)
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => log("debug", message, context),
  info: (message: string, context?: Record<string, unknown>) => log("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => log("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => log("error", message, context),
}

// For agents / sub-agents / personas (query Supabase for debugging/auto-analysis; falls back gracefully)
export async function queryLogs(opts?: { level?: LogLevel; limit?: number }): Promise<LogEntry[]> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_ANON_KEY
  if (!url || !key || isTestEnv) return []
  try {
    let q = `${url}/rest/v1/logs?select=*&order=timestamp.desc&limit=${opts?.limit ?? 100}`
    if (opts?.level) q += `&level=eq.${opts.level}`
    const res = await fetch(q, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) return []
    return (await res.json()) as LogEntry[]
  } catch {
    return []
  }
}

// Test/compat shims (smallest addition for e2e smoke unit+error coverage; uses main logger + in-mem; enables [tester-persona] without API drift)
const testLogs: LogEntry[] = []
export function logError(message: string, data?: any): LogEntry {
  const entry: any = { level: "error", message, data, timestamp: new Date().toISOString() }
  // also call main structured
  log("error", message, data ? { data } : undefined)
  testLogs.push(entry)
  return entry
}
export function getErrorLogs(): LogEntry[] { return [...testLogs] }
export function clearErrorLogs(): void { testLogs.length = 0 }

// === Advanced Changelog System (smallest additive per implementer persona + handoff patterns) ===
// Auto-generated entries from GitHub MCP list_commits/get_commit (The-Key-Holders/keyholders-site).
// Manual entries supported. Versioned. Searchable via fn. Integrated w/ file version tracking (per-commit files).
// Displayed in /work (mission logs). Tied to error logging: change-related errors use logger + queryLogs; see entries.
// Queryable by agents/personas e.g. [historian-persona]: import { getChangelog, searchChangelog } from "@/lib/utils"
// Follows exact patterns: small TS, no new deps/files beyond edit, graceful, agent-friendly comments (cf. queryLogs).
// Use GitHub MCP for future regen of auto entries.

export interface ChangelogEntry {
  version: string
  date: string
  title: string
  summary: string
  type: "auto" | "manual"
  sha?: string
  files?: string[]
  notes?: string
}

const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: "v1.0.0",
    date: "2026-06-17",
    title: "Advanced Changelog System",
    summary: "Auto-generate from commits (GitHub MCP), manual entries, versioned+searchable. Integrated file version tracking + sites (/work display). Tied to error logging (logger for change-audit). Queryable by [historian-persona] & agents via getChangelog/searchChangelog. UI in mission logs. Smallest pattern-exact edit to lib+work+e2e. All-dark vault theme.",
    type: "manual",
    notes: "Part of Ultimate Plan; central hub for ecosystem changelogs across repos.",
  },
  {
    version: "v1.0.1",
    date: "2026-06-17",
    title: "GitHub hub page + ecosystem audit",
    summary: "Added /github page with curated salvaged cards (from grok_com_github MCP on CupofJavad/The-Key-Holders). Links to advanced systems (/changelog, /api/versions, file-versions). Overlay + section updates. Memory persisted, vercel MCP used for audit/deploy. Additive only.",
    type: "manual",
    notes: "Ultimate Plan for thekeyholders.org: sub-pages, showcase, salvage complete. See grok-impl-summary.",
  },
  {
    version: "v0.9.1",
    date: "2026-06-16",
    title: "Winner Candidate 2 polish via implement loop",
    summary: "Reliability Suite + simulator + 7+ on-theme images + e2e depth + handoff notes. 188 insertions. Gates passed (build 9/9, e2e 7/7).",
    type: "auto",
    sha: "a442fa9c76f0c6f4bf1cf103c6fd58e8485608b5",
    files: ["app/labs/page.tsx", "app/work/page.tsx", "components/ReliabilitySimulator.tsx", "components/home/HomeSections.tsx", "docs/MODEL_HANDOFF.md", "tests/e2e/smoke.spec.ts"],
  },
  {
    version: "v0.9.0",
    date: "2026-06-15",
    title: "best-of-n Winner: Reliability Suite + simulators + visuals",
    summary: "Salvaged 76-project roadmap, interactive Design Lab, PolicySimulator context, curated OSS, Legacy Vault details. Additive post-P2. Strict handoff fidelity.",
    type: "auto",
    sha: "e8e77bb0a4b0e2da26296c111046716a8271355f",
    files: ["app/labs/page.tsx", "app/work/page.tsx", "components/ReliabilitySimulator.tsx"],
  },
  {
    version: "v0.8.0",
    date: "2026-06-15",
    title: "P2: standalone /labs + /work pages + FieldHub + e2e",
    summary: "Per approved plan + MODEL_HANDOFF §14 P2, §16 Garner verbatim, §17. 7/7 e2e. Work mission logs expanded.",
    type: "auto",
    sha: "8c8384d1846d5c0cfdc9452e815c5bc3a6450c3d",
    files: ["app/labs/page.tsx", "app/work/page.tsx"],
  },
  {
    version: "v0.7.0",
    date: "2026-06-15",
    title: "P0: Stripe production readiness + webhook error logging",
    summary: "CheckoutFeedback, webhook (constructEvent + logs with productId), dual-path. Error logging via structured logger tied to change tracking. 5/5 e2e.",
    type: "auto",
    sha: "1675f6379d105f826b2ac7dd9c84dfcadf693ac9",
    files: ["app/api/webhooks/stripe/route.ts", "app/api/checkout/route.ts", "components/CheckoutFeedback.tsx"],
    notes: "Change-related errors now surface in logger + queryLogs for historian queries.",
  },
]

export function getChangelog(): ChangelogEntry[] {
  return [...CHANGELOG_DATA]
}

export function searchChangelog(query: string): ChangelogEntry[] {
  const q = query.toLowerCase().trim()
  if (!q) return getChangelog()
  return CHANGELOG_DATA.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.summary.toLowerCase().includes(q) ||
    e.version.toLowerCase().includes(q) ||
    (e.files || []).some(f => f.toLowerCase().includes(q)) ||
    (e.notes || "").toLowerCase().includes(q)
  )
}
