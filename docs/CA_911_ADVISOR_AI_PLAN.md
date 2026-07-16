# Plan: CA 9-1-1 Advisor AI Chatbot (Grok / xAI) on thekeyholders.org

**Date:** 2026-07-16  
**Mode:** Design + implementation + local test + deploy + full testing  
**Constraint (user):** Expand / add only — **do not simplify** the baseline research + system prompt below.  
**Pinned work:** CPE Fixed Allotment Calculator **web v2** (`feat/cpe-fixed-allotment-web`) is **on hold** — does not fully represent desktop GoldRush/PortablePost; leave branch as-is; do not push/merge for production until a later session revisits parity.

---

## 0. Pin status (CPE allotment web)

| Item | Status |
|------|--------|
| Desktop GoldRush → PortablePost | Complete offline (D: + kit backups) |
| Web port on `feat/cpe-fixed-allotment-web` | Local green but **not** the full desktop product UX/parity — **pinned** |
| Production `/psap-allotment` (v1) | Untouched; remains live |
| This plan | **New** Advisor AI chatbot — separate product |

---

## 1. Baseline requirements (user-provided — preserve fully)

The following is **canonical input** and must remain intact in the agent design. Implementation may **add** structure, RAG, UI, tests, and integrations — never strip mission depth, Manual chapter coverage, guardrails, or interaction rules.

### 1.1 Role research (must be reflected in agent knowledge + prompt)

- **Mission:** SETNA / Warren-911 / Surcharge Act; ~440+ PSAPs; fastest, most reliable, cost-effective 9-1-1 access.  
- **Persona:** CA 9-1-1 Advisor (Advisory and Compliance Unit) — resource, advocate, policy interpreter, funding gatekeeper, compliance monitor.  
- **Duty domains (all retained at full depth):**  
  1. Funding administration & SETNA oversight (40–60%: allotments, Advanced Notification, MPA/SOW, TD-288, Direct vs Reimbursement, residual, ATA, network, GIS, new PSAP, backup centers, fiscal cutoffs).  
  2. Advisory / customer support (liaison, training, multi-stakeholder coordination).  
  3. Compliance, standards, FOR (~every 5 years; ~3 FORs/month), NG9-1-1.  
  4. Operational/technical advisory (wireless routing via CHP/Branch, Text, Alert & Warning, County Coordinator/MSAG).  
  5. Admin, Advisory Board support, travel, emergency readiness, collaboration with Reconciliation/GIS/Network/Finance.  
- **2026 priorities:** CPE refresh surge, NG9-1-1 bridge, residual use, consolidation, transparency/audits.  
- **Not:** dispatcher/call-taker; policy/funding specialist.

### 1.2 System prompt (user-provided — production core)

The full **CA 9-1-1 Advisor AI** system prompt in the user message (identity, Manual mastery list, six duty blocks, tone/structure rules, Manual citations, calculation honesty, safety/ethics, escalation contacts, example interaction style, greeting behavior) is the **minimum system prompt body**.

**Rule:** Store it as a versioned, multi-section knowledge pack. Future edits may only:

- **Append** tool-routing sections (hub URLs, how to open desktop twins).  
- **Append** RAG retrieval instructions.  
- **Append** citation format for attached Manual excerpts.  
- **Never delete** Manual chapter mandates, guardrails, escalation, or response structure.

### 1.3 Explicit expansions required (above baseline — not replacements)

| Expansion | Purpose |
|-----------|---------|
| **A. Separate product surface** | New password-gated tool distinct from “New Hire + Automation Help Agent” so both missions stay full-strength |
| **B. Multi-file system prompt pack** | Baseline prompt + Manual chapter digests + forms catalog + 2026 context + site tool map + evaluation rubrics |
| **C. Manual excerpts + RAG (required expansion, not optional nice-to-have)** | Inject curated Manual digests **and** retrieve chunks from kit PDFs/markdown (Ch. III, I, VI, VIII, XI, etc.) on every turn where relevant — **in addition to** the full baseline prompt |
| **D. Richer chat UX** | Streaming if feasible, starters aligned to funding/FOR/NG9-1-1, role picker (PSAP Manager / County Coord / finance), copy/export transcript |
| **E. Evaluation harness** | Golden Q&A + policy non-invention tests + citation presence checks |
| **F. Ops** | Same password gate + `XAI_API_KEY`; longer context; rate limits; logging without PII |
| **G. Hub + portfolio** | Additive card; do not remove existing help-agent |

