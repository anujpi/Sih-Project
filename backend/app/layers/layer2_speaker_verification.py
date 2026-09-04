"""
Layer 2 — Speaker Identity Verification

Uses SpeechBrain's pretrained ECAPA-TDNN speaker verification model:
  https://github.com/speechbrain/speechbrain
  (pretrained checkpoint: speechbrain/spkrec-ecapa-voxceleb)

Given an incoming call's audio and a trusted reference sample (the
"registered voiceprint" from VAANISHIELD's registry idea), returns a
similarity score. Low similarity + high synthetic-voice probability
from Layer 1 = strong impersonation signal.
"""

from speechbrain.inference.speaker import SpeakerRecognition
from speechbrain.utils.fetching import LocalStrategy

MODEL_SOURCE = "speechbrain/spkrec-ecapa-voxceleb"
# Relative to wherever the app process's cwd is (normally backend/, since
# that's where you run `uvicorn app.main:app` from) — NOT "backend/models/..."
# which would nest into backend/backend/models/ when run from inside backend/.
MODEL_SAVEDIR = "models/spkrec-ecapa-voxceleb"

# Below this cosine similarity, treat the voice as NOT matching the
# claimed/registered identity. Tune this against real dev-set audio —
# this default is a starting point, not a validated threshold.
MATCH_THRESHOLD = 0.25


class SpeakerVerifier:
    def __init__(self):
        self.model = SpeakerRecognition.from_hparams(
            source=MODEL_SOURCE,
            savedir=MODEL_SAVEDIR,
            # Windows blocks symlink creation without admin/Developer Mode
            # enabled — copy the files instead. Slightly more disk use,
            # works everywhere without special permissions.
            local_strategy=LocalStrategy.COPY,
        )

    def compare(self, audio_path: str, reference_path: str) -> dict:
        score, prediction = self.model.verify_files(audio_path, reference_path)
        similarity = float(score)
        return {
            "similarity_score": round(similarity, 4),
            "identity_match": bool(similarity >= MATCH_THRESHOLD),
        }
