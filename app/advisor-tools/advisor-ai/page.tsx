import AdvisorAiChat from "@/components/AdvisorAiChat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CA 9-1-1 Advisor AI",
  description:
    "Password-gated Grok assistant embodying CA 9-1-1 Branch Advisor guidance on PSAP funding, Manual policy, FOR prep, and NG9-1-1 — complements human Advisors.",
  robots: { index: false, follow: false },
};

export default function AdvisorAiPage() {
  return <AdvisorAiChat />;
}
