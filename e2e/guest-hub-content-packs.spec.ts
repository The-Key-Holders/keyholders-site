import { test, expect, devices } from "@playwright/test";

/**
 * Content-pack correctness for Guest Hub trivia + he/she said.
 * Run against production:
 *   PLAYWRIGHT_BASE_URL=https://www.thekeyholders.org npx playwright test e2e/guest-hub-content-packs.spec.ts
 */
const BASE = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3015";
const isDocker = BASE.includes("8088") || BASE.includes("192.168");
const hubRoot = isDocker ? "" : "/celebrate";
const api = (path: string) => `${BASE.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
const pageUrl = (path: string) => {
  const p = path.startsWith("/") ? path.slice(1) : path;
  return isDocker ? `${BASE}/${p}` : `${BASE}${hubRoot}/${p}`;
};

test.use({
  ...devices["Pixel 5"],
  browserName: "chromium",
});

test.describe("Guest Hub content packs v3", () => {
  test("API trivia is shipped v3 (sister roast + first move)", async ({ request }) => {
    const res = await request.get(api("/api/content/trivia"));
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    const qs = body.questions || [];
    expect(qs.length).toBeGreaterThanOrEqual(15);
    const blob = qs.map((q: { q: string }) => q.q).join("\n");
    expect(blob).toContain("Who made the first move?");
    expect(blob).toMatch(/self-centered|egotistical/i);
    expect(blob).toMatch(/maid of honor/i);
    expect(body.contentPackVersion ?? 3).toBeGreaterThanOrEqual(3);
  });

  test("API he-said is shipped v3 roast pack", async ({ request }) => {
    const res = await request.get(api("/api/content/he-said"));
    expect(res.status(), await res.text()).toBe(200);
    const body = await res.json();
    const qs = body.questions || [];
    expect(qs.length).toBeGreaterThanOrEqual(12);
    const blob = qs.map((q: { q: string }) => q.q).join("\n");
    expect(blob).toContain("Who is more dramatic?");
    expect(blob).toMatch(/hangry/i);
    expect(blob).toMatch(/not that far/i);
  });

  test("health reports content pack version", async ({ request }) => {
    const res = await request.get(api("/api/health"));
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.ok).toBeTruthy();
    if (body.contentPack) {
      expect(body.contentPack.version).toBeGreaterThanOrEqual(3);
    }
  });

  test("static trivia.json matches v3 markers", async ({ request }) => {
    const res = await request.get(pageUrl("data/trivia.json"));
    expect(res.status()).toBe(200);
    const body = await res.json();
    const blob = (body.questions || []).map((q: { q: string }) => q.q).join("\n");
    expect(blob).toContain("Who made the first move?");
    expect(blob).toMatch(/maid of honor/i);
  });

  test("browser trivia page shows first-move question after join", async ({ page }) => {
    // Minimal local profile so requireOrRedirect passes
    await page.goto(pageUrl("join.html"), { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.setItem(
        "dj_party_profile_v1",
        JSON.stringify({
          id: "local-content-pack-test",
          firstName: "Pack",
          lastName: "Tester",
          displayName: "Pack Tester",
        })
      );
    });
    await page.goto(pageUrl("trivia.html"), { waitUntil: "networkidle" });
    const start = page.locator("#start");
    if (await start.isVisible().catch(() => false)) {
      await start.click();
    }
    await expect(page.locator("#qtext")).toBeVisible({ timeout: 15_000 });
    const text = await page.locator("#qtext").innerText();
    // First question of shipped pack
    expect(text).toMatch(/first move|love you|sister|cook|dog|wearing|Sacramento|taco|freeze/i);
    // Walk until sister roast or end (cap 20)
    let foundSister = /self-centered|egotistical|maid of honor/i.test(text);
    for (let i = 0; i < 20 && !foundSister; i++) {
      const choice = page.locator("#choices .choice").first();
      if (!(await choice.isVisible().catch(() => false))) break;
      await choice.click();
      await page.waitForTimeout(500);
      if (await page.locator("#done").isVisible().catch(() => false)) break;
      const t = await page.locator("#qtext").innerText().catch(() => "");
      if (/self-centered|egotistical|maid of honor/i.test(t)) {
        foundSister = true;
        break;
      }
    }
    expect(foundSister, "expected sister roast question in trivia round").toBe(true);
  });
});
