"""
VAANISHIELD — SIH26104
Real-time voice impersonation detection + prevention API.

Pipeline:
  audio in -> Layer1 (synthetic voice) -> Layer2 (speaker ID) ->
  Layer3 (speech-to-text + scam intent) -> Layer4 (unified risk engine)
"""

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid

from app.layers.layer1_synthetic_voice import SyntheticVoiceDetector
from app.layers.layer2_speaker_verification import SpeakerVerifier
from app.layers.layer3_intent_analysis import IntentAnalyzer
from app.layers.layer4_risk_engine import RiskEngine

app = FastAPI(title="VAANISHIELD API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten before any real deployment
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models are loaded once at startup, not per-request — cold start is slow
# (esp. speechbrain + whisper), so keep the process warm during demos.
voice_detector = SyntheticVoiceDetector()
speaker_verifier = SpeakerVerifier()
intent_analyzer = IntentAnalyzer()
risk_engine = RiskEngine()

# Local, RELATIVE temp folder for uploads (not the system temp dir).
# Reason: speechbrain's fetch() misparses a Windows absolute path like
# C:\Users\... as a URL (it sees "C:" and thinks "C" is a URL scheme),
# which corrupts the path. Relative paths like .tmp_uploads/xyz.wav
# don't have a drive letter, so they sidestep that bug entirely.
TMP_DIR = ".tmp_uploads"
os.makedirs(TMP_DIR, exist_ok=True)


def _save_upload(upload: UploadFile) -> str:
    suffix = os.path.splitext(upload.filename or "audio.wav")[1] or ".wav"
    rel_path = os.path.join(TMP_DIR, f"{uuid.uuid4().hex}{suffix}")
    with open(rel_path, "wb") as f:
        shutil.copyfileobj(upload.file, f)
    return rel_path


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze/voice")
async def analyze_voice(audio: UploadFile = File(...)):
    """Layer 1 — synthetic voice probability only."""
    path = _save_upload(audio)
    try:
        result = voice_detector.predict(path)
    finally:
        os.unlink(path)
    return result


@app.post("/analyze/identity")
async def analyze_identity(
    audio: UploadFile = File(...),
    reference_audio: UploadFile = File(...),
):
    """Layer 2 — does incoming voice match the claimed/trusted speaker."""
    path = _save_upload(audio)
    ref_path = _save_upload(reference_audio)
    try:
        result = speaker_verifier.compare(path, ref_path)
    finally:
        os.unlink(path)
        os.unlink(ref_path)
    return result


@app.post("/analyze/intent")
async def analyze_intent(audio: UploadFile = File(...)):
    """Layer 3 — transcript + scam-intent flags (OTP, urgency, money, etc.)."""
    path = _save_upload(audio)
    try:
        result = intent_analyzer.analyze(path)
    finally:
        os.unlink(path)
    return result


@app.post("/analyze/full")
async def analyze_full(
    audio: UploadFile = File(...),
    reference_audio: UploadFile = File(None),
):
    """
    Layer 4 — the actual demo endpoint.
    Runs all layers and returns a single explainable risk score.
    reference_audio is optional: if the caller doesn't claim a known
    identity, we skip Layer 2 and weight the rest accordingly.
    """
    path = _save_upload(audio)
    ref_path = _save_upload(reference_audio) if reference_audio else None
    try:
        voice_result = voice_detector.predict(path)
        identity_result = (
            speaker_verifier.compare(path, ref_path) if ref_path else None
        )
        intent_result = intent_analyzer.analyze(path)
        risk = risk_engine.compute(voice_result, identity_result, intent_result)
    finally:
        os.unlink(path)
        if ref_path:
            os.unlink(ref_path)

    return {
        "voice_authenticity": voice_result,
        "identity_verification": identity_result,
        "intent_analysis": intent_result,
        "risk": risk,
    }