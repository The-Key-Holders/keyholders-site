import AdvisorHelpAgentChat from "@/components/AdvisorHelpAgentChat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advisor Desk + Tools Help Agent",
  description:
    "Password-gated Grok coach for Funding Advisors (new and experienced) and Advisor Tools how-tos.",
  robots: { index: false, follow: false },
};

export default function AdvisorHelpAgentPage() {
  return <AdvisorHelpAgentChat />;
}
