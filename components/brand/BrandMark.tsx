import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<Size, { box: number; className: string }> = {
  sm: { box: 32, className: "h-8 w-8" },
  md: { box: 40, className: "h-10 w-10" },
  lg: { box: 48, className: "h-12 w-12" },
  xl: { box: 64, className: "h-16 w-16" },
};

/**
 * Transparent monogram: vault charcoal circle + gold key.
 * Theme-aligned (no white background).
 */
export default function BrandMark({
  size = "md",
  className,
  title = "The Key Holders",
}: {
  size?: Size;
  className?: string;
  title?: string;
}) {
  const { box, className: sizeClass } = sizeMap[size];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={box}
      height={box}
      className={cn(sizeClass, "shrink-0", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {/* Soft outer ring for contrast on dark vault */}
      <circle cx="24" cy="24" r="22" fill="#0F172A" stroke="#22D3EE" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="24" cy="24" r="20" fill="#0a0e1a" />
      {/* Gold key head + bit */}
      <circle cx="24" cy="18" r="7" fill="none" stroke="#F59E0B" strokeWidth="2.5" />
      <circle cx="24" cy="18" r="2.2" fill="#F59E0B" />
      <path
        d="M24 25v12M24 31h5M24 35h3.5"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
