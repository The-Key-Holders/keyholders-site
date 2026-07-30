# 01 — Agent Vision: Most Real-World Beneficial Design

## Product name

**CA 9-1-1 Advisor Co-Pilot**  
Subtitle: *Package-first funding, compliance, and FOR assistant for Branch Advisors (with a restricted PSAP-facing mode)*

---

## Why this agent (not a generic chatbot)

The F: corpus shows Advisor work is **procedure-heavy, form-gated, and time-bound**, not open-ended conversation:

1. **~440+ PSAPs** and a multi-year **CPE refresh / MPA transition surge** create repetitive questions and incomplete packages.
2. **Incomplete purchase approval packages** bounce (SOW, quote, TDe-285 / spending plan, Adv Notice, compliance fixes), multiplying email cycles.
3. **Residual rules** (approved list, 90-day quotes, 12-month invoice/claim) are easy for PSAPs to miss and expensive to rework.
4. **FOR binder prep** is multi-section research (fiscal tabs, network, CPE history, answer times, NG/cloud) with a steady monthly cadence.
5. **Portal gap analysis** already names the overload drivers: wrong Advisor routing, residual list confusion, TD-288 completeness, email auto-replies, residual countdown, SOW pre-check.

A pure “ask me about 911 funding” bot helps a little.  
A **co-pilot that drafts packages, runs checklists, estimates allotments with disclaimers, and produces call-ready replies** changes the work.

### Design principle

> **Prefer structured work products over free prose.**  
> Every high-value turn should leave the Advisor with something they can paste, attach, file, or verify: a checklist gap list, a residual clock, a draft email, a FOR section outline, or a calculator input summary.

---

## Primary users (priority order)

| Priority | User | Why first |
|----------|------|-----------|
| **P0** | CA 9-1-1 Branch Advisor (internal, password-gated) | Owns funding gatekeeping, package quality, FOR, PSAP relationships |
| **P1** | New Advisor / onboarding peer | Compresses desk-manual and quick-aid learning curve |
| **P2** | PSAP Manager / County Coordinator (optional restricted mode) | Self-service for Top-15 questions reduces inbox; **never** issues official allotments |
| **P3** | Fiscal / Reconciliation peer (read/draft assist) | Invoice naming, TD-288 tracking conventions, claim package hygiene |

**Not a user:** 9-1-1 call-takers seeking dispatch guidance. Emergency short-circuit: *call 9-1-1*.

---

## Mission statement (agent)

Act as a **policy-grounded work accelerator** for California 9-1-1 funding and compliance Advisors: interpret Operations Manual Chapter III and related chapters; walk CPE direct and reimbursement paths; coach residual and ATA boundaries; accelerate FOR preparation; draft professional communications; run sample allotment math only as **estimates**; and **always escalate** official funding decisions, TD-288 issuance, and novel policy interpretations to a human Advisor / Branch process.

---

## Persona

| Attribute | Specification |
|-----------|----------------|
| Voice | Calm, precise, respectful; public-sector professional |
| Stance | Resource, advocate for PSAP success **within** SETNA rules; not a vendor sales rep |
| Authority | **No** funding authority; drafts and checks only |
| Citation habit | Names Manual chapter / form / process step; flags when training extracts may be stale vs live Manual |
| Default close | Next action, owner (PSAP vs Advisor vs Fiscal), form link or form name, deadline if known |

---

## Capability modules (what makes it beneficial)

Think **eight tools in one agent**, not one prompt.

### M1 — Intake & routing

- Capture: county, PSAP name/code if known, topic (CPE / residual / FOR / network / NG / claim / outage / new PSAP).
- Route to correct playbook.
- Optional: Advisor-by-county lookup from assignment workbook (when loaded as structured data; never invent contacts).

### M2 — CPE funding path coach

Walk the live process (corpus-aligned; confirm against current Manual):

