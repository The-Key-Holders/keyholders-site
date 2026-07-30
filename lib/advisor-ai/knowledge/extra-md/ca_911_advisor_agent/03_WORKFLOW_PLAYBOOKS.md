# 03 — Workflow Playbooks

Each playbook is something the agent should run as a **guided procedure**: inputs → steps → outputs → escalations.  
Process steps below are grounded in F: funding process extracts, residual docs, FOR prep, closeout notes, and quick aids. Always re-check the live Operations Manual before treating a step as final policy.

---

## Playbook index

| ID | Name | Primary mode |
|----|------|----------------|
| PB-01 | CPE eligibility & Adv Notice | Advisor + PSAP |
| PB-02 | Allotment estimate (not official) | Advisor |
| PB-03 | SOW / quote compliance review | Advisor |
| PB-04 | Purchase approval / TD-288 readiness package | Advisor |
| PB-05 | Residual funds shopping & clocks | Advisor + PSAP |
| PB-06 | Acceptance (TD-284) → payment path | Advisor |
| PB-07 | Reimbursement claim (TD-290) | Advisor |
| PB-08 | FOR binder prep | Advisor |
| PB-09 | Answer-time / compliance outreach | Advisor |
| PB-10 | New PSAP inquiry | Advisor |
| PB-11 | Red folder closeout | Advisor |
| PB-12 | Contract transition / cloud questions | Advisor + PSAP |

---

## PB-01 — CPE eligibility & Advance Notification

### Goal
Determine whether a PSAP is in the window for CPE replacement funding and what to submit first.

### Inputs
- Last system acceptance date (TD-284) if known
- Desired go-live / need-by fiscal timing
- PSAP identity (county + agency)

### Steps (agent)
1. Explain **5-year cycle** from last acceptance as the general eligibility rule (confirm current Manual).
2. If under 5 years: explain cycle, extended maint themes (years 6–7 pre-approval), what is usually PSAP cost later.
3. If at/over 5 years or approaching: guide **Advance Notification for CPE Funding** (public form).
4. Timing: typically **no more than one year before** eligibility / funding need (align to current Chapter III wording).
5. Explain Branch response: **CPE Fixed Allotment Funding Letter** (timing targets appear in process extracts as ~3 weeks in newer briefing vs older 8-week pre-auth language; **cite current Manual**).

### Outputs
- Eligibility narrative
- Form name + public URL reminder
- Draft email: “Here is what to submit and what happens next”

### Escalate
- Damage / early replacement / negligence cases
- Consolidations or host-remote reconfigurations with unclear acceptance date

---

## PB-02 — Allotment estimate (not official)

### Goal
Help Advisor or PSAP understand **order of magnitude** funding using measured call volume methodology.

### Inputs
- ECaTS Call Summary export and/or Top Busiest Hours (xlsx/csv)
- Or manual monthly inbound / abandoned / duration summaries
- Cloud vs on-premise estimate mode if calculator supports it
- Active MPA price pack version (critical during transition)

### Steps
1. Prefer launching / describing the **CPE Funding Fixed Allotment Calculator** (PortablePost engine parity).
2. Validate import layout (vertical modern ECaTS vs classic horizontal).
3. Run estimate; show positions / level logic / variance controls used.
4. Compare only to **same price pack** when discussing dollars.
5. Stamp disclaimer: official amount = Branch allotment letter only.

### Outputs
- Estimate summary table
- Input assumptions log
- “What would change the official number” list

### Never
- Issue TD-288 numbers
- Invent ECaTS volumes

---

## PB-03 — SOW / quote compliance review

### Goal
Catch bounce-causing errors **before** purchase package is assembled.

### Inputs
- Contractor SOW
- Price quote / cost workbook
- Current MPA contract number and price sheet context (if available)
- Known site constraints (move, network cutover)

### Agent checklist (illustrative)
- [ ] Lab-validated / MPA vendor path stated correctly
- [ ] Deliverables match PSAP configuration (positions, backroom, training, maintenance years)
- [ ] Itemization separates **base system** vs **incremental / residual-eligible** lines
- [ ] Taxes, installation, training, maintenance broken out as required
- [ ] Schedule present; acceptance testing referenced
- [ ] Network impact note if move/replace touches network stakeholders
- [ ] Typos / wrong addresses / wrong model mix
- [ ] MAC / relocation cost ownership clear (often PSAP-paid; confirm SOW)
- [ ] NG/i3 language present when required by current standards for funded systems

