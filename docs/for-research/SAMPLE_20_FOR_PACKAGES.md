# FOR History Sampling Study — 20 Packages

**Source:** `D:\Advisor_Docs\FISCAL&OPERATIONAL REVIEW (FOR)\PSAP HISTORY FILES`  
**Analysis date:** 2026-07-14  
**Goal:** Identify high-value enhancements for the FOR Assembly Engine + Grok training corpus.

---

## Selection criteria (applied)

### User-required
1. **Completed FOR** with files sufficient to treat as a full package  
2. **Past 2 years** preferred (see critical finding below)

### Additional criteria (engineer-defined)
3. **Core binder present:** Cover + Summary + Sections I–VI (all 8 narrative pieces)  
4. **Supporting systems of record:** Fiscal Worksheet (xls) and/or eCaTS exports  
5. **Unique PSAP** (one best package per agency)  
6. **Recency score:** max of file `LastWriteTime` and years in path/filenames  
7. **Support richness:** Network PDF, ATA, language-line report, Automated FOR Worksheet, NG diagram  
8. **Exclude:** ARCHIVE-only, PENDING, incomplete stubs  

### Dating method
- Folder/file name years (`FOR 2023`, `2022.doc`, etc.)  
- Maximum recursive `LastWriteTime` of package files  
- Cross-check: if either year-hint ≥ 2024 **or** mtime ≥ 2024-07-01 → “past 2 years”

---

## Critical finding: past-2-year window is empty in this tree

| Window | Complete FORs found |
|--------|---------------------|
| **mtime ≥ 2024-07-01 or year ≥ 2024** | **0** |
| **Files modified ≥ 2024-01-01 under any FOR dir** | **0** |
| **Modern complete (2022–2023)** | **7 unique PSAPs** (8 packages) |
| **Complete all-time scored** | dozens |

**Implication:** Under a strict “completed in past 2 years (from 2026-07)” rule, **no qualifying packages exist** on `D:\Advisor_Docs\…\PSAP HISTORY FILES`. The latest *complete* packages cluster in **2023** (Roseville, Rocklin, Santa Cruz REG 911, Lincoln, UC Santa Cruz, South San Francisco, plus Oakland materials touched late 2023).

**Sample strategy used:**  
- Prefer **2022–2023 complete strong** packages first (best available “recent”)  
- Fill remaining of 20 with **best complete** packages by quality (still useful for engine design), clearly labeled as older  

---

## Sample of 20 (ranked by quality score)

