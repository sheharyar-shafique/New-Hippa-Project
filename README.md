# NoteMD — Frontend MVP

A polished, **HIPAA-compliant AI medical scribe for internal medicine**, with full
**Spanish + English** support. This is the frontend MVP (Vite + React + TypeScript +
Tailwind) — designed for a client demo. All AI / transcription / persistence is mocked.

## Highlights

- **NoteMD branding** — green medical-cross + pen logo, bilingual wordmark.
- **Internal-medicine fluency** — SOAP notes, ICD-10/CPT helpers, IM-specific copy.
- **Lab image analysis** — upload a photo or PDF of a lab; OCR + plain-language
  interpretation + ranked differentials. Available in both languages.
- **i18n with persistent toggle** — defaults to Spanish (auto-detects English browsers
  on first load); toggle between **ES / EN** is in every nav bar; preference is
  stored in `localStorage`.

## What it shows

- **Landing page** — hero, internal-medicine positioning, lab-image analysis pitch,
  security posture, pricing, FAQ.
- **Auth** — beautiful sign-in / sign-up screens, language toggle inline.
- **Dashboard** — recent notes, time-saved stats, today's schedule.
- **New consultation** — full recording UI (start / pause / stop, animated waveform,
  processing state, file upload fallback) wired to a mocked SOAP draft.
- **SOAP note detail** — editable Subjective / Objective / Assessment / Plan with
  bilingual content per section, ICD-10 suggestions (translated), transcript,
  "Ask NoteMD" decision-support panel.
- **Lab analysis** — upload a photo or PDF of a lab; the demo flow shows OCR
  confidence, an extracted results table, plain-language interpretation, ranked
  differentials, and next steps — all bilingual.
- **Patients** — searchable list with conditions and last visit.
- **Settings** — profile, HIPAA / BAA status, billing, templates, notifications.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** with NoteMD-green palette and soft shadows
- **React Router v6**
- **lucide-react** icons
- Custom lightweight **i18n** layer (no external deps) with a Context provider, a
  `useT()` hook, and a `LanguageToggle` component.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Deploy to Netlify

This repo is wired up for Netlify out of the box.

**One-click (Git):**
1. Log in at https://app.netlify.com
2. **Add new site → Import an existing project → GitHub**
3. Pick `New-Hippa-Project`
4. Netlify will auto-detect the settings from `netlify.toml` (Node 20, `npm run build`,
   publish `dist`).
5. **Deploy** — first build takes ~1–2 min.

**CLI (alternative):**
```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --build --prod
```

## Project structure

```
src/
  main.tsx
  App.tsx
  index.css
  i18n/
    translations.ts       # ES + EN dictionaries (one source of truth)
    LanguageProvider.tsx  # Context, useT(), useLang()
  components/             # AppLayout, Logo, MarketingNav/Footer, StatusPill,
                          # LanguageToggle
  lib/                    # utils + bilingual mockData (notes, patients, labs)
  pages/                  # Landing, Pricing, Login, Signup, Dashboard,
                          # NewConsultation, NoteDetail, LabAnalysis,
                          # Patients, Settings, NotFound
```

## Notes for backend integration

Mocked surfaces that will need real APIs later:

- `POST /api/visits` — start a visit, return `visitId`
- `POST /api/visits/:id/audio` — chunked audio upload (S3 presigned)
- `POST /api/visits/:id/generate?lang=es|en` — returns SOAP + ICD-10 + transcript
- `POST /api/labs/analyze?lang=es|en` — multipart image / PDF, returns OCR +
  interpretation
- `GET /api/patients`, `GET /api/notes`

All PHI flows must run inside the AWS HIPAA-eligible boundary under BAA.
