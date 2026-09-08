import SiteNavbar from "@/components/site-navbar";
import HeroSection from "@/components/hero-section";
import FeatureGrid from "@/components/feature-grid";
import ProblemSection from "@/components/problem-section";
import PipelineVisual from "@/components/pipeline-visual";
import ComparisonSection from "@/components/comparison-section";
import LanguagesSection from "@/components/languages-section";
import FinalCta from "@/components/final-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-vn-navy text-vn-text">
      <SiteNavbar />
      <main>
        <HeroSection />
        <FeatureGrid />
        <ProblemSection />
        <PipelineVisual />
        <ComparisonSection />
        <LanguagesSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}