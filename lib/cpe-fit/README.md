# CPE Fit engine (site copy)

Vault Advisor TypeScript port of `app/calc.py`. Server-side only.

- `catalog.json` — Exhibit C snapshot. **Never** put this under `public/` or serve it as a download.
- `estimate.ts` — `load_catalog` / `loadCatalog`, `estimate`, `compare_all` / `compareAll`, `suggest_positions` / `suggestPositions`. Starts with `import "server-only"` and a JSON import of the catalog so Next cannot bundle prices to the client.
- Pages under `app/advisor-tools/cpe-fit/` send only computed `Result` objects to the browser.
- Gate: existing `advisor_tools_auth` / `ADVISOR_TOOLS_PASSWORD`. No second password.

Tests: `npx vitest run lib/cpe-fit/estimate.test.ts`

Goldens: SOS 5-pos no add-ons = `$532,576.95`; `compare_all` returns 12 vendors. CST Cloud 5-pos base `$507,902.00` vs workbook `$507,901.80` is intentional (catalog MRC 5455.3833).
