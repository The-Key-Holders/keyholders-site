import { NextRequest, NextResponse } from "next/server";
import {
  MAX_PROFILES,
  PUBLIC_CONFIG,
  displayFor,
  getStore,
  norm,
  recompute,
  toPublic,
  type PartyProfile,
} from "@/lib/party-store";

export const dynamic = "force-dynamic";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

async function handle(req: NextRequest, path: string[]) {
  const store = getStore();
  const method = req.method;
  const segs = path || [];

  if (segs[0] === "health" && method === "GET") {
    return json({ ok: true, service: "party-api-vercel-memory", note: "best-effort" });
  }

  if (segs[0] === "config" && method === "GET") {
    return json(PUBLIC_CONFIG);
  }

  if (segs[0] === "profiles" && segs[1] === "lookup" && method === "GET") {
    const first = req.nextUrl.searchParams.get("first") || "";
    const last = req.nextUrl.searchParams.get("last") || "";
    const fk = norm(first);
    const lk = norm(last);
    const profiles = [...store.profiles.values()].filter(
      (p) => p.firstKey === fk && p.lastKey === lk
    );
    return json({ profiles: profiles.map(toPublic) });
  }

  if (segs[0] === "profiles" && method === "POST" && segs.length === 1) {
    const body = await req.json().catch(() => ({}));
    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    if (!firstName || !lastName) {
      return json({ error: "First and last name required." }, 400);
    }
    const fk = norm(firstName);
    const lk = norm(lastName);
    const existing = [...store.profiles.values()].filter(
      (p) => p.firstKey === fk && p.lastKey === lk
    );
    if (existing.length && !body.forceNew) {
      return json({
        exists: true,
        profiles: existing.map(toPublic),
        message: "Found existing profile(s).",
      });
    }
    if (store.profiles.size >= MAX_PROFILES) {
      return json({ error: "Guest Hub is full (150).", full: true }, 403);
    }
    const id = crypto.randomUUID();
    const profile: PartyProfile = {
      id,
      firstName,
      lastName,
      displayName: displayFor(firstName, lastName),
      firstKey: fk,
      lastKey: lk,
      createdAt: Date.now() / 1000,
      ringsFound: 0,
      guestbookSigned: false,
      posesSpun: 0,
      passportBonus: 0,
      totalPoints: 0,
    };
    store.profiles.set(id, profile);
    return json({ exists: false, profile: toPublic(profile) }, 201);
  }

  if (segs[0] === "profiles" && segs[1] && method === "GET") {
    const p = store.profiles.get(segs[1]);
    if (!p) return json({ error: "Profile not found" }, 404);
    const scores = store.scores.filter((s) => s.profileId === p.id);
    return json({
      profile: toPublic(p),
      scores: scores.map((s) => ({
        game: s.game,
        score: s.score,
        max_score: s.maxScore,
        duration_ms: s.durationMs,
        created_at: s.createdAt,
      })),
    });
  }

  if (segs[0] === "scores" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    const p = store.profiles.get(String(body.profileId || ""));
    if (!p) return json({ error: "Profile not found" }, 404);
    store.scores.push({
      id: crypto.randomUUID(),
      profileId: p.id,
      game: String(body.game || "").slice(0, 40),
      score: Number(body.score) || 0,
      maxScore: Number(body.maxScore) || 0,
      durationMs: body.durationMs,
      createdAt: Date.now() / 1000,
    });
    const total = recompute(p, store.scores);
    return json({ ok: true, totalPoints: total });
  }

  if (segs[0] === "checkins" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    const p = store.profiles.get(String(body.profileId || ""));
    if (!p) return json({ error: "Profile not found" }, 404);
    const kind = String(body.kind || "");
    if (kind === "ring") p.ringsFound += 1;
    if (kind === "guestbook") p.guestbookSigned = true;
    if (kind === "pose") p.posesSpun += 1;
    if (kind === "passport_complete" && !p.passportBonus) p.passportBonus = 25;
    const total = recompute(p, store.scores);
    return json({ ok: true, profile: toPublic(p), totalPoints: total });
  }

  if (segs[0] === "leaderboard" && method === "GET") {
    const board = [...store.profiles.values()]
      .sort((a, b) => b.totalPoints - a.totalPoints || a.createdAt - b.createdAt)
      .slice(0, 15)
      .map((p, i) => ({
        rank: i + 1,
        profileId: p.id,
        displayName: p.displayName,
        totalPoints: p.totalPoints,
        ringsFound: p.ringsFound,
        guestbookSigned: p.guestbookSigned,
        passportBonus: p.passportBonus,
      }));
    const ringsClaimed = [...store.profiles.values()].reduce((a, p) => a + p.ringsFound, 0);
    return json({
      leaderboard: board,
      stats: { profiles: store.profiles.size, ringsClaimed },
      prize: PUBLIC_CONFIG.prize,
    });
  }

  return json({ error: "Not found", path: segs }, 404);
}

/** Map /api/* party paths used by static hub when rewritten, and /api/party/* */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await ctx.params;
  return handle(req, path);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await ctx.params;
  return handle(req, path);
}
