# Advisor agents knowledge corpus

**Updated:** 2026-07-30  
**Scope:** Password-gated Help Agent + CA 9-1-1 Advisor AI only (no public site changes).

## Bundled sources

| Path | Role |
|------|------|
| `lib/advisor-ai/knowledge/manual-md/` | Operations Manual chapter extracts |
| `lib/advisor-ai/knowledge/extra-md/ca_911_advisor_agent/` | Full pack from `C:\Users\javad\Projects\CA_911_Advisor_Agent` (playbooks PB01–PB12, decision trees, forms/residual/FOR digests, source extracts, agent instructions) |

## Shared retrieval

- Module: `lib/advisor-ai/retrieve.ts`
- Used by:
  - `POST /api/advisor-tools/agent-chat` (Advisor Desk + Tools Help)
  - `POST /api/advisor-tools/advisor-ai/chat` (CA 9-1-1 Advisor AI)
- Keyword chunk retrieval with path-aware boosts; Manual paths slightly preferred for policy wording.

## Re-ingest (laptop)

```powershell
cd C:\Users\javad\Projects\keyholders-site
.\scripts\ingest-ca911-advisor-knowledge.ps1
npx vitest run lib/advisor-ai/advisor-ai.test.ts
```

## Policy

Live Cal OES Operations Manual and Branch forms supersede any training extract if they conflict. Training extracts may be dated; agents should flag possible staleness.

## Pre-change backup

See `C:\Users\javad\Backups\site_snapshots\keyholders-site-prod-20260730T123027Z` and `BACKUP_MANIFEST.json` (local only; do not treat as app source).
