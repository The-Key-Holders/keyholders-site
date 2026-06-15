interface TradeSectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

export default function TradeSectionHeader({
  label,
  title,
  description,
  align = "center",
}: TradeSectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-3xl";

  return (
    <div className={alignClass}>
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold/80">
          {label}
        </p>
      )}
      <h2 className={`font-display text-3xl font-bold text-white sm:text-4xl ${label ? "mt-3" : ""}`}>
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-white/60 leading-relaxed">{description}</p>
      )}
    </div>
  );
}