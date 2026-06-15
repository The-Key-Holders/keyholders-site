import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import TradeHero from "@/components/TradeHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Key Holders Trade",
  description:
    "ServiceTitan contractor integrations — diagnostics, health checks, and implementation for HVAC, plumbing, and roofing teams.",
};

const services = [
  {
    name: "Diagnostic",
    price: 497,
    description:
      "A focused 2-hour review of your ServiceTitan setup to identify quick wins and red flags.",
    features: [
      "Live walkthrough of your instance",
      "Workflow & data quality assessment",
      "Priority issue list (top 5)",
      "30-min follow-up call",
    ],
    stripePriceId: "price_diagnostic_497",
  },
  {
    name: "Health Check",
    price: 1497,
    description:
      "Deep audit across integrations, automations, reporting, and user adoption.",
    features: [
      "Full system health report",
      "Integration & API review",
      "User permission audit",
      "Adoption & training gaps",
      "90-day improvement roadmap",
    ],
    highlighted: true,
    stripePriceId: "price_health_check_1497",
  },
  {
    name: "Quick Connect",
    price: 2997,
    description:
      "Get a critical third-party integration live and validated within two weeks.",
    features: [
      "Single integration setup",
      "Data mapping & sync rules",
      "End-to-end testing",
      "Team handoff documentation",
      "14-day post-launch support",
    ],
    stripePriceId: "price_quick_connect_2997",
  },
  {
    name: "Integration Audit",
    price: 997,
    description:
      "Evaluate existing integrations for reliability, cost, and data integrity.",
    features: [
      "Inventory of all connected apps",
      "Sync failure analysis",
      "Cost & redundancy review",
      "Consolidation recommendations",
    ],
    stripePriceId: "price_integration_audit_997",
  },
  {
    name: "User Training Sprint",
    price: 1997,
    description:
      "Role-based training sessions to drive adoption across office and field teams.",
    features: [
      "Up to 3 role-based sessions",
      "Custom quick-reference guides",
      "Adoption tracking setup",
      "Manager coaching call",
    ],
    stripePriceId: "price_user_training_1997",
  },
  {
    name: "Ongoing Support",
    price: 997,
    description:
      "Monthly retainer for priority support, minor config changes, and check-ins.",
    features: [
      "4 hours of support per month",
      "Priority Slack/email access",
      "Monthly health snapshot",
      "Rollover unused hours (1 month)",
    ],
    stripePriceId: "price_ongoing_support_997",
  },
];

const faqs = [
  {
    q: "Who is Key Holders Trade for?",
    a: "HVAC, plumbing, roofing, and other home-service contractors running ServiceTitan who need cleaner data, better integrations, and higher team adoption — without hiring a full-time admin.",
  },
  {
    q: "Do you replace our ServiceTitan admin?",
    a: "No. We complement your existing team. We diagnose problems, implement fixes, and train your people so the system keeps working after we leave.",
  },
  {
    q: "How long does a Health Check take?",
    a: "Typically 5–7 business days from kickoff to delivered report, depending on instance size and integration count.",
  },
  {
    q: "What if we already have a ServiceTitan partner?",
    a: "We often work alongside existing partners. Our Diagnostic is a low-risk way to get a second opinion and a prioritized action list.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — see our guarantee below. For the Health Check specifically: if we can't identify at least 3 actionable improvements, you get a full refund.",
  },
  {
    q: "Can I start with Diagnostic and upgrade?",
    a: "Absolutely. Diagnostic fees can be credited toward a Health Check or Quick Connect if you proceed within 30 days.",
  },
];

export default function TradePage() {
  return (
    <>
      <TradeHero />

      {/* Featured Buy Buttons */}
      <section id="buy" className="bg-white border-b border-gray-100">
        <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-charcoal">
              Start with a fixed-price engagement
            </h2>
            <p className="mt-3 text-gray-600">
              Placeholder Stripe buy buttons — replace href and data attributes
              with live Stripe Buy Button embeds.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Diagnostic", price: 497, id: "diagnostic" },
              { label: "Health Check", price: 1497, id: "health_check" },
              { label: "Quick Connect", price: 2997, id: "quick_connect" },
            ].map((item) => (
              <div key={item.id} className="card text-center">
                <h3 className="text-lg font-semibold text-charcoal">
                  {item.label}
                </h3>
                <p className="mt-2 text-2xl font-bold text-brandBlue">
                  ${item.price.toLocaleString()}
                </p>
                <a
                  href="#buy"
                  className="btn-primary mt-6 w-full"
                  data-stripe-buy-button=""
                  data-stripe-product={item.label}
                  data-stripe-amount={item.price}
                  data-stripe-price-id={`price_${item.id}_${item.price}`}
                >
                  Buy Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study */}
      <section id="case-study" className="bg-gray-50">
        <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal">
              Case Study
            </p>
            <h2 className="mt-2 text-3xl font-bold text-charcoal">
              Garner Roofing
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Garner Roofing came to us with a ServiceTitan instance flagged
              at-risk by their TitanAdvisor score. Dispatchers were working
              around the system, field techs skipped mobile workflows, and
              reporting data didn&apos;t match reality.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { metric: "8 weeks", label: "At-risk to healthy status" },
                { metric: "30+", label: "Active users onboarded" },
                { metric: "98%", label: "Mobile adoption (field team)" },
              ].map((stat) => (
                <div key={stat.label} className="card text-center">
                  <p className="text-3xl font-bold text-brandBlue">
                    {stat.metric}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 card">
              <h3 className="font-semibold text-charcoal">What we did</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• Health Check to map every workflow gap and integration failure</li>
                <li>• Rebuilt dispatch board rules and job-type automations</li>
                <li>• Fixed Pricebook Pro sync issues with their supplier catalog</li>
                <li>• Three role-based training sprints (dispatch, CSR, field)</li>
                <li>• Weekly check-ins for 8 weeks post-implementation</li>
              </ul>
              <p className="mt-4 text-sm text-gray-500 italic">
                Results reflect this single client engagement. Outcomes vary by
                team size, starting system health, and leadership buy-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="bg-white">
        <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-charcoal">Our Services</h2>
            <p className="mt-4 text-gray-600">
              Fixed-price engagements designed for contractors who need results,
              not endless consulting hours.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.name} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-brandBlue">
        <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center text-white">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
              <svg
                className="h-6 w-6 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Our Guarantee
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Every Health Check comes with a simple promise: if we can&apos;t
              find at least{" "}
              <strong className="text-gold">3 actionable improvements</strong>,
              you get a full refund. No hoops, no fine print.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50">
        <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-charcoal text-center">
              Frequently Asked Questions
            </h2>
            <dl className="mt-12 space-y-6">
              {faqs.map((faq) => (
                <div key={faq.q} className="card">
                  <dt className="font-semibold text-charcoal">{faq.q}</dt>
                  <dd className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="container-narrow section-padding px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold text-charcoal">
              Ready to get your ServiceTitan house in order?
            </h2>
            <p className="mt-4 text-gray-600">
              Start with a Diagnostic or book a free 15-minute intro call.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#buy"
                className="btn-gold"
                data-stripe-product="Diagnostic"
                data-stripe-amount={497}
              >
                Book Diagnostic — $497
              </a>
              <a
                href="mailto:trade@keyholders.com"
                className="btn-secondary"
              >
                Schedule Intro Call
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="trade" />
    </>
  );
}