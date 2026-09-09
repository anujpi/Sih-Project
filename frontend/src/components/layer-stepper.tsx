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
    title: "Layer 1: Voice Authenticity",
    icon: AudioLines,
    accent: "#0284C7",
    eyebrow: "wav2vec2-base Classifier",
    copy: "Processes 16 kHz acoustic features to detect vocoder artifacts and synthetic speech generation.",
    output: {
      label: "Synthetic Probability",
      value: "91%",
      status: "Acoustic Anomaly Flagged",
      statusClass: "text-vn-red",
    },
    signal: "Feature extraction over 16 kHz audio frame sequence.",
  },
  {
    id: "identity",
    number: "02",
    title: "Layer 2: Speaker Verification",
    icon: Fingerprint,
    accent: "#4F46E5",
    eyebrow: "SpeechBrain ECAPA-TDNN",
    copy: "Calculates 192-dimensional speaker embedding and compares cosine similarity against Voiceprint Registry.",
    output: {
      label: "Speaker Similarity",
      value: "23%",
      status: "Identity Mismatch Detected",
      statusClass: "text-vn-orange",
    },
    signal: "Cosine distance evaluation against stored voiceprint vector.",
  },
  {
    id: "intent",
    number: "03",
    title: "Layer 3: Speech-to-Text & Intent",
    icon: MessageSquareText,
    accent: "#2563EB",
    eyebrow: "faster-whisper + Intent Rules",
    copy: "Transcribes phone audio and scans for 5 scam pressure indicators (OTP, money transfer, urgency, authority, secrecy).",
    output: {
      label: "Scam Intent Risk Score",
      value: "100%",
      status: "OTP & Financial Transfer Triggered",
      statusClass: "text-vn-red",
    },
    signal: "ASR transcript token pattern evaluation.",
  },
  {
    id: "response",
    number: "04",
    title: "Layer 4: Unified Risk Engine",
    icon: ShieldCheck,
    accent: "#DC2626",
    eyebrow: "Explainable Risk Formula",
    copy: "Calculates overall risk: 0.35(L1) + 0.25(L2) + 0.40(L3), mapping score (0-100) to actionable security tiers.",
    output: {
      label: "Overall Risk Verdict",
      value: "Critical (94/100)",
      status: "Mandatory Out-of-Band Verification",
      statusClass: "text-vn-red",
    },
    signal: "Weighted 4-layer verdict recalculation.",
  },
];

export default function LayerStepper() {
  const [active, setActive] = useState(0);
  const layer = LAYERS[active];
  const LayerIcon = layer.icon;

  return (
    <section id="technology" className="vn-section border-b border-vn-border bg-white scroll-mt-24">
      <div className="vn-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-vn-primary">
            Architecture Walkthrough
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-vn-navy sm:text-3xl">
            Detailed 4-Layer Execution Breakdown
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-vn-secondary sm:text-sm">
            Select any layer below to inspect its model architecture, acoustic input signals, and output metrics.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Left: interactive layer selector */}
          <div className="space-y-2.5" role="tablist" aria-label="Four intelligence layers">
            {LAYERS.map((layerItem, index) => {
              const Icon = layerItem.icon;
              const isActive = index === active;
              return (
                <button
                  key={layerItem.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(index)}
                  className={`flex w-full items-center gap-3.5 rounded-lg border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary ${
                    isActive
                      ? "border-vn-primary bg-vn-surface-blue shadow-sm"
                      : "border-vn-border bg-white hover:border-vn-secondary"
                  }`}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-vn-border bg-white text-vn-navy font-mono text-xs font-bold"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                        {layerItem.number}
                      </span>
                      <span className={`text-xs font-bold sm:text-sm ${isActive ? "text-vn-navy" : "text-vn-secondary"}`}>
                        {layerItem.title}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-vn-secondary">
                      {layerItem.copy}
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
          <div className="card-surface flex flex-col justify-between overflow-hidden p-6">
            <div>
              <span
                className="inline-flex w-fit items-center gap-1.5 rounded border border-vn-border bg-vn-page px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-vn-navy"
              >
                <LayerIcon className="h-3.5 w-3.5 text-vn-primary" aria-hidden="true" />
                {layer.eyebrow}
              </span>

              <h3 className="mt-3 text-xl font-bold text-vn-navy">
                {layer.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-vn-secondary">
                {layer.copy}
              </p>

              {/* Output example */}
              <div className="mt-4 rounded-md border border-vn-border bg-vn-page p-4 font-mono">
                <p className="text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                  Telemetry Output Metric
                </p>
                <div className="mt-2 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-vn-muted">{layer.output.label}</p>
                    <p className="text-xl font-bold tabular-nums text-vn-navy">
                      {layer.output.value}
                    </p>
                  </div>
                  <p className={`text-right text-xs font-bold ${layer.output.statusClass}`}>
                    {layer.output.status}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-md border border-vn-border bg-white px-3 py-2 font-mono text-xs text-vn-secondary">
                <span className="h-2 w-2 rounded-full bg-vn-primary" aria-hidden="true" />
                <span>{layer.signal}</span>
              </div>
            </div>

            <Link
              href="/demo"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-vn-navy px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep"
            >
              Test Layer {active + 1} in Security Console
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
