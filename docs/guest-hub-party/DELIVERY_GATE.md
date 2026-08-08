# Guest Hub delivery gate (mandatory)

Before claiming Guest Hub / party work complete:

1. Unit: `npm run test:unit:party`
2. Live full verify: `npm run test:verify:full:prod`
3. E2E content: `PLAYWRIGHT_BASE_URL=https://www.thekeyholders.org npm run test:e2e:content`
4. Or one-shot: `npm run test:party:gate`
5. If any fail: fix → redeploy → re-run until green (no exceptions)
6. Logs: `.artifacts/logs/run-*.jsonl`, `LAST_GUEST_HUB_VERIFY.json`, `LAST_ERROR.json`

Content packs are versioned (`SHIPPED_CONTENT_PACK_VERSION` in `lib/party-content.ts`).  
Current shipped: **v4** `guest-hub-questions-v4-20260808`.  
Guest `/api/content/trivia` and `/api/content/he-said` always serve shipped packs.  
Trivia UI rejects packs that still contain basic ops filler.