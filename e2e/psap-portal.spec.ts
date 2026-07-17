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

/** Role chooser at /psap-portal when no persona stored */
async function enterAsPsap(page: import("@playwright/test").Page) {
  await page.evaluate(() => localStorage.removeItem("psap-portal-persona-v1"));
  await page.goto("/psap-portal");
  await page.getByTestId("role-psap").click();
  await page.waitForURL(/\/psap-portal\/psap/, { timeout: 10_000 });
  await page.request.post("/api/psap-portal/ops/session", { data: { role: "psap" } });
}

async function enterAsAdvisor(page: import("@playwright/test").Page) {
  await page.evaluate(() => localStorage.removeItem("psap-portal-persona-v1"));
  await page.goto("/psap-portal");
  await page.getByTestId("role-advisor").click();
  await page.waitForURL(/\/psap-portal\/advisor/, { timeout: 10_000 });
  // Ensure server role cookie is set for ops APIs
  await page.waitForTimeout(300);
}

test.describe("PSAP portal", () => {
  test("role chooser and PSAP home", async ({ page }) => {
    await login(page, "/psap-portal");
    await page.evaluate(() => localStorage.removeItem("psap-portal-persona-v1"));
    await page.goto("/psap-portal");
    await expect(page.getByRole("heading", { name: /Who is visiting today/i })).toBeVisible();
    await page.getByTestId("role-psap").click();
    await expect(
      page.getByRole("heading", { name: /Prepare packages Advisors can approve/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test("advisor lookup finds Alameda", async ({ page }) => {
    await login(page, "/psap-portal");
    await enterAsPsap(page);
    await page.goto("/psap-portal/tools/advisor-lookup");
    await page.getByTestId("advisor-search").fill("Alameda");
    await expect(page.getByTestId("advisor-results")).toContainText(/Alameda/i, {
      timeout: 10000,
    });
  });

  test("TD-288 checker shows Blocked then Ready", async ({ page }) => {
    await login(page, "/psap-portal");
    await enterAsPsap(page);
    await page.goto("/psap-portal/tools/td288-checker");
    await expect(page.getByTestId("td288-result")).toContainText(/Blocked/i);
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
    await login(page, "/psap-portal");
    await enterAsPsap(page);
    await page.goto("/psap-portal/tools/submit-question");
    await page.getByPlaceholder("PSAP name").fill("E2E PSAP");
    await page.getByPlaceholder("County").fill("Alameda");
    await page.getByPlaceholder("Contact name").fill("Test User");
    await page.getByPlaceholder("Contact email").fill("test@example.com");
    await page.getByPlaceholder("Your question…").fill("How do we prepare Advance Notification?");
    await page.getByRole("button", { name: /submit ticket/i }).click();
    await expect(page.getByTestId("question-success")).toContainText(/Ticket Q-/i);
  });

  test("admin can publish news", async ({ page }) => {
    await login(page, "/psap-portal");
    await page.evaluate(() => localStorage.setItem("psap-portal-persona-v1", "admin"));
    await page.goto("/psap-portal/admin");
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
    await enterAsPsap(page);
    await expect(page.getByText(/Site Guide here \(Taskade\)/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: /PSAP Support AI/i })).toBeVisible();
  });

  test("start here explains purpose, free beta, and Vault Keywright", async ({ page }) => {
    await login(page, "/psap-portal");
    await enterAsPsap(page);
    await page.goto("/psap-portal/start");
    await expect(page.getByRole("heading", { name: /Welcome to the PSAP Funding/i })).toBeVisible();
    await expect(page.getByText(/Why this is free right now/i)).toBeVisible();
    await expect(page.getByText(/beta stage/i)).toBeVisible();
    await expect(page.getByText(/invited by someone close to the developer/i)).toBeVisible();
    await expect(page.getByRole("heading", { name: /Vault Keywright/i })).toBeVisible();
  });

  test("advisor desk shows process map and pain points", async ({ page }) => {
    await login(page, "/psap-portal");
    await enterAsAdvisor(page);
    await expect(
      page.getByRole("heading", { name: /Compliance path dashboard|Funding & Compliance desk/i })
    ).toBeVisible();
    await page.goto("/psap-portal/advisor");
    await expect(page.getByRole("heading", { name: /Funding & Compliance desk/i })).toBeVisible();
    await page.goto("/psap-portal/advisor/process-map");
    await expect(page.getByText(/Process 1/i).first()).toBeVisible();
    await page.goto("/psap-portal/advisor/pain-points");
    await expect(page.getByText(/SOW template compliance/i).first()).toBeVisible();
  });

  test("ops path: complete process, advisor override, PSAP sees activity", async ({ page }) => {
    await login(page, "/psap-portal");
    await enterAsPsap(page);

    await expect(page.getByTestId("psap-path-list")).toBeVisible({ timeout: 15_000 });

    const pathsRes = await page.request.get("/api/psap-portal/ops/paths");
    expect(pathsRes.ok()).toBeTruthy();
    const { paths } = await pathsRes.json();
    expect(paths.length).toBeGreaterThan(0);
    const pathId = paths[0].id as string;

    const detail0 = await page.request.get(`/api/psap-portal/ops/paths/${pathId}`);
    expect(detail0.ok()).toBeTruthy();
    const d0 = await detail0.json();
    const adv = d0.processes.find((p: { templateCode: string }) => p.templateCode === "adv_notice");
    expect(adv).toBeTruthy();

    const completeRes = await page.request.post(
      `/api/psap-portal/ops/processes/${adv.id}/complete`
    );
    expect(completeRes.ok()).toBeTruthy();

    await page.request.post("/api/psap-portal/ops/session", { data: { role: "advisor" } });
    await page.evaluate(() => localStorage.setItem("psap-portal-persona-v1", "advisor"));
    await page.goto("/psap-portal/advisor/dashboard");
    await expect(page.getByTestId("advisor-ops-dashboard")).toBeVisible();
    await expect(page.getByTestId("ops-metrics")).toBeVisible();
    await page.getByTestId("bucket-planning").click();
    await expect(page.getByTestId("bucket-drilldown")).toBeVisible();

    const ov = await page.request.post(`/api/psap-portal/ops/paths/${pathId}/override`, {
      data: {
        toBucketCode: "package",
        reason: "E2E test override to package stage for Branch review",
      },
    });
    expect(ov.ok()).toBeTruthy();

    await page.request.post("/api/psap-portal/ops/session", { data: { role: "psap" } });
    const detail1 = await page.request.get(`/api/psap-portal/ops/paths/${pathId}`);
    expect(detail1.ok()).toBeTruthy();
    const d1 = await detail1.json();
    expect(d1.effectiveBucket).toBe("package");
    expect(d1.activity.some((a: { kind: string }) => a.kind === "override.set")).toBe(true);
    expect(
      d1.processes.find((p: { templateCode: string }) => p.templateCode === "adv_notice").status
    ).toBe("completed");
  });

  test("pathfinder and access request flow", async ({ page }) => {
    await login(page, "/psap-portal");
    await enterAsPsap(page);

    await page.goto("/psap-portal/pathfinder");
    await expect(page.getByTestId("pathfinder-page")).toBeVisible();
    await expect(page.getByTestId("pathfinder-summary")).toBeVisible({ timeout: 15_000 });

    await page.goto("/psap-portal/access");
    await page.locator('input[name="email"]').fill("e2e.access@example.com");
    await page.locator('input[name="displayName"]').fill("E2E Access User");
    await page.locator('input[name="psapName"]').fill("Roseville PD");
    await page.getByTestId("access-submit").click();
    await expect(page.getByTestId("access-msg")).toContainText(/submitted/i);

    await page.request.post("/api/psap-portal/ops/session", { data: { role: "admin" } });
    await page.evaluate(() => localStorage.setItem("psap-portal-persona-v1", "admin"));
    await page.goto("/psap-portal/admin");
    await expect(page.getByTestId("admin-access-panel")).toBeVisible();
    await page.getByRole("button", { name: /Approve \+ magic link/i }).first().click();
    await expect(page.getByTestId("magic-link")).toBeVisible({ timeout: 10_000 });
  });
});


