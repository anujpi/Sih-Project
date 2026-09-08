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
  const color = risky ? "#D92D4F" : "#159A6B";
  const highlighted = highlightTranscript(intent.transcript);

  return (
    <EvidenceCard
      id="intent-analysis-card"
      title="Speech-to-text + intent"
      accent="indigo"
      icon={<MessageSquareText className="h-5 w-5" aria-hidden="true" />}
      statusLabel={
        triggered.length > 0
          ? `${triggered.length} risky intent${triggered.length > 1 ? "s" : ""} detected`
          : "No scam-intent patterns"
      }
      statusVariant={risky ? "processing" : "ok"}
      summary={
        <div className="space-y-4">
          <div className="rounded-xl border border-vn-border bg-white p-3.5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-vn-muted">
                Transcript
              </p>
              <button
                type="button"
                aria-expanded={transcriptOpen}
                onClick={() => setTranscriptOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-vn-cyan transition-colors hover:text-vn-primary"
              >
                {transcriptOpen ? "Collapse" : "Expand"}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${transcriptOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
            </div>
            <p
              className={`mt-2 text-sm leading-relaxed text-vn-secondary ${
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
                  className="inline-flex items-center gap-1.5 rounded-full border border-vn-red/40 bg-vn-red/10 px-2.5 py-1 text-[11px] font-semibold text-vn-red"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-vn-red" aria-hidden="true" />
                  {INTENT_LABELS[flag] ?? flag}
                </span>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-vn-green/30 bg-vn-green/10 px-3 py-2 text-xs font-medium text-vn-green">
              No OTP, financial, urgency, authority, or secrecy patterns found.
            </p>
          )}

          <div className="space-y-1.5">
            <KeyValue
              label="Intent risk score"
              value={formatScore(intent.intent_risk_score)}
              mono
            />
            <MeterBar value={intentScore} color={color} />
          </div>
        </div>
      }
      explanationTitle="How was this layer scored?"
      explanation="Layer 3 transcribes the conversation with faster-whisper, then scans the text against scam-intent patterns: OTP requests, financial requests, urgency pressure, authority claims, and secrecy demands. Each triggered pattern raises the intent risk by a fixed increment, capped at 100%. Risky terms in the transcript are highlighted for review."
    />
  );
}