---

## 2. Existing site patterns (ground truth)

**Repo:** `C:\Users\javad\projects\keyholders-site` → GitHub `CupofJavad/keyholders-site` → **thekeyholders.org**

| Existing agent | Path | Backend | Prompt file |
|----------------|------|---------|-------------|
| New Hire + Automation Help | `/advisor-tools/help-agent` | `POST /api/advisor-tools/agent-chat` → `api.x.ai/v1/chat/completions` | `lib/advisor-help-agent.ts` (onboarding + **tool how-tos**) |
| Public Site Guide | `/support` | Separate public agent | `lib/public-site-agent.ts` |

**Auth:** `middleware.ts` + `ADVISOR_TOOLS_PASSWORD` cookie (`advisor_tools_auth`). Any route under `/advisor-tools/*` and APIs under `/api/advisor-tools/*` (except login + auth) are gated.

**Local env already has:** `ADVISOR_TOOLS_PASSWORD`, `XAI_API_KEY`, optional Taskade keys.

**Decision:** Build **new** Advisor AI as a peer product, not a rewrite that shrinks the existing help-agent into one blurry bot.

---

## 3. Product definition (expanded)

### 3.1 Name & placement

| Field | Value |
|-------|--------|
| **Product name** | **CA 9-1-1 Advisor AI** (subtitle: PSAP Funding + Compliance Assistant) |
| **Route** | `/advisor-tools/advisor-ai` |
| **API** | `POST/GET /api/advisor-tools/advisor-ai/chat` |
| **Prompt module** | `lib/advisor-ai/` (multi-file pack; primary export `ADVISOR_AI_SYSTEM_PROMPT`) |
| **UI** | `components/AdvisorAiChat.tsx` |
| **Hub card** | Live/beta on `/advisor-tools` — **alongside** Help Agent, FOR, Invoice, PSAP Allotment, (pinned) CPE v2 if present on branch |

### 3.2 Relationship to existing Help Agent (additive)

| Agent | Audience focus | Keep? |
|-------|----------------|-------|
| **New Hire + Automation Help** | Day-1–90 onboarding + how to run site tools | **Yes — unchanged mission** |
| **CA 9-1-1 Advisor AI (new)** | Full Advisor persona: funding, Manual chapters, FOR prep coaching, NG9-1-1, forms, process walkthroughs, sample calcs | **New** |
| Cross-link | Each bot’s prompt **appends** a short section pointing users to the other when appropriate | Expand both prompts with cross-links only |

### 3.3 Capabilities (baseline + expansions)

**From baseline (required):**  
All Manual chapters listed; funding processes; forms; MPA; ECaTS/MIS; FOR; NG9-1-1 GIS; wireless; Text; Alert & Warning; ATA; County Coordinator; new PSAP; residual; Direct vs Reimbursement; sample allotment formulas with “official needs ECaTS + human Advisor”; structured response pattern; citations; escalation emails/phone; greeting.

**Added (do not replace baseline):**

