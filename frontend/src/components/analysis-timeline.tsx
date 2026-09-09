"use client";

import {
  AudioLines,
  Fingerprint,
  MessageSquareText,
  Gauge,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { TimelineEvent } from "@/lib/types";

const LAYER_ICON = {
  voice: AudioLines,
  identity: Fingerprint,
  intent: MessageSquareText,
  risk: Gauge,
} as const;

const LAYER_COLOR: Record<string, string> = {
  voice: "text-vn-cyan",
  identity: "text-vn-indigo",
  intent: "text-vn-blue",
  risk: "text-vn-amber",
};

export default function AnalysisTimeline({
  events,
  isProcessing,
  visibleCount,
}: {
  events: TimelineEvent[];
  isProcessing: boolean;
  visibleCount?: number;
}) {
  const shown = visibleCount && visibleCount > 0 ? events.slice(0, visibleCount) : events;

  return (
    <div className="card-surface rounded-lg border border-vn-border bg-white p-4 font-mono shadow-sm">
      <div className="flex items-center justify-between border-b border-vn-border pb-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-vn-primary" aria-hidden="true" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-vn-navy">Telemetry Log Stream</h3>
        </div>
        {isProcessing && (
          <span className="flex items-center gap-1.5 text-[10px] text-vn-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vn-primary" />
            LIVE INGEST
          </span>
        )}
      </div>

      <ol className="mt-3 space-y-2.5">
        {shown.map((event) => {
          const icon = event.layer ? LAYER_ICON[event.layer] : Activity;
          const Icon = icon;
          const layerColor = event.layer ? LAYER_COLOR[event.layer] : "text-vn-primary";
          const typeIcon =
            event.type === "success" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-vn-green" aria-hidden="true" />
            ) : event.type === "warning" ? (
              <AlertTriangle className="h-3.5 w-3.5 text-vn-amber" aria-hidden="true" />
            ) : event.type === "progress" ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-vn-primary border-t-transparent" aria-hidden="true" />
            ) : (
              <Info className="h-3.5 w-3.5 text-vn-muted" aria-hidden="true" />
            );
          return (
            <li key={event.id} className="flex items-start gap-2.5 text-xs">
              <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-vn-border bg-vn-page ${layerColor}`}>
                <Icon className="h-3 w-3" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-xs leading-snug text-vn-navy">{event.message}</p>
                <p className="font-mono text-[10px] text-vn-muted">{event.time}</p>
              </div>
              <span className="shrink-0 pt-0.5">{typeIcon}</span>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className="font-sans text-xs text-vn-muted">Awaiting signal telemetry…</li>
        )}
        {isProcessing && events.length > 0 && (
          <li className="flex items-center gap-2 text-[10px] text-vn-muted pt-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vn-primary" />
            processing audio frames…
          </li>
        )}
      </ol>
    </div>
  );
}
