"use client";

import {
  Check,
  CheckCircle2,
  CircleDashed,
  Loader2,
  Lock,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/toast-provider";
import { TIER_META } from "@/lib/risk-utils";
import {
  RiskTier,
  VerificationStatus,
  VerificationStep,
} from "@/lib/types";

interface VerificationPanelProps {
  tier: RiskTier;
  status: VerificationStatus;
  onStatusChange: (status: VerificationStatus) => void;
}

const VERIFICATION_STEPS: (VerificationStep & { tag: string })[] = [
  {
    id: "phrase",
    label: "Verification Phrase Protocol",
    tag: "Out-of-band phrase",
    description:
      "Call the individual back via a pre-registered phone number or request an out-of-band pass-phrase.",
  },
  {
    id: "contact",
    label: "Trusted Contact Hold",
    tag: "Independent Contact",
    description:
      "Confirm identity directly through an authorized organizational contact or secondary line.",
  },
  {
    id: "secondary",
    label: "Secondary Authentication App",
    tag: "Authenticator / Portal",
    description:
      "Request authentication push or token challenge through official enterprise portal.",
  },
  {
    id: "device",
    label: "Registered Device Check",
    tag: "SIM / Device Registry",
    description:
      "Verify incoming call originates from registered device IMEI / MSISDN on file.",
  },
];

type SimPhase = "idle" | "checking" | "confirmed";

export default function VerificationPanel({
  tier,
  status,
  onStatusChange,
}: VerificationPanelProps) {
  const { push } = useToast();
  const tierMeta = TIER_META[tier];
  const isCritical = tier === "critical";
  const isMedium = tier === "medium";
  const showPanel = tierMeta.rank >= 2;
  const [selected, setSelected] = useState<string | null>(null);
  const [simPhase, setSimPhase] = useState<SimPhase>("idle");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach((t) => clearTimeout(t));
  }, []);

  function selectMethod(id: string) {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    if (selected === id) {
      setSelected(null);
      setSimPhase("idle");
      return;
    }
    setSelected(id);
    setSimPhase("checking");
    const t1 = setTimeout(() => setSimPhase("confirmed"), 1200);
    timersRef.current.push(t1);
  }

  if (!showPanel && !isMedium) {
    return (
      <section
        aria-labelledby="verification-heading"
        className="rounded-lg border border-vn-green/40 bg-vn-green/10 p-4"
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-vn-green" aria-hidden="true" />
          <div>
            <h3 id="verification-heading" className="font-mono text-xs font-bold text-vn-navy">
              No Additional Verification Required
            </h3>
            <p className="mt-1 font-mono text-xs leading-relaxed text-vn-secondary">
              Interaction risk falls below operational threshold (Low tier &lt; 30). Monitoring stream active.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (isMedium) {
    return (
      <section
        aria-labelledby="verification-heading"
        className="rounded-lg border border-vn-amber/40 bg-vn-amber/10 p-4"
      >
        <div className="flex items-start gap-3">
          <PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-vn-amber" aria-hidden="true" />
          <div>
            <h3 id="verification-heading" className="font-mono text-xs font-bold text-vn-navy">
              Caution — Medium Risk Threshold Reached
            </h3>
            <p className="mt-1 font-mono text-xs leading-relaxed text-vn-secondary">
              Voice authenticity or intent score uncertain. Verify speaker identity before transmitting sensitive data.
            </p>
          </div>
        </div>
      </section>
    );
  }

  function finish(next: VerificationStatus) {
    if (next === "verified") {
      push(
        "success",
        "Interaction Verified",
        "Call marked as independently verified. Risk protocol resolved."
      );
    } else if (next === "blocked") {
      push(
        "warning",
        "Interaction Blocked",
        "Interaction marked as malicious. Call blocked and transaction held."
      );
    } else {
      push("info", "Warning Dismissed", "Verification alert dismissed.");
    }
    onStatusChange(next);
  }

  const allVerifiedHere = status === "verified";
  const allBlockedHere = status === "blocked";

  return (
    <section
      aria-labelledby="verification-heading"
      className="card-surface rounded-lg border border-vn-border bg-white p-5 font-mono shadow-sm"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 border-b border-vn-border pb-3">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded border border-vn-border bg-vn-page text-vn-navy"
          >
            {isCritical ? (
              <Lock className="h-4 w-4 text-vn-red" aria-hidden="true" />
            ) : (
              <PhoneCall className="h-4 w-4 text-vn-amber" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0">
            <h3
              id="verification-heading"
              className="text-sm font-bold text-vn-navy"
            >
              {allVerifiedHere
                ? "Out-of-Band Verified"
                : allBlockedHere
                  ? "Interaction Intercepted & Blocked"
                  : isCritical
                    ? "Critical Impersonation Risk Escalation"
                    : "Independent Verification Recommended"}
            </h3>
            <p className="mt-1 font-sans text-xs leading-relaxed text-vn-secondary">
              {allVerifiedHere
                ? "Speaker identity confirmed via out-of-band challenge response."
                : allBlockedHere
                  ? "Interaction blocked. No financial transfer or credentials authorized."
                  : isCritical
                    ? "MANDATORY WARN: High synthetic probability or scam intent detected. Execute verification protocol before taking action."
                    : "Credible impersonation risk detected. Perform out-of-band verification before sharing information."}
            </p>
          </div>
        </div>

        {!allVerifiedHere && !allBlockedHere && (
          <>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-vn-muted">
                Mitigation Protocol Step 1 — Select Challenge Channel
              </p>
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                {VERIFICATION_STEPS.map((step) => {
                  const isSelected = selected === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => selectMethod(step.id)}
                      className={`flex items-start gap-3 rounded border p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-primary ${
                        isSelected
                          ? "border-vn-primary bg-vn-surface-blue"
                          : "border-vn-border bg-white hover:border-vn-secondary"
                      }`}
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-vn-border bg-white text-vn-muted">
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 text-vn-primary" aria-hidden="true" />
                        ) : (
                          <CircleDashed className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-vn-navy">{step.label}</span>
                          <span className="rounded border border-vn-border bg-white px-1.5 py-0.5 text-[9px] text-vn-muted">
                            {step.tag}
                          </span>
                        </span>
                        <span className="mt-0.5 block font-sans text-xs leading-relaxed text-vn-secondary">
                          {step.description}
                        </span>

                        {isSelected && simPhase !== "idle" && (
                          <span
                            className="mt-2 flex items-center gap-1.5 rounded border border-vn-primary/30 bg-vn-surface-blue px-2 py-1 text-[10px] font-bold text-vn-primary"
                            aria-live="polite"
                          >
                            {simPhase === "checking" ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                Transmitting challenge packet…
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-vn-green" aria-hidden="true" />
                                Challenge response confirmed.
                              </>
                            )}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 border-t border-vn-border pt-3">
              <button
                type="button"
                onClick={() => finish("verified")}
                disabled={!selected}
                className="inline-flex items-center gap-1.5 rounded bg-vn-navy px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-vn-navy-deep disabled:opacity-40"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-vn-green" aria-hidden="true" />
                Mark as Verified
              </button>
              <button
                type="button"
                onClick={() => finish("blocked")}
                className="inline-flex items-center gap-1.5 rounded border border-vn-red/40 bg-vn-red/10 px-4 py-2 text-xs font-bold text-vn-red transition-colors hover:bg-vn-red/20"
              >
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                Block & Intercept Interaction
              </button>
              <button
                type="button"
                onClick={() => finish("dismissed")}
                className="inline-flex items-center gap-1.5 rounded border border-vn-border bg-white px-3 py-2 text-xs font-semibold text-vn-muted transition-colors hover:text-vn-navy"
              >
                Dismiss Alert
              </button>
            </div>
          </>
        )}

        <p className="flex items-center gap-1.5 text-[10px] text-vn-muted border-t border-vn-border pt-2">
          <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
          Prototype simulation: No actual telecom or financial operation executed.
        </p>
      </div>
    </section>
  );
}