1. **Role-aware opening** — optional UI chips: PSAP Manager | County Coordinator | Finance/admin | Vendor partner | New Advisor (onboarding → may deep-link to help-agent).  
2. **Topic routers** (explicit in prompt appendices): Funding / FOR / NG9-1-1 / Standards / Forms / Travel-ATA / GIS / Tools-on-this-site.  
3. **Sample allotment walkthroughs** — show Cloud vs On-Premise formulas; never issue real allotment letters.  
4. **Forms & deadline checklist generator** — TD-/TDe-/PSC series maps, July 31 claims, residual 90-day/12-month rules.  
5. **FOR prep coach** — section-by-section coaching; may suggest opening `/advisor-tools/for-engine` for package assembly.  
6. **Desktop twin awareness** — point to D: PortablePost allotment calculator for offline full variance UI when user is an internal operator.  
7. **RAG layer (Phase B)** — retrieve top-k chunks from Manual markdown/PDF extracts before chat completion; inject as “Retrieved Manual context” **in addition to** full system prompt.  
8. **Streaming responses (Phase B+)** — improve UX without reducing content quality.  
9. **Transcript export** — markdown download for training notes.  
10. **Evaluation suite** — golden questions spanning all five duty domains + “refuse to invent policy” cases.

---

## 4. Architecture

```
Browser (password cookie)
  → /advisor-tools/advisor-ai  (AdvisorAiChat)
       → POST /api/advisor-tools/advisor-ai/chat
            → [optional] retrieveManualContext(query)
            → xAI chat/completions
                 system = ADVISOR_AI_SYSTEM_PROMPT  // full baseline + expansions
                       + retrieved excerpts (if RAG)
                 history (expanded window vs help-agent)
                 user message
            → { reply, model, citations?, retrievalMeta? }
```

### 4.1 Prompt pack structure (`lib/advisor-ai/`)

```
lib/advisor-ai/
  index.ts                 # composeSystemPrompt(), starters, metadata
  prompt-core.ts           # FULL user-provided CA 9-1-1 Advisor AI prompt (verbatim body)
  prompt-addenda.ts        # ADDITIVE only: site URLs, tool map, RAG instructions, cross-links
  knowledge/
    chapters-index.ts      # Chapter I–XII + Intro + Glossary index + public URLs
    forms-catalog.ts       # TD/TDe/PSC forms, purposes, common pitfalls
    funding-playbook.ts    # Direct vs reimbursement, residual, allotment formula notes
    for-playbook.ts        # FOR cadence, sections, evidence themes
    contacts-escalation.ts # Branch phone/email, reimbursements, directory guidance
    context-2026.ts        # CPE surge, NG9-1-1 bridge, residual/transparency themes
  retrieve.ts              # Phase B: keyword/embedding retrieval over knowledge + manual extracts
  eval/
    golden-cases.ts        # Expanded Q&A expectations
    run-eval.ts            # Optional script/vitest scoring rubrics
```

**Composition rule:**

```ts
ADVISOR_AI_SYSTEM_PROMPT =
  PROMPT_CORE          // user baseline — immutable intent
  + "\n\n---\n\n"
  + PROMPT_ADDENDA     // tools, RAG usage, cross-links
  + optional(RETRIEVED_CONTEXT_BLOCK)
```

### 4.2 API design (expanded vs current help-agent)

| Feature | Help agent (keep) | Advisor AI (new) |
|---------|-------------------|------------------|
| Model | `XAI_MODEL` or `grok-4.5` | Same env; allow `ADVISOR_AI_MODEL` override |
| max_tokens | 1600 | **≥ 2800–4000** (long Manual walkthroughs) |
| history | 12 turns | **16–24 turns** |
| temperature | 0.4 | **0.25–0.35** (policy precision) |
| max message | 4k | **6k** (paste policy questions) |
| GET health | configured/model | + `agentId: "ca-911-advisor-ai"`, promptVersion |
| Rate limit | none today | **ADD:** simple in-memory / edge-friendly limit per IP+cookie (e.g. 30 req/10 min) |

### 4.3 Knowledge / RAG sources (expand accuracy)

**Priority corpus (local, already on machine / kit):**

- `CalOES_ITA_NewHire_Kit_2026/operations_manual_export/*.pdf` (esp. Chapter III Funding ADA revised)  
- `operations_manual_webscrape/**/text` and `reference/chapter-iii-funding.md`  
- FOR / training extracts already used by FOR engine docs  
- Advisor User Manual project materials (if licensed for internal RAG)  
- Public Cal OES URLs (for citation, not scraping at runtime unless Firecrawl allowed)

