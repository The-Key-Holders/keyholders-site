import { expect, test } from "@playwright/test";

const ADVISOR_PASSWORD = process.env.ADVISOR_TOOLS_PASSWORD || "CalOES-911-AdvisorHub-2026";

async function loginAdvisorTools(page: import("@playwright/test").Page) {
  await page.goto("/advisor-tools/login");
  await page.getByLabel(/Password/i).fill(ADVISOR_PASSWORD);
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes("/api/advisor-tools/auth") && r.request().method() === "POST"
  );
  await page.getByRole("button", { name: /Unlock tools/i }).click();
  const res = await responsePromise;
  expect(res.status()).toBe(200);
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20_000 });
}

test.describe("CPE Fit gate", () => {
  test("unauthenticated /advisor-tools/cpe-fit redirects to login", async ({ page }) => {
    await page.goto("/advisor-tools/cpe-fit");
    await expect(page).toHaveURL(/\/advisor-tools\/login/);
    await expect(page.getByRole("heading", { name: /Advisor Tools Login/i })).toBeVisible();
  });

  test("unauthenticated estimate API returns 401", async ({ request }) => {
    const res = await request.post("/api/advisor-tools/cpe-fit/estimate", {
      data: { vendor: "4", positions: "5", years: "5" },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("CPE Fit preview", () => {
  test.beforeEach(async ({ page }) => {
    await loginAdvisorTools(page);
  });

  test("hub card opens CPE Fit", async ({ page }) => {
    await page.goto("/advisor-tools");
    await expect(page.getByRole("heading", { name: "CPE Fit" })).toBeVisible();
    await page.locator('a[href="/advisor-tools/cpe-fit"]').click();
    await expect(page).toHaveURL(/\/advisor-tools\/cpe-fit/);
    await expect(page.getByRole("heading", { name: /Will this system fit the allotment/i })).toBeVisible();
  });

  test("SOS 5-pos estimate is $532,576.95 and compare lists 12 vendors", async ({ page }) => {
    await page.goto("/advisor-tools/cpe-fit/estimate");
    await expect(page.getByRole("heading", { name: "New estimate" })).toBeVisible();
    await page.locator('select[name="vendor"]').selectOption("4");
    await page.locator('select[name="positions"]').selectOption("5");
    await page.locator('input[name="years"]').fill("5");
    await page.locator('input[name="allotment"]').fill("600000");
    await page.getByRole("button", { name: /See the estimate/i }).click();
    await expect(page.getByText("$532,576.95").first()).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("FITS ALLOTMENT")).toBeVisible();
    await page.getByRole("button", { name: /Compare all 12 vendors/i }).click();
    await expect(page.getByRole("heading", { name: /All 12 contracts/i })).toBeVisible();
    await expect(page.getByRole("button", { name: "Details" })).toHaveCount(12);
  });

  test("catalog.json is not a public URL", async ({ page, request }) => {
    for (const p of ["/catalog.json", "/cpe-fit/catalog.json", "/data/catalog.json", "/lib/cpe-fit/catalog.json"]) {
      const res = await request.get(p);
      expect(res.status(), p).toBeGreaterThanOrEqual(400);
      const body = await res.text();
      expect(body).not.toContain("A251018514");
    }
    const gated = await page.request.get("/advisor-tools/cpe-fit/catalog.json");
    const gatedBody = await gated.text();
    expect(gatedBody).not.toContain("A251018514");
    expect(gatedBody).not.toContain('"SA":');
  });
});
