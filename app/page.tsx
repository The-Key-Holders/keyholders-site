import Footer from "@/components/Footer";
import FoundersSection from "@/components/home/FoundersSection";
import VenturesSection from "@/components/home/VenturesSection";
import dynamic from "next/dynamic";
import StaticHeroShell from "@/components/hero/StaticHeroShell";
import {
  ContactSection,
  GithubSection,
  LabsSection,
  WorkSection,
} from "@/components/home/HomeSections";

const VaultHero = dynamic(() => import("@/components/hero/VaultHero"), {
  loading: () => <StaticHeroShell />,
});

export default function HomePage() {
  return (
    <>
      <VaultHero />
      <VenturesSection />
      <LabsSection />
      <WorkSection />
      <GithubSection />
      <FoundersSection />
      <ContactSection />
      <Footer variant="parent" />
    </>
  );
}