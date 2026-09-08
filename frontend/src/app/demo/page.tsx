import type { Metadata } from "next";
import DemoShell from "@/components/demo-shell";

export const metadata: Metadata = {
  title: "Live Demo — VAANISHIELD Voice Security Console",
  description:
    "Interactive voice impersonation risk console for VAANISHIELD. Choose a scenario, watch all four intelligence layers score a voice interaction, and review the evidence cards.",
};

export default function DemoPage() {
  return <DemoShell />;
}