/**
 * Live content-pack verification + structured logging.
 * Usage: node scripts/verify-content-packs.cjs [baseUrl]
 * Writes: .artifacts/logs/run-{runId}.jsonl and LAST_CONTENT_VERIFY.json
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
    action: "verify_content_packs",
    ok,
    detail,
    base: BASE,
  });
  fs.appendFileSync(path.join(logsDir, `run-${runId}.jsonl`), line + "\n", "utf8");
  console.log(line);
}

function get(urlPath) {
  const url = new URL(urlPath.startsWith("http") ? urlPath : BASE + urlPath);
  const lib = url.protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = lib.get(url, { headers: { "cache-control": "no-cache" } }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        resolve({ status: res.statusCode, text });
      });
    });
    req.on("error", reject);
  });
}

const TRIVIA_MARKERS = [
  "Who made the first move?",
  "self-centered, petty, and egotistical",
  "maid of honor is not a paid position",
];
const HE_MARKERS = ["Who is more dramatic?", "hangry", "not that far"];

(async () => {
  const errors = [];
  try {
    const health = await get("/api/health");
    const hj = JSON.parse(health.text);
    if (!hj.ok) errors.push("health.ok false");
    log("info", "health", hj, true);

    const trivia = await get("/api/content/trivia?v=3");
    const tj = JSON.parse(trivia.text);
    const tblob = (tj.questions || []).map((q) => q.q).join("\n");
    if ((tj.questions || []).length < 15) errors.push(`trivia count ${(tj.questions || []).length}`);
    for (const m of TRIVIA_MARKERS) {
      if (!tblob.includes(m)) errors.push(`trivia missing: ${m}`);
    }
    log("info", "trivia", { count: (tj.questions || []).length, pack: tj.contentPackId || tj.contentPackVersion }, errors.length === 0);

    const he = await get("/api/content/he-said?v=3");
    const hj2 = JSON.parse(he.text);
    const hblob = (hj2.questions || []).map((q) => q.q).join("\n");
    if ((hj2.questions || []).length < 12) errors.push(`he-said count ${(hj2.questions || []).length}`);
    for (const m of HE_MARKERS) {
      if (!hblob.toLowerCase().includes(m.toLowerCase())) errors.push(`he-said missing: ${m}`);
    }
    log("info", "he_said", { count: (hj2.questions || []).length }, true);

    const staticT = await get("/celebrate/data/trivia.json");
    const st = JSON.parse(staticT.text);
    const sblob = (st.questions || []).map((q) => q.q).join("\n");
    for (const m of TRIVIA_MARKERS) {
      if (!sblob.includes(m)) errors.push(`static trivia missing: ${m}`);
    }
  } catch (e) {
    errors.push(String(e && e.message ? e.message : e));
    log("error", "verify_exception", String(e), false);
  }

  const result = {
    run_id: runId,
    ts: new Date().toISOString(),
    action: "verify_content_packs",
    base: BASE,
    ok: errors.length === 0,
    error_class: errors.length ? "content_pack_mismatch" : null,
    message: errors.length ? errors.join(" | ") : "all content pack checks passed",
    cwd: root,
    next_steps: errors.length
      ? ["Redeploy party content fix", "Hard-refresh trivia.html", "Re-run node scripts/verify-content-packs.cjs"]
      : ["Done"],
  };
  ensureDir(logsDir);
  fs.writeFileSync(path.join(logsDir, "LAST_CONTENT_VERIFY.json"), JSON.stringify(result, null, 2));
  if (!result.ok) {
    fs.writeFileSync(path.join(logsDir, "LAST_ERROR.json"), JSON.stringify(result, null, 2));
    log("error", "verify_failed", result.message, false);
    process.exit(1);
  }
  log("info", "verify_passed", result.message, true);
  process.exit(0);
})();
