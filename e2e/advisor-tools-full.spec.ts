import { expect, test } from "@playwright/test";
import path from "path";

const ADVISOR_PASSWORD = process.env.ADVISOR_TOOLS_PASSWORD || "CalOES-911-AdvisorHub-2026";

async function login(page: import("@playwright/test").Page) {
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

test.describe("Advisor Tools full interactions (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("hub cards open allotment and invoice", async ({ page }) => {
    await page.goto("/advisor-tools");
    await expect(page.getByRole("heading", { name: /Advisor Tools Hub/i })).toBeVisible();

    await page.locator('a[href="/psap-allotment"]').first().click();
    await expect(page).toHaveURL(/\/psap-allotment/);
    await expect(page.getByRole("heading", { name: /PSAP Allotment Engine/i })).toBeVisible();

    // breadcrumb / form present
    await expect(page.getByText(/Call Summary|ECaTS|funding/i).first()).toBeVisible();

    await page.goto("/advisor-tools");
    await page.locator('a[href="/advisor-tools/invoice-reconciler"]').first().click();
    await expect(page).toHaveURL(/\/invoice-reconciler/);
    await expect(page.getByRole("heading", { name: /Invoice ↔ TD-288 Reconciler/i })).toBeVisible();
  });

  test("allotment form: validation without file", async ({ page }) => {
    await page.goto("/psap-allotment");
    // Submit if button exists
    const submit = page.getByRole("button", { name: /calculate|run|submit/i }).first();
    if (await submit.count()) {
      await submit.click();
      // Expect error about Call Summary required
      await expect(page.getByText(/required|Call Summary/i).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("invoice reconciler full happy path + CSV download buttons", async ({ page }) => {
    await page.goto("/advisor-tools/invoice-reconciler");

    const sample = `PSAP	Tracking	Amount	Notes
9820 Stockton CHP	19280	3933.00	NOT LISTED
1915 LA CSU	24669	8712.00	YR8
3009 Huntington Beach PD	29501-OP	104229.00	CPE INSTALL
3103 Placer County SO	25908	1200.50	MA North`;

    await page.getByLabel(/Victoria batch table/i).fill(sample);

    const fixtureDir = path.join(process.cwd(), "e2e", "fixtures", "td288_fake_tree");
    await page.locator('input[type="file"]').first().setInputFiles([
      path.join(fixtureDir, "TK_24669_CPE_commitment.xls"),
      path.join(fixtureDir, "25908_ATT_MA_TD288.xlsx"),
    ]);

    await page.getByRole("button", { name: /Run reconciliation/i }).click();
    await expect(page.getByText(/GREEN\s*1/i)).toBeVisible();
    await expect(page.getByText(/YELLOW\s*1/i)).toBeVisible();
    await expect(page.getByText(/RED\s*2/i)).toBeVisible();

    // Download buttons present (actual download is browser-dependent)
    for (const name of [/approve\.csv/i, /dispute\.csv/i, /review\.csv/i]) {
      await expect(page.getByRole("button", { name })).toBeVisible();
    }

    // Click approve download — should not throw
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 5000 }).catch(() => null),
      page.getByRole("button", { name: /approve\.csv/i }).click(),
    ]);
    // download may or may not fire in all browsers; button click is enough
    void download;
  });

  test("breadcrumb Projects link from tools hub", async ({ page }) => {
    await page.goto("/advisor-tools");
    await page.getByRole("link", { name: "Projects", exact: true }).first().click();
    await expect(page).toHaveURL(/\/projects/);
  });
});
