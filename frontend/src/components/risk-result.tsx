"use client";

import { Clock3, RefreshCw, ShieldAlert } from "lucide-react";
import RiskGauge from "@/components/risk-gauge";
import { TierBadge } from "@/components/status-badge";
import { AnalysisMeta, AnalysisResponse } from "@/lib/types";
import { normalizeScore, TIER_META } from "@/lib/risk-utils";

interface RiskResultProps {
  result: AnalysisResponse;
  meta: AnalysisMeta | null;
  onAnalyzeAnother: () => void;
}

function buildReasons(result: AnalysisResponse): string[] {
  const reasons: string[] = [];
  const voice = normalizeScore(result.voice_authenticity.synthetic_probability);
  if (voice >= 50) {
    reasons.push(
      `Layer 1 wav2vec2 acoustic model flagged synthetic speech features (${Math.round(voice)}% probability).`
    );
  } else {
    reasons.push("Layer 1 acoustic analysis detected no synthetic speech anomalies.");
  }

  const identity = result.identity_verification;
  if (identity) {
    const sim = normalizeScore(identity.similarity_score);
    const src = identity.source === "registry" ? "Voiceprint Registry" : "reference clip";
    reasons.push(
      identity.identity_match
        ? `Layer 2 ECAPA-TDNN passed speaker match against ${src} (${Math.round(sim)}% similarity).`
        : `Layer 2 ECAPA-TDNN flagged speaker mismatch against ${src} (${Math.round(sim)}% similarity).`
    );
  } else {
    reasons.push("Layer 2 speaker verification skipped — no claimed voiceprint or reference sample provided.");
  }

  const triggered = result.intent_analysis.triggered_intents;
  if (triggered.length > 0) {
    reasons.push(
      `Layer 3 ASR scam intent engine flagged ${triggered.length} risk pattern${
        triggered.length > 1 ? "s" : ""
      } (${triggered.join(", ")}).`
    );
  } else {
    reasons.push("Layer 3 ASR scam intent engine found no high-risk conversational patterns.");
  }

  return reasons.slice(0, 3);
}

export default function RiskResult({
  result,
  meta,
  onAnalyzeAnother,
}: RiskResultProps) {
  const score = normalizeScore(result.risk.overall_risk);
  const tier = result.risk.tier;
  const tierMeta = TIER_META[tier];
  const reasons = buildReasons(result);

  return (
    <section
      aria-labelledby="risk-result-heading"
      className="card-surface rounded-lg border border-vn-border bg-white overflow-hidden shadow-sm"
    >
      <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
        <div className="flex flex-col items-center justify-center gap-2 border-b border-vn-border p-6 bg-vn-page lg:border-b-0 lg:border-r">
          <RiskGauge score={score} tier={tier} />
          <p className="font-mono text-[11px] text-vn-muted">
            Profile: {meta?.scenarioLabel ?? "Call Telemetry"}
          </p>
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              id="risk-result-heading"
              className="text-lg font-bold tracking-tight text-vn-navy"
            >
              {meta?.scenarioLabel ?? "Unified Risk Verdict"}
            </h3>
            <TierBadge tier={tier} />
            {meta?.isDemo && (
              <span className="rounded border border-vn-border bg-vn-page px-2 py-0.5 font-mono text-[10px] font-bold text-vn-secondary">
                Demo Mode
              </span>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-vn-secondary sm:text-sm">
            {result.risk.response}
          </p>

          {tier === "critical" && (
            <div
              role="alert"
              className="mt-3 rounded border border-vn-red/40 bg-vn-red/10 p-3"
            >
              <p className="inline-flex items-center gap-2 font-mono text-xs font-bold text-vn-red">
                <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                MANDATORY WARN: Do not transmit OTPs, passwords, or financial transfers until caller identity is independently verified out-of-band.
              </p>
            </div>
          )}

          <div className="mt-4 space-y-2 border-t border-vn-border pt-4">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-vn-muted">
              Primary Verdict Drivers
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-vn-secondary">
              {reasons.map((reason, index) => (
                <li key={index} className="flex gap-2 leading-relaxed">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-vn-navy" aria-hidden="true" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-vn-muted">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {meta?.timestamp ?? "Timestamp"}
              {meta?.claimedIdentity && meta.claimedIdentity !== "Not specified"
                ? ` · Claimed: ${meta.claimedIdentity}`
                : ""}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onAnalyzeAnother}
                className="inline-flex items-center gap-1.5 rounded border border-vn-border bg-white px-3 py-1.5 font-mono text-xs font-bold text-vn-navy transition-colors hover:bg-vn-page"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                Reset Pipeline
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
