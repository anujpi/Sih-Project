"use client";

import {
  ArrowLeft,
  ChevronDown,
  Cpu,
  FlaskConical,
  ShieldCheck,
  SlidersHorizontal,
  StepForward,
  Gauge,
  FileSearch,
  OctagonAlert,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ScenarioSelector from "@/components/scenario-selector";
import AudioUpload, { AnalysisInputState } from "@/components/audio-upload";
import AnalysisPipeline from "@/components/analysis-pipeline";
import RiskResult from "@/components/risk-result";
import LiveGuardWidget, { LiveGuardSignalId, LiveGuardState } from "@/components/live-guard-widget";
import VoiceAuthenticityCard from "@/components/voice-authenticity-card";
import IdentityCard from "@/components/identity-card";
import IntentCard from "@/components/intent-card";
import RiskEngineCard from "@/components/risk-engine-card";
import VerificationPanel from "@/components/verification-panel";
import AnalysisHistory from "@/components/analysis-history";
import StreamingAnalysisBoard, { SignalStatus } from "@/components/streaming-analysis-board";
import AnalysisTimeline from "@/components/analysis-timeline";
import StreamingTranscript from "@/components/streaming-transcript";
import { LiveStatusTicker } from "@/components/status-badge";
import { useToast } from "@/components/toast-provider";
import { useAnalysis } from "@/hooks/use-analysis";
import { RiskTier, ScenarioType } from "@/lib/types";
import {
  SCENARIOS,
  SCENARIO_DEFAULT_IDENTITY,
  SCENARIO_LABELS,
} from "@/lib/demo-scenarios";

type Mode = "demo" | "api";

function guardStateFor(
  isProcessing: boolean,
  hasError: string | null,
  tier: RiskTier,
  hasResult: boolean
): LiveGuardState {
  if (hasError) return "error";
  if (isProcessing) return "scanning";
  if (!hasResult) return "idle";
  return tier;
}

const STAGE_TO_SIGNAL: Record<string, LiveGuardSignalId> = {
  authenticity: "voice",
  identity: "identity",
  intent: "intent",
  risk: "risk",
};

const SIGNAL_TO_CARD_ID: Record<LiveGuardSignalId, string> = {
  voice: "voice-authenticity-card",
  identity: "identity-verification-card",
  intent: "intent-analysis-card",
  risk: "unified-risk-card",
};

export default function DemoShell() {
  const { push } = useToast();
  const analysis = useAnalysis();
  const [mode, setMode] = useState<Mode>("demo");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [input, setInput] = useState<AnalysisInputState>({
    scenario: "ai_cloned_scam",
    audioFile: null,
    referenceAudioFile: null,
    claimedIdentity: SCENARIO_DEFAULT_IDENTITY.ai_cloned_scam,
  });

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    push(
      "info",
      `${next.toUpperCase()} mode enabled`,
      next === "api"
        ? "Upload audio or select registered voiceprint — calls POST /analyze/full."
        : "Scenarios run fully offline with simulated pipeline."
    );
  }

  function selectScenario(scenario: ScenarioType) {
    setInput((prev) => ({
      ...prev,
      scenario,
      claimedIdentity: SCENARIO_DEFAULT_IDENTITY[scenario],
    }));
    push("info", "Scenario profile loaded", `${SCENARIO_LABELS[scenario]} selected.`);
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
  }

  const result = analysis.result;
  const showResult = result !== null && !analysis.isProcessing;
  const isStreaming = analysis.isProcessing;
  const guardState = guardStateFor(
    analysis.isProcessing,
    analysis.errorMessage,
    analysis.tier,
    showResult
  );

  const selectedScenario = SCENARIOS.find((s) => s.type === input.scenario);
  const guardPreview =
    !result && !analysis.isProcessing
      ? {
          tier: (selectedScenario?.expectedTier ?? "low") as RiskTier,
          label: SCENARIO_LABELS[input.scenario],
          highlight:
            input.scenario === "known_person_mismatch" ? ("identity" as const) : null,
        }
      : null;

  const activeStage = analysis.stages.find(
    (s) => s.status === "processing" || s.status === "waiting"
  );
  const guardScanPhase = activeStage
    ? (STAGE_TO_SIGNAL[activeStage.id] as LiveGuardSignalId)
    : undefined;

  const guardScore = result ? Math.round(result.risk.overall_risk * 100) : 0;

  const guardSignals = {
    voice: result?.voice_authenticity
      ? `${Math.round(result.voice_authenticity.synthetic_probability * 100)}% synthetic`
      : undefined,
    identity: result
      ? result.identity_verification
        ? result.identity_verification.identity_match
          ? `${Math.round(result.identity_verification.similarity_score * 100)}% match`
          : "Mismatch"
        : "Skipped"
      : undefined,
    intent: result?.intent_analysis
      ? `${result.intent_analysis.triggered_intents.length} risk signals`
      : undefined,
    risk: result ? `Score ${guardScore}/100` : undefined,
  };

  function signalStatus(id: "authenticity" | "identity" | "intent" | "risk", fallback: boolean): SignalStatus {
    if (!isStreaming && result) return (fallback ? "complete" : "skipped");
    if (!isStreaming) return "idle";
    const idx = analysis.stages.findIndex((s) => s.id === id);
    const status = idx >= 0 ? analysis.stages[idx].status : "waiting";
    if (status === "completed") return "complete";
    if (status === "skipped") return "skipped";
    if (status === "processing") return "processing";
    return "processing";
  }

  function revealEvidence(signalId: LiveGuardSignalId) {
    const el = document.getElementById(SIGNAL_TO_CARD_ID[signalId]);
    if (!el) {
      push(
        "info",
        "Run an analysis first",
        "The evidence card for this layer appears once the pipeline completes."
      );
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.style.transition = "box-shadow 0.25s ease";
    el.style.boxShadow = "0 0 0 2px #1E40AF";
    window.setTimeout(() => {
      el.style.boxShadow = "";
      el.style.transition = "";
    }, 1400);
  }

  function verifyCaller() {
    if (!showResult || !result) {
      push(
        "info",
        "No active threat yet",
        "Run a scenario to see the independent verification workflow."
      );
      return;
    }
    document
      .getElementById("verification-heading")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const stage = isStreaming
    ? 2
    : showResult
      ? 3
      : 1;

  return (
    <div className="min-h-screen bg-vn-page text-vn-navy">
      {/* Demo header */}
      <header className="sticky top-0 z-40 border-b border-vn-border bg-white/95 backdrop-blur-md">
        <div className="vn-container flex items-center justify-between gap-3 py-2.5">
          <div className="flex min-w-0 items-center gap-3 font-mono">
            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded border border-vn-border bg-white px-2.5 py-1 text-xs font-bold text-vn-secondary transition-colors hover:bg-vn-page hover:text-vn-navy"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Home
            </Link>
            <Link href="/" className="flex items-center gap-2" aria-label="VAANISHIELD home">
              <span className="flex h-7 w-7 items-center justify-center rounded border border-vn-border bg-vn-navy text-white">
                <ShieldCheck className="h-4 w-4 text-vn-blue" aria-hidden="true" />
              </span>
              <span className="hidden font-mono text-xs font-bold tracking-wider text-vn-navy sm:inline">
                VAANISHIELD CONSOLE
              </span>
            </Link>
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-xs font-bold uppercase tracking-wider text-vn-navy sm:text-sm">
              Live Voice Security Operations Console
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 font-mono text-xs">
            <span className="hidden items-center gap-1.5 rounded border border-vn-border bg-vn-page px-2 py-1 sm:inline-flex">
              <span className={`h-2 w-2 rounded-full ${analysis.systemOnline ? "bg-vn-green animate-pulse" : "bg-vn-amber"}`} />
              <span className="text-[11px] font-bold text-vn-navy">
                {analysis.checkingSystem ? "Checking API..." : analysis.systemOnline ? "Backend 200 OK" : "Backend Offline"}
              </span>
            </span>
            <div className="inline-flex rounded border border-vn-border bg-vn-page p-0.5">
              <button
                type="button"
                onClick={() => switchMode("demo")}
                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold transition-all ${
                  mode === "demo"
                    ? "bg-vn-navy text-white shadow-sm"
                    : "text-vn-muted hover:text-vn-navy"
                }`}
              >
                <FlaskConical className="h-3 w-3" aria-hidden="true" />
                Offline Demo
              </button>
              <button
                type="button"
                onClick={() => switchMode("api")}
                className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-bold transition-all ${
                  mode === "api"
                    ? "bg-vn-blue text-white shadow-sm"
                    : "text-vn-muted hover:text-vn-navy"
                }`}
              >
                <Cpu className="h-3 w-3" aria-hidden="true" />
                Live API
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="vn-container py-5 lg:py-7">
        {/* Stage stepper */}
        <StageStepper current={stage} />

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Main workspace */}
          <div className="min-w-0 space-y-5">
            {/* Stage 1: Prepare */}
            <ScenarioSelector value={input.scenario} onChange={selectScenario} disabled={analysis.isProcessing} />

            <AudioUpload
              mode={mode}
              value={input}
              onValueChange={setInput}
              onAnalyze={handleAnalyze}
              isAnalyzing={analysis.isProcessing}
            />

            <AnalysisPipeline stages={analysis.stages} />

            {/* Stage 2: Streaming board */}
            {isStreaming && (
              <>
                <StreamingAnalysisBoard
                  isProcessing
                  voiceStatus={signalStatus("authenticity", true)}
                  identityStatus={signalStatus("identity", result ? true : false)}
                  intentStatus={signalStatus("intent", true)}
                  riskStatus={signalStatus("risk", true)}
                  voiceValue="…"
                  intentValue="…"
                  result={null}
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <AnalysisTimeline events={analysis.timeline} isProcessing />
                  <StreamingTranscript
                    text={selectedScenario?.transcript ?? ""}
                    isUpdating
                    speakerLabel={SCENARIO_LABELS[input.scenario]}
                  />
                </div>
              </>
            )}

            {/* Error banner */}
            {analysis.errorMessage && (
              <div
                role="alert"
                className="rounded-lg border border-vn-red/40 bg-vn-red/10 p-4 font-mono"
              >
                <h3 className="flex items-center gap-2 text-xs font-bold text-vn-red">
                  <OctagonAlert className="h-4 w-4" aria-hidden="true" />
                  Analysis Error: Ingest Failed
                </h3>
                <p className="mt-1 font-sans text-xs text-vn-secondary">{analysis.errorMessage}</p>
                <div className="mt-3 flex gap-2">
                  {analysis.canRetry && (
                    <>
                      <button
                        type="button"
                        onClick={analysis.retry}
                        className="inline-flex items-center gap-1.5 rounded border border-vn-red/50 bg-vn-red/20 px-3 py-1.5 text-xs font-bold text-vn-red transition-colors hover:bg-vn-red/30"
                      >
                        Retry Analysis
                      </button>
                      <button
                        type="button"
                        onClick={() => switchMode("demo")}
                        className="inline-flex items-center gap-1.5 rounded border border-vn-border bg-white px-3 py-1.5 text-xs font-bold text-vn-navy transition-colors hover:bg-vn-page"
                      >
                        Switch to Offline Demo Mode
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Stage 3: Results */}
            {showResult && result && (
              <section aria-live="polite" className="space-y-5">
                <RiskResult
                  result={result}
                  meta={analysis.meta}
                  onAnalyzeAnother={analysis.analyzeAnother}
                />
                <StreamingAnalysisBoard
                  isProcessing={false}
                  voiceStatus="complete"
                  identityStatus={result.identity_verification ? "complete" : "skipped"}
                  intentStatus="complete"
                  riskStatus="complete"
                  voiceValue={
                    result.voice_authenticity
                      ? `${Math.round(result.voice_authenticity.synthetic_probability * 100)}% synthetic`
                      : "—"
                  }
                  identityValue={
                    result.identity_verification
                      ? result.identity_verification.identity_match
                        ? `${Math.round(result.identity_verification.similarity_score * 100)}% match`
                        : "Mismatch"
                      : "Skipped"
                  }
                  intentValue={
                    result.intent_analysis
                      ? `${result.intent_analysis.triggered_intents.length} signal(s)`
                      : "—"
                  }
                  riskValue={`Score ${Math.round(result.risk.overall_risk * 100)}/100`}
                  result={result}
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <AnalysisTimeline events={analysis.timeline} isProcessing={false} />
                  <StreamingTranscript
                    text={result.intent_analysis.transcript}
                    speakerLabel={SCENARIO_LABELS[input.scenario]}
                  />
                </div>
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
              <div className="rounded-lg border border-dashed border-vn-border bg-white px-5 py-10 text-center font-mono">
                <FileSearch className="mx-auto h-6 w-6 text-vn-muted" aria-hidden="true" />
                <p className="mt-2 text-xs font-bold text-vn-navy">
                  Select a Telemetry Scenario & Execute Pipeline
                </p>
                <p className="mx-auto mt-1 max-w-md font-sans text-xs leading-relaxed text-vn-secondary">
                  VAANISHIELD will stream feature extractions across Layer 1 acoustic authenticity, Layer 2 ECAPA-TDNN speaker embeddings, and Layer 3 ASR scam intent into a 0-100 risk score.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5 lg:sticky lg:top-16 lg:h-fit">
            <section aria-labelledby="guard-heading">
              <div className="mb-2 flex items-center justify-between gap-2 font-mono">
                <h3 id="guard-heading" className="text-xs font-bold uppercase tracking-wider text-vn-navy">
                  Telemetry Monitor
                </h3>
                <LiveStatusTicker variant="live" label={guardState === "idle" ? "Idle" : guardState === "scanning" ? "Ingesting" : "Report"} />
              </div>
              <LiveGuardWidget
                state={guardState}
                score={guardScore}
                signals={guardSignals}
                scanPhase={guardScanPhase}
                preview={guardPreview}
                onSelectSignal={revealEvidence}
                onVerifyClick={verifyCaller}
              />
            </section>

            {/* Recommendation snapshot */}
            {showResult && result && (
              <section className="rounded-lg border border-vn-border bg-white p-4 font-mono shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                  System Security Response
                </p>
                <p className="mt-2 font-sans text-xs leading-relaxed text-vn-navy">
                  {result.risk.response}
                </p>
                {analysis.tier === "critical" && (
                  <p className="mt-3 rounded border border-vn-red/40 bg-vn-red/10 px-2.5 py-2 text-[11px] font-bold leading-relaxed text-vn-red">
                    CRITICAL: Do not transmit OTPs, passwords, or payments before out-of-band verification.
                  </p>
                )}
              </section>
            )}

            {/* Advanced details drawer */}
            <section className="card-surface rounded-lg border border-vn-border bg-white">
              <button
                type="button"
                aria-expanded={advancedOpen}
                onClick={() => setAdvancedOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-mono"
              >
                <span className="inline-flex items-center gap-2 text-xs font-bold text-vn-navy">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-vn-primary" aria-hidden="true" />
                  Mode & System Telemetry
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-vn-muted transition-transform ${advancedOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {advancedOpen && (
                <div className="space-y-4 border-t border-vn-border p-4 font-mono text-xs">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                      Execution Mode
                    </p>
                    <div
                      role="tablist"
                      aria-label="Run mode"
                      className="mt-2 grid grid-cols-2 gap-1 rounded border border-vn-border bg-vn-page p-1"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "demo"}
                        onClick={() => switchMode("demo")}
                        className={`rounded px-2.5 py-1.5 text-xs font-bold transition-colors ${
                          mode === "demo"
                            ? "bg-white text-vn-indigo shadow-sm"
                            : "text-vn-muted hover:text-vn-navy"
                        }`}
                      >
                        Offline Demo
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={mode === "api"}
                        onClick={() => switchMode("api")}
                        className={`rounded px-2.5 py-1.5 text-xs font-bold transition-colors ${
                          mode === "api"
                            ? "bg-white text-vn-blue shadow-sm"
                            : "text-vn-muted hover:text-vn-navy"
                        }`}
                      >
                        Live API
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                      FastAPI Backend Telemetry
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-vn-secondary">Health Endpoint</span>
                      <span
                        className={`font-bold ${
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
                            ? "200 OK"
                            : "Offline"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-vn-secondary">API Target</span>
                      <span className="font-bold text-vn-navy">
                        POST /analyze/full
                      </span>
                    </div>
                  </div>

                  <AnalysisHistory
                    analyses={analysis.recent}
                    onReplay={analysis.replay}
                    onClear={analysis.clearRecent}
                  />
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

const STAGES = [
  { icon: FileSearch, label: "Prepare" },
  { icon: Gauge, label: "Analyze" },
  { icon: ShieldCheck, label: "Decide" },
];

function StageStepper({ current }: { current: number }) {
  return (
    <nav aria-label="Console progress" className="flex items-center gap-2 font-mono">
      {STAGES.map((s, i) => {
        const idx = i + 1;
        const Icon = s.icon;
        const isActive = current === idx;
        const isDone = current > idx;
        return (
          <div key={s.label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex flex-1 items-center gap-2 rounded border px-3 py-1.5 transition-all ${
                isActive
                  ? "border-vn-primary bg-vn-surface-blue"
                  : isDone
                    ? "border-vn-green bg-vn-green/10"
                    : "border-vn-border bg-white"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${
                  isActive
                    ? "bg-vn-primary text-white"
                    : isDone
                      ? "bg-vn-green text-white"
                      : "bg-vn-page text-vn-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="hidden min-w-0 text-xs font-bold sm:block">
                <span className={isActive ? "text-vn-primary" : isDone ? "text-vn-green" : "text-vn-muted"}>
                  {isDone ? "✓ " : `${idx}. `}
                </span>
                <span className={isActive ? "text-vn-navy" : "text-vn-secondary"}>{s.label}</span>
              </span>
            </div>
            {idx < STAGES.length && (
              <StepForward className="h-3.5 w-3.5 shrink-0 text-vn-border" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
