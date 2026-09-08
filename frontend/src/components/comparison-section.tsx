"use client";

import { Check, X, ShieldCheck } from "lucide-react";
import Reveal from "@/components/reveal";

const COMPARISON_ROWS = [
  {
    capability: "Primary result",
    basic: "Real / Fake",
    vaanishield: "Interaction risk",
    highlight: true,
  },
  {
    capability: "Signals analyzed",
    basic: "Audio only",
    vaanishield: "Voice + identity + intent",
  },
  {
    capability: "Explanation",
    basic: "Limited",
    vaanishield: "Evidence breakdown",
  },
  {
    capability: "Action after detection",
    basic: "Detection only",
    vaanishield: "Adaptive verification",
    highlight: true,
  },
  {
    capability: "Language direction",
    basic: "Generic",
    vaanishield: "India-focused roadmap",
  },
];

export default function ComparisonSection() {
  return (
    <section id="technology" className="vn-section scroll-mt-24">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-primary">
              The difference
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-navy sm:text-4xl">
              Not just a deepfake detector
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vn-secondary">
              A voice clone detector is a tool. VAANISHIELD is a decision guard — it decides
              whether a conversation is safe, and helps you act on that decision.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-vn-border bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[1.15fr_1fr_1fr]">
              <div className="hidden items-center px-5 py-4 bg-vn-surface-blue text-[11px] font-semibold uppercase tracking-widest text-vn-secondary sm:flex">
                Capability
              </div>
              <div className="flex items-center justify-center gap-2 border-l border-vn-border px-4 py-4 bg-vn-surface-blue/60">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-vn-border/50 text-vn-muted">
                  <X className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-vn-navy">Basic detector</span>
              </div>
              <div className="flex items-center justify-center gap-2 border-l border-vn-border px-4 py-4 bg-vn-surface-blue">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-vn-navy text-white">
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-bold text-vn-navy">VAANISHIELD</span>
              </div>
            </div>

            {COMPARISON_ROWS.map((row, index) => (
              <div
                key={row.capability}
                className={`grid grid-cols-[1fr_1fr] sm:grid-cols-[1.15fr_1fr_1fr] ${
                  index % 2 === 1 ? "bg-vn-page/60" : ""
                }`}
              >
                <div className="col-span-2 flex items-center gap-3 border-t border-vn-border px-5 py-3 sm:col-span-1 sm:py-0">
                  <span className="text-xs font-semibold uppercase tracking-wide text-vn-secondary sm:text-sm sm:font-bold sm:tracking-tight sm:normal-case sm:text-vn-navy">
                    {row.capability}
                  </span>
                </div>
                <div className="flex items-center gap-2 border-l border-vn-border px-4 py-3 text-right sm:justify-start sm:text-left">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-vn-muted/50"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-snug text-vn-secondary">{row.basic}</span>
                </div>
                <div className={`flex items-center gap-2 border-l border-vn-border px-4 py-3 text-right sm:justify-start sm:text-left ${row.highlight ? "bg-vn-surface-blue/80" : ""}`}>
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-vn-primary"
                    aria-hidden="true"
                  />
                  <span className={`text-sm font-semibold leading-snug ${row.highlight ? "text-vn-navy" : "text-vn-secondary"}`}>
                    {row.vaanishield}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-vn-muted">
            VAANISHIELD still reports honest probabilities — it does not claim to detect every
            clone. The difference is in what the product does with the signal: it escalates from a
            soft warning to mandatory verification before a sensitive action.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
