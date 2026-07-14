import PublicSupportChat from "@/components/PublicSupportChat";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support · Key Holders",
  description:
    "Public Taskade site guide for The Key Holders portfolio, Geeks Next Door, and Trade — no password required.",
};

export default function SupportPage() {
  return <PublicSupportChat />;
}
