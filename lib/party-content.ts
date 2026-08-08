/**
 * Guest Hub content packs (trivia / he-said / poses).
 * Single source of truth: public/celebrate/data/*.json for trivia + he-said.
 * Versioning: guest public content always serves shipped packs.
 */

import heSaidJson from "../public/celebrate/data/he-said-she-said.json";
import triviaJson from "../public/celebrate/data/trivia.json";

/** Bump when shipping a new canonical question pack to production. */
export const SHIPPED_CONTENT_PACK_VERSION = 4;

export const SHIPPED_CONTENT_PACK_ID = "guest-hub-questions-v4-20260808";

export type ContentPackMeta = {
  contentPackVersion?: number;
  contentPackId?: string;
  questions?: unknown[];
  prompts?: unknown[];
  [key: string]: unknown;
};

export function packVersion(pack: unknown): number {
  if (!pack || typeof pack !== "object") return 0;
  const v = (pack as ContentPackMeta).contentPackVersion;
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

export function withShippedMeta<T extends Record<string, unknown>>(pack: T): T & {
  contentPackVersion: number;
  contentPackId: string;
} {
  return {
    ...pack,
    contentPackVersion: SHIPPED_CONTENT_PACK_VERSION,
    contentPackId: SHIPPED_CONTENT_PACK_ID,
  };
}

export const SHIPPED_TRIVIA = withShippedMeta(triviaJson as unknown as Record<string, unknown>);
export const SHIPPED_HE_SAID = withShippedMeta(heSaidJson as unknown as Record<string, unknown>);

/** Alias used by party-store host defaults */
export const DEFAULT_TRIVIA = SHIPPED_TRIVIA;
export const DEFAULT_HE_SAID = SHIPPED_HE_SAID;

/**
 * Prefer host pack only when it is an intentional newer/equal version.
 * Stale in-memory host packs (version 0 / missing) always lose to shipped.
 * For poses, pass shippedFallback from party-store DEFAULT_POSES.
 */
export function resolveContentPack(
  kind: "trivia" | "he-said" | "poses",
  hostPack: unknown,
  shippedFallback?: Record<string, unknown>
): Record<string, unknown> {
  const shipped =
    kind === "trivia"
      ? SHIPPED_TRIVIA
      : kind === "he-said"
        ? SHIPPED_HE_SAID
        : withShippedMeta(shippedFallback || { prompts: [] });
  const hostVer = packVersion(hostPack);
  if (hostVer >= SHIPPED_CONTENT_PACK_VERSION && hostPack && typeof hostPack === "object") {
    const h = hostPack as ContentPackMeta;
    if (kind === "poses") {
      if (Array.isArray(h.prompts) && h.prompts.length > 0) {
        return hostPack as Record<string, unknown>;
      }
    } else if (Array.isArray(h.questions) && h.questions.length > 0) {
      return hostPack as Record<string, unknown>;
    }
  }
  return shipped;
}

/** Required marker strings for v4 trivia acceptance tests. */
export const TRIVIA_V4_MARKERS = [
  "Who made the first move?",
  "Who asked the other out?",
  'Who said "I love you" first?',
  "Who fell in love first?",
  "self-centered, petty, and egotistical",
  "maid of honor is not a paid position",
  "What is the name of Javad & Dani's dog?",
] as const;

/** Must NOT appear (old basic ops filler) */
export const TRIVIA_V4_FORBIDDEN = [
  "Where did Dani & Javad go on their first date?",
  "Main food energy today?",
  "Scoring freezes at what time?",
  "Where is this party (city)?",
] as const;

export const HE_SAID_V4_MARKERS = [
  "Who is more dramatic?",
  "Who is more likely to get hangry first?",
  "it's not that far",
  "pets' favorite human",
] as const;

export function assertTriviaPackV4(pack: { questions?: Array<{ q?: string }> }): string[] {
  const errors: string[] = [];
  const qs = pack?.questions || [];
  if (qs.length < 12) errors.push(`trivia expected >=12 questions, got ${qs.length}`);
  const blob = qs.map((q) => q.q || "").join("\n");
  for (const m of TRIVIA_V4_MARKERS) {
    if (!blob.includes(m)) errors.push(`trivia missing marker: ${m}`);
  }
  for (const f of TRIVIA_V4_FORBIDDEN) {
    if (blob.includes(f)) errors.push(`trivia still has forbidden basic question: ${f}`);
  }
  return errors;
}

export function assertHeSaidPackV4(pack: { questions?: Array<{ q?: string }> }): string[] {
  const errors: string[] = [];
  const qs = pack?.questions || [];
  if (qs.length < 12) errors.push(`he-said expected >=12 questions, got ${qs.length}`);
  const blob = qs.map((q) => q.q || "").join("\n");
  for (const m of HE_SAID_V4_MARKERS) {
    if (!blob.includes(m)) errors.push(`he-said missing marker: ${m}`);
  }
  return errors;
}

// Back-compat aliases
export const TRIVIA_V3_MARKERS = TRIVIA_V4_MARKERS;
export const HE_SAID_V3_MARKERS = HE_SAID_V4_MARKERS;
export const assertTriviaPackV3 = assertTriviaPackV4;
export const assertHeSaidPackV3 = assertHeSaidPackV4;
