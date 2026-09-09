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
    <section aria-labelledby="scenario-heading" className="space-y-3 font-mono">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-vn-border pb-3">
        <div>
          <h3 id="scenario-heading" className="text-sm font-bold text-vn-navy">
            Telemetry Profiles (Offline / Demo Scenarios)
          </h3>
          <p className="mt-0.5 font-sans text-xs text-vn-secondary">
            Select a synthetic or bonafide call profile to test pipeline risk scoring offline.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded border border-vn-border bg-vn-page px-2.5 py-1 text-[10px] font-bold text-vn-navy">
          <FlaskConical className="h-3.5 w-3.5 text-vn-primary" aria-hidden="true" />
          4 Profiles Available
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
              className={`group relative flex h-full flex-col rounded-lg border p-4 text-left transition-all ${
                isActive
                  ? "border-vn-primary bg-vn-surface-blue shadow-sm"
                  : "border-vn-border bg-white hover:border-vn-secondary"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded border ${
                    isActive
                      ? "border-vn-primary bg-white text-vn-primary"
                      : "border-vn-border bg-vn-page text-vn-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="rounded border border-vn-border bg-white px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-vn-muted">
                  SCENARIO
                </span>
              </div>

              <h4 className="mt-2.5 font-sans text-xs font-bold text-vn-navy">{scenario.label}</h4>
              <p className="mt-1 font-sans text-[11px] leading-relaxed text-vn-muted">
                {scenario.description}
              </p>

              <div className="mt-2.5 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold ${tierMeta.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tierMeta.dotClass}`} aria-hidden="true" />
                  {tierMeta.label.toUpperCase()} RISK
                </span>
              </div>

              <div className="mt-3 flex flex-1 items-end pt-2">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  disabled={disabled}
                  onClick={() => onChange(scenario.type)}
                  className={`inline-flex w-full items-center justify-center rounded px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50 ${
                    isActive
                      ? "bg-vn-navy text-white shadow-sm"
                      : "border border-vn-border bg-white text-vn-navy hover:bg-vn-page"
                  }`}
                >
                  {isActive ? "Selected" : "Select Profile"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
