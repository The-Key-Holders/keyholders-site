# CA 9-1-1 Advisor Agent - Full Markdown Project

**Product:** CA 9-1-1 Advisor Co-Pilot (PSAP Funding + Compliance Assistant) 
**Purpose:** Everything needed to build the most valuable real-world Advisor agent, **entirely in Markdown**: design, system instructions, knowledge base, playbooks, comms templates, eval cases, and build phases. 
**Policy of record:** Live [CA 9-1-1 Operations Manual](https://www.caloes.ca.gov/911) and current Branch forms supersede any training extract here if they conflict.

---

## Start here

| If you need… | Open |
|--------------|------|
| **Agent system instructions (load first)** | [`agent/SYSTEM_PROMPT.md`](agent/SYSTEM_PROMPT.md) |
| Behavior / safety rules | [`agent/GUARDRAILS.md`](agent/GUARDRAILS.md) |
| Modes (Advisor / PSAP / Training) | [`agent/MODES.md`](agent/MODES.md) |
| Response format | [`agent/RESPONSE_FORMAT.md`](agent/RESPONSE_FORMAT.md) |
| Tool contracts | [`agent/TOOL_CONTRACTS.md`](agent/TOOL_CONTRACTS.md) |
| Knowledge index | [`knowledge/INDEX.md`](knowledge/INDEX.md) |
| Full design narrative (combined) | [`CA_911_Advisor_Agent_Complete.md`](CA_911_Advisor_Agent_Complete.md) |
| Build / implement phases | [`build/PHASES.md`](build/PHASES.md) |
| Eval / golden cases | [`eval/GOLDEN_CASES.md`](eval/GOLDEN_CASES.md) |

---

## Directory map

```text
CA_911_Advisor_Agent/
├── README.md ← this hub
├── CA_911_Advisor_Agent_Complete.md ← combined long-form design pack
├── 01_AGENT_VISION.md … 07_*.md ← design sections (source of complete.md)
├── agent/ ← runtime instructions for the LLM agent
│ ├── SYSTEM_PROMPT.md
│ ├── GUARDRAILS.md
│ ├── MODES.md
│ ├── RESPONSE_FORMAT.md
│ ├── TOOL_CONTRACTS.md
│ └── LOAD_ORDER.md
├── knowledge/ ← domain knowledge base (RAG + static)
│ ├── INDEX.md
│ ├── glossary.md
│ ├── forms_catalog.md
│ ├── funding_playbook.md
│ ├── residual_playbook.md
│ ├── for_playbook.md
│ ├── allotment_and_calculator.md
│ ├── top15_questions.md
│ ├── standards_and_performance.md
│ ├── stakeholders_and_escalation.md
│ ├── context_2026.md
│ ├── corpus_map.md
│ ├── chapters/ ← Operations Manual chapter digests
│ ├── decision_trees/ ← Quick Reference Aids (copied + curated)
│ └── source_extracts/ ← curated training extracts from F:
├── playbooks/ ← step procedures PB01–PB12
├── comms/ ← email/scripts/working-log templates
├── eval/ ← golden Q&A and refusal tests
└── build/ ← implementation phases, metrics, stack notes
```

---

## How to compose the agent at runtime

1. Load [`agent/LOAD_ORDER.md`](agent/LOAD_ORDER.md) sequence into system context. 
2. Attach or retrieve from `knowledge/` (prefer chapter digests + playbooks + forms). 
3. Route user intent to a `playbooks/PB*.md` procedure. 
4. Emit work products per [`agent/RESPONSE_FORMAT.md`](agent/RESPONSE_FORMAT.md). 
5. Never violate [`agent/GUARDRAILS.md`](agent/GUARDRAILS.md).

---

## Grounding sources (read-only on F:)

Primary training and policy corpus used to build this pack:

- `F:\operations_manual_export\`
- `F:\Advisor_User_Manual\`
- `F:\Advisor_Docs\`
- `F:\CPE_Funding_Fixed_Allotment_Calculator\`

See [`knowledge/corpus_map.md`](knowledge/corpus_map.md) for safe-use rules (no bulk Outlook/PII).

---

## Disclaimer

Internal design and training materials for agent construction. **Not** legal advice. **Not** official Cal OES policy. **Not** a substitute for Branch-issued allotment letters, TD-288s, or live Manual text.
