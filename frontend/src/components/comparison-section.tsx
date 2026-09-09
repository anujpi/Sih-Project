"use client";

import { Check, ShieldCheck, X } from "lucide-react";
import Reveal from "@/components/reveal";

const COMPARISON_ROWS = [
  {
    capability: "Primary Analysis Output",
    basic: "Binary Real / Fake probability label",
    vaanishield: "0–100 Unified Interaction Risk Verdict",
    highlight: true,
  },
  {
    capability: "Evaluated Signals",
    basic: "Acoustic audio file only",
    vaanishield: "Voice Authenticity + ECAPA-TDNN Speaker Identity + ASR Scam Intent",
  },
  {
    capability: "Human Impostor Defense",
    basic: "Fails (Human voice passes audio check)",
    vaanishield: "Caught via Layer 2 Voiceprint Vector Mismatch",
  },
  {
    capability: "Evidence Explainability",
    basic: "Opaque single confidence number",
    vaanishield: "4-Layer decomposed breakdown + transcript keyword highlighting",
  },
  {
    capability: "Mitigation Protocol",
    basic: "Detection display only (no action)",
    vaanishield: "Adaptive verification workflow (Channel phrase, Out-of-band hold)",
    highlight: true,
  },
  {
    capability: "Language & Telephony Target",
    basic: "Clean English audio baselines",
    vaanishield: "Multilingual Indian telephony & Hinglish roadmap",
  },
];

export default function ComparisonSection() {
  return (
    <section id="technology" className="vn-section border-b border-vn-border bg-white scroll-mt-24">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-vn-primary">
              System Benchmark
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-vn-navy sm:text-3xl">
              Standard Audio Deepfake Detector vs. VAANISHIELD Defense Layer
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-vn-secondary sm:text-sm">
              Single-point audio classifiers fail when genuine human voices impersonate executives or when voice clones lack acoustic flaws. VAANISHIELD protects the decision workflow.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-lg border border-vn-border bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_1fr] border-b border-vn-border sm:grid-cols-[1.2fr_1fr_1fr]">
              <div className="hidden items-center px-4 py-3 bg-vn-surface-blue font-mono text-[10px] font-bold uppercase tracking-wider text-vn-navy sm:flex">
                Evaluation Metric
              </div>
              <div className="flex items-center justify-center gap-2 border-l border-vn-border px-4 py-3 bg-vn-page text-vn-muted">
                <X className="h-4 w-4 text-vn-muted" aria-hidden="true" />
                <span className="font-mono text-xs font-bold text-vn-navy">Single-Point Classifier</span>
              </div>
              <div className="flex items-center justify-center gap-2 border-l border-vn-border px-4 py-3 bg-vn-surface-blue">
                <ShieldCheck className="h-4 w-4 text-vn-primary" aria-hidden="true" />
                <span className="font-mono text-xs font-bold text-vn-navy">VAANISHIELD Engine</span>
              </div>
            </div>

            {COMPARISON_ROWS.map((row, index) => (
              <div
                key={row.capability}
                className={`grid grid-cols-[1fr_1fr] border-b border-vn-border last:border-b-0 sm:grid-cols-[1.2fr_1fr_1fr] ${
                  index % 2 === 1 ? "bg-vn-page/40" : ""
                }`}
              >
                <div className="col-span-2 flex items-center border-b border-vn-border px-4 py-2.5 sm:col-span-1 sm:border-b-0">
                  <span className="font-mono text-xs font-semibold text-vn-navy">
                    {row.capability}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-vn-border px-4 py-2.5">
                  <X className="h-3.5 w-3.5 shrink-0 text-vn-muted" aria-hidden="true" />
                  <span className="text-xs leading-snug text-vn-secondary">{row.basic}</span>
                </div>
                <div className={`flex items-center gap-2 border-l border-vn-border px-4 py-2.5 ${row.highlight ? "bg-vn-surface-blue/80" : ""}`}>
                  <Check className="h-3.5 w-3.5 shrink-0 text-vn-green" aria-hidden="true" />
                  <span className={`text-xs font-semibold leading-snug ${row.highlight ? "text-vn-navy" : "text-vn-secondary"}`}>
                    {row.vaanishield}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="mx-auto mt-5 max-w-3xl text-center font-mono text-[11px] leading-relaxed text-vn-muted">
            VAANISHIELD models produce probabilistic scores, not absolute guarantees. When uncertainties exist in acoustic signals, Layer 4 triggers out-of-band human verification rather than making unsafe assumptions.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
