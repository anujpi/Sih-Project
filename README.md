# VAANISHIELD — SIH26104

AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks.

VAANISHIELD is a real-time voice impersonation defense layer. Instead of
just asking *"is this audio fake?"*, it asks *"is this interaction safe?"*
by combining four signals into one explainable risk score.

## Architecture

```
Incoming audio
      |
      v
Layer 1: Synthetic Voice Detection   (wav2vec2, fine-tuned)
      |
      v
Layer 2: Speaker Identity Verification  (speechbrain ECAPA-TDNN)
      |
      v
Layer 3: Speech-to-Text + Scam Intent  (faster-whisper + rules)
      |
      v
Layer 4: Unified Risk Engine  -> risk score + adaptive response
```

| Layer | Purpose | Built on |
|---|---|---|
| 1 | Real vs. synthetic voice probability | [DeepFake-detection-Using-Wav2Vec2](https://github.com/Sarkarsubham2002/DeepFake-detection-Using-Wav2Vec2) |
| 2 | Does the voice match the trusted/claimed speaker | [speechbrain](https://github.com/speechbrain/speechbrain) (ECAPA-TDNN) |
| 3 | Transcript + scam-intent flags (OTP, urgency, money) | [faster-whisper](https://github.com/SYSTRAN/faster-whisper) |
| 4 | Combine 1–3 into one explainable, tiered risk score | custom |

Educational/reference repos (not directly integrated, cited for context):
- [ADD-W2V2-LCNN-19LA0.6](https://github.com/xieyuankun/ADD-W2V2-LCNN-19LA0.6) — simple baseline to learn the pipeline from
- [ToP-audio-deepfake-detection](https://github.com/josebeo2016/ToP-audio-deepfake-detection) — ACM CCS 2024 paper implementation, good citation for the novelty slide

## Risk tiers (adaptive verification)

| Risk | Response |
|---|---|
| Low | No interruption |
| Medium | Warning shown |
| High | Ask user to independently verify caller |
| Critical | Strong warning + mandatory verification |

## Setup

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs at `http://localhost:8000/docs` once running.

See `backend/models/README.md` for where Layer 1's fine-tuned checkpoint
needs to go — everything else downloads automatically on first run.

## Endpoints

- `POST /analyze/voice` — Layer 1 only
- `POST /analyze/identity` — Layer 2 only (needs a reference sample)
- `POST /analyze/intent` — Layer 3 only
- `POST /analyze/full` — full pipeline, returns the unified risk score (demo endpoint)

## What's NOT built yet (by design, per MVP scope)

- Real telecom/call integration — prototype takes uploaded/simulated audio
- All Indian languages — starting with English/Hindi/Kannada
- Frontend dashboard — see `frontend/` (scaffold pending)

## Team

- AI/ML: Layer 1 fine-tuning + evaluation
- Voice/NLP: Layer 2 + Layer 3
- Backend: API, risk engine, DB
- Frontend: real-time dashboard + verification UX
- Pitch/demo: storyline, live demo, metrics
