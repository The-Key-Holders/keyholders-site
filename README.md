# Key Holders Site

Next.js 14 App Router site for **The Key Holders** (consumer trust hub) and **Key Holders Trade** (ServiceTitan contractor integrations B2B).

## Structure

| Route     | Brand              | Purpose                              |
|-----------|--------------------|--------------------------------------|
| `/`       | The Key Holders    | Consumer homepage, links to Geeks Next Door |
| `/trade`  | Key Holders Trade  | B2B landing page with Stripe SKUs    |

## Quick Start

```bash
cd keyholders-site
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build       |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint              |

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Stripe API keys (Dashboard → Developers → API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Buy Button IDs (Dashboard → Products → Buy button)
NEXT_PUBLIC_STRIPE_BUY_BUTTON_DIAGNOSTIC=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_HEALTH_CHECK=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_QUICK_CONNECT=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_INTEGRATION_AUDIT=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_USER_TRAINING=buy_btn_...
NEXT_PUBLIC_STRIPE_BUY_BUTTON_ONGOING_SUPPORT=buy_btn_...
```

## Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variables from `.env.example` in **Project Settings → Environment Variables**.
5. Deploy. Vercel will run `npm run build` automatically.
6. (Optional) Add a custom domain in **Project Settings → Domains**.

### Stripe Webhook (post-deploy)

1. In Stripe Dashboard → **Developers → Webhooks**, add endpoint:
   `https://your-domain.com/api/webhooks/stripe`
2. Select events: `checkout.session.completed`, `payment_intent.succeeded`.
3. Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in Vercel env vars.
4. Redeploy to pick up the new variable.

## Stripe Integration — Next Steps

Current buy buttons are **placeholders** (`href="#buy"` with `data-stripe-*` attributes). To go live:

### Option A: Stripe Buy Buttons (fastest)

1. Create products in [Stripe Dashboard → Products](https://dashboard.stripe.com/products):
   - Diagnostic — $497
   - Health Check — $1,497
   - Quick Connect — $2,997
   - Integration Audit — $997
   - User Training Sprint — $1,997
   - Ongoing Support — $997/mo
2. For each product, create a **Buy Button** (Products → select product → Buy button).
3. Copy each `buy-button-id` into the matching `NEXT_PUBLIC_STRIPE_BUY_BUTTON_*` env var.
4. Replace placeholder `<a>` tags in `app/trade/page.tsx` and `components/ServiceCard.tsx` with:

```tsx
<script async src="https://js.stripe.com/v3/buy-button.js"></script>
<stripe-buy-button
  buy-button-id="buy_btn_xxxxxxxx"
  publishable-key={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
/>
```

### Option B: Stripe Checkout Sessions (more control)

1. Add `@stripe/stripe-js` and `stripe` packages.
2. Create `app/api/checkout/route.ts` to create Checkout Sessions server-side.
3. Point "Get Started" buttons to POST `/api/checkout` with `priceId`.
4. Add `app/api/webhooks/stripe/route.ts` for fulfillment emails / CRM hooks.

## Components

| Component      | Path                          |
|----------------|-------------------------------|
| Header         | `components/Header.tsx`       |
| Footer         | `components/Footer.tsx`       |
| ServiceCard    | `components/ServiceCard.tsx`    |
| TradeHero      | `components/TradeHero.tsx`    |

## Brand Colors

Configured in `tailwind.config.ts`:

- `charcoal` — `#0F172A`
- `brandBlue` — `#1E40AF`
- `gold` — `#F59E0B`
- `offwhite` — `#FAFAFA`
- `teal` — `#14B8A6`

## License

Private — Key Holders / Key Holders Trade.