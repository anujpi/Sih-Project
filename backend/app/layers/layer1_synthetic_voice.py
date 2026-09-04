"""
Layer 1 — Synthetic Voice Detection

Built on the fine-tuning approach from:
  https://github.com/Sarkarsubham2002/DeepFake-detection-Using-Wav2Vec2
which fine-tunes facebook/wav2vec2-base (or xls-r) on the In-the-Wild
deepfake dataset for a real-vs-synthetic binary head.

USAGE NOTES FOR THE TEAM:
- This module expects a fine-tuned checkpoint at backend/models/wav2vec2_df/.
  Either:
    a) fine-tune your own using the referenced repo's training script on
       ASVspoof2019/In-the-Wild, or
    b) for the very first demo, swap in the base wav2vec2 model with an
       UNTRAINED classifier head (works, but scores are meaningless until
       trained — fine for testing the pipeline wiring, not for the actual
       demo).
- Do not commit model checkpoints to git — they're large. Add
  backend/models/ to .gitignore and share checkpoints via Drive.
"""

import torch
import torchaudio
import soundfile as sf
from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification

MODEL_PATH = "models/wav2vec2_df"  # relative to cwd (backend/) when run via uvicorn
FALLBACK_MODEL = "facebook/wav2vec2-base"
TARGET_SR = 16000


class SyntheticVoiceDetector:
    def __init__(self, model_path: str = MODEL_PATH):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        try:
            self.extractor = Wav2Vec2FeatureExtractor.from_pretrained(model_path)
            self.model = Wav2Vec2ForSequenceClassification.from_pretrained(
                model_path
            ).to(self.device)
            self.loaded_finetuned = True
        except Exception:
            # No fine-tuned checkpoint yet — fall back so the API doesn't
            # crash during early integration/testing.
            self.extractor = Wav2Vec2FeatureExtractor.from_pretrained(
                FALLBACK_MODEL
            )
            self.model = Wav2Vec2ForSequenceClassification.from_pretrained(
                FALLBACK_MODEL, num_labels=2
            ).to(self.device)
            self.loaded_finetuned = False
        self.model.eval()

    def _load_audio(self, path: str) -> torch.Tensor:
        # soundfile (libsndfile) instead of torchaudio.load — avoids
        # needing torchcodec + a separately-installed system FFmpeg,
        # which is a pain on Windows. Handles wav/flac natively; for
        # mp3/m4a convert to wav first (e.g. via VLC or ffmpeg CLI).
        data, sr = sf.read(path, dtype="float32", always_2d=True)
        waveform = torch.from_numpy(data.T)  # (channels, samples)
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)
        if sr != TARGET_SR:
            waveform = torchaudio.functional.resample(waveform, sr, TARGET_SR)
        return waveform.squeeze(0)

    @torch.no_grad()
    def predict(self, audio_path: str) -> dict:
        waveform = self._load_audio(audio_path)
        inputs = self.extractor(
            waveform, sampling_rate=TARGET_SR, return_tensors="pt"
        ).to(self.device)
        logits = self.model(**inputs).logits
        probs = torch.softmax(logits, dim=-1)[0]

        # label convention: 0 = bonafide/real, 1 = synthetic/spoof
        synthetic_prob = float(probs[1])

        return {
            "synthetic_probability": round(synthetic_prob, 4),
            "label": "synthetic" if synthetic_prob >= 0.5 else "bonafide",
            "model_finetuned": self.loaded_finetuned,
        }