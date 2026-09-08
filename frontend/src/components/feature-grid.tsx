"use client";

import { AudioLines, Fingerprint, MessageSquareText, Scale } from "lucide-react";
import Reveal from "@/components/reveal";

const FEATURES = [
  {
    icon: AudioLines,
    accent: "text-vn-cyan",
    bg: "bg-vn-cyan/10",
    border: "hover:border-vn-cyan/40",
    title: "Synthetic voice detection",
    copy: "A fine-tuned wav2vec2 classifier listens for the acoustic fingerprints of AI-generated speech — even high-fidelity clones.",
    tag: "Layer 01",
  },
  {
    icon: Fingerprint,
    accent: "text-vn-indigo",
    bg: "bg-vn-indigo/10",
    border: "hover:border-vn-indigo/40",
    title: "Speaker identity verification",
    copy: "An ECAPA-TDNN voiceprint model checks the caller against a trusted reference. A human impostor is caught too — not just synthetic audio.",
    tag: "Layer 02",
  },
  {
    icon: MessageSquareText,
    accent: "text-vn-violet",
    bg: "bg-vn-violet/10",
    border: "hover:border-vn-violet/40",
    title: "Speech-to-text + scam intent",
    copy: "Conversations are transcribed with faster-whisper and scanned for the pressure signals scammers rely on: OTPs, urgent transfers, secrecy, authority claims.",
    tag: "Layer 03",
  },
  {
    icon: Scale,
    accent: "text-vn-amber",
    bg: "bg-vn-amber/10",
    border: "hover:border-vn-amber/40",
    title: "Explainable risk engine",
    copy: "The four signals combine into one 0–100 impersonation risk score with a readable breakdown — and an adaptive response scaled to the threat.",
    tag: "Layer 04",
  },
];

export default function FeatureGrid() {
  return (
    <section id="how-it-works" className="vn-section scroll-mt-24">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-cyan">
              Four intelligence layers
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-text sm:text-4xl">
              How VAANISHIELD protects you
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vn-muted">
              No single model can defend a relationship. VAANISHIELD cross-checks the voice,
              the claimed identity, and what the caller is asking for — then explains its verdict.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={index * 90}>
                <div
                  className={`group h-full rounded-2xl border border-vn-border bg-vn-surface/50 p-6 transition-all hover:-translate-y-1 hover:bg-vn-surface/80 hover:shadow-xl hover:shadow-black/30 ${feature.border}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} ${feature.accent}`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-vn-muted">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-bold text-vn-text">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-vn-muted">{feature.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}