import SiteNavbar from "@/components/site-navbar";
import HeroSection from "@/components/hero-section";
import ProductTour from "@/components/product-tour";
import LayerStepper from "@/components/layer-stepper";
import ProblemSection from "@/components/problem-section";
import PipelineVisual from "@/components/pipeline-visual";
import ComparisonSection from "@/components/comparison-section";
import LanguagesSection from "@/components/languages-section";
import FinalCta from "@/components/final-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <SiteNavbar />
      <main>
        <HeroSection />
        <ProductTour />
        <LayerStepper />
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
