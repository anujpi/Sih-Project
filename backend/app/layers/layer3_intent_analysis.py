"""
Layer 3 — Speech-to-Text + Scam Intent Analysis

Uses faster-whisper (CTranslate2 reimplementation of Whisper) for
transcription: https://github.com/SYSTRAN/faster-whisper

Intent detection is deliberately kept as keyword/regex rules for the
MVP, per the strategy doc — a full NLP intent classifier is explicitly
listed under "what NOT to build first." Swap in a proper classifier
later if time allows.
"""

import re
from faster_whisper import WhisperModel

WHISPER_MODEL_SIZE = "small"  # "base" is faster for live demo if needed
COMPUTE_TYPE = "int8"  # good CPU default; use "float16" on GPU

# Keep these patterns broad but low-noise. Extend with Hindi/Kannada
# transliterations + native-script terms per the India-specific roadmap
# in the strategy doc.
INTENT_PATTERNS = {
    "otp_request": r"\b(otp|one[- ]?time password|verification code|pin number)\b",
    "financial_request": r"\b(transfer|send money|account number|upi|bank details|wire)\b",
    "urgency": r"\b(urgent|immediately|right now|emergency|hurry|asap)\b",
    "authority_claim": r"\b(this is your (bank|manager|officer)|police|income tax|customs)\b",
    "secrecy_request": r"\b(don'?t tell|keep this secret|confidential|between us)\b",
}


class IntentAnalyzer:
    def __init__(self):
        self.model = WhisperModel(WHISPER_MODEL_SIZE, compute_type=COMPUTE_TYPE)

    def analyze(self, audio_path: str) -> dict:
        segments, _info = self.model.transcribe(audio_path, beam_size=5)
        transcript = " ".join(seg.text.strip() for seg in segments)

        flags = {
            intent: bool(re.search(pattern, transcript, re.IGNORECASE))
            for intent, pattern in INTENT_PATTERNS.items()
        }
        triggered = [k for k, v in flags.items() if v]

        return {
            "transcript": transcript,
            "flags": flags,
            "triggered_intents": triggered,
            "intent_risk_score": min(1.0, 0.25 * len(triggered)),
        }
