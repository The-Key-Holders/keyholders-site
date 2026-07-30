# Extra knowledge for Advisor agents

Bundled markdown retrieved at chat time by `lib/advisor-ai/retrieve.ts`.

| Folder | Source | Purpose |
|--------|--------|---------|
| `ca_911_advisor_agent/` | `C:\Users\javad\Projects\CA_911_Advisor_Agent` | Full Advisor Co-Pilot pack: agent instructions, playbooks PB01–PB12, knowledge digests, decision trees, source extracts, eval, comms |

Also loaded (when present):

- `../manual-md/` — Operations Manual chapter extracts
- Live laptop path `Projects\CA_911_Advisor_Agent` (dev only)

Re-ingest:

```powershell
.\scripts\ingest-ca911-advisor-knowledge.ps1
```

**Policy:** Live Cal OES Operations Manual and Branch forms supersede any training extract if they conflict.
