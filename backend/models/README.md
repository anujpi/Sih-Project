# Model checkpoints (not committed to git)

## Layer 1 — Synthetic Voice Detector
Expected at: `backend/models/wav2vec2_df/`

Fine-tune following the approach in
https://github.com/Sarkarsubham2002/DeepFake-detection-Using-Wav2Vec2
on the In-the-Wild deepfake dataset (or ASVspoof2019/2021).

Until a fine-tuned checkpoint exists here, `layer1_synthetic_voice.py`
falls back to a base (untrained-head) wav2vec2 model automatically —
useful for testing the pipeline wiring, meaningless for the actual demo.

Reference baseline (simpler, good for understanding the pipeline first):
https://github.com/xieyuankun/ADD-W2V2-LCNN-19LA0.6

Advanced reference (cite in PPT for novelty, ACM CCS 2024):
https://github.com/josebeo2016/ToP-audio-deepfake-detection

## Layer 2 — Speaker Verification
Downloads automatically from HuggingFace on first run
(`speechbrain/spkrec-ecapa-voxceleb`) into
`backend/models/spkrec-ecapa-voxceleb/`. No manual setup needed.

## Layer 3 — Speech-to-Text
`faster-whisper` downloads its model automatically on first run based
on the `WHISPER_MODEL_SIZE` set in `layer3_intent_analysis.py`.
