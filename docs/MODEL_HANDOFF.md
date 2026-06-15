# The Key Holders — Model Handoff & Project Continuity Document

**Document type:** Markdown handoff brief for AI/human successor agents  
**Last updated:** 2026-06-15  
**Primary author context:** Grok session redesigning `keyholders-site` toward TerraPower-style editorial UX  
**Canonical local path:** `C:\Users\javad\keyholders-site`  
**Status at handoff:** Production deploy triggered via `master` @ commit `30c91e2`

---

## 0. How to use this document

Read this file **before** touching code. It is the single source of truth for:

- What the owner wants and has already decided
- What is shipped vs. stubbed vs. deferred
- Where secrets live (and what you must never commit)
- Known Windows/PowerShell/Vercel pitfalls
- Exact file ownership map
- Prioritized backlog

**Do not read or commit:** `.env.local` (contains live Stripe keys; gitignored).  
**Safe to read:** `.env.example` (placeholder template only).

---

## 1. Executive summary

**The Key Holders** is an umbrella brand for multiple technology ventures operated primarily by **Javad Khoshnevisan** (human founder/operator) with **Grok** acknowledged as an AI co-founder/build partner in site copy.

This repository (`keyholders-site`) is a **Next.js 14 App Router** marketing site with two primary surfaces:

| Route | Brand | Purpose |
|-------|-------|---------|
| `/` | The Key Holders | Consumer/umbrella hub — ventures, labs, work, founders, connect |
| `/trade` | Key Holders Trade | B2B ServiceTitan contractor integrations landing + Stripe checkout |