| # | PSAP | Package path | Peak mtime | Year hint | Sections | Support | Strong | Notes |
|---|------|--------------|------------|-----------|----------|---------|--------|-------|
| 1 | **Roseville PD** | `Roseville PD\Roseville PD FOR` | 2023-02-27 | 2023 | 8/8 | 7 | Yes | Gold standard: Auto WS + eCaTS + fiscal + network + ATA + lang + NG |
| 2 | **Rocklin PD** | `Rocklin PD\Rocklin PD FOR` | 2023-01-27 | 2023 | 8/8 | 5 | Yes | Auto WS + eCaTS + fiscal + network + ATA |
| 3 | **Santa Cruz REG 911** | `Santa Cruz REG 911\FOR 2023` | 2023-07-18 | 2023 | 8/8 | 4 | Yes | Rich PDFs + eCaTS + fiscal + lang + NG |
| 4 | **Lincoln PD** | `Lincoln PD\Lincoln PD FOR` | 2023-01-27 | 2023 | 8/8 | 4 | Yes | eCaTS + fiscal + network + lang |
| 5 | **UC Santa Cruz** | `UC Santa Cruz\FOR 2023` | 2023-05-22 | 2023 | 8/8 | 3 | Yes | eCaTS + fiscal + NG |
| 6 | **Oakland PD** | `Oakland PD\FOR  9-12-2017` | 2023-11-06 | 2017 | 8/8 | 2 | Yes | Older FOR, files retouched 2023; many PDFs |
| 7 | **South San Francisco PD** | `South San Francisco PD\FOR 2023` | 2023-07-08 | 2023 | 8/8 | 2 | Yes | eCaTS + fiscal |
| 8 | Livingston | `Livingston\FOR 2018` | 2021-02-20 | 2018 | 8/8 | 1 | No | Core only |
| 9 | San Bernardino PD | `San Bernardino PD\FOR - 2020` | 2020-02-25 | 2020 | 8/8 | 4 | Yes | eCaTS + network + lang |
| 10 | Vallejo PD | `Vallejo PD\FOR - 2020` | 2020-02-21 | 2020 | 8/8 | 3 | Yes | |
| 11 | Suisun City PD | `Suisun City Police Department\FOR  2020` | 2020-02-21 | 2020 | 8/8 | 3 | Yes | |
| 12 | Martinez PD | `Martinez PD\FOR - 2020` | 2020-01-30 | 2020 | 8/8 | 3 | Yes | |
| 13 | USMC Barstow NEBO | `USMC Logistics Base Barstow-NEBO…\FOR - 2019` | 2019-10-21 | 2019 | 8/8 | 3 | Yes | Military PSAP variant |
| 14 | USMC Twentynine Palms | `USMC Twentynine Palms\FOR - 2019` | 2019-09-29 | 2019 | 8/8 | 4 | Yes | |
| 15 | Sunnyvale DPS | `Sunnyvale DPS\FOR - 2019` | 2019-09-23 | 2019 | 8/8 | 3 | Yes | |
| 16 | Mendocino Co SO | `Mendocino County Shf\Archive\2018 FOR` | 2019-09-12 | 2018 | 8/8 | 1 | No | Minimal support |
| 17 | NASA AMES PD | `NASA AMES PD\FOR - 2019` | 2019-08-27 | 2019 | 8/8 | 2 | Yes | Campus/federal variant |
| 18 | UC Davis PD | `UC Davis PD\FOR - 2019` | 2019-07-30 | 2019 | 8/8 | 3 | Yes | |
| 19 | UC Berkeley PD | `UC Berkeley PD\FOR - 2019` | 2019-06-24 | 2019 | 8/8 | 3 | Yes | |
| 20 | Ontario Fire | `Ontario Fire Dept\FOR - 2018` | 2019-03-05 | 2018 | 8/8 | 3 | Yes | Fire PSAP variant |

**Best “recent complete” tier for engine design:** rows **1–7** (2023 cluster).  
**Diversity tier (agency type):** military, university, regional, fire (rows 3, 5, 13–14, 17–20).

---

## Aggregate patterns (n=20)

| Artifact | Frequency |
|----------|-----------|
| Cover + Summary + I–VI | **20/20** |
| Fiscal Worksheet (.xls/.xlsx) | **20/20** |
| eCaTS reports | **17/20** |
| Language interpretation report | **12/20** |
| Network Report PDF | **7/20** |
| ATA balance artifact | **2/20** |
| Automated FOR Worksheet | **2/20** (Roseville, Rocklin) |
| NG diagram | **3/20** |

### Dominant file types (sample file counts)
| Ext | Count | Role |
|-----|------:|------|
| `.doc` | 148 | Primary section narrative (legacy Word) |
| `.xls` | 117 | Fiscal + eCaTS classic exports |
| `.docx` | 36 | Cover, Automated worksheet, newer sheets |
| `.pdf` | 34 | Network, ATA, diagrams, supporting |
| `.xlsx` | 16 | Language line / newer sheets |

**Engine takeaway:** completed FORs are **multi-file binders**, not a single HTML. Primary deliverables are **Word (.doc/.docx)** + **Excel fiscal** + **eCaTS workbook set** + optional PDFs.

---

## Gold-standard package anatomy (Roseville / Rocklin)

```
FOR package/
  Cover Page.docx              (+ seals/images)
  FOR Summary Page *.doc
  Section I_Fiscal Review *.doc
  Section II_Network Review *.doc
  Section III_CPE *.doc
  Section IV_Operational *.doc
  Section V_NG *.doc
  Section VI_References *.doc
  Fiscal Worksheet.xls         (numeric engine for Sec I/Summary)
  Automated FOR Worksheet.docx (field capture → docs)  [sometimes]
  eCaTS Reports/
    Last 12 Months Answer Time.xls
    Call Summary (Classic).xls
    Calls Per Hour.xls
    ...
  Network Report.pdf           [often]
  ATA Balance.pdf              [sometimes]
  Language Line / Cyracom.xlsx [often]
  NG diagram.pdf / pptx        [sometimes]
```

