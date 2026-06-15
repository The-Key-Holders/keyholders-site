import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ChapterSectionProps {
  id: string;
  chapter: string;
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  align?: "center" | "left";
  accent?: "cyan" | "gold" | "violet" | "emerald";
}

const chapterAccentMap = {
  cyan: "text-cyanGlow/25",
  gold: "text-gold/25",
  violet: "text-violetGlow/25",
  emerald: "text-emeraldGlow/25",
};

export default function ChapterSection({
  id,
  chapter,
  label,
  title,
  description,
  children,
  className,
  align = "center",
  accent = "cyan",
}: ChapterSectionProps) {
  const isCenter = align === "center";

  return (
    <section
      id={id}
      className={cn(
        "section-padding relative border-t border-white/5",
        className
      )}
    >
      <div className="container-narrow px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16",
            isCenter && "lg:flex-col lg:items-center"
          )}
        >
          <div
            className={cn(
              "shrink-0 lg:sticky lg:top-24",
              isCenter ? "mx-auto text-center" : "lg:w-48"
            )}
          >
            <p
              className={cn(
                "font-display text-5xl font-bold tracking-tight sm:text-6xl",
                chapterAccentMap[accent]
              )}
            >
              {chapter}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/45">
              {label}
            </p>
          </div>

          <div className={cn("flex-1", isCenter && "w-full max-w-4xl mx-auto")}>
            <h2
              className={cn(
                "font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl",
                isCenter && "text-center"
              )}
            >
              {title}
            </h2>
            {description && (
              <p
                className={cn(
                  "mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg",
                  isCenter && "mx-auto text-center"
                )}
              >
                {description}
              </p>
            )}
            <div className="mt-10">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}