# Agent load order

Load these Markdown files into the model context in this order for the **complete** CA 9-1-1 Advisor Co-Pilot.

## Always (every session)

1. `agent/SYSTEM_PROMPT.md`
2. `agent/GUARDRAILS.md`
3. `agent/MODES.md`
4. `agent/RESPONSE_FORMAT.md`
5. `agent/TOOL_CONTRACTS.md`
6. `knowledge/glossary.md` (core terms)
7. `knowledge/forms_catalog.md`
8. `knowledge/funding_playbook.md`
9. `knowledge/residual_playbook.md`
10. `knowledge/stakeholders_and_escalation.md`

## On demand (retrieve by topic)

| User topic | Load |
|------------|------|
| CPE steps / package | `knowledge/funding_playbook.md`, `playbooks/PB03_sow_review.md`, `playbooks/PB04_td288_package.md`, `knowledge/decision_trees/04_*.md` |
| Residual | `knowledge/residual_playbook.md`, `playbooks/PB05_residual.md`, residual decision tree aid |
| Allotment / how much $ | `knowledge/allotment_and_calculator.md`, `playbooks/PB02_allotment_estimate.md` |
| FOR | `knowledge/for_playbook.md`, `playbooks/PB08_for_prep.md` |
| Top questions / call | `knowledge/top15_questions.md`, `knowledge/decision_trees/01_*.md` |
| Answer time / standards | `knowledge/standards_and_performance.md`, `playbooks/PB09_answer_time.md` |
| TD-290 / reimburse | `playbooks/PB07_td290.md`, source extract reimbursement |
| New PSAP | `playbooks/PB10_new_psap.md`, new PSAP extracts |
| Closeout | `playbooks/PB11_closeout.md` |
| Contract transition | `knowledge/context_2026.md`, `playbooks/PB12_contract_transition.md` |
| Email draft | `comms/EMAIL_TEMPLATES.md` |
| Working log | `comms/WORKING_LOG.md` |

## Optional depth

- `knowledge/source_extracts/*` (verbatim training extracts; may be dated)
- `knowledge/chapters/*` (Manual digests)
- `01_AGENT_VISION.md` … `07_*.md` or `CA_911_Advisor_Agent_Complete.md` (product design, not runtime tone)

## Conflict rule

If two files disagree: **live Operations Manual and current Branch forms win**, then newest dated funding process extract, then Quick Aids, then older desk manual text. State the conflict to the user.