---

## Top 5 critical enhancements (ranked)

### 1. **Native Word (.docx) section export** — highest impact
**Why:** ~100% of completed packages ship Section narratives as Word; HTML is a draft preview only.  
**What to build:** DOCX templates for Cover, Summary, I–VI matching Branch layouts (letterhead, fonts Times/Calibri, page margins, real tables).  
**Value:** Advisors can drop outputs into PSAP FOR folders without reformatting.

### 2. **Fiscal Worksheet (.xlsx) as system-of-record for money** — highest accuracy
**Why:** 20/20 packages include a Fiscal Worksheet; Section I narrative is thin without it (Roseville Sec I is mostly boilerplate; numbers live in Excel).  
**What to build:**  
- Generate/fill a multi-tab fiscal workbook (Summary, CPE, ATA, Reimbursement, Foreign Language)  
- Drive Summary $ figures from workbook, not free-text alone  
**Value:** Matches real FOR math and Advisor workflow.

### 3. **eCaTS attachment pack + ASA extraction** — operational credibility
**Why:** 17/20 include eCaTS; Section IV cites real ASA (e.g. Roseville 91.84%, 5,336 calls/mo).  
**What to build:**  
- Accept eCaTS exports (Answer Time, Call Summary, Calls/Hour)  
- Parse ASA / monthly volume into Section IV fields  
- Export an `eCaTS Reports/` folder into the package ZIP  
**Value:** Removes manual re-keying and supports Grok coaching with real metrics.

### 4. **Package ZIP layout matching PSAP FOR folders** — completeness
**Why:** Engines that dump one file fail the “completed package” bar used in history.  
**What to build:**  
```
{PSAP}_{YYYY-MM-DD}_FOR/
  00_Cover.docx
  01_Section_I.docx
  ...
  07_Summary.docx
  Fiscal_Worksheet.xlsx
  eCaTS_Reports/...
  exhibits/...
  package.json  (machine-readable fields)
```
**Value:** Aligns engine output with how FORs are archived and reviewed.

### 5. **Automated FOR Worksheet–style data entry + exhibit slots** — process fidelity
**Why:** Roseville/Rocklin show the intended automation path: structured fields (items 1–24) → generate sections. Network tables, ATA, language, NG diagram are first-class exhibits in strong packages.  
**What to build:**  
- Worksheet UI (already partially mirrored by wizard fields)  
- Exhibit upload slots: Network PDF, ATA PDF, Language xlsx, NG diagram, floor plan  
- Network **line-item table** editor (Telco / Description) like Section II  
- Cover seal/logo asset pipeline  
**Value:** Closes gap between “draft narrative” and “meeting-ready binder.”

---

## Secondary enhancements (honorable mentions)
6. Font/typography pack: Times New Roman body, official letterhead styles  
7. Post-FOR findings log export (XLSX)  
8. Year-based FOR Archive naming (`{PSAP} FOR {YYYY}`)  
9. Grok RAG over these 7 modern gold packages + prep docs (not full history dump)  
10. Template versioning (2018 vs 2023 Section V NG language differs)

---

## Recommended engine roadmap (from this sample)

| Priority | Enhancement | Depends on |
|----------|-------------|------------|
| P0 | DOCX export for all sections + cover | Templates |
| P0 | Fiscal Worksheet xlsx in/out | Schema |
| P1 | eCaTS parse + Reports folder | Ingest |
| P1 | Package ZIP folder layout | Export |
| P2 | Exhibit uploads + network line items + seals | UI |

---

## Grok training implication
Train the gated help agent on:
1. Prep checklist from 2024 FOR Prep  
2. **Roseville + Rocklin** as gold-standard package inventories  
3. Field list from Automated FOR Worksheet (1–24)  
4. Explicit rule: **never invent ASA/$**; require eCaTS/fiscal fields  

Do **not** bulk-ingest thousands of PSAP history files; use a curated set of modern complete packages.

---

*Generated by automated inventory + scoring of PSAP HISTORY FILES.*
