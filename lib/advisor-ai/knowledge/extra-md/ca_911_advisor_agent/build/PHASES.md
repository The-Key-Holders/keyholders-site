# Implementation phases

Markdown-first project; code lives in product repo (e.g. keyholders-site Advisor Tools) when you implement.

| Phase | Deliverable | Exit |
|-------|-------------|------|
| **0** | This Markdown project complete | Folder usable as knowledge + prompt pack |
| **1** | Wire `agent/SYSTEM_PROMPT.md` + guardrails into chat API | Gated chat answers with citations |
| **2** | `check_package` + residual clock tools | Structured PASS/FAIL + clocks |
| **3** | Calculator integration / estimate brief | Disclaimer-locked estimates |
| **4** | FOR prep generator + email templates | Work products |
| **5** | Advisor lookup from assignment workbook | Routing |
| **6** | RAG over `knowledge/**/*.md` (+ optional Manual PDF→MD) | Higher fidelity |
| **7** | Eval harness on `eval/GOLDEN_CASES.md` | Score ≥ threshold |
| **8** | Production gated UI + optional PSAP restricted mode | Live co-pilot |

## Do not

- Merge missions with New Hire Help Agent (cross-link only)  
- Deploy unauthenticated full Advisor Desk tools  
- Treat training extracts as higher priority than live Manual  
