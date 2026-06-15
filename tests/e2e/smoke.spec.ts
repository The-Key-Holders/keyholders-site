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