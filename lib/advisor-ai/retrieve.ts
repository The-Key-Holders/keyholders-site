/**
 * Lightweight keyword retrieval over on-disk Manual markdown (if present).
 * Expands accuracy; does not replace the full system prompt.
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";

const DEFAULT_MD_DIRS = [
  // Repo-bundled Manual markdown (preferred for deploys that include knowledge/)
  path.join(process.cwd(), "lib", "advisor-ai", "knowledge", "manual-md"),
  // Local operator corpus (dev machine after PDF conversion)
  path.join(process.env.USERPROFILE || "", ".grok", "data", "advisor-ai", "manual-md"),
  // Kit reference markdown if present
  path.join(
    process.env.USERPROFILE || "C:\\Users\\javad",
    "CalOES_ITA_NewHire_Kit_2026",
    "reference"
  ),
];

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function loadCorpus(): Array<{ id: string; text: string }> {
  const chunks: Array<{ id: string; text: string }> = [];
  for (const dir of DEFAULT_MD_DIRS) {
    if (!existsSync(dir)) continue;
    let files: string[] = [];
    try {
      files = readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".txt"));
    } catch {
      continue;
    }
    for (const f of files) {
      try {
        const full = path.join(dir, f);
        const raw = readFileSync(full, "utf8");
        if (raw.length < 100) continue;
        // Chunk ~2000 chars with overlap
        const size = 2000;
        const overlap = 200;
        for (let i = 0; i < raw.length; i += size - overlap) {
          const slice = raw.slice(i, i + size).trim();
          if (slice.length > 200) {
            chunks.push({ id: `${f}#${i}`, text: slice });
          }
        }
      } catch {
        /* skip unreadable */
      }
    }
  }
  return chunks;
}

let cached: Array<{ id: string; text: string }> | null = null;

export function retrieveManualContext(query: string, topK = 4): string {
  if (!cached) cached = loadCorpus();
  if (!cached.length) return "";

  const qTokens = new Set(tokenize(query));
  if (!qTokens.size) return "";

  const scored = cached.map((c) => {
    const t = tokenize(c.text);
    let score = 0;
    for (const tok of t) {
      if (qTokens.has(tok)) score += 1;
    }
    // Boost funding-related filenames
    if (/chapter.?iii|funding/i.test(c.id) && /allot|cpe|fund|claim|residual|td-?288/i.test(query)) {
      score += 5;
    }
    if (/chapter.?vi|for|fiscal/i.test(c.id) && /\bfor\b|fiscal.?operational|review/i.test(query)) {
      score += 5;
    }
    return { ...c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, topK);
  if (!top.length) return "";

  return top.map((t) => `--- source: ${t.id} ---\n${t.text}`).join("\n\n");
}
