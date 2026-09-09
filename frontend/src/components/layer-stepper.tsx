"use client";

import {
  AudioLines,
  CheckCircle2,
  Fingerprint,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const LAYERS = [
  {
    id: "voice",
    number: "01",
    title: "Voice Authenticity",
    icon: AudioLines,
    accent: "#00A7C7",
    eyebrow: "Layer 1",
    copy: "A fine-tuned wav2vec2 classifier listens for the acoustic fingerprints of AI-generated speech — even high-fidelity clones.",
    output: {
      label: "Synthetic probability",
      value: "91%",
      status: "Acoustic anomaly detected",
      statusClass: "text-vn-red",
    },
    signal: "Acoustic features extracted from the audio stream.",
  },
  {
    id: "identity",
    number: "02",
    title: "Identity Verification",
    icon: Fingerprint,
    accent: "#5B5FEF",
    eyebrow: "Layer 2",
    copy: "An ECAPA-TDNN voiceprint model checks the caller against a trusted reference to catch human impostors too.",
    output: {
      label: "Voice similarity",
      value: "23%",
      status: "Identity mismatch detected",
      statusClass: "text-vn-orange",
    },
    signal: "Speaker embedding compared against the claimed identity.",
  },
  {
    id: "intent",
    number: "03",
    title: "Conversation Intent",
    icon: MessageSquareText,
    accent: "#2F80ED",
    eyebrow: "Layer 3",
    copy: "Conversations are transcribed with faster-whisper and scanned for scam pressure signals — OTPs, urgent transfers, secrecy, authority.",
    output: {
      label: "Financial request",
      value: "High",
      status: "OTP request detected",
      statusClass: "text-vn-red",
    },
    signal: "Transcript updates as speech is converted to text.",
  },
  {
    id: "response",
    number: "04",
    title: "Adaptive Response",
    icon: ShieldCheck,
    accent: "#D92D4F",
    eyebrow: "Layer 4",
    copy: "The signals combine into one explainable 0–100 interaction-risk score with tiered response actions.",
    output: {
      label: "Overall interaction risk",
      value: "Critical",
      status: "Verify independently before proceeding",
      statusClass: "text-vn-red",
    },
    signal: "Risk engine recalculates as new evidence arrives.",
  },
];

export default function LayerStepper() {
  const [active, setActive] = useState(0);
  const layer = LAYERS[active];
  const LayerIcon = layer.icon;

  return (
    <section id="technology" className="vn-section scroll-mt-24">
      <div className="vn-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-vn-primary">
            Four intelligence layers
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-navy sm:text-4xl">
            How VAANISHIELD protects you
          </h2>
          <p className="mt-4 text-base leading-relaxed text-vn-secondary">
            No single model can defend a relationship. VAANISHIELD cross-checks the voice, the
            claimed identity, and what the caller is asking for — then explains its verdict.
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Left: interactive layer selector */}
          <div className="space-y-2.5" role="tablist" aria-label="Four intelligence layers">
            {LAYERS.map((layer, index) => {
              const Icon = layer.icon;
              const isActive = index === active;
              return (
                <button
                  key={layer.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(index)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary ${
                    isActive
                      ? "border-vn-primary/25 bg-white shadow-md"
                      : "border-vn-border bg-white/60 hover:bg-white"
                  }`}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                    style={{ background: isActive ? layer.accent : "#D9E2EC" }}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-vn-muted">
                        {layer.number}
                      </span>
                      <span className={`text-sm font-bold ${isActive ? "text-vn-navy" : "text-vn-secondary"}`}>
                        {layer.title}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-vn-secondary">
                      {layer.copy}
                    </span>
                  </span>
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${isActive ? "text-vn-primary" : "text-vn-border"}`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Right: active layer detail */}
          <div className="card-surface flex flex-col overflow-hidden">
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, ${layer.accent}, transparent)` }}
              aria-hidden="true"
            />
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <span
                className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
                style={{ borderColor: `${layer.accent}30`, background: `${layer.accent}0A`, color: layer.accent }}
              >
                <LayerIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {layer.eyebrow}
              </span>

              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-vn-navy">
                {layer.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-vn-secondary">
                {layer.copy}
              </p>

              {/* Output example */}
              <div className="mt-5 rounded-xl border border-vn-border bg-vn-surface-blue p-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-vn-muted">
                  Example output
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-vn-muted">{layer.output.label}</p>
                    <p className="font-mono text-2xl font-bold tabular-nums" style={{ color: layer.accent }}>
                      {layer.output.value}
                    </p>
                  </div>
                  <p className={`text-right text-xs font-bold ${layer.output.statusClass}`}>
                    {layer.output.status}
                  </p>
                </div>
              </div>

              {/* Signal visual */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-vn-border bg-white px-4 py-3">
                <span className="vn-pulse-soft h-2 w-2 rounded-full" style={{ background: layer.accent }} aria-hidden="true" />
                <p className="text-xs font-medium text-vn-secondary">
                  {layer.signal}
                </p>
              </div>

              <Link
                href="/demo"
                className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-vn-navy px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep hover:shadow-md"
              >
                Try layer {active + 1} in the demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
