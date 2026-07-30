# Residual funds playbook

Source themes: `Chap-3_Residual Funding_Doc.md`, Quick Aid 09, Top-15 Q6–Q7. **Confirm live Chapter III residual list.**

---

## Definition

If the final cost of a **complete** 9-1-1 system CPE replacement is **less than** the PSAP’s CPE fixed allotment, the remaining amount is **residual funds**.

---

## Core rules (training language)

1. Residual may buy only **Branch-approved** equipment/services on the residual Service/Equipment Approval List (Chapter III).  
2. Use within the **9-1-1 communication center** (including equipment room) in **direct support of delivery of 9-1-1 traffic** to the call taker.  
3. Funding for residual items is requested **at the time of, or during,** CPE system replacement.  
4. Quotes and/or POs for residual typically due **no later than 90 days after CPE system acceptance**.  
5. TD-288 approved residual purchases must be invoiced, and where required a TD-290 submitted, typically **within twelve (12) months of system acceptance**.  
6. If list membership is uncertain → stop and verify current list version; do not invent items.

---

## Example residual themes (illustrative; verify live list)

Training extracts have included categories such as:

- Additional call-handling workstation elements after primary CPE  
- Desktop/laptop, monitors (size limits in list), keyboard/mouse, programmable keypad, IP phone set if requested  
- Workstation arbitrator, instant recall recorder, UPS (workstation), headset box  
- Backroom: redundant UPS, admin/ring-down interface, CDR data interface, cabling, CAD/logger/radio/GIS/time sync interfaces  
- Redundant routers/firewalls for RNSP/PNSP connectivity  
- GIS services/software/equipment when residual-allowed  
- Mapping monitors  
- PMP/ENP certified consulting for CPE replacement  
- Furniture for **9-1-1 call-taker workstations only** (tight scope)  
- Dispatcher chairs with **per-workstation limits**  
- Headsets, logging recorder for 9-1-1, temporary CPE relocation, pre-arrival instruction system, reader boards  

**Agent rule:** Treat the above as **examples from training extracts**, not a guarantee of current eligibility. Always cite “confirm current residual list.”

---

## Clocks

| Event | Clock |
|-------|--------|
| TD-284 acceptance date | T0 |
| Residual quotes/POs | T0 + ~90 days |
| Invoice / required TD-290 | T0 + ~12 months |

Use `residual_clock` tool when available.

---

## Common failure modes

| Failure | Fix |
|---------|-----|
| Shopping off-list items (lobby furniture, non-911 use) | Refuse; explain list + workspace rule |
| Waiting until after 90 days to quote residual | Warn early at TD-284; calendar |
| Mixing GIS-only needs into CPE residual without policy basis | Point to GIS spending plan pot |
| Treating residual as free money after year 5 without replacement project | Residual is tied to complete system replacement context |
| No spending plan line for residual | Update TDe-285 / package |

---

## Agent checklist

```text
[ ] Acceptance date known
[ ] Allotment $ known (from letter, not guessed)
[ ] Complete system cost known
[ ] Residual $ = max(allotment - system, 0)
[ ] Residual list version loaded
[ ] Each shopping item checked
[ ] 90-day / 12-month dates computed
[ ] Draft residual request email offered
```

---

## Related

- `playbooks/PB05_residual.md`  
- `comms/EMAIL_TEMPLATES.md` T-05, T-06  
- `knowledge/source_extracts/Chap-3_Residual Funding_Doc.md`  
