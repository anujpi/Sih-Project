"use client";

import { CheckCircle2, MapPinned, Rocket } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/reveal";

const ACTIVE = [
  { code: "EN", label: "English", status: "Supported today" },
];

const IN_DEV = [
  { code: "HI", label: "Hindi", status: "In development" },
  { code: "KN", label: "Kannada", status: "In development" },
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
      "rounded-xl border px-3 py-2 text-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary";
    if (kind === "active")
      return `${base} border-vn-green/30 bg-vn-green/5 ${
        isFocused ? "scale-105 shadow-md shadow-vn-green/20" : ""
      }`;
    if (kind === "dev")
      return `${base} border-vn-primary/30 bg-vn-primary/5 ${
        isFocused ? "scale-105 shadow-md shadow-vn-primary/20" : ""
      }`;
    return `${base} border-vn-indigo/25 bg-vn-indigo/5 ${
      isFocused ? "scale-105 shadow-md shadow-vn-indigo/20" : ""
    }`;
  }

  return (
    <section id="languages" className="vn-section scroll-mt-24 bg-vn-surface-blue-gray/40">
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-primary">
              Made for Indian conversations
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-navy sm:text-4xl">
              Built for Indian voices and phone audio
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vn-secondary">
              Scam pressure does not only happen in English. VAANISHIELD&apos;s intended target is
              Hinglish and India&apos;s multilingual phone traffic — the roadmap below shows the
              honest status.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-vn-border bg-white p-6 shadow-sm">
              <div className="relative flex flex-col items-center justify-center gap-8 py-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-vn-navy text-white shadow-md">
                    <MapPinned className="h-8 w-8" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold text-vn-navy">India focus</span>
                  <span className="text-[11px] text-vn-muted">Multilingual phone traffic</span>
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
                      <span className="block font-mono text-sm font-bold text-vn-green">
                        {lang.code}
                      </span>
                      <span className="block text-[10px] text-vn-muted">{lang.label}</span>
                    </button>
                  ))}
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-vn-green/30 bg-vn-green/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-vn-green">
                    <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                    Supported today
                  </span>
                </div>

                <div className="grid w-full grid-cols-2 gap-3">
                  <div className="rounded-xl border border-vn-primary/20 bg-vn-surface-blue/60 p-4">
                    <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-vn-primary">
                      In development
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
                          <span className="block font-mono text-sm font-bold text-vn-primary">
                            {lang.code}
                          </span>
                          <span className="block text-[10px] text-vn-muted">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-vn-indigo/20 bg-vn-indigo/5 p-4">
                    <p className="mb-2 flex items-center justify-center gap-1 text-center text-[10px] font-bold uppercase tracking-widest text-vn-indigo">
                      <Rocket className="h-3 w-3" aria-hidden="true" />
                      Roadmap
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
                          <span className="block font-mono text-sm font-bold text-vn-indigo">
                            {lang.code}
                          </span>
                          <span className="block text-[10px] text-vn-muted">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-4">
              <div className="rounded-2xl border border-vn-green/30 bg-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 text-sm font-bold text-vn-navy">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vn-green/10 text-vn-green">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  </span>
                  Working today
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-vn-secondary">
                  English — the current models are trained on English speech and audio
                  classification.
                </p>
              </div>

              <div className="rounded-2xl border border-vn-primary/25 bg-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 text-sm font-bold text-vn-navy">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vn-primary/10 text-vn-primary">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-vn-primary" />
                  </span>
                  In development
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-vn-secondary">
                  Hindi and Kannada speech-to-text and intent detection are next in the pipeline,
                  targeting Hinglish phone traffic.
                </p>
              </div>

              <div className="rounded-2xl border border-vn-indigo/25 bg-white p-5 shadow-sm">
                <h3 className="flex items-center gap-2 text-sm font-bold text-vn-navy">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vn-indigo/10 text-vn-indigo">
                    <span className="h-2 w-2 rounded-full bg-vn-indigo" />
                  </span>
                  Roadmap — not supported yet
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-vn-secondary">
                  Tamil, Telugu, Malayalam, Marathi, and Bengali are explicitly{" "}
                  <strong className="text-vn-navy">roadmap</strong> items. They are not claimed
                  as supported until models are built and validated on noisy, low-bandwidth phone
                  audio.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
