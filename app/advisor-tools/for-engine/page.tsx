import ForEngineApp from "@/components/ForEngineApp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FOR Assembly Engine",
  description:
    "Assemble Fiscal & Operational Review draft packages for Cal OES Funding Advisors — password-gated.",
  robots: { index: false, follow: false },
};

export default function ForEnginePage() {
  return <ForEngineApp />;
}
