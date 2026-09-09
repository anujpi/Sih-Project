"use client";

import { ArrowRight, Clock3, RefreshCw, ShieldAlert } from "lucide-react";
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
      `Voice authenticity layer flagged the audio as likely synthetic (${Math.round(voice)}%).`
    );
  } else {
    reasons.push("Voice authenticity layer found no strong synthetic-voice indicator.");
  }

  const identity = result.identity_verification;
  if (identity) {
    const sim = normalizeScore(identity.similarity_score);
    reasons.push(
      identity.identity_match
        ? `Identity check passed — the caller matches the claimed speaker (${Math.round(sim)}% similarity).`
        : `Identity check failed — the caller does not match the claimed speaker (${Math.round(sim)}% similarity).`
    );
  } else {
    reasons.push("Identity verification was not performed — no reference voice was provided.");
  }

  const triggered = result.intent_analysis.triggered_intents;
  if (triggered.length > 0) {
    reasons.push(
      `Transcript analysis detected ${triggered.length} risky intent pattern${
        triggered.length > 1 ? "s" : ""
      } (${triggered.join(", ")}).`
    );
  } else {
    reasons.push("Transcript analysis found no scam-intent patterns.");
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
      className="card-surface overflow-hidden"
    >
      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
        <div
          className="flex flex-col items-center justify-center gap-2 border-b border-vn-border p-6 lg:border-b-0 lg:border-r"
          style={{
            background: `radial-gradient(120% 90% at 50% 0%, ${tierMeta.hex}14 0%, transparent 60%)`,
          }}
        >
          <RiskGauge score={score} tier={tier} />
          <p className="text-xs text-vn-muted">
            Explanation: {meta?.scenarioLabel ?? "Analyzed interaction"}
          </p>
        </div>

        <div className="flex flex-col p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              id="risk-result-heading"
              className="text-xl font-bold tracking-tight text-vn-navy"
            >
              {meta?.scenarioLabel ?? "Risk assessment"}
            </h3>
            <TierBadge tier={tier} />
            {meta?.isDemo && (
              <span className="rounded-full border border-vn-primary/25 bg-vn-primary/8 px-2 py-0.5 text-[11px] font-medium text-vn-primary">
                Demo Scenario
              </span>
            )}
          </div>

          <p className="mt-3 text-base leading-relaxed text-vn-secondary">
            {result.risk.response}
          </p>

          {tier === "critical" && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-vn-red/40 bg-vn-red/10 p-4"
            >
              <p className="inline-flex items-center gap-2 text-sm font-bold text-vn-red">
                <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                Do not share OTPs, passwords, money, or confidential information until the
                caller is independently verified.
              </p>
            </div>
          )}

          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-vn-muted">
              Main reasons
            </p>
            <ul className="space-y-1.5">
              {reasons.map((reason, index) => (
                <li key={index} className="flex gap-2 text-sm leading-relaxed text-vn-muted">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: tierMeta.hex }}
                    aria-hidden="true"
                  />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
            <span className="inline-flex items-center gap-1.5 text-xs text-vn-muted">
              <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
              {meta?.timestamp ?? "Analysis"}
              {meta?.claimedIdentity && meta.claimedIdentity !== "Not specified"
                ? ` · claimed as ${meta.claimedIdentity}`
                : ""}
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onAnalyzeAnother}
                className="inline-flex items-center gap-2 rounded-lg border border-vn-border bg-white px-4 py-2 text-sm font-semibold text-vn-navy transition-colors hover:border-vn-cyan/40 hover:text-vn-cyan"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Analyze another interaction
              </button>
              {tierMeta.rank >= 2 && (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-vn-amber/40 bg-vn-amber/10 px-3 py-2 text-xs font-semibold text-vn-amber">
                  <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                  Verification advised
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-vn-border px-6 py-3 text-xs text-vn-muted">
        <span className="inline-flex items-center gap-1.5">
          <ArrowRight className="h-3.5 w-3.5 text-vn-cyan" aria-hidden="true" />
          Treat this score as a probabilistic risk indicator — not ground truth.
          Review the evidence cards below before acting.
        </span>
      </div>
    </section>
  );
}
