# Guest Hub party freeze — v1.1.0

**Created (UTC):** 20260807T181405Z  
**Git tag:** party-guest-hub-v1.1.0-20260807  
**Commit (keyholders-site):** 0ce61fb64413721068b80bb9e5911a42e1a83551  
**Remotes:** origin (CupofJavad) + tkh (The-Key-Holders) `master` / `main` / `feat/ca-911-advisor-ai`

## Why v1.1.0 (since v1.0.0)

- Prize: leaderboard/API hydrate from host desk; enable/disable toggle verified; removed host-only prank prize field
- Hidden memories 1–10: QR-only pages, host-managed title/caption/photo (https URL preferred + compressed upload)
- Memory public page uses `imageUrl || imageDataUrl` with load error fallback
- Host desk browser backup of host state on save (helps after Vercel cold start)
- Full E2E: `e2e/guest-hub-host-full.spec.ts` + `e2e/guest-hub.spec.ts` — last run **14 passed / 2 skipped** on production TKH

## Production URLs (cellular)

| Role | URL |
|------|-----|
| Guest hub | https://www.thekeyholders.org/celebrate/index.html |
| Join | https://www.thekeyholders.org/celebrate/join.html |
| Host desk | https://www.thekeyholders.org/celebrate/host.html |
| Print QR pack | https://www.thekeyholders.org/celebrate/print/qrs.html |
| Screen | https://www.thekeyholders.org/celebrate/screen.html |
| Memory N | https://www.thekeyholders.org/celebrate/hiddenmemoryN.html (1–10) |
| API health | https://www.thekeyholders.org/api/health |

**QR base:** `https://www.thekeyholders.org/celebrate/`

## Host notes (resume checklist)

1. Hard-refresh Host desk and unlock (default password `dj-host-2026` unless `PARTY_HOST_PASSWORD` set).
2. Re-save **prize** once (restores browser backup + server memory).
3. Re-save **memories** if photos missing after idle (prefer https image URLs).
4. Print QR pack from TKH print page (not localhost).
5. Optional LAN Docker: `C:\Users\javad\engagement-party-tech-kit` → `docker compose up -d` → http://192.168.8.201:8088/

## Live snapshot at freeze

- health note: cellular-ready best-effort
- prize: Gift Card / enabled=true (host may have changed later)
- comingle prompts: 3

## Kit zip

- Path: `.artifacts/releases/guest-hub-party-v1.1.0-20260807T181405Z-kit.zip`
- SHA256: 86666E33815DEBDE34F97F68BF03A4F68EB1D85B1C90E2ADF7061B24B89407B4
- Pointer: `.artifacts/CURRENT-guest-hub-zip`

## Restore code

```bash
cd keyholders-site
git fetch --tags
git checkout party-guest-hub-v1.1.0-20260807
# redeploy Vercel production for The-Key-Holders/keyholders-site master
```

## E2E re-run

```powershell
cd C:\Users\javad\Projects\keyholders-site
$env:PLAYWRIGHT_BASE_URL = "https://www.thekeyholders.org"
npx playwright test e2e/guest-hub-host-full.spec.ts e2e/guest-hub.spec.ts --project=chromium
```
