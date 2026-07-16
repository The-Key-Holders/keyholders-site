# MCP Preflight Status — CA 9-1-1 Advisor AI

**Updated:** 2026-07-16

## Doctor results (key free servers)

| Server | Status |
|--------|--------|
| markitdown | Healthy |
| chroma | Healthy |
| **qdrant** | **Healthy** (fixed — dedicated path) |
| context7 | Healthy |
| filesystem / filesystem-advisor | Healthy |
| playwright, github, vercel | Healthy |

### Qdrant fix

**Problem:** `Storage folder ...\qdrant is already accessed by another instance`

**Fix:** Point `QDRANT_LOCAL_PATH` to a dedicated directory:

```toml
# ~/.grok/config.toml
[mcp_servers.qdrant.env]
QDRANT_LOCAL_PATH = 'C:\\Users\\javad\\.grok\\data\\qdrant-advisor-ai'
COLLECTION_NAME = "advisor-docs"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
```

Kill any leftover `mcp-server-qdrant` processes before re-seeding.

## Manual PDF → markdown corpus

**Source:** `CalOES_ITA_NewHire_Kit_2026\operations_manual_export\*.pdf`  
**Converted:** 14/14 via `markitdown` (Python)

**Outputs:**
- `lib/advisor-ai/knowledge/manual-md/*.md` (in repo for keyword RAG)
- `%USERPROFILE%\.grok\data\advisor-ai\manual-md\` (mirror)

Also includes `chapter-iii-funding-reference.md` from kit `reference/`.

## Qdrant seed

```bat
cd C:\Users\javad\projects\keyholders-site
python scripts\seed_advisor_qdrant.py
```

**Result:** collection `advisor-docs` · **280 points** (fastembed MiniLM)

## Runtime retrieval in the app

`lib/advisor-ai/retrieve.ts` — keyword top-k over `manual-md` injected as **Retrieved Manual context**.  
Qdrant/chroma are ready for future MCP-assisted indexing and optional semantic upgrade.

## Plan reference

`docs/CA_911_ADVISOR_AI_PLAN.md`
