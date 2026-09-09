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
  voice: "text-vn-blue",
  identity: "text-vn-indigo",
  intent: "text-vn-cyan",
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
    <div className="card-surface p-5">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-vn-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold text-vn-navy">Analysis timeline</h3>
        {isProcessing && <span className="ml-auto flex items-center gap-1.5 text-[11px] text-vn-muted"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vn-primary" />live</span>}
      </div>
      <ol className="mt-4 space-y-3">
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
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-vn-primary border-t-transparent" aria-hidden="true" />
            ) : (
              <Info className="h-3.5 w-3.5 text-vn-muted" aria-hidden="true" />
            );
          return (
            <li key={event.id} className="flex items-start gap-3">
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-vn-surface-blue ${layerColor}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-vn-navy">{event.message}</p>
                <p className="mt-0.5 font-mono text-[10px] text-vn-muted">{event.time}</p>
              </div>
              <span className="shrink-0 pt-0.5">{typeIcon}</span>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className="text-sm text-vn-muted">Waiting for signals…</li>
        )}
        {isProcessing && events.length > 0 && (
          <li className="flex items-center gap-2 text-[11px] text-vn-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-vn-primary" />
            gathering more signals…
          </li>
        )}
      </ol>
    </div>
  );
}
