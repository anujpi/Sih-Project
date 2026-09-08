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
      title="Unified risk engine"
      accent="amber"
      icon={<Scale className="h-5 w-5" aria-hidden="true" />}
      statusLabel={`Overall: ${risk.tier} risk`}
      statusVariant="processing"
      summary={
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-vn-muted">
                Focused score
              </p>
              <p
                className="font-mono text-4xl font-bold tabular-nums"
                style={{ color: tierMeta.hex }}
              >
                {Math.round(overall)}
                <span className="text-base font-medium text-vn-muted">/100</span>
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${tierMeta.badgeClass}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${tierMeta.dotClass}`} aria-hidden="true" />
              {risk.tier}
            </span>
          </div>

          {/* Contribution chart */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-vn-muted">
              Contribution
            </p>
            {[
              { label: "Voice authenticity risk", value: voiceRisk, color: "#38d6ff" },
              { label: "Identity mismatch risk", value: identityRisk, color: "#6c63ff" },
              { label: "Intent risk", value: intentRisk, color: "#a78bfa" },
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <KeyValue
                  label={row.label}
                  value={row.value > 0 ? `${Math.round(row.value)}%` : "n/a"}
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

          <p className="rounded-lg border border-vn-border bg-vn-navy/50 px-3 py-2.5 text-xs leading-relaxed text-vn-muted">
            {risk.response}
          </p>
        </div>
      }
      explanationTitle="How was this score calculated?"
      explanation={`The engine combines three signals: voice authenticity (35% weight), identity mismatch (25%), and intent risk (40%), then caps the weighted sum at 100% and maps it to a tier — Low, Medium, High, or Critical. When identity verification is skipped, its weight is redistributed across the layers that actually ran. The result is a probabilistic risk indicator, not a guarantee: overall ${formatScore(
        risk.overall_risk
      )} falls in the ${risk.tier} tier. These weights are a prototype starting point, not a validated production model.`}
    />
  );
}