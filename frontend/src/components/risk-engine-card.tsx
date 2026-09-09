"use client";

import { Scale } from "lucide-react";
import EvidenceCard, { KeyValue, MeterBar } from "@/components/evidence-card";
import { AnalysisResponse } from "@/lib/types";
import { formatScore, normalizeScore, TIER_META } from "@/lib/risk-utils";

export default function RiskEngineCard({ result }: { result: AnalysisResponse }) {
  const risk = result.risk;
  const overall = normalizeScore(risk.overall_risk);
  const tierMeta = TIER_META[risk.tier];
  const voiceRisk = normalizeScore(risk.breakdown.voice_authenticity_risk);
  const identityRisk = result.identity_verification
    ? normalizeScore(risk.breakdown.identity_mismatch_risk)
    : 0;
  const intentRisk = normalizeScore(risk.breakdown.intent_risk);

  const total =
    Math.max(0, voiceRisk) + Math.max(0, identityRisk) + Math.max(0, intentRisk);

  function pct(value: number): number {
    return total <= 0 ? 0 : (Math.max(0, value) / total) * 100;
  }

  return (
    <EvidenceCard
      id="unified-risk-card"
      title="Unified Risk Engine (Layer 4)"
      accent="amber"
      icon={<Scale className="h-5 w-5 text-vn-amber" aria-hidden="true" />}
      statusLabel={`Tier: ${risk.tier.toUpperCase()}`}
      statusVariant="processing"
      summary={
        <div className="space-y-4 font-mono">
          <div className="flex items-end justify-between gap-3 border-b border-vn-border pb-3">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                Calculated Interaction Risk Score
              </p>
              <p
                className="text-3xl font-bold tabular-nums"
                style={{ color: tierMeta.hex }}
              >
                {Math.round(overall)}
                <span className="text-xs font-normal text-vn-muted"> / 100</span>
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 text-xs font-bold ${tierMeta.badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${tierMeta.dotClass}`} aria-hidden="true" />
              {risk.tier.toUpperCase()} TIER
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-vn-muted">
              Weighted Component Risk Contributions
            </p>
            {[
              { label: "Layer 1 Voice Authenticity (35% Weight)", value: voiceRisk, color: "#0284C7" },
              { label: "Layer 2 Identity Mismatch (25% Weight)", value: identityRisk, color: "#4F46E5" },
              { label: "Layer 3 Scam Intent Risk (40% Weight)", value: intentRisk, color: "#2563EB" },
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <KeyValue
                  label={row.label}
                  value={row.value > 0 ? `${Math.round(row.value)}%` : "N/A (Skipped)"}
                  mono
                />
                <MeterBar
                  value={pct(row.value)}
                  color={row.color}
                  heightClass="h-1.5"
                />
              </div>
            ))}
          </div>

          <p className="rounded border border-vn-border bg-vn-page p-3 text-xs leading-relaxed text-vn-navy font-sans">
            {risk.response}
          </p>
        </div>
      }
      explanationTitle="Mathematical Risk Weighting Formula"
      explanation={`The Layer 4 risk engine evaluates the deterministic formula: Risk = 0.35 × Voice_Risk + 0.25 × Identity_Mismatch_Risk + 0.40 × Intent_Risk. Scores (0-100) map to 4 response tiers: Low (<30), Medium (30-54), High (55-79), and Critical (80-100). If Layer 2 is omitted, weights are normalized over active layers.`}
    />
  );
}
