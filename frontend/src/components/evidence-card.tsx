"use client";

import { ChevronDown, Info, ShieldCheck } from "lucide-react";
import { useState, ReactNode } from "react";
import { StatusBadge, StatusBadgeVariant } from "@/components/status-badge";

interface EvidenceCardProps {
  id: string;
  title: string;
  icon: ReactNode;
  accent: "cyan" | "indigo" | "violet" | "green" | "amber";
  statusLabel: string;
  statusVariant: StatusBadgeVariant;
  summary: ReactNode;
  explanationTitle?: string;
  explanation?: string;
  children?: ReactNode;
}

const ACCENT_STYLES = {
  cyan: {
    icon: "bg-vn-cyan/10 text-vn-cyan",
    topBorder: "from-vn-cyan",
  },
  indigo: {
    icon: "bg-vn-indigo/10 text-vn-indigo",
    topBorder: "from-vn-indigo",
  },
  violet: {
    icon: "bg-vn-indigo/10 text-vn-indigo",
    topBorder: "from-vn-indigo",
  },
  green: {
    icon: "bg-vn-green/10 text-vn-green",
    topBorder: "from-vn-green",
  },
  amber: {
    icon: "bg-vn-amber/10 text-vn-amber",
    topBorder: "from-vn-amber",
  },
};

export default function EvidenceCard({
  id,
  title,
  icon,
  accent,
  statusLabel,
  statusVariant,
  summary,
  explanationTitle,
  explanation,
  children,
}: EvidenceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const styles = ACCENT_STYLES[accent];

  return (
    <article
      id={id}
      className={`group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-vn-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        expanded ? "hover:translate-y-0" : ""
      }`}
    >
      <div
        className={`h-0.5 w-full bg-gradient-to-r ${styles.topBorder} to-transparent opacity-40`}
        aria-hidden="true"
      />
      <div className="flex flex-1 flex-col p-5">
        <header className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
            >
              {icon}
            </span>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-bold text-vn-navy">{title}</h4>
              <StatusBadge variant={statusVariant} label={statusLabel} />
            </div>
          </div>
          {explanation && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse evidence" : "Expand evidence"}
              onClick={() => setExpanded((v) => !v)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-vn-border bg-vn-page text-vn-muted transition-colors hover:border-vn-primary/40 hover:text-vn-primary"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          )}
        </header>

        <div className="mt-4">{summary}</div>

        {children && <div className="mt-4">{children}</div>}

        {explanation && (
          <div className="mt-auto pt-4">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-vn-primary transition-colors hover:text-vn-blue"
            >
              <Info className="h-3.5 w-3.5" aria-hidden="true" />
              {expanded ? "Hide explanation" : explanationTitle ?? "How was this scored?"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {expanded && (
              <div className="mt-2 rounded-xl border border-vn-border bg-vn-surface-blue p-3.5 vn-anim-rise">
                <p className="text-xs leading-relaxed text-vn-secondary">{explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
        <ShieldCheck className="absolute right-4 top-14 h-4 w-4 text-vn-primary/10" aria-hidden="true" />
      </div>
    </article>
  );
}

export function MeterBar({
  value,
  color,
  heightClass = "h-2",
}: {
  value: number;
  color: string;
  heightClass?: string;
}) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-vn-border ${heightClass}`}>
      <div
        className={`h-full rounded-full transition-all duration-700 ${heightClass}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: color }}
      />
    </div>
  );
}

export function KeyValue({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-vn-secondary">{label}</span>
      <span className={`text-right font-semibold text-vn-navy ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