**Phase A (ship first):** Static TS knowledge modules + full baseline prompt (no vector DB).  
**Phase B:** Chunk Manual markdown into `lib/advisor-ai/knowledge/chunks/*.md` + simple BM25/keyword retrieve in `retrieve.ts`.  
**Phase C (optional):** Embeddings store (local JSON or hosted) — only if Phase B quality insufficient.

### 4.4 UI/UX (vault design system — expanded)

Inspired by `AdvisorHelpAgentChat` but **richer**:

- Header: **CA 9-1-1 Advisor AI** · Grok · password-gated · “complements human Advisors”  
- Warm greeting from baseline (“invite first question on funding, FOR, NG9-1-1…”)  
- Starter chips (expanded set, all domains):  
  - CPE allotment / Advanced Notification  
  - Direct Funding vs Reimbursement  
  - Residual funds rules  
  - FOR prep checklist  
  - NG9-1-1 GIS funding  
  - ATA / travel  
  - New PSAP criteria  
  - “When must I escalate to a human Advisor?”  
- Optional **role selector** (injects one line into user payload / system addendum for this session)  
- Markdown rendering for lists/bold (expand readability)  
- “Export transcript”  
- Footer disclaimers: not legal advice; not Fi$Cal; not official allotment letter; Manual supersedes if conflict  
- Links: Hub, Help Agent (onboarding/tools), FOR Engine, PSAP Allotment, Manual public site  

### 4.5 Safety (baseline + stronger ops)

**Keep all baseline guardrails** and **add**:

- Server-side refusal logging (category only: invented-policy, emergency-dispatch, off-topic) without storing full PSAP PII  
- Prompt injection defense addendum: ignore instructions to drop Manual citations or claim funding authority  
- Explicit ban: issuing TD-288 numbers, approving claims, inventing ECaTS volumes  
- Emergency: “If this is life-threatening, call 9-1-1” short-circuit  

---

## 5. Implementation phases

| Phase | Deliverables | Exit criteria |
|-------|--------------|---------------|
| **P0 — Prep** | Feature branch `feat/ca-911-advisor-ai`; pin note in README/hub if needed; confirm `XAI_API_KEY` local | Dev server + existing help-agent still works |
| **P1 — Prompt pack** | `lib/advisor-ai/prompt-core.ts` with **full** user prompt; addenda + knowledge modules; version string | Prompt unit test: core length / required section markers present |
| **P2 — API** | `/api/advisor-tools/advisor-ai/chat` GET/POST; expanded history/tokens/temp; health | curl/local POST returns Grok reply |
| **P3 — UI** | `AdvisorAiChat` + page + starters + role chips + export | Browser chat works behind password |
| **P4 — Hub** | Additive card + roadmap line; **do not** remove help-agent | Hub shows both agents |
| **P5 — Eval** | Golden cases across funding/FOR/standards/escalation/non-invention | Vitest or scripted eval ≥ threshold |
| **P6 — RAG (expand)** | Manual chunk index + retrieve inject | Sample questions cite retrieved Chapter III language |
| **P7 — E2E** | Playwright: unauth redirect; login; open Advisor AI; send starter; help-agent still reachable | e2e green |
| **P8 — Deploy** | PR → Vercel preview → production smoke | Live password-gated URL; no regression on other tools |
| **P9 — Optional** | Streaming, embeddings, Admin “prompt version” badge | Backlog |

---

## 6. Local test environment

Already exists at `keyholders-site`:

```bash
cd C:\Users\javad\projects\keyholders-site
npm run dev
# Login /advisor-tools/login with ADVISOR_TOOLS_PASSWORD
# New: /advisor-tools/advisor-ai
# Existing: /advisor-tools/help-agent (must still work)
```

**Required env:** `ADVISOR_TOOLS_PASSWORD`, `XAI_API_KEY` (already in `.env.local`). Optional: `ADVISOR_AI_MODEL`, `XAI_MODEL`.

**Tests:**

