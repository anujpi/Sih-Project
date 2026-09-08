import type { Metadata } from "next";
import SiteNavbar from "@/components/site-navbar";
import InsightsClient from "@/components/insights-client";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Insights — VAANISHIELD",
  description:
    "Demo analysis history and system insights for VAANISHIELD voice impersonation defense.",
};

export default function InsightsPage() {
  return (
    <div className="relative min-h-screen pt-16">
      <SiteNavbar />
      <main>
        <InsightsClient />
      </main>
      <Footer />
    </div>
  );
}
