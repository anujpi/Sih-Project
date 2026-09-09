"use client";

import { CheckCircle2, MapPinned, Rocket } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/reveal";

const ACTIVE = [
  { code: "EN", label: "English (16 kHz)", status: "Active Baseline Model" },
];

const IN_DEV = [
  { code: "HI", label: "Hindi / Hinglish", status: "Fine-Tuning STT Corpus" },
  { code: "KN", label: "Kannada", status: "Acoustic Feature Alignment" },
];

const ROADMAP = [
  { code: "TA", label: "Tamil" },
  { code: "TE", label: "Telugu" },
  { code: "ML", label: "Malayalam" },
  { code: "MR", label: "Marathi" },
  { code: "BN", label: "Bengali" },
];

export default function LanguagesSection() {
  const [focus, setFocus] = useState<string | null>(null);

  function chipClass(kind: "active" | "dev" | "roadmap", isFocused: boolean) {
    const base =
      "rounded border px-3 py-2 text-center transition-all font-mono text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary";
    if (kind === "active")
      return `${base} border-vn-green bg-vn-green/10 text-vn-green ${
        isFocused ? "border-vn-navy shadow-sm" : ""
      }`;
    if (kind === "dev")
      return `${base} border-vn-primary bg-vn-surface-blue text-vn-primary ${
        isFocused ? "border-vn-navy shadow-sm" : ""
      }`;
    return `${base} border-vn-border bg-white text-vn-muted ${
      isFocused ? "border-vn-secondary text-vn-navy" : ""
    }`;
  }

  return (
    <section id="languages" className="vn-section border-b border-vn-border bg-vn-page scroll-mt-24">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-vn-primary">
              Multilingual Telephony Strategy
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-vn-navy sm:text-3xl">
              Engineered for Indian Phone Traffic & Code-Switched Audio
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-vn-secondary sm:text-sm">
              Social engineering attacks in India frequently target non-English speakers or leverage Hinglish code-switching. Below is our explicit model deployment roadmap.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="rounded-lg border border-vn-border bg-white p-5 shadow-sm">
              <div className="flex flex-col items-center justify-center gap-6 py-2">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-vn-border bg-vn-surface-blue text-vn-navy">
                    <MapPinned className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs font-bold text-vn-navy">India Regional Models</span>
                  <span className="font-mono text-[10px] text-vn-muted">Low-bandwidth 8kHz/16kHz audio focus</span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {ACTIVE.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onMouseEnter={() => setFocus(lang.code)}
                      onMouseLeave={() => setFocus(null)}
                      onFocus={() => setFocus(lang.code)}
                      onBlur={() => setFocus(null)}
                      className={chipClass("active", focus === lang.code)}
                    >
                      <span className="block font-bold">{lang.code}</span>
                      <span className="block text-[10px]">{lang.label}</span>
                    </button>
                  ))}
                  <span className="inline-flex items-center gap-1 rounded border border-vn-green bg-vn-green/10 px-2.5 py-1 font-mono text-[10px] font-bold text-vn-green">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    Deployed
                  </span>
                </div>

                <div className="grid w-full grid-cols-2 gap-3">
                  <div className="rounded-md border border-vn-border bg-vn-page p-3">
                    <p className="mb-2 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-vn-primary">
                      In Development
                    </p>
                    <div className="flex flex-col gap-2">
                      {IN_DEV.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onMouseEnter={() => setFocus(lang.code)}
                          onMouseLeave={() => setFocus(null)}
                          onFocus={() => setFocus(lang.code)}
                          onBlur={() => setFocus(null)}
                          className={chipClass("dev", focus === lang.code)}
                        >
                          <span className="block font-bold">{lang.code}</span>
                          <span className="block text-[10px]">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-md border border-vn-border bg-vn-page p-3">
                    <p className="mb-2 flex items-center justify-center gap-1 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                      <Rocket className="h-3 w-3" aria-hidden="true" />
                      Planned Roadmap
                    </p>
                    <div className="flex flex-col gap-2">
                      {ROADMAP.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onMouseEnter={() => setFocus(lang.code)}
                          onMouseLeave={() => setFocus(null)}
                          onFocus={() => setFocus(lang.code)}
                          onBlur={() => setFocus(null)}
                          className={chipClass("roadmap", focus === lang.code)}
                        >
                          <span className="block font-bold">{lang.code}</span>
                          <span className="block text-[10px]">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-3">
              <div className="rounded-lg border border-vn-border bg-white p-4 shadow-sm">
                <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-vn-navy">
                  <CheckCircle2 className="h-4 w-4 text-vn-green" aria-hidden="true" />
                  Deployed Baseline Model
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-vn-secondary">
                  English telephony models currently operational for Layer 1 wav2vec2 acoustic classification, Layer 2 ECAPA-TDNN speaker verification, and Layer 3 faster-whisper STT.
                </p>
              </div>

              <div className="rounded-lg border border-vn-border bg-white p-4 shadow-sm">
                <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-vn-navy">
                  <span className="h-2 w-2 rounded-full bg-vn-primary" />
                  Active Model Training Pipeline
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-vn-secondary">
                  Hindi and Kannada speech-to-text fine-tuning is under development to handle Hinglish code-switching and regional phone channel noise.
                </p>
              </div>

              <div className="rounded-lg border border-vn-border bg-white p-4 shadow-sm">
                <h3 className="flex items-center gap-2 font-mono text-xs font-bold text-vn-navy">
                  <span className="h-2 w-2 rounded-full bg-vn-muted" />
                  Future Roadmap (Not Claimed as Supported)
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-vn-secondary">
                  Tamil, Telugu, Malayalam, Marathi, and Bengali are explicit roadmap targets. VAANISHIELD does not report false language coverage before models are validated on noisy telemetry data.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
