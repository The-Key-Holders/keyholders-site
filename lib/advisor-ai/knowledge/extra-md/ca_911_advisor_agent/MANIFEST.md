# Project manifest

**Project root:** `C:\Users\javad\Projects\CA_911_Advisor_Agent` 
**Format:** Markdown only (agent instructions + knowledge base + design) 
**Removed:** `CA_911_Advisor_Agent_Complete_v2_compact.md` (character-capped extract; superseded by full KB)

---

## What this project is

A complete, Markdown-native system for building the **CA 9-1-1 Advisor Co-Pilot**:

1. **Design** - vision, duties, workflows, tools, comms, corpus, guardrails 
2. **Agent instructions** - system prompt, modes, response format, tool contracts 
3. **Knowledge base** - curated playbooks, forms, residual, FOR, glossary, chapter digests 
4. **Decision trees** - Quick Reference Aids (copied) 
5. **Source extracts** - curated training copies from F: User Manual extracts 
6. **Playbooks PB01–PB12** - executable procedures 
7. **Comms** - email templates, scripts, working log 
8. **Eval** - golden cases + refusal tests 
9. **Build** - phases, metrics, stack notes 

---

## Runtime composition (minimum)

```text
agent/SYSTEM_PROMPT.md
+ agent/GUARDRAILS.md
+ agent/MODES.md
+ agent/RESPONSE_FORMAT.md
+ knowledge/glossary.md
+ knowledge/forms_catalog.md
+ knowledge/funding_playbook.md
+ knowledge/residual_playbook.md
+ retrieve(knowledge/**) as needed
```

See `agent/LOAD_ORDER.md`.

---

## Design documents (long-form)

| File | Role |
|------|------|
| `CA_911_Advisor_Agent_Complete.md` | Combined design pack |
| `01_AGENT_VISION.md` … `07_GUARDRAILS_AND_SUCCESS.md` | Section sources |
| `README.md` | Hub |

---

## Policy disclaimer

Internal agent construction materials. Not official Cal OES policy. Live Operations Manual and Branch forms control.
