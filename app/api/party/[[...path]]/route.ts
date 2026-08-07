import { NextRequest, NextResponse } from "next/server";
import {
  MAX_PROFILES,
  answerMatches,
  computeWinner,
  deadlinePayload,
  displayFor,
  getHost,
  getStore,
  liveConfig,
  norm,
  recompute,
  scoringOpen,
  toPublic,
  publicMemory,
  emptyMemories,
  type PartyProfile,
  type HiddenMemory,
  DEFAULT_COMINGLE_ANSWERS,
  DEFAULT_STATION_KEYWORDS,
  DEFAULT_TRIVIA,
  DEFAULT_HE_SAID,
  DEFAULT_POSES,
} from "@/lib/party-store";

export const dynamic = "force-dynamic";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

const HOST_PASSWORD = process.env.PARTY_HOST_PASSWORD || "dj-host-2026";

function sessions() {
  const g = globalThis as unknown as { __djHostSessions?: Map<string, number> };
  if (!g.__djHostSessions) g.__djHostSessions = new Map();
  return g.__djHostSessions;
}

function hostAuthed(req: NextRequest): boolean {
  const auth = req.headers.get("authorization") || "";
  const token = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : req.headers.get("x-host-token") || "";
  const exp = token ? sessions().get(token) : undefined;
  if (exp && exp > Date.now()) return true;
  return (req.headers.get("x-host-password") || "") === HOST_PASSWORD;
}

