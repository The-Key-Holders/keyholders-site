import { expect, test } from "@playwright/test";
import path from "path";

const SAMPLE = `PSAP	Tracking	Amount	Notes
9820 Stockton CHP	19280	3933.00	NOT LISTED
1915 LA CSU	24669	8712.00	YR8
3009 Huntington Beach PD	29501-OP	104229.00	CPE INSTALL
3103 Placer County SO	25908	1200.50	MA North`;

const ADVISOR_PASSWORD = process.env.ADVISOR_TOOLS_PASSWORD || "CalOES-911-AdvisorHub-2026";

async function loginAdvisorTools(page: import("@playwright/test").Page) {
  await page.goto("/advisor-tools/login");
  await page.getByLabel(/Password/i).fill(ADVISOR_PASSWORD);
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes("/api/advisor-tools/auth") && r.request().method() === "POST"
  );
  await page.getByRole("button", { name: /Unlock tools/i }).click();
  const res = await responsePromise;
  expect(res.status(), `auth API status; body may indicate password/env mismatch`).toBe(200);
  // Login page uses full navigation after Set-Cookie; wait for hub (or any non-login path).
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 20_000 });
}

test.describe("Advisor Tools auth gate", () => {
  test("unauthenticated visitor is redirected to login", async ({ page }) => {
    await page.goto("/advisor-tools");
    await expect(page).toHaveURL(/\/advisor-tools\/login/);
    await expect(page.getByRole("heading", { name: /Advisor Tools Login/i })).toBeVisible();
  });

  test("wrong password is rejected", async ({ page }) => {
    await page.goto("/advisor-tools/login");
    await page.getByLabel(/Password/i).fill("definitely-wrong-password");
    await page.getByRole("button", { name: /Unlock tools/i }).click();
    await expect(page.getByText(/Incorrect password/i)).toBeVisible();
  });
});

test.describe("Advisor Tools Hub", () => {
  test.beforeEach(async ({ page }) => {
    await loginAdvisorTools(page);
  });

  test("hub lists live and beta tools", async ({ page }) => {
    await page.goto("/advisor-tools");
    await expect(page.getByRole("heading", { name: "Advisor Tools Hub" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /New Hire \+ Automation Help Agent/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "PSAP Allotment Engine" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Invoice ↔ TD-288 Reconciler" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "FOR Assembly Engine" })).toBeVisible();
  });

  test("hub navigates to invoice reconciler", async ({ page }) => {
    await page.goto("/advisor-tools");
    await page.locator('a[href="/advisor-tools/invoice-reconciler"]').click();
    await expect(page).toHaveURL(/\/advisor-tools\/invoice-reconciler/);
    await expect(page.getByRole("heading", { name: /Invoice ↔ TD-288 Reconciler/i })).toBeVisible();
  });

  test("hub navigates to help agent chat", async ({ page }) => {
    await page.goto("/advisor-tools");
    await page.locator('a[href="/advisor-tools/help-agent"]').click();
    await expect(page).toHaveURL(/\/advisor-tools\/help-agent/);
    await expect(page.getByRole("heading", { name: /New Hire \+ Automation Help/i })).toBeVisible();
    await expect(page.getByText(/password-protected hub/i)).toBeVisible();
    await expect(page.getByText(/Grok/i).first()).toBeVisible();
    await expect(page.getByLabel(/Message/i)).toBeVisible();
  });
});

test.describe("Help agent chat gate", () => {
  test("unauthenticated visitor cannot open help agent page", async ({ page }) => {
    await page.goto("/advisor-tools/help-agent");
    await expect(page).toHaveURL(/\/advisor-tools\/login/);
  });

  test("unauthenticated chat API returns 401", async ({ request }) => {
    const res = await request.post("/api/advisor-tools/agent-chat", {
      data: { message: "hello" },
    });
    expect(res.status()).toBe(401);
  });
});

test.describe("Invoice TD-288 Reconciler web app", () => {
  test.beforeEach(async ({ page }) => {
    await loginAdvisorTools(page);
  });

  test("runs sample batch with TD-288 filename fixtures and shows traffic lights", async ({
    page,
  }) => {
    await page.goto("/advisor-tools/invoice-reconciler");

    await expect(page.getByRole("heading", { name: /Invoice ↔ TD-288 Reconciler/i })).toBeVisible();

    const batch = page.getByLabel(/Victoria batch table/i);
    await batch.fill(SAMPLE);

    const fixtureDir = path.join(process.cwd(), "e2e", "fixtures", "td288_fake_tree");
    const files = [
      path.join(fixtureDir, "TK_24669_CPE_commitment.xls"),
      path.join(fixtureDir, "25908_ATT_MA_TD288.xlsx"),
    ];
    await page.locator('input[type="file"]').first().setInputFiles(files);

    await page.getByRole("button", { name: /Run reconciliation/i }).click();

    await expect(page.getByText(/GREEN\s*1/i)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/YELLOW\s*1/i)).toBeVisible();
    await expect(page.getByText(/RED\s*2/i)).toBeVisible();

    await expect(page.getByRole("cell", { name: "24669" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "25908" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "29501" })).toBeVisible();

    await expect(page.getByRole("button", { name: /Download approve\.csv/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Download dispute\.csv/i })).toBeVisible();
  });

  test("shows warning path when no TD-288 index provided", async ({ page }) => {
    await page.goto("/advisor-tools/invoice-reconciler");
    await page.getByLabel(/Victoria batch table/i).fill(
      "PSAP\tTracking\tAmount\tNotes\n3103 Placer\t99999\t10\tMA\n"
    );
    await page.getByRole("button", { name: /Run reconciliation/i }).click();
    await expect(page.getByText(/RED/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/TD288_NOT_FOUND/i).first()).toBeVisible();
  });

  test("allotment page still loads from hub live card", async ({ page }) => {
    await page.goto("/advisor-tools");
    await page.locator('a[href="/psap-allotment"]').click();
    await expect(page).toHaveURL(/\/psap-allotment/);
    await expect(page.getByRole("heading", { name: /PSAP Allotment Engine/i })).toBeVisible();
  });
});

test.describe("Portfolio cohesion", () => {
  test("homepage projects section mentions Advisor Tools", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /One portfolio, many keys/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Advisor Tools Hub/i })).toBeVisible();
  });

  test("projects page lists catalog", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Invoice ↔ TD-288 Reconciler/i })).toBeVisible();
  });
});
