# 🛡️ VAANISHIELD

### AI-Powered Real-Time Detection and Prevention of Voice Cloning Impersonation Attacks
**Smart India Hackathon 2026 — Problem Statement SIH26104**

> *"When a voice can be cloned, voice alone can no longer be trusted. VAANISHIELD adds an intelligent security layer between a suspicious voice and a dangerous decision."*

---

## The Problem

AI can now clone a person's voice from a few seconds of publicly available audio — and use it for impersonation, financial fraud, social engineering, and requests for sensitive information like OTPs. A simple "real vs. fake audio" classifier doesn't fully solve this: a genuine human can impersonate someone too. The real question isn't *"is this audio fake?"* — it's **"is this interaction safe?"**

## What VAANISHIELD Does

VAANISHIELD is a real-time voice impersonation defense layer that combines **four signals** into one explainable risk score, instead of a binary real/fake label:

```
Incoming audio
      │
      ▼
┌─────────────────────────────────────────┐
│  Layer 1 — Synthetic Voice Detection     │  wav2vec2, fine-tuned
├─────────────────────────────────────────┤
│  Layer 2 — Speaker Identity Verification │  speechbrain ECAPA-TDNN
├─────────────────────────────────────────┤
│  Layer 3 — Speech-to-Text + Scam Intent  │  faster-whisper + rules
├─────────────────────────────────────────┤
│  Layer 4 — Unified Risk Engine           │  weighted, explainable
└─────────────────────────────────────────┘
      │
      ▼
Risk score + adaptive response
```

| Layer | Question it answers | Built on |
|---|---|---|
| 1. Voice Authenticity | Does this voice sound synthetic? | [DeepFake-detection-Using-Wav2Vec2](https://github.com/Sarkarsubham2002/DeepFake-detection-Using-Wav2Vec2) |
| 2. Identity Verification | Does it match the person it claims to be? | [speechbrain](https://github.com/speechbrain/speechbrain) (ECAPA-TDNN) |
| 3. Intent Analysis | Is it asking for money, OTPs, or urgent action? | [faster-whisper](https://github.com/SYSTRAN/faster-whisper) |
| 4. Risk Engine | Combine 1–3 into one explainable score | custom |

## The Key Innovation — Adaptive Verification

VAANISHIELD doesn't flag every suspicious call as fake outright. It scales its response to the severity of the risk:

| Risk Tier | System Response | Example |
|---|---|---|
| 🟢 Low | No interruption | Normal conversation |
| 🟡 Medium | Warning shown | Voice authenticity uncertain |
| 🟠 High | Independent verification requested | Ask user to verify caller |
| 🔴 Critical | Strong warning + mandatory verification | Money/OTP request + suspicious voice |

## How This Differs From a Typical Deepfake Detector

| Typical approach | VAANISHIELD |
|---|---|
| Detects fake audio | Detects impersonation *attacks* |
| Binary real/fake | Probabilistic, explainable risk score |
| Audio only | Audio + identity + intent + context |
| Detection only | Detection **+ prevention** |
| No action after detection | Adaptive verification workflow |
| Generic language focus | India-focused multilingual roadmap (English, Hindi, Kannada → more) |

## Tech Stack

- **Backend:** FastAPI (Python)
- **AI/ML:** PyTorch, HuggingFace Transformers (wav2vec2), speechbrain (ECAPA-TDNN)
- **Speech-to-Text:** faster-whisper
- **Frontend:** *(planned)* Next.js / React
- **Database:** *(planned)* PostgreSQL
- **Deployment:** *(planned)* Docker

## Getting Started

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs live at `http://localhost:8000/docs` once running.

See [`backend/models/README.md`](backend/models/README.md) for where the fine-tuned Layer 1 checkpoint needs to go — everything else downloads automatically on first run.

### API Endpoints

| Endpoint | Purpose |
|---|---|
| `POST /analyze/voice` | Layer 1 only — synthetic voice probability |
| `POST /analyze/identity` | Layer 2 only — speaker match against a reference sample |
| `POST /analyze/intent` | Layer 3 only — transcript + scam-intent flags |
| `POST /analyze/full` | Full pipeline — the main demo endpoint, returns the unified risk score |

## Project Status

- [x] Backend scaffold — all 4 layers wired end-to-end
- [x] Layer 2 (speaker verification) and Layer 3 (intent) — working with pretrained models
- [ ] Layer 1 — fine-tuning on ASVspoof / In-the-Wild dataset (currently running on an untrained fallback for pipeline testing)
- [ ] Frontend dashboard
- [ ] Multilingual intent detection (Hindi, Kannada)

**Honest note:** this is a prototype under active development for an internal SIH selection round, not a production security product. See [Technical Positioning](#technical-positioning) below.

## Technical Positioning

VAANISHIELD does not claim 100% detection accuracy. It's a probabilistic risk-assessment and prevention layer, evaluated on false positives, false negatives, latency, and robustness to compression/noise across languages — not on a single "accuracy" number.

## Team

| Track | Responsibility |
|---|---|
| AI/ML | Synthetic voice detection model + evaluation |
| Voice/NLP | Speaker verification, ASR, intent classification |
| Backend | Audio pipeline, risk engine, APIs, database |
| Frontend | Real-time security dashboard, verification UX |
| Pitch/Demo | Storyline, live demo, metrics, presentation |

## Reference / Educational Repos

Not directly integrated, but useful context for the team:
- [ADD-W2V2-LCNN-19LA0.6](https://github.com/xieyuankun/ADD-W2V2-LCNN-19LA0.6) — simple baseline to learn the deepfake-detection pipeline from
- [ToP-audio-deepfake-detection](https://github.com/josebeo2016/ToP-audio-deepfake-detection) — ACM CCS 2024 paper implementation, cited for the novelty slide
