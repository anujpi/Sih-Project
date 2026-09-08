"use client";

import {
  Check,
  CircleDot,
  Loader2,
  Minus,
  AudioLines,
  Fingerprint,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { PipelineStage, PipelineStageStatus } from "@/lib/types";

const STAGE_ICONS = {
  authenticity: AudioLines,
  identity: Fingerprint,
  intent: MessageSquareText,
  risk: ShieldCheck,
} as const;

interface AnalysisPipelineProps {
  stages: PipelineStage[];
}

function statusMeta(status: PipelineStageStatus) {
  switch (status) {
    case "processing":
      return {
        label: "Processing",
        icon: Loader2,
        bar: "bg-vn-cyan",
        barClass: "animate-pulse",
        stepClass: "border-vn-cyan/60 text-vn-cyan bg-vn-cyan/10",
        text: "text-vn-cyan",
      };
    case "completed":
      return {
        label: "Completed",
        icon: Check,
        bar: "bg-vn-green",
        barClass: "",
        stepClass: "border-vn-green/60 text-vn-green bg-vn-green/10",
        text: "text-vn-green",
      };
    case "skipped":
      return {
        label: "Skipped",
        icon: Minus,
        bar: "bg-vn-muted/50",
        barClass: "",
        stepClass: "border-vn-muted/50 text-vn-muted bg-white/5",
        text: "text-vn-muted",
      };
    case "error":
      return {
        label: "Error",
        icon: Minus,
        bar: "bg-vn-red",
        barClass: "",
        stepClass: "border-vn-red/60 text-vn-red bg-vn-red/10",
        text: "text-vn-red",
      };
    default:
      return {
        label: "Waiting",
        icon: CircleDot,
        bar: "bg-white/10",
        barClass: "",
        stepClass: "border-vn-border text-vn-muted bg-white/5",
        text: "text-vn-muted",
      };
  }
}

export default function AnalysisPipeline({ stages }: AnalysisPipelineProps) {
  return (
    <section
      aria-labelledby="pipeline-heading"
      aria-live="polite"
      className="glass-panel rounded-2xl p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 id="pipeline-heading" className="text-base font-semibold text-vn-text">
            Analysis pipeline
          </h3>
          <p className="mt-0.5 text-sm text-vn-muted">
            Four intelligence layers run in sequence.
          </p>
        </div>
        <div
          role="status"
          aria-live="polite"
          className="hidden items-center gap-2 rounded-full border border-vn-cyan/30 bg-vn-cyan/10 px-3 py-1 text-xs font-medium text-vn-cyan sm:inline-flex"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          Active
        </div>
      </div>

      <ol className="mt-5 space-y-3">
        {stages.map((stage, index) => {
          const meta = statusMeta(stage.status);
          const Icon =
            stage.status === "processing"
              ? meta.icon
              : stage.status === "completed" || stage.status === "skipped" || stage.status === "error"
                ? meta.icon
                : (STAGE_ICONS[stage.id as keyof typeof STAGE_ICONS] ?? CircleDot);
          return (
            <li
              key={stage.id}
              aria-current={stage.status === "processing" ? "step" : undefined}
              className="flex flex-col gap-2.5 rounded-xl border border-vn-border bg-vn-navy/40 p-3.5 sm:flex-row sm:items-center sm:gap-4"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors ${meta.stepClass}`}
              >
                <Icon
                  className={`h-5 w-5 ${stage.status === "processing" ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-vn-text">
                    <span className="mr-2 font-mono text-xs text-vn-muted">0{index + 1}</span>
                    {stage.label}
                  </span>
                  <span className={`text-[11px] font-medium ${meta.text}`}>
                    · {meta.label}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-vn-muted">
                  {stage.statusText ?? (stage.status === "waiting" ? "Queued" : "…")}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stage.status === "completed"
                        ? "w-full"
                        : stage.status === "processing"
                          ? "w-2/3 vn-shimmer"
                          : "w-0"
                    } ${meta.bar}`}
                  />
                </div>
              </div>

              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  stage.status === "completed"
                    ? "bg-vn-green"
                    : stage.status === "processing"
                      ? "bg-vn-cyan animate-pulse"
                      : stage.status === "error"
                        ? "bg-vn-red"
                        : "bg-white/15"
                }`}
                aria-hidden="true"
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}