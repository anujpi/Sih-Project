"use client";

import {
  AlertTriangle,
  AudioLines,
  AudioWaveform,
  CheckCircle2,
  Fingerprint,
  Gauge,
  ScanSearch,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { RiskTier } from "@/lib/types";

export type LiveGuardState = "idle" | "scanning" | RiskTier | "error";
export type LiveGuardSignalId = "voice" | "identity" | "intent" | "risk";

export interface LiveGuardSignals {
  voice?: string;
  identity?: string;
  intent?: string;
  risk?: string;
}

interface LiveGuardWidgetProps {
  state?: LiveGuardState;
  score?: number;
  signals?: LiveGuardSignals;
  scanPhase?: LiveGuardSignalId;
  preview?: {
    tier: RiskTier;
    label?: string;
    highlight?: "identity" | null;
  } | null;
  onSelectSignal?: (id: LiveGuardSignalId) => void;
  onVerifyClick?: () => void;
}

const STATE_COLORS: Record<LiveGuardState, string> = {
  idle: "#1565D8",
  scanning: "#00A7C7",
  low: "#159A6B",
  medium: "#D97706",
  high: "#EA6A00",
  critical: "#D92D4F",
  error: "#D92D4F",
};

const BADGE_LABELS: Record<LiveGuardState, string> = {
  idle: "SYSTEM READY",
  scanning: "ANALYZING SIGNALS",
  low: "LOW RISK",
  medium: "CAUTION REQUIRED",
  high: "VERIFY CALLER",
  critical: "CRITICAL RISK",
  error: "ANALYSIS ERROR",
};

const PHASE_TEXT: Record<LiveGuardSignalId, string> = {
  voice: "Analyzing voice authenticity...",
  identity: "Checking identity consistency...",
  intent: "Scanning conversation intent...",
  risk: "Building risk verdict...",
};

const STATUS_TEXT: Record<LiveGuardState, string> = {
  idle: "System ready to analyze.",
  scanning: "Analyzing voice signals...",
  low: "Low risk — normal conversation.",
  medium: "Caution — verify before sharing sensitive information.",
  high: "Independent verification recommended.",
  critical: "Critical impersonation risk.",
  error: "Analysis failed — unable to screen the call.",
};

const SIGNAL_NODES: {
  id: Exclude<LiveGuardSignalId, "risk">;
  label: string;
  sub: string;
  accent: string;
  icon: typeof AudioLines;
  explanation: string;
}[] = [
  {
    id: "voice",
    label: "Voice",
    sub: "Authenticity",
    accent: "#00A7C7",
    icon: AudioLines,
    explanation: "Synthetic-voice probability from the acoustic model.",
  },
  {
    id: "identity",
    label: "Identity",
    sub: "Verification",
    accent: "#5B5FEF",
    icon: Fingerprint,
    explanation: "Speaker similarity compared against the claimed reference voice.",
  },
  {
    id: "intent",
    label: "Intent",
    sub: "Analysis",
    accent: "#2F80ED",
    icon: ScanSearch,
    explanation: "Detected scam-pressure signals in the conversation.",
  },
];

const PHASE_ORDER: LiveGuardSignalId[] = ["voice", "identity", "intent", "risk"];
const PREVIEW_TIPS: Record<LiveGuardSignalId, string> = {
  voice: "Click to open the voice authenticity evidence card.",
  identity: "Click to open the identity verification evidence card.",
  intent: "Click to open the intent analysis evidence card.",
  risk: "Click to open the unified risk engine card.",
};

const RING_C = 339.3;

export default function LiveGuardWidget({
  state = "idle",
  score,
  signals = {},
  scanPhase,
  preview = null,
  onSelectSignal,
  onVerifyClick,
}: LiveGuardWidgetProps) {
  const previewing = state === "idle" && !!preview;
  const isScanning = state === "scanning";
  const effectiveTier: RiskTier = previewing
    ? (preview?.tier ?? "low")
    : state === "high" || state === "medium" || state === "low" || state === "critical"
      ? state
      : "low";
  const color = previewing
    ? STATE_COLORS[preview?.tier ?? "low"]
    : STATE_COLORS[state];

  const hasScore = score !== undefined && score >= 0 && !isScanning && state !== "idle" && !previewing;

  const [hovered, setHovered] = useState<LiveGuardSignalId | null>(null);
  const [selected, setSelected] = useState<LiveGuardSignalId | null>(null);
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    if (!isScanning || scanPhase) return;
    const timer = setInterval(() => setCycleIndex((i) => (i + 1) % PHASE_ORDER.length), 1450);
    return () => clearInterval(timer);
  }, [isScanning, scanPhase]);

  const phaseId: LiveGuardSignalId = scanPhase ?? PHASE_ORDER[cycleIndex];

  function nodeActive(id: Exclude<LiveGuardSignalId, "risk">): boolean {
    if (isScanning) return phaseId === id;
    return false;
  }

  function nodeHighlighted(id: Exclude<LiveGuardSignalId, "risk">): boolean {
    if (isScanning) return false;
    if (preview?.highlight === id) return true;
    const strong = effectiveTier === "high" || effectiveTier === "critical" || state === "error";
    return strong && id === "identity";
  }

  const lockHeld = state === "critical" || state === "error";

  const badgeLabel = previewing
    ? "SCENARIO PREVIEW"
    : BADGE_LABELS[state];

  const message = previewing
    ? `${preview?.label ?? "Scenario"} preview — ${STATUS_TEXT[preview?.tier ?? "low"].split(".")[0].toLowerCase()}.`
    : isScanning
      ? PHASE_TEXT[phaseId]
      : STATUS_TEXT[state];

  const focused = hovered ?? selected;
  const readout = focused
    ? {
        title: focused,
        metric: signals[focused] ?? null,
        line: focused === "risk"
          ? `${hasScore ? `Score ${score}/100. ` : ""}${STATUS_TEXT[state].split(".")[0]}.`
          : SIGNAL_NODES.find((n) => n.id === focused)?.explanation ?? "",
        hint: "Click to open the related evidence card.",
      }
    : isScanning
      ? {
          title: phaseId,
          metric: signals[phaseId] ?? null,
          line: PHASE_TEXT[phaseId],
          hint: "Signal flowing through the intelligence layers.",
        }
      : hasScore
        ? {
            title: "risk",
            metric: `Score ${score}/100`,
            line: STATUS_TEXT[state].split(".")[0],
            hint: "Click a layer node for its live reading.",
          }
        : previewing
          ? {
              title: "voice",
              metric: "Scenario preview",
              line: `Showing the expected ${preview?.tier ?? "low"} pattern before analysis runs.`,
              hint: "Run the analysis to see the full pipeline.",
            }
          : {
              title: null,
              metric: null,
              line: "Awaiting input — select a scenario or feed a voice signal into the core.",
              hint: "Hover a signal node for live readings.",
            };

  return (
    <div className="mx-auto w-full max-w-[400px] select-none overflow-hidden">
      {/* Status badge */}
      <div className="flex justify-center">
        <span
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ borderColor: `${color}44`, background: `${color}0A`, color }}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${isScanning || state === "error" ? "vn-pulse-soft" : ""}`}
            style={{ background: color }}
            aria-hidden="true"
          />
          {badgeLabel}
        </span>
      </div>

      {/* VOICE SIGNAL label + connector */}
      <div className="mt-4 flex flex-col items-center">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-vn-muted">
          <AudioWaveform className="h-3.5 w-3.5" style={{ color }} aria-hidden="true" />
          Voice signal
        </div>
        <div aria-hidden="true" className="relative mt-1 h-6 w-px overflow-hidden" style={{ background: `linear-gradient(${color}44, ${color})` }}>
          {isScanning && <span className="vn-drop absolute inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />}
        </div>
      </div>

      {/* Core: telemetry gauge + risk score */}
      <div
        className="relative mx-auto mt-2 w-[min(66vw,248px)]"
        style={{ "--ring-c": `${RING_C}` } as CSSProperties}
      >
        <div className="relative aspect-square w-full">
          {/* Background container */}
          <div aria-hidden="true" className="absolute inset-0 rounded-full bg-white border border-vn-border" />

          {/* Static base ring */}
          <div aria-hidden="true" className="absolute inset-0 rounded-full" style={{ border: `1px solid ${color}33` }} />

          {/* Progress ring */}
          <svg
            className="absolute inset-0 h-full w-full -rotate-90"
            viewBox="0 0 120 120"
            aria-hidden="true"
            fill="none"
          >
            <circle cx="60" cy="60" r="54" stroke="#E2E8F0" strokeWidth="3" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
              className={isScanning ? "vn-progress-scan" : ""}
              style={{
                strokeDasharray: RING_C,
                strokeDashoffset:
                  !isScanning && hasScore ? RING_C * (1 - (score ?? 0) / 100) : undefined,
                transition: "stroke-dashoffset 1.2s ease",
              }}
            />
          </svg>

          {/* Shield contour */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center">
            <svg
              className="h-[54%] w-[54%]"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l8 3v6c0 5-3.3 8.6-8 11-4.7-2.4-8-6-8-11V5l8-3z"
                fill={`${color}0D`}
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Risk score inside the shield */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.25em]" style={{ color }}>
                {isScanning ? "Analyzing" : "Risk Verdict"}
              </p>
              <p className="mt-0.5 font-mono text-[2.1rem] font-bold leading-none tabular-nums sm:text-[2.4rem]" style={{ color }}>
                {hasScore ? score : isScanning ? "..." : "--"}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1" style={{ color }}>
                {state === "low" ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : state === "critical" ? (
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                ) : state === "medium" || state === "high" ? (
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                ) : state === "error" ? (
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <span className={`h-1.5 w-1.5 rounded-full ${isScanning ? "vn-pulse-soft" : ""}`} style={{ background: color }} aria-hidden="true" />
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Branch connectors into the three layer nodes */}
      <div className="mx-auto mt-1 w-full max-w-[300px]">
        <div className="grid grid-cols-3 justify-items-center gap-2">
          {SIGNAL_NODES.map((node) => {
            const active = nodeActive(node.id);
            const highlight = nodeHighlighted(node.id);
            const lit = active || highlight;
            return (
              <span
                key={node.id}
                aria-hidden="true"
                className="relative h-5 w-px overflow-hidden rounded-full"
                style={{ background: lit ? node.accent : "#D9E2EC" }}
              >
                {highlight && !active && (
                  <span className="vn-pulse-soft absolute inset-0" style={{ background: node.accent }} />
                )}
                {active && (
                  <span
                    className="vn-drop absolute left-0 top-0 h-1.5 w-full rounded-full"
                    style={{ background: node.accent }}
                  />
                )}
              </span>
            );
          })}
        </div>

        {/* Voice / Identity / Intent nodes */}
        <div className="mt-1 grid grid-cols-3 gap-2">
          {SIGNAL_NODES.map((node) => {
            const NodeIcon = node.icon;
            const isHovered = hovered === node.id;
            const isCurrent = selected === node.id;
            const active = nodeActive(node.id);
            const highlight = nodeHighlighted(node.id);
            const lit = active || highlight || isHovered || isCurrent;
            const usedColor = lit ? node.accent : color;
            return (
              <button
                key={node.id}
                type="button"
                aria-pressed={isCurrent}
                aria-label={`${node.label} signal — ${signals[node.id] ?? "no reading yet"}. ${PREVIEW_TIPS[node.id]}`}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered((h) => (h === node.id ? null : h))}
                onFocus={() => setHovered(node.id)}
                onBlur={() => setHovered((h) => (h === node.id ? null : h))}
                onClick={() => {
                  setSelected(node.id);
                  onSelectSignal?.(node.id);
                }}
                className="group relative flex w-full flex-col items-center gap-1 rounded-xl border px-1.5 py-2.5 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary"
                style={{
                  borderColor: lit ? `${usedColor}66` : "#D9E2EC",
                  background: lit ? `${usedColor}08` : "#FFFFFF",
                }}
              >
                {(active || highlight) && (
                  <span
                    aria-hidden="true"
                    className="vn-node-glow pointer-events-none absolute h-9 w-9 rounded-full"
                    style={{ background: `radial-gradient(circle, ${usedColor}22, transparent 70%)` }}
                  />
                )}
                <span className="relative">
                  <NodeIcon className="h-4 w-4" style={{ color: usedColor }} aria-hidden="true" />
                </span>
                <span className="relative text-[11px] font-bold leading-none text-vn-navy">{node.label}</span>
                <span className="relative font-mono text-[9px] leading-none text-vn-muted">{node.sub}</span>
                <span className="relative font-mono text-[10px] font-semibold leading-none" style={{ color: lit ? usedColor : "var(--vn-muted)" }}>
                  {signals[node.id] ?? "--"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Connector to the risk engine */}
      <div aria-hidden="true" className="mx-auto mt-2 h-5 w-px overflow-hidden" style={{ background: `linear-gradient(${color}44, ${color})` }}>
        {isScanning && <span className="vn-drop inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />}
      </div>

      {/* Risk engine node */}
      <button
        type="button"
        aria-pressed={selected === "risk"}
        aria-label={`Risk engine — ${signals.risk ?? "no verdict yet"}. ${PREVIEW_TIPS.risk}`}
        onMouseEnter={() => setHovered("risk")}
        onMouseLeave={() => setHovered((h) => (h === "risk" ? null : h))}
        onFocus={() => setHovered("risk")}
        onBlur={() => setHovered((h) => (h === "risk" ? null : h))}
        onClick={() => {
          setSelected("risk");
          onSelectSignal?.("risk");
        }}
        className="mx-auto mt-0.5 flex w-full max-w-[300px] items-center gap-3 rounded-xl border p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary"
        style={{
          borderColor: hovered === "risk" || selected === "risk" ? `${color}66` : "#D9E2EC",
          background: hovered === "risk" || selected === "risk" ? `${color}08` : "#FFFFFF",
        }}
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: `${color}10`, color }}
        >
          <Gauge className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-bold text-vn-navy">Risk Engine</span>
          <span className="mt-0.5 block font-mono text-[10px] text-vn-muted">
            {signals.risk ?? "Combined verdict"}
          </span>
        </span>
        <span className="shrink-0 font-mono text-sm font-bold tabular-nums" style={{ color }}>
          {hasScore ? `${score}/100` : isScanning ? "..." : "--"}
        </span>
      </button>

      {/* Live signal readout */}
      <div
        className="mt-3 flex min-h-[64px] items-start gap-3 rounded-xl border border-vn-border bg-vn-surface-blue px-3.5 py-3"
        aria-live="polite"
      >
        <span
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
          style={{ background: `${color}10`, color }}
          aria-hidden="true"
        >
          {readout.title === "voice" ? (
            <AudioLines className="h-3.5 w-3.5" />
          ) : readout.title === "identity" ? (
            <Fingerprint className="h-3.5 w-3.5" />
          ) : readout.title === "intent" ? (
            <ScanSearch className="h-3.5 w-3.5" />
          ) : readout.title === "risk" ? (
            <Gauge className="h-3.5 w-3.5" />
          ) : (
            <AudioWaveform className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          {readout.title && (
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color }}>
              {readout.title === "risk" ? "Risk engine" : readout.title}
              {readout.metric ? ` : ${readout.metric}` : ""}
            </span>
          )}
          <span className="mt-0.5 block text-xs leading-snug text-vn-secondary">{readout.line}</span>
          {!isScanning && (
            <span className="mt-0.5 block text-[10px] text-vn-muted">{readout.hint}</span>
          )}
        </span>
      </div>

      {/* Status message + critical action */}
      <div className="mt-4 flex min-h-[40px] flex-wrap items-center justify-center gap-3 text-center">
        <p
          aria-live={isScanning ? "off" : "polite"}
          className="text-sm font-semibold"
          style={{ color: previewing ? color : "var(--vn-navy)" }}
        >
          {message}
        </p>
        {effectiveTier === "critical" && (
          <button
            type="button"
            onClick={onVerifyClick}
            className="inline-flex items-center gap-1.5 rounded-xl border border-vn-red/30 bg-vn-red/8 px-4 py-2 text-xs font-bold text-vn-red transition-colors hover:bg-vn-red/15"
          >
            <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Verify caller
          </button>
        )}
      </div>
    </div>
  );
}