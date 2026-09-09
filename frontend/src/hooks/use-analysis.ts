"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnalysisMeta,
  AnalysisResponse,
  AnalysisState as AnalysisStateType,
  PipelineStage,
  PipelineStageStatus,
  RecentAnalysis,
  RiskTier,
  TimelineEvent,
  VerificationStatus,
} from "@/lib/types";
import { AnalysisInputState } from "@/components/audio-upload";
import {
  getDemoResponse,
  getStreamEvents,
  SCENARIO_LABELS,
} from "@/lib/demo-scenarios";
import { analyzeAudio, ApiClientError, friendlyApiError } from "@/lib/api-client";
import { normalizeScore } from "@/lib/risk-utils";

const RECORD_KEY = "vaanishield.recent";

export interface PipelineStepDef {
  id: string;
  label: string;
  statusText: string;
  completeText?: string;
  skippedText?: string;
}

export const PIPELINE_STEPS: PipelineStepDef[] = [
  {
    id: "authenticity",
    label: "Voice Authenticity",
    statusText: "Extracting voice features...",
    completeText: "Voice features extracted",
  },
  {
    id: "identity",
    label: "Identity Verification",
    statusText: "Comparing trusted identity...",
    completeText: "Identity compared",
    skippedText: "Identity verification not performed",
  },
  {
    id: "intent",
    label: "Intent Analysis",
    statusText: "Transcribing conversation...",
    completeText: "Scanning for risky intent...",
  },
  {
    id: "risk",
    label: "Risk Engine",
    statusText: "Building explainable risk verdict...",
    completeText: "Risk verdict built",
  },
];

const PIPELINE_STEP_DELAYS = [1400, 1500, 1800, 1100];
const PIPELINE_COMPLETE_DELAY = 700;

function initialStages(): PipelineStage[] {
  return PIPELINE_STEPS.map((step) => ({
    id: step.id,
    label: step.label,
    status: "waiting" as PipelineStageStatus,
  }));
}

function loadRecent(): RecentAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECORD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as RecentAnalysis[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(analyses: RecentAnalysis[]) {
  try {
    window.localStorage.setItem(RECORD_KEY, JSON.stringify(analyses));
  } catch {
    // storage unavailable - demo still works in-memory
  }
}

function makeId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now());
}

