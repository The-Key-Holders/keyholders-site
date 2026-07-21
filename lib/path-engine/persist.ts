/**
 * Durable snapshot backend:
 * - VITEST / no DATABASE_URL: memory only (tests)
 * - DATABASE_URL set: Neon ops_snapshot jsonb
 * - else: .data/ops-store.json (local file)
 */

import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import type { OpsSnapshot } from "./types";

const FILE_PATH =
  process.env.OPS_STORE_PATH ||
  path.join(process.cwd(), ".data", "ops-store.json");

export function isMemoryOnlyStore(): boolean {
  return process.env.VITEST === "true" || process.env.OPS_STORE === "memory";
}

export function hasDatabaseUrl(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function loadPersistedSnapshot(): Promise<OpsSnapshot | null> {
  if (isMemoryOnlyStore()) return null;

  if (hasDatabaseUrl()) {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      const rows = (await sql`SELECT data FROM ops_snapshot WHERE id = 1`) as {
        data: OpsSnapshot;
      }[];
      if (rows[0]?.data) return rows[0].data as OpsSnapshot;
    } catch (e) {
      console.error("[path-engine] Neon load failed, trying file", e);
    }
  }

  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf8");
      return JSON.parse(raw) as OpsSnapshot;
    }
  } catch (e) {
    console.error("[path-engine] File load failed", e);
  }
  return null;
}

export async function savePersistedSnapshot(snap: OpsSnapshot): Promise<void> {
  if (isMemoryOnlyStore()) return;

  if (hasDatabaseUrl()) {
    try {
      const sql = neon(process.env.DATABASE_URL!);
      // neon tagged templates parameterize values; cast via jsonb_build / parse
      await sql`
        INSERT INTO ops_snapshot (id, data, updated_at)
        VALUES (1, ${JSON.stringify(snap)}::jsonb, now())
        ON CONFLICT (id) DO UPDATE
        SET data = EXCLUDED.data, updated_at = now()
      `;
      return;
    } catch (e) {
      console.error("[path-engine] Neon save failed, falling back to file", e);
    }
  }

  try {
    fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
    fs.writeFileSync(FILE_PATH, JSON.stringify(snap, null, 2), "utf8");
  } catch (e) {
    console.error("[path-engine] File save failed", e);
  }
}

/** Sync file save for paths where async is awkward (best-effort). */
export function savePersistedSnapshotSync(snap: OpsSnapshot): void {
  if (isMemoryOnlyStore() || hasDatabaseUrl()) {
    // Neon is async-only; schedule microtask
    void savePersistedSnapshot(snap);
    return;
  }
  try {
    fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
    fs.writeFileSync(FILE_PATH, JSON.stringify(snap, null, 2), "utf8");
  } catch (e) {
    console.error("[path-engine] File save failed", e);
  }
}
