# VAANISHIELD Frontend

Polished, interactive voice-impersonation defense website — Next.js 16 + TypeScript + Tailwind v4, built for a Smart India Hackathon 2026 jury demo.

Live at `http://localhost:3000`.

## Connected experiences

**1. Product landing page (`/`)** — the "when a voice can be cloned, voice alone cannot be trusted" hero with a state-aware **Live Guard** instrument panel (scan ring, navy shield + risk score, animated waveform, interactive Voice / Identity / Intent / Risk nodes), a **Product Tour** first-run stepper, an interactive **Layer Stepper** (91% synthetic / 23% similarity / High financial request / Critical overall risk), a clickable detection-to-prevention pipeline, a comparison against basic deepfake detectors, an India-focused language roadmap, and a final CTA into the console.

**2. Live console (`/demo`)** — a **3-stage decision-first workspace**: *Prepare* (scenario selector → audio upload with drag-drop / browse / mic recording / optional reference identity) → *Analyze* (streaming signal board where voice authenticity and identity run in parallel, a live event timeline, and a streaming transcript with risk-term highlighting) → *Decide* (animated risk gauge + count-up, evidence cards, and an adaptive verification stepper). A sticky secondary panel holds a windowed **Live Guard**, a safety verdict snapshot, an **Advanced & settings** drawer (run-mode tabs, backend status from `GET /health`, recent analyses), and the prototype notice.

**3. How it works (`/how-it-works`)** — a deep interactive walkthrough of the four intelligence layers and the pipeline.

**4. Insights (`/insights`)** — a local-only dashboard of your analysis history (stats, risk distribution, recent analyses with replay), persisted in `localStorage`.

## What the demo shows

VAANISHIELD is **not** a binary real/fake audio classifier. It combines **four signals**:

1. **Voice Authenticity** — synthetic voice probability (wav2vec2, fine-tuned)
2. **Identity Verification** — speaker similarity vs. a claimed reference voice (ECAPA-TDNN)
3. **Speech-to-Text + Intent** — transcript plus scam-pressure flags (OTP, financial request, urgency, authority claim, secrecy)
4. **Unified Risk Engine** — weighted, explainable risk score + tier + plain-language response

When risk is High or Critical, an **Adaptive Verification stepper** drops in: pick a channel (verification phrase, trusted contact, secondary channel, registered device), watch the *simulated* out-of-band confirmation, then resolve with **Mark as Verified / Keep Interaction Blocked / Dismiss Warning**. For Critical, the UI emphasizes **never share OTPs, passwords, or money** before independent verification. All interception, messaging, and financial blocking actions are **simulated prototype actions** — no real telecom/SMS/financial operations are performed.