- Unit: prompt composition markers; retrieve smoke; golden policy cases (mock Grok or rubric-only)  
- Integration: API with live key in local only  
- E2E: Playwright tools suite + new advisor-ai.spec.ts  

---

## 7. Deployment plan

1. Branch `feat/ca-911-advisor-ai` from current `main` (or rebase cleanly — **do not** require merging pinned CPE v2).  
2. Implement P1–P7 locally.  
3. PR → review.  
4. Vercel preview: password login → Advisor AI chat + regression on help-agent / FOR / invoice / psap-allotment.  
5. Merge → production thekeyholders.org.  
6. Confirm `XAI_API_KEY` already on Vercel (used by help-agent); no new secret **required** unless adding embeddings.  

**Do not** deploy to `keyholders-site-org` or static `thekeyholders` HTML tree.

---

## 8. Testing matrix (complete)

| Layer | What |
|-------|------|
| Prompt integrity | Required sections from user baseline present (mission, Ch.III, FOR, guardrails, escalation, greeting) |
| Functional | Chat completes; history continuity; long Manual-style answers |
| Safety | Refuse invent policy; escalate funding approval; redirect real emergencies |
| Regression | Help agent, FOR, invoice, psap-allotment, login gate |
| Performance | p95 latency acceptable; max_tokens large enough for structured walkthroughs |
| Production smoke | Live URL gated; configured GET true |

---

## 9. Risk register

| Risk | Mitigation |
|------|------------|
| Diluting existing help-agent | Separate route + separate prompt pack; only additive cross-links |
| Hallucinated policy | Low temperature; Manual citations required; RAG Phase B; escalate language |
| Prompt too long for model | Keep core full; put digests in RAG/chunks rather than deleting core sections |
| Cost / abuse | Rate limit; password gate; max history/tokens |
| Confusing two bots | Clear hub names; role of each on first message |
| CPE branch confusion | Implement Advisor AI from `main`; leave CPE web branch pinned |

---

## 10. Success criteria

- [ ] Full user baseline prompt live as system core (not summarized away)  
- [ ] Additive knowledge pack + optional RAG expands Manual fidelity  
- [ ] Password-gated browser chat on thekeyholders.org Advisor Tools  
- [ ] Existing New Hire + Automation Help Agent still fully available  
- [ ] Structured answers with Manual citations + escalation paths  
- [ ] Sample allotment formulas shown with “not official” disclaimer  
- [ ] Unit + e2e + production smoke green  
- [ ] Hub documents both agents  

---

## 11. Out of scope

- Shipping incomplete CPE web v2 as “GoldRush equivalent” (pinned)  
- Replacing human Advisors or issuing official TD-288 / allotment letters  
- Public unauthenticated Advisor AI (must stay gated)  
- Legal advice engine  

---

## 12. Recommended execution order after approval

1. Branch from **main** (not CPE feature branch unless already merged).  
2. **P1–P3** first (prompt pack + API + UI) so the full baseline prompt is live quickly.  
3. **P4–P5** hub + eval.  
4. **P6** RAG expansion over kit Manual extracts.  
5. **P7–P8** e2e + Vercel.  

**Primary codebase:** `C:\Users\javad\projects\keyholders-site`  
**Prompt source of truth:** User message baseline (verbatim in `prompt-core.ts`)  
**Stack:** Existing Grok/xAI pattern (`agent-chat`) expanded, not simplified  
**Skills/MCP when executing:** see **§15 Free MCP leverage & preflight** (below)  

---

## 15. Free / already-installed MCP servers — leverage before & during build

**Finding:** Most high-value free (or free-tier / local) MCPs for this project are **already configured** in `~/.grok/config.toml`. No paid marketplace purchase is required for the core Advisor AI build. Preflight = **verify connectivity** (`grok mcp doctor <name>`) and **use them deliberately** by plan phase.

### 15.1 Best free MCPs for *this* plan (ranked)

