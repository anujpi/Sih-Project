"use client";

import { MessageSquareText, Mic } from "lucide-react";
import { useMemo } from "react";
import { highlightRiskTerms, RISK_TERM_STYLE, RiskTermKind } from "@/lib/risk-utils";

interface StreamingTranscriptProps {
  text: string;
  isUpdating?: boolean;
  speakerLabel?: string;
}

const KIND_LABEL: Record<RiskTermKind, string> = {
  money: "Financial Request",
  urgency: "Urgency Pressure",
  secrecy: "Secrecy Demand",
  otp: "OTP / Passcode Request",
  authority: "Authority Claim",
};

const KIND_BG: Record<RiskTermKind, string> = {
  money: "bg-vn-amber/10 text-vn-amber border-vn-amber/40",
  urgency: "bg-vn-orange/10 text-vn-orange border-vn-orange/40",
  secrecy: "bg-vn-indigo/10 text-vn-indigo border-vn-indigo/40",
  otp: "bg-vn-red/10 text-vn-red border-vn-red/40",
  authority: "bg-vn-blue/10 text-vn-blue border-vn-blue/40",
};

export default function StreamingTranscript({
  text,
  isUpdating = false,
  speakerLabel = "Caller",
}: StreamingTranscriptProps) {
  const marks = useMemo(() => highlightRiskTerms(text), [text]);
  const uniqueKinds = useMemo(() => {
    const kinds = new Set<RiskTermKind>();
    marks.forEach((m) => m.kind && kinds.add(m.kind));
    return Array.from(kinds);
  }, [marks]);

  return (
    <div className="card-surface rounded-lg border border-vn-border bg-white p-4 font-mono shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-vn-border pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded border border-vn-border bg-vn-page text-vn-navy">
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-vn-navy">ASR Conversation Transcript</h3>
            <p className="font-sans text-[11px] text-vn-muted">{speakerLabel}</p>
          </div>
        </div>
        {isUpdating && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-vn-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vn-primary" />
            STREAMING ASR
          </span>
        )}
      </div>

      {uniqueKinds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {uniqueKinds.map((kind) => (
            <span
              key={kind}
              className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold ${KIND_BG[kind]}`}
            >
              <Mic className="h-3 w-3" aria-hidden="true" />
              {KIND_LABEL[kind]}
            </span>
          ))}
        </div>
      )}

      <div className={`mt-3 rounded border bg-vn-page p-3 font-mono text-xs leading-relaxed text-vn-navy ${isUpdating ? "border-vn-primary" : "border-vn-border"}`}>
        {text.length === 0 ? (
          <span className="font-sans text-xs text-vn-muted">Awaiting ASR speech-to-text input…</span>
        ) : (
          marks.map((mark, i) => {
            if (mark.kind) {
              return (
                <mark
                  key={i}
                  className="rounded px-1 font-bold"
                  style={{ backgroundColor: RISK_TERM_STYLE[mark.kind].bg, color: RISK_TERM_STYLE[mark.kind].color }}
                >
                  {mark.text}
                </mark>
              );
            }
            return <span key={i}>{mark.text}</span>;
          })
        )}
      </div>
    </div>
  );
}
