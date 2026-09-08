"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { TIER_META, tierFromRisk } from "@/lib/risk-utils";
import { RiskTier } from "@/lib/types";

interface RiskGaugeProps {
  /** Normalized 0..100 score. */
  score: number;
  /** Optional explicit tier; falls back to mapping the score. */
  tier?: RiskTier;
  size?: number;
  strokeWidth?: number;
  durationMs?: number;
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function subscribeReducedMotion(callback: () => void): () => void {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function RiskGauge({
  score,
  tier,
  size = 210,
  strokeWidth = 12,
  durationMs = 1300,
}: RiskGaugeProps) {
  const finalScore = useMemo(() => clampScore(score), [score]);
  const finalTier = tier ?? tierFromRisk(finalScore);
  const meta = TIER_META[finalTier];
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false
  );
  const [displayed, setDisplayed] = useState(0);
  const radiusRef = useRef(0);
  const [radius, setRadius] = useState(0);

  if (reducedMotion && displayed !== finalScore) {
    setDisplayed(finalScore);
  }

  useLayoutEffect(() => {
    radiusRef.current = (size - strokeWidth) / 2;
    setRadius(radiusRef.current);
  }, [size, strokeWidth]);

  useEffect(() => {
    if (reducedMotion) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(finalScore * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [finalScore, durationMs, reducedMotion]);

  const circumference = 2 * Math.PI * Math.max(0, radius);
  const fillAngle = Math.max(0, Math.min(1, displayed / 100));
  const dashOffset = circumference * (1 - fillAngle);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Risk gauge: ${Math.round(displayed)} out of 100, ${meta.label} risk`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg]"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(16,42,67,0.10)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={meta.hex}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: reducedMotion
              ? "none"
              : "stroke-dashoffset 80ms linear",
            filter: `drop-shadow(0 0 8px ${meta.hex}66)`,
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-5xl font-bold tabular-nums"
          style={{ color: meta.hex }}
        >
          {Math.round(displayed)}
        </span>
        <span className="mt-1 text-xs font-medium uppercase tracking-widest text-vn-muted">
          Risk score
        </span>
        <span
          className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${meta.badgeClass}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} aria-hidden="true" />
          {meta.label}
        </span>
      </div>
    </div>
  );
}
