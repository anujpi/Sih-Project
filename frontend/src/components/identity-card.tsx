"use client";

import { Fingerprint, UserCheck, UserX } from "lucide-react";
import EvidenceCard, { KeyValue, MeterBar } from "@/components/evidence-card";
import { AnalysisResponse } from "@/lib/types";
import { formatScore, normalizeScore } from "@/lib/risk-utils";

export default function IdentityCard({ result }: { result: AnalysisResponse }) {
  const identity = result.identity_verification;

  if (!identity) {
    return (
      <EvidenceCard
        id="identity-verification-card"
        title="Identity verification"
        accent="indigo"
        icon={<Fingerprint className="h-5 w-5" aria-hidden="true" />}
        statusLabel="Not performed"
        statusVariant="skipped"
        summary={
          <p className="text-sm leading-relaxed text-vn-muted">
            No reference audio was provided, so the caller could not be compared against a
            trusted voiceprint. Identity verification was skipped and the risk weights were
            adjusted accordingly.
          </p>
        }
        explanationTitle="Why was this skipped?"
        explanation="Layer 2 needs a trusted reference sample (a registered voiceprint) to compute a speaker embedding similarity. Without one, it returns no score instead of a misleading zero. Claim an identity and add a reference voice to enable this layer."
      />
    );
  }

  const sim = normalizeScore(identity.similarity_score);
  const match = identity.identity_match;
  const color = match ? "#34d399" : "#fb923c";
  const MatchIcon = match ? UserCheck : UserX;

  return (
    <EvidenceCard
      id="identity-verification-card"
      title="Identity verification"
      accent="indigo"
      icon={<Fingerprint className="h-5 w-5" aria-hidden="true" />}
      statusLabel={match ? "Identity match" : "Identity mismatch"}
      statusVariant={match ? "ok" : "processing"}
      summary={
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs text-vn-muted">
              <MatchIcon className="h-4 w-4" aria-hidden="true" />
              {match ? "Match confirmed" : "Mismatch"}
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
            label="Speaker similarity"
            value={formatScore(identity.similarity_score)}
            mono
          />
        </div>
      }
      explanationTitle="How was this layer scored?"
      explanation="Layer 2 embeds the caller's voice with an ECAPA-TDNN speaker model and compares it to the claimed registered identity. A cosine similarity below the match threshold is reported as a mismatch. A genuine human caller can still fail this check — that is exactly the impersonation signal this layer exists to catch."
    />
  );
}