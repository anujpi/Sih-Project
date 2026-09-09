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
        stepClass: "border-vn-primary text-vn-primary bg-vn-surface-blue font-mono",
        text: "text-vn-primary font-bold",
      };
    case "completed":
      return {
        label: "Completed",
        icon: Check,
        stepClass: "border-vn-green text-vn-green bg-vn-green/10 font-mono",
        text: "text-vn-green font-bold",
      };
    case "skipped":
      return {
        label: "Skipped",
        icon: Minus,
        stepClass: "border-vn-border text-vn-muted bg-vn-page font-mono",
        text: "text-vn-muted",
      };
    case "error":
      return {
        label: "Error",
        icon: Minus,
        stepClass: "border-vn-red text-vn-red bg-vn-red/10 font-mono",
        text: "text-vn-red font-bold",
      };
    default:
      return {
        label: "Queued",
        icon: CircleDot,
        stepClass: "border-vn-border text-vn-muted bg-white font-mono",
        text: "text-vn-muted",
      };
  }
}

export default function AnalysisPipeline({ stages }: AnalysisPipelineProps) {
  const progress = Math.round(
    (stages.filter((s) => s.status === "completed" || s.status === "skipped").length /
      stages.length) *
      100
  );

  return (
    <section
      aria-labelledby="pipeline-heading"
      aria-live="polite"
      className="card-surface rounded-lg border border-vn-border bg-white p-4 font-mono shadow-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-vn-border pb-3">
        <div>
          <h3 id="pipeline-heading" className="text-xs font-bold uppercase tracking-wider text-vn-navy">
            Sequential Pipeline Execution
          </h3>
          <p className="mt-0.5 font-sans text-xs text-vn-secondary">
            4-stage evaluation sequence tracking signal feature extractions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-vn-navy">
            {progress}% Complete
          </span>
          <div
            role="status"
            aria-live="polite"
            className="hidden h-2 w-24 overflow-hidden rounded bg-vn-page border border-vn-border sm:block"
          >
            <div
              className="h-full bg-vn-navy transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <ol className="mt-4 hidden lg:flex lg:items-stretch lg:gap-0">
        {stages.map((stage, index) => {
          const meta = statusMeta(stage.status);
          const Icon =
            stage.status === "processing"
              ? Loader2
              : stage.status === "completed"
                ? Check
                : stage.status === "skipped" || stage.status === "error"
                  ? Minus
                  : (STAGE_ICONS[stage.id as keyof typeof STAGE_ICONS] ?? CircleDot);
          return (
            <li key={stage.id} className="relative flex flex-1 flex-col items-center px-1 text-center">
              {index < stages.length - 1 && (
                <span
                  className={`absolute left-1/2 top-4 h-0.5 w-full -translate-y-1/2 ${
                    stage.status === "completed" || stage.status === "skipped" || stage.status === "error"
                      ? "bg-vn-green"
                      : stage.status === "processing"
                        ? "bg-vn-primary"
                        : "bg-vn-border"
                  }`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded border ${meta.stepClass}`}
              >
                <Icon
                  className={`h-4 w-4 ${stage.status === "processing" ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
              </span>
              <span className="mt-1.5 block text-[10px] font-bold text-vn-muted">
                STAGE 0{index + 1}
              </span>
              <span className={`block text-xs ${meta.text}`}>
                {meta.label}
              </span>
              <span className="mt-0.5 block min-h-[28px] max-w-[150px] font-sans text-[11px] leading-tight text-vn-secondary">
                {stage.statusText ?? (stage.status === "waiting" ? "Queued" : "…")}
              </span>
            </li>
          );
        })}
      </ol>

      <ol className="mt-4 space-y-2 lg:hidden font-sans">
        {stages.map((stage, index) => {
          const meta = statusMeta(stage.status);
          const Icon =
            stage.status === "processing"
              ? Loader2
              : stage.status === "completed"
                ? Check
                : stage.status === "skipped" || stage.status === "error"
                  ? Minus
                  : (STAGE_ICONS[stage.id as keyof typeof STAGE_ICONS] ?? CircleDot);
          return (
            <li
              key={stage.id}
              aria-current={stage.status === "processing" ? "step" : undefined}
              className="flex items-center justify-between gap-3 rounded border border-vn-border bg-white p-3 font-mono text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border ${meta.stepClass}`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${stage.status === "processing" ? "animate-spin" : ""}`}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <span className="font-bold text-vn-navy">
                    0{index + 1}. {stage.label}
                  </span>
                  <p className="font-sans text-[11px] text-vn-muted">
                    {stage.statusText ?? (stage.status === "waiting" ? "Queued" : "…")}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] font-bold ${meta.text}`}>{meta.label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
