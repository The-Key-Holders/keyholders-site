import BrandLogo from "@/components/BrandLogo";

/** Server-rendered shell shown while VaultHero hydrates — improves LCP. */
export default function StaticHeroShell() {
  return (
    <section className="relative min-h-[80vh] overflow-hidden bg-vault-gradient">
      <div className="container-narrow relative z-10 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="mb-8 flex justify-center">
            <BrandLogo variant="parent" className="brightness-110 contrast-110" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyanGlow/80">
            The Key Holders
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Unlock your{" "}
            <span className="bg-gradient-to-r from-cyanGlow via-gold to-goldLight bg-clip-text text-transparent">
              digital universe
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
            A high-tech venture hub — consumer tech, contractor integrations, labs,
            and shipped work.
          </p>
        </div>
      </div>
    </section>
  );
}