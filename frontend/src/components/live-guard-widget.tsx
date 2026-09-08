"use client";

import {
  AudioLines,
  Fingerprint,
  MessageSquareText,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

const SIGNALS = [
  {
    id: "voice",
    label: "Voice",
    icon: AudioLines,
    copy: "Scores acoustic features for AI-generation fingerprints using a fine-tuned wav2vec2 model — how likely is this audio machine-generated?",
  },
  {
    id: "identity",
    label: "Identity",
    icon: Fingerprint,
    copy: "Compares the caller against a trusted reference voiceprint (ECAPA-TDNN) — is this really who they claim to be?",
  },
  {
    id: "intent",
    label: "Intent",
    icon: MessageSquareText,
    copy: "Transcribes the conversation and flags social-engineering pressure: OTP spills, urgent transfers, secrecy demands, and authority claims.",
  },
  {
    id: "context",
    label: "Context",
    icon: Scale,
    copy: "Fuses every signal into one explainable 0–100 impersonation risk score — then decides what the right action is.",
  },
] as const;

type SignalId = (typeof SIGNALS)[number]["id"];

export default function LiveGuardWidget() {
  const [active, setActive] = useState<SignalId | null>(null);
  const activeSignal = SIGNALS.find((s) => s.id === active) ?? null;

  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Decorative glow anchored to the diagram container */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 rounded-[calc(var(--radius-card)+8px)] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 45%, rgba(56,214,255,0.16), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="glass-panel relative overflow-hidden p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3 border-b border-vn-border pb-4">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-vn-muted">
            Live guard
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-vn-green/30 bg-vn-green/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-vn-green">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-vn-green vn-pulse-soft" aria-hidden="true" />
            Protection active
          </span>
        </div>

        {/* Core visual — stable region, centered stack */}
        <div className="relative mt-4 flex min-h-[248px] flex-col items-center justify-center sm:min-h-[264px]">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 420 260"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="vn-wave-in" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38d6ff" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38d6ff" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="vn-shield-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38d6ff" />
                <stop offset="100%" stopColor="#6c63ff" />
              </linearGradient>
            </defs>

            {/* Incoming waveform (behind the shield, anchored to container) */}
            <path d="M6 130 q14 -34 26 0 t26 0 t26 0 t26 0 t26 0 t26 0" stroke="url(#vn-wave-in)" strokeWidth="2" fill="none" className="vn-wave-slide" opacity="0.5" />
            <text x="10" y="104" fill="#94a3b8" fontSize="11" fontFamily="monospace">
              audio in
            </text>

            {/* Outgoing direction */}
            <path d="M330 130 q14 -30 26 0 t26 0 t26 0" stroke="url(#vn-wave-in)" strokeWidth="2" fill="none" opacity="0.35" />
            <text x="344" y="104" fill="#94a3b8" fontSize="11" fontFamily="monospace">
              verdict out
            </text>
          </svg>

          {/* Shield core */}
          <svg
            viewBox="0 0 240 240"
            className="relative h-[200px] w-[200px] sm:h-[216px] sm:w-[216px]"
            role="img"
            aria-label="VAANISHIELD shield core with an animated analysis ring"
          >
            <defs>
              <linearGradient id="vn-ring" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38d6ff" />
                <stop offset="100%" stopColor="#6c63ff" />
              </linearGradient>
            </defs>

            {/* Ring track */}
            <circle cx="120" cy="120" r="100" fill="#0b1b32" stroke="rgba(148,163,184,0.16)" strokeWidth="6" />
            {/* Animated analysis ring (dashes travel the track) */}
            <circle
              cx="120"
              cy="120"
              r="100"
              fill="none"
              stroke="url(#vn-ring)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="14 14"
              className="vn-dash-flow"
              transform="rotate(-90 120 120)"
            />

            {/* Shield */}
            <path
              d="M120 56 L172 80 L172 128 Q172 164 120 186 Q68 164 68 128 L68 80 Z"
              fill="rgba(11,27,50,0.9)"
              stroke="url(#vn-shield-g)"
              strokeWidth="3"
              strokeLinejoin="round"
              className="vn-pulse-soft"
            />
            <path
              d="M120 56 L172 80 L172 128 Q172 164 120 186 Q68 164 68 128 L68 80 Z"
              fill="url(#vn-shield-g)"
              opacity="0.1"
            />
            <path d="M106 118 L116 128 L138 102" stroke="#38d6ff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* Status inside the ring, under the shield */}
            <text x="120" y="214" fill="#38d6ff" fontSize="12" fontFamily="monospace" textAnchor="middle" letterSpacing="2" className="vn-pulse-soft">
              ANALYZING
            </text>
          </svg>
        </div>

        {/* Four monitored signals — equal-width columns, shared baseline */}
        <div
          role="toolbar"
          aria-label="Four VAANISHIELD intelligence signals"
          className="mt-5 grid grid-cols-4 gap-2 sm:gap-2.5"
        >
          {SIGNALS.map((signal) => {
            const Icon = signal.icon;
            const isActive = active === signal.id;
            return (
              <button
                key={signal.id}
                type="button"
                aria-pressed={isActive}
                aria-expanded={isActive}
                onMouseEnter={() => setActive(signal.id)}
                onMouseLeave={() => setActive((cur) => (cur === signal.id ? null : cur))}
                onFocus={() => setActive(signal.id)}
                onBlur={() => setActive((cur) => (cur === signal.id ? null : cur))}
                onClick={() => setActive(isActive ? null : signal.id)}
                className={`flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-[var(--radius-small)] border px-1 py-2.5 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan ${
                  isActive
                    ? "border-vn-cyan/60 bg-vn-cyan/10 text-vn-cyan shadow-lg shadow-vn-cyan/10"
                    : "border-vn-border bg-vn-surface/40 text-vn-muted hover:border-vn-cyan/30 hover:text-vn-text"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-semibold leading-none">{signal.label}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        <p
          role="status"
          className="mt-3 flex min-h-[52px] items-start gap-1.5 rounded-[var(--radius-small)] border border-vn-border bg-vn-navy/50 px-3.5 py-2.5 text-xs leading-relaxed text-vn-muted"
        >
          {activeSignal ? (
            <>
              <strong className="shrink-0 text-vn-cyan">{activeSignal.label}:</strong>{" "}
              {activeSignal.copy}
            </>
          ) : (
            <>Hover or tap a signal to see what VAANISHIELD checks on every layer.</>
          )}
        </p>

        {/* Footer row */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-vn-border pt-4">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-vn-muted">
            4 signals monitored
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-vn-cyan">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Risk: analyzing
          </span>
        </div>
      </div>
    </div>
  );
}