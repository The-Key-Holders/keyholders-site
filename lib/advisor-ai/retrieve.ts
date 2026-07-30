/**
 * Keyword retrieval over Ops Manual markdown + CA 9-1-1 Advisor Agent corpus.
 * Expands accuracy; does not replace the full system prompt.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import path from "path";

function knowledgeRoots(): string[] {
  const cwd = process.cwd();
  const home = process.env.USERPROFILE || process.env.HOME || "C:\\Users\\javad";
  const projects = process.env.PROJECTS_ROOT || path.join(home, "Projects");
  const bundledCa = path.join(
    cwd,
    "lib",
    "advisor-ai",
    "knowledge",
    "extra-md",
    "ca_911_advisor_agent"
  );
  const hasBundledCa = existsSync(bundledCa);

  const dirs = [
    // Bundled with deploy (preferred)
    path.join(cwd, "lib", "advisor-ai", "knowledge", "manual-md"),
    path.join(cwd, "lib", "advisor-ai", "knowledge", "extra-md"),
    // Local operator corpus after PDF conversion
    path.join(home, ".grok", "data", "advisor-ai", "manual-md"),
    // Live CA pack on laptop only when not already bundled (avoid double-count)
    ...(hasBundledCa
      ? []
      : [
          path.join(projects, "CA_911_Advisor_Agent"),
          path.join(projects, "CA_911_Advisor_Agent", "knowledge"),
        ]),
    // New-hire kit reference if present
    path.join(home, "CalOES_ITA_NewHire_Kit_2026", "reference"),
    // Optional operator override
    process.env.ADVISOR_AI_KNOWLEDGE_DIR || "",
  ].filter(Boolean);

  const seen = new Set<string>();
  const out: string[] = [];
  for (const d of dirs) {
    try {
      const r = path.resolve(d);
      if (seen.has(r)) continue;
      if (existsSync(r) && statSync(r).isDirectory()) {
        seen.add(r);
        out.push(r);
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s\-_/]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function walkMdFiles(dir: string, maxFiles = 800): string[] {
  const out: string[] = [];
  const stack = [dir];
  while (stack.length && out.length < maxFiles) {
    const cur = stack.pop()!;
    let entries: string[] = [];
    try {
      entries = readdirSync(cur);
    } catch {
      continue;
    }
    for (const name of entries) {
      if (
        name === "node_modules" ||
        name === ".venv" ||
        name === "_internal" ||
        name === ".git" ||
        name === ".next" ||
        name === "build"
      ) {
        // Skip install/build trees; keep CA pack eval/ for refusal patterns
        continue;
      }
      const full = path.join(cur, name);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        stack.push(full);
      } else if (/\.(md|txt)$/i.test(name) && st.size > 80 && st.size < 2_000_000) {
        out.push(full);
        if (out.length >= maxFiles) break;
      }
    }
  }
  return out;
}

function sourceLabel(root: string, full: string): string {
  const rel = path.relative(root, full).split(path.sep).join("/");
  const rootBase = path.basename(root);
  if (rootBase === "manual-md") return `manual/${rel}`;
  if (rootBase === "extra-md" || rootBase === "ca_911_advisor_agent") {
    return `ca-pack/${rel.replace(/^ca_911_advisor_agent\//, "")}`;
  }
  return `${rootBase}/${rel}`;
}

function loadCorpus(): Array<{ id: string; text: string }> {
  const chunks: Array<{ id: string; text: string }> = [];
  const seenKeys = new Set<string>();
  const roots = knowledgeRoots();
  for (const dir of roots) {
    const files = walkMdFiles(dir);
    for (const full of files) {
      try {
        const label = sourceLabel(dir, full);
        const raw = readFileSync(full, "utf8");
        if (raw.length < 100) continue;
        // Dedupe identical paths / near-identical short labels
        const dedupeKey = `${label}:${raw.length}`;
        if (seenKeys.has(dedupeKey)) continue;
        seenKeys.add(dedupeKey);

        const size = 2000;
        const overlap = 200;
        for (let i = 0; i < raw.length; i += size - overlap) {
          const slice = raw.slice(i, i + size).trim();
          if (slice.length > 200) {
            chunks.push({ id: `${label}#${i}`, text: slice });
          }
        }
      } catch {
        /* skip */
      }
    }
  }
  return chunks;
}

let cached: Array<{ id: string; text: string }> | null = null;

/** Clear cache (tests / after ingest). */
export function clearRetrieveCache(): void {
  cached = null;
}

export function getCorpusStats(): { chunks: number; roots: string[] } {
  if (!cached) cached = loadCorpus();
  return { chunks: cached.length, roots: knowledgeRoots() };
}

export function retrieveManualContext(query: string, topK = 5): string {
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
    const idLower = c.id.toLowerCase();
    // Boost by path / topic
    if (
      /chapter.?iii|funding|allotment|pb0[1-7]|residual|ch_iii/i.test(idLower) &&
      /allot|cpe|fund|claim|residual|td-?288|erlang|sow|direct.?pay/i.test(query)
    ) {
      score += 6;
    }
    if (
      /chapter.?vi|for|fiscal|pb08|for_playbook|ch_vi/i.test(idLower) &&
      /\bfor\b|fiscal.?operational|review/i.test(query)
    ) {
      score += 5;
    }
    if (
      /playbook|decision_tree|guardrail|forms_catalog|glossary|top15|pb\d{2}/i.test(
        idLower
      ) &&
      /form|td-?|process|checklist|decision|residual|eligibility|playbook/i.test(
        query
      )
    ) {
      score += 4;
    }
    if (
      /answer.?time|chapter.?i|standards|pb09|ch_i_standards/i.test(idLower) &&
      /answer.?time|asa|standard|compliance/i.test(query)
    ) {
      score += 4;
    }
    if (
      /td.?290|pb07|reimburs/i.test(idLower) &&
      /td-?290|reimburs/i.test(query)
    ) {
      score += 5;
    }
    // Prefer Manual chapter paths slightly for policy wording
    if (/^manual\//i.test(idLower)) {
      score += 1;
    }
    return { ...c, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, topK);
  if (!top.length) return "";

  return top.map((t) => `--- source: ${t.id} ---\n${t.text}`).join("\n\n");
}
