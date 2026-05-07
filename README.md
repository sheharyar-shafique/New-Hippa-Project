# MedScribe AI — Frontend MVP

A polished, HIPAA-positioned **AI medical scribe for internal medicine**. This is the
**frontend-only** MVP — designed for a client demo. All AI / transcription / persistence is mocked.

## What it shows

- **Landing page** — hero, internal-medicine positioning, lab-image analysis pitch, security
  posture, pricing, FAQ.
- **Auth** — beautiful sign-in / sign-up screens.
- **Dashboard** — recent notes, time-saved stats, today's schedule.
- **New consultation** — full recording UI (start / pause / stop, animated waveform, processing
  state, file upload fallback) wired to a mocked SOAP draft.
- **SOAP note detail** — editable Subjective / Objective / Assessment / Plan, ICD-10 suggestions,
  transcript view, "Ask MedScribe" decision-support panel.
- **Lab analysis** — upload a photo or PDF of a lab; the demo flow shows OCR confidence, an
  extracted results table, plain-language interpretation, ranked differentials, and next steps.
- **Patients** — searchable list with conditions and last visit.
- **Settings** — profile, HIPAA / BAA status, billing, templates, notifications.

## Answers the client's two questions

> _"Can the scribe understand and write with internal medicine terminology?"_
> Yes — the landing page leads with this; SOAP demo notes use IM-style language and ICD-10 codes.

> _"Can it accept pictures of labs and explain the results and possible conditions?"_
> Yes — `Lab analysis` has full upload → extract → interpret → differentials flow.

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (custom `brand` + `ink` palettes, soft shadows, fade-up / wave animations)
- **React Router v6**
- **lucide-react** icons

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Routes

| Route | Page |
| --- | --- |
| `/` | Landing |
| `/pricing` | Pricing & FAQ |
| `/login`, `/signup` | Auth |
| `/app` | Dashboard |
| `/app/new` | New consultation (recorder) |
| `/app/notes/:id` | SOAP note editor |
| `/app/labs` | Lab image analysis |
| `/app/patients` | Patient list |
| `/app/settings` | Settings (HIPAA, billing, etc.) |

## Project structure

```
src/
  main.tsx
  App.tsx
  index.css
  components/    # AppLayout, Logo, MarketingNav/Footer, StatusPill
  lib/           # utils + mockData (notes, patients, lab analysis)
  pages/         # Landing, Pricing, Login, Signup, Dashboard,
                 # NewConsultation, NoteDetail, LabAnalysis,
                 # Patients, Settings, NotFound
```

## Notes for backend integration

Mocked surfaces that will need real APIs later:

- `POST /api/visits` — start a visit, return `visitId`
- `POST /api/visits/:id/audio` — chunked audio upload (S3 presigned)
- `POST /api/visits/:id/generate` — returns SOAP + ICD-10 + transcript
- `POST /api/labs/analyze` — multipart image / PDF, returns OCR + interpretation
- `GET /api/patients`, `GET /api/notes`

All PHI flows must run inside the AWS HIPAA-eligible boundary under BAA.
