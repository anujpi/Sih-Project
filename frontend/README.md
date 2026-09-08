# VAANISHIELD Frontend

Polished, interactive voice-impersonation defense website — Next.js 16 + TypeScript + Tailwind v4, built for a Smart India Hackathon 2026 jury demo.

Live at `http://localhost:3000`.

## Two connected experiences

**1. Product landing page (`/`)** — a premium cybersecurity site that explains the product in seconds: the "when a voice can be cloned, voice alone cannot be trusted" hero, an animated shield/waveform illustration, stats row, the four intelligence layers, the detection-to-prevention pipeline, a comparison against basic deepfake detectors, and a final CTA into the demo.

**Landing page (`/`)** — hero with the interactive **Live Guard** widget (animated waveform → shield → risk meter, with hoverable Voice/Identity/Intent/Context signals), product-pillar cards, a problem section, a clickable detection-to-prevention pipeline, the comparison table, the India language roadmap, and a final CTA into the console.

**Live console (`/demo`)** — a two-zone layout: the main workspace (scenarios, audio input, transcript preview, pipeline, result hero, evidence cards, verification panel) plus a sticky sidebar (run-mode toggle, backend status from `GET /health`, recent analyses, prototype notice).

## What the demo shows

VAANISHIELD is **not** a binary real/fake audio classifier. It combines **four signals**:

1. **Voice Authenticity** — synthetic voice probability (wav2vec2, fine-tuned)
2. **Identity Verification** — speaker similarity vs. a claimed reference voice (ECAPA-TDNN)
3. **Speech-to-Text + Intent** — transcript plus scam-pressure flags (OTP, financial request, urgency, authority claim, secrecy)
4. **Unified Risk Engine** — weighted, explainable risk score + tier + plain-language response

When risk is High or Critical, an **Adaptive Verification** workflow drops in: verification phrase, trusted-contact confirmation, secondary-channel check, registered-device consistency, and actions (Mark as Verified / Keep Blocked / Dismiss Warning). For Critical, the UI emphasizes **never share OTPs, passwords, or money** before independent verification. All interception, messaging, and financial blocking actions are **simulated prototype actions** — no real telecom/SMS/financial operations are performed.

## Running it

### Prerequisites
- Node.js 20+ (uses `next dev`, `next build`)
- Optionally the FastAPI backend running for real model inference

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Copy `.env.example` to `.env.local` and adjust:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

- `NEXT_PUBLIC_API_BASE_URL` — base URL of the FastAPI backend. Defaults to `http://localhost:8000`.

### Backend startup (optional, real inference)

```bash
cd ../backend
python -m venv .venv
.venv\Scripts\Activate.ps1      # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: `http://localhost:8000/docs`.

### Demo mode (recommended for jury presentations)

The console works fully offline:

1. Run `npm run dev` with no backend.
2. Confirm the **Demo Mode** toggle in the sidebar (default).
3. Pick any scenario card, then click **Analyze Voice Interaction**.
4. Demo results are labeled **Demo** so judges can distinguish mock data from real inference.
5. Switch to **API Mode**, upload/record audio (optionally a reference voice + claimed identity) to hit the real endpoint.

The four scenarios each tell a distinct story:

| Scenario | What the risk dashboard shows |
|---|---|
| Genuine Voice | Low risk, all checks clean |
| AI-Cloned Voice | High risk, synthetic voice + identity mismatch |
| AI-Cloned Scam Call | Critical, OTP + urgent money transfer + secrecy flags |
| Known-Person Mismatch | High risk from a *human* voice that fails identity check — the "not just fake audio" story |

If no reference audio is supplied and no identity is claimed, the Identity stage is **skipped** and its weight redistributed — the UI shows "Not performed", never a fake 0%.

## What it talks to

`src/lib/api-client.ts` is the only module that talks to the backend:

```
POST {NEXT_PUBLIC_API_BASE_URL}/analyze/full   (multipart/form-data)
  fields: audio (required), reference_audio (optional)
```

The response is run through `sanitizeAnalysisResponse`, which normalizes 0–1 probabilities and 0–100 scores safely, tolerates missing/null fields, and never lets a skipped layer render a misleading zero. Demo mode returns mocked responses in exactly the same shape via `src/lib/demo-scenarios.ts`.

## Handling edge cases

