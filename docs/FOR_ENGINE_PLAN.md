# FOR Engine — Implementation Plan

**Status:** Plan approved for build (research complete from `D:\Advisor_Docs\FISCAL&OPERATIONAL REVIEW (FOR)` + section templates + 2024 Automated FOR Workbook).  
**Target:** Password-gated tool on https://www.thekeyholders.org under Advisor Tools (hub card already reserved: “FOR Assembly Engine”) + optional desktop twin.  
**Date:** 2026-07-14  

---

## 1. What a FOR is (from source materials)

A **Fiscal and Operational Review (FOR)** is a CA 9-1-1 Emergency Communications Branch Advisor process that:

1. Prepares a multi-section binder/report for a single PSAP  
2. Uses statutory authority framing (Gov. Code §§ 53100–53120, 53114.2, 53115e, 53112(d) text-to-911)  
3. Reviews **funding**, **network**, **CPE/maintenance**, **operational performance (ECaTS)**, **NG9-1-1 / cloud CPE**, and **references**  
4. Culminates in a **meeting** with PSAP management, then **post-FOR** follow-up email materials  
5. Archives year-labeled copies under PSAP “FOR Archive” folders  

### Canonical binder structure (2024 prep + blank sections)

| Order | Section | Primary inputs | Automation opportunity |
|-------|---------|----------------|------------------------|
| 0 | Cover page | PSAP name, date, advisor, address | Form fields → DOCX/HTML |
| S | FOR Summary | Aggregates I–VI; **written last** | Template fill from section drafts |
| I | Fiscal Review | Excel workbook tabs: Summary, CPE, ATA, Network (pending), Reimbursement, Foreign Language; ECaTS/MIS cost constants | Spreadsheet ingest + summary calc |
| II | Network Review | Telco customer records / BTNs / trunks; ETS research | Upload parse + discrepancy flags |
| III | CPE & Maintenance | Last CPE upgrade, TD-288, residual, maintenance years | TD-288 / history file index hooks |
| IV | Operational Performance | ECaTS ASA (90% ≤ 15s), 24/7, MSAG, text-to-911, TTY, MIS | ECaTS export parse (same family as allotment) |
| V | NG9-1-1 & Cloud CPE | PNSP/RNSP narrative, vendor list | Standard boilerplate + checkboxes |
| VI | References | Standard links + PSAP-specific contacts | Static pack + inject coordinator |

### Source corpus reviewed

