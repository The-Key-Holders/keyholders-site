import AdvisorHelpAgentChat from "@/components/AdvisorHelpAgentChat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Hire + Automation Help Agent",
  description:
    "Password-gated Grok coach for onboarding and Advisor Tools — new hire docs and automation how-tos.",
  robots: { index: false, follow: false },
};

export default function AdvisorHelpAgentPage() {
  return <AdvisorHelpAgentChat />;
}
