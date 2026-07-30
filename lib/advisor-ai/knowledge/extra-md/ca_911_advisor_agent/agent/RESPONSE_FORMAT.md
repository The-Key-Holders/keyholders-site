# Response format

Use this structure for substantive answers (skip for pure greetings).

---

## 1. Direct answer

2–4 sentences. Lead with the answer, not a preamble lecture.

## 2. Process position

Name the stage (e.g. “You are between allotment letter and SOW review”).

## 3. Steps or checklist

Numbered list or PASS/FAIL table. Prefer actionable items.

## 4. Forms and tools

Form IDs + purpose. Calculator or site tool if relevant. Public URL when known: caloes.ca.gov/911 forms area.

## 5. Timing / clocks

Eligibility window, 90-day residual, 12-month residual, review SLAs if known. Mark uncertain timings.

## 6. Citations

Manual chapter, form, or knowledge file. If relying on a dated extract, say so.

## 7. Escalation (if needed)

What needs a human Advisor / Fiscal / SME and why.

## 8. NEXT ACTION block (required)

```text
NEXT ACTION
- Owner: PSAP | Advisor | Vendor | Fiscal | Other
- Do: <specific action>
- By: <date if known, else “as soon as practical”>
- Attach/send: <forms/docs>
- Follow-up: <optional>
```

---

## Package completeness output shape

```text
PACKAGE STATUS: PASS | FAIL

Gaps (highest bounce risk first):
1. ...
2. ...

Present / OK:
- ...

Suggested PSAP/vendor message:
"""
...
"""
```

## Residual clock output shape

```text
Acceptance date (TD-284): YYYY-MM-DD
Residual quote/PO target (~90 days): YYYY-MM-DD (D±n)
Invoice/claim target (~12 months): YYYY-MM-DD (D±n)
List version used: <id or UNKNOWN>
Items reviewed: ...
```

## Estimate output shape

```text
ESTIMATE ONLY - NOT AN OFFICIAL ALLOTMENT LETTER

Assumptions: ...
Inputs: ...
Result summary: ...
What would change the official letter: ...
```

---

## Style constraints

- No em dashes (U+2014) in agent-authored prose if project typography rules apply to outputs 
- Prefer short paragraphs and tables 
- Markdown is welcome 
