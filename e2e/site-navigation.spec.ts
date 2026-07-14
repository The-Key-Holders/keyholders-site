import { expect, test, type Page } from "@playwright/test";

/**
 * Full public-site navigation & interaction smoke suite.
 * Does not log into Advisor Tools (see advisor-tools.spec.ts).
 */

async function expectNoBrokenImages(page: Page) {
  const broken = await page.evaluate(() => {
    return Array.from(document.images)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src);
  });
  expect(broken, `Broken images: ${broken.join(", ")}`).toEqual([]);
}

test.describe("Public pages load", () => {
  for (const path of ["/", "/projects", "/trade", "/support"] as const) {
    test(`${path} returns 200 and has main landmark content`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.ok() || res?.status() === 304).toBeTruthy();
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expectNoBrokenImages(page);
    });
  }
});

test.describe("Desktop header navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("logo home link works from projects", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("banner").getByRole("link", { name: /The Key Holders/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("nav: Home → Projects → Trade → Support (public) → Tools (gated) → back", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("navigation").getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();

    await page.getByRole("navigation").getByRole("link", { name: "Trade", exact: true }).click();
    await expect(page).toHaveURL(/\/trade/);
    await expect(page.getByText(/ServiceTitan|contractor|Engage|Diagnostic/i).first()).toBeVisible();

    // Support is public — no password
    await page.getByRole("navigation").getByRole("link", { name: "Support", exact: true }).click();
    await expect(page).toHaveURL(/\/support/);
    await expect(page.getByRole("heading", { name: /Key Holders Support/i })).toBeVisible();
    await expect(page.getByText(/powered by Grok/i).first()).toBeVisible();

    // Tools is gated — should land on login
    await page.getByRole("navigation").getByRole("link", { name: "Tools", exact: true }).click();
    await expect(page).toHaveURL(/\/advisor-tools\/login/);
    await expect(page.getByRole("heading", { name: /Advisor Tools Login/i })).toBeVisible();

    // Brand logo on login returns home
    await page.getByRole("banner").getByRole("link", { name: /The Key Holders/i }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("public support chat UI is available without login", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByLabel(/Message/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Send/i })).toBeVisible();
  });

  test("nav Connect scrolls to connect section on home", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation").getByRole("link", { name: "Connect", exact: true }).click();
    await expect(page).toHaveURL(/#connect/);
    await expect(page.locator("#connect")).toBeVisible();
  });

  test("Get Tech Help opens Geeks Next Door (external)", async ({ page, context }) => {
    await page.goto("/");
    const [popup] = await Promise.all([
      context.waitForEvent("page"),
      page.getByRole("link", { name: /Get Tech Help/i }).first().click(),
    ]);
    await popup.waitForLoadState("domcontentloaded");
    expect(popup.url()).toMatch(/thegeeksnextdoor\.com/i);
    await popup.close();
  });
});

test.describe("Mobile header menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("hamburger opens and navigates to Projects", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu/i }).click();
    await expect(page.getByRole("button", { name: /Close menu/i })).toBeVisible();

    // Mobile drawer links (not desktop nav)
    await page.locator("header").getByRole("link", { name: "Projects", exact: true }).click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test("mobile menu can reach Trade", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open menu/i }).click();
    await page.locator("header").getByRole("link", { name: "Trade", exact: true }).click();
    await expect(page).toHaveURL(/\/trade/);
  });
});

test.describe("Homepage content & CTAs", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("hero CTAs navigate correctly", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Unlock your/i })).toBeVisible();

    await page.getByRole("link", { name: /Explore projects/i }).click();
    await expect(page).toHaveURL(/\/projects/);

    await page.goto("/");
    await page.getByRole("link", { name: "Trade services", exact: true }).click();
    await expect(page).toHaveURL(/\/trade/);

    await page.goto("/");
    await page.getByRole("link", { name: /Advisor tools/i }).first().click();
    await expect(page).toHaveURL(/\/advisor-tools\/login/);
  });

  test("portfolio strip and projects grid are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/The portfolio/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /One portfolio, many keys/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Advisor Tools Hub/i }).first()).toBeVisible();
    await expect(page.locator("#projects").getByRole("heading", { name: /Key Holders Trade/i })).toBeVisible();

    await page.getByRole("link", { name: /Full project directory/i }).click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test("footer links work", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await footer.getByRole("link", { name: /All projects/i }).click();
    await expect(page).toHaveURL(/\/projects/);

    await page.goto("/");
    await footer.getByRole("link", { name: /Key Holders Trade/i }).click();
    await expect(page).toHaveURL(/\/trade/);
  });
});

test.describe("Projects page filters", () => {
  test("kind filter chips update listing", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { name: "Projects" })).toBeVisible();

    await page.locator("main").getByRole("link", { name: "Tools", exact: true }).click();
    await expect(page).toHaveURL(/kind=tool/);
    await expect(page.getByRole("heading", { name: /Invoice ↔ TD-288 Reconciler/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /PSAP Allotment Engine/i })).toBeVisible();

    await page.locator("main").getByRole("link", { name: "Ventures", exact: true }).click();
    await expect(page).toHaveURL(/kind=venture/);
    await expect(page.getByRole("heading", { name: /Key Holders Trade/i })).toBeVisible();

    await page.locator("main").getByRole("link", { name: "All", exact: true }).click();
    await expect(page).toHaveURL(/\/projects/);
  });

  test("clicking a gated tool card goes to login", async ({ page }) => {
    await page.goto("/projects?kind=tool");
    await page.getByRole("link", { name: /Advisor Tools Hub/i }).click();
    await expect(page).toHaveURL(/\/advisor-tools\/login/);
  });
});

test.describe("Trade page", () => {
  test("loads services and portfolio strip", async ({ page }) => {
    await page.goto("/trade");
    await expect(page.getByText(/Part of/i)).toBeVisible();
    await page.getByRole("link", { name: /The Key Holders/i }).first().click();
    // may be footer or strip — either stays on brand
  });

  test("trade header logo goes to /trade", async ({ page }) => {
    await page.goto("/trade");
    await page.getByRole("banner").getByRole("link", { name: /Key Holders Trade/i }).click();
    await expect(page).toHaveURL(/\/trade/);
  });

  test("in-page service anchors if present", async ({ page }) => {
    await page.goto("/trade");
    const services = page.locator("#services, [id*='service']").first();
    // Soft: page should at least show a price or engagement section
    await expect(page.getByText(/\$|Diagnostic|Health Check|Engage/i).first()).toBeVisible();
    if (await services.count()) {
      await expect(services).toBeVisible();
    }
  });
});

test.describe("Brand / logo", () => {
  test("header exposes Key Holders brand link on home", async ({ page }) => {
    await page.goto("/");
    const brand = page.getByRole("banner").getByRole("link", { name: /The Key Holders/i });
    await expect(brand).toBeVisible();
    // SVG mark present (no white-board JPG requirement)
    await expect(page.locator("header svg").first()).toBeVisible();
  });
});
