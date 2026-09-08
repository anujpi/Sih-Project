"use client";

import {
  AudioLines,
  Fingerprint,
  MessageSquareText,
  Gauge,
  Activity,
  CheckCircle2,
  Loader2,
  CircleDot,
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

  const voiceColor = voiceProb >= 50 ? "#D92D4F" : "#159A6B";
  const identityColor = identity && !identity.identity_match ? "#D92D4F" : "#159A6B";
  const intentColor = intentScore >= 50 ? "#D92D4F" : "#159A6B";
  const riskColor = result ? tierColor(risk!.tier) : "#1565D8";

  return (
    <section aria-labelledby="signals-heading" className="card-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 id="signals-heading" className="text-base font-bold text-vn-navy">
            Live signal board
          </h3>
          <p className="mt-0.5 text-sm text-vn-secondary">
            Voice authenticity and identity run in parallel — each card updates independently.
          </p>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-vn-primary/25 bg-vn-primary/8 px-3 py-1 text-[11px] font-medium text-vn-primary sm:inline-flex">
          <Activity className="h-3.5 w-3.5" aria-hidden="true" />
          {isProcessing ? "Streaming" : "Idle"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SignalCard
          icon={<AudioLines className="h-4 w-4" aria-hidden="true" />}
          label="Voice authenticity"
          value={voiceValue ?? "Not checked"}
          status={voiceStatus}
          color={voiceColor}
        />
        <SignalCard
          icon={<Fingerprint className="h-4 w-4" aria-hidden="true" />}
          label="Identity consistency"
          value={identityValue ?? "Not checked"}
          status={identityStatus}
          color={identityColor}
        />
        <SignalCard
          icon={<MessageSquareText className="h-4 w-4" aria-hidden="true" />}
          label="Conversation intent"
          value={intentValue ?? "Not checked"}
          status={intentStatus}
          color={intentColor}
        />
        <SignalCard
          icon={<Gauge className="h-4 w-4" aria-hidden="true" />}
          label="Risk response"
          value={riskValue ?? "Not checked"}
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
      <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
    ) : status === "complete" ? (
      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
    ) : status === "skipped" ? (
      <CircleDot className="h-3 w-3" aria-hidden="true" />
    ) : (
      <CircleDot className="h-3 w-3" aria-hidden="true" />
    );

  return (
    <div className={`rounded-xl border p-4 transition-all ${status === "processing" ? "border-vn-primary/40 bg-vn-primary/5" : "border-vn-border bg-white"}`}>
      <div className="flex items-center justify-between gap-2">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${status === "processing" ? "bg-vn-primary/10 text-vn-primary" : "bg-vn-border/50 text-vn-muted"}`}>
          {icon}
        </span>
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest ${
          status === "processing" ? "text-vn-primary" : status === "complete" ? "text-vn-green" : "text-vn-muted"
        }`}>
          {statusIcon}
          {status === "processing" ? "Analyzing" : status === "complete" ? "Complete" : status === "skipped" ? "Skipped" : "Idle"}
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold text-vn-navy">{label}</p>
      <p className="mt-0.5 font-mono text-lg font-bold tabular-nums" style={{ color: status === "complete" ? color : "var(--vn-muted)" }}>
        {value}
      </p>
    </div>
  );
}

function tierColor(tier: RiskTier): string {
  switch (tier) {
    case "low": return "#159A6B";
    case "medium": return "#D97706";
    case "high": return "#EA6A00";
    case "critical": return "#D92D4F";
  }
}
