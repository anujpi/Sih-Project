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
  money: "Financial",
  urgency: "Urgency",
  secrecy: "Secrecy",
  otp: "OTP / credentials",
  authority: "Authority claim",
};

const KIND_BG: Record<RiskTermKind, string> = {
  money: "bg-vn-amber/10 text-vn-amber border-vn-amber/30",
  urgency: "bg-vn-orange/10 text-vn-orange border-vn-orange/30",
  secrecy: "bg-vn-indigo/10 text-vn-indigo border-vn-indigo/30",
  otp: "bg-vn-red/10 text-vn-red border-vn-red/30",
  authority: "bg-vn-blue/10 text-vn-blue border-vn-blue/30",
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
    <div className="card-surface p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-vn-primary/10 text-vn-primary">
            <MessageSquareText className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-vn-navy">Conversation transcript</h3>
            <p className="text-[11px] text-vn-muted">{speakerLabel}</p>
          </div>
        </div>
        {isUpdating && (
          <span className="inline-flex items-center gap-1 text-[11px] text-vn-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vn-primary" />
            streaming
          </span>
        )}
      </div>

      {uniqueKinds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {uniqueKinds.map((kind) => (
            <span
              key={kind}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${KIND_BG[kind]}`}
            >
              <Mic className="h-3 w-3" aria-hidden="true" />
              {KIND_LABEL[kind]}
            </span>
          ))}
        </div>
      )}

      <div className={`mt-3 rounded-xl border bg-white p-3.5 font-mono text-[13px] leading-7 text-vn-navy ${isUpdating ? "border-vn-primary/30" : "border-vn-border"}`}>
        {text.length === 0 ? (
          <span className="text-vn-muted">No transcript yet — the caller&apos;s words appear here in real time.</span>
        ) : (
          marks.map((mark, i) => {
            if (mark.kind) {
              return (
                <mark
                  key={i}
                  className={`rounded px-0.5 ${RISK_TERM_STYLE[mark.kind].class}`}
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
