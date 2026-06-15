import Image from "next/image";
import Link from "next/link";

type BrandVariant = "parent" | "trade";

interface BrandLogoProps {
  variant: BrandVariant;
  /** Use on dark backgrounds (trade hero/footer) */
  onDark?: boolean;
  className?: string;
}

const config = {
  parent: {
    src: "/branding/parent-lockup.jpg",
    alt: "The Key Holders",
    href: "/",
    height: 40,
    width: 200,
  },
  trade: {
    src: "/branding/trade-lockup.jpg",
    alt: "Key Holders Trade",
    href: "/trade",
    height: 44,
    width: 220,
  },
} as const;

export default function BrandLogo({
  variant,
  onDark = false,
  className = "",
}: BrandLogoProps) {
  const { src, alt, href, height, width } = config[variant];

  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center rounded-lg transition opacity-100 hover:opacity-90 ${onDark ? "bg-white/95 px-2 py-1" : ""} ${className}`}
      aria-label={alt}
    >
      {/* LCP polish (P1#7): priority extended to trade variant for /trade hero (TradeHero usage + handoff §7/§14 LCP; next/image auto eager+high fetchPriority). Review: StaticHeroShell + VaultHero use parent only; header/overlay/footer secondary ok. */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-9 w-auto sm:h-10"
        priority={variant === "parent" || variant === "trade"}
      />
    </Link>
  );
}