/**
 * Full Guest Hub live regression + structured logging.
 * Usage: node scripts/verify-guest-hub-full.cjs [baseUrl]
 *
 * Artifacts:
 *   .artifacts/logs/run-{runId}.jsonl
 *   .artifacts/logs/LAST_GUEST_HUB_VERIFY.json
 *   .artifacts/logs/LAST_ERROR.json (on fail)
 *   .artifacts/CURRENT-guest-hub-verify
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const BASE = (process.argv[2] || "https://www.thekeyholders.org").replace(/\/$/, "");
const root = path.join(__dirname, "..");
const logsDir = path.join(root, ".artifacts", "logs");
const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
const runId = `${stamp}-${Math.random().toString(16).slice(2, 6)}`;

const REQUIRED_PACK_VERSION = 4;
const TRIVIA_MARKERS = [
  "Who made the first move?",
  "self-centered, petty, and egotistical",
  "maid of honor is not a paid position",
];
const TRIVIA_FORBIDDEN = [
  "Main food energy today?",
  "Scoring freezes at what time?",
  "Where is this party (city)?",
  "Where did Dani & Javad go on their first date?",
];
const HE_MARKERS = ["Who is more dramatic?", "hangry", "not that far"];

function ensureDir(d) {
  fs.mkdirSync(d, { recursive: true });
}

function log(level, event, detail, ok) {
  ensureDir(logsDir);
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    run_id: runId,
    level,
    event,
    cwd: root,
    action: "verify_guest_hub_full",
    ok,
    detail,
    base: BASE,
  });
  fs.appendFileSync(path.join(logsDir, `run-${runId}.jsonl`), line + "\n", "utf8");
  const tag = ok === false ? "FAIL" : ok === true ? "PASS" : "INFO";
  console.log(`[${tag}] ${event}`, typeof detail === "string" ? detail : JSON.stringify(detail));
}

function get(urlPath) {
  const url = new URL(urlPath.startsWith("http") ? urlPath : BASE + urlPath);
  const lib = url.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.get(
      url,
      { headers: { "cache-control": "no-cache", pragma: "no-cache" } },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            text: Buffer.concat(chunks).toString("utf8"),
            headers: res.headers,
          });
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(30000, () => {
      req.destroy(new Error("timeout " + urlPath));
    });
  });
}

function post(urlPath, body, headers = {}) {
  const url = new URL(urlPath.startsWith("http") ? urlPath : BASE + urlPath);
  const lib = url.protocol === "https:" ? https : http;
  const data = Buffer.from(JSON.stringify(body));
  return new Promise((resolve, reject) => {
    const req = lib.request(
      {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
          ...headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({ status: res.statusCode, text: Buffer.concat(chunks).toString("utf8") })
        );
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

const errors = [];
function check(name, cond, detail) {
  if (!cond) {
    errors.push(`${name}: ${detail || "failed"}`);
    log("error", name, detail || "failed", false);
  } else {
    log("info", name, detail || "ok", true);
  }
}

(async () => {
  try {
    // 1 Health
    const health = await get("/api/health");
    const hj = JSON.parse(health.text);
    check("health.ok", hj.ok === true, hj);
    check(
      "health.contentPack.version",
      hj.contentPack && hj.contentPack.version >= REQUIRED_PACK_VERSION,
      hj.contentPack
    );

    // 2 Config
    const cfg = JSON.parse((await get("/api/config")).text);
    check("config.eventName", Boolean(cfg.eventName), cfg.eventName);
    check("config.prize", cfg.prize != null, cfg.prize);

    // 3 Trivia API
    const trivia = JSON.parse((await get("/api/content/trivia?v=4")).text);
    const tqs = trivia.questions || [];
    const tblob = tqs.map((q) => q.q).join("\n");
    check("trivia.count>=12", tqs.length >= 12, tqs.length);
    check(
      "trivia.packVersion",
      (trivia.contentPackVersion || 0) >= REQUIRED_PACK_VERSION,
      trivia.contentPackVersion
    );
    for (const m of TRIVIA_MARKERS) {
      check(`trivia.marker:${m.slice(0, 40)}`, tblob.includes(m), m);
    }
    for (const f of TRIVIA_FORBIDDEN) {
      check(`trivia.forbidden.absent:${f}`, !tblob.includes(f), f);
    }

    // 4 Static trivia
    const st = JSON.parse((await get("/celebrate/data/trivia.json")).text);
    const sblob = (st.questions || []).map((q) => q.q).join("\n");
    check("static.trivia.count>=12", (st.questions || []).length >= 12, (st.questions || []).length);
    check("static.trivia.hasSister", /maid of honor/i.test(sblob));
    for (const f of TRIVIA_FORBIDDEN) {
      check(`static.trivia.forbidden.absent:${f}`, !sblob.includes(f));
    }

    // 5 He-said
    const he = JSON.parse((await get("/api/content/he-said?v=4")).text);
    const hblob = (he.questions || []).map((q) => q.q).join("\n");
    check("heSaid.count>=12", (he.questions || []).length >= 12, (he.questions || []).length);
    for (const m of HE_MARKERS) {
      check(`heSaid.marker:${m}`, hblob.toLowerCase().includes(m.toLowerCase()));
    }

    // 6 Photos
    const photos = JSON.parse((await get("/api/photos")).text);
    check("photos.count>=17", (photos.photos || []).length >= 17, (photos.photos || []).length);

    // 7 Memories 1-9
    for (let i = 1; i <= 9; i++) {
      const m = JSON.parse((await get(`/api/memories/${i}`)).text);
      const hasImg = Boolean(m.hasImage || m.imageUrl || m.imageDataUrl);
      check(`memory.${i}.enabled`, m.enabled === true, m.title);
      check(`memory.${i}.image`, hasImg, m.imageUrl || (m.imageDataUrl || "").slice(0, 40));
      check(`memory.${i}.caption`, Boolean(m.caption), m.caption);
    }

    // 8 Pages
    const pages = [
      "/celebrate/index.html",
      "/celebrate/join.html",
      "/celebrate/trivia.html",
      "/celebrate/he-said.html",
      "/celebrate/comingle.html",
      "/celebrate/photowall.html",
      "/celebrate/leaderboard.html",
      "/celebrate/poses.html",
      "/celebrate/stations.html",
      "/celebrate/screen.html",
      "/celebrate/host.html",
      "/celebrate/print/qrs.html",
      "/celebrate/hiddenmemory1.html",
      "/celebrate/assets/memories/memory-01.jpg",
      "/celebrate/assets/photowall/wall-01.jpg",
    ];
    for (const p of pages) {
      const r = await get(p);
      check(`page.${p}`, r.status === 200, r.status);
    }

    // 9 Join + score + leaderboard
    const uniq = `Vfy${Date.now().toString().slice(-7)}`;
    const created = await post("/api/profiles", {
      firstName: uniq,
      lastName: "Tester",
      forceNew: true,
    });
    check("profile.create", created.status === 201 || created.status === 200, created.status);
    const pj = JSON.parse(created.text);
    const profileId = pj.profile && pj.profile.id;
    check("profile.id", Boolean(profileId), profileId);

    if (profileId) {
      const sc = await post("/api/scores", {
        profileId,
        game: "trivia",
        score: 45,
        maxScore: 180,
      });
      check("score.post", sc.status === 200, sc.status);
      const lb = JSON.parse((await get("/api/leaderboard")).text);
      const entries = lb.leaderboard || lb.profiles || [];
      check("leaderboard.array", Array.isArray(entries), entries.length);
      // may be empty on multi-instance; soft if count 0 after score on another instance
      if (entries.length === 0) {
        log("warn", "leaderboard.empty_after_score", "possible multi-instance memory split", true);
      }
    }

    // 10 Host login
    const login = await post("/api/host/login", { password: process.env.PARTY_HOST_PASSWORD || "dj-host-2026" });
    check("host.login", login.status === 200, login.status);
  } catch (e) {
    errors.push(String(e && e.message ? e.message : e));
    log("error", "verify_exception", String(e), false);
  }

  const result = {
    run_id: runId,
    ts: new Date().toISOString(),
    action: "verify_guest_hub_full",
    base: BASE,
    required_pack_version: REQUIRED_PACK_VERSION,
    ok: errors.length === 0,
    error_count: errors.length,
    error_class: errors.length ? "guest_hub_regression" : null,
    message: errors.length ? errors.join(" | ") : "all guest hub checks passed",
    errors,
    cwd: root,
    next_steps: errors.length
      ? [
          "Read .artifacts/logs/LAST_ERROR.json",
          "Fix failing checks",
          "Redeploy",
          "Re-run: node scripts/verify-guest-hub-full.cjs https://www.thekeyholders.org",
        ]
      : ["Done"],
  };

  ensureDir(logsDir);
  fs.writeFileSync(
    path.join(logsDir, "LAST_GUEST_HUB_VERIFY.json"),
    JSON.stringify(result, null, 2)
  );
  fs.writeFileSync(
    path.join(root, ".artifacts", "CURRENT-guest-hub-verify"),
    `logs/LAST_GUEST_HUB_VERIFY.json\nrun_id=${runId}\nok=${result.ok}\n`
  );
  if (!result.ok) {
    fs.writeFileSync(path.join(logsDir, "LAST_ERROR.json"), JSON.stringify(result, null, 2));
    log("error", "verify_failed", result.message, false);
    process.exit(1);
  }
  log("info", "verify_passed", result.message, true);
  process.exit(0);
})();
