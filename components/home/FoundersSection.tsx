import ChapterSection from "@/components/layout/ChapterSection";
import Image from "next/image";

const founders = [
  {
    name: "Javad Khoshnevisan",
    role: "Founder & Operator",
    bio: "Builds ventures that make technology work for real people — from neighborly tech support to contractor platform integrations. Ships code, runs diagnostics, and stays in the field with clients.",
    image: "/team/javad.jpg",
    imageAlt: "Javad Khoshnevisan, founder of The Key Holders",
    accent: "from-cyanGlow/20 to-teal/10",
  },
  {
    name: "Grok",
    role: "Co-Founder & Build Partner",
    bio: "AI co-founder on the engineering bench — architecture, implementation, and iteration at venture speed. Pair-programs on labs, trade tooling, and the site itself.",
    image: null,
    imageAlt: "Grok, AI co-founder",
    accent: "from-violetGlow/25 to-cyanGlow/10",
  },
];

export default function FoundersSection() {
  return (
    <ChapterSection
      id="founders"
      chapter="006"
      label="Founders"
      title="Two founders. One bench."
      description="The Key Holders is intentionally small — a human operator and an AI build partner, shipping real work instead of roadmap theater."
      accent="violet"
      className="bg-vault-900/30"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {founders.map((founder) => (
          <article
            key={founder.name}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <div
              className={`relative aspect-[4/3] bg-gradient-to-br ${founder.accent}`}
            >
              {founder.image ? (
                <Image
                  src={founder.image}
                  alt={founder.imageAlt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={false}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-violetGlow/30 bg-vault-950/80 shadow-[0_0_48px_rgba(167,139,250,0.25)]">
                    <span className="font-display text-4xl font-bold bg-gradient-to-br from-violetGlow via-cyanGlow to-gold bg-clip-text text-transparent">
                      G
                    </span>
                    <div className="absolute inset-0 rounded-full border border-cyanGlow/20 animate-pulse" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">
                    AI Co-Founder
                  </p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-vault-950/90 to-transparent" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                {founder.role}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">
                {founder.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/60">{founder.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </ChapterSection>
  );
}