"use client";

import { ArrowLeft, Cpu, FlaskConical, LifeBuoy, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ScenarioSelector from "@/components/scenario-selector";
import AudioUpload, { AnalysisInputState } from "@/components/audio-upload";
import AnalysisPipeline from "@/components/analysis-pipeline";
import RiskResult from "@/components/risk-result";
import VoiceAuthenticityCard from "@/components/voice-authenticity-card";
import IdentityCard from "@/components/identity-card";
import IntentCard from "@/components/intent-card";
import RiskEngineCard from "@/components/risk-engine-card";
import VerificationPanel from "@/components/verification-panel";
import AnalysisHistory from "@/components/analysis-history";
import { LiveStatusTicker } from "@/components/status-badge";
import { useToast } from "@/components/toast-provider";
import { useAnalysis } from "@/hooks/use-analysis";
import { ScenarioType } from "@/lib/types";
import { SCENARIOS, SCENARIO_DEFAULT_IDENTITY } from "@/lib/demo-scenarios";

type Mode = "demo" | "api";

export default function DemoShell() {
  const { push } = useToast();
  const analysis = useAnalysis();
  const [mode, setMode] = useState<Mode>("demo");
  const [input, setInput] = useState<AnalysisInputState>({
    scenario: "ai_cloned_scam",
    audioFile: null,
    referenceAudioFile: null,
    claimedIdentity: SCENARIO_DEFAULT_IDENTITY.ai_cloned_scam,
  });

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    if (next === "api") {
      push(
        "info",
        "API mode enabled",
        "Upload or record audio — analysis will call POST /analyze/full on the backend."
      );
    } else {
      push("info", "Demo mode enabled", "Scenarios run fully offline. No backend required.");
    }
  }

  function selectScenario(scenario: ScenarioType) {
    setInput((prev) => ({
      ...prev,
      scenario,
      claimedIdentity: SCENARIO_DEFAULT_IDENTITY[scenario],
    }));
    push("info", "Scenario loaded", `${SCENARIO_DEFAULT_IDENTITY[scenario]} selected.`);
  }

  function handleAnalyze() {
    if (analysis.isProcessing) return;
    const effective: AnalysisInputState = {
      ...input,
      scenario: input.scenario,
      audioFile: mode === "api" ? input.audioFile : null,
      referenceAudioFile: input.referenceAudioFile,
    };
    if (mode === "api" && !effective.audioFile) {
      push(
        "error",
        "Audio required in API mode",
        "Upload or record audio first. In Demo mode, scenarios run without a file."
      );
      return;
    }
    analysis.runAnalysis(effective);
    if (mode === "api") {
      push("info", "Analysis started", "The four-layer pipeline is now running.");
    }
  }

  const result = analysis.result;
  const showResult = result !== null && !analysis.isProcessing;

  return (
    <div className="min-h-screen bg-vn-navy text-vn-text">
      {/* Demo header */}
      <header className="sticky top-0 z-40 border-b border-vn-border bg-vn-navy/85 backdrop-blur-xl">
        <div className="vn-container flex items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-vn-border bg-white/5 px-3 py-1.5 text-xs font-semibold text-vn-muted transition-colors hover:border-vn-cyan/40 hover:text-vn-cyan"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Home
            </Link>
            <Link href="/" className="flex items-center gap-2" aria-label="VAANISHIELD home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-vn-cyan to-vn-indigo text-vn-navy">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="hidden font-mono text-sm font-bold tracking-wide text-vn-text sm:inline">
                VAANISHIELD
              </span>
            </Link>
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-bold tracking-tight text-vn-text sm:text-base">
              Live Voice Security Console
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <LiveStatusTicker variant="live" label="Protection active" />
            <span
              className={`hidden items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium md:inline-flex ${
                mode === "demo"
                  ? "border-vn-violet/30 bg-vn-violet/10 text-vn-violet"
                  : "border-vn-indigo/30 bg-vn-indigo/10 text-vn-indigo"
              }`}
            >
              {mode === "demo" ? (
                <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {mode === "demo" ? "Demo Mode" : "API Mode"}
            </span>
          </div>
        </div>
      </header>

      <main className="vn-container py-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
          {/* Main workspace */}
          <div className="min-w-0 space-y-6">
            <ScenarioSelector value={input.scenario} onChange={selectScenario} disabled={analysis.isProcessing} />

            {mode === "demo" && !analysis.isProcessing && (
              <div className="space-y-2 rounded-2xl border border-vn-violet/25 bg-vn-violet/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-vn-violet">
                    Demo transcript preview
                  </p>
                  <span className="rounded-full border border-vn-violet/30 bg-vn-violet/10 px-2 py-0.5 text-[10px] font-bold text-vn-violet">
                    SIMULATED
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-vn-text/90">
                  “{SCENARIOS.find((s) => s.type === input.scenario)?.transcript}”
                </p>
              </div>
            )}

            <AudioUpload
              mode={mode}
              value={input}
              onValueChange={setInput}
              onAnalyze={handleAnalyze}
              isAnalyzing={analysis.isProcessing}
            />

            <AnalysisPipeline stages={analysis.stages} />

            {/* Error banner */}
            {analysis.errorMessage && (
              <div
                role="alert"
                className="rounded-2xl border border-vn-red/40 bg-vn-red/10 p-5"
              >
                <h3 className="text-sm font-semibold text-vn-red">
                  Analysis could not be completed
                </h3>
                <p className="mt-1 text-sm text-vn-red/80">{analysis.errorMessage}</p>
                <div className="mt-4 flex gap-2">
                  {analysis.canRetry && (
                    <>
                      <button
                        type="button"
                        onClick={analysis.retry}
                        className="inline-flex items-center gap-2 rounded-lg border border-vn-red/50 bg-vn-red/15 px-4 py-2 text-sm font-semibold text-vn-red transition-colors hover:bg-vn-red/25"
                      >
                        Retry analysis
                      </button>
                      <button
                        type="button"
                        onClick={switchMode.bind(null, "demo")}
                        className="inline-flex items-center gap-2 rounded-lg border border-vn-border bg-white/5 px-4 py-2 text-sm font-semibold text-vn-text transition-colors hover:border-vn-cyan/40"
                      >
                        Switch to Demo Mode
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Results */}
            {showResult && result && (
              <section aria-live="polite" className="space-y-6">
                <RiskResult
                  result={result}
                  meta={analysis.meta}
                  onAnalyzeAnother={analysis.analyzeAnother}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <VoiceAuthenticityCard result={result} />
                  <IdentityCard result={result} />
                  <IntentCard result={result} />
                  <RiskEngineCard result={result} />
                </div>
                <VerificationPanel
                  tier={analysis.tier}
                  status={analysis.verificationStatus}
                  onStatusChange={analysis.setVerificationStatus}
                />
              </section>
            )}

            {/* Empty state */}
            {!showResult && !analysis.isProcessing && !analysis.errorMessage && (
              <div className="rounded-2xl border border-dashed border-vn-border bg-vn-surface/30 px-6 py-12 text-center">
                <LifeBuoy className="mx-auto h-7 w-7 text-vn-muted" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium text-vn-text">
                  Select a scenario and run the analysis
                </p>
                <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-vn-muted">
                  The decision dashboard — risk score, evidence cards, and verification workflow —
                  appears here once the pipeline completes.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:h-fit">
            <section aria-labelledby="mode-heading" className="glass-panel rounded-2xl p-5">
              <h3 id="mode-heading" className="text-sm font-bold text-vn-text">
                Run mode
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-vn-muted">
                Demo mode is fully offline and reliable for a live presentation. API mode calls
                the FastAPI backend at{" "}
                <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-vn-cyan">
                  /analyze/full
                </code>
                .
              </p>
              <div
                role="tablist"
                aria-label="Run mode"
                className="mt-4 grid grid-cols-2 gap-1 rounded-xl border border-vn-border bg-vn-navy/60 p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "demo"}
                  onClick={() => switchMode("demo")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    mode === "demo"
                      ? "bg-vn-violet/20 text-vn-violet"
                      : "text-vn-muted hover:text-vn-text"
                  }`}
                >
                  Demo Mode
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "api"}
                  onClick={() => switchMode("api")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                    mode === "api"
                      ? "bg-vn-indigo/20 text-vn-indigo"
                      : "text-vn-muted hover:text-vn-text"
                  }`}
                >
                  API Mode
                </button>
              </div>

              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-vn-muted">Backend</span>
                  <span
                    className={`font-semibold ${
                      analysis.checkingSystem
                        ? "text-vn-muted"
                        : analysis.systemOnline
                          ? "text-vn-green"
                          : "text-vn-amber"
                    }`}
                  >
                    {analysis.checkingSystem
                      ? "Checking…"
                      : analysis.systemOnline
                        ? "Online"
                        : "Offline"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-vn-muted">Active mode</span>
                  <span className="font-semibold text-vn-text">
                    {mode === "demo" ? "Demo simulations" : "Live API calls"}
                  </span>
                </div>
                {mode === "api" && (
                  <p className="mt-2 rounded-lg border border-vn-amber/30 bg-vn-amber/10 px-2.5 py-1.5 text-[11px] leading-relaxed text-vn-amber">
                    API mode requires an audio file. Results depend on the backend running
                    locally.
                  </p>
                )}
              </div>
            </section>

            <p className="rounded-xl border border-vn-border bg-vn-surface/30 px-3.5 py-3 text-[11px] leading-relaxed text-vn-muted">
              <strong className="text-vn-text/80">Prototype notice.</strong> This console is a
              research demo. Risk scores are probabilistic indicators, and verification actions —
              SMS checks, telecom blocking, financial holds — are simulated only.
            </p>

            <AnalysisHistory
              analyses={analysis.recent}
              onReplay={analysis.replay}
              onClear={analysis.clearRecent}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}