function formatTimestamp(d: Date): string {
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export interface AnalysisState {
  systemOnline: boolean;
  checkingSystem: boolean;
  stages: PipelineStage[];
  isProcessing: boolean;
  errorMessage: string | null;
  canRetry: boolean;
  result: AnalysisResponse | null;
  meta: AnalysisMeta | null;
  verificationStatus: VerificationStatus;
  recent: RecentAnalysis[];
  timeline: TimelineEvent[];
  analysisState: AnalysisStateType;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    systemOnline: true,
    checkingSystem: true,
    stages: initialStages(),
    isProcessing: false,
    errorMessage: null,
    canRetry: false,
    result: null,
    meta: null,
    verificationStatus: "none",
    recent: [],
    timeline: [],
    analysisState: "idle",
  });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const retryStateRef = useRef<AnalysisInputState | null>(null);

  const updateStage = useCallback((id: string, patchSet: Partial<PipelineStage>) => {
    setState((prev) => ({
      ...prev,
      stages: prev.stages.map((s) =>
        s.id === id ? { ...s, ...patchSet } : s
      ),
    }));
  }, []);

  const pushTimeline = useCallback((message: string, layer?: TimelineEvent["layer"], type: TimelineEvent["type"] = "info") => {
    setState((prev) => ({
      ...prev,
      timeline: [...prev.timeline, {
        id: makeId(),
        time: formatTime(new Date()),
        message,
        layer,
        type,
      }].slice(-50),
    }));
  }, []);

  const setAnalysisState = useCallback((analysisState: AnalysisStateType) => {
    setState((prev) => ({ ...prev, analysisState }));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setState((prev) => ({ ...prev, checkingSystem: true }));
      const ok = await import("@/lib/api-client").then((m) => m.checkHealth());
      if (!cancelled) {
        setState((prev) => ({
          ...prev,
          systemOnline: ok,
          checkingSystem: false,
        }));
      }
    };
    void run();
    setState((prev) => ({ ...prev, recent: loadRecent() }));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  }, []);

  const resetPipeline = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    setState((prev) => ({
      ...prev,
      stages: initialStages(),
      result: null,
      verificationStatus: "none",
      errorMessage: null,
      canRetry: false,
      timeline: [],
      analysisState: "idle",
    }));
    retryStateRef.current = null;
  }, []);

  const recordAnalysis = useCallback(
    (result: AnalysisResponse, meta: AnalysisMeta) => {
      setState((prev) => {
        const timestamp = formatTimestamp(new Date());
        const record: RecentAnalysis = {
          id: makeId(),
          scenario: meta.scenarioLabel,
          tier: result.risk.tier,
          score: normalizeScore(result.risk.overall_risk),
          timestamp,
          isDemo: meta.isDemo,
          result,
        };
        const nextRecent = [record, ...prev.recent].slice(0, 6);
        saveRecent(nextRecent);
        return {
          ...prev,
          recent: nextRecent,
          meta: { ...meta, timestamp },
        };
      });
    },
    []
  );

  const runDemo = useCallback(
    (input: AnalysisInputState) => {
      resetPipeline();
      retryStateRef.current = null;
      const meta: AnalysisMeta = {
        scenarioLabel: SCENARIO_LABELS[input.scenario],
        scenarioType: input.scenario,
        claimedIdentity: input.claimedIdentity,
        isDemo: true,
        modeLabel: "Demo Mode",
        timestamp: formatTimestamp(new Date()),
      };
      setState((prev) => ({ ...prev, isProcessing: true, meta }));
      setAnalysisState("queued");

      const identityAvailable =
        input.referenceAudioFile !== null || input.claimedIdentity !== "Not specified";

      // Emit streaming timeline events
      const events = getStreamEvents(input.scenario);
      let delay = 0;
      events.forEach((ev) => {
        delay += ev.delayMs;
        schedule(() => {
          pushTimeline(ev.message, ev.layer, ev.type);
        }, delay);
      });

      // Update analysis state as events progress
      const stageEvents: Array<{ at: number; state: AnalysisStateType }> = [
        { at: SCIENCE(events, 0, 2), state: "voice_processing" },
        { at: SCIENCE(events, 0, 5), state: "identity_processing" },
        { at: SCIENCE(events, 0, 7), state: "transcript_updating" },
        { at: SCIENCE(events, 0.3 * events.length + 2), state: "intent_processing" },
        { at: SCIENCE(events, 0.7 * events.length), state: "risk_recalculating" },
      ];
      stageEvents.forEach((se) => {
        schedule(() => setAnalysisState(se.state), se.at);
      });

      PIPELINE_STEPS.forEach((def, index) => {
        schedule(
          () => {
            if (def.id === "identity" && !identityAvailable) {
              updateStage(def.id, {
                status: "skipped",
                statusText: def.skippedText ?? "Skipped",
              });
              return;
            }
            updateStage(def.id, { status: "processing", statusText: def.statusText });
            schedule(
              () => {
                updateStage(def.id, {
                  status: "completed",
                  statusText:
                    def.completeText ??
                    def.statusText,
                });
                if (index === PIPELINE_STEPS.length - 1) {
                  schedule(() => {
                    let value = getDemoResponse(input.scenario);
                    if (!identityAvailable) {
                      value = {
                        ...value,
                        identity_verification: null,
                        risk: {
                          ...value.risk,
                          breakdown: {
                            ...value.risk.breakdown,
                            identity_mismatch_risk: 0,
                          },
                        },
                      };
                    }
                    recordAnalysis(value, meta);
                    setState((prev) => ({
                      ...prev,
                      isProcessing: false,
                      result: value,
                      verificationStatus: "none",
                      analysisState: value.risk.tier === "high" || value.risk.tier === "critical"
                        ? "verification_required"
                        : "complete",
                    }));
                    pushTimeline("Analysis complete — verdict ready", "risk", "success");
                  }, PIPELINE_COMPLETE_DELAY);
                }
              },
              PIPELINE_STEP_DELAYS[index]
            );
          },
          index * 700
        );
      });
    },
    [resetPipeline, schedule, updateStage, recordAnalysis, pushTimeline, setAnalysisState]
  );

  const runApi = useCallback(
    async (input: AnalysisInputState) => {
      resetPipeline();
      const meta: AnalysisMeta = {
        scenarioLabel: SCENARIO_LABELS[input.scenario],
        scenarioType: input.scenario,
        claimedIdentity: input.claimedIdentity,
        isDemo: false,
        modeLabel: "API Mode",
        timestamp: formatTimestamp(new Date()),
      };
      setState((prev) => ({ ...prev, isProcessing: true, meta }));
      setAnalysisState("queued");
      retryStateRef.current = input;

      let startedIdx = 0;
      const startTick = setInterval(() => {
        const step = PIPELINE_STEPS[startedIdx];
        if (step) {
          updateStage(step.id, {
            status: "processing",
            statusText: step.statusText,
          });
          startedIdx += 1;
          if (startedIdx >= PIPELINE_STEPS.length) clearInterval(startTick);
        }
      }, 800);
      timersRef.current.push(setTimeout(() => clearInterval(startTick), 4000));

      try {
        pushTimeline("Sending audio to VAANISHIELD API", undefined, "info");
        const value = await analyzeAudio(input.audioFile!, input.referenceAudioFile);
        PIPELINE_STEPS.forEach((def, index) => {
          schedule(
            () => {
              updateStage(def.id, {
                status: "completed",
                statusText:
                  def.id === "identity" && !value.identity_verification
                    ? (def.skippedText ?? "Skipped")
                    : (def.completeText ?? def.statusText),
              });
            },
            index * 220
          );
        });
        schedule(() => {
          recordAnalysis(value, meta);
          setState((prev) => ({
            ...prev,
            isProcessing: false,
            result: value,
            verificationStatus: "none",
            canRetry: false,
            analysisState: value.risk.tier === "high" || value.risk.tier === "critical"
              ? "verification_required"
              : "complete",
          }));
          pushTimeline("Analysis complete — verdict ready", "risk", "success");
          retryStateRef.current = null;
        }, PIPELINE_STEPS.length * 220 + 250);
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isProcessing: false,
          errorMessage:
            err instanceof ApiClientError ? friendlyApiError(err) : friendlyApiError(err),
          canRetry: true,
          stages: prev.stages.map((s) => ({ ...s, status: "error" })),
          analysisState: "error",
        }));
        pushTimeline("Analysis failed — unable to screen the call", "risk", "warning");
      }
    },
    [resetPipeline, schedule, updateStage, recordAnalysis, pushTimeline, setAnalysisState]
  );

  const runAnalysis = useCallback(
    (input: AnalysisInputState) => {
      if (!input.audioFile) {
        runDemo(input);
      } else {
        void runApi(input);
      }
    },
    [runDemo, runApi]
  );

  const retry = useCallback(() => {
    if (retryStateRef.current) {
      void runApi(retryStateRef.current);
    }
  }, [runApi]);

  const replay = useCallback((record: RecentAnalysis) => {
    resetPipeline();
    setState((prev) => ({
      ...prev,
      result: record.result,
      verificationStatus: "none",
      meta: {
        scenarioLabel: record.scenario,
        scenarioType: null as never,
        claimedIdentity: "See original scenario",
        isDemo: record.isDemo,
        modeLabel: record.isDemo ? "Demo Mode" : "API Mode",
        timestamp: record.timestamp,
      },
      stages: prev.stages.map((s, index) => ({
        ...s,
        status:
          index === 1 && !record.result.identity_verification
            ? ("skipped" as PipelineStageStatus)
            : ("completed" as PipelineStageStatus),
      })),
      analysisState: record.result.risk.tier === "high" || record.result.risk.tier === "critical"
        ? "verification_required"
        : "complete",
    }));
  }, [resetPipeline]);

  const clearRecent = useCallback(() => {
    saveRecent([]);
    setState((prev) => ({ ...prev, recent: [] }));
  }, []);

  const setVerificationStatus = useCallback((status: VerificationStatus) => {
    setState((prev) => ({
      ...prev,
      verificationStatus: status,
      analysisState: status === "verified" ? "verified" : status === "blocked" ? "blocked" : prev.analysisState,
    }));
  }, []);

  const analyzeAnother = useCallback(() => {
    resetPipeline();
    setState((prev) => ({ ...prev, meta: null }));
  }, [resetPipeline]);

  const tier: RiskTier = useMemo(
    () => state.result?.risk.tier ?? "low",
    [state.result]
  );

  return {
    ...state,
    tier,
    runAnalysis,
    retry,
    replay,
    clearRecent,
    setVerificationStatus,
    analyzeAnother,
  };
}

function SCIENCE(source: unknown, start: number, count?: number): number {
  let total = 0;
  if (Array.isArray(source)) {
    const end = count !== undefined ? start + count : source.length;
    for (let i = start; i < end && i < source.length; i++) {
      const ev = source[i] as { delayMs?: number };
      total += ev.delayMs ?? 0;
    }
  }
  return total;
}
