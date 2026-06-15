"use client";

import { getBuyButtonId, nameToProductId, type TradeProductId } from "@/lib/trade-products";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface CheckoutButtonProps {
  productId?: TradeProductId;
  productName?: string;
  className?: string;
  variant?: "primary" | "gold" | "secondary";
  children: React.ReactNode;
}

const variantClass = {
  primary: "btn-primary",
  gold: "btn-gold",
  secondary: "btn-secondary",
};

export default function CheckoutButton({
  productId: productIdProp,
  productName,
  className,
  variant = "gold",
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buyButtonRef = useRef<HTMLDivElement>(null);

  const productId =
    productIdProp ?? (productName ? nameToProductId(productName) : undefined);

  const buyButtonId = productId ? getBuyButtonId(productId) : undefined;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const hasBuyButton =
    buyButtonId &&
    publishableKey &&
    !publishableKey.includes("xxxxxxxx");

  useEffect(() => {
    if (!hasBuyButton || !buyButtonRef.current || !productId) return;

    const container = buyButtonRef.current;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;

    const el = document.createElement("stripe-buy-button");
    el.setAttribute("buy-button-id", buyButtonId!);
    el.setAttribute("publishable-key", publishableKey!);

    container.appendChild(el);
    document.body.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [hasBuyButton, buyButtonId, publishableKey, productId]);

  if (hasBuyButton) {
    return (
      <div
        ref={buyButtonRef}
        className={cn("stripe-buy-button-wrap flex justify-center", className)}
      />
    );
  }

  async function handleCheckout() {
    if (!productId) {
      setError("Product not configured");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading || !productId}
        className={cn(variantClass[variant], "disabled:opacity-60")}
      >
        {loading ? "Redirecting…" : children}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}