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
    label: "Verification phrase",
    tag: "Secret question",
    description:
      "Call the person back on a number you already trust, or ask the caller a question only the real person would know.",
  },
  {
    id: "contact",
    label: "Trusted contact",
    tag: "Out-of-band",
    description:
      "Confirm with a family member or the organization directly instead of acting on this call.",
  },
  {
    id: "secondary",
    label: "Secondary channel",
    tag: "Official app",
    description:
      "Verify through a different channel — an official app, a known website, or an in-person visit.",
  },
  {
    id: "device",
    label: "Registered device",
    tag: "Device check",
    description:
      "Confirm the caller is acting from the registered device and number on file before sharing anything.",
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
        className="rounded-2xl border border-vn-green/30 bg-vn-green/5 p-5"
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-vn-green" aria-hidden="true" />
          <div>
            <h3 id="verification-heading" className="text-sm font-bold text-vn-navy">
              No additional verification required
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-vn-muted">
              The interaction falls below the verification threshold and can proceed without
              interruption. VAANISHIELD keeps monitoring the conversation for new signals.
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
        className="rounded-2xl border border-vn-amber/40 bg-vn-amber/10 p-5"
      >
        <div className="flex items-start gap-3">
          <PhoneCall className="mt-0.5 h-5 w-5 shrink-0 text-vn-amber" aria-hidden="true" />
          <div>
            <h3 id="verification-heading" className="text-sm font-bold text-vn-navy">
              Caution — verify before sharing
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-vn-muted">
              Voice authenticity is uncertain. Verify the caller before sharing sensitive
              information.
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
        "Interaction verified",
        "Marked as independently verified. The conversation can proceed with caution."
      );
    } else if (next === "blocked") {
      push(
        "warning",
        "Interaction blocked",
        "The interaction is being treated as suspicious. No OTP, money, or confidential data was shared."
      );
    } else {
      push("info", "Warning dismissed", "You can re-open the verification workflow anytime.");
    }
    onStatusChange(next);
  }

  const allVerifiedHere = status === "verified";
  const allBlockedHere = status === "blocked";

  return (
    <section
      aria-labelledby="verification-heading"
      className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
      style={{
        borderColor: `${tierMeta.hex}55`,
        background: `linear-gradient(150deg, ${tierMeta.hex}14, #F5F8FC 55%)`,
      }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${tierMeta.hex}22`, color: tierMeta.hex }}
          >
            {isCritical ? (
              <Lock className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PhoneCall className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
          <div className="min-w-0">
            <h3
              id="verification-heading"
              className="text-base font-bold text-vn-navy"
            >
              {allVerifiedHere
                ? "Independently verified"
                : allBlockedHere
                  ? "Interaction blocked — do not proceed"
                  : isCritical
                    ? "Critical impersonation risk"
                    : "Independent verification recommended"}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-vn-muted">
              {allVerifiedHere
                ? "The caller passed an out-of-band check. Treat shared information as confirmed."
                : allBlockedHere
                  ? "This interaction stays blocked until you re-open verification."
                  : isCritical
                    ? "Do not share OTPs, passwords, money, or confidential information until the caller is independently verified."
                    : "This call carries a credible impersonation signal. Confirm the caller's identity out-of-band before taking any sensitive action."}
            </p>
          </div>
        </div>

        {!allVerifiedHere && !allBlockedHere && (
          <>
            <ol
              aria-label="Verification workflow"
              className="flex items-center gap-2 text-[11px] font-semibold text-vn-muted"
            >
              {[
                { n: "1", label: "Select method" },
                { n: "2", label: "Confirm channel" },
                { n: "3", label: "Resolve" },
              ].map((step, i) => {
                const stepDone = simPhase === "confirmed" ? i <= 1 : simPhase === "checking" ? i === 0 : false;
                const stepActive = (simPhase === "idle" && i === 0) || (simPhase === "checking" && i === 1);
                return (
                  <li key={step.n} className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-bold ${
                        stepDone
                          ? "border-vn-green/50 bg-vn-green/10 text-vn-green"
                          : stepActive
                            ? "border-vn-cyan/60 bg-vn-cyan/15 text-vn-cyan"
                            : "border-vn-border bg-vn-page text-vn-muted"
                      }`}
                      aria-hidden="true"
                    >
                      {stepDone ? <Check className="h-3 w-3" /> : step.n}
                    </span>
                    {step.label}
                    {i < 2 && <span className="h-px w-4 bg-vn-border" aria-hidden="true" />}
                  </li>
                );
              })}
            </ol>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-vn-muted">
                Step 1 — Choose a verification channel
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {VERIFICATION_STEPS.map((step) => {
                  const isSelected = selected === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => selectMethod(step.id)}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vn-cyan ${
                        isSelected
                          ? "border-vn-cyan/60 bg-vn-cyan/10 shadow-lg shadow-vn-cyan/10"
                          : "border-vn-border bg-white hover:border-vn-cyan/30"
                      }`}
                    >
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-vn-border bg-vn-page text-vn-muted">
                        {isSelected ? (
                          <Check className="h-4 w-4 text-vn-cyan" aria-hidden="true" />
                        ) : (
                          <CircleDashed className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-vn-navy">{step.label}</span>
                          <span
                            className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest ${
                              isSelected
                                ? "border-vn-cyan/40 bg-vn-cyan/10 text-vn-cyan"
                                : "border-vn-border bg-vn-page text-vn-muted"
                            }`}
                          >
                            {step.tag}
                          </span>
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-vn-muted">
                          {step.description}
                        </span>

                        {isSelected && simPhase !== "idle" && (
                          <span
                            className="mt-2 flex items-center gap-1.5 rounded-lg border border-vn-cyan/30 bg-vn-cyan/10 px-2 py-1 text-[11px] font-semibold text-vn-cyan"
                            aria-live="polite"
                          >
                            {simPhase === "checking" ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                Simulating trusted-channel confirmation…
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                                Simulated response confirmed on this channel.
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

            <div className="rounded-xl border border-vn-border bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-vn-muted">
                <ShieldCheck className="h-4 w-4 text-vn-cyan" aria-hidden="true" />
                Why independent verification?
              </div>
              <p className="mt-2 text-sm leading-relaxed text-vn-muted">
                Detection alone cannot stop an attack — the caller still controls the conversation.
                VAANISHIELD buys you time by forcing a check against a channel the attacker cannot
                impersonate. You do not need to argue with the caller; just verify in private. All
                checks here are simulations — no real calls, SMS, or messages are sent.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-vn-border pt-4">
              <button
                type="button"
                onClick={() => finish("verified")}
                disabled={!selected}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-vn-green to-vn-cyan px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-vn-green/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Mark as Verified
              </button>
              <button
                type="button"
                onClick={() => finish("blocked")}
                className="inline-flex items-center gap-2 rounded-xl border border-vn-red/50 bg-vn-red/10 px-5 py-2.5 text-sm font-bold text-vn-red transition-colors hover:bg-vn-red/20"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                Keep Interaction Blocked
              </button>
              <button
                type="button"
                onClick={() => finish("dismissed")}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-vn-muted transition-colors hover:text-vn-navy"
              >
                Dismiss Warning
              </button>
            </div>
          </>
        )}

        <p className="flex items-center gap-1.5 text-[11px] text-vn-muted">
          <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
          Prototype simulation only — no real telecom interception, SMS, WhatsApp, or payment
          blocking is performed.
        </p>
      </div>
    </section>
  );
}
