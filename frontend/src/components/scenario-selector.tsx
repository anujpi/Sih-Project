"use client";

import { AudioLines, ScanSearch, ShieldX, UserCheck } from "lucide-react";
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
      <header>
        <h3 id="scenario-heading" className="text-base font-semibold text-vn-text">
          Choose a scenario
        </h3>
        <p className="mt-1 text-sm text-vn-muted">
          Select a simulated call to pipe through all four intelligence layers.
        </p>
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
            <button
              key={scenario.type}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={disabled}
              onClick={() => onChange(scenario.type)}
              className={`group relative flex flex-col items-start gap-2.5 rounded-xl border p-4 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive
                  ? "border-vn-cyan/60 bg-vn-cyan/10 shadow-lg shadow-vn-cyan/10"
                  : "border-vn-border bg-vn-surface/50 hover:-translate-y-0.5 hover:border-vn-cyan/30 hover:bg-vn-surface/70 hover:shadow-lg hover:shadow-vn-cyan/5"
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                  isActive ? "bg-vn-cyan/20 text-vn-cyan" : "bg-white/5 text-vn-muted group-hover:text-vn-cyan"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-bold text-vn-text">{scenario.label}</span>
              <span className="text-xs leading-relaxed text-vn-muted">
                {scenario.description}
              </span>
              <span className="mt-auto flex w-full items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tierMeta.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tierMeta.dotClass}`} aria-hidden="true" />
                  {tierMeta.label} risk tier
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isActive ? "text-vn-cyan" : "text-vn-muted opacity-0 transition-opacity group-hover:opacity-100"
                  }`}
                >
                  Load scenario →
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}