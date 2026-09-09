"use client";

import {
  CheckCircle2,
  FileAudio,
  Gauge,
  MessageSquareText,
  UserCheck2,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/reveal";

const PIPELINE = [
  {
    icon: FileAudio,
    label: "Voice",
    copy: "A recorded call, live stream, or uploaded file enters the guard. Acoustic features are extracted for every layer.",
  },
  {
    icon: UserCheck2,
    label: "Identity",
    copy: "The caller's voiceprint is compared against a trusted reference. This also catches a human caller impersonating someone you know.",
  },
  {
    icon: MessageSquareText,
    label: "Intent",
    copy: "The conversation is transcribed and scanned for social-engineering pressure: OTP spills, urgent transfers, secrecy demands.",
  },
  {
    icon: Gauge,
    label: "Risk",
    copy: "All signals fuse into one explainable 0–100 impersonation risk score with a readable, layer-by-layer breakdown.",
  },
  {
    icon: CheckCircle2,
    label: "Verification",
    copy: "Low-risk calls proceed. High and critical ones trigger out-of-band verification before any sensitive action.",
  },
];

const ACCENTS = {
  cyan: { text: "text-vn-cyan", bg: "bg-vn-cyan/10", border: "border-vn-cyan/30" },
  indigo: { text: "text-vn-indigo", bg: "bg-vn-indigo/10", border: "border-vn-indigo/30" },
  blue: { text: "text-vn-blue", bg: "bg-vn-blue/10", border: "border-vn-blue/30" },
  amber: { text: "text-vn-amber", bg: "bg-vn-amber/10", border: "border-vn-amber/30" },
  green: { text: "text-vn-green", bg: "bg-vn-green/10", border: "border-vn-green/30" },
};

export default function PipelineVisual() {
  const [open, setOpen] = useState<number | null>(0);
  const stepAccents = [ACCENTS.cyan, ACCENTS.indigo, ACCENTS.blue, ACCENTS.amber, ACCENTS.green];

  return (
    <section className="vn-section">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-primary">
              From detection to prevention
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-navy sm:text-4xl">
              From detection to prevention
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vn-secondary">
              VAANISHIELD doesn&apos;t stop at a label. It converts analysis into an action you
              can take before anything dangerous happens. Select a stage to read what it does.
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <Reveal>
            <ol className="space-y-3 lg:grid lg:grid-cols-5 lg:gap-3 lg:space-y-0">
              {PIPELINE.map((step, index) => {
                const Icon = step.icon;
                const accent = stepAccents[index];
                const isOpen = open === index;
                return (
                  <li key={step.label} className="relative flex items-stretch">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className={`group relative flex w-full flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary lg:flex-col lg:items-center lg:gap-0 lg:p-4 lg:text-center ${
                        isOpen
                          ? "border-vn-primary/25 bg-white shadow-md"
                          : "border-vn-border bg-white/60 hover:bg-white"
                      }`}
                    >
                      {index < PIPELINE.length - 1 && (
                        <span
                          className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-vn-border bg-white lg:flex"
                          aria-hidden="true"
                        >
                          <ArrowRight className="h-3 w-3 text-vn-primary" />
                        </span>
                      )}

                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent.bg} ${accent.text} lg:mx-auto`}>
                        <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                      </span>

                      <span className="min-w-0 lg:mt-3">
                        <span className="block font-mono text-[10px] text-vn-muted">
                          0{index + 1}
                        </span>
                        <span className="block text-sm font-bold text-vn-navy">{step.label}</span>
                      </span>

                      <span
                        className={`mt-auto hidden items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest transition-colors lg:mx-auto lg:mt-3 ${
                          isOpen ? `${accent.border} ${accent.text}` : "border-transparent text-vn-muted"
                        }`}
                      >
                        {isOpen ? "Reading" : "Tap"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="mt-6" aria-live="polite">
            <div key={open}>
              {open !== null && (
                <div className="flex items-start gap-4 rounded-2xl border border-vn-border bg-white p-5 sm:p-6 shadow-sm vn-anim-rise">
                  <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-vn-primary/30" />
                    <span className="h-3 w-3 rounded-full bg-vn-primary/80" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-vn-muted">
                      Stage 0{open + 1} of {PIPELINE.length}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-vn-navy">
                      {PIPELINE[open].label}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-vn-secondary">
                      {PIPELINE[open].copy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
