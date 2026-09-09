import type { Metadata } from "next";
import SiteNavbar from "@/components/site-navbar";
import LayerStepper from "@/components/layer-stepper";
import PipelineVisual from "@/components/pipeline-visual";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "How It Works — VAANISHIELD",
  description:
    "Explore the four intelligence layers of VAANISHIELD — voice authenticity, identity verification, conversation intent, and adaptive response — interactively.",
};

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen pt-16">
      <SiteNavbar />
      <main>
        <section className="vn-section">
          <div className="vn-container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-vn-primary">
                Interactive walkthrough
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-navy sm:text-4xl">
                How VAANISHIELD works
              </h1>
              <p className="mt-4 text-base leading-relaxed text-vn-secondary">
                When a voice can be cloned, voice alone cannot be trusted. VAANISHIELD analyzes
                the voice, the claimed identity, and the conversation context before a dangerous
                decision is made.
              </p>
            </div>
          </div>
        </section>
        <LayerStepper />
        <PipelineVisual />
      </main>
      <Footer />
    </div>
  );
}
