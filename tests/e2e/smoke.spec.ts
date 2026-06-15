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