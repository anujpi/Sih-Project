"use client";

import { Eye, Shield, ShieldCheck, ShieldAlert, Activity } from "lucide-react";
import { TIER_META } from "@/lib/risk-utils";
import { RiskTier } from "@/lib/types";

const PULSE_ICONS = {
  eye: Eye,
  shield: Shield,
  check: ShieldCheck,
  alert: ShieldAlert,
  activity: Activity,
};

export type StatusBadgeVariant =
  | "ok"
  | "processing"
  | "demo"
  | "api"
  | "skipped"
  | "error";

interface StatusBadgeProps {
  variant?: StatusBadgeVariant;
  pulse?: boolean;
  label: string;
}

const VARIANT_CLASSES: Record<
  StatusBadgeVariant,
  { wrap: string; dot: string; label: string }
> = {
  ok: {
    wrap: "border-vn-green/30 bg-vn-green/10",
    dot: "bg-vn-green",
    label: "text-vn-green",
  },
  processing: {
    wrap: "border-vn-cyan/30 bg-vn-cyan/10",
    dot: "bg-vn-cyan",
    label: "text-vn-cyan",
  },
  demo: {
    wrap: "border-vn-violet/30 bg-vn-violet/10",
    dot: "bg-vn-violet",
    label: "text-vn-violet",
  },
  api: {
    wrap: "border-vn-indigo/30 bg-vn-indigo/10",
    dot: "bg-vn-indigo",
    label: "text-vn-indigo",
  },
  skipped: {
    wrap: "border-vn-muted/30 bg-white/5",
    dot: "bg-vn-muted",
    label: "text-vn-muted",
  },
  error: {
    wrap: "border-vn-red/30 bg-vn-red/10",
    dot: "bg-vn-red",
    label: "text-vn-red",
  },
};

export function StatusBadge({
  variant = "ok",
  pulse = false,
  label,
}: StatusBadgeProps) {
  const styles = VARIANT_CLASSES[variant];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${styles.wrap}`}
    >
      <span
        className={`relative flex h-2 w-2 ${pulse ? "animate-pulse" : ""}`}
      >
        <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
        {pulse && (
          <span
            className={`absolute inset-0 h-2 w-2 rounded-full ${styles.dot} animate-ping opacity-50`}
            aria-hidden="true"
          />
        )}
      </span>
      <span className={styles.label}>{label}</span>
    </span>
  );
}

export function TierBadge({ tier }: { tier: RiskTier }) {
  const meta = TIER_META[tier];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}

interface TickerProps {
  variant?: "live" | "paused" | "demo";
  label?: string;
  icon?: keyof typeof PULSE_ICONS;
}

export function LiveStatusTicker({
  variant = "live",
  label,
  icon = "activity",
}: TickerProps) {
  const Icon = PULSE_ICONS[icon];
  const palette =
    variant === "live"
      ? { wrap: "border-vn-green/30 bg-vn-green/10", text: "text-vn-green" }
      : variant === "paused"
        ? { wrap: "border-vn-amber/30 bg-vn-amber/10", text: "text-vn-amber" }
        : { wrap: "border-vn-violet/30 bg-vn-violet/10", text: "text-vn-violet" };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium ${palette.wrap} ${palette.text}`}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`h-2 w-2 rounded-full ${palette.text} ${
            variant === "live" ? "animate-pulse" : ""
          }`}
          style={{ background: "currentColor" }}
        />
        {variant === "live" && (
          <span
            className={`absolute inset-0 h-2 w-2 animate-ping rounded-full opacity-40`}
            style={{ background: "currentColor" }}
            aria-hidden="true"
          />
        )}
      </span>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label ?? (variant === "live" ? "Protection active" : "Demo mode")}</span>
    </div>
  );
}