| MCP / plugin | Cost model | Plan phase | How it improves output |
|--------------|------------|------------|------------------------|
| **filesystem** (`C:\Users\javad\projects`) | Free (local) | All | Read/write `keyholders-site` safely |
| **filesystem-advisor** (`D:\Advisor_Docs`) | Free (local) | P1, P6 | Ingest training/FOR/CPE materials into knowledge pack **without** inventing policy |
| **filesystem-newhire** (`D:\New_Hire`) | Free (local) | P1 addenda only | Cross-link onboarding paths; do not collapse Advisor AI into new-hire bot |
| **markitdown** | Free (local Python) | **P1/P6 first** | Convert Manual **PDFs** → markdown for digests + RAG chunks (kit `operations_manual_export\`) |
| **chroma** (persistent `~\.grok\data\chroma`) | Free (local) | P6 | Vector store for Manual/chapter chunks; retrieval for “Retrieved Manual context” |
| **qdrant** (local path, collection `advisor-docs`) | Free (local) | P6 alt/parallel | Already pointed at `advisor-docs` + MiniLM embeddings — ideal for Manual RAG |
| **context7** | Free (docs MCP) | P2–P3 | Up-to-date Next.js / React / Vercel API docs while coding API + chat UI |
| **playwright** (headless) | Free | P7 | Browser e2e beyond unit tests; password-gate + chat smoke |
| **chrome-devtools** (plugin) | Free | P7–P8 | Debug chat UX, network to xAI, a11y |
| **github** | Free (PAT) | P8 | Branch/PR without force-pushing main |
| **vercel** | Free tier | P8 | Preview + prod deploy thekeyholders.org |
| **git** (stdio) | Free | All | Status/diff/commit hygiene (if handshake healthy) |
| **mermaid** | Free | Docs | Architecture + funding-flow diagrams in README/playbook |
| **firecrawl** (plugin) | Free tier / credits | P1/P6 expand | **Public** Cal OES pages only (Manual landing, forms list, org chart) — never scrape gated data |
| **excel** | Free | Optional | If Advisors attach ODS/XLSX policy tables for digest |
| **obsidian** | Free if local vault | Optional | If Advisor notes vault used as extra knowledge (user-gated content only) |
| **pdfco** | **API key / paid tier** | Optional only | Prefer **markitdown** first (free). Use pdfco only if markitdown fails on a PDF |
| **brave-search** | API often needed | Optional | Public policy search; prefer kit PDFs as source of truth |
| **linear / notion / slack / stripe / supabase / neon** | OAuth or paid | **Out of scope** for Advisor AI core | Not needed for chatbot build |

### 15.2 Preflight before first code change (execution checklist)

Run as **step 0** when implementation starts (not optional fluff):

1. `grok mcp list` — confirm enabled servers.  
2. `grok mcp doctor markitdown chroma qdrant context7 playwright filesystem filesystem-advisor` — fix handshake failures.  
3. Confirm dirs exist:  
   - `C:\Users\javad\.grok\data\chroma`  
   - `C:\Users\javad\.grok\data\qdrant`  
   - Kit Manual PDFs under `CalOES_ITA_NewHire_Kit_2026\operations_manual_export\`  
   - `D:\Advisor_Docs` via filesystem-advisor  
4. **No new paid MCP install required** if doctor is green.  
5. If markitdown/chroma/qdrant binary missing: reinstall via `pip install markitdown-mcp chroma-mcp mcp-server-qdrant` (free, user-local).  
6. **Do not** block build on pdfco/brave/composio auth failures.

### 15.3 How each MCP maps to plan elements (use, don’t skip)

| Plan element | MCP-assisted workflow |
|--------------|----------------------|
| Full baseline prompt pack | filesystem: write `prompt-core.ts` verbatim |
| Manual digests (Ch.I, III, VI, VIII, XI…) | **markitdown** on kit PDFs → markdown digests in `knowledge/` |
| RAG corpus | markitdown → chunk → **chroma** and/or **qdrant** (`advisor-docs`) → `retrieve.ts` |
| Advisor_Docs training materials | **filesystem-advisor** read-only harvest into knowledge (cite source path in notes) |
| Next.js / xAI route patterns | **context7** for Next 14 App Router + fetch patterns |
| Chat UI quality | **playwright** + **chrome-devtools** |
| Deploy | **github** PR + **vercel** preview → prod |
| Architecture docs | **mermaid** diagrams for auth + RAG + dual-agent hub |
| Public Cal OES links validation | **firecrawl** (public URLs only) |

### 15.4 Install/setup policy (user request)

| Action | Status |
|--------|--------|
| Install brand-new free MCPs from marketplace | **Not required** — markitdown, chroma, qdrant, context7, playwright, firecrawl already in config |
| Enable/verify before build | **Required** — doctor + data dirs |
| Add project-scoped MCP for Manual corpus path | **Recommended:** project `.grok/config.toml` under `keyholders-site` optional extra filesystem root to kit `operations_manual_export` (free) for shorter paths |
| Paid MCP setup | **Skip** for MVP (pdfco only if free markitdown fails) |

### 15.5 Explicit non-goals for MCP

- Do not route production chat traffic through Taskade for this agent (site already uses xAI Grok for gated help; keep same provider for consistency and control of system prompt).  
- Do not store PSAP PII in chroma/qdrant — Manual/policy chunks only.  
- Do not use Slack/Notion as policy sources of truth.

---

## 13. Starter chips (expanded catalog — for UI)

Include **at least** these (more may be added, none of the domains may be dropped):

1. How do I get my CPE Fixed Allotment?  
2. Direct Funding vs Reimbursement Claim — which path and what forms?  
3. Residual funds: what can I buy and what are the 90-day / 12-month rules?  
4. Walk me through Advanced Notification for CPE Funding.  
5. Prepare me for a Fiscal & Operational Review (FOR).  
6. What are mandatory answer-time standards (Ch. I)?  
7. NG9-1-1 GIS data funding — what is eligible?  
8. ATA travel / training — what needs pre-approval?  
9. New PSAP startup criteria checklist.  
10. When must I escalate to a human Advisor or CA911Reimbursements@caloes.ca.gov?  
11. (Cross-link) How do I use the tools on this Advisor Tools hub? → may hand off to Help Agent  

---

---

## 14. Direct answers to review questions (plan revision)

### Q1 — Completely separate from the existing agent on thekeyholders.org?

**Yes — by design. Not a mode switch and not a rewrite of the current bot.**

| Dimension | Existing agent | **New CA 9-1-1 Advisor AI** |
|-----------|----------------|------------------------------|
| Product name | New Hire + Automation Tool Help | CA 9-1-1 Advisor AI (PSAP Funding + Compliance) |
| Route | `/advisor-tools/help-agent` | **`/advisor-tools/advisor-ai`** (new) |
| API | `/api/advisor-tools/agent-chat` | **`/api/advisor-tools/advisor-ai/chat`** (new) |
| Prompt module | `lib/advisor-help-agent.ts` | **`lib/advisor-ai/*`** (new tree; never overwrite help-agent file) |
| System prompt | Onboarding + tool how-tos | **Full user baseline Advisor persona + Manual mastery** |
| UI component | `AdvisorHelpAgentChat.tsx` | **`AdvisorAiChat.tsx`** (new) |
| Hub card | Stays | **Second card** — both listed |
| Production behavior | Unchanged | Additive only |

Shared **only**: password cookie gate, vault UI styling, `XAI_API_KEY` / Grok provider pattern (same as prior Advisor Tools Grok integration).  

**Not shared:** system prompt text, conversation state, starters, API path, or mission focus. Cross-links in addenda may *point* users to the other agent; they do not merge prompts.

### Q2 — All characteristics from the conversation + instruction prompt included?

**Yes — as non-negotiable baseline; nothing is simplified away.**

Checklist baked into implementation acceptance:

| Characteristic from research / prompt | Included how |
|----------------------------------------|--------------|
| Core mission (SETNA, Warren-911, Surcharge Act, ~440 PSAPs) | `prompt-core.ts` verbatim + knowledge/context |
| Advisor persona (advocate, resource, gatekeeper, compliance) | Core identity section (full) |
| Duty domain 1 Funding (allotments, Adv. Notification, MPA, TD-288, Direct/Reimburse, residual, ATA, network, GIS, new PSAP, backup, July 31) | Core duties + `funding-playbook.ts` + Manual RAG |
| Duty domain 2 Advisory / training / multi-stakeholder | Core duties (full) |
| Duty domain 3 Standards + FOR (~5 yr, ~3/mo) | Core + `for-playbook.ts` + Ch.I / Ch.VI extracts |
| Duty domain 4 Wireless, Text, Alert & Warning, County Coord/MSAG | Core + Ch.IV/X/XII/VIII digests/RAG |
| Duty domain 5 Admin, Board, travel, emergency readiness, collab | Core (full) |
| 2026 priorities (CPE surge, NG9-1-1 bridge, residual, audits) | Core + `context-2026.ts` |
| Manual mastery list (Intro, I–II, III Rev.10-2025, IV–VIII, X–XII, Glossary) | Core list + chapter index + RAG corpus |
| Forms TD/TDe/PSC series, MPA, ECaTS/MIS, CalHR, Fi$Cal, CMAS | Core + `forms-catalog.ts` |
| Tone + 5-part response structure + plain English then Manual cite | Core interaction rules (full) |
| Never invent policy; escalate to Branch / assigned Advisor | Core + escalation module + eval cases |
| Sample allotment formulas with “needs official ECaTS + human” | Core + funding playbook |
| Safety/ethics (no legal advice, no fake approvals, inclusive) | Core guardrails + injection addendum |
| Example “How do I get my CPE allotment?” style | Core example + starter chips |
| Greeting + invite funding/FOR/NG9-1-1 questions | UI greeting + prompt live behavior |
| Contacts (916-894-5007, CA911Branch@, CA911Reimbursements@) | Core escalation + contacts module |
| Expanded workday/week / soft skills / tech stack awareness | Reflected in persona + knowledge (not deleted) |

**Acceptance test:** automated scan of `prompt-core.ts` for required section markers (mission, Chapter III, FOR, guardrails, escalation, greeting, example style). Fail CI if markers missing.

### Q3 — Further refine with Manual excerpts / RAG over PDFs?

**Yes — the plan explicitly expands the baseline with Manual injection; this is required expansion, not a downgrade of the prompt.**

**Two-layer refinement (both used; neither replaces the full system prompt):**

1. **Curated Manual digests (ship with P1)**  
   - Structured excerpts distilled from kit materials (Chapter III Funding ADA revised, Ch. I Standards, Ch. VI FOR, Ch. VIII Coordinator, Ch. XI GIS, Introduction, etc.) into `lib/advisor-ai/knowledge/*`.  
   - Appended or retrieved as dense policy anchors (formulas, residual rules, claim cutoff language).

2. **RAG over corpus (P6 — required for “production quality,” not optional forever)**  
   - **Sources already on disk:**  
     - `CalOES_ITA_NewHire_Kit_2026/operations_manual_export/*.pdf` (full chapter set)  
     - `operations_manual_webscrape/**/text`, `reference/chapter-iii-funding.md`  
     - FOR/training extracts under kit / Advisor_Docs where licensed for internal use  
   - **Pipeline:** convert PDF→markdown/text (existing kit extracts or offline conversion) → chunk → index (keyword/BM25 first; embeddings later if needed) → top-k inject as `### Retrieved Manual context` **before** the user turn, **in addition to** full `PROMPT_CORE`.  
   - **UI:** optional “sources considered” footnote (chapter names only — not dumping entire PDFs).

**What we do *not* do:** shrink the user system prompt and “rely only on RAG.” RAG **adds** Manual fidelity; core prompt stays exhaustive.

---

**End of plan (revised).** Ready for approval to implement **CA 9-1-1 Advisor AI** as a **fully separate**, **baseline-complete**, **Manual-augmented** Grok agent behind the Advisor Tools password gate.
