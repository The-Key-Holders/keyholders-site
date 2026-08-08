# Guest Hub — user processes (source of truth)

Live base: `https://www.thekeyholders.org/celebrate/`  
Content pack: **v4** (`guest-hub-questions-v4-20260808`)

## Guest journeys

### 1) Join
1. Open hub → **Join** (`join.html`)
2. Enter first + last name
3. Profile stored (`dj_party_profile_v1`); unlocks games

### 2) Trivia
1. Open `trivia.html` (requires join)
2. Pack badge must show **v4** and **12 questions**
3. Start → answer all → score posts to leaderboard
4. Must include: first move, sister roast; must **not** include basic ops filler (food energy, freeze time, city)

### 3) He / She Said
1. Open `he-said.html`
2. Pack badge v4 · 12 questions
3. Answer “who is more…” → score posts

### 4) Co-Mingle
1. Open `comingle.html`
2. Complete quests (Chad, cupcakes, homelab defaults)
3. Submit answers for points

### 5) Live Photo Wall
1. Open `photowall.html`
2. See stock photos (17 seeds) + guest uploads
3. Upload photo (auto-compress) + optional wish

### 6) Stations / poses / rings / guestbook / passport
1. Station riddles → check-in
2. Pose spinner
3. Ring hunt stamp
4. Guestbook stamp
5. Passport progress

### 7) Leaderboard
1. Open `leaderboard.html`
2. Best scores per game roll up (in-memory multiplayer; multi-instance may lag)

### 8) Hidden memories (QR only)
1. Scan printed QR → `hiddenmemory{1-9}.html`
2. Photo from durable HTTPS asset + “Did you know?” caption
3. Not linked from guest nav

### 9) Live board (host TV)
1. Open `screen.html` on projector
2. Rotates QR, leaderboard, photos, songs, winner

## Host journeys

### Host desk
1. `host.html` unlock (`dj-host-2026` default)
2. Prize enable/text, content CSV, memories, scoring freeze
3. **Guests always receive shipped trivia/he-said packs (v4+)**; host CSV cannot shadow guests unless pack version is raised above shipped

### Print QRs
1. `print/qrs.html` with base `https://www.thekeyholders.org/celebrate/`
2. Includes photo wall, games, memories

## Mission Control tiles
Primary section: **Guest Hub (party · TKH live)**  
Photo wall tile: `…/celebrate/photowall.html`

## Verify before claiming done
```bash
npm run test:unit:content
npm run test:unit:memories
node scripts/verify-guest-hub-full.cjs https://www.thekeyholders.org
PLAYWRIGHT_BASE_URL=https://www.thekeyholders.org npm run test:e2e:content
```

Logs: `.artifacts/logs/run-*.jsonl`, `LAST_GUEST_HUB_VERIFY.json`, `LAST_ERROR.json`
