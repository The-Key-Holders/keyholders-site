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

test.describe("CA 9-1-1 Advisor AI (separate from help-agent)", () => {
  test("unauthenticated visitor is redirected", async ({ page }) => {
    await page.goto("/advisor-tools/advisor-ai");
    await expect(page).toHaveURL(/\/advisor-tools\/login/);
  });

  test("hub lists Advisor AI and New Hire help agent as separate tools", async ({ page }) => {
    await loginAdvisorTools(page);
    await page.goto("/advisor-tools");
    await expect(page.getByRole("heading", { name: /CA 9-1-1 Advisor AI/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /New Hire \+ Automation Help Agent/i })).toBeVisible();
  });

  test("advisor-ai page loads greeting and help-agent still exists", async ({ page }) => {
    await loginAdvisorTools(page);
    await page.goto("/advisor-tools/advisor-ai");
    await expect(page.getByRole("heading", { name: /CA 9-1-1 Advisor AI/i })).toBeVisible();
    await expect(page.getByText(/complement/i).first()).toBeVisible();
    await expect(page.getByLabel(/Message/i)).toBeVisible();

    await page.goto("/advisor-tools/help-agent");
    await expect(page.getByRole("heading", { name: /New Hire \+ Automation Help/i })).toBeVisible();
  });
});
