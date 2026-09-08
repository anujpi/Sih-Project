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
    title: "Synthetic voice detection",
    eyebrow: "Voice authenticity",
    copy: "A fine-tuned wav2vec2 classifier listens for the acoustic fingerprints of AI-generated speech — even high-fidelity clones. It answers: does this voice sound machine-generated?",
    detail:
      "Audio is normalized to 16 kHz and scored by a wav2vec2 sequence classifier. A synthetic probability at or above 50% is labeled synthetic — the first red flag of a cloned identity.",
  },
  {
    icon: Fingerprint,
    accent: "text-vn-indigo",
    bg: "bg-vn-indigo/10",
    solidBg: "bg-vn-indigo",
    border: "border-vn-indigo/40",
    title: "Speaker identity verification",
    eyebrow: "Identity consistency",
    copy: "An ECAPA-TDNN voiceprint model checks the caller against a trusted reference. A human impostor is caught too — not just synthetic audio.",
    detail:
      "The caller's embedding is compared to a registered voiceprint. A low cosine similarity is a mismatch — evidence that a real human voice can still be an impersonation attack.",
  },
  {
    icon: MessageSquareText,
    accent: "text-vn-violet",
    bg: "bg-vn-violet/10",
    solidBg: "bg-vn-violet",
    border: "border-vn-violet/40",
    title: "Speech-to-text + scam intent",
    eyebrow: "Scam-intent analysis",
    copy: "Conversations are transcribed with faster-whisper and scanned for the pressure signals scammers rely on: OTPs, urgent transfers, secrecy, authority claims.",
    detail:
      "The transcript is searched for risky terms — OTP, money, transfer, urgent, secret, authority. Each triggered pattern raises the intent risk, capped at 100%. Everything is explained, never hidden.",
  },
  {
    icon: Scale,
    accent: "text-vn-amber",
    bg: "bg-vn-amber/10",
    solidBg: "bg-vn-amber",
    border: "border-vn-amber/40",
    title: "Explainable risk engine",
    eyebrow: "Adaptive response",
    copy: "The signals combine into one 0–100 impersonation risk score with a readable breakdown — and an adaptive response scaled to the threat.",
    detail:
      "Voice authenticity, identity mismatch, and intent risk are weighted into one explainable tier: Low (proceed), Medium (caution), High (verify caller), Critical (block before acting).",
  },
];

export default function FeatureGrid() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Scroll-driven: as the block enters the viewport, walk the signal line
  // through the layers so the active layer tracks the scroll position.
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
    <section id="how-it-works" className="vn-section scroll-mt-24" ref={sectionRef}>
      <div className="vn-container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-vn-cyan">
              Four intelligence layers
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-text sm:text-4xl">
              How VAANISHIELD protects you
            </h2>
            <p className="mt-4 text-base leading-relaxed text-vn-muted">
              No single model can defend a relationship. VAANISHIELD cross-checks the voice, the
              claimed identity, and what the caller is asking for — then explains its verdict.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          {/* Left: vertical step sequence with a traveling signal line */}
          <ul className="space-y-4" aria-label="Four intelligence layers">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === active;
              const isDone = index < active;
              return (
                <li key={feature.title} className="flex items-stretch gap-5">
                  {/* Node column: dot on top, connector filling below */}
                  <div className="flex w-7 shrink-0 flex-col items-center" aria-hidden="true">
                    <span
                      className={`relative mt-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive
                          ? "border-vn-cyan"
                          : isDone
                            ? "border-vn-green/60 bg-vn-green/10"
                            : "border-vn-border bg-vn-navy-2"
                      }`}
                    >
                      {isActive && (
                        <>
                          <span className="h-2.5 w-2.5 rounded-full bg-vn-cyan" />
                          <span className="absolute inset-0 animate-ping rounded-full bg-vn-cyan/40" />
                        </>
                      )}
                      {isDone && <span className="h-2 w-2 rounded-full bg-vn-green" />}
                    </span>
                    {/* Connector segment to the next node */}
                    {index < FEATURES.length - 1 && (
                      <div className="my-1 w-px flex-1 bg-vn-border">
                        <div
                          className={`w-px transition-all duration-500 ${
                            isDone ? "h-full bg-vn-green/70" : "h-0"
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    aria-current={isActive ? "step" : undefined}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className={`group relative flex-1 rounded-2xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan sm:p-5 ${
                      isActive
                        ? `${feature.border} bg-vn-surface/80 shadow-xl shadow-black/30`
                        : "border-transparent bg-vn-surface/30 hover:bg-vn-surface/50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                          isActive ? `${feature.bg} ${feature.accent}` : "bg-white/5 text-vn-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-vn-muted">
                        Layer 0{index + 1}
                      </span>
                    </span>
                    <span
                      className={`mt-2 block text-base font-bold transition-colors ${
                        isActive ? "text-vn-text" : "text-vn-text/80"
                      }`}
                    >
                      {feature.title}
                    </span>
                    <span
                      className={`mt-1 block text-sm leading-relaxed transition-colors ${
                        isActive ? "text-vn-secondary" : "text-vn-muted"
                      }`}
                    >
                      {feature.copy}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right: active layer detail + pipeline state */}
          <Reveal delay={120} className="h-full">
            <div className="flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl border border-vn-border bg-vn-midnight/50 p-6 sm:p-8">
              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${feature.border} ${feature.accent} ${feature.bg}`}
                >
                  <FeatureIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  {feature.eyebrow}
                </span>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-vn-text">
                  {feature.title}
                </h3>
                <p
                  key={active}
                  className="mt-3 min-h-[96px] rounded-xl border border-vn-border bg-vn-navy-2/50 p-4 text-sm leading-relaxed text-vn-secondary vn-anim-rise"
                >
                  {feature.detail}
                </p>
              </div>

              {/* Pipeline checkpoint */}
              <div
                className="mt-6 space-y-1.5"
                aria-live="polite"
              >
                <p className="text-[11px] font-semibold uppercase tracking-widest text-vn-muted">
                  Pipeline checkpoint
                </p>
                <div className="flex items-center gap-2">
                  {FEATURES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        i < active ? "bg-vn-green" : i === active ? `${FEATURES[i].solidBg} vn-pulse-soft` : "bg-white/10"
                      }`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="text-xs text-vn-muted">
                  Layer {active + 1} of {FEATURES.length} —{" "}
                  <span className="font-semibold text-vn-text">{feature.title}</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}