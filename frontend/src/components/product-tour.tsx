"use client";

import {
  AudioLines,
  CheckCircle2,
  Fingerprint,
  FileSearch,
  MessageSquareText,
  Play,
  Radar,
  ShieldCheck,
  UserX,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LiveGuardWidget from "@/components/live-guard-widget";
import { SCENARIOS } from "@/lib/demo-scenarios";
import { RiskTier, ScenarioType } from "@/lib/types";

const STEPS = [
  {
    id: "scenario",
    number: "01",
    title: "Select Telemetry Scenario",
    icon: FileSearch,
    description:
      "Choose a voice interaction profile — genuine audio, synthetic clone, high-pressure OTP scam, or human identity mismatch.",
    signal: "Feeds audio telemetry stream into the 4-layer screening engine.",
    nextAction: "Select a scenario profile to preview risk signature.",
  },
  {
    id: "signals",
    number: "02",
    title: "Parallel Feature Extraction",
    icon: Radar,
    description:
      "Runs wav2vec2 acoustic classification and ECAPA-TDNN speaker embedding extraction in parallel with ASR transcription.",
    signal: "Layer 1, 2, and 3 feature vectors are calculated simultaneously.",
    nextAction: "Observe feature extraction across signal layers.",
  },
  {
    id: "evidence",
    number: "03",
    title: "Decomposed Risk Evidence",
    icon: MessageSquareText,
    description:
      "Inspect the explainable risk breakdown: synthetic voice probability %, speaker similarity %, and transcript pressure flags.",
    signal: "Decomposes 0-100 overall risk score into actionable evidence cards.",
    nextAction: "Review evidence cards before taking operational action.",
  },
  {
    id: "verify",
    number: "04",
    title: "Adaptive Mitigation Protocol",
    icon: ShieldCheck,
    description:
      "High (55-79) and Critical (80-100) risk verdicts escalate to out-of-band identity verification phrase protocols.",
    signal: "Interceptors freeze sensitive transactions until identity is verified.",
    nextAction: "Execute verification step in the security console.",
  },
];

const SCENARIO_ORDER: ScenarioType[] = [
  "genuine",
  "ai_cloned",
  "ai_cloned_scam",
  "known_person_mismatch",
];

const SCENARIO_ICONS: Record<ScenarioType, typeof AudioLines> = {
  genuine: AudioLines,
  ai_cloned: Fingerprint,
  ai_cloned_scam: UserX,
  known_person_mismatch: UserX,
};

export default function ProductTour() {
  const [activeStep, setActiveStep] = useState(0);
  const [previewScenario, setPreviewScenario] = useState<ScenarioType>("ai_cloned_scam");
  const step = STEPS[activeStep];

  const selectedScenario = SCENARIOS.find((s) => s.type === previewScenario);
  const previewTier: RiskTier = selectedScenario?.expectedTier ?? "low";

  return (
    <section id="product" className="vn-section border-b border-vn-border bg-vn-page scroll-mt-24">
      <div className="vn-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-vn-primary">
            Operational Security Workflow
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-vn-navy sm:text-3xl">
            Console Execution Sequence
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-vn-secondary sm:text-sm">
            Walk through the decision pipeline from initial call telemetry ingest to final mitigation resolution.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* Left: vertical stepper */}
          <div className="space-y-2.5">
            {STEPS.map((s, index) => {
              const Icon = s.icon;
              const isActive = index === activeStep;
              const isDone = index < activeStep;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => setActiveStep(index)}
                  onMouseEnter={() => setActiveStep(index)}
                  className={`group relative flex w-full items-start gap-3.5 rounded-lg border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary ${
                    isActive
                      ? "border-vn-primary bg-white shadow-sm"
                      : "border-vn-border bg-white hover:border-vn-secondary"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded border transition-colors ${
                      isActive
                        ? "border-vn-primary bg-vn-surface-blue text-vn-primary font-mono text-xs font-bold"
                        : isDone
                          ? "border-vn-green bg-vn-green/10 text-vn-green"
                          : "border-vn-border bg-vn-page text-vn-muted"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`text-xs font-bold sm:text-sm ${isActive ? "text-vn-navy" : "text-vn-secondary"}`}>
                        {s.title}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-vn-secondary">
                      {s.description}
                    </span>
                    {isActive && (
                      <span className="mt-2 block rounded border border-vn-border bg-vn-page px-2.5 py-1 font-mono text-[11px] text-vn-primary">
                        {step.signal}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: interactive preview */}
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-vn-border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between border-b border-vn-border pb-3">
                <h3 className="font-mono text-xs font-bold text-vn-navy">Live Telemetry Simulator</h3>
                <span className="rounded border border-vn-border bg-vn-page px-2 py-0.5 font-mono text-[10px] font-bold text-vn-primary">
                  STAGE {step.number}
                </span>
              </div>

              {activeStep === 0 ? (
                <ScenarioPreview
                  value={previewScenario}
                  onChange={setPreviewScenario}
                />
              ) : (
                <LiveGuardWidget
                  state={activeStep === 1 ? "scanning" : previewTier}
                  score={previewTier === "low" ? 15 : previewTier === "high" ? 72 : 94}
                  signals={{
                    voice:
                      previewScenario === "genuine"
                        ? "8% synthetic"
                        : previewScenario === "known_person_mismatch"
                          ? "15% synthetic"
                          : "91% synthetic",
                    identity:
                      previewScenario === "genuine"
                        ? "91% match"
                        : "23% mismatch",
                    intent:
                      previewScenario === "ai_cloned_scam"
                        ? "OTP · Money · Urgency"
                        : previewScenario === "known_person_mismatch"
                          ? "Money · Urgency"
                          : previewScenario === "ai_cloned"
                            ? "Urgency"
                            : "Clean",
                    risk:
                      previewScenario === "genuine"
                        ? "Low"
                        : previewScenario === "ai_cloned_scam"
                          ? "94/100"
                          : "72/100",
                  }}
                />
              )}

              <div className="mt-4 flex flex-col gap-3 border-t border-vn-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[11px] text-vn-muted">{step.nextAction}</p>
                <Link
                  href="/demo"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md bg-vn-navy px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep"
                >
                  <Play className="h-3.5 w-3.5 text-vn-blue" aria-hidden="true" />
                  Launch Security Console
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScenarioPreview({
  value,
  onChange,
}: {
  value: ScenarioType;
  onChange: (s: ScenarioType) => void;
}) {
  return (
    <div className="space-y-2">
      {SCENARIO_ORDER.map((type) => {
        const scenario = SCENARIOS.find((s) => s.type === type)!;
        const Icon = SCENARIO_ICONS[type];
        const isActive = value === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary ${
              isActive
                ? "border-vn-primary bg-vn-surface-blue"
                : "border-vn-border bg-white hover:border-vn-secondary"
            }`}
          >
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border ${
                isActive ? "border-vn-primary bg-white text-vn-primary" : "border-vn-border bg-vn-page text-vn-muted"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-vn-navy">{scenario.label}</span>
              <span className="block truncate text-[11px] text-vn-muted">{scenario.description}</span>
            </span>
            <span className="shrink-0 font-mono text-[10px] font-bold uppercase text-vn-navy">
              {scenario.expectedTier}
            </span>
          </button>
        );
      })}
    </div>
  );
}
