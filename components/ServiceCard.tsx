import { cn } from "@/lib/utils";

interface ServiceCardProps {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
  stripePriceId?: string;
}

export default function ServiceCard({
  name,
  price,
  description,
  features,
  highlighted = false,
  stripePriceId,
}: ServiceCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);

  return (
    <div
      className={cn(
        "glass-card flex flex-col p-6 transition duration-300",
        highlighted
          ? "border-gold/40 shadow-[0_0_32px_rgba(245,158,11,0.12)] hover:border-gold/60"
          : "hover:border-white/20"
      )}
    >
      {highlighted && (
        <span className="mb-4 inline-flex w-fit rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
          Most Popular
        </span>
      )}

      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="mt-2 text-sm text-white/60">{description}</p>

      <div className="mt-4">
        <span className="text-3xl font-bold text-gold">{formattedPrice}</span>
        <span className="text-sm text-white/45"> one-time</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-white/65">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <a
        href="#buy"
        className={cn("mt-8 w-full text-center", highlighted ? "btn-gold" : "btn-secondary")}
        data-stripe-price={stripePriceId ?? `price_placeholder_${name.toLowerCase().replace(/\s+/g, "_")}`}
        data-stripe-amount={price}
        data-stripe-product={name}
      >
        Get Started
      </a>
    </div>
  );
}