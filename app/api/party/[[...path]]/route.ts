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
    const profiles = Array.from(store.profiles.values()).filter(
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
    const existing = Array.from(store.profiles.values()).filter(
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
    const allProfiles = Array.from(store.profiles.values());
    const board = allProfiles
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
    const ringsClaimed = allProfiles.reduce((a, p) => a + p.ringsFound, 0);
    return json({
      leaderboard: board,
      stats: { profiles: store.profiles.size, ringsClaimed },
      prize: PUBLIC_CONFIG.prize,
    });
  }

  // ── Host desk (password) ─────────────────────────────────────────────
  const HOST_PASSWORD = process.env.PARTY_HOST_PASSWORD || "dj-host-2026";
  const g = globalThis as unknown as {
    __djHostSessions?: Map<string, number>;
    __djHostState?: Record<string, unknown>;
  };
  if (!g.__djHostSessions) g.__djHostSessions = new Map();
  if (!g.__djHostState) {
    g.__djHostState = {
      scoringMode: "auto",
      prize: null,
      photosUrl: null,
      publicBaseUrl: "https://www.thekeyholders.org/celebrate/",
    };
  }
  const sessions = g.__djHostSessions;
  const hostState = g.__djHostState;

  function hostAuthed(): boolean {
    const auth = req.headers.get("authorization") || "";
    const token = auth.toLowerCase().startsWith("bearer ")
      ? auth.slice(7).trim()
      : req.headers.get("x-host-token") || "";
    const exp = token ? sessions.get(token) : undefined;
    if (exp && exp > Date.now()) return true;
    const pw = req.headers.get("x-host-password") || "";
    return pw === HOST_PASSWORD;
  }

  if (segs[0] === "host" && segs[1] === "login" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    if (String(body.password || "") !== HOST_PASSWORD) {
      return json({ error: "Wrong password" }, 403);
    }
    const token = crypto.randomUUID() + crypto.randomUUID();
    sessions.set(token, Date.now() + 12 * 3600 * 1000);
    return json({ ok: true, token, expiresInSec: 12 * 3600 });
  }

  if (segs[0] === "host") {
    if (!hostAuthed() && !(segs[1] === "login")) {
      return json({ error: "Host auth required" }, 401);
    }
    if (segs[1] === "overview" && method === "GET") {
      const all = Array.from(store.profiles.values());
      const top = all
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10)
        .map((p) => ({
          id: p.id,
          displayName: p.displayName,
          totalPoints: p.totalPoints,
        }));
      const prize =
        (hostState.prize as Record<string, unknown> | null) || PUBLIC_CONFIG.prize;
      return json({
        ok: true,
        stats: {
          profiles: all.length,
          ringsClaimed: all.reduce((a, p) => a + p.ringsFound, 0),
          totalPointsSum: all.reduce((a, p) => a + p.totalPoints, 0),
        },
        leaderboard: top,
        scoring: {
          scoringOpen: hostState.scoringMode !== "frozen",
          scoringMode: hostState.scoringMode || "auto",
          message:
            hostState.scoringMode === "frozen"
              ? "Host override: scoring FROZEN (memory store)"
              : "Vercel memory store · points best-effort",
          winner: null,
        },
        config: { ...PUBLIC_CONFIG, prize, host: hostState },
        hostState,
        paths: { note: "vercel-memory" },
        links: {
          hub: "/celebrate/index.html",
          screen: "/celebrate/screen.html",
          qrs: "/celebrate/print/qrs.html",
          leaderboard: "/celebrate/leaderboard.html",
          join: "/celebrate/join.html",
        },
        passwordConfigured: true,
      });
    }
    if (segs[1] === "config" && (method === "PUT" || method === "POST" || method === "GET")) {
      if (method === "GET") {
        return json({ ok: true, config: PUBLIC_CONFIG, hostState });
      }
      const body = await req.json().catch(() => ({}));
      if (body.prize) hostState.prize = { ...(PUBLIC_CONFIG.prize as object), ...body.prize };
      for (const k of ["photosUrl", "publicBaseUrl", "eventName", "couple", "scoringMode"]) {
        if (body[k] != null) hostState[k] = body[k];
      }
      return json({ ok: true, config: { ...PUBLIC_CONFIG, ...hostState }, hostState });
    }
    if (segs[1] === "scoring" && method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (body.mode) hostState.scoringMode = body.mode;
      return json({
        ok: true,
        scoring: { scoringMode: hostState.scoringMode, scoringOpen: hostState.scoringMode !== "frozen" },
        hostState,
      });
    }
    if (segs[1] === "guests" && method === "GET") {
      return json({
        ok: true,
        guests: Array.from(store.profiles.values()).map(toPublic),
      });
    }
    if (segs[1] === "guests" && segs[2] && (method === "DELETE" || segs[3] === "delete")) {
      const id = segs[2];
      store.profiles.delete(id);
      store.scores = store.scores.filter((s) => s.profileId !== id);
      return json({ ok: true, deleted: id });
    }
    if (segs[1] === "reset" && method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (body.confirm !== "RESET") {
        return json({ error: 'Send {"confirm":"RESET","scope":"all|scores|profiles"}' }, 400);
      }
      if (body.scope === "scores") {
        store.scores = [];
        for (const p of Array.from(store.profiles.values())) {
          p.totalPoints = 0;
          p.ringsFound = 0;
          p.guestbookSigned = false;
          p.posesSpun = 0;
          p.passportBonus = 0;
        }
      } else {
        store.profiles.clear();
        store.scores = [];
      }
      return json({ ok: true, scope: body.scope || "all" });
    }
    if (segs[1] === "export" && method === "GET") {
      return json({
        profiles: Array.from(store.profiles.values()).map(toPublic),
        scores: store.scores,
        winner: null,
        note: "vercel-memory-export",
        hostPrizeNote: (hostState.prize as { hostOnlyRealPrize?: string } | null)?.hostOnlyRealPrize,
      });
    }
    if (segs[1] === "content") {
      return json({
        error: "Content file edit is Docker-only. Use LAN host desk for trivia JSON.",
        docker: "http://192.168.8.201:8088/host.html",
      }, 501);
    }
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

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await ctx.params;
  return handle(req, path);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path = [] } = await ctx.params;
  return handle(req, path);
}