- **Loading / retry** — the pipeline progresses stage-by-stage; API failures surface a retry button and a "switch to demo mode" escape hatch.
- **API error / offline backend** — friendly, code-specific error messages; demo mode unaffected.
- **Timeout** — 120 s client-side abort with a clear message.
- **No reference voice** — Identity stage → *Skipped*, card shows *Not performed*.
- **Unsupported audio type / oversized file** — client-side validation on upload (WAV/MP3/OGG/WebM, 50 MB cap).
- **Empty states** — no results yet, no recent analyses, no flags triggered, no transcript.
- **Skipped layers never show 0%** — skipping a layer omits its value instead of showing a misleading 0.

## Structure

```
src/
  app/
    layout.tsx        fonts, metadata, global ToastProvider
    page.tsx          product landing page
    demo/page.tsx     live console route
    globals.css       VAANISHIELD theme tokens, motion, reduced-motion support
  components/
    site-navbar.tsx        landing nav (scroll-aware)
    hero-section.tsx       headline + eyebrow + trust note + CTA
    live-guard-widget.tsx  interactive hero shield with hoverable signals
    feature-grid.tsx       four intelligence layers
    problem-section.tsx    voice-cloning problem + core quote
    pipeline-visual.tsx    clickable detection → prevention pipeline
    comparison-section.tsx deepfake detector vs VAANISHIELD
    languages-section.tsx  India language roadmap (honest status)
    final-cta.tsx          CTA into the live demo
    footer.tsx             limitation + project info
    demo-shell.tsx         console orchestrator (mode, state, layout)
    scenario-selector.tsx  four selectable scenario cards
    audio-upload.tsx       drag-drop, browse, mic recording, reference voice
    audio-visualizer.tsx   animated waveform + play/pause/restart/delete
    analysis-pipeline.tsx  four progressing stages with status text
    risk-gauge.tsx         animated circular 0–100 gauge
    risk-result.tsx        score hero + recommendation + reasons
    voice-authenticity-card.tsx / identity-card.tsx / intent-card.tsx / risk-engine-card.tsx
    verification-panel.tsx adaptive verification workflow
    analysis-history.tsx   localStorage recent analyses with replay
    evidence-card.tsx      shared expandable card shell + meters
    status-badge.tsx       status / tier / live indicators
    toast-provider.tsx     toast notifications + context
    reveal.tsx             scroll-reveal wrapper
  hooks/
    use-analysis.ts        pipeline timing, demo/API split, history
  lib/
    types.ts               shared response + UI types
    api-client.ts          dedicated backend client + response sanitization
    demo-scenarios.ts      scenario configs + mocked responses (backend shape)
    risk-utils.ts          score normalization, tier metadata, transcript highlight
```

Recent analyses persist to `localStorage` only — no database is used in the MVP.

## Risk tiers

| Score | Tier | Behavior shown |
|---|---|---|
| 0–29 | Low | No additional verification required |
| 30–54 | Medium | Caution: "Voice authenticity is uncertain. Verify the caller before sharing sensitive information." |
| 55–79 | High | Independent verification recommended |
| 80–100 | Critical | Strong warning and mandatory verification |

The backend tier always wins when provided; this mapping is only the display fallback for when the API omits a tier.

## Design system

Deep-navy command-center theme with a cyan→indigo accent gradient and per-tier status colors:

- Navy `#07111F` / Midnight `#0B1B32` / Surface `#102642` / Elevated `#142F4D`
- Cyan `#38D6FF` · Indigo `#6C63FF` · Violet `#A78BFA`
- Low `#34D399` · Medium `#FBBF24` · High `#FB923C` · Critical `#F43F5E`

Frosted-glass panels, soft borders (`rgba(148,163,184,0.18)`), layered shadows, and short purposeful animations. All motion respects `prefers-reduced-motion`.

Layout is centralized in `globals.css` tokens:

- `--content-max-width: 1280px` with 16/24/32px side padding (the `.vn-container` class applies one shared edge to navbar, hero, every section, CTA, footer, and the demo console).
- `.vn-section` gives a 40/56/80px vertical rhythm (mobile/tablet/desktop).
- Card radius `20px`, small radius `12px`, 48px control height, 24px (desktop) / 16px (mobile) grid gap.
- The hero **Live Guard** widget is a self-contained diagram: header row, centered shield + animated analysis ring, four equal-width signal columns, and a stable footer — no layout jumps when state changes.

## Lint / build checks

```bash
npm run lint
npm run build
```

## Honest positioning

VAANISHIELD provides **probabilistic risk assessment** — it is not a final determination of authenticity or identity, and it does not claim 100% accuracy. Scores are risk indicators, not guaranteed truth. Verification actions are simulations and never intercept real calls, SMS, or payments.