async function handle(req: NextRequest, path: string[]): Promise<NextResponse> {
  const store = getStore();
  const host = getHost();
  const method = req.method;
  const segs = path || [];

  if (segs[0] === "health" && method === "GET") {
    return json({
      ok: true,
      service: "party-api-vercel-memory",
      note: "cellular-ready best-effort",
      scoringOpen: scoringOpen(),
    });
  }

  if (segs[0] === "config" && method === "GET") {
    return json({ ...liveConfig(), scoring: deadlinePayload() });
  }

  if (segs[0] === "status" && method === "GET") {
    return json(deadlinePayload());
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
      comingleDone: [],
      stationsDone: [],
    };
    store.profiles.set(id, profile);
    return json({ exists: false, profile: toPublic(profile) }, 201);
  }

  if (segs[0] === "profiles" && segs[1] && method === "GET") {
    const p = store.profiles.get(segs[1]);
    if (!p) return json({ error: "Profile not found" }, 404);
    recompute(p);
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
      scoring: deadlinePayload(),
    });
  }

  if (segs[0] === "scores" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    const p = store.profiles.get(String(body.profileId || ""));
    if (!p) return json({ error: "Profile not found" }, 404);
    const raw = Number(body.score) || 0;
    const awarded = scoringOpen() ? raw : 0;
    store.scores.push({
      id: crypto.randomUUID(),
      profileId: p.id,
      game: String(body.game || "").slice(0, 40),
      score: awarded,
      maxScore: Number(body.maxScore) || 0,
      durationMs: body.durationMs,
      createdAt: Date.now() / 1000,
    });
    const total = recompute(p);
    return json({
      ok: true,
      totalPoints: total,
      pointsAwarded: awarded,
      scoring: deadlinePayload(),
    });
  }

  if (segs[0] === "checkins" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    const p = store.profiles.get(String(body.profileId || ""));
    if (!p) return json({ error: "Profile not found" }, 404);
    const kind = String(body.kind || "");
    if (kind === "ring" && scoringOpen()) p.ringsFound += 1;
    if (kind === "guestbook") p.guestbookSigned = true;
    if (kind === "pose") p.posesSpun += 1;
    if (kind === "passport_complete" && !p.passportBonus && scoringOpen()) {
      p.passportBonus = 25;
    }
    const total = recompute(p);
    return json({
      ok: true,
      profile: toPublic(p),
      totalPoints: total,
      scoring: deadlinePayload(),
    });
  }

  if (segs[0] === "comingle" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    const p = store.profiles.get(String(body.profileId || ""));
    if (!p) return json({ error: "Profile not found" }, 404);
    const promptId = String(body.promptId || "");
    const answer = String(body.answer || "");
    const prompts = host.comingle || liveConfig().comingle || [];
    const prompt = prompts.find((x) => x.id === promptId);
    if (!prompt) return json({ error: "Unknown prompt" }, 404);
    if (p.comingleDone.includes(promptId)) {
      return json({
        ok: true,
        already: true,
        correct: true,
        points: 0,
        message: "Already completed.",
        scoring: deadlinePayload(),
      });
    }
    const accepted =
      (host.comingleAnswers && host.comingleAnswers[promptId]) ||
      DEFAULT_COMINGLE_ANSWERS[promptId] ||
      [];
    const correct = accepted.length ? answerMatches(answer, accepted) : answer.trim().length > 1;
    const pts = correct && scoringOpen() ? Number(prompt.points) || 25 : 0;
    if (correct) {
      p.comingleDone.push(promptId);
      store.scores.push({
        id: crypto.randomUUID(),
        profileId: p.id,
        game: `comingle:${promptId}`,
        score: pts,
        maxScore: Number(prompt.points) || 25,
        createdAt: Date.now() / 1000,
      });
    }
    const total = recompute(p);
    return json({
      ok: true,
      correct,
      points: pts,
      message: correct
        ? "Verified. Social legendary."
        : "Not verified yet — check the spelling or ask again.",
      totalPoints: total,
      scoring: deadlinePayload(),
    });
  }

  if (segs[0] === "stations" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    const p = store.profiles.get(String(body.profileId || ""));
    if (!p) return json({ error: "Profile not found" }, 404);
    const stationId = String(body.stationId || "");
    const answer = String(body.answer || "");
    const stations = host.stations || liveConfig().stations || [];
    const st = stations.find((x) => x.id === stationId);
    if (!st) return json({ error: "Unknown station" }, 404);
    if (p.stationsDone.includes(stationId)) {
      return json({
        ok: true,
        already: true,
        points: 0,
        message: "Already stamped.",
        scoring: deadlinePayload(),
      });
    }
    const keys =
      (host.stationKeywords && host.stationKeywords[stationId]) ||
      DEFAULT_STATION_KEYWORDS[stationId] ||
      [];
    const okAns = keys.length ? answerMatches(answer, keys) : answer.trim().length > 2;
    const pts = okAns && scoringOpen() ? Number(st.points) || 20 : 0;
    if (okAns) {
      p.stationsDone.push(stationId);
      store.scores.push({
        id: crypto.randomUUID(),
        profileId: p.id,
        game: `station:${stationId}`,
        score: pts,
        maxScore: Number(st.points) || 20,
        createdAt: Date.now() / 1000,
      });
    }
    const total = recompute(p);
    return json({
      ok: true,
      correct: okAns,
      points: pts,
      message: okAns ? "Station stamped!" : "Not quite — try another clue word.",
      totalPoints: total,
      scoring: deadlinePayload(),
    });
  }

  if (segs[0] === "leaderboard" && method === "GET") {
    const all = Array.from(store.profiles.values());
    all.forEach((p) => recompute(p));
    const board = all
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
    return json({
      leaderboard: board,
      stats: {
        profiles: all.length,
        ringsClaimed: all.reduce((a, p) => a + p.ringsFound, 0),
      },
      prize: liveConfig().prize,
      scoring: deadlinePayload(),
      winner: deadlinePayload().winner,
    });
  }

  if (segs[0] === "dashboard" && method === "GET") {
    const all = Array.from(store.profiles.values());
    all.forEach((p) => recompute(p));
    const leaderboard = all
      .sort((a, b) => b.totalPoints - a.totalPoints || a.createdAt - b.createdAt)
      .slice(0, 10)
      .map((p, i) => ({
        rank: i + 1,
        displayName: p.displayName,
        totalPoints: p.totalPoints,
      }));
    return json({
      leaderboard,
      predictions: {},
      photos: [],
      songs: store.songs.slice(0, 15),
      wishes: store.wishes.slice(0, 15),
      scoring: deadlinePayload(),
      winner: deadlinePayload().winner,
      prize: liveConfig().prize,
      couple: liveConfig().couple,
      schedule: liveConfig().schedule,
    });
  }

  if (segs[0] === "predictions" && method === "GET") {
    return json({ predictions: liveConfig().predictions, votes: store.predictions.length });
  }
  if (segs[0] === "predictions" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    store.predictions.push({
      profileId: String(body.profileId || ""),
      predictionId: String(body.predictionId || body.id || ""),
      option: String(body.option || body.choice || ""),
    });
    return json({ ok: true });
  }

  if (segs[0] === "wishes" && method === "GET") {
    return json({ wishes: store.wishes.slice(0, 40) });
  }
  if (segs[0] === "wishes" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    store.wishes.unshift({
      displayName: String(body.displayName || "Guest").slice(0, 60),
      message: String(body.message || "").slice(0, 280),
      createdAt: Date.now() / 1000,
    });
    return json({ ok: true });
  }

  if (segs[0] === "songs" && method === "GET") {
    return json({ songs: store.songs.slice(0, 40) });
  }
  if (segs[0] === "songs" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    const title = String(body.title || "").trim();
    if (!title) return json({ error: "title required" }, 400);
    store.songs.unshift({
      displayName: String(body.displayName || "Guest").slice(0, 60),
      title: title.slice(0, 120),
      artist: String(body.artist || "").slice(0, 120),
      createdAt: Date.now() / 1000,
    });
    return json({ ok: true, songs: store.songs.slice(0, 40) });
  }

  if (segs[0] === "advice" && method === "GET") {
    return json({ advice: store.advice.slice(0, 40) });
  }
  if (segs[0] === "advice" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    store.advice.unshift({
      displayName: String(body.displayName || "Guest").slice(0, 60),
      message: String(body.message || "").slice(0, 280),
      createdAt: Date.now() / 1000,
    });
    return json({ ok: true });
  }

  if (segs[0] === "margarita" && method === "GET") {
    return json({ flavors: liveConfig().margaritaFlavors, ratings: store.margarita.length });
  }
  if (segs[0] === "margarita" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    store.margarita.push({
      profileId: String(body.profileId || ""),
      flavor: String(body.flavor || ""),
      rating: Number(body.rating) || 0,
    });
    return json({ ok: true });
  }

  if (segs[0] === "photos" && method === "GET") {
    return json({
      photos: [],
      note: "Photo uploads use Google Photos album on cellular; see photos page.",
    });
  }
  if (segs[0] === "photos" && method === "POST") {
    return json({
      ok: true,
      skipped: true,
      message: "Use the shared Google Photos album on cellular (see Photos tile).",
    });
  }

  // ── Host desk ─────────────────────────────────────────────────────────
  if (segs[0] === "host" && segs[1] === "login" && method === "POST") {
    const body = await req.json().catch(() => ({}));
    if (String(body.password || "") !== HOST_PASSWORD) {
      return json({ error: "Wrong password" }, 403);
    }
    const token = crypto.randomUUID() + crypto.randomUUID();
    sessions().set(token, Date.now() + 12 * 3600 * 1000);
    return json({ ok: true, token, expiresInSec: 12 * 3600 });
  }

  if (segs[0] === "host") {
    if (!hostAuthed(req)) return json({ error: "Host auth required" }, 401);

    if (segs[1] === "overview" && method === "GET") {
      const all = Array.from(store.profiles.values());
      all.forEach((p) => recompute(p));
      const top = all
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .slice(0, 10)
        .map((p) => ({
          id: p.id,
          displayName: p.displayName,
          totalPoints: p.totalPoints,
        }));
      return json({
        ok: true,
        stats: {
          profiles: all.length,
          ringsClaimed: all.reduce((a, p) => a + p.ringsFound, 0),
          totalPointsSum: all.reduce((a, p) => a + p.totalPoints, 0),
        },
        leaderboard: top,
        scoring: deadlinePayload(),
        config: liveConfig(),
        hostState: host,
        paths: { note: "vercel-memory-cellular" },
        links: {
          hub: "https://www.thekeyholders.org/celebrate/index.html",
          screen: "https://www.thekeyholders.org/celebrate/screen.html",
          qrs: "https://www.thekeyholders.org/celebrate/print/qrs.html",
          leaderboard: "https://www.thekeyholders.org/celebrate/leaderboard.html",
          join: "https://www.thekeyholders.org/celebrate/join.html",
        },
        passwordConfigured: true,
      });
    }

    if (segs[1] === "config") {
      if (method === "GET") {
        return json({ ok: true, config: liveConfig(), hostState: host });
      }
      if (method === "PUT" || method === "POST") {
        const body = await req.json().catch(() => ({}));
        if (body.prize && typeof body.prize === "object") {
          const incoming = body.prize as Record<string, unknown>;
          const next = { ...(liveConfig().prize as object), ...incoming } as Record<
            string,
            unknown
          >;
          if (typeof incoming.enabled === "boolean") next.enabled = incoming.enabled;
          delete next.hostOnlyRealPrize;
          host.prize = next;
        }
        if (Array.isArray(body.memories)) {
          const base = emptyMemories();
          for (const raw of body.memories as HiddenMemory[]) {
            if (!raw || raw.slot < 1 || raw.slot > 10) continue;
            base[raw.slot - 1] = {
              slot: raw.slot,
              title: String(raw.title || `Hidden memory ${raw.slot}`).slice(0, 80),
              caption: String(raw.caption || "").slice(0, 600),
              imageDataUrl: String(raw.imageDataUrl || "").slice(0, 1_500_000),
              enabled: Boolean(raw.enabled),
            };
          }
          host.memories = base;
        }
        if (body.photosUrl != null) host.photosUrl = String(body.photosUrl);
        if (body.publicBaseUrl != null) host.publicBaseUrl = String(body.publicBaseUrl);
        if (body.eventName != null) host.eventName = String(body.eventName);
        if (body.couple != null) host.couple = String(body.couple);
        if (body.deadlineIso != null) host.deadlineIso = String(body.deadlineIso);
        if (body.scoringMode === "auto" || body.scoringMode === "open" || body.scoringMode === "frozen") {
          host.scoringMode = body.scoringMode;
        }
        if (Array.isArray(body.comingle)) host.comingle = body.comingle;
        if (body.comingleAnswers && typeof body.comingleAnswers === "object") {
          host.comingleAnswers = body.comingleAnswers;
        }
        if (Array.isArray(body.stations)) host.stations = body.stations;
        if (body.stationKeywords && typeof body.stationKeywords === "object") {
          host.stationKeywords = body.stationKeywords;
        }
        // Always keep TKH public base if blank or local
        const pb = String(host.publicBaseUrl || "");
        if (!pb || /localhost|127\.0\.0\.1|192\.168\./i.test(pb)) {
          host.publicBaseUrl = "https://www.thekeyholders.org/celebrate/";
        }
        if (!host.publicBaseUrl.endsWith("/")) host.publicBaseUrl += "/";
        host.updatedAt = new Date().toISOString();
        return json({ ok: true, config: liveConfig(), hostState: host });
      }
    }

    if (segs[1] === "scoring" && method === "POST") {
      const body = await req.json().catch(() => ({}));
      if (body.mode && ["auto", "open", "frozen"].includes(body.mode)) {
        host.scoringMode = body.mode;
      }
      if (body.deadlineIso) host.deadlineIso = body.deadlineIso;
      host.updatedAt = new Date().toISOString();
      return json({ ok: true, scoring: deadlinePayload(), hostState: host });
    }

    if (segs[1] === "content" && segs[2]) {
      const name = segs[2];
      if (!host.content) host.content = {};
      if (method === "GET") {
        let data: unknown = null;
        if (name === "trivia") data = host.content.trivia || DEFAULT_TRIVIA;
        else if (name === "he-said" || name === "he-said-she-said")
          data = host.content.heSaid || DEFAULT_HE_SAID;
        else if (name === "poses") data = host.content.poses || DEFAULT_POSES;
        else if (name === "comingle")
          data = { prompts: host.comingle || liveConfig().comingle, answers: host.comingleAnswers };
        else return json({ error: "Unknown content" }, 404);
        return json({ ok: true, name, data, source: "memory" });
      }
      if (method === "PUT" || method === "POST") {
        const body = await req.json().catch(() => ({}));
        const data = body.data !== undefined ? body.data : body;
        if (name === "trivia") host.content.trivia = data;
        else if (name === "he-said" || name === "he-said-she-said") host.content.heSaid = data;
        else if (name === "poses") host.content.poses = data;
        else if (name === "comingle") {
          if (data.prompts) host.comingle = data.prompts;
          if (data.answers) host.comingleAnswers = data.answers;
          if (Array.isArray(data)) host.comingle = data;
        } else return json({ error: "Unknown content" }, 404);
        host.updatedAt = new Date().toISOString();
        return json({ ok: true, name, written: ["memory"] });
      }
    }

    if (segs[1] === "guests" && method === "GET") {
      return json({
        ok: true,
        guests: Array.from(store.profiles.values()).map((p) => {
          recompute(p);
          return toPublic(p);
        }),
      });
    }

    if (segs[1] === "guests" && segs[2] && (method === "DELETE" || segs[3] === "delete" || method === "POST")) {
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
          p.comingleDone = [];
          p.stationsDone = [];
        }
      } else {
        store.profiles.clear();
        store.scores = [];
        store.predictions = [];
        store.wishes = [];
        store.songs = [];
        store.advice = [];
        store.margarita = [];
      }
      return json({ ok: true, scope: body.scope || "all" });
    }

    if (segs[1] === "export" && method === "GET") {
      return json({
        profiles: Array.from(store.profiles.values()).map(toPublic),
        scores: store.scores,
        winner: computeWinner(),
        hostPrizeNote: (liveConfig().prize as { hostOnlyRealPrize?: string }).hostOnlyRealPrize,
        exportedAt: new Date().toISOString(),
        scoring: deadlinePayload(),
        config: liveConfig(),
        note: "vercel-memory-export",
      });
    }
  }

  // Public content reads for guest pages that load JSON (optional)
  if (segs[0] === "content" && segs[1] && method === "GET") {
    const name = segs[1];
    if (name === "trivia") return json(host.content?.trivia || DEFAULT_TRIVIA);
    if (name === "he-said") return json(host.content?.heSaid || DEFAULT_HE_SAID);
    if (name === "poses") return json(host.content?.poses || DEFAULT_POSES);
  }

  // Public hidden memories (QR-only discovery; no app nav links)
  if (segs[0] === "memories" && method === "GET") {
    if (segs[1]) {
      const slot = parseInt(segs[1], 10);
      if (Number.isNaN(slot) || slot < 1 || slot > 10) {
        return json({ error: "Slot must be 1–10" }, 400);
      }
      return json(publicMemory(slot));
    }
    // list only enabled slots (minimal; not used by guest hub nav)
    const list = (host.memories || emptyMemories())
      .filter((m) => m.enabled && m.caption)
      .map((m) => ({ slot: m.slot, title: m.title, url: `hiddenmemory${m.slot}.html` }));
    return json({ memories: list });
  }

  if (segs[0] === "host" && segs[1] === "memories") {
    if (!hostAuthed(req)) return json({ error: "Host auth required" }, 401);
    if (method === "GET") {
      return json({
        ok: true,
        memories: host.memories || emptyMemories(),
        baseUrl: "https://www.thekeyholders.org/celebrate/",
      });
    }
    if (method === "PUT" || method === "POST") {
      const body = await req.json().catch(() => ({}));
      const base = emptyMemories();
      const incoming = Array.isArray(body.memories) ? body.memories : Array.isArray(body) ? body : null;
      if (!incoming) return json({ error: "memories array required" }, 400);
      for (const raw of incoming as HiddenMemory[]) {
        if (!raw || raw.slot < 1 || raw.slot > 10) continue;
        base[raw.slot - 1] = {
          slot: raw.slot,
          title: String(raw.title || `Hidden memory ${raw.slot}`).slice(0, 80),
          caption: String(raw.caption || "").slice(0, 600),
          imageDataUrl: String(raw.imageDataUrl || "").slice(0, 1_500_000),
          enabled: Boolean(raw.enabled),
        };
      }
      host.memories = base;
      host.updatedAt = new Date().toISOString();
      return json({ ok: true, memories: host.memories });
    }
  }

  // Full host state backup/restore (browser localStorage durability)
  if (segs[0] === "host" && segs[1] === "state") {
    if (!hostAuthed(req)) return json({ error: "Host auth required" }, 401);
    if (method === "GET") {
      return json({ ok: true, hostState: host, updatedAt: host.updatedAt });
    }
    if (method === "PUT" || method === "POST") {
      const body = await req.json().catch(() => ({}));
      const st = body.hostState || body;
      if (!st || typeof st !== "object") return json({ error: "hostState required" }, 400);
      Object.assign(host, st);
      if (!host.memories || host.memories.length !== 10) {
        const base = emptyMemories();
        for (const m of host.memories || []) {
          if (m && m.slot >= 1 && m.slot <= 10) base[m.slot - 1] = { ...base[m.slot - 1], ...m };
        }
        host.memories = base;
      }
      if (host.prize && typeof host.prize === "object") {
        delete (host.prize as { hostOnlyRealPrize?: string }).hostOnlyRealPrize;
      }
      host.updatedAt = new Date().toISOString();
      return json({ ok: true, hostState: host, config: liveConfig() });
    }
  }

  return json({ error: "Not found", path: segs }, 404);
}

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
