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
    src: "/branding/parent-wordmark-a.svg",
    alt: "The Key Holders",
    href: "/",
  },
  trade: {
    src: "/branding/trade-wordmark-b-stacked.svg",
    alt: "Key Holders Trade",
    href: "/trade",
  },
} as const;

export default function BrandLogo({
  variant,
  onDark = false,
  className = "",
}: BrandLogoProps) {
  const { src, alt, href } = config[variant];

  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center rounded-lg transition opacity-100 hover:opacity-90 ${onDark ? "bg-white/5 px-1.5 py-0.5" : ""} ${className}`}
      aria-label={alt}
    >
      {/* Revised for dark vault theme (no white rect square from old JPG/SVG bg; uses edited dark-native SVGs with light text + site glow colors; crisp vector matches Syne font, cyan/gold accents, key motif from hero; subtle onDark glass lift instead of solid white). LCP priority kept. */}
      <Image
        src={src}
        alt={alt}
        width={variant === "parent" ? 210 : 160}
        height={variant === "parent" ? 40 : 60}
        className="h-8 w-auto sm:h-9"
        priority={variant === "parent" || variant === "trade"}
      />
    </Link>
  );
}