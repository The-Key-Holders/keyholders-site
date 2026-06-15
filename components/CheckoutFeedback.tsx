"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutFeedbackProps {
  status: "success" | "cancelled" | null | undefined;
}

export default function CheckoutFeedback({ status }: CheckoutFeedbackProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (!status || dismissed) {
    return null;
  }

  const isSuccess = status === "success";

  const Icon = isSuccess ? CheckCircle2 : XCircle;
  const title = isSuccess ? "Checkout successful" : "Checkout cancelled";
  const body = isSuccess
    ? "Thank you for your order. Our team will be in touch within 1 business day to coordinate next steps for your ServiceTitan integration. You will receive a confirmation email with your receipt."
    : "No charges were made. You can return to the page and try again, or contact us directly if you have questions about our diagnostics, health checks, or integrations.";
  const accentClass = isSuccess
    ? "border-gold/40 bg-gold/5"
    : "border-white/20 bg-white/[0.02]";
  const iconBgClass = isSuccess
    ? "bg-gold/10 text-gold"
    : "bg-white/10 text-white/70";

  function handleDismiss() {
    setDismissed(true);
    // Clean ?checkout param from URL and reset state without full navigation
    router.replace("/trade");
  }

  return (
    <div className="container-narrow px-4 sm:px-6 lg:px-8 pt-6">
      <div
        className={cn(
          "glass-card mx-auto max-w-3xl border p-6 sm:p-8",
          accentClass
        )}
        role="status"
        aria-live="polite"
        data-testid="checkout-feedback"
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
              iconBgClass
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
            {isSuccess && (
              <p className="mt-3 text-xs uppercase tracking-[0.5px] text-gold/80">
                Health Check guarantee: 3+ actionable improvements or full refund
              </p>
            )}
            <button
              onClick={handleDismiss}
              className="btn-secondary mt-4 px-5 py-2 text-sm"
              aria-label="Dismiss this message and clean the URL"
            >
              Dismiss
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="rounded p-1 text-white/50 transition hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 -mr-1 -mt-1"
            aria-label="Close feedback banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
