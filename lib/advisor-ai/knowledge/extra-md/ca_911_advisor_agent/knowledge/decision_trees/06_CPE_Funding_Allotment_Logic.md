# 06 · CPE Funding Allotment Logic (by Call Volume Tier)

**Aid type:** Table · **Priority:** Supporting · **Use:** Explain how allotments are calculated

> **Policy of record:** Live CA 9-1-1 Operations Manual, current forms, and allotment matrices on [caloes.ca.gov/911](https://www.caloes.ca.gov/911) supersede this aid if they differ. Use as an internal Advisor quick-reference only.

## Core policy idea
Allotments are designed to fund a **standard 9-1-1 system** sized so the PSAP can answer at approximately **P.01 grade of service** (no more than 1 busy per 100 attempts in a normal busy hour), using **measured ECaTS call volume** and **median/max MPA pricing** concepts.

## Funding levels (Chapter III provisioning policy)

| Level | Typical busy-month answered volume | How provisioning is determined |
|-------|------------------------------------|--------------------------------|
| **1** | — | **Sunset** (Feb 20, 2014) |
| **2** | **0 – 800** emergency calls/month | Typical busy **month** = average of **3 highest months** in prior **18 months**; may include documented non-pub 10-digit transfers |
| **3** | **801 – 1,200** / month | Same busy-month method as Level 2 |
| **4** | **1,201 – 15,000** / month | Typical busy **hour** method; may include up to **20% abandoned**; top busy hours rules apply |
| **5** | **> 15,000** / month | Higher-volume hour-based methods (see current Ops Manual / calculator) |

## Busy-hour formula (Level 4 excerpt)
`E = [(N × 2) × (T + 60 seconds)] / 3600`  
Then map Erlangs → positions via **Erlang B, P=0.01**.

| Symbol | Meaning |
|--------|---------|
| E | Estimated busy-hour load (Erlangs) |
| N | Avg calls in selected top busy hours (+ abandoned allowance) |
| ×2 | Accounts for emergency 10-digit transfer traffic (per policy formula) |
| T | Average call duration (seconds) |
| +60 | Wrap-up time per call |
| /3600 | Seconds per hour |

## Dollar allotment
Positions/funding level × **standard system** elements on MPA → **fixed allotment eligibility**.  
**Official $ amount** is issued in the Branch letter—tools only estimate.

## Advisor checklist before quoting a number
- [ ] ECaTS connected / data recent  
- [ ] Disaster/spike hours excluded per policy  
- [ ] Correct funding level auto-detect or forced with justification  
- [ ] Current MPA price sheets used for estimates  
- [ ] Disclaimer: estimate ≠ commitment  

## Related aids
04 Flowchart · 07 Checklist · calculator on USB: `D:\CPE_Funding_Fixed_Allotment_Calculator`

---
*CA 9-1-1 Branch Advisor Quick Reference Kit · Internal training aid · Not official policy*