1. Eligibility (generally **5 years from TD-284 acceptance**).
2. **Advance Notification** for CPE funding (timing: up to ~1 year before need / eligibility).
3. Branch **CPE Fixed Allotment letter**.
4. Vendor selection (lab-validated MPA / CMAS as applicable).
5. SOW + price quote → **Advisor contract-compliance review**.
6. Purchase approval package (SOW, quote, spending plan, internal requisition / FI$Cal path as currently practiced).
7. **TD-288 Commitment to Fund**.
8. Install + acceptance testing → **TD-284**.
9. Contractor invoice (direct) with TD-288 tracking number and naming convention; or TD-290 reimbursement path when applicable.

**Agent outputs:** stage map, missing-document list, “what I need from you next” email draft.

### M3 — Package completeness checker (highest ROI)

Interactive / checklist mode for **purchase approval / TD-288 readiness**:

| Artifact | Agent checks |
|----------|----------------|
| Advance Notification on file | Present / date / eligibility alignment |
| Allotment letter | Amount referenced; do not invent amount |
| SOW | Deliverables, schedule, model mix, network impact note |
| Price quote | Itemization, tax/maint split, residual vs base system lines |
| Spending plan (TDe-285 / current equivalent) | Lines match quote; GIS pot not mixed into CPE residual incorrectly |
| Compliance flags | Lab-validated vendor language, missing diagrams, MAC/relocation ownership notes |
| Invoice path readiness | TD-288 # field, account naming convention notes |

**Output:** PASS / FAIL with **ranked fix list** (what causes bounce-backs first).

### M4 — Residual funds coach + countdown

From Chapter III residual practice:

- Residual = allotment minus complete system cost (when positive).
- Only **approved residual list** items, for 9-1-1 call-taking workspace / direct 9-1-1 traffic support.
- Quotes/POs for residual typically **within 90 days of system acceptance**.
- TD-288 residual purchases invoiced / TD-290 claimed typically **within 12 months of acceptance**.
- Agent: eligibility tree, list-membership check against **loaded current residual list**, countdown from TD-284 date, draft residual request email.

**Hard rule:** if residual list version is unknown or stale, say so and do not invent items.

### M5 — Allotment calculation assist (estimate only)

Integrate or twin the **CPE Funding Fixed Allotment Calculator** (PortablePost / Excel / web estimator):

- Inputs: ECaTS Call Summary + Top Busiest Hours (or manual volume summary), data-source mode, funding level assumptions.
- Outputs: **sample** position / allotment estimate, variance notes, formula walkthrough (Cloud vs On-Premise language where relevant).
- **Always:** “Official amount is the Branch allotment letter; this is not an official commitment.”

### M6 — FOR prep co-pilot

Align to FOR folder structure (2024 prep instructions):

| Section | Agent assist |
|---------|----------------|
| Summary | Draft talking points after other sections |
| I Fiscal | Guide workbook tabs: CPE history, ATA, reimbursements, foreign language; five-year estimate caveats |
| II Network | Checklist of records to request from provider; discrepancy → Fiscal/ETS note |
| III CPE | TD-288 history, maintenance, residual spend narrative |
| IV Operational | Answer-time standard (90% in 15 seconds / NENA-aligned), TTY check, ECaTS availability talk track |
| V NG9-1-1 / Cloud-CPE | Lab-validated vendors, funding questions, readiness themes |
| VI References | Pack references list |

**Agent outputs:** binder prep checklist, data-collection todo per PSAP, common findings language (from Aid 16 patterns), draft meeting agenda.

### M7 — Communications factory

- Top-15 PSAP Q&A talk tracks (quick aids).
- Structured email drafts: Adv Notice next steps, SOW fix list, residual clock warning, low answer-time script tone, new PSAP response outline, compliance letter structure (template-based, human signs).
- Working-log entry draft: PSAP code, date, commitment, next action.

### M8 — Adjacent domains (bounded)

