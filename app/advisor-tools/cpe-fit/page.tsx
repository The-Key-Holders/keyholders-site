import { CPE_FIT_BASE, CPE_FIT_CATALOG_SOURCE } from "@/lib/cpe-fit/public-types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CPE Fit",
  robots: { index: false, follow: false },
};

export default function CpeFitHomePage() {
  return (
    <>
      <section className="hero">
        <h1>Will this system fit the allotment?</h1>
        <p>
          CPE Fit estimates what a 911 call handling system really costs a PSAP over its life, and lines that
          up against the CPE funding allotment in their signed letter. Pick a vendor, set the size, add the
          extras, and see the gap.
        </p>
        <div className="actions">
          <Link className="btn" href={`${CPE_FIT_BASE}/estimate`}>
            Start an estimate
          </Link>
          <Link className="btn ghost" href={`${CPE_FIT_BASE}/positions`}>
            Not sure how many positions?
          </Link>
        </div>
      </section>
      <section className="grid3">
        <div className="card">
          <h3>1. Enter the letter</h3>
          <p>
            Use the allotment from the PSAP&apos;s signed CalOES letter only, minus any residual already spent.
            No letter, no number: the tool never invents one.
          </p>
        </div>
        <div className="card">
          <h3>2. Describe the system</h3>
          <p>
            Vendor and contract, positions (2 to 20), years of maintenance, On-Prem layout, and add-ons like
            GIS, loggers and displays.
          </p>
        </div>
        <div className="card">
          <h3>3. Read the gap</h3>
          <p>
            See an itemized true cost, how much of the allotment it uses, and whether the PSAP is over. Then
            compare all 12 contracts side by side.
          </p>
        </div>
      </section>
      <section className="card prose">
        <h2>Background worth knowing</h2>
        <ul>
          <li>
            <b>What the allotment is.</b> CalOES sets a fixed CPE funding allotment per PSAP from its 911 call
            volume and the Master Purchase Agreement prices. It is meant to replace a complete system.
          </li>
          <li>
            <b>Prices here are ceilings.</b> Exhibit C prices are contract maximums (IFB 26-16743, Part 1,
            p.32). They do not guarantee a sale, and PSAPs can often negotiate lower.
          </li>
          <li>
            <b>Anything over is on the PSAP.</b> Cost beyond the allotment is the PSAP&apos;s responsibility.
          </li>
          <li>
            <b>Not included.</b> Language interpretation is a separate contract. CAD interfaces are a PSAP
            cost. Larger-than-20-position systems and extras like ACD, MIS, AI or multimedia need a vendor
            quote; add those under Other one-time.
          </li>
          <li>
            <b>Cloud vs On-Prem.</b> Cloud estimates add 22.4 connectivity. On-Prem can be Basic Stand Alone
            or Host Remote, with an optional Side A+B host backroom.
          </li>
          <li>
            <b>Who this is for.</b> It&apos;s an advisor&apos;s working tool. Don&apos;t send raw output to a PSAP without
            review.
          </li>
        </ul>
        <p className="muted">Source: 12 vendor contracts, {CPE_FIT_CATALOG_SOURCE}.</p>
      </section>
    </>
  );
}
