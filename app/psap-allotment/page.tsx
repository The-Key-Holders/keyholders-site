import PsapAllotmentApp from "@/components/PsapAllotmentApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PSAP Allotment Engine",
  description:
    "Calculate PSAP CPE fixed allotment funding levels from ECaTS exports — Chapter III workflow automation.",
};

export default function PsapAllotmentPage() {
  return <PsapAllotmentApp />;
}