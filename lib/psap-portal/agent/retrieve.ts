import { readFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import {
  CONTACTS_ESCALATION_DIGEST,
} from "@/lib/advisor-ai/knowledge/contacts-escalation";
import { CONTEXT_2026_DIGEST } from "@/lib/advisor-ai/knowledge/context-2026";
import { FORMS_CATALOG_DIGEST } from "@/lib/advisor-ai/knowledge/forms-catalog";
import { FUNDING_PLAYBOOK_DIGEST } from "@/lib/advisor-ai/knowledge/funding-playbook";
import { PSAP_PORTAL_SYSTEM_PROMPT } from "./prompt";

const CORPUS_DIR = path.join(
  process.cwd(),
  "lib",
  "psap-portal",
  "knowledge",
  "corpus"
);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

type Chunk = { id: string; text: string };

function loadChunks(): Chunk[] {
  const chunks: Chunk[] = [];
  const digests: Array<[string, string]> = [
    ["funding-playbook", FUNDING_PLAYBOOK_DIGEST],
    ["forms-catalog", FORMS_CATALOG_DIGEST],
    ["context-2026", CONTEXT_2026_DIGEST],
    ["contacts", CONTACTS_ESCALATION_DIGEST],
    ["system-prompt", PSAP_PORTAL_SYSTEM_PROMPT],
  ];
  for (const [id, text] of digests) {
    if (text && text.length > 100) chunks.push({ id, text: text.slice(0, 4000) });
  }
  if (existsSync(CORPUS_DIR)) {
    try {
      for (const f of readdirSync(CORPUS_DIR).filter((x) => x.endsWith(".md"))) {
        const raw = readFileSync(path.join(CORPUS_DIR, f), "utf8");
        const size = 1800;
        for (let i = 0; i < raw.length; i += size - 150) {
          const slice = raw.slice(i, i + size).trim();
          if (slice.length > 120) chunks.push({ id: `${f}#${i}`, text: slice });
        }
      }
    } catch {
      /* ignore */
    }
  }
  return chunks;
}

let cached: Chunk[] | null = null;

export function retrievePortalContext(query: string, topK = 4): string {
  if (!cached) cached = loadChunks();
  if (!cached.length) return "";
  const q = new Set(tokenize(query));
  if (!q.size) return "";

  const scored = cached.map((c) => {
    let score = 0;
    for (const t of tokenize(c.text)) {
      if (q.has(t)) score += 1;
    }
    if (/residual|td-?288|invoice|sow|advance|cloud|on-?prem|26-16743/i.test(query)) {
      if (/residual|288|invoice|sow|advance|cloud|prem|16743/i.test(c.id + c.text)) {
        score += 4;
      }
    }
    return { c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, topK);
  if (!top.length) return cached[0]?.text.slice(0, 1500) || "";
  return top.map((t) => `### ${t.c.id}\n${t.c.text}`).join("\n\n");
}

export function composePsapPortalSystemPrompt(retrieved?: string): string {
  if (!retrieved?.trim()) return PSAP_PORTAL_SYSTEM_PROMPT;
  return `${PSAP_PORTAL_SYSTEM_PROMPT}\n\n---\n### Retrieved context\n${retrieved.trim()}`;
}
