import { expect, test } from "@playwright/test";
import path from "path";

const SAMPLE = `PSAP	Tracking	Amount	Notes
9820 Stockton CHP	19280	3933.00	NOT LISTED
1915 LA CSU	24669	8712.00	YR8
3009 Huntington Beach PD	29501-OP	104229.00	CPE INSTALL
3103 Placer County SO	25908	1200.50	MA North`;

test.describe("Advisor Tools Hub", () => {
  test("hub lists live and beta tools", async ({ page }) => {
    await page.goto("/advisor-tools");
    await expect(page.getByRole("heading", { name: "Advisor Tools Hub" })).toBeVisible();
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
});

test.describe("Invoice TD-288 Reconciler web app", () => {
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
