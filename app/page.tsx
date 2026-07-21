import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import StaticHeroShell from "@/components/hero/StaticHeroShell";
import PcfVaultReleaseSection from "@/components/home/PcfVaultReleaseSection";
import {
  AboutSection,
  ContactSection,
  GithubSection,
  PortfolioSection,
  ProjectsSection,
  WorkSection,
} from "@/components/home/HomeSections";

const VaultHero = dynamic(() => import("@/components/hero/VaultHero"), {
  loading: () => <StaticHeroShell />,
});

export default function HomePage() {
  return (
    <>
      <VaultHero />
      <PcfVaultReleaseSection />
      <PortfolioSection />
      <ProjectsSection />
      <WorkSection />
      <GithubSection />
      <AboutSection />
      <ContactSection />
      <Footer variant="parent" />
    </>
  );
}
