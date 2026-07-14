import BrandMark from "@/components/brand/BrandMark";
import { cn } from "@/lib/utils";

type Variant = "parent" | "trade";
type Size = "sm" | "md" | "lg" | "xl";

const textSize: Record<Size, string> = {
  sm: "text-base sm:text-lg",
  md: "text-lg sm:text-xl",
  lg: "text-xl sm:text-2xl",
  xl: "text-2xl sm:text-3xl md:text-4xl",
};

const markSize: Record<Size, "sm" | "md" | "lg" | "xl"> = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
};

/**
 * Transparent wordmark for dark vault UI: gold key mark + white/gold type.
 * No white background board.
 */
export default function BrandWordmark({
  variant = "parent",
  size = "md",
  className,
  showMark = true,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  showMark?: boolean;
}) {
  const isTrade = variant === "trade";
  const label = isTrade ? "Key Holders Trade" : "The Key Holders";
  const accent = isTrade ? "text-gold" : "text-white";

  return (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", className)}>
      {showMark && <BrandMark size={markSize[size]} title={label} />}
      <span
        className={cn(
          "font-display font-bold tracking-tight leading-none",
          textSize[size],
          accent
        )}
      >
        {isTrade ? (
          <>
            Key Holders <span className="text-gold">Trade</span>
          </>
        ) : (
          <>
            The Key <span className="text-white">Holders</span>
          </>
        )}
      </span>
    </span>
  );
}