Live Guard transitions mirror the analysis lifecycle: idle → scanning → low / medium / high / critical / error, so the sidebar instrument always reflects what the pipeline is doing.

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
2. Confirm the **Demo Mode** toggle in the Advanced drawer (default).
3. Pick any scenario card, click **Load Scenario**, then **Analyze Voice Interaction**.
4. Demo results are labeled **Demo Scenario** so judges can distinguish mock data from real inference.
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
    how-it-works/page.tsx  interactive layers + pipeline walkthrough
    insights/page.tsx      analysis history + system insights
    globals.css       VAANISHIELD light theme tokens, motion, reduced-motion support
  components/
    site-navbar.tsx        landing nav (drawer on mobile)
    hero-section.tsx       headline + eyebrow + Live Guard + CTAs
    live-guard-widget.tsx  state-aware instrument panel (shield, 4 layer nodes, risk score)
    product-tour.tsx       interactive 4-step first-run walkthrough + Live Guard preview
    layer-stepper.tsx      interactive four-layer explanation with example outputs
    problem-section.tsx    voice-cloning problem + core quote
    pipeline-visual.tsx    clickable detection → prevention pipeline
    comparison-section.tsx capability-row table vs basic deepfake detector
    languages-section.tsx  India language roadmap (honest status, network layout)
    final-cta.tsx          CTA into the live demo
    footer.tsx             limitation + project info
    demo-shell.tsx         console orchestrator (mode, state, 3-stage stepper, layout)
    scenario-selector.tsx  four selectable scenario cards with Load Scenario buttons
    audio-upload.tsx       drag-drop, browse, mic recording, collapsible reference identity
    audio-visualizer.tsx   animated waveform + play/pause/restart/delete + record
    analysis-pipeline.tsx  horizontal tracker (desktop) / vertical timeline (mobile)
    streaming-analysis-board.tsx  live 4-signal board, voice/identity run in parallel
    analysis-timeline.tsx  streaming event feed (voice/identity/intent/risk tagged)
    streaming-transcript.tsx  live transcript with risk-term highlighting
    risk-gauge.tsx         animated circular 0–100 gauge
    risk-result.tsx        score hero + recommendation + reasons + critical OTP warning
    voice-authenticity-card.tsx / identity-card.tsx / intent-card.tsx / risk-engine-card.tsx
    verification-panel.tsx adaptive verification stepper with simulated confirmation
    analysis-history.tsx   localStorage recent analyses with replay
    evidence-card.tsx      shared expandable card shell + meters
    status-badge.tsx       status / tier / live indicators
    insights-client.tsx    client insights dashboard (stats, risk distribution, history)
    toast-provider.tsx     toast notifications + context
    reveal.tsx             scroll-reveal wrapper
  hooks/
    use-analysis.ts        streaming simulation, demo/API split, timeline, history, Live Guard state
  lib/
    types.ts               shared response + UI types + TimelineEvent + AnalysisState
    api-client.ts          dedicated backend client + response sanitization
    demo-scenarios.ts      scenario configs, mocked responses, streaming event schedules
    risk-utils.ts          score normalization, tier metadata, risk-term highlighting
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

Clean light-theme product experience with an electric blue → indigo accent and per-tier status colors:

- Page `#F5F8FC` / Surface `#FFFFFF` / Soft blue `#EEF6FF` / Border soft slate
- Navy text `#102A43` (deep navy `#102A43`) · Secondary `#486581` · Muted `#829AB1`
- Primary `#1565D8` · Blue `#2F80ED` · Cyan `#00A7C7` · Indigo `#5B5FEF`
- Low `#159A6B` · Medium `#D97706` · High `#EA6A00` · Critical `#D92D4F`

White `.card-surface` panels with soft borders and layered shadows, and short purposeful animations (scan ring, waveform bounce, sweep, pulse, entrance rise). All motion respects `prefers-reduced-motion`.

Layout is centralized in `globals.css` tokens:

- `--content-max-width: 1280px` with 16/24/32px side padding (the `.vn-container` class applies one shared edge to navbar, hero, every section, CTA, footer, and the demo console).
- `.vn-section` gives a 40/56/80px vertical rhythm (mobile/tablet/desktop).
- Card radius `20px`, small radius `12px`, 48px control height, 24px (desktop) / 16px (mobile) grid gap.
- The **Live Guard** is a self-contained instrument panel: a status badge, an incoming Voice Signal feed, a scan ring around a navy shield with the risk score inside, four interactive layer nodes (Voice / Identity / Intent / Risk), and a fixed-height signal readout that updates on hover/focus/click. Node clicks open the related evidence card; the Critical state locks onto the threat and shows a **Verify caller** action. All motion is transform/opacity driven with a stable layout height.

## Lint / build checks

```bash
npm run lint
npm run build
```

## Honest positioning

VAANISHIELD provides **probabilistic risk assessment** — it is not a final determination of authenticity or identity, and it does not claim 100% accuracy. Scores are risk indicators, not guaranteed truth. Verification actions, interception, and messaging are simulations and never intercept real calls, SMS, or payments.