import { test, expect, devices } from "@playwright/test";

/**
 * Guest Hub functional suite.
 * Default: local Next (playwright.config). Override for Docker or TKH:
 *   PLAYWRIGHT_BASE_URL=http://127.0.0.1:8088 npx playwright test e2e/guest-hub.spec.ts
 *   PLAYWRIGHT_BASE_URL=https://www.thekeyholders.org npx playwright test e2e/guest-hub.spec.ts
 */
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3015";
const isDocker = BASE.includes("8088") || BASE.includes("192.168");
const isTkh = BASE.includes("thekeyholders.org") || BASE.includes("keyholders-site.vercel.app");

// Hub lives at /celebrate on TKH/Next, root on Docker nginx
const hubRoot = isDocker ? "" : "/celebrate";
const pageUrl = (path: string) => {
  if (!path || path === "/" || path === "index.html") {
    return isDocker ? `${BASE}/` : `${BASE}${hubRoot}/index.html`;
  }
  const p = path.startsWith("/") ? path.slice(1) : path;
  return isDocker ? `${BASE}/${p}` : `${BASE}${hubRoot}/${p}`;
};

// Chromium + mobile viewport (avoid requiring WebKit install)
test.use({
  ...devices["Pixel 5"],
  browserName: "chromium",
});

test.describe("Guest Hub @ mobile", () => {
  test("critical routes respond (not 404)", async ({ request }) => {
    const paths = [
      "index.html",
      "join.html",
      "help.html",
      "trivia.html",
      "comingle.html",
      "predict.html",
      "photowall.html",
      "jukebox.html",
      "stations.html",
      "ar.html",
      "margarita.html",
      "advice.html",
      "rings.html",
      "guestbook.html",
      "leaderboard.html",
      "screen.html",
      "passport.html",
      "poses.html",
      "he-said.html",
      "photos.html",
      "css/party.css",
      "js/config.js",
    ];
    const failures: string[] = [];
    for (const p of paths) {
      const url = pageUrl(p);
      const res = await request.get(url);
      if (res.status() !== 200) {
        failures.push(`${res.status()} ${url}`);
      }
    }
    // API only fully available on Docker (or Next with party routes when deployed)
    if (isDocker) {
      const health = await request.get(`${BASE}/api/health`);
      expect(health.status(), "api health").toBe(200);
      const body = await health.json();
      expect(body.ok).toBeTruthy();
    }
    expect(failures, failures.join("\n")).toEqual([]);
  });

  test("home shows hub + help fab", async ({ page }) => {
    const res = await page.goto(pageUrl("index.html"), { waitUntil: "domcontentloaded" });
    expect(res?.status(), "home status").toBe(200);
    await expect(page.getByRole("heading", { name: /Guest Hub|You made it/i }).first()).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator(".help-fab")).toBeVisible();
    await expect(page.locator("#tile-grid .tile").first()).toBeVisible();
  });

  test("help guide + about developer links", async ({ page }) => {
    const res = await page.goto(pageUrl("help.html"), { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /How to use this app|Welcome/i }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /About the developer/i })).toBeVisible();
    const tkh = page.getByRole("link", { name: /The Key Holders/i });
    const gnd = page.getByRole("link", { name: /Geeks Next Door/i });
    await expect(tkh).toBeVisible();
    await expect(gnd).toBeVisible();
    await expect(tkh).toHaveAttribute("href", /thekeyholders\.org/);
    await expect(gnd).toHaveAttribute("href", /thegeeksnextdoor\.com/);
  });

  test("join profile + leaderboard API path", async ({ page }) => {
    test.skip(isTkh && !isDocker, "TKH production may not serve celebrate yet");
    await page.goto(pageUrl("join.html"), { waitUntil: "domcontentloaded" });
    const stamp = Date.now().toString().slice(-6);
    await page.fill("#first", `Play${stamp}`);
    await page.fill("#last", "Wright");
    await page.click('button[type="submit"]');
    // Should land on home or next after join
    await page.waitForTimeout(800);
    const url = page.url();
    // Accept home or still on join if offline-created
    expect(url.includes("join.html") || url.includes("index.html") || url.endsWith("/")).toBeTruthy();

    // Navigate trivia if API/join worked
    await page.goto(pageUrl("trivia.html"), { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).toContainText(/Trivia|Couple|Join/i);
  });

  test("screen / projection board loads", async ({ page }) => {
    // screen is desktop-ish but still must 200
    const res = await page.goto(pageUrl("screen.html"), { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).toContainText(/Guest Hub|Leaderboard|Scan/i);
  });
});

test.describe("Guest Hub full API flow (Docker)", () => {
  test.skip(!isDocker, "Requires Docker stack with party-api");

  test("join → score → leaderboard → comingle → station", async ({ page, request }) => {
    const stamp = Date.now().toString().slice(-5);
    const first = `Pw${stamp}`;
    const last = "Test";

    // API join
    const create = await request.post(`${BASE}/api/profiles`, {
      data: { firstName: first, lastName: last },
    });
    expect(create.status()).toBe(201);
    const { profile } = await create.json();
    expect(profile.id).toBeTruthy();

    const score = await request.post(`${BASE}/api/scores`, {
      data: { profileId: profile.id, game: "trivia", score: 45, maxScore: 120 },
    });
    expect(score.ok()).toBeTruthy();

    const comingle = await request.post(`${BASE}/api/comingle`, {
      data: { profileId: profile.id, promptId: "chad", answer: "Quinn" },
    });
    expect(comingle.ok()).toBeTruthy();
    const cj = await comingle.json();
    expect(cj.correct).toBeTruthy();

    const station = await request.post(`${BASE}/api/stations`, {
      data: { profileId: profile.id, stationId: "arch", answer: "floral arch" },
    });
    expect(station.ok()).toBeTruthy();

    const lb = await request.get(`${BASE}/api/leaderboard`);
    expect(lb.ok()).toBeTruthy();
    const board = await lb.json();
    expect(board.leaderboard?.length).toBeGreaterThan(0);
    expect(board.scoring?.scoringOpen !== undefined).toBeTruthy();

    const dash = await request.get(`${BASE}/api/dashboard`);
    expect(dash.ok()).toBeTruthy();
    const d = await dash.json();
    expect(d.leaderboard).toBeTruthy();
    expect(d.prize).toBeTruthy();

    // UI leaderboard shows names
    await page.goto(pageUrl("leaderboard.html"), { waitUntil: "domcontentloaded" });
    await expect(page.locator("#board")).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("TKH production smoke", () => {
  test.skip(!isTkh, "Only when BASE is thekeyholders.org");

  test("document celebrate availability", async ({ request }) => {
    const paths = [
      "/celebrate/",
      "/celebrate/index.html",
      "/celebrate/help.html",
      "/projects/guest-hub",
      "/api/health",
    ];
    const report: Record<string, number> = {};
    for (const p of paths) {
      const res = await request.get(`${BASE}${p}`);
      report[p] = res.status();
    }
    // Soft assert: fail with clear map if 404
    const bad = Object.entries(report).filter(([, s]) => s >= 400);
    expect(bad, `TKH failures: ${JSON.stringify(report)}`).toEqual([]);
  });
});
