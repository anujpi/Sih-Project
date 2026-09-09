"use client";

import {
  Activity,
  ArrowRight,
  BarChart3,
  Clock,
  Eye,
  FlaskConical,
  Gauge,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RecentAnalysis } from "@/lib/types";
import { normalizeScore, TIER_META } from "@/lib/risk-utils";

const RECORD_KEY = "vaanishield.recent";

function loadRecent(): RecentAnalysis[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECORD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as RecentAnalysis[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(analyses: RecentAnalysis[]) {
  try {
    window.localStorage.setItem(RECORD_KEY, JSON.stringify(analyses));
  } catch {
    // ignore
  }
}

export default function InsightsClient() {
  const [analyses, setAnalyses] = useState<RecentAnalysis[]>(() => loadRecent());
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClear() {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    saveRecent([]);
    setAnalyses([]);
    setConfirmClear(false);
  }

  const tierCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  let avgScore = 0;
  analyses.forEach((a) => {
    tierCounts[a.tier] = (tierCounts[a.tier] ?? 0) + 1;
    avgScore += normalizeScore(a.score);
  });
  if (analyses.length > 0) avgScore = avgScore / analyses.length;

  const demoCount = analyses.filter((a) => a.isDemo).length;

  return (
    <section className="vn-section">
      <div className="vn-container">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-vn-primary">
              System insights
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-vn-navy sm:text-4xl">
              Analysis history &amp; insights
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-vn-secondary">
              Review the interactions you&apos;ve screened in this browser. Every analysis is stored
              locally — no data leaves your machine.
            </p>
          </div>
          {analyses.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                confirmClear
                  ? "border-vn-red/40 bg-vn-red/5 text-vn-red"
                  : "border-vn-border bg-white text-vn-secondary hover:text-vn-navy"
              }`}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {confirmClear ? "Confirm clear" : "Clear history"}
            </button>
          )}
        </div>

        {analyses.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-vn-border bg-white px-6 py-16 text-center shadow-sm">
            <BarChart3 className="h-10 w-10 text-vn-muted" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-bold text-vn-navy">No analyses yet</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-vn-secondary">
              Run a scenario in the live console to build your analysis history and see system
              insights appear here.
            </p>
            <Link
              href="/demo"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-vn-navy px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep hover:shadow-md"
            >
              Open the Live Console
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Activity className="h-5 w-5" aria-hidden="true" />}
                label="Total analyses"
                value={String(analyses.length)}
                accent="text-vn-primary"
                bg="bg-vn-primary/8"
              />
              <StatCard
                icon={<Gauge className="h-5 w-5" aria-hidden="true" />}
                label="Avg risk score"
                value={`${Math.round(avgScore)}%`}
                accent="text-vn-amber"
                bg="bg-vn-amber/8"
              />
              <StatCard
                icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
                label="Critical flagged"
                value={String(tierCounts.critical)}
                accent="text-vn-red"
                bg="bg-vn-red/8"
              />
              <StatCard
                icon={<FlaskConical className="h-5 w-5" aria-hidden="true" />}
                label="Demo runs"
                value={String(demoCount)}
                accent="text-vn-indigo"
                bg="bg-vn-indigo/8"
              />
            </div>

            {/* Tier distribution */}
            <div className="mt-8 card-surface p-5 sm:p-6">
              <h2 className="text-sm font-bold text-vn-navy">Risk distribution</h2>
              <div className="mt-4 space-y-3">
                {(["low", "medium", "high", "critical"] as const).map((tier) => {
                  const meta = TIER_META[tier];
                  const count = tierCounts[tier] ?? 0;
                  const pct = analyses.length > 0 ? (count / analyses.length) * 100 : 0;
                  return (
                    <div key={tier} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-vn-navy">{meta.label}</span>
                        <span className="text-vn-muted">
                          {count} · {Math.round(pct)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-vn-border">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: meta.hex }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* History list */}
            <div className="mt-8 card-surface p-5 sm:p-6">
              <h2 className="text-sm font-bold text-vn-navy">Recent analyses</h2>
              <ul className="mt-4 space-y-2.5">
                {analyses.map((record) => {
                  const meta = TIER_META[record.tier];
                  return (
                    <li
                      key={record.id}
                      className="flex items-center gap-4 rounded-xl border border-vn-border bg-white p-3.5 transition-colors hover:border-vn-primary/30"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bgClass}`}
                      >
                        <span className="h-3 w-3 rounded-full" style={{ background: meta.hex }} aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-vn-navy">
                          {record.scenario}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-vn-muted">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" aria-hidden="true" />
                            {record.timestamp}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 font-semibold"
                            style={{ color: meta.hex }}
                          >
                            {record.tier}
                          </span>
                          <span className="font-mono">{Math.round(normalizeScore(record.score))}%</span>
                          <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                            record.isDemo
                              ? "border-vn-indigo/25 bg-vn-indigo/5 text-vn-indigo"
                              : "border-vn-blue/25 bg-vn-blue/5 text-vn-blue"
                          }`}>
                            {record.isDemo ? "Demo" : "API"}
                          </span>
                        </p>
                      </div>
                      <Link
                        href="/demo"
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-vn-border bg-vn-page px-3 py-1.5 text-xs font-semibold text-vn-primary transition-colors hover:border-vn-primary/40"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        Replay
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  bg: string;
}) {
  return (
    <div className="card-surface flex items-center gap-4 p-5">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg} ${accent}`}>
        {icon}
      </span>
      <div>
        <p className="text-xs font-medium text-vn-muted">{label}</p>
        <p className="font-mono text-2xl font-bold tabular-nums text-vn-navy">{value}</p>
      </div>
    </div>
  );
}
