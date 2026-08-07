# Guest Hub party freeze — v1.0.0

**Created (UTC):** 20260807T155706Z  
**Git tag:** party-guest-hub-v1.0.0-20260807  
**Commit (keyholders-site):** d88f5bd694a50cd5352ea09cf45f6572278e4472  
**Remotes:** origin (CupofJavad) + tkh (The-Key-Holders) `master` / `main`

## Production URLs (cellular)

| Role | URL |
|------|-----|
| Guest hub | https://www.thekeyholders.org/celebrate/index.html |
| Join | https://www.thekeyholders.org/celebrate/join.html |
| Host desk | https://www.thekeyholders.org/celebrate/host.html |
| Print QR pack | https://www.thekeyholders.org/celebrate/print/qrs.html |
| Screen / projector | https://www.thekeyholders.org/celebrate/screen.html |
| API health | https://www.thekeyholders.org/api/health |

**QR base (must stay public):** `https://www.thekeyholders.org/celebrate/`

## Host

- Default password env: `PARTY_HOST_PASSWORD` (fallback `dj-host-2026` — change before party if still default)
- CSV editors: trivia, he/she, poses, co-mingle
- Scoring freeze: auto deadline 2026-08-08 16:30 America/Los_Angeles (or host force open/frozen)

## LAN Docker (optional durable SQLite)

- Path: `C:\Users\javad\engagement-party-tech-kit`
- Web: http://192.168.8.201:8088/ host: http://192.168.8.201:8088/host.html
- API: http://192.168.8.201:8089/api/health
- Snapshot zip: `.artifacts/releases/guest-hub-party-v1.0.0-20260807T155706Z-kit.zip`
- SHA256: 148FDF1824740759CA644025B01ED3469172891A4167297A56199544724AA970

## Live check at freeze

- health note: cellular-ready best-effort
- co-mingle prompts in config: 3
- Playwright (TKH): 5 passed, 2 skipped (Docker-only)

## Mission Control

- http://192.168.8.61:4000/ section Guest Hub (party)
- conf: mini_GMKtec_server/compose/ops/dashy/conf.yml

## Restore notes

1. Checkout tag `party-guest-hub-v1.0.0-20260807` on keyholders-site and redeploy Vercel production.
2. Or unpack kit zip and `docker compose up -d --build` from engagement-party-tech-kit.
