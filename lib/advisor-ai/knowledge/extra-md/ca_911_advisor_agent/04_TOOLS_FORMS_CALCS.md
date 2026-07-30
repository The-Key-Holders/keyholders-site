# 04 — Tools, Forms, Calculators, Automations

This file is the agent’s **instrument panel**: what to generate, check, or deep-link.

---

## A. Forms catalog (agent knowledge module)

Canonical downloads: Cal OES CA 9-1-1 Branch publications / forms pages (live URLs preferred over cached PDFs).

| Family | Purpose | Agent behavior |
|--------|---------|----------------|
| **Advance Notification for CPE Funding** | Intent / budget signal for CPE project | Guide when due; do not invent form field values |
| **CPE Fixed Allotment letter** | Official $ eligibility | Reference only; never forge |
| **SOW (CPE Statement of Work)** | Vendor deliverables | Compliance review checklist |
| **Price quote / cost workbook** | Pricing vs MPA max | Line-item hygiene |
| **TDe-285 / CPE Allotment Spending Plan** | Planned use of allotment | Match to quote; separate GIS |
| **TD-288 / TDe-288 / PSC-288** | Commitment to Fund | Completeness gate; tracking # education |
| **TD-284** | System acceptance | Residual clocks; payment trigger |
| **TD-290 / TD-290A** | Reimbursement claim (+ wage support) | Completeness; claim class routing |
| **TD-280 / TDe-280 / connectivity plans** | New PSAP / network connectivity variants | Intake + outline only |
| **GIS Spending Plan** | GIS pot discipline | Wrong-pot explainer |
| **Residual approval list** | What residual may buy | Version-stamped membership check |
| **STD-65** (historical) / **internal requisition + FI$Cal** | Procurement vehicle | Follow **current** Branch procedure notes |
| **STD-204** etc. | Admin/vendor setup as applicable | Point to templates folder; human completes |
| **Decals/stickers form** | Public education materials | Route to office process (low agent priority) |

Template locations on F: (internal):

