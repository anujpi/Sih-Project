"use client";

import {
  Activity,
  AudioLines,
  CheckCircle2,
  CircleDot,
  Fingerprint,
  Gauge,
  Loader2,
  MessageSquareText,
} from "lucide-react";
import { AnalysisResponse, RiskTier } from "@/lib/types";
import { normalizeScore } from "@/lib/risk-utils";

export type SignalStatus = "idle" | "processing" | "complete" | "skipped";

interface StreamingAnalysisBoardProps {
  isProcessing: boolean;
  voiceStatus: SignalStatus;
  identityStatus: SignalStatus;
  intentStatus: SignalStatus;
  riskStatus: SignalStatus;
  voiceValue?: string;
  identityValue?: string;
  intentValue?: string;
  riskValue?: string;
  result: AnalysisResponse | null;
}

export default function StreamingAnalysisBoard({
  isProcessing,
  voiceStatus,
  identityStatus,
  intentStatus,
  riskStatus,
  voiceValue,
  identityValue,
  intentValue,
  riskValue,
  result,
}: StreamingAnalysisBoardProps) {
  const voice = result?.voice_authenticity;
  const identity = result?.identity_verification;
  const intent = result?.intent_analysis;
  const risk = result?.risk;

  const voiceProb = voice ? normalizeScore(voice.synthetic_probability) : 0;
  const intentScore = intent ? normalizeScore(intent.intent_risk_score) : 0;

  const voiceColor = voiceProb >= 50 ? "#DC2626" : "#059669";
  const identityColor = identity && !identity.identity_match ? "#DC2626" : "#059669";
  const intentColor = intentScore >= 50 ? "#DC2626" : "#059669";
  const riskColor = risk?.tier ? tierColor(risk.tier) : "#1E40AF";

  return (
    <section aria-labelledby="signals-heading" className="card-surface rounded-lg border border-vn-border bg-white p-5 font-mono shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-vn-border pb-3">
        <div>
          <h3 id="signals-heading" className="text-sm font-bold text-vn-navy">
            Telemetry Feature Extraction Matrix
          </h3>
          <p className="mt-0.5 font-sans text-xs text-vn-secondary">
            Parallel stream telemetry across Layer 1 (wav2vec2), Layer 2 (ECAPA-TDNN), and Layer 3 (faster-whisper).
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded border border-vn-border bg-vn-page px-2.5 py-1 text-[10px] font-bold text-vn-navy sm:inline-flex">
          <Activity className="h-3.5 w-3.5 text-vn-primary" aria-hidden="true" />
          {isProcessing ? "Streaming Ingest" : "Ingest Idle"}
        </span>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SignalCard
          icon={<AudioLines className="h-4 w-4 text-vn-cyan" aria-hidden="true" />}
          label="L1: Voice Authenticity"
          value={voiceValue ?? "Awaiting Signal"}
          status={voiceStatus}
          color={voiceColor}
        />
        <SignalCard
          icon={<Fingerprint className="h-4 w-4 text-vn-indigo" aria-hidden="true" />}
          label="L2: Speaker Identity"
          value={identityValue ?? "Awaiting Signal"}
          status={identityStatus}
          color={identityColor}
        />
        <SignalCard
          icon={<MessageSquareText className="h-4 w-4 text-vn-blue" aria-hidden="true" />}
          label="L3: Conversation Intent"
          value={intentValue ?? "Awaiting Signal"}
          status={intentStatus}
          color={intentColor}
        />
        <SignalCard
          icon={<Gauge className="h-4 w-4 text-vn-amber" aria-hidden="true" />}
          label="L4: Unified Risk Score"
          value={riskValue ?? "Awaiting Signal"}
          status={riskStatus}
          color={riskColor}
        />
      </div>
    </section>
  );
}

function SignalCard({
  icon,
  label,
  value,
  status,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: SignalStatus;
  color: string;
}) {
  const statusIcon =
    status === "processing" ? (
      <Loader2 className="h-3 w-3 animate-spin text-vn-primary" aria-hidden="true" />
    ) : status === "complete" ? (
      <CheckCircle2 className="h-3 w-3 text-vn-green" aria-hidden="true" />
    ) : (
      <CircleDot className="h-3 w-3 text-vn-muted" aria-hidden="true" />
    );

  return (
    <div className={`rounded border p-3.5 transition-all ${status === "processing" ? "border-vn-primary bg-vn-surface-blue" : "border-vn-border bg-white"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded border border-vn-border bg-vn-page text-vn-navy">
          {icon}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-vn-navy">
          {statusIcon}
          {status === "processing" ? "Extracting" : status === "complete" ? "Complete" : status === "skipped" ? "Skipped" : "Waiting"}
        </span>
      </div>
      <p className="mt-2.5 font-sans text-xs font-bold text-vn-navy">{label}</p>
      <p className="mt-0.5 font-mono text-base font-bold tabular-nums" style={{ color: status === "complete" ? color : "var(--vn-muted)" }}>
        {value}
      </p>
    </div>
  );
}

function tierColor(tier: RiskTier): string {
  switch (tier) {
    case "low": return "#059669";
    case "medium": return "#D97706";
    case "high": return "#EA580C";
    case "critical": return "#DC2626";
  }
}
