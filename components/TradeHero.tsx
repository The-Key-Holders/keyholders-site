import BrandLogo from "@/components/BrandLogo";

export default function TradeHero() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brandBlue/20 via-transparent to-teal/10" />
      <div className="container-narrow relative section-padding px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <BrandLogo variant="trade" onDark />
          </div>
          <p className="mb-4 inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-1.5 text-sm font-medium text-teal">
            ServiceTitan Contractor Integrations
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            You run the trucks.{" "}
            <span className="text-gold">We run the tech behind them.</span>
          </h1>
          <p className="mt-6 text-lg text-gray-300 sm:text-xl">
            Fixed-price integrations, reporting, and automations for HVAC,
            plumbing, roofing, and electrical shops — from an implementer who
            rescued an at-risk ServiceTitan rollout.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#services" className="btn-gold">
              View Services &amp; Buy
            </a>
            <a
              href="#case-study"
              className="btn-secondary !border-gray-600 !bg-transparent !text-white hover:!bg-white/10"
            >
              See Case Study
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}