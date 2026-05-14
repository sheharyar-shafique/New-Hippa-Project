# NoteMD

**HIPAA-aligned, bilingual AI medical scribe for internal medicine.** Record a
visit, get a clean SOAP note in seconds. Snap a lab photo, get an interpretation.

Frontend (React + Vite + Tailwind) and serverless backend (Vercel Functions
+ Prisma/Postgres + Anthropic Claude + OpenAI Whisper) live in one repo.

## Architecture

```
Browser ─┬─►  Vite (React)                      ── pages, UI, ES/EN i18n
         │
         └─►  /api/* (Vercel Functions, Node)
                ├── auth/{signup,login,me}      ── JWT + bcrypt
                ├── patients, notes (CRUD)
                ├── visits/start                ── create visit row
                ├── visits/upload-url           ── signed Vercel Blob upload
                ├── visits/generate             ── Whisper → Claude → SOAP
                └── labs/analyze                ── Claude vision lab analysis

  Postgres (Prisma)   ← all PHI rows
  Vercel Blob         ← audio recordings + lab images
  Anthropic Claude    ← SOAP generation + lab interpretation
  OpenAI Whisper      ← audio → text
```

## Required environment variables

Copy `.env.example` → `.env` and fill in:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | https://neon.tech (free Postgres, ~30s signup) |
| `JWT_SECRET` | Any random 48+ char string (`node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`) |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com → API keys |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| `BLOB_READ_WRITE_TOKEN` | Vercel dashboard → Storage → Create Blob store → token |

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Fill in .env (see above)
cp .env.example .env  # edit with your keys

# 3. Push the Prisma schema to your database
npm run db:push

# 4. Start everything (Vite frontend + Vercel Functions backend)
npm i -g vercel       # one-time, if you don't have it
vercel link           # one-time, link to your Vercel project
vercel env pull       # syncs .env from Vercel (optional)
vercel dev            # serves at http://localhost:3000
```

Or run **frontend only** (no backend, useful for UI tweaks):

```bash
npm run dev           # http://localhost:5173, API calls will 404
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. https://vercel.com/new → **Import** the repo.
3. Add the 5 env vars under **Settings → Environment Variables**.
4. Hit **Deploy**. First build takes ~90 seconds.

`vercel.json` already configures:
- Framework: Vite
- SPA rewrites (React Router routes work on direct visits)
- 60s timeout for `/api/visits/generate` and `/api/labs/analyze`
- Long cache on `/assets/*`
- Security headers (X-Frame-Options, Permissions-Policy mic+camera, HSTS, etc.)

## Project layout

```
api/                # Vercel serverless functions
  auth/             # signup, login, me
  patients/         # list, create, get, update, delete
  notes/            # list, get, update
  visits/           # start, upload-url, generate (Whisper + Claude)
  labs/             # analyze (Claude vision)
lib/                # shared backend code
  prisma.ts         # singleton Prisma client
  auth.ts           # JWT helpers + auth() guard
  anthropic.ts      # Claude SDK wrapper (SOAP + vision)
  whisper.ts        # OpenAI Whisper transcription
  storage.ts        # Vercel Blob signed-upload + base64 fetch
  prompts.ts        # SOAP + lab system prompts
  http.ts           # CORS, error handling, zod parsing
prisma/
  schema.prisma     # User, Patient, Visit, LabAnalysis
src/                # React frontend
  pages/            # Landing, Login, Signup, Dashboard, NewConsultation,
                    # NoteDetail, LabAnalysis, Patients, Settings, ...
  components/       # AppLayout, Logo, Brandify, StatusPill, ...
  lib/
    api.ts          # fetch wrapper + domain types
    AuthProvider.tsx# auth context + RequireAuth guard
    utils.ts
  i18n/             # ES + EN dictionaries, useT() hook
public/
  logo.png          # drop your NoteMD logo here (image fallback to wordmark)
.env.example
vercel.json
```

## What's real now

- **Auth** — real signup/login with bcrypt + JWT; data persists in Postgres.
- **Patients** — CRUD with search.
- **Recording** — real `MediaRecorder` audio capture, direct upload to Vercel
  Blob, Whisper transcription, Claude SOAP draft, structured ICD-10 codes.
- **Lab analysis** — real upload, Claude vision OCR + clinical interpretation
  + ranked differentials, returned in the user's preferred language.
- **All mock data removed.** Every page reads/writes through the API.

## Roadmap toward production HIPAA

The architecture is HIPAA-aligned today. To call yourself **HIPAA-compliant** for
real patient data, you'll need:

1. **Sign the BAA** with Anthropic, OpenAI, and Vercel (or move to AWS Bedrock
   under your AWS BAA — same code, swap the SDK).
2. **Risk assessment** by a third-party (Vanta, Drata, Compliancy Group).
3. **Workforce training** + written policies (breach notification, access control).
4. **Sign BAAs with clinic customers** before they put PHI in.

## License

Proprietary. © NoteMD.