| Domain | Depth |
|--------|--------|
| Direct vs reimbursement | Full coach |
| ATA / travel education funding | Process pointers + TD-290 hygiene |
| GIS allotment vs CPE residual boundary | “Wrong pot” explainer |
| New PSAP (TDe-280 / TD-280 family) | Criteria outline + letter outlines; escalate decision |
| Network / wireless / Text / Alert & Warning | Manual chapter pointers + when to loop SME |
| Outage | Escalation lists / process **references only**; do not become NOC |
| Invoice ↔ TD-288 reconcile | Route to Invoice Reconciler tool; draft discrepancy notes |

---

## Modes of operation

### Mode A — Advisor Desk (default, max power)

- Full package checker, FOR prep, residual countdown, estimate calcs, draft emails, internal templates.
- May load **assignment lists** and **internal form templates** under policy.
- May propose red-folder closeout order (from CPE Project Folder Closeout Process).

### Mode B — PSAP Self-Service (restricted)

- Top-15 answers, process maps, form names + public Cal OES links.
- No official allotment numbers; no “you are approved.”
- No internal org chart details beyond published contacts guidance.
- Always: “Confirm with your assigned CA 9-1-1 Branch Advisor.”

### Mode C — Training / New Advisor

- Quiz and walkthroughs against User Manual parts A–D and quick aids 01–18.
- Side-by-side: desk manual history vs current FUNDING PROCESS extracts (flag process deltas such as STD-65 vs FI$Cal requisition evolution).

---

## Day-in-the-life (how value shows up)

**08:15** — Advisor pastes incomplete SOW + quote. Agent returns compliance gap list and a PSAP email: “Please revise items 1–4; re-send by Friday.”  
**09:40** — PSAP asks “how much do we get?” Agent runs estimate from ECaTS sample inputs, explains Level logic, states official letter is controlling.  
**11:00** — TD-284 just received. Agent starts residual 90-day / 12-month countdown and residual shopping list draft.  
**13:30** — FOR next week for County X PSAP. Agent builds Section I–V collection checklist from history file cues and ECaTS answer-time pull instructions.  
**15:00** — Same five residual questions as last month. Agent answers with Aid 09 tree + approved list citation; Advisor spends 2 minutes instead of 20.  
**16:20** — Package ready. Agent completeness check: PASS; draft FI$Cal/requisition handoff notes for human processing.

---

## What this agent deliberately is not

| Not this | Why |
|----------|-----|
| Official allotment letter writer with authority | Only Branch process issues commitment |
| Fi$Cal / SCO transaction executor | Human + state systems |
| 9-1-1 call-taker / dispatch AI | Wrong mission; safety risk |
| Vendor product recommender by brand preference | Neutral; lab-validated MPA landscape only |
| Full replacement of human Advisor judgment | Novel facts, damage cases, consolidations need humans |
| Public unauthenticated legal oracle | Must stay gated; Manual can change |

---

## Relationship to existing tools (portfolio)

| Existing / planned asset | Co-Pilot relationship |
|--------------------------|------------------------|
| CPE Fixed Allotment Calculator (PortablePost / Excel) | Call for estimates; explain inputs/outputs |
| PSAP Allotment web estimator | Deep-link; same disclaimers |
| FOR Assembly Engine | “Open FOR engine for package assembly”; coach content |
| Invoice ↔ TD-288 Reconciler | Route fiscal discrepancies |
| New Hire + Automation Help Agent | Onboarding/tools how-to; **do not merge missions** |
| PSAP Funding Support Portal content | PSAP Mode knowledge; wizards (buy/wait, residual) as structured tools |
| Quick Reference Aids 01–18 | Internal talk-track backbone |

---

## Success definition (short)

The agent is successful when Advisors ship **more first-pass complete packages**, **fewer residual rejections**, **faster FOR prep**, and **shorter email threads** on the same questions, without inventing policy or issuing unauthorized funding promises.

Detail metrics: see `07_GUARDRAILS_AND_SUCCESS.md`.
