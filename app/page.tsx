import Footer from "@/components/Footer";
import VaultHero from "@/components/hero/VaultHero";
import {
  AboutSection,
  ContactSection,
  GithubSection,
  LabsSection,
  WorkSection,
} from "@/components/home/HomeSections";

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