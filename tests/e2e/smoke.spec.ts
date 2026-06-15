import { test, expect } from "@playwright/test";

test("home page loads with vault hero and menu", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/The Key Holders/i);
  await expect(page.getByRole("heading", { name: /unlock your/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /open menu/i })).toBeVisible();
});

test("home page has founders section", async ({ page }) => {
  await page.goto("/#founders");
  await expect(page.getByRole("heading", { name: /two founders/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Javad Khoshnevisan/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^Grok$/i })).toBeVisible();
});

test("trade page loads with checkout", async ({ page }) => {
  await page.goto("/trade");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: /buy now/i }).first()).toBeVisible();
});

test("trade page shows success feedback banner for ?checkout=success and dismiss cleans URL", async ({ page }) => {
  await page.goto("/trade?checkout=success");
  const banner = page.getByTestId("checkout-feedback");
  await expect(banner).toBeVisible();
  await expect(page.getByText("Checkout successful")).toBeVisible();
  await expect(page.getByText(/Health Check guarantee: 3\+ actionable improvements or full refund/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /dismiss/i }).first()).toBeVisible();

  // Dismiss cleans the param (router.replace) and hides banner
  await page.getByRole("button", { name: /dismiss/i }).first().click();
  await expect(banner).not.toBeVisible();
  await expect(page).toHaveURL(/\/trade$/); // no query param
});

test("trade page shows cancelled feedback banner for ?checkout=cancelled", async ({ page }) => {
  await page.goto("/trade?checkout=cancelled");
  const banner = page.getByTestId("checkout-feedback");
  await expect(banner).toBeVisible();
  await expect(page.getByText("Checkout cancelled")).toBeVisible();
  await expect(page.getByText(/No charges were made/i)).toBeVisible();
  // No guarantee line for cancelled
  await expect(page.getByRole("button", { name: /dismiss/i }).first()).toBeVisible();

  await page.getByRole("button", { name: /dismiss/i }).first().click();
  await expect(banner).not.toBeVisible();
  await expect(page).toHaveURL(/\/trade$/);
});

// P2-Content-Agent: new pages per approved plan + handoff §14 P2, §16 Garner verbatim, §17 strings
test("labs page loads with editorial depth, Legacy Vault, live FieldHub, Reliability Suite, simulator preview, and back link", async ({ page }) => {
  await page.goto("/labs");
  await expect(page.getByRole("heading", { name: /experiments in production/i })).toBeVisible();
  await expect(page.getByText(/Legacy Vault/i).first()).toBeVisible();
  await expect(page.getByText(/FieldHub/i).first()).toBeVisible();
  await expect(page.getByText(/2026 work-order brokering platform/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /back to the key holders/i })).toBeVisible();
  // GitHub links present
  await expect(page.getByRole("link", { name: /legacy vault repo/i })).toBeVisible();

  // Reliability Suite salvaged + interactive creative preview (candidate-1 enhancements)
  await expect(page.getByRole("heading", { name: /Reliability Suite/i })).toBeVisible();
  await expect(page.getByText(/76 reliability and infrastructure projects/i)).toBeVisible();
  await expect(page.getByText(/Timelock Policy Simulator/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /apply timelock policy/i })).toBeVisible();
});

test("work page loads with mission logs, Garner Roofing verbatim §16 data, CurrentRMS, back links", async ({ page }) => {
  await page.goto("/work");
  await expect(page.getByRole("heading", { name: /mission logs/i })).toBeVisible();
  // Verbatim narrative + metrics from MODEL_HANDOFF §16 (use .first() + specific to avoid strict multi-match with "8 weeks" in bullets)
  await expect(page.getByText(/ServiceTitan instance at-risk \(TitanAdvisor\)/i)).toBeVisible();
  await expect(page.getByText(/At-risk → healthy status/i)).toBeVisible();
  await expect(page.getByText(/Active users onboarded/i)).toBeVisible();
  await expect(page.getByText(/Mobile adoption \(field team\)/i)).toBeVisible();
  await expect(page.getByText(/Health Check for workflow\/integration gaps/i)).toBeVisible();
  await expect(page.getByText(/Single-client results; outcomes vary/i)).toBeVisible();
  // CurrentRMS + back links
  await expect(page.getByText(/CurrentRMS ↔ Google Sheets Sync/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /back to the key holders/i })).toBeVisible();
});