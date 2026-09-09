"use client";

import { AlertTriangle, Fingerprint, ShieldCheck, UserCheck, UserX } from "lucide-react";
import EvidenceCard, { KeyValue, MeterBar } from "@/components/evidence-card";
import { AnalysisResponse } from "@/lib/types";
import { formatScore, normalizeScore } from "@/lib/risk-utils";

export default function IdentityCard({ result }: { result: AnalysisResponse }) {
  const identity = result.identity_verification;
  const warning = identity?.warning || result.identity_warning;

  if (!identity) {
    return (
      <EvidenceCard
        id="identity-verification-card"
        title="Speaker Identity Verification"
        accent="indigo"
        icon={<Fingerprint className="h-5 w-5 text-vn-indigo" aria-hidden="true" />}
        statusLabel="Not performed"
        statusVariant="skipped"
        summary={
          <div className="space-y-2">
            <p className="text-xs leading-relaxed text-vn-muted">
              No reference audio or registered identity was provided for Layer 2 comparison. Identity verification was skipped and risk weights were redistributed.
            </p>
            {warning && (
              <div className="flex items-center gap-2 rounded-md border border-vn-amber/30 bg-vn-amber/10 px-2.5 py-1.5 text-xs text-vn-amber">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{warning}</span>
              </div>
            )}
          </div>
        }
        explanationTitle="Why was identity check skipped?"
        explanation="Layer 2 requires a speaker embedding reference — either a registered voiceprint vector from the Voiceprint Registry or an uploaded audio clip. Claim an identity or register a voiceprint to enable speaker verification."
      />
    );
  }

  const sim = normalizeScore(identity.similarity_score);
  const match = identity.identity_match;
  const color = match ? "#059669" : "#EA580C";
  const MatchIcon = match ? UserCheck : UserX;

  const sourceLabel =
    identity.source === "registry"
      ? `Voiceprint Registry (${identity.claimed_identity || "Stored Voiceprint"})`
      : identity.source === "reference_audio"
        ? "Uploaded Reference Audio"
        : "Reference Sample";

  return (
    <EvidenceCard
      id="identity-verification-card"
      title="Speaker Identity Verification"
      accent="indigo"
      icon={<Fingerprint className="h-5 w-5 text-vn-indigo" aria-hidden="true" />}
      statusLabel={match ? "Speaker Match" : "Speaker Mismatch"}
      statusVariant={match ? "ok" : "processing"}
      summary={
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-vn-secondary">
              <MatchIcon className="h-4 w-4" style={{ color }} aria-hidden="true" />
              {match ? "ECAPA-TDNN Match Confirmed" : "Embedding Mismatch"}
            </span>
            <span
              className="font-mono text-2xl font-bold tabular-nums"
              style={{ color }}
            >
              {formatScore(identity.similarity_score)}
            </span>
          </div>
          <MeterBar value={sim} color={color} />
          <KeyValue
            label="Verification Source"
            value={sourceLabel}
            mono
          />
          <KeyValue
            label="Cosine Similarity"
            value={formatScore(identity.similarity_score)}
            mono
          />
          {warning && (
            <div className="flex items-center gap-2 rounded-md border border-vn-amber/30 bg-vn-amber/10 px-2.5 py-1.5 text-xs text-vn-amber">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{warning}</span>
            </div>
          )}
        </div>
      }
      explanationTitle="Model Architecture & Verification Method"
      explanation="Layer 2 extracts a 192-dimensional speaker embedding using SpeechBrain ECAPA-TDNN (spkrec-ecapa-voxceleb). The embedding is compared via cosine similarity against the claimed identity stored in the Voiceprint Registry or the provided reference sample."
    />
  );
}