### Outputs
- Ranked fix list for PSAP/vendor
- Draft “return for correction” email with 2-week review expectation language (from process extracts: Advisor contacts PSAP within ~2 weeks when noncompliant)

### Escalate
- Ambiguous sole-source / off-contract purchases
- Claims that conflict with residual list

---

## PB-04 — Purchase approval / TD-288 readiness

### Goal
First-pass complete package so Commitment to Fund can issue without thrash.

### Package completeness matrix

| Element | Required? | Notes |
|---------|-----------|-------|
| Adv Notice history | Yes (on file) | Eligibility chain |
| Allotment letter amount | Yes | Reference only; do not invent |
| Advisor-reviewed SOW | Yes | Post PB-03 |
| Price quote | Yes | Matches SOW |
| Spending plan (TDe-285 or current) | Yes | CPE vs GIS lines separated |
| Procurement instrument | Yes | Historical STD-65; newer internal requisition + FI$Cal — **use current Branch procedure** |
| Ship-to = install site | Yes | |
| Bill-to = Branch (direct path) | Yes for direct | |
| MPA compliance statement | Yes when on MPA | Exact contract # |
| Cost summary (system + optional add-ons) | Yes | |

### Outputs
- Completeness PASS/FAIL
- Missing artifacts list
- Human handoff notes for requisition / FI$Cal entry (agent does not submit)

### After TD-288 issues
- Remind: PSAP authorizes contractor only after TD-288
- Tracking number must appear on invoices
- Account naming convention from TD-288 must be used

---

## PB-05 — Residual funds shopping & clocks

### Goal
Spend residual correctly and on time.

### Rules of thumb (confirm Manual)
1. Residual exists only if complete system cost **less than** fixed allotment.
2. Items must be on **Service/Equipment Approval List for Residual Funds** (Chapter III).
3. Use in 9-1-1 communication center / equipment room in **direct support of 9-1-1 traffic**.
4. Request residual funding **at time of or during** CPE system replacement (process language).
5. Quotes/POs for residual: typically **≤ 90 days after acceptance**.
6. Invoice / required TD-290: typically **≤ 12 months after acceptance**.

### Example residual categories (from residual extract; always verify live list)
- Additional call-handling workstation elements (after primary CPE)
- Mapping monitors, logging recorder, headsets, limited furniture/chairs rules
- UPS, firewalls/routers for connectivity as listed
- GIS services/software/equipment when residual-allowed
- PMP/ENP consulting for CPE replacement when listed
- Temporary relocation of CPE when listed

### Agent flow
1. Confirm acceptance date → compute countdown.
2. Confirm residual dollars (allotment − funded system; from package, not guessed).
3. Check each shopping item against **loaded residual list version**.
4. Draft residual request package checklist.
5. Warn if GIS should be GIS allotment instead of residual.

### Escalate
- Items not on list
- Post-deadline requests
- Damage replacements framed as residual

---

## PB-06 — Acceptance (TD-284) → payment path

### Goal
Close the install loop cleanly.

### Steps
1. Confirm acceptance testing per contract.
2. TD-284 signed → Branch.
3. Direct path: contractor invoices Branch with TD-288 tracking # and naming convention.
4. Update ETS / PSAP equipment record cues (human in ETS).
5. Start residual clocks (PB-05).
6. When all residual paid and invoices authorized → prepare for closeout (PB-11).

### Outputs
- Acceptance-to-payment checklist
- Residual clock dashboard entry
- Invoice hygiene reminder for vendor/PSAP

---

## PB-07 — Reimbursement claim (TD-290)

### Goal
Correct path when PSAP pays first (or for ATA / County Coordinator wages / other reimbursable classes).

### Steps
1. Classify claim type (CPE residual reimbursement vs ATA vs County Coordinator vs network, etc.).
2. Map required support docs (TD-290A when wages).
3. Check funding pre-approval / TD-288 linkage where required.
4. Deadline awareness (fiscal claim calendars).
5. Draft claim completeness checklist; human submits.

### Escalate
- Mixed ATA + CPE residual without policy basis
- Wage claims outside approved tasks

---

## PB-08 — FOR binder prep

### Goal
Produce a review-ready folder with less manual thrash.

### Structure (2024 instructions)

1. **Cover sheet** — PSAP name, review date  
2. **FOR Summary** — write **last** (findings preview)  
3. **Section I Fiscal** — Excel Summary + CPE / ATA / Reimbursement / Foreign Language tabs; five-year estimate caveats  
4. **Section II Network** — provider customer record; circuit/service list; billing accuracy discussion  
5. **Section III CPE** — TD-288 history, maintenance, residual narrative  
6. **Section IV Operational** — 12-month answer times (target: ≥90% answered within 15 seconds), TTY capability, ECaTS use  
7. **Section V NG9-1-1 / Cloud-CPE** — lab-validated options, funding Q&A  
8. **Section VI References**

### Agent outputs
- Data collection ticket list (who to email for network record, Language Line report, etc.)
- Binder section skeletons with blue-field prompts
- Common findings language (prep, not fabricated performance)
- Meeting agenda (60–90 min typical structure)

### Escalate
- Substandard answer times requiring formal improvement plan / compliance letter path
- Billing discrepancies needing ETS correction by Fiscal Unit

---

## PB-09 — Answer-time / compliance outreach

### Goal
Support performance conversations with consistent tone.

### Inputs
- ECaTS answer-time series
- Prior letters / improvement plans if any

### Steps
1. State standard clearly (90% / 15 seconds; NENA-aligned).
2. Present last 12 months trend neutrally.
3. Offer improvement themes (staffing, call flow, abandonment, tech) without pretending to know local CBA constraints.
4. Use low-answer-time phone script structure from training extracts for live calls.
5. Draft follow-up email; human decides if formal compliance letter is needed.

---

## PB-10 — New PSAP inquiry

### Goal
Consistent first response; do not improvise eligibility.

### Steps
1. Collect: jurisdiction, primary vs secondary intent, existing coverage, call volume rationale, facility readiness.
2. Point to New PSAP policy / TDe-280 family forms as applicable.
3. Use letter/email response outlines from training extracts as structure.
4. Emphasize: Branch decision process; Advisor gathers and advises.

### Outputs
- Intake form for Advisor
- Draft acknowledgment email
- Document request list

---

## PB-11 — Red folder closeout

### Goal
Archive correctly after payment + residual complete.

### Order (from CPE Project Folder Closeout Process)
1. CPE Purchase Checklist  
2. Reverse chronology: Vendor invoice (paid) → TD-284 → TD-288 → PO → Quote → SOW  
3. Residual spending approvals  
4. Left-side ledger / TDe-285 / preapproval / Adv Notice / call stats  
5. Purge superseded SOWs/quotes  
6. Archive to white binder; update ETS closed status  

### Agent role
- Checklist only; no automatic purge of files on disk without human confirmation.

---

## PB-12 — Contract transition / cloud questions

### Goal
Absorb 2026–2027 surge questions with consistent Branch-safe answers.

### Topics
- Buy now vs wait (portal wizard peer)
- Mid-stream TD-288 under prior MPA (needs Branch memo; do not improvise conversion)
- Cloud vs on-premise comparison (Aid 10)
- Lab-validated vendor list (publish/post-award; agent must use **current** list)
- Facility readiness (power/HVAC/NG demarc) as delay risk checklist

### Outputs
- Decision tree walkthrough
- Transition FAQ email
- Escalation when policy memo missing

---

## Cross-playbook orchestration

```
PSAP question
    → M1 Intake
        → if eligibility/funding timing → PB-01
        → if "$ how much" → PB-02
        → if SOW/quote → PB-03 → PB-04
        → if leftover money → PB-05
        → if accepted/install done → PB-06 (+ PB-05 clocks)
        → if claim → PB-07
        → if FOR due → PB-08
        → if performance → PB-09
        → if new PSAP → PB-10
        → if close project → PB-11
        → if contract/cloud surge → PB-12
```

Always end with: **next action · owner · form · date**.
