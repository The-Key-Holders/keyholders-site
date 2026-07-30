# 06 — Corpus Grounding (F: drive)

What informed this agent design, how to load knowledge safely, and what to exclude.

---

## Primary corpus map

| Path | Role for agent | Index depth |
|------|----------------|-------------|
| `F:\operations_manual_export\` | **Policy backbone** (Intro, Ch I–XII, Glossary, funding ADA chapter) | Full text chunks for RAG (PDFs → markdown) |
| `F:\Advisor_User_Manual\source_extracts\` | Training synthesis of desk manual, funding, FOR, letters | Full (already markdown) |
| `F:\Advisor_User_Manual\CA_911_Branch_Advisor_User_Manual.docx` | Consolidated Advisor training manual | Prefer extracts + rebuild pipeline |
| `F:\Advisor_User_Manual\Advisor_Quick_Reference_Aids\` | Call-ready trees and Top-15 | Full |
| `F:\Advisor_User_Manual\PSAP_Funding_Support_Portal\` | PSAP-facing IA, FAQs, **gaps** that define ROI | Full content kit; not secrets |
| `F:\Advisor_Docs\TRAINING\` | Desk manual, CPE training, acronyms, filing conventions | Prefer converted text; skip random .msg dumps unless curated |
| `F:\Advisor_Docs\RESOURCES\` | Forms templates, CPE procurement, ATA, NG, ops manual copies | Forms catalog + guides |
| `F:\Advisor_Docs\FISCAL&OPERATIONAL REVIEW (FOR)\` | FOR instructions, templates | Instructions + template field maps |
| `F:\Advisor_Docs\PROJECTS_Processing Queue\` | New PSAP / moves / working log patterns | Structure only unless curated |
| `F:\Advisor_Docs\OUTAGE\` | Outage process awareness | Process docs; not live duty PII |
| `F:\Advisor_Docs\Advisor County Assignments\` | Routing | Structured workbook → lookup tool |
| `F:\CPE_Funding_Fixed_Allotment_Calculator\` | Calculation engine + prior AI plan | Engine docs + formulas; optional code tools |
| `F:\Advisor_PSAP_Files\` | Package folder taxonomy | **Sample one county shape only** |
| `F:\Assigned_PSAP_Files_Javad\` | Personal assignment pointer | Workbook only |

---

## Red zones (do not bulk-load)

| Path / type | Why |
|-------------|-----|
| `F:\Outlook_Emails\` | Mailbox content; PII; sensitivity |
| `F:\Onboarding_Docs\` | Often PII-heavy |
| `F:\Dell_Backup_*` / ShadowVault | Backups / unrelated lab security |
| Full recursive `Advisor_PSAP_Files` | Scale + PSAP-sensitive history |
| Secrets, `.env`, keys, onion material | Never |
| Uncurated `.msg` with personal data | Curate before use |

---

## RAG priority order (when answering)

1. Live Manual chapter chunks (operations_manual_export)  
2. Current forms catalog + residual list version file (maintained)  
3. FUNDING PROCESS extracts (flag date; prefer newest)  
4. Quick Reference Aids  
5. FOR prep instructions  
6. User Manual narrative  
7. Portal FAQ content  
8. Desk Manual 2014 (historical; label as legacy if conflicts)

**Conflict rule:** newer Manual / Branch memo wins; agent states conflict explicitly.

---

## Operations Manual chapter map (agent mastery)

| Chapter / item | Agent use |
|----------------|-----------|
| Introduction | Mission framing |
| I Standards | Answer time, TTY, operational standards |
| II System Description | Architecture literacy |
| **III Funding** | **Core** CPE, residual, direct/reimburse, GIS boundaries |
| IV Wireless | SME routing |
| V Education | ATA / training materials |
| VI FOR | Fiscal & Operational Review |
| VII Foreign Language | Interpretation services |
| VIII County Coordinator & MSAG | Coordinator duties / funding |
| X Text-to-911 | Compliance themes |
| XI NG9-1-1 GIS | NG funding / GIS |
| XII Alert & Warning | Bounded awareness |
| Glossary | Term discipline |

---

## Knowledge pack modules (recommended implement shape)

```text
knowledge/
  chapters/           # digest + chunk IDs per Manual chapter
  forms_catalog.json  # form id, purpose, fields, pitfalls, public URL
  residual_list.json  # version, effective_date, items[]
  funding_playbook.md # direct vs reimburse, residual, ATA
  for_playbook.md     # binder sections
  comms_templates/    # T-01..T-12
  decision_trees/     # aids 01-18
  glossary.json
  context_2026.md     # transition memos (versioned)
  contacts_roles.md   # roles only + optional internal directory import
```

---

## How this design used the corpus (evidence trail)

| Design choice | Grounded in |
|---------------|-------------|
| Package-first co-pilot (not chat-only) | Portal `GAPS_AND_MISSING_TOOLS.md` bounce-back themes; funding process multi-step packages |
| TD-288 completeness checker as #1 automation | Gap table + funding process steps 5–7 |
| Residual 90-day / 12-month clocks | `Chap-3_Residual Funding_Doc.md` |
| FOR sections I–VI co-pilot | `2024_FOR Prep.md` |
| Top-15 + decision trees | Quick Reference Aids 01–18 |
| Allotment estimate via calculator | PortablePost README + samples |
| Red folder closeout checklist | `CPE Project Folder Closeout Process.md` |
| Dual agent portfolio (vs new-hire help bot) | `CA_911_ADVISOR_AI_PLAN.md` |
| Direct funding step map | `FUNDING PROCESS_11.2024.md` / briefing Chapter 3 |
| SETNA / Warren Act framing | Desk Manual background |
| County file taxonomy | Sample `Advisor_PSAP_Files\01 - Alameda` |
| Outage as escalate-not-own | `Advisor_Docs\OUTAGE` |

---

## Suggested local project home

This design pack lives at:

```text
C:\Users\javad\Projects\CA_911_Advisor_Agent\
```

Implementation (when desired) should stay under Projects (e.g. `keyholders-site` Advisor Tools) and treat F: as **read-only knowledge source**, not as app runtime storage.
