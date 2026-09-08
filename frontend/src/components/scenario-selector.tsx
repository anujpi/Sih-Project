"use client";

import {
  AudioLines,
  FlaskConical,
  ScanSearch,
  ShieldX,
  UserCheck,
} from "lucide-react";
import { SCENARIOS } from "@/lib/demo-scenarios";
import { ScenarioType } from "@/lib/types";
import { TIER_META } from "@/lib/risk-utils";

const SCENARIO_ICONS: Record<ScenarioType, typeof AudioLines> = {
  genuine: AudioLines,
  ai_cloned: ScanSearch,
  ai_cloned_scam: ShieldX,
  known_person_mismatch: UserCheck,
};

interface ScenarioSelectorProps {
  value: ScenarioType;
  onChange: (scenario: ScenarioType) => void;
  disabled?: boolean;
}

export default function ScenarioSelector({
  value,
  onChange,
  disabled = false,
}: ScenarioSelectorProps) {
  return (
    <section aria-labelledby="scenario-heading" className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id="scenario-heading" className="text-base font-semibold text-vn-navy">
            Choose a scenario
          </h3>
          <p className="mt-1 text-sm text-vn-muted">
            Select a simulated call to pipe through all four intelligence layers.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-vn-primary/25 bg-vn-primary/8 px-3 py-1 text-[11px] font-medium text-vn-primary">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          Demo scenarios
        </span>
      </header>

      <div
        role="radiogroup"
        aria-label="Demo scenario"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {SCENARIOS.map((scenario) => {
          const Icon = SCENARIO_ICONS[scenario.type];
          const isActive = value === scenario.type;
          const tierMeta = TIER_META[scenario.expectedTier];
          return (
            <div
              key={scenario.type}
              className={`group relative flex h-full flex-col rounded-[var(--radius-card)] border p-5 text-left transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-vn-cyan ${
                isActive
                  ? "border-vn-cyan/60 bg-vn-cyan/10 shadow-lg shadow-vn-cyan/10"
                  : "border-vn-border bg-white hover:-translate-y-0.5 hover:border-vn-cyan/40 hover:shadow-lg hover:shadow-vn-cyan/5"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                    isActive
                      ? "bg-vn-cyan/20 text-vn-cyan"
                      : "bg-vn-page text-vn-muted group-hover:text-vn-cyan"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="rounded border border-vn-border bg-vn-page px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-vn-muted">
                  DEMO
                </span>
              </div>

              <h4 className="mt-3 text-sm font-bold text-vn-navy">{scenario.label}</h4>
              <p className="mt-1 text-xs leading-relaxed text-vn-muted">
                {scenario.description}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tierMeta.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tierMeta.dotClass}`} aria-hidden="true" />
                  {tierMeta.label} risk
                </span>
              </div>

              <div className="mt-4 flex flex-1 items-end">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  disabled={disabled}
                  onClick={() => onChange(scenario.type)}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan disabled:cursor-not-allowed disabled:opacity-50 ${
                    isActive
                      ? "bg-gradient-to-r from-vn-cyan to-vn-indigo text-white shadow-lg shadow-vn-cyan/20"
                      : "border border-vn-border bg-white text-vn-navy hover:border-vn-cyan/40 hover:text-vn-cyan"
                  }`}
                >
                  {isActive ? "Scenario selected" : "Load Scenario"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
