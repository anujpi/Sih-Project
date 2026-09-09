"use client";

import { AudioLines, Fingerprint, MessageSquareText, Scale } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/reveal";

const FEATURES = [
  {
    icon: AudioLines,
    accent: "text-vn-cyan",
    bg: "bg-vn-cyan/10",
    solidBg: "bg-vn-cyan",
    border: "border-vn-cyan/40",
    title: "Layer 1: Acoustic Deepfake Classifier",
    eyebrow: "Voice Authenticity",
    copy: "Fine-tuned wav2vec2 sequence classifier listening for acoustic anomalies and phase artifacts characteristic of neural vocoders and voice conversion models.",
    detail:
      "Audio is resampled to 16 kHz mono. Acoustic feature frames are processed by wav2vec2 sequence layers. A synthetic probability at or above 50% flags synthetic generation.",
  },
  {
    icon: Fingerprint,
    accent: "text-vn-indigo",
    bg: "bg-vn-indigo/10",
    solidBg: "bg-vn-indigo",
    border: "border-vn-indigo/40",
    title: "Layer 2: ECAPA-TDNN Speaker Verification",
    eyebrow: "Identity Consistency",
    copy: "SpeechBrain ECAPA-TDNN neural voiceprint model extracts a 192-dimensional speaker embedding and evaluates cosine similarity against registered voiceprints.",
    detail:
      "Speaker similarity below threshold signals an identity mismatch. Catches human impersonators (e.g. social engineering calls) as well as AI voice clones.",
  },
  {
    icon: MessageSquareText,
    accent: "text-vn-blue",
    bg: "bg-vn-blue/10",
    solidBg: "bg-vn-blue",
    border: "border-vn-blue/40",
    title: "Layer 3: ASR + Scam Intent Classifier",
    eyebrow: "Transcript & Context Analysis",
    copy: "faster-whisper speech-to-text transcribes phone audio in real-time, scanning for 5 scam pressure indicators: OTPs, financial requests, urgency, authority, secrecy.",
    detail:
      "Evaluates transcript against pattern dictionaries. Each triggered indicator increments intent risk score (0.0 to 1.0) with explicit explanation for every flagged keyword.",
  },
  {
    icon: Scale,
    accent: "text-vn-amber",
    bg: "bg-vn-amber/10",
    solidBg: "bg-vn-amber",
    border: "border-vn-amber/40",
    title: "Layer 4: Unified Impersonation Risk Engine",
    eyebrow: "Explainable Risk Formula",
    copy: "Integrates Layer 1, 2, and 3 signals into a single 0–100 interaction score: Risk = 0.35(L1) + 0.25(L2) + 0.40(L3), mapped to 4 actionable operational tiers.",
    detail:
      "Tiers scale from Low (no interruption), Medium (warning display), High (out-of-band verification recommended), to Critical (mandatory intercept before sensitive action).",
  },
];

export default function FeatureGrid() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(0);
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rect = el.getBoundingClientRect();
            const viewTop = window.innerHeight * 0.3;
            const travel = Math.min(1, Math.max(0, (viewTop - rect.top) / rect.height));
            setActive(Math.min(FEATURES.length - 1, Math.floor(travel * FEATURES.length)));
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewTop = window.innerHeight * 0.3;
      const travel = Math.min(1, Math.max(0, (viewTop - rect.top) / rect.height));
      setActive(Math.min(FEATURES.length - 1, Math.floor(travel * FEATURES.length)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const feature = FEATURES[active];
  const FeatureIcon = feature.icon;

  return (
    <section id="how-it-works" className="vn-section border-b border-vn-border bg-white scroll-mt-24" ref={sectionRef}>
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-vn-primary">
              Multi-Layer Defense Matrix
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-vn-navy sm:text-3xl">
              Four Interlocking Signal Analysis Layers
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-vn-secondary sm:text-sm">
              Single binary classifiers fail against human impersonation and sophisticated voice clones. VAANISHIELD combines audio authenticity, speaker identity, and conversational intent into one deterministic risk formula.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* Left: layer list */}
          <ul className="space-y-3" aria-label="Four intelligence layers">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === active;
              const isDone = index < active;
              return (
                <li key={feature.title} className="flex items-stretch gap-4">
                  <div className="flex w-6 shrink-0 flex-col items-center" aria-hidden="true">
                    <span
                      className={`relative mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive
                          ? "border-vn-primary bg-vn-primary text-white"
                          : isDone
                            ? "border-vn-green bg-vn-green text-white"
                            : "border-vn-border bg-white"
                      }`}
                    >
                      <span className="font-mono text-[10px] font-bold">{index + 1}</span>
                    </span>
                    {index < FEATURES.length - 1 && (
                      <div className="my-1 w-px flex-1 bg-vn-border" />
                    )}
                  </div>

                  <button
                    type="button"
                    aria-current={isActive ? "step" : undefined}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className={`group relative flex-1 rounded-lg border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary ${
                      isActive
                        ? "border-vn-primary bg-vn-surface-blue"
                        : "border-vn-border bg-white hover:border-vn-secondary"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded border border-vn-border bg-white text-vn-navy">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                        Layer 0{index + 1}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm font-bold text-vn-navy">
                      {feature.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-vn-secondary">
                      {feature.copy}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right: layer technical specification */}
          <Reveal delay={120} className="h-full">
            <div className="flex h-full min-h-[320px] flex-col justify-between rounded-lg border border-vn-border bg-vn-page p-5 sm:p-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded border border-vn-border bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-vn-navy">
                  <FeatureIcon className="h-3.5 w-3.5 text-vn-primary" aria-hidden="true" />
                  {feature.eyebrow}
                </span>
                <h3 className="mt-3 text-lg font-bold text-vn-navy">
                  {feature.title}
                </h3>
                <p
                  key={active}
                  className="mt-3 rounded-md border border-vn-border bg-white p-4 font-mono text-xs leading-relaxed text-vn-secondary"
                >
                  {feature.detail}
                </p>
              </div>

              <div className="mt-6 space-y-1.5 border-t border-vn-border pt-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                  Pipeline Stage Checkpoint
                </p>
                <div className="flex items-center gap-2">
                  {FEATURES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= active ? "bg-vn-primary" : "bg-vn-border"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="font-mono text-[11px] text-vn-secondary">
                  Layer {active + 1} of {FEATURES.length} — {feature.title}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}