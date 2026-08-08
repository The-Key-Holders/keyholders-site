# Guest Hub delivery gate (mandatory)

Before claiming Guest Hub / party work complete:

1. Unit: `npm run test:unit:content`
2. Live verify: `npm run test:verify:content:prod`
3. E2E: `PLAYWRIGHT_BASE_URL=https://www.thekeyholders.org npm run test:e2e:content`
4. If any fail: fix, redeploy, re-run 1-3 until green
5. Logs: `.artifacts/logs/run-*.jsonl`, `LAST_CONTENT_VERIFY.json`, `LAST_ERROR.json`

Content packs are versioned (`SHIPPED_CONTENT_PACK_VERSION` in `lib/party-content.ts`). Bump version when shipping new questions. Guest `/api/content/trivia` and `/api/content/he-said` always serve shipped packs.