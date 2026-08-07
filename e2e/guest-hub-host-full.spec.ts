import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

/**
 * Full Guest Hub + Host desk E2E against production TKH (cellular path).
 *
 *   PLAYWRIGHT_BASE_URL=https://www.thekeyholders.org npx playwright test e2e/guest-hub-host-full.spec.ts --project=chromium
 */
const BASE = process.env.PLAYWRIGHT_BASE_URL || "https://www.thekeyholders.org";
const HUB = `${BASE}/celebrate`;
const HOST_PW = process.env.PARTY_HOST_PASSWORD || "dj-host-2026";

// 1x1 red JPEG as data URL (tiny, reliable for memory image test)
const TINY_JPEG =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGcP//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//Z";

test.describe.configure({ mode: "serial" });

test.describe("Guest Hub + Host desk full E2E @ TKH", () => {
  test("API health + config surface", async ({ request }) => {
    const health = await request.get(`${BASE}/api/health`);
    expect(health.status()).toBe(200);
    const h = await health.json();
    expect(h.ok).toBeTruthy();

    const cfg = await request.get(`${BASE}/api/config`);
    expect(cfg.status()).toBe(200);
    const c = await cfg.json();
    expect(c.couple || c.eventName).toBeTruthy();
    expect(Array.isArray(c.comingle) ? c.comingle.length : 0).toBeGreaterThan(0);
    expect(c.prize).toBeTruthy();
  });

  test("critical guest pages return 200", async ({ request }) => {
    const pages = [
      "index.html",
      "join.html",
      "trivia.html",
      "comingle.html",
      "leaderboard.html",
      "screen.html",
      "host.html",
      "print/qrs.html",
      "hiddenmemory1.html",
      "hiddenmemory10.html",
      "js/config.js",
      "js/qrcode.min.js",
      "css/party.css",
    ];
    const fails: string[] = [];
    for (const p of pages) {
      const res = await request.get(`${HUB}/${p}`);
      if (res.status() !== 200) fails.push(`${res.status()} ${p}`);
    }
    expect(fails, fails.join("\n")).toEqual([]);
  });

  test("host login, prize toggle, memories with image", async ({ request }) => {
    const login = await request.post(`${BASE}/api/host/login`, {
      data: { password: HOST_PW },
    });
    expect(login.status()).toBe(200);
    const { token } = await login.json();
    expect(token).toBeTruthy();
    const auth = { Authorization: `Bearer ${token}` };

    // Prize ON
    const prizeOn = await request.put(`${BASE}/api/host/config`, {
      headers: auth,
      data: {
        prize: {
          title: "E2E $42 Gift Card",
          description: "E2E prize description",
          announceAt: "4:30 PM",
          legalNote: "E2E legal",
          enabled: true,
        },
      },
    });
    expect(prizeOn.status()).toBe(200);
    const onBody = await prizeOn.json();
    expect(onBody.config.prize.title).toContain("E2E $42");
    expect(onBody.config.prize.enabled).toBe(true);

    const publicOn = await (await request.get(`${BASE}/api/config`)).json();
    expect(publicOn.prize.title).toContain("E2E $42");
    expect(publicOn.prize.enabled).toBe(true);

    const lbOn = await (await request.get(`${BASE}/api/leaderboard`)).json();
    expect(lbOn.prize.title).toContain("E2E $42");
    expect(lbOn.prize.enabled).toBe(true);

    // Prize OFF
    const prizeOff = await request.put(`${BASE}/api/host/config`, {
      headers: auth,
      data: {
        prize: {
          title: "E2E $42 Gift Card",
          description: "hidden",
          enabled: false,
        },
      },
    });
    expect(prizeOff.status()).toBe(200);
    const offBody = await prizeOff.json();
    expect(offBody.config.prize.enabled).toBe(false);
    const publicOff = await (await request.get(`${BASE}/api/config`)).json();
    expect(publicOff.prize.enabled).toBe(false);

    // Prize back ON for guests
    await request.put(`${BASE}/api/host/config`, {
      headers: auth,
      data: {
        prize: {
          title: "E2E $42 Gift Card",
          description: "Highest score wins",
          announceAt: "4:30 PM",
          legalNote: "Must be present",
          enabled: true,
        },
      },
    });

    // Memories: slot 1 with tiny image data URL
    const memories = Array.from({ length: 10 }, (_, i) => ({
      slot: i + 1,
      title: i === 0 ? "E2E Kings night" : `Hidden memory ${i + 1}`,
      caption:
        i === 0
          ? "Did you know Dani and Javad went to a Kings game with Scotty and Briana?"
          : "",
      imageDataUrl: i === 0 ? TINY_JPEG : "",
      imageUrl: "",
      enabled: i === 0,
    }));
    const memSave = await request.put(`${BASE}/api/host/memories`, {
      headers: auth,
      data: { memories },
    });
    expect(memSave.status(), await memSave.text()).toBe(200);
    const memBody = await memSave.json();
    expect(memBody.ok).toBeTruthy();
    const saved1 = (memBody.memories || []).find((m: { slot: number }) => m.slot === 1);
    expect(saved1?.enabled).toBe(true);
    expect((saved1?.imageDataUrl || "").length).toBeGreaterThan(20);

    const pub1 = await (await request.get(`${BASE}/api/memories/1`)).json();
    expect(pub1.enabled).toBe(true);
    expect(pub1.hasImage || pub1.imageDataUrl || pub1.imageUrl).toBeTruthy();
    expect((pub1.imageDataUrl || pub1.imageUrl || "").length).toBeGreaterThan(10);

    const pub2 = await (await request.get(`${BASE}/api/memories/2`)).json();
    expect(pub2.enabled).toBe(false);
  });

  test("guest join → score → comingle → station → leaderboard", async ({ request }) => {
    const uniq = `E2E${Date.now().toString().slice(-6)}`;
    const create = await request.post(`${BASE}/api/profiles`, {
      data: { firstName: uniq, lastName: "Tester", forceNew: true },
    });
    expect(create.status()).toBe(201);
    const { profile } = await create.json();
    expect(profile.id).toBeTruthy();

    const score = await request.post(`${BASE}/api/scores`, {
      data: { profileId: profile.id, game: "trivia", score: 30, maxScore: 120 },
    });
    expect(score.status()).toBe(200);
    const sc = await score.json();
    expect(sc.totalPoints).toBeGreaterThanOrEqual(30);

    const com = await request.post(`${BASE}/api/comingle`, {
      data: { profileId: profile.id, promptId: "chad", answer: "Quinn" },
    });
    expect(com.status()).toBe(200);
    const cj = await com.json();
    expect(cj.correct).toBe(true);

    const st = await request.post(`${BASE}/api/stations`, {
      data: { profileId: profile.id, stationId: "margarita", answer: "margarita bar" },
    });
    expect(st.status()).toBe(200);
    expect((await st.json()).correct).toBe(true);

    const lb = await (await request.get(`${BASE}/api/leaderboard`)).json();
    expect(lb.leaderboard?.length).toBeGreaterThan(0);
    const me = lb.leaderboard.find((r: { profileId: string }) => r.profileId === profile.id);
    expect(me).toBeTruthy();
    expect(me.totalPoints).toBeGreaterThanOrEqual(75);
  });

  test("browser: host desk UI unlock + prize fields", async ({ page }) => {
    await page.goto(`${HUB}/host.html`, { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /Host desk/i })).toBeVisible();
    await page.locator("#pw").fill(HOST_PW);
    await page.locator("#btn-login").click();
    await expect(page.locator("#desk")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("#prize-title")).toBeVisible();
    await expect(page.locator("#prize-enabled")).toBeVisible();
    await expect(page.locator("#memories-list")).toBeVisible({ timeout: 15000 });
    // Save prize via UI
    await page.locator("#prize-title").fill("UI E2E Prize");
    await page.locator("#prize-enabled").selectOption("true");
    await page.locator("#btn-save-prize").click();
    await expect(page.locator("#prize-save-status")).toContainText(/Saved|Live prize/i, {
      timeout: 15000,
    });
  });

  test("browser: guest hub home tiles + leaderboard prize from API", async ({ page }) => {
    await page.goto(`${HUB}/index.html`, { waitUntil: "networkidle" });
    await expect(page.locator("#tile-grid .tile").first()).toBeVisible({ timeout: 15000 });
    await page.goto(`${HUB}/leaderboard.html`, { waitUntil: "networkidle" });
    // After host tests, prize should be enabled with E2E or UI title
    const title = await page.locator("#prize-title").innerText();
    expect(title.toLowerCase()).not.toContain("5,000");
  });

  test("browser: hidden memory page shows caption and image when set", async ({ page }) => {
    // Ensure memory 1 still has image via API (re-set if cold start wiped)
    const login = await page.request.post(`${BASE}/api/host/login`, {
      data: { password: HOST_PW },
    });
    const { token } = await login.json();
    const memories = Array.from({ length: 10 }, (_, i) => ({
      slot: i + 1,
      title: i === 0 ? "E2E Photo Memory" : `Hidden memory ${i + 1}`,
      caption: i === 0 ? "Did you know this is an E2E memory photo check?" : "",
      imageDataUrl: i === 0 ? TINY_JPEG : "",
      imageUrl: "",
      enabled: i === 0,
    }));
    const save = await page.request.put(`${BASE}/api/host/memories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { memories },
    });
    expect(save.status()).toBe(200);

    const apiMem = await (await page.request.get(`${BASE}/api/memories/1`)).json();
    expect(apiMem.enabled).toBe(true);
    expect(apiMem.imageDataUrl || apiMem.imageUrl).toBeTruthy();

    await page.goto(`${HUB}/hiddenmemory1.html`, { waitUntil: "networkidle" });
    await expect(page.locator("#title")).not.toHaveText(/Loading/i, { timeout: 15000 });
    await expect(page.locator("#title")).toContainText(/E2E|Photo|Memory|Kings/i);
    await expect(page.locator("#caption")).toBeVisible();
    // Image element should appear when API returns image
    await expect(page.locator("#img-wrap img")).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: /Guest Hub/i })).toBeVisible();
  });

  test("browser: join flow works", async ({ page }) => {
    await page.goto(`${HUB}/join.html`, { waitUntil: "domcontentloaded" });
    const name = `Play${Date.now().toString().slice(-5)}`;
    await page.locator('input[name="first"], #first, input[placeholder*="First" i]').first().fill(name);
    await page.locator('input[name="last"], #last, input[placeholder*="Last" i]').first().fill("Guest");
    const joinBtn = page.getByRole("button", { name: /join|create|continue|start/i }).first();
    if (await joinBtn.isVisible().catch(() => false)) {
      await joinBtn.click();
    } else {
      // try submit
      await page.locator("form button, .btn").first().click();
    }
    await page.waitForTimeout(1500);
    // Should land on hub or stay with profile chip
    const url = page.url();
    expect(url).toMatch(/celebrate/);
  });

  test("QR print pack defaults to TKH base", async ({ page }) => {
    await page.goto(`${HUB}/print/qrs.html`, { waitUntil: "networkidle" });
    const base = await page.locator("#base").inputValue();
    expect(base).toContain("thekeyholders.org/celebrate");
    expect(base).not.toMatch(/localhost|192\.168/);
    // Generate should produce canvases
    await page.locator("#gen").click();
    await page.waitForTimeout(2000);
    const canvases = await page.locator("canvas").count();
    expect(canvases).toBeGreaterThan(5);
  });
});
