import type { Metadata } from "next";
import Link from "next/link";
import PortalNav from "@/components/psap-portal/PortalNav";
import PsapPortalChat from "@/components/psap-portal/PsapPortalChat";

export const metadata: Metadata = {
  title: "PSAP Funding Support Portal",
  description:
    "Cal OES PSAP funding, CPE contract transition (RFP 26-16743), SOW/invoice checkers, and Grok support agent.",
};

export default function PsapPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(34,211,238,0.12),transparent)]" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050810]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Link
                href="/psap-portal"
                className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight text-white"
              >
                PSAP Funding Portal
              </Link>
              <p className="text-[11px] uppercase tracking-wider text-white/40">
                The Key Holders · Cal OES Advisor tools · RFP 26-16743
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/45">
              <Link href="/advisor-tools" className="hover:text-cyanGlow">
                Advisor Tools Hub
              </Link>
              <Link href="/psap-allotment" className="hover:text-cyanGlow">
                Allotment Engine
              </Link>
            </div>
          </div>
          <PortalNav />
        </div>
      </header>
      <main className="relative">{children}</main>
      <footer className="relative mt-12 border-t border-white/10 py-8">
        <div className="mx-auto max-w-5xl px-4 text-xs text-white/40 sm:px-6">
          Not official Cal OES policy. Live Operations Manual, current forms, and your assigned
          Advisor control. Grok agent is guidance only — not a funding commitment. Sample Advisor
          data is fictional until replaced via Admin export/import.
        </div>
      </footer>
      <PsapPortalChat />
    </div>
  );
}
