/**
 * Guest Hub content packs (trivia / he-said / poses).
 * Versioning: shipped packs always win over stale host memory unless host
 * pack carries contentPackVersion >= SHIPPED_CONTENT_PACK_VERSION.
 */

import {
  DEFAULT_HE_SAID,
  DEFAULT_POSES,
  DEFAULT_TRIVIA,
} from "@/lib/party-store";

/** Bump when shipping a new canonical question pack to production. */
export const SHIPPED_CONTENT_PACK_VERSION = 3;

export const SHIPPED_CONTENT_PACK_ID = "guest-hub-questions-v3-20260808";

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

export const SHIPPED_TRIVIA = withShippedMeta(DEFAULT_TRIVIA as unknown as Record<string, unknown>);
export const SHIPPED_HE_SAID = withShippedMeta(
  DEFAULT_HE_SAID as unknown as Record<string, unknown>
);
export const SHIPPED_POSES = withShippedMeta(DEFAULT_POSES as unknown as Record<string, unknown>);

/**
 * Prefer host pack only when it is an intentional newer/equal version.
 * Stale in-memory host packs (version 0 / missing) always lose to shipped.
 */
export function resolveContentPack(
  kind: "trivia" | "he-said" | "poses",
  hostPack: unknown
): Record<string, unknown> {
  const shipped =
    kind === "trivia" ? SHIPPED_TRIVIA : kind === "he-said" ? SHIPPED_HE_SAID : SHIPPED_POSES;
  const hostVer = packVersion(hostPack);
  if (hostVer >= SHIPPED_CONTENT_PACK_VERSION && hostPack && typeof hostPack === "object") {
    const h = hostPack as ContentPackMeta;
    // Guard: empty questions/prompts must not clobber shipped
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

/** Required marker strings for v3 trivia acceptance tests. */
export const TRIVIA_V3_MARKERS = [
  "Who made the first move?",
  "self-centered, petty, and egotistical",
  "maid of honor is not a paid position",
  "What is the name of Javad & Dani's dog?",
  "Scoring freezes at what time?",
] as const;

export const HE_SAID_V3_MARKERS = [
  "Who is more dramatic?",
  "Who is more likely to get hangry first?",
  "it's not that far",
  "pets' favorite human",
] as const;

export function assertTriviaPackV3(pack: { questions?: Array<{ q?: string }> }): string[] {
  const errors: string[] = [];
  const qs = pack?.questions || [];
  if (qs.length < 15) errors.push(`trivia expected >=15 questions, got ${qs.length}`);
  const blob = qs.map((q) => q.q || "").join("\n");
  for (const m of TRIVIA_V3_MARKERS) {
    if (!blob.includes(m)) errors.push(`trivia missing marker: ${m}`);
  }
  return errors;
}

export function assertHeSaidPackV3(pack: { questions?: Array<{ q?: string }> }): string[] {
  const errors: string[] = [];
  const qs = pack?.questions || [];
  if (qs.length < 12) errors.push(`he-said expected >=12 questions, got ${qs.length}`);
  const blob = qs.map((q) => q.q || "").join("\n");
  for (const m of HE_SAID_V3_MARKERS) {
    if (!blob.includes(m)) errors.push(`he-said missing marker: ${m}`);
  }
  return errors;
}
