import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
import StaticHeroShell from "@/components/hero/StaticHeroShell";
import {
  AboutSection,
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
      <LabsSection />
      <WorkSection />
      <GithubSection />
      <AboutSection />
      <ContactSection />
      <Footer variant="parent" />
    </>
  );
}