"use client";

import { AudioLines, Bot, User } from "lucide-react";
import EvidenceCard, { KeyValue, MeterBar } from "@/components/evidence-card";
import { AnalysisResponse } from "@/lib/types";
import { formatScore, normalizeScore } from "@/lib/risk-utils";

export default function VoiceAuthenticityCard({ result }: { result: AnalysisResponse }) {
  const voice = result.voice_authenticity;
  const prob = normalizeScore(voice.synthetic_probability);
  const isSynthetic = voice.label === "synthetic" || prob >= 50;
  const color = isSynthetic ? "#D92D4F" : "#159A6B";
  const statusLabel = isSynthetic ? "Synthetic voice detected" : "Bonafide signal";
  const statusVariant = isSynthetic ? "processing" : "ok";
  const LabelIcon = isSynthetic ? Bot : User;

  return (
    <EvidenceCard
      id="voice-authenticity-card"
      title="Voice authenticity"
      accent="cyan"
      icon={<AudioLines className="h-5 w-5" aria-hidden="true" />}
      statusLabel={statusLabel}
      statusVariant={statusVariant}
      summary={
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs text-vn-muted">
              <LabelIcon className="h-4 w-4" aria-hidden="true" />
              {isSynthetic ? "Synthetic" : "Bonafide"}
            </span>
            <span
              className="font-mono text-2xl font-bold tabular-nums"
              style={{ color }}
            >
              {formatScore(voice.synthetic_probability)}
            </span>
          </div>
          <MeterBar value={prob} color={color} />
          <KeyValue
            label="Model status"
            value={voice.model_finetuned ? "Fine-tuned" : "Testing fallback"}
          />
        </div>
      }
      explanationTitle="How was this layer scored?"
      explanation="Layer 1 runs a wav2vec2 classifier over 16 kHz acoustic features. A synthetic probability at or above 50% is labeled synthetic. The model was fine-tuned on in-the-wild deepfake data; when the tuning checkpoint is missing it falls back to an untrained base model, which the system reports honestly as &ldquo;testing fallback&rdquo;."
    />
  );
}
