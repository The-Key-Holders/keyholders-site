import AdvisorHelpAgentChat from "@/components/AdvisorHelpAgentChat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Hire + Automation Help Agent",
  description:
    "Password-gated chat with the New Hire + Automation Tool Help agent — onboarding and Advisor Tools coaching.",
  robots: { index: false, follow: false },
};

export default function AdvisorHelpAgentPage() {
  return <AdvisorHelpAgentChat />;
}
