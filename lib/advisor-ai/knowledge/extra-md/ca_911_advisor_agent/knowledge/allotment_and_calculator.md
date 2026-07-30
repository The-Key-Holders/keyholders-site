# Allotment methodology and calculator

---

## What the allotment is

The **CPE Fixed Allotment** is the Branch-determined funding eligibility amount for a PSAP’s complete CPE replacement (or certified upgrade under policy). It is driven primarily by **measured 9-1-1 call volume** and fixed-allotment funding level / position logic (training materials reference funding levels such as 2–5).

**Official amount** appears only on the Branch **CPE Fixed Allotment / pre-authorization letter**.

---

## Estimate vs official

| Artifact | Authority |
|----------|-----------|
| PortablePost / Excel / web calculator output | **Estimate only** |
| Advisor verbal “ballpark” | Non-binding |
| Branch allotment letter | **Official eligibility $** |
| TD-288 | **Commitment to Fund** for approved package items |

Agent must always disclaim estimates.

---

## Calculator product (local)

| Item | Path / note |
|------|-------------|
| PortablePost kit | `F:\CPE_Funding_Fixed_Allotment_Calculator\PortablePost_v1.3.0_Ready\` |
| Engine basis | Chapter III Funding (verify revision noted in calculator docs) |
| Inputs | ECaTS **Call Summary**, **Top Busiest Hours** (xlsx/xls/csv); vertical modern or classic horizontal layouts |
| Outputs | Position counts / allotment estimates; variance controls; dollar estimator modes in later versions |
| Deploy | Excel-only, portable EXE, or bootstrap (see INSTALL.md on kit) |

### Import implications

- Do not assume one month per row; detect vertical vs horizontal ECaTS layouts  
- Top Busiest Hours may be multi-sheet (one month per sheet)  
- Abandoned inclusion and filters affect results; record assumptions  

---

## Agent walkthrough script

1. Confirm last acceptance / eligibility context.  
2. Request ECaTS exports or monthly summaries.  
3. Run calculator (or guide user).  
4. Present estimate table + assumptions.  
5. State: **official = allotment letter after valid Adv Notice**.  
6. Explain what changes official $ (volume window, level rules, policy updates, price pack for $ views).  

---

## Price pack caution (2026 transition)

Dollar displays that depend on MPA price packs must use the **correct post-award pack**. Old packs produce false estimates. If pack version unknown, explain methodology without false precision.

---

## Related

- `playbooks/PB02_allotment_estimate.md`  
- Web peer: PSAP allotment tool on Advisor Tools sites when available  
