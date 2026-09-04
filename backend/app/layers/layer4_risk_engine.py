"""
Layer 4 — Unified Impersonation Risk Engine

Combines Layer 1/2/3 outputs into a single explainable score + an
adaptive response tier, per the strategy doc's risk table:

  Low       -> no interruption
  Medium    -> warning
  High      -> independent verification
  Critical  -> strong warning + verification

These weights are a reasonable starting point, NOT validated against
real data. Tune them once you have labeled demo scenarios — and say so
on the slide (the strategy doc explicitly warns against overclaiming
accuracy).
"""

WEIGHTS = {
    "voice_authenticity": 0.35,
    "identity_mismatch": 0.25,
    "intent": 0.40,
}


class RiskEngine:
    def compute(self, voice_result: dict, identity_result: dict | None, intent_result: dict) -> dict:
        voice_risk = voice_result["synthetic_probability"]

        if identity_result is not None:
            identity_risk = 1.0 - identity_result["similarity_score"]
        else:
            # No claimed identity to check against — don't let this
            # silently zero out the score; treat as neutral/unknown.
            identity_risk = 0.5

        intent_risk = intent_result["intent_risk_score"]

        overall = (
            WEIGHTS["voice_authenticity"] * voice_risk
            + WEIGHTS["identity_mismatch"] * identity_risk
            + WEIGHTS["intent"] * intent_risk
        )
        overall = round(min(1.0, overall), 4)

        if overall < 0.3:
            tier = "low"
            response = "No interruption — normal conversation."
        elif overall < 0.55:
            tier = "medium"
            response = "Warning: voice authenticity uncertain."
        elif overall < 0.8:
            tier = "high"
            response = "Ask user to independently verify the caller."
        else:
            tier = "critical"
            response = "Strong warning + mandatory verification before proceeding."

        return {
            "overall_risk": overall,
            "tier": tier,
            "response": response,
            "breakdown": {
                "voice_authenticity_risk": round(voice_risk, 4),
                "identity_mismatch_risk": round(identity_risk, 4),
                "intent_risk": round(intent_risk, 4),
            },
        }
