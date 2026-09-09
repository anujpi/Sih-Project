"""
VAANISHIELD — SIH26104
Real-time voice impersonation detection + prevention API.

Pipeline:
  audio in -> Layer1 (synthetic voice) -> Layer2 (speaker ID) ->
  Layer3 (speech-to-text + scam intent) -> Layer4 (unified risk engine)
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid

from app.layers.layer1_synthetic_voice import SyntheticVoiceDetector
from app.layers.layer2_speaker_verification import SpeakerVerifier
from app.layers.layer3_intent_analysis import IntentAnalyzer
from app.layers.layer4_risk_engine import RiskEngine
from app.layers import voice_registry

app = FastAPI(title="VAANISHIELD API", version="0.2.0")

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


def _resolve_identity_check(path: str, reference_path, claimed_identity):
    """
    Three ways Layer 2 can run, in priority order:
      1. claimed_identity given + found in registry -> compare against
         the STORED voiceprint (no fresh reference upload needed)
      2. reference_audio uploaded fresh -> compare against that
      3. neither -> skip Layer 2 entirely (identity_result = None)
    Returns (identity_result, warning) — warning is set if a claimed
    identity was given but isn't actually registered, so the caller
    can surface that instead of silently ignoring it.
    """
    if claimed_identity:
        stored_embedding = voice_registry.load_voiceprint(claimed_identity)
        if stored_embedding is not None:
            incoming_embedding = speaker_verifier.extract_embedding(path)
            result = speaker_verifier.compare_embeddings(incoming_embedding, stored_embedding)
            result["source"] = "registry"
            result["claimed_identity"] = claimed_identity
            return result, None
        warning = f"'{claimed_identity}' is not a registered voiceprint."
        if reference_path:
            result = speaker_verifier.compare(path, reference_path)
            result["source"] = "reference_audio"
            return result, warning
        return None, warning

    if reference_path:
        result = speaker_verifier.compare(path, reference_path)
        result["source"] = "reference_audio"
        return result, None

    return None, None


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------
# Voiceprint registry
# ---------------------------------------------------------------------

@app.post("/register-voice")
async def register_voice(name: str = Form(...), audio: UploadFile = File(...)):
    """
    Register a trusted voiceprint once. Only the numeric embedding is
    stored — never the raw audio — so future calls can be checked
    against `name` without re-uploading a reference clip each time.
    """
    path = _save_upload(audio)
    try:
        embedding = speaker_verifier.extract_embedding(path)
        voice_registry.save_voiceprint(name, embedding)
    finally:
        os.unlink(path)
    return {"registered": name}


@app.get("/voices")
def list_voices():
    return {"voices": voice_registry.list_voiceprints()}


@app.delete("/voices/{name}")
def delete_voice(name: str):
    deleted = voice_registry.delete_voiceprint(name)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"'{name}' is not registered.")
    return {"deleted": name}


# ---------------------------------------------------------------------
# Analysis endpoints
# ---------------------------------------------------------------------

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
    reference_audio: UploadFile = File(None),
    claimed_identity: str = Form(None),
):
    """
    Layer 2 — does the incoming voice match the claimed/trusted speaker.
    Provide EITHER claimed_identity (checks against a registered
    voiceprint) OR reference_audio (checks against a freshly uploaded
    clip). claimed_identity takes priority if both are given.
    """
    path = _save_upload(audio)
    ref_path = _save_upload(reference_audio) if reference_audio else None
    try:
        result, warning = _resolve_identity_check(path, ref_path, claimed_identity)
        if result is None:
            raise HTTPException(
                status_code=400,
                detail=warning or "Provide claimed_identity or reference_audio.",
            )
        if warning:
            result["warning"] = warning
        return result
    finally:
        os.unlink(path)
        if ref_path:
            os.unlink(ref_path)


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
    claimed_identity: str = Form(None),
):
    """
    Layer 4 — the actual demo endpoint.
    Runs all layers and returns a single explainable risk score.

    Identity check (Layer 2) resolves in this priority:
      1. claimed_identity matching a registered voiceprint
      2. a freshly uploaded reference_audio clip
      3. skipped entirely if neither is given (identity_verification: null)
    """
    path = _save_upload(audio)
    ref_path = _save_upload(reference_audio) if reference_audio else None
    try:
        voice_result = voice_detector.predict(path)
        identity_result, identity_warning = _resolve_identity_check(
            path, ref_path, claimed_identity
        )
        intent_result = intent_analyzer.analyze(path)
        risk = risk_engine.compute(voice_result, identity_result, intent_result)
    finally:
        os.unlink(path)
        if ref_path:
            os.unlink(ref_path)

    response = {
        "voice_authenticity": voice_result,
        "identity_verification": identity_result,
        "intent_analysis": intent_result,
        "risk": risk,
    }
    if identity_warning:
        response["identity_warning"] = identity_warning
    return response