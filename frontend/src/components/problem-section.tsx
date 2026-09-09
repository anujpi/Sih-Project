"use client";

import { AlertTriangle, ShieldAlert, UserX2 } from "lucide-react";
import Reveal from "@/components/reveal";

const THREAT_VECTORS = [
  {
    title: "Zero-Shot Voice Synthesis (3-Second Samples)",
    copy: "Modern neural vocoders require under 3 seconds of public audio to synthesize convincing speech clones capable of defeating human auditory perception.",
  },
  {
    title: "Human Auditory Failure Mode",
    copy: "In acoustic evaluations, untrained human listeners fail to distinguish zero-shot neural voice clones from authentic speech over standard 8 kHz/16 kHz telephony codecs.",
  },
  {
    title: "Social Engineering Exploitation Window",
    copy: "Attackers combine cloned voice samples with high-pressure scam vectors (OTP requests, urgent bank transfers, authority claims) to coerce instant compliance before verification.",
  },
];

export default function ProblemSection() {
  return (
    <section className="vn-section border-b border-vn-border bg-vn-page">
      <div className="vn-container">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-vn-amber">
                Threat Landscape Analysis
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-vn-navy sm:text-3xl">
                Why Audio-Only Binary Detectors Are Insufficient
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-vn-secondary sm:text-sm">
                A simple &quot;real vs fake&quot; classifier cannot prevent impersonation fraud. Human impostors can spoof identity using genuine voice audio, while AI clones bypass traditional voice authentication. Security requires verifying voice authenticity, speaker identity, and conversational intent simultaneously.
              </p>
            </div>
          </Reveal>

          <div className="space-y-3">
            {THREAT_VECTORS.map((item, index) => {
              const Icon = index === 2 ? ShieldAlert : AlertTriangle;
              return (
                <Reveal key={item.title} delay={index * 90}>
                  <div className="flex items-start gap-3.5 rounded-lg border border-vn-border bg-white p-4 shadow-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-vn-border bg-vn-surface-blue text-vn-amber">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-vn-navy sm:text-sm">{item.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-vn-secondary">{item.copy}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="relative mx-auto mt-10 max-w-4xl rounded-lg border border-vn-border bg-white p-6 text-center shadow-sm">
            <blockquote className="font-mono text-base font-bold leading-snug tracking-tight text-vn-navy sm:text-lg">
              &ldquo;When a voice can be cloned, <span className="text-vn-primary">voice acoustic signal alone</span> is no longer a valid security token.&rdquo;
            </blockquote>
            <figcaption className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-vn-muted">
              VAANISHIELD SIH26104 Core Security Principle
            </figcaption>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