**Primary directory:** `D:\Advisor_Docs\FISCAL&OPERATIONAL REVIEW (FOR)\`

| Area | Contents used |
|------|----------------|
| `INSTRUCTIONS/` | 2007 checklist, 2009 prep instructions, **2024 FOR Prep** (authoritative process narrative) |
| `REPORT DATA/1. Report_Blank/` | Separated section templates (Cover → VI) |
| `REPORT DATA/2. Report_Supporting Inserts/` | Regional PSAP info packs, NG deck, Section VI references |
| `REPORT DATA/2024_Automated FOR Workbook.docx` | Field schema (~24 fill-ins) already used by Branch automation attempt |
| `REPORT DATA/3. PSAP Activity Lists/` | Supporting activity lists |
| `REPORT DATA/4. Post FOR_Email Attachments/` | Post-meeting email/package pieces |
| `FOR MEETING LOGS/` | Findings log workbook pattern |
| `PSAP HISTORY FILES/` | Per-PSAP archive tree (thousands of files) — **index, don’t bulk-upload** |

**Related (expand understanding):**

- Chapter III Funding / CPE procurement under `D:\Advisor_Docs\RESOURCES\`  
- ECaTS Call Summary patterns (allotment engine already parses related exports)  
- TD-288 filename/index patterns (invoice reconciler)  
- Public statutes: GC 53100 et seq. (SETNA oversight framing already in Summary template)  

**Sanitized extracts for engineering** (no confidential PSAP figures committed as “live” data):  
`keyholders-site/docs/for-research/*.md`

---

## 2. Current manual workflow (pain points to automate)

1. Copy blank section templates into PSAP year folder  
2. Pull CPE history, TD-288, ATA, reimbursements, Language Line, network BTNs  
3. Fill multi-tab fiscal Excel; pick PSAP on Summary; hand-tune five-year estimate  
4. Pull ECaTS ASA / call volumes; write Section IV conditional language if ASA < 90%  
5. Assemble network list; verify BTN ownership with Fiscal if wrong  
6. Draft Summary **after** sections 1–6  
7. Print/binder + meeting  
8. Log findings; send post-FOR package  
9. Archive  

**Highest automation ROI:** field capture → section draft generation → package export → prep checklist gate.  
**Lowest / deferred:** full ETS raw dumps, live Language Line, full PSAP History recursive OCR.

---

## 3. Product goals

### In scope (MVP → v1)

1. **Web app** under password gate: `/advisor-tools/for-engine`  
2. **Wizard** aligned to 2024 workbook + prep checklist  
3. **Section draft generator** (Markdown + print-ready HTML; DOCX export preferred)  
4. **Fiscal workbook ingest** (upload filled/partial xlsx if available; else manual entry)  
5. **ECaTS optional upload** for ASA / monthly volume (reuse allotment parsing patterns where possible)  
6. **Evidence checklist** (required vs optional artifacts before “package ready”)  
7. **Package export** ZIP: cover, summary, sections I–VI, checklist, findings stub  
8. **Desktop twin** (optional v1.1): same core TS library in Electron / Node CLI  
9. **Grok advisor help** trained on FOR process coaching + “how to use FOR Engine” (generation assist via chat, not unsupervised fiscal invention)

### Out of scope (explicit)

- Submitting official Branch correspondence  
- Replacing ETS / Language Line / ECaTS systems of record  
- Auto-approving funding or performance waivers  
- Uploading entire `PSAP HISTORY FILES` tree to the public web host  

---

## 4. Architecture

```
┌──────────────────────────── Web (keyholders-site) ────────────────────────────┐
│  /advisor-tools/for-engine  (middleware password cookie)                      │
│  components/ForEngineApp.tsx  wizard UI                                       │
│  app/api/advisor-tools/for/*  (protected) optional server-side DOCX if needed │
└───────────────────────────────────┬───────────────────────────────────────────┘
                                    │ uses pure TS core
┌───────────────────────────────────▼───────────────────────────────────────────┐
│  packages or lib/for-engine/                                                  │
│  - schema.ts (FOR package model from workbook fields)                         │
│  - checklist.ts (prep gates)                                                  │
│  - fiscal.ts (summary calc helpers)                                           │
│  - sections/*.ts (template renderers Cover…VI + Summary)                      │
│  - package.ts (ZIP of HTML/MD/DOCX)                                           │
│  - parseEcats.ts (optional ASA extract)                                       │
└───────────────────────────────────┬───────────────────────────────────────────┘
                                    │ shared by
┌───────────────────────────────────▼───────────────────────────────────────────┐
│  Desktop: caloes-process-automations/for-engine (CLI or Electron panel)       │
│  Local paths: D:\Advisor_Docs\… PSAP folders, optional write to FOR Archive   │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Data model (from 2024 Automated FOR Workbook)

```ts
type ForPackage = {
  meta: { version: string; generatedAt: string; engine: "web" | "desktop" };
  cover: {
    psapName: string; forDate: string; managerName?: string;
    address?: string; phone?: string; advisorName: string; advisorPhone?: string;
  };
  fiscal: {
    cpeOnlyCost?: number; ongoingOpsCost?: number; fiveYearEstimate?: number;
    ataLevel?: string; ataBalance?: number; reimbursementsPastFy?: number;
    foreignLanguageCost?: number; misCostNote?: string;
  };
  network: {
    totalLines?: number; trunks911?: number; alternateAnswer?: number;
    alternateAnswerPsap?: string; notes?: string;
  };
  cpe: {
    vendor?: string; systemType?: string; stateFundedPositions?: number;
    mpaContract?: string; td288Tracking?: string; td288ApprovalDate?: string;
    systemAcceptance?: string; maint5yrExpiration?: string; issues?: string;
  };
  ops: {
    pctAnswered15s?: number; monthsSampled?: number; avgCallsPerMonth?: number;
    is24x7?: "yes" | "no_grandfathered" | "no_plan" | "no_funding_risk" | "unknown";
    countyCoordinator?: { name?: string; phone?: string; email?: string };
    textTo911?: "ott" | "integrated" | "unknown";
    ttyNotes?: string;
  };
  ng: { narrativeOverrides?: string; checklist: Record<string, boolean> };
  references: { extraLinks?: string[] };
  findings: { preMeeting: string[]; postMeeting: string[] };
  evidence: { id: string; label: string; required: boolean; present: boolean }[];
};
```

---

## 5. Phased delivery

### Phase 0 — Foundations (0.5–1 day) ✅ research done

- [x] Extract prep + section templates to `docs/for-research/`  
- [x] Confirm hub placeholder on Advisor Tools  
- [ ] Add protected route shell + “planned → beta” card  

### Phase 1 — MVP Web FOR Assembly (3–6 days) **next build**

1. `lib/for-engine/*` pure TS with Vitest  
2. Wizard steps: Cover → Fiscal → Network → CPE → Ops → NG → References → Summary → Package  
3. Render **HTML package** + download ZIP (MD/HTML)  
4. Prep checklist gate (must complete required evidence toggles)  
5. Conditional Section IV language if ASA < 90%  
6. Playwright: unauth redirect; authenticated package download with fixture JSON  
7. Ship live under password gate; flip hub card to **beta/live**  

**MVP success criteria:** Advisor can produce a complete draft FOR package for a test PSAP in <20 minutes without Word, with all section placeholders filled from form data.

### Phase 2 — Data ingest (4–8 days)

- Parse fiscal xlsx (Summary + key tabs) when uploaded  
- Optional ECaTS export → ASA / monthly volume  
- Optional TD-288 filename / index hook (reuse invoice-recon matcher)  
- Desktop CLI: `for-engine assemble --psap ... --out ...` writing under local FOR Archive path  

### Phase 3 — DOCX fidelity (1–2 weeks)

- Template-based DOCX generation (docxtemplater or similar) from Branch section templates (sanitized copies in repo, not full history files)  
- Merge regional insert PDFs as attachments list only  
- Findings log export (CSV/XLSX) compatible with `FOR_PSAP FINDINGS LOG` pattern  

### Phase 4 — Agent coaching (2–4 days, can start after MVP)

- Extend `lib/advisor-help-agent.ts` with FOR section playbooks + FOR Engine UI how-to  
- Optional: “Draft Section IV language” via Grok **only** from structured fields the user already entered (no invented ASA)  
- Slash-style starters: “Prep checklist”, “What goes in Fiscal Summary”, “Run FOR Engine”  

---

## 6. Web UX (gated)

**Route:** `/advisor-tools/for-engine`  
**API (if needed):** `/api/advisor-tools/for/*` under existing middleware protection  

**UI pattern:** Match Invoice Reconciler / Allotment vault theme  

1. Left: step nav + validation  
2. Right: live preview of current section  
3. Bottom: Export package / Download summary PDF-print  

**Safety banner:** Decision support only; does not replace Branch policy judgment or official systems of record. Do not upload data you are not authorized to process in-browser.

---

## 7. Security & compliance

| Control | Implementation |
|---------|----------------|
| Auth | Existing Advisor Tools cookie middleware |
| Data residency | Client-side generation preferred for MVP (no server store of PSAP packages) |
| Logging | No server logging of fiscal fields |
| Secrets | None new beyond existing gate password |
| Agent boundary | Public Taskade must not coach FOR; Grok gated agent may |

---

## 8. Testing strategy

| Layer | Tests |
|-------|-------|
| Unit | Template renderers, ASA conditional text, five-year estimate math |
| Fixture | Synthetic PSAP JSON → golden MD snapshots |
| E2E | Login → open FOR Engine → fill minimal → download ZIP |
| Manual | One dry-run against a non-sensitive sandbox PSAP name |

---

## 9. Tooling to leverage

| Resource | Use |
|----------|-----|
| Existing allotment ECaTS parsers | Ops Section IV metrics |
| Invoice TD-288 index | CPE Section III tracking discovery |
| `docs/for-research` extracts | Template language + checklist |
| Vitest + Playwright | TDD + gate tests |
| Grok (`XAI_API_KEY`) | Gated help agent coaching |
| Desktop automations repo | Local twin + path write to `D:\Advisor_Docs\...` |
| markitdown / Word COM | One-time template extraction (done) |

---

## 10. Recommended build order (execute next)

1. Scaffold `lib/for-engine` + Vitest golden tests from synthetic package  
2. Build `ForEngineApp` wizard + ZIP export  
3. Wire hub card live + Playwright  
4. Enrich Grok prompt with FOR engine runbook  
5. Phase 2 ingest only after MVP is used on 1–2 real dry runs  

---

## 11. Open decisions (confirm during build)

1. **DOCX vs HTML-first:** MVP = HTML/MD ZIP; DOCX in Phase 3 for binder parity  
2. **Server-side package storage:** default **none** (ephemeral client)  
3. **Fiscal Excel template:** ship a blank sanitized xlsx derived from “Blank Fiscal Worksheet” structure without live PSAP rows  
4. **Five-year estimate formula:** document Branch heuristic; allow manual override (prep doc already requires judgment)  

---

## 12. Effort estimate

| Phase | Effort |
|-------|--------|
| MVP Web FOR Engine | 3–6 days |
| Ingest + desktop CLI | 4–8 days |
| DOCX fidelity | 1–2 weeks |
| Agent FOR coaching depth | 2–4 days |

---

*This plan is the deliverable for the research + /plan step. Implementation of Phase 1 can proceed immediately on approval or continuous build request.*
