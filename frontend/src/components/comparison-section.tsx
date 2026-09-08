"use client";

import { Check, X } from "lucide-react";
import Reveal from "@/components/reveal";

const BASIC_DETECTOR = [
  "Answers one question: is this audio fake?",
  "Binary real / not-real label",
  "Looks at the audio in isolation",
  "Stops at the verdict — detection only",
  "No action once a threat is flagged",
];

const VAANISHIELD = [
  "Answers the real question: is this interaction safe?",
  "Probabilistic, explainable 0–100 risk score",
  "Audio + identity + intent + context together",
  "Detection plus prevention: adaptive verification",
  "Escalates from a soft warning to mandatory verification",
  "India-focused language roadmap — English, Hindi, Kannada, and more",
];

export default function ComparisonSection() {
  return (
    <section id="technology" className="vn-section scroll-mt-24">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-violet">
              The difference
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-text sm:text-4xl">
              Not just a deepfake detector
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vn-muted">
              A voice clone detector is a tool. VAANISHIELD is a decision guard — it decides
              whether a conversation is safe, and helps you act on that decision.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal delay={60}>
            <div className="h-full rounded-2xl border border-vn-border bg-vn-surface/40 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-vn-muted">
                  <X className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-vn-text">Basic deepfake detector</h3>
              </div>
              <ul className="mt-6 space-y-3">
                {BASIC_DETECTOR.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-vn-muted">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-vn-muted/60" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div
              className="relative h-full overflow-hidden rounded-2xl border p-6 sm:p-8"
              style={{
                borderColor: "rgba(56,214,255,0.35)",
                background:
                  "linear-gradient(150deg, rgba(56,214,255,0.08), #0b1b32 55%, rgba(108,99,255,0.08))",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-vn-cyan to-vn-indigo text-vn-navy">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-vn-text">VAANISHIELD</h3>
                <span className="rounded-full border border-vn-cyan/30 bg-vn-cyan/10 px-2.5 py-0.5 text-[11px] font-semibold text-vn-cyan">
                  Detection + prevention
                </span>
              </div>
              <ul className="mt-6 space-y-3">
                {VAANISHIELD.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-vn-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-vn-cyan" aria-hidden="true" />
                    <span>
                      <span className="text-vn-text/90">{item}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}