import BrandMark from "@/components/brand/BrandMark";
import BrandWordmark from "@/components/brand/BrandWordmark";
import { cn } from "@/lib/utils";
import Link from "next/link";

type BrandVariant = "parent" | "trade";

interface BrandLogoProps {
  variant: BrandVariant;
  /** @deprecated Ignored — logos are theme-native on dark backgrounds */
  onDark?: boolean;
  className?: string;
  /** header | hero | footer | compact */
  size?: "header" | "hero" | "footer" | "compact";
}

const sizeToWordmark = {
  compact: "sm",
  header: "md",
  footer: "lg",
  hero: "xl",
} as const;

/**
 * Primary brand link. Transparent SVG system — no white lockup JPGs.
 */
export default function BrandLogo({
  variant,
  className = "",
  size = "header",
}: BrandLogoProps) {
  const href = variant === "trade" ? "/trade" : "/";
  const alt = variant === "trade" ? "Key Holders Trade" : "The Key Holders";

  if (size === "compact") {
    return (
      <Link
        href={href}
        className={cn("inline-flex shrink-0 items-center transition hover:opacity-90", className)}
        aria-label={alt}
      >
        <BrandMark size="md" title={alt} />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg transition hover:opacity-90",
        className
      )}
      aria-label={alt}
    >
      <BrandWordmark variant={variant} size={sizeToWordmark[size]} />
    </Link>
  );
}
