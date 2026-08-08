/**
 * Party durable snapshot (Neon when DATABASE_URL set).
 * Mirrors path-engine persist pattern; keeps serverless multiplayer consistent.
 */
import { neon } from "@neondatabase/serverless";
import type { HostState, PartyProfile, PartyScore } from "./party-store";

export type PartySnapshot = {
  version: 1;
  profiles: PartyProfile[];
  scores: PartyScore[];
  shoePredictions: Array<{
    profileId: string;
    questionId: string;
    choice: "dani" | "javad";
    lockedAt: number;
    graded?: boolean;
    matched?: boolean;
  }>;
  host: HostState;
  predictions?: Array<{ profileId: string; predictionId: string; option: string }>;
  wishes?: Array<{ displayName: string; message: string; createdAt: number }>;
  songs?: Array<{ displayName: string; title: string; artist: string; createdAt: number }>;
  advice?: Array<{ displayName: string; message: string; createdAt: number }>;
  margarita?: Array<{ profileId: string; flavor: string; rating: number }>;
  savedAt: string;
};

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function partyStoreMode(): "neon" | "memory" {
  if (process.env.PARTY_STORE === "memory") return "memory";
  if (process.env.VITEST === "true") return "memory";
  return hasDatabaseUrl() ? "neon" : "memory";
}

let ensureTablePromise: Promise<void> | null = null;

// neon() return type generics are awkward for helpers; keep sql untyped like call sites
async function ensureTable(sql: any): Promise<void> {
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS party_snapshot (
          id integer PRIMARY KEY,
          data jsonb NOT NULL,
          updated_at timestamptz DEFAULT now()
        )
      `;
    })().catch((e) => {
      ensureTablePromise = null;
      throw e;
    });
  }
  await ensureTablePromise;
}

export async function loadPartySnapshot(): Promise<PartySnapshot | null> {
  if (partyStoreMode() !== "neon") return null;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await ensureTable(sql);
    const rows = (await sql`SELECT data FROM party_snapshot WHERE id = 1`) as {
      data: PartySnapshot;
    }[];
    return rows[0]?.data || null;
  } catch (e) {
    console.error("[party] Neon load failed", e);
    return null;
  }
}

export async function savePartySnapshot(snap: PartySnapshot): Promise<boolean> {
  if (partyStoreMode() !== "neon") return false;
  try {
    const sql = neon(process.env.DATABASE_URL!);
    await ensureTable(sql);
    const payload = { ...snap, savedAt: new Date().toISOString() };
    await sql`
      INSERT INTO party_snapshot (id, data, updated_at)
      VALUES (1, ${JSON.stringify(payload)}::jsonb, now())
      ON CONFLICT (id) DO UPDATE
      SET data = EXCLUDED.data, updated_at = now()
    `;
    return true;
  } catch (e) {
    console.error("[party] Neon save failed", e);
    return false;
  }
}
