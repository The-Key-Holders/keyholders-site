import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { tradeProducts } from "@/lib/trade-products";

/**
 * Reuses the exact getStripe() helper pattern + 503 "not configured" error style
 * from app/api/checkout/route.ts (see MODEL_HANDOFF.md §8.3).
 * This ensures consistent placeholder detection and graceful degradation.
 */
function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("xxxxxxxx")) {
    return null;
  }
  return new Stripe(key);
}

export async function POST(request: Request) {
  // Explicit reference: implements the missing webhook from handoff §8.1 / §8.3 / §8.5
  // and P0 backlog item 3. Dual-path checkout (Buy Button + Checkout Sessions) is now
  // production-closed with success/cancel UI + this handler for checkout.session.completed.
  // See docs/MODEL_HANDOFF.md §8 for full architecture, env requirements, and operational checklist.

  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret || webhookSecret.includes("xxxxxxxx")) {
    // Mirror checkout route 503 behavior for misconfigured / missing secrets.
    // In production this should never happen once STRIPE_* vars are set in Vercel.
    return NextResponse.json(
      {
        error:
          "Stripe webhook is not configured. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env.local / Vercel Production env.",
      },
      { status: 503 }
    );
  }

  const body = await request.text(); // Raw body required for signature verification (critical for Stripe)
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Signature verification failed:", err);
    // Return 400 for bad signature (Stripe will not retry indefinitely in some cases);
    // plan allows 400/500 "as appropriate" while success paths always ack with 200.
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Primary event we care about per handoff §8: checkout.session.completed
  // Logs productId (from metadata set in /api/checkout), amount, customer email for fulfillment/CRM.
  // Future extensions (not in P0): send email, write to DB, trigger onboarding.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // productId comes from the metadata we attach in the Checkout Session creation
    const productId = session.metadata?.productId as keyof typeof tradeProducts | undefined;

    console.log("[STRIPE WEBHOOK] checkout.session.completed", {
      eventId: event.id,
      sessionId: session.id,
      productId,
      productName: productId ? tradeProducts[productId]?.name : undefined,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      customerName: session.customer_details?.name,
      paymentStatus: session.payment_status,
      created: session.created,
    });

    // Placeholder for owner fulfillment logic (email, Linear ticket, etc.).
    // Do not block the 200 ack.
  }

  // Always return 200 for successfully constructed events (including unknown ones).
  // This tells Stripe "we received it" and stops retries.
  return NextResponse.json({ received: true });
}
