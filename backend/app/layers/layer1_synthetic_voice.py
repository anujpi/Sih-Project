"""
Layer 1 — Synthetic Voice Detection

Uses a pretrained, already fine-tuned deepfake detector from HuggingFace
(motheecreator/Deepfake-audio-detection) — no training required.

For post-hackathon improvement: fine-tune your own on ASVspoof2019/
In-the-Wild following https://github.com/Sarkarsubham2002/DeepFake-detection-Using-Wav2Vec2
for better accuracy on your specific demo scenarios.
"""

import torch
import torchaudio
import soundfile as sf
from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForSequenceClassification

MODEL_PATH = "motheecreator/Deepfake-audio-detection"  # pretrained deepfake detector, no fine-tuning needed
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
            # Network issue / model unavailable — fall back so the API
            # doesn't crash. Scores from the fallback are meaningless.
            self.extractor = Wav2Vec2FeatureExtractor.from_pretrained(
                FALLBACK_MODEL
            )
            self.model = Wav2Vec2ForSequenceClassification.from_pretrained(
                FALLBACK_MODEL, num_labels=2
            ).to(self.device)
            self.loaded_finetuned = False
        self.model.eval()
        # Read the model's own label mapping instead of hardcoding
        # index 0/1 — different checkpoints order labels differently.
        self.id2label = self.model.config.id2label

    def _load_audio(self, path: str) -> torch.Tensor:
        try:
            data, sr = sf.read(path, dtype="float32", always_2d=True)
            waveform = torch.from_numpy(data.T)  # (channels, samples)
        except Exception:
            waveform, sr = torchaudio.load(path)
            if waveform.ndim == 1:
                waveform = waveform.unsqueeze(0)
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

        # Don't hardcode which index means "fake" — read the model's own
        # label names (varies by checkpoint) and match case-insensitively.
        synthetic_prob = 0.0
        for idx, label in self.id2label.items():
            label_lower = str(label).lower()
            if any(k in label_lower for k in ("fake", "spoof", "synthetic", "generated")):
                synthetic_prob = float(probs[int(idx)])
                break
        else:
            # Couldn't identify the "fake" label by name — assume index 1
            # as a last resort (common convention: 0=real, 1=fake).
            synthetic_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])

        return {
            "synthetic_probability": round(synthetic_prob, 4),
            "label": "synthetic" if synthetic_prob >= 0.5 else "bonafide",
            "model_finetuned": self.loaded_finetuned,
        }