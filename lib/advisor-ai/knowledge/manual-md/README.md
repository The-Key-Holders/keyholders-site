# Manual markdown corpus (RAG)

Converted from Cal OES CA 9-1-1 Operations Manual PDFs under the New Hire kit  
`operations_manual_export/` via **markitdown** (free, local).

Used by `lib/advisor-ai/retrieve.ts` for keyword retrieval injected as  
**Retrieved Manual context** into CA 9-1-1 Advisor AI (in addition to the full system prompt).

Regenerate after Manual updates:

```powershell
python -c "from pathlib import Path; from markitdown import MarkItDown; ..."
# or re-run the conversion step from the Advisor AI setup session
```

Do not store confidential PSAP data here — policy/Manual text only.
