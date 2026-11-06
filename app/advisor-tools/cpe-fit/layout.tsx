import type { Metadata } from "next";
import CpeFitNav from "./components/CpeFitNav";
import { CPE_FIT_CATALOG_SOURCE } from "@/lib/cpe-fit/public-types";
import "./cpe-fit.css";

export const metadata: Metadata = {
  title: "CPE Fit",
  description:
    "CPE Purchase & Allotment Evaluator — estimate Exhibit C ceilings against a PSAP allotment letter.",
  robots: { index: false, follow: false },
};

export default function CpeFitLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="cpe-fit">
      <CpeFitNav />
      <div className="banner">
        STATUS: DRAFT / INTERNAL. Advisor use only. Contract prices are ceilings, not quotes.
      </div>
      <div className="cpe-main">{children}</div>
      <footer className="cpe-foot">
        CPE Purchase &amp; Allotment Evaluator. Price data: {CPE_FIT_CATALOG_SOURCE}. Review before sharing
        with any PSAP.
      </footer>
    </div>
  );
}
