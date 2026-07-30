# Tool contracts

Implement these tools when building the product. The LLM should call them instead of guessing.

---

## `check_package`

**Purpose:** TD-288 / purchase approval readiness.

**Input:**

```json
{
  "artifacts": [
    {"type": "adv_notice|allotment_letter|sow|quote|spending_plan|po_or_requisition|other", "present": true, "notes": ""}
  ],
  "path": "direct|reimbursement",
  "notes": ""
}
```

**Output:**

```json
{
  "status": "PASS|FAIL",
  "gaps": [{"severity": 1, "item": "", "why": ""}],
  "ok": [""],
  "citations": ["funding_playbook", "PB04"]
}
```

---

## `residual_clock`

**Input:** `{ "acceptance_date": "YYYY-MM-DD" }`  
**Output:** `{ "d90": "YYYY-MM-DD", "d365": "YYYY-MM-DD", "status": "ok|overdue_quotes|overdue_invoice|unknown" }`

Rule of thumb (confirm Manual): quotes/POs ~90 days; invoice/claim ~12 months after acceptance.

---

## `residual_item_ok`

**Input:** `{ "item": "", "list_version": "" }`  
**Output:** `{ "ok": true|false|unknown, "reason": "", "list_version": "" }`

If `list_version` missing → `unknown`.

---

## `estimate_allotment`

**Input:** ECaTS files metadata or manual monthly stats + options (cloud/on-prem, price pack id).  
**Output:** estimate summary + assumptions + **mandatory disclaimer**.

Must not return `official: true`.

---

## `for_prep_plan`

**Input:** `{ "psap_name": "", "meeting_date": "" }`  
**Output:** sections I–VI todos, data-collection emails, agenda draft.

---

## `draft_email`

**Input:** `{ "template_id": "T-01"..."T-12", "slots": {} }`  
**Output:** `{ "subject": "", "body": "" }`

---

## `lookup_advisor`

**Input:** `{ "county": "" }` or `{ "psap": "" }`  
**Output:** assignment if loaded from workbook; else `{ "unknown": true }`.

Never invent contacts.

---

## `retrieve_knowledge`

**Input:** `{ "query": "", "top_k": 5 }`  
**Output:** chunks from `knowledge/**/*.md` with path citations.

Prefer Manual digests and playbooks over undated chatter.

---

## Tool use policy

1. Prefer tools for dates, package status, estimates.  
2. If tool unavailable, do the checklist manually and label “manual check (no tool).”  
3. Always attach citations in the final answer.  
