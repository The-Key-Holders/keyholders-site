import { expect, test } from "@playwright/test";

const PASSWORD =
  process.env.ADVISOR_TOOLS_PASSWORD ||
  process.env.PLAYWRIGHT_ADVISOR_PASSWORD ||
  "CalOES-911-AdvisorHub-2026";

async function login(page: import("@playwright/test").Page, next = "/psap-portal") {
  await page.goto(`/advisor-tools/login?next=${encodeURIComponent(next)}`);
  await page.getByLabel(/Password/i).fill(PASSWORD);
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes("/api/advisor-tools/auth") && r.request().method() === "POST"
  );
  await page.getByRole("button", { name: /Unlock tools/i }).click();
  const res = await responsePromise;
  expect(res.status()).toBe(200);
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20_000 });
}

test.describe("PSAP portal", () => {
  test("login lands on portal home", async ({ page }) => {
    await login(page, "/psap-portal");
    await expect(page.getByRole("heading", { name: /hub for CPE funding/i })).toBeVisible({
      timeout: 15000,
    });
  });

  test("advisor lookup finds Alameda", async ({ page }) => {
    await login(page, "/psap-portal/tools/advisor-lookup");
    await page.getByTestId("advisor-search").fill("Alameda");
    await expect(page.getByTestId("advisor-results")).toContainText(/Alameda/i, {
      timeout: 10000,
    });
  });

  test("TD-288 checker shows Blocked then Ready", async ({ page }) => {
    await login(page, "/psap-portal/tools/td288-checker");
    await expect(page.getByTestId("td288-result")).toContainText(/Blocked/i);
    // Check all boxes; second pass catches residual child fields that appear after parent is checked
    for (let pass = 0; pass < 2; pass++) {
      const boxes = page.locator('label input[type="checkbox"]');
      const count = await boxes.count();
      for (let i = 0; i < count; i++) {
        await boxes.nth(i).check();
      }
    }
    await expect(page.getByTestId("td288-result")).toContainText(/Ready/i);
  });

  test("submit question creates ticket", async ({ page }) => {
    await login(page, "/psap-portal/tools/submit-question");
    await page.getByPlaceholder("PSAP name").fill("E2E PSAP");
    await page.getByPlaceholder("County").fill("Alameda");
    await page.getByPlaceholder("Contact name").fill("Test User");
    await page.getByPlaceholder("Contact email").fill("test@example.com");
    await page.getByPlaceholder("Your question…").fill("How do we prepare Advance Notification?");
    await page.getByRole("button", { name: /submit ticket/i }).click();
    await expect(page.getByTestId("question-success")).toContainText(/Ticket Q-/i);
  });

  test("admin can publish news", async ({ page }) => {
    await login(page, "/psap-portal/admin");
    const title = `E2E News ${Date.now()}`;
    await page.getByPlaceholder("Title").fill(title);
    await page.getByPlaceholder("Body").fill("Automated publish test body.");
    await page.locator('input[name="published"]').check();
    await page.getByRole("button", { name: /save news/i }).click();
    await page.goto("/psap-portal/news");
    await expect(page.getByText(title)).toBeVisible({ timeout: 10000 });
  });

  test("chat API reports configuration shape", async ({ page }) => {
    await login(page, "/psap-portal");
    const res = await page.request.get("/api/psap-portal/chat");
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty("configured");
    expect(json.agentId).toBe("psap-funding-support-agent");
  });

  test("Taskade site guide not shown on portal", async ({ page }) => {
    await login(page, "/psap-portal");
    await expect(page.getByText(/Site Guide here \(Taskade\)/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: /PSAP Support AI/i })).toBeVisible();
  });

  test("start here explains purpose, free beta, and Vault Keywright", async ({ page }) => {
    await login(page, "/psap-portal/start");
    await expect(page.getByRole("heading", { name: /Welcome to the PSAP Funding/i })).toBeVisible();
    await expect(page.getByText(/Why this is free right now/i)).toBeVisible();
    await expect(page.getByText(/beta stage/i)).toBeVisible();
    await expect(page.getByText(/invited by someone close to the developer/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Vault Keywright/i })).toBeVisible();
    await expect(page.getByText(/CPE project path/i)).toBeVisible();
  });
});

