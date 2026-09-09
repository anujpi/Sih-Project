"use client";

import { useState } from "react";
import { ChevronDown, MessageSquareText } from "lucide-react";
import EvidenceCard, { MeterBar, KeyValue } from "@/components/evidence-card";
import { AnalysisResponse } from "@/lib/types";
import {
  formatScore,
  highlightTranscript,
  INTENT_LABELS,
  normalizeScore,
} from "@/lib/risk-utils";

export default function IntentCard({ result }: { result: AnalysisResponse }) {
  const intent = result.intent_analysis;
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const triggered = intent.triggered_intents ?? [];
  const intentScore = normalizeScore(intent.intent_risk_score);
  const risky = intentScore >= 50;
  const color = risky ? "#DC2626" : "#059669";
  const highlighted = highlightTranscript(intent.transcript);

  return (
    <EvidenceCard
      id="intent-analysis-card"
      title="ASR Transcript & Intent Engine"
      accent="indigo"
      icon={<MessageSquareText className="h-5 w-5 text-vn-blue" aria-hidden="true" />}
      statusLabel={
        triggered.length > 0
          ? `${triggered.length} Risk Flag${triggered.length > 1 ? "s" : ""} Triggered`
          : "Zero Risk Indicators"
      }
      statusVariant={risky ? "processing" : "ok"}
      summary={
        <div className="space-y-3 font-mono">
          <div className="rounded border border-vn-border bg-vn-page p-3">
            <div className="flex items-center justify-between gap-2 border-b border-vn-border pb-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                faster-whisper Transcript Output
              </p>
              <button
                type="button"
                aria-expanded={transcriptOpen}
                onClick={() => setTranscriptOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-vn-primary hover:underline"
              >
                {transcriptOpen ? "Collapse" : "Expand"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${transcriptOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </div>
            <p
              className={`mt-2 text-xs leading-relaxed text-vn-navy font-sans ${
                transcriptOpen ? "" : "line-clamp-3"
              }`}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>

          {triggered.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {triggered.map((flag) => (
                <span
                  key={flag}
                  className="inline-flex items-center gap-1.5 rounded border border-vn-red bg-vn-red/10 px-2 py-0.5 text-[11px] font-bold text-vn-red"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-vn-red" aria-hidden="true" />
                  {INTENT_LABELS[flag] ?? flag}
                </span>
              ))}
            </div>
          ) : (
            <p className="rounded border border-vn-green bg-vn-green/10 px-2.5 py-1 text-xs text-vn-green">
              Clean — No OTP, financial transfer, urgency, authority, or secrecy tokens matched.
            </p>
          )}

          <div className="space-y-1">
            <KeyValue
              label="Calculated Intent Risk Score"
              value={formatScore(intent.intent_risk_score)}
              mono
            />
            <MeterBar value={intentScore} color={color} />
          </div>
        </div>
      }
      explanationTitle="ASR & Intent Classification Architecture"
      explanation="Layer 3 converts audio to text via faster-whisper and scans transcript tokens against regular expression pattern dictionaries (OTP requests, financial transfers, urgency pressure, authority claims, secrecy demands). Each matched pattern increments the intent score (0.0 to 1.0)."
    />
  );
}
