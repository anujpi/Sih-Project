"""
Layer 2 — Speaker Identity Verification

Uses SpeechBrain's pretrained ECAPA-TDNN speaker verification model:
  https://github.com/speechbrain/speechbrain
  (pretrained checkpoint: speechbrain/spkrec-ecapa-voxceleb)

Given an incoming call's audio and a trusted reference (either a
freshly uploaded reference clip, or a stored voiceprint embedding from
the registry — see voice_registry.py), returns a similarity score.
Low similarity + high synthetic-voice probability from Layer 1 =
strong impersonation signal.
"""

import torch
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

    def extract_embedding(self, audio_path: str) -> torch.Tensor:
        """
        Compute a speaker embedding (voiceprint) for one audio file.
        This is what gets stored in the registry — NOT the raw audio —
        so registering a voice never means keeping someone's actual
        recording on disk long-term.
        """
        signal = self.model.load_audio(audio_path)  # uses relative paths
        # only, to avoid the Windows drive-letter/URL-parsing bug —
        # callers must pass a relative path (see app/main.py _save_upload)
        embedding = self.model.encode_batch(signal.unsqueeze(0))
        return embedding.squeeze().detach().cpu()

    def compare_embeddings(self, emb_a: torch.Tensor, emb_b: torch.Tensor) -> dict:
        similarity = float(
            torch.nn.functional.cosine_similarity(
                emb_a.flatten(), emb_b.flatten(), dim=0
            )
        )
        return {
            "similarity_score": round(similarity, 4),
            "identity_match": bool(similarity >= MATCH_THRESHOLD),
        }

    def compare(self, audio_path: str, reference_path: str) -> dict:
        """Two-file comparison — used when no registry entry exists yet
        and the caller uploads a fresh reference clip instead."""
        emb_a = self.extract_embedding(audio_path)
        emb_b = self.extract_embedding(reference_path)
        return self.compare_embeddings(emb_a, emb_b)