- `F:\Advisor_Docs\RESOURCES\FORMS&LETTER Templetes\` (TD-280, TD-284, PSC-288, PSC-290, STD204, letters)
- `F:\Advisor_Docs\RESOURCES\CPE PROCUREMENT\`
- `F:\Advisor_Docs\RESOURCES\TEMPLATES\`

---

## B. Calculators

### B1. CPE Funding Fixed Allotment Calculator (primary)

| Item | Detail |
|------|--------|
| Path | `F:\CPE_Funding_Fixed_Allotment_Calculator\PortablePost_v1.3.0_Ready\` |
| Versions | Excel workbook + Python GUI + portable EXE; shared engine |
| Policy basis | Chapter III Funding (calculator notes Rev. 10-2025; verify) |
| Inputs | ECaTS Call Summary, Top Busiest Hours; exclusive data-source modes |
| Outputs | Position counts / allotment estimates; variance controls; estimator modes (incl. dollar estimator lineage) |

**Agent automation ideas**

1. **Guided import:** validate ECaTS layout (vertical vs horizontal).  
2. **Explain mode:** narrate why Level/position count changed when abandoned % or busy hour changes.  
3. **Price pack pin:** refuse dollar estimates if pack version unknown during MPA transition.  
4. **Export brief:** one-page estimate memo for PSAP call (with disclaimer).

### B2. Web peers (when available)

- PSAP Allotment estimator (site)
- FOR Assembly Engine
- Invoice ↔ TD-288 Reconciler

Agent should **route** rather than reimplement fiscal math in prompt-only form when a tool exists.

### B3. Lightweight date math (always on)

| Calculator | Logic |
|------------|--------|
| 5-year eligibility | acceptance_date + 5 years → eligibility window discussion |
| Residual 90-day | acceptance + 90 days → quote deadline |
| Residual 12-month | acceptance + 12 months → invoice/claim deadline |
| Adv Notice window | eligibility − 12 months (approx.) → earliest practical submit discussion |

---

## C. Automations (highest benefit first)

Ordered by Advisor time saved (from portal gap analysis + process thrash):

| # | Automation | Type | Benefit |
|---|------------|------|---------|
| 1 | **TD-288 package completeness checker** | Structured checklist + doc field extraction if files attached | Cuts multi-bounce packages |
| 2 | **Email / reply pack** keyed to Top-15 + FAQ IDs | Draft generation | Stops retyping same 15 answers |
| 3 | **Residual countdown** from TD-284 date | Calendar + reminders list | Prevents late residual |
| 4 | **SOW compliance pre-check** | Rule list + optional NLP flags | Earlier vendor fixes |
| 5 | **Allotment estimate brief** | Calculator API / CLI / paste results | Consistent $ conversations |
| 6 | **FOR data collection ticket** | Generated todo + email templates | Weeks of prep compressed |
| 7 | **Advisor lookup by county** | Read assignment xls → search | Wrong-inbox reduction |
| 8 | **Invoice naming validator** | Pattern check vs TD-288 convention | Fiscal fewer rejects |
| 9 | **Residual list membership** | Exact match against versioned list | Wrong-item shopping |
| 10 | **Red folder closeout order** | Checklist generator | Archive consistency |
| 11 | **Working log entry draft** | Structured note | Outreach continuity |
| 12 | **Buy now / wait + residual wizards** | Decision trees (portal peers) | PSAP self-serve |

### Explicit non-automations

- Auto-approve funding  
- Auto-send official letters without human  
- Auto-delete PSAP files  
- Auto-post to public web without review  

---

## D. Decision trees (from Quick Reference Aids)

Agent should implement these as **interactive trees**, not walls of text:

| Aid | Tree |
|-----|------|
| 01 | PSAP CPE decision tree (unknown issue entry) |
| 02 / 18 | CPE vs Network / three-system model |
| 04 | CPE funding & procurement flowchart |
| 08 | 5-year CPE cycle |
| 09 | Residual funds decision tree |
| 10 | Cloud vs on-premise |
| 11 | TD-290 reimbursement flow |
| 15 | Damage / repair decision tree |

Source: `F:\Advisor_User_Manual\Advisor_Quick_Reference_Aids\`

---

## E. Package artifacts by project stage

### Stage: Pre-funding
- Call stats evaluation notes
- Adv Notice
- Allotment letter

### Stage: Procurement
- Quotes (current + purged supersessions later)
- SOW
- Spending plan
- Compliance review notes
- Requisition / PO package

### Stage: Commitment
- TD-288
- Footprint / allotment balance ledger

### Stage: Acceptance & residual
- TD-284
- Residual approvals
- Invoices with payment auth

### Stage: Close
- Red folder ordered set → white archive
- ETS closed status

Agent can generate a **stage-tagged file checklist** for any PSAP project.

---

## F. County / PSAP file shape (awareness)

`F:\Advisor_PSAP_Files\` pattern:

```text
NN - CountyName/
  NN-County Coordinator/
  NNxx  Agency Name/
  XX CLOSED or historical entries...
```

Assigned pointer: `F:\Assigned_PSAP_Files_Javad\Advisor Assignments July 2026.xlsx`  
Assignments also: `F:\Advisor_Docs\Advisor County Assignments\`

**Agent:** use for **routing and structure**, not for bulk embedding of PSAP PII or call content.

---

## G. Suggested tool API surface (for implementers later)

```text
check_package(docs[]) -> { status, gaps[] }
estimate_allotment(ecats_files|manual_stats, options) -> { estimate, assumptions, disclaimer }
residual_clock(acceptance_date) -> { d90, d365, status }
residual_item_ok(item, list_version) -> { ok, reason }
for_prep_plan(psap_id, meeting_date) -> { sections, todos, emails[] }
draft_email(template_id, slots) -> { subject, body }
lookup_advisor(county|psap) -> { advisor, contact? } | { unknown }
```

All tools return **evidence fields** (which rule / Manual chapter / form) for citation.
