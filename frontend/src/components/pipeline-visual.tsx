"use client";

import {
  CheckCircle2,
  ChevronDown,
  FileAudio,
  Gauge,
  ShieldQuestion,
  UserCheck2,
} from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/reveal";

const PIPELINE = [
  {
    icon: FileAudio,
    label: "Audio input",
    copy: "A recorded call, live stream, or uploaded file enters the guard.",
    accent: "text-vn-cyan",
    bar: "bg-vn-cyan",
  },
  {
    icon: ShieldQuestion,
    label: "Synthetic check",
    copy: "Acoustic features are scored for AI-generation fingerprints.",
    accent: "text-vn-cyan",
    bar: "bg-vn-cyan",
  },
  {
    icon: UserCheck2,
    label: "Identity check",
    copy: "The caller is compared to a trusted reference voiceprint.",
    accent: "text-vn-indigo",
    bar: "bg-vn-indigo",
  },
  {
    icon: Gauge,
    label: "Risk verdict",
    copy: "Intent signals fuse into one explainable 0–100 risk score.",
    accent: "text-vn-violet",
    bar: "bg-vn-violet",
  },
  {
    icon: CheckCircle2,
    label: "Verification action",
    copy: "Low-risk calls proceed; risky ones trigger out-of-band verification.",
    accent: "text-vn-green",
    bar: "bg-vn-green",
  },
];

export default function PipelineVisual() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="vn-section">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-indigo">
              From detection to prevention
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-text sm:text-4xl">
              From detection to prevention
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vn-muted">
              VAANISHIELD doesn&apos;t stop at a label. It converts analysis into an action you
              can take before anything dangerous happens. Select a stage to read what it does.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          {PIPELINE.map((step, index) => {
            const Icon = step.icon;
            const isOpen = open === index;
            return (
              <Reveal key={step.label} delay={index * 80}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`pipeline-detail-${index}`}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className={`relative h-full w-full rounded-2xl border p-5 text-center transition-all hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan ${
                    isOpen
                      ? "border-vn-indigo/50 bg-vn-surface/90 shadow-xl shadow-vn-indigo/10"
                      : "border-vn-border bg-vn-surface/50 hover:bg-vn-surface/80"
                  }`}
                >
                  {index < PIPELINE.length - 1 && (
                    <div
                      className={`absolute right-[-14px] top-1/2 hidden h-px w-7 md:block ${step.bar}`}
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${step.accent}`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block font-mono text-[11px] text-vn-muted">
                    0{index + 1}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-vn-text">{step.label}</h3>
                  <span
                    className={`mx-auto mt-2 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                      isOpen ? "text-vn-indigo" : "text-vn-muted"
                    }`}
                  >
                    {isOpen ? "Hide" : "Tap to read"}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </span>
                  <div
                    id={`pipeline-detail-${index}`}
                    role="region"
                    className={`overflow-hidden text-left transition-all ${
                      isOpen ? "mt-3 max-h-48" : "max-h-0"
                    }`}
                  >
                    <p className="rounded-lg border border-vn-border bg-vn-navy/40 px-3 py-2.5 text-xs leading-relaxed text-vn-muted">
                      {step.copy}
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}