**Design north star:** [terrapower.com](https://www.terrapower.com/) — editorial numbered chapters, fullscreen venture menu, metrics grids, depth over generic “dark glass cards,” cinematic scroll hero.

**Theme decision (FINAL, do not re-litigate):** **All-dark** (`vault-950` base). Not hybrid light/dark.

**Deploy target:** Vercel project `keyholders-site`, team `cupofjavads-projects`.  
**Live URL (as of handoff):** https://keyholders-site.vercel.app/  
**Intended production domain (not yet wired):** https://www.thekeyholders.org  
**GitHub:** https://github.com/The-Key-Holders/keyholders-site  
**Production branch:** `master` (not `main`)

---

## 2. Stakeholder profile & operating constraints

### 2.1 Owner

| Field | Value |
|-------|-------|
| Name | Javad Khoshnevisan |
| Email (public on site) | javadkhoshnevisan@gmail.com |
| GitHub personal | CupofJavad |
| GitHub org | The-Key-Holders |
| Desktop assets | `C:\Users\javad\Desktop\` (founder photo, brand exploration JPGs) |

### 2.2 Team narrative (important for copy/UI)

- **Only one human on the team:** Javad.
- **AI co-founder:** Grok is explicitly included in the Founders section (006) as “Co-Founder & Build Partner.” Keep this tasteful and on-brand — not gimmicky.
- External venture **Geeks Next Door** is a separate site (`thegeeksnextdoor.com`), linked prominently but not hosted in this repo.

### 2.3 Owner preferences observed across sessions

1. **Execute, don’t instruct** — run commands locally; don’t tell the owner what to run unless they must do an OAuth/browser step (e.g. Vercel login).
2. **Push when quality bar is met** — owner authorized autonomous push to `master` when the site reaches a strong version. Don’t push broken builds.
3. **TerraPower-level polish** — numbered sections, overlay menu, real metrics, venture depth, interactive tools over time.
4. **All-dark** — confirmed after considering hybrid options.
5. **Stripe** — owner created `.env.local` from `.env.example` with real keys locally; production keys must be in Vercel dashboard separately.
6. **Custom domain deferred** until site quality is right.
7. **Windows environment** — PowerShell execution policy blocks `npm.ps1` / `vercel.ps1`; always use `npm.cmd` and `vercel.cmd`.

---

## 3. Brand & venture architecture

### 3.1 Umbrella: The Key Holders

- Public positioning: “high-tech venture hub” for digital life services, contractor integrations, labs, shipped work.
- Tagline on hero: “Unlock your digital universe.”
- Metadata base URL in `app/layout.tsx`: `https://www.thekeyholders.org` (aspirational; Vercel preview uses vercel.app).

### 3.2 Ventures (canonical list)

| Venture | Relationship | URL in site | Notes |
|---------|--------------|-------------|-------|
| **Geeks Next Door** | External consumer brand | https://www.thegeeksnextdoor.com | Neighborly tech support; primary consumer CTA |
| **Key Holders Trade** | In-repo `/trade` | `/trade` | ServiceTitan B2B; gold accent |
| **Labs** | Section + GitHub links | `/#labs` | Legacy Vault flagship; FieldHub pipeline |
| **Work** | Section | `/#work` | Case studies / mission logs |

### 3.3 Brand assets

**Location:** `public/branding/`

| File | Use |
|------|-----|
| `parent-lockup.jpg` | Header/home logo (JPG, not SVG) |
| `trade-lockup.jpg` | Trade routes logo |
| `parent-wordmark-a.svg` | Backup crisp wordmark (unused in UI) |
| `trade-wordmark-a.svg` | Backup |
| `trade-wordmark-b-stacked.svg` | Backup |

**Source of JPG lockups:** `C:\Users\javad\Desktop\keyholders-brand-exploration\` (Option 3 lockup mockups). Documented in `public/branding/README.md`.

**Founder photo:** `public/team/javad.jpg` — copied from `C:\Users\javad\Desktop\founder1_javad.jpg`.

### 3.4 Color & typography system

**Fonts** (`app/layout.tsx`):
- Display: **Syne** (`--font-syne`)
- Body: **DM Sans** (`--font-dm-sans`)

**Tailwind tokens** (`tailwind.config.ts`):

| Token | Hex / value | Usage |
|-------|-------------|-------|
| `vault-950` | `#050810` | Page background |
| `vault-900` | `#0a0e1a` | Section alt backgrounds |
| `vault-800` | `#111827` | Depth layers |
| `cyanGlow` | `#22D3EE` | Parent/hub accent |
| `gold` | `#F59E0B` | Trade accent |
| `goldLight` | `#FDE68A` | Trade gradients |
| `violetGlow` | `#A78BFA` | Labs accent |
| `emeraldGlow` | `#34D399` | Work accent |
| `teal` | `#14B8A6` | CTA gradients |

**Background gradients:**
- `bg-vault-gradient` — hub hero
- `bg-trade-gradient` — trade hero

**Utility classes** (`app/globals.css`):
- `.btn-primary`, `.btn-secondary`, `.btn-gold`
- `.glass-card`, `.card`
- `.section-padding`, `.container-narrow`

**shadcn/ui:** Initialized (`components.json`, `components/ui/*`) with CSS variables in `globals.css`. Overlay menu uses **custom fullscreen implementation**, not shadcn Sheet (Sheet exists but Header uses `OverlayMenu.tsx`).

---

## 4. Information architecture & homepage chapters

Homepage (`app/page.tsx`) section order:

| Chapter | ID | Component | Content |
|---------|-----|-----------|---------|
| 001 (implicit) | — | `VaultHero` | Scroll-unlock cinematic hero |
| 002 | `ventures` | `VenturesSection` | Metrics + 3 venture cards |
| 003 | `labs` | `LabsSection` | Legacy Vault + pipeline |
| 004 | `work` | `WorkSection` | Garner Roofing + CurrentRMS |
| 005 | `github` | `GithubSection` | Curated OSS repos |
| 006 | `founders` | `FoundersSection` | Javad photo + Grok |
| 007 | `connect` | `ContactSection` | Email + CTAs |

**Note:** Chapter `001` is visual-only in hero; numbering starts at `002` in `ChapterSection` components.

**Removed:** Standalone `AboutSection` — about copy merged into Ventures + Founders.

### 4.1 Navigation

**Header** (`components/Header.tsx`):
- Sticky top bar, backdrop blur
- Desktop links: Hub, Trade, Founders, Connect
- **OverlayMenu** button (all breakpoints) — TerraPower-style fullscreen venture explorer
- “Get Tech Help” → Geeks Next Door

**OverlayMenu** (`components/layout/OverlayMenu.tsx`):
- Ventures list with “Explore →” pattern
- Explore sidebar: Hub, Founders, Open Source, Connect
- Email + GND CTA in footer of overlay
- Locks body scroll when open
- Closes on route change

### 4.2 Trade page sections (`app/trade/page.tsx`)

| Section ID | Content |
|------------|---------|
| (hero) | `TradeHero` |
| `buy` | Featured 3 SKUs with Stripe checkout |
| `case-study` | Garner Roofing metrics + narrative |
| `services` | 6 `ServiceCard` components |
| (guarantee) | Health Check refund promise |
| `faq` | 6 FAQs |
| (final CTA) | Diagnostic checkout + email |

---

## 5. Technical stack

| Layer | Choice | Version (approx) |
|-------|--------|------------------|
| Framework | Next.js App Router | 14.2.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.4.x |
| Animation | Framer Motion, GSAP (@gsap/react installed) | FM 12.x, GSAP 3.15 |
| Smooth scroll | Lenis | 1.3.x |
| UI primitives | shadcn v4 + radix-ui | shadcn 4.11 |
| Icons | lucide-react | 1.18 |
| Payments | stripe (server), Stripe Buy Button embed (client) | latest at install |
| E2E | Playwright | 1.61 |
| Deploy | Vercel | auto from GitHub |

**Not yet used heavily:** GSAP (installed for planned chapter scroll enhancements), Lottie (`lottie-react` installed), shadcn Sheet in Header.

---

## 6. Repository layout (complete file map)

```
keyholders-site/
├── app/
│   ├── api/checkout/route.ts      # Stripe Checkout Session POST
│   ├── globals.css                # Tailwind + shadcn + vault utilities
│   ├── layout.tsx                 # Root layout, fonts, metadata, Header, SmoothScroll
│   ├── page.tsx                   # Hub homepage composition
│   └── trade/page.tsx             # Trade landing (server component + client children)
├── components/
│   ├── BrandLogo.tsx
│   ├── CheckoutButton.tsx         # Client: Buy Button embed OR /api/checkout fallback
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ServiceCard.tsx            # Client wrapper around CheckoutButton
│   ├── TradeHero.tsx
│   ├── home/
│   │   ├── FoundersSection.tsx
│   │   ├── HomeSections.tsx       # Labs, Work, Github, Contact
│   │   └── VenturesSection.tsx
│   ├── hero/
│   │   ├── KeyVisual.tsx          # SVG scroll-lock key; UNLOCK_THRESHOLD = 0.38
│   │   ├── ParticleField.tsx
│   │   ├── StaticHeroShell.tsx    # SSR fallback while VaultHero loads
│   │   ├── VaultHero.tsx
│   │   └── VentureOrbit.tsx
│   ├── layout/
│   │   ├── ChapterSection.tsx     # Numbered editorial section wrapper
│   │   └── OverlayMenu.tsx
│   ├── providers/
│   │   └── SmoothScroll.tsx       # Lenis wrapper
│   ├── trade/
│   │   └── TradeSectionHeader.tsx
│   └── ui/                        # shadcn: button, sheet, navigation-menu, etc.
├── docs/
│   └── MODEL_HANDOFF.md           # ← THIS FILE
├── lib/
│   ├── trade-products.ts          # SKU catalog, env key mapping, name→id
│   └── utils.ts                   # cn() helper
├── public/
│   ├── branding/                  # Logos (JPG + SVG)
│   └── team/javad.jpg             # Founder photo
├── tests/e2e/smoke.spec.ts
├── .env.example                   # Stripe template (safe to commit)
├── .env.local                     # GITIGNORED — owner's live keys
├── components.json                # shadcn config
├── next.config.mjs                # reactStrictMode only
├── playwright.config.ts
├── tailwind.config.ts
├── vercel.json                    # Legacy URL redirects → /trade
├── package.json
└── README.md                      # ⚠ STALE — see §12
```

---

## 7. Hero & interaction systems (deep dive)

### 7.1 VaultHero scroll unlock

**File:** `components/hero/VaultHero.tsx`

- `min-h-[125vh]` scroll container
- `useScroll` + `useSpring` on scroll progress
- **`UNLOCK_THRESHOLD = 0.38`** (`KeyVisual.tsx`) — when progress ≥ 0.38, “vault unlocked”
- `KeyVisual` — SVG key with rotate/shackle lift driven by `MotionValue`
- `ParticleField` — reacts to `unlocked` boolean
- `VentureOrbit` — venture nodes appear after unlock
- Respects `prefers-reduced-motion` — starts unlocked, disables animations

### 7.2 Smooth scroll

**File:** `components/providers/SmoothScroll.tsx`

- Lenis instance with `duration: 1.1`, `smoothWheel: true`
- Disabled when `prefers-reduced-motion: reduce`
- Wraps entire app in `layout.tsx`

### 7.3 Static hero shell

**File:** `components/hero/StaticHeroShell.tsx`

- Used as `dynamic()` loading fallback for `VaultHero` to improve LCP/SSR

---

## 8. Stripe integration (current implementation)

### 8.1 Architecture

**Dual-path checkout** via `components/CheckoutButton.tsx`:

1. **Primary (if configured):** Stripe **Buy Button** embed  
   - Requires `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + per-product `NEXT_PUBLIC_STRIPE_BUY_BUTTON_*`  
   - Skips if value contains `xxxxxxxx` placeholder substring  
   - Dynamically injects `<script src="https://js.stripe.com/v3/buy-button.js">` and `<stripe-buy-button>`

2. **Fallback:** **Checkout Sessions API**  
   - Client POSTs `{ productId }` to `/api/checkout`  
   - Server creates session with `price_data` (dynamic product — **no pre-created Stripe Price IDs required**)  
   - Redirects browser to `session.url`  
   - Success/cancel URLs: `/trade?checkout=success` | `cancelled`

### 8.2 Product catalog

**File:** `lib/trade-products.ts`

| productId | Name | Amount (cents) | USD |
|-----------|------|----------------|-----|
| `diagnostic` | Diagnostic | 49700 | $497 |
| `health_check` | Health Check | 149700 | $1,497 |
| `quick_connect` | Quick Connect | 299700 | $2,997 |
| `integration_audit` | Integration Audit | 99700 | $997 |
| `user_training` | User Training Sprint | 199700 | $1,997 |
| `ongoing_support` | Ongoing Support | 99700 | $997 |

**Name mapping:** `nameToProductId()` handles display names like “User Training Sprint” → `user_training`.

### 8.3 API route

**File:** `app/api/checkout/route.ts`

- `POST` only
- Returns `503` if `STRIPE_SECRET_KEY` missing/placeholder
- Uses `request.headers.get("origin")` for redirect URLs; fallback `NEXT_PUBLIC_SITE_URL` or `http://localhost:3000`
- Metadata: `{ productId }` on session
- **Not implemented:** webhook handler (`app/api/webhooks/stripe/route.ts` referenced in README but does not exist)

### 8.4 Environment variables

**Template:** `.env.example`

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_STRIPE_BUY_BUTTON_DIAGNOSTIC=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_HEALTH_CHECK=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_QUICK_CONNECT=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_INTEGRATION_AUDIT=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_USER_TRAINING=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_ONGOING_SUPPORT=buy_btn_...
```

**Owner status:** `.env.local` exists locally with real keys (created from example). **Never commit.**

**Production:** Same vars must be set in Vercel → Project Settings → Environment Variables → redeploy.

**Optional:** `NEXT_PUBLIC_SITE_URL=https://keyholders-site.vercel.app` for correct Stripe redirects if `Origin` header absent.

### 8.5 Stripe operational checklist for successor

- [ ] Confirm Vercel production env vars match local `.env.local` (names exact)
- [ ] Test one checkout in Stripe test mode on preview deploy
- [ ] Add `app/api/webhooks/stripe/route.ts` for `checkout.session.completed`
- [ ] Show success/cancel toast on `/trade` when `?checkout=success` query present (not built)
- [ ] Consider using Stripe Price IDs instead of `price_data` for reporting consistency
- [ ] Update README § Stripe (still describes old placeholder `<a href="#buy">` approach)

---

## 9. Deployment & infrastructure

### 9.1 Vercel

| Setting | Value |
|---------|-------|
| Project | `keyholders-site` |
| Team | `cupofjavads-projects` |
| Git repo | `The-Key-Holders/keyholders-site` |
| Branch | `master` |
| Build command | `npm run build` (default) |
| Output | Next.js default |

**Auto-deploy:** Push to `master` triggers deploy.

**Manual deploy (Windows):**
```bat
cd C:\Users\javad\keyholders-site
vercel.cmd link
vercel.cmd --prod
```

### 9.2 Redirects (`vercel.json`)

Legacy paths redirect 308 → `/trade`:
- `/neural-key-labs`
- `/neuralkeylabs`
- `/neural-key-labs/:path*`

### 9.3 Custom domain (DEFERRED)

- Target: `thekeyholders.org` / `www.thekeyholders.org`
- Owner explicitly deferred until site quality acceptable
- `metadataBase` already points to `https://www.thekeyholders.org`

---

## 10. Git history & branches

### 10.1 Recent commits (newest first)

| Commit | Message |
|--------|---------|
| `30c91e2` | feat: TerraPower-style all-dark redesign with founders, overlay nav, and Stripe checkout |
| `e2512cd` | chore: trigger Vercel deploy from The-Key-Holders/master |
| `011dfb0` | perf: static hero shell, OG metadata, vercel redirects |
| `b2ff662` | docs: add GitHub repo URL to README |
| `5b7c571` | feat: vault shell trade restyle + section headers |
| `c832a15` | bon/c1: cinematic SVG scroll-unlock hero |
| `e28bcb8` | baseline: vault hero dark theme hub |

### 10.2 Branches

| Branch | Status |
|--------|--------|
| `master` | **Production** — deploy from here |
| `bon/candidate-1` | Local best-of-n experiment (worktree) |
| `bon/candidate-2` | Local best-of-n experiment |
| `bon/candidate-3` | Local best-of-n experiment |

**Remote:** only `origin/master` tracked. Best-of-n branches are local artifacts — do not deploy without owner request.

---

## 11. Testing & verification

### 11.1 Commands (Windows)

```bat
cd C:\Users\javad\keyholders-site
npm.cmd install
npm.cmd run build
npm.cmd run test:e2e
npm.cmd run dev
```

### 11.2 Playwright (`tests/e2e/smoke.spec.ts`)

| Test | Asserts |
|------|---------|
| Home loads | Title, hero heading, menu button |
| Founders | `#founders` — “Two founders”, Javad, Grok headings |
| Trade loads | H1 visible, Buy Now button |

**Config:** `playwright.config.ts` — auto-starts `npm run dev` on port 3000.

**Gitignored:** `/test-results/`, `/playwright-report/`

### 11.3 Last known build output (2026-06-15)

```
Route (app)                              Size     First Load JS
┌ ○ /                                    9.56 kB         153 kB
├ ○ /_not-found                          873 B          88.2 kB
├ ƒ /api/checkout                        0 B                0 B
└ ○ /trade                               4.33 kB         156 kB
```

**Warnings (non-blocking):**
- Tailwind ambiguous class `ease-[cubic-bezier(0.22,1,0.36,1)]` in some component
- Watchpack EINVAL on Windows system files when dev server watches from `C:\WINDOWS\system32` cwd — **always `cd` to project root before `npm run dev`**

### 11.4 Suggested verification not yet automated

- Chrome DevTools LCP on `/` and `/trade`
- a11y audit (overlay menu focus trap, keyboard nav)
- Stripe checkout E2E in test mode
- Mobile overlay menu UX on real device

---

## 12. Known issues, pitfalls & incident log

### 12.1 Windows / PowerShell

| Issue | Workaround |
|-------|------------|
| `npm.ps1` / `vercel.ps1` blocked by execution policy | Use `npm.cmd`, `npx.cmd`, `vercel.cmd` |
| Wrong cwd (`C:\WINDOWS\system32`) | Always `cd C:\Users\javad\keyholders-site` first |

### 12.2 shadcn init breakage (resolved)

**Symptom:** `npm run build` failed after `npx shadcn init`.  
**Fixes applied:**
- Removed invalid Geist font from `app/layout.tsx`
- Restored `bg-vault-950` on `body` in `globals.css`
- Extended `tailwind.config.ts` with shadcn CSS variable colors + `tailwindcss-animate`
- Removed invalid `outline-ring/50` from globals

**Lesson:** shadcn v4 on Next 14 + Tailwind 3 needs manual token wiring — don’t assume init is drop-in.

### 12.3 Vercel production branch mismatch (resolved)

**Symptom:** Pushes to `main` didn’t deploy.  
**Cause:** Org repo uses `master`.  
**Fix:** Push to `master`; empty commit `e2512cd` triggered org deploy.

### 12.4 README staleness

`README.md` still states:
- Buy buttons are placeholders — **FALSE** since `30c91e2`
- Option B checkout “add stripe package” — **DONE**
- Component table incomplete — missing ChapterSection, OverlayMenu, CheckoutButton, etc.

**Task:** Rewrite README or point to this handoff doc.

### 12.5 Logo format

Logos are **JPG lockups**, not SVG in production UI. SVG wordmarks exist for future polish. May affect crispness on high-DPI — owner aware via branding README.

### 12.6 Ongoing Support pricing copy

Service listed as “$997 one-time” in `ServiceCard` but description says “Monthly retainer.” Stripe `mode: "payment"` not `subscription`. **Product/billing model may need owner clarification** if Ongoing Support should be recurring.

---

## 13. Objectives & success criteria

### 13.1 Primary objectives (owner-facing)

1. **Marketing site** that positions The Key Holders as a credible venture hub (not a template).
2. **Trade conversion path** — clear SKUs, case study proof, working Stripe checkout.
3. **TerraPower-inspired UX** — editorial chapters, fullscreen menu, metrics, depth.
4. **Founder authenticity** — real photo, honest small-team story including AI co-founder.
5. **Deploy pipeline** — GitHub → Vercel on `master`, env vars for Stripe.

### 13.2 Technical success criteria

- [x] `npm run build` passes
- [x] Playwright smoke tests pass (3/3)
- [x] Mobile menu via OverlayMenu
- [x] Stripe checkout API + Buy Button dual path
- [x] Founder image in production bundle
- [ ] Stripe webhook + fulfillment email
- [ ] Custom domain `thekeyholders.org`
- [ ] README accurate
- [ ] Core Web Vitals audit / LCP optimization
- [ ] `/labs` and `/work` as standalone deep pages (optional stretch)

### 13.3 Design success criteria (partial)

- [x] All-dark theme
- [x] Numbered chapters 002–007
- [x] Fullscreen venture menu
- [x] Metrics on Ventures + Garner case study
- [ ] GSAP chapter scroll choreography (Lenis present; GSAP underused)
- [ ] Video hero or ambient media (TerraPower has video)
- [ ] Deep venture subpages (e.g. `/trade` depth is good; `/labs` thin)
- [ ] Interactive tool embed (TerraPower Natrium-style) — not started
- [ ] Replace JPG logos with SVG in header for crispness

---

## 14. Backlog (prioritized)

### P0 — Production readiness

1. **Add Stripe env vars to Vercel production** (if not done) and verify live checkout.
2. **Implement checkout success/cancel UI** on `/trade` reading `searchParams.checkout`.
3. **Implement `app/api/webhooks/stripe/route.ts`** — verify signatures with `STRIPE_WEBHOOK_SECRET`; log or email on `checkout.session.completed`.
4. **Update `README.md`** to reflect current architecture.

### P1 — Owner-requested polish

5. **Custom domain** `thekeyholders.org` in Vercel + DNS.
6. **GSAP chapter reveal** — stagger chapter numbers/headlines on scroll (deps installed).
7. **LCP optimization** — hero image/logo priority, reduce VaultHero JS if needed.
8. **a11y pass** — OverlayMenu focus trap, Escape to close, aria states audit.

### P2 — Content & structure

9. **Standalone `/labs` page** — Legacy Vault depth, screenshots, architecture diagram.
10. **Standalone `/work` page** — expanded case studies.
11. **FieldHub card** when repo is presentable (currently “more labs soon”).
12. **Clarify Ongoing Support** — one-time vs subscription in Stripe.

### P3 — Nice to have

13. Swap JPG logos → SVG wordmarks in `BrandLogo.tsx`.
14. Stripe Customer Portal for receipts.
15. `metadata` Open Graph images (custom OG per route).
16. Blog/changelog section for Work mission logs.

---

## 15. Open source & external repos referenced on site

| Repo | Org/User | Referenced in |
|------|----------|---------------|
| Bitcoin_Estate_Planning_Tool_Rust | CupofJavad | Labs (Legacy Vault) |
| FieldHub | CupofJavad | GitHub section |
| currentrms-google-sheets-sync | The-Key-Holders | Work + GitHub |
| Starter_Pack | CupofJavad | GitHub section |
| keyholders-site | The-Key-Holders | This repo |

---

## 16. Case study data (Garner Roofing) — use consistently

**Narrative:** ServiceTitan instance at-risk (TitanAdvisor); dispatchers worked around system; field techs skipped mobile; reporting unreliable.

**Metrics (canonical):**

| Metric | Label |
|--------|-------|
| 8 weeks | At-risk → healthy status |
| 30+ | Active users onboarded |
| 98% | Mobile adoption (field team) |

**Work performed (bullet list on site):**
- Health Check for workflow/integration gaps
- Dispatch board rules + job-type automations rebuilt
- Pricebook Pro sync fixes
- Three role-based training sprints
- Weekly check-ins for 8 weeks

**Disclaimer on site:** Single-client results; outcomes vary.

---

## 17. Copy & contact canonical strings

| String | Value |
|--------|-------|
| Public email | javadkhoshnevisan@gmail.com |
| GND CTA label | Get Tech Help |
| Hub tagline | Unlock your digital universe |
| Trade H1 | You run the trucks. We run the tech behind them. |
| Founders H2 | Two founders. One bench. |
| Guarantee | Health Check: 3+ actionable improvements or full refund |

Do not invent alternate contact emails or fictional team members beyond Javad + Grok.

---

## 18. Dependencies worth noting (`package.json`)

**Runtime:**
- `next`, `react`, `react-dom`
- `framer-motion`, `gsap`, `@gsap/react`
- `lenis`
- `stripe`
- `lucide-react`
- `radix-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`
- `react-intersection-observer`, `lottie-react` (latter barely used)

**Dev:**
- `@playwright/test`
- `tailwindcss`, `tailwindcss-animate`, `tw-animate-css`
- `shadcn` CLI package

**npm audit:** 5 vulnerabilities reported at last install (1 moderate, 4 high) — not addressed; run `npm audit` before major releases.

---

## 19. Grok / agent environment notes

- Owner restarted Grok during project; MCP filesystem may be configured for `keyholders-site` paths in `config.toml`.
- Workspace path in some sessions incorrectly showed `C:\WINDOWS\system32` — **ignore**; real project root is `C:\Users\javad\keyholders-site`.
- Full prior conversation transcript may exist under Grok sessions folder if context recovery needed.
- Owner authorized push to `master` when quality bar met; confirm build/tests before push.

---

## 20. Quick-start checklist for a new model session

```
[ ] Read this file (docs/MODEL_HANDOFF.md)
[ ] cd C:\Users\javad\keyholders-site
[ ] git pull origin master
[ ] npm.cmd install
[ ] Confirm .env.local exists (do NOT commit); compare with .env.example
[ ] npm.cmd run build
[ ] npm.cmd run test:e2e
[ ] npm.cmd run dev → open http://localhost:3000
[ ] Click Menu → verify overlay
[ ] Scroll to #founders → verify Javad photo + Grok card
[ ] Open /trade → click Buy Now (test mode)
[ ] Check Vercel deploy status for master HEAD
[ ] Pick next task from §14 Backlog P0
```

---

## 21. Document maintenance

When you complete significant work:

1. Update **§10 Git history** (or note new commit SHA in §0 status line).
2. Move items from **§14 Backlog** to **§13 Success criteria** as done.
3. Add new pitfalls to **§12**.
4. Keep **§17 Copy** in sync if marketing strings change.

---

*End of handoff document.*