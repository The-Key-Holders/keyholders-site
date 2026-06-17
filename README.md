# Key Holders Site

Next.js 14 App Router site for **The Key Holders** (consumer trust hub) and **Key Holders Trade** (ServiceTitan contractor integrations B2B).

**⚠ Critical:** `docs/MODEL_HANDOFF.md` is the single source of truth for architecture, decisions (all-dark vault theme, exact Garner §16 case study data, §17 canonical copy strings, Windows .cmd rules, production branch `master`, file ownership, backlog, and continuity). Read it before touching code or deploying. Never read or commit `.env.local`.

## Structure

| Route     | Brand              | Purpose                              |
|-----------|--------------------|--------------------------------------|
| `/`       | The Key Holders    | Consumer homepage (chapters 002-007), links to Geeks Next Door |
| `/trade`  | Key Holders Trade  | B2B landing page with Stripe SKUs + success/cancel feedback |
| `/labs`   | The Key Holders    | Standalone Labs (P2): Legacy Vault + FieldHub pipeline (verbatim §16/17) |
| `/work`   | The Key Holders    | Standalone Work (P2): mission logs, Garner §16 verbatim + CurrentRMS |

## Quick Start

```bash
cd keyholders-site
npm install
cp .env.example .env.local
npm run dev
```

On Windows/PowerShell: use `npm.cmd` (and `vercel.cmd`) because execution policy blocks .ps1 scripts. Always start commands with `cd 'C:\Users\javad\keyholders-site'`.

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build       |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint              |
| `npm run test:e2e` | Playwright E2E tests (7/7 smoke covering home, trade feedback, /labs, /work) |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in (never commit real keys):

```env
# Stripe API keys (Dashboard → Developers → API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Buy Button IDs (Dashboard → Products → Buy button). Leave as placeholder (contains xxxxxxxx) to use Checkout Sessions fallback.
NEXT_PUBLIC_STRIPE_BUY_BUTTON_DIAGNOSTIC=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_HEALTH_CHECK=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_QUICK_CONNECT=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_INTEGRATION_AUDIT=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_USER_TRAINING=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_ONGOING_SUPPORT=buy_btn_...
```

Optional: `NEXT_PUBLIC_SITE_URL=https://keyholders-site.vercel.app` for redirect fallbacks.

## Repository

**GitHub:** [github.com/The-Key-Holders/keyholders-site](https://github.com/The-Key-Holders/keyholders-site)

## Changelog & Versioning
New in ecosystem: root `CHANGELOG.md` (advanced format w/ version header, Added/Changed/Fixed, manual entries + auto commit template) + `/changelog` page.
- Styled with glass-card, btn-*, section-padding, all-dark.
- Client search + version filter (React state), GitHub commit/release links, "Add manual entry" form (logs + PR suggest).
- Reuses lib (getChangelog). Integrates file-versions, future error log links, unit tests.
- Agent personas ([changelog-maintainer]): append via PRs or GitHub MCP tools.
- Link added to Work section on home. See full in CHANGELOG.md and app/changelog/page.tsx. (Additive, no P0/P1/P2 impact.)
- /github: standalone curated OSS page for ecosystem (salvaged repos via grok_com_github; showcases file-versions, changelog, Reliability Suite). Linked from overlay, labs, home.

## Deploy to Vercel

Production: pushes to `master` auto-deploy to Vercel project `keyholders-site` (team: `cupofjavads-projects`).

1. Repo is on GitHub — import at [vercel.com/new](https://vercel.com/new) → **The-Key-Holders/keyholders-site**.
2. Framework preset: **Next.js** (auto-detected).
3. Add environment variables from `.env.example` (exact names) in **Project Settings → Environment Variables** (Production). See checklist in handoff §8.4 / §8.5.
4. Deploy. Vercel will run `npm run build` automatically.
5. (Optional) Add a custom domain in **Project Settings → Domains**. (Deferred until quality bar met per owner.)

### Stripe Webhook (post-deploy)

The handler `app/api/webhooks/stripe/route.ts` now exists and is wired (P0 complete).

1. After first production deploy, go to Stripe Dashboard → **Developers → Webhooks** → Add endpoint:
   `https://keyholders-site.vercel.app/api/webhooks/stripe` (update to custom domain later).
2. Select event: `checkout.session.completed` (primary; payment_intent optional).
3. Copy the **Signing secret** (`whsec_...`) and set it as `STRIPE_WEBHOOK_SECRET` in Vercel **Production** Environment Variables.
4. Redeploy (or trigger via empty commit to `master`).
5. Test: complete a test-mode checkout on the live site → inspect Vercel function logs for `[STRIPE WEBHOOK] checkout.session.completed` entries containing `productId`, `amount`, `email`.

See `app/api/webhooks/stripe/route.ts` header comments and handoff §8 for details.

## Stripe Integration (Production-Ready)

**Dual-path checkout is DONE (P0).** No placeholders remain.

- **Primary path (when configured):** Stripe Buy Button embeds (client-side dynamic script injection in `CheckoutButton.tsx`). Requires `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` + matching `NEXT_PUBLIC_STRIPE_BUY_BUTTON_*` (skips silently on placeholder values containing `xxxxxxxx`).
- **Fallback path (always available):** Server-side Checkout Sessions via POST to `/api/checkout` (creates `price_data` dynamically from `lib/trade-products.ts`; no pre-created Price IDs needed). Redirects to Stripe-hosted checkout. Success/cancel URLs emit `/trade?checkout=success` or `?checkout=cancelled`.
- **Feedback UI:** On `/trade`, `?checkout=success|cancelled` renders a prominent glass-card + gold-accent banner (`CheckoutFeedback.tsx`) with strong on-brand copy, guarantee reference, and "Dismiss" that uses `router.replace('/trade')` to clean the param (no flash on reload).
- **Webhook:** `app/api/webhooks/stripe/route.ts` (raw body + signature verification via `next/headers` + `stripe.webhooks.constructEvent`). Logs `checkout.session.completed` with `productId` (from metadata), amount, customer email. Always returns 200 ack. Reuses `getStripe()` + 503 pattern from checkout route. See handoff §8.1–§8.5.

Product catalog + amounts are canonical in `lib/trade-products.ts`. All SKUs use one-time `mode: "payment"`.

For full architecture, env checklist, operational steps, and future considerations (e.g. Price IDs, portal), read **docs/MODEL_HANDOFF.md §8**.  
Advanced structured error logging (levels+context, Vercel+Supabase, agent queryLogs/logger for personas/auto-analysis) added in lib/utils (see source + .env.example).

## Components

| Component              | Path                                      | Notes |
|------------------------|-------------------------------------------|-------|
| Header                 | `components/Header.tsx`                   | Sticky + OverlayMenu trigger |
| Footer                 | `components/Footer.tsx`                   | Variants for hub/trade |
| BrandLogo              | `components/BrandLogo.tsx`                | JPG lockups + priority for LCP |
| CheckoutButton         | `components/CheckoutButton.tsx`           | Dual-path (Buy Button / fallback) + loading/error states |
| **CheckoutFeedback**   | `components/CheckoutFeedback.tsx`         | **NEW (P0)**: glass + gold success/cancel banners for ?checkout param |
| ServiceCard            | `components/ServiceCard.tsx`              | Wraps CheckoutButton for services grid |
| TradeHero              | `components/TradeHero.tsx`                | Trade-specific hero |
| TradeSectionHeader     | `components/trade/TradeSectionHeader.tsx` | Consistent section labels/titles |
| VaultHero + hero/*     | `components/hero/*`                       | Cinematic scroll-unlock SVG key (UNLOCK_THRESHOLD), ParticleField, StaticHeroShell |
| Ventures / HomeSections| `components/home/*`                       | Ventures, Labs, Work, Github, Contact, Founders |
| ChapterSection         | `components/layout/ChapterSection.tsx`    | Editorial numbered wrapper (002–007); P1 GSAP stagger + reduced-motion |
| OverlayMenu            | `components/layout/OverlayMenu.tsx`       | Fullscreen TerraPower-style venture explorer; P1 a11y (Esc + focus trap + return) |
| (new P2) /labs /work pages | `app/labs/page.tsx`, `app/work/page.tsx` | Standalone deep pages (P2; /labs FieldHub + Legacy Vault; /work Garner verbatim) |
| SmoothScroll           | `components/providers/SmoothScroll.tsx`   | Lenis wrapper |
| ui/*                   | `components/ui/*`                         | shadcn primitives (button, sheet, etc.) |
| CheckoutFeedback       | (see above)                               | Client banner for Stripe redirect states |

See full repo layout in handoff §6.

## File Version Tracking (ecosystem)
Advanced tracking added (lib/file-versions.ts + /api/versions + display in /work):
- Tracks repos/files with commit hashes, semver, history (seeded via GitHub MCP list_commits/get_commit).
- Local file storage (source in repo; queryable via import or GET /api/versions?id=...).
- History/diff views via direct GitHub links; integrates changelog + error logging (see lib/utils.ts logger + file-versions logWithFileVersion).
- Agents/personas: import or fetch for error context, [historian] etc.
- Pattern: copy lib/file-versions.ts + note in other projects (keyholders-site as hub; geeksnextdoor etc).
- All-dark theme, exact additive reuse (glass-card, emerald for work, cn utils pattern).

See /work "File & Repo Versions", app/api/versions/route.ts, lib/file-versions.ts.

## Brand Colors & Design

All-dark theme (`vault-950` base) — final per owner (no hybrid).

Tokens in `tailwind.config.ts` + `app/globals.css`:

- `vault-950` — `#050810` (page bg)
- `vault-900/800` — depth layers
- `gold` / `goldLight` — `#F59E0B` / `#FDE68A` (Trade accent)
- `cyanGlow` / `teal` — Hub accents + primary CTAs
- `glass-card`, `.btn-gold`, `.btn-primary`, `.btn-secondary`, `.section-padding`, `.container-narrow`

Fonts: Syne (display), DM Sans (body). See handoff §3.4 and §7 for hero systems.

## License

Private — Key Holders / Key Holders Trade. See `docs/MODEL_HANDOFF.md` for backlog (P0 Stripe closure complete + P1 GSAP/a11y/LCP + P2 /labs /work standalone), success criteria (all P0/P1/P2 checked per HMC §13), maintenance process (§21), and final gates (build + 7/7 e2e 2026-06-15).

**P0/P1/P2 delivered (HMC 2026-06-15):** Stripe full (webhook + CheckoutFeedback success/cancel + dual-path + README), GSAP ChapterSection stagger + OverlayMenu a11y Esc/trap + BrandLogo LCP priority, standalone /labs + /work (verbatim + links + FieldHub richer + ServiceCard fix), e2e extended to 7/7, final build/MCP/review gates pass. No push here; owner decision. Cross-ref handoff for SHAs + evidence.