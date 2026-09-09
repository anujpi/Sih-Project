"use client";

import { AudioLines, Bot, User } from "lucide-react";
import EvidenceCard, { KeyValue, MeterBar } from "@/components/evidence-card";
import { AnalysisResponse } from "@/lib/types";
import { formatScore, normalizeScore } from "@/lib/risk-utils";

export default function VoiceAuthenticityCard({ result }: { result: AnalysisResponse }) {
  const voice = result.voice_authenticity;
  const prob = normalizeScore(voice.synthetic_probability);
  const isSynthetic = voice.label === "synthetic" || prob >= 50;
  const color = isSynthetic ? "#DC2626" : "#059669";
  const statusLabel = isSynthetic ? "Synthetic Voice Detected" : "Bonafide Signal";
  const statusVariant = isSynthetic ? "processing" : "ok";
  const LabelIcon = isSynthetic ? Bot : User;

  return (
    <EvidenceCard
      id="voice-authenticity-card"
      title="Acoustic Voice Authenticity"
      accent="cyan"
      icon={<AudioLines className="h-5 w-5 text-vn-cyan" aria-hidden="true" />}
      statusLabel={statusLabel}
      statusVariant={statusVariant}
      summary={
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-vn-secondary">
              <LabelIcon className="h-4 w-4" style={{ color }} aria-hidden="true" />
              {isSynthetic ? "Synthetic VOC Artifacts" : "Bonafide Human Signal"}
            </span>
            <span
              className="text-2xl font-bold tabular-nums"
              style={{ color }}
            >
              {formatScore(voice.synthetic_probability)}
            </span>
          </div>
          <MeterBar value={prob} color={color} />
          <KeyValue
            label="wav2vec2-base Status"
            value={voice.model_finetuned ? "Fine-Tuned Checkpoint" : "Base Untrained Fallback"}
            mono
          />
        </div>
      }
      explanationTitle="Acoustic Feature Extraction Method"
      explanation="Layer 1 resamples audio to 16 kHz mono and evaluates acoustic frame representations through wav2vec2 transformer layers. A calculated synthetic probability threshold ≥ 50% triggers a synthetic voice anomaly classification."
    />
  );
}
