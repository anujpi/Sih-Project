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
    title: "Select a scenario",
    icon: FileSearch,
    description:
      "Choose a voice interaction — a genuine call, an AI clone, or a high-pressure scam attempt.",
    signal: "Scenario feeds the system a voice interaction to screen.",
    nextAction: "Load a scenario to see the expected risk pattern.",
  },
  {
    id: "signals",
    number: "02",
    title: "Watch signal analysis",
    icon: Radar,
    description:
      "Live Guard analyzes voice authenticity, identity consistency, and conversation intent in parallel.",
    signal: "Voice, identity, and intent signals update as evidence arrives.",
    nextAction: "Watch the four-layer pipeline score the interaction.",
  },
  {
    id: "evidence",
    number: "03",
    title: "Review risk evidence",
    icon: MessageSquareText,
    description:
      "Read the explainable verdict — synthetic probability, identity mismatch risk, and intent flags.",
    signal: "Each layer produces readable evidence you can expand and inspect.",
    nextAction: "Review the evidence before acting.",
  },
  {
    id: "verify",
    number: "04",
    title: "Verify before acting",
    icon: ShieldCheck,
    description:
      "High and critical risk escalate to adaptive verification — confirm identity out-of-band first.",
    signal: "The system buys you time to verify before a dangerous action.",
    nextAction: "Complete the verification workflow in the live console.",
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
    <section id="product" className="vn-section scroll-mt-24 bg-vn-surface-blue-gray/40">
      <div className="vn-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-vn-primary">
            Try the protection layer
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-navy sm:text-4xl">
            Experience the full safety journey
          </h2>
          <p className="mt-4 text-base leading-relaxed text-vn-secondary">
            From scenario selection to independent verification — interact with each stage of
            the security workflow.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* Left: vertical stepper */}
          <div className="space-y-3">
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
                  className={`group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary sm:p-5 ${
                    isActive
                      ? "border-vn-primary/30 bg-white shadow-md"
                      : "border-vn-border bg-white/60 hover:border-vn-primary/20 hover:bg-white"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      isActive
                        ? "bg-vn-primary/10 text-vn-primary"
                        : isDone
                          ? "bg-vn-green/10 text-vn-green"
                          : "bg-vn-surface-blue text-vn-muted group-hover:text-vn-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-vn-muted">
                        {s.number}
                      </span>
                      <span className={`text-base font-bold ${isActive ? "text-vn-navy" : "text-vn-secondary"}`}>
                        {s.title}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-vn-secondary">
                      {s.description}
                    </span>
                    {isActive && (
                      <span className="mt-3 block rounded-lg border border-vn-primary/15 bg-vn-surface-blue px-3 py-2 text-xs font-medium leading-relaxed text-vn-primary vn-anim-rise">
                        {step.signal}
                      </span>
                    )}
                  </span>
                  {isDone && (
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-vn-green" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: interactive preview */}
          <div className="flex flex-col gap-4">
            <Reveal delay={120}>
              <div className="card-surface p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-vn-navy">Preview</h3>
                  <span className="rounded-full border border-vn-primary/20 bg-vn-primary/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-vn-primary">
                    {step.number}
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
                              : "No risk signals",
                      risk:
                        previewScenario === "genuine"
                          ? "Low"
                          : previewScenario === "ai_cloned_scam"
                            ? "94/100"
                            : "72/100",
                    }}
                  />
                )}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-relaxed text-vn-muted">{step.nextAction}</p>
                  <Link
                    href="/demo"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-vn-navy px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep hover:shadow-md"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Open Live Console
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div
      className="vn-anim-rise"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
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
    <div className="space-y-2.5">
      {SCENARIO_ORDER.map((type) => {
        const scenario = SCENARIOS.find((s) => s.type === type)!;
        const Icon = SCENARIO_ICONS[type];
        const isActive = value === type;
        const tierBadge = tierLabel(scenario.expectedTier);
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary ${
              isActive
                ? "border-vn-primary/40 bg-vn-primary/8"
                : "border-vn-border bg-white hover:border-vn-primary/25"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                isActive ? "bg-vn-primary/15 text-vn-primary" : "bg-vn-surface-blue text-vn-muted"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold text-vn-navy">{scenario.label}</span>
              <span className="block truncate text-[11px] text-vn-muted">{scenario.description}</span>
            </span>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${tierBadge}`}
            >
              {scenario.expectedTier} risk
            </span>
          </button>
        );
      })}
    </div>
  );
}

function tierLabel(tier: RiskTier): string {
  switch (tier) {
    case "low": return "border-vn-green/30 bg-vn-green/8 text-vn-green";
    case "medium": return "border-vn-amber/30 bg-vn-amber/8 text-vn-amber";
    case "high": return "border-vn-orange/30 bg-vn-orange/8 text-vn-orange";
    case "critical": return "border-vn-red/30 bg-vn-red/8 text-vn-red";
  }
}
