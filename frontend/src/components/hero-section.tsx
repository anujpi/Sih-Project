"use client";

import { ArrowRight, Play, Shield, Terminal } from "lucide-react";
import Link from "next/link";
import LiveGuardWidget from "@/components/live-guard-widget";
import Reveal from "@/components/reveal";

const METRICS = [
  { label: "Layer 1 Baseline", value: "wav2vec2-base (16 kHz)" },
  { label: "Layer 2 Verification", value: "SpeechBrain ECAPA-TDNN" },
  { label: "Layer 3 STT Engine", value: "faster-whisper" },
  { label: "Layer 4 Risk Formula", value: "0.35 L1 + 0.25 L2 + 0.40 L3" },
];

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate border-b border-vn-border bg-vn-page pb-16 pt-20 sm:pb-20 sm:pt-28"
    >
      <div className="vn-container grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        {/* Copy */}
        <Reveal>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-md border border-vn-border bg-white px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-vn-navy shadow-sm">
              <Shield className="h-3.5 w-3.5 text-vn-primary" aria-hidden="true" />
              <span>SIH26104 Security Architecture</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-vn-navy sm:text-4xl lg:text-[2.8rem]">
              Real-Time Voice Impersonation & Cloned-Audio Defense Matrix
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-vn-secondary sm:text-base">
              VAANISHIELD cross-examines incoming call audio across four parallel signal layers — acoustic synthetic voice detection, speaker voiceprint similarity, speech transcript intent, and a unified explainable risk engine — before critical decisions or financial actions are authorized.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-md bg-vn-navy px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep active:scale-[0.98]"
              >
                <Play className="h-3.5 w-3.5 text-vn-blue" aria-hidden="true" />
                Launch Security Console
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-md border border-vn-border bg-white px-5 py-2.5 text-xs font-bold text-vn-navy transition-colors hover:border-vn-secondary hover:bg-vn-page"
              >
                <Terminal className="h-3.5 w-3.5 text-vn-secondary" aria-hidden="true" />
                Pipeline Specification
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Architecture Metrics Table */}
            <div className="mt-8 grid grid-cols-2 gap-2 border-t border-vn-border pt-5">
              {METRICS.map((m) => (
                <div key={m.label} className="rounded border border-vn-border bg-white p-2.5 font-mono">
                  <span className="block text-[10px] uppercase tracking-wider text-vn-muted">{m.label}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-vn-navy">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Hero telemetry panel */}
        <Reveal delay={120}>
          <div className="rounded-xl border border-vn-border bg-white p-4 shadow-sm">
            <LiveGuardWidget state="idle" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
