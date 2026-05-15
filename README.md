# NoteMD

HIPAA-aligned, bilingual (Spanish + English) AI medical scribe for internal medicine.
Records consultations → drafts SOAP notes → suggests ICD-10 codes → analyses
lab images. Built around how internists actually document.

## Repo layout

```
.
├── frontend/      Vite + React + TS + Tailwind UI (deploys as a static site)
└── backend/       Vercel Serverless Functions (TypeScript) + Prisma + Supabase
```

Frontend and backend are two independent Vercel projects pointing at the
same GitHub repo, each with its own **Root Directory**:

| Vercel project   | Root Directory | Becomes              |
| ---------------- | -------------- | -------------------- |
| `notemd`         | `frontend`     | `notemd.vercel.app`  |
| `notemd-api`     | `backend`      | `notemd-api.vercel.app` |

The frontend talks to the backend via `VITE_API_BASE` (set in the frontend's
Vercel project env vars).

## Stack

**Frontend**
- Vite + React 18 + TypeScript + Tailwind CSS
- React Router v6
- Custom i18n (ES default, EN toggle, persisted)
- `@vercel/blob` for direct-to-storage uploads

**Backend** (Vercel Serverless Functions)
- Prisma ORM + Supabase Postgres
- JWT auth (bcrypt + jsonwebtoken)
- Anthropic Claude — SOAP notes + lab image interpretation
- OpenAI Whisper — audio transcription
- Vercel Blob — encrypted audio + lab image storage
- Zod request validation

## What you need to get from me (env vars)

### Backend (`backend/.env`)

| Variable                 | Where to get it                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | Supabase → Connect → ORMs → Prisma → **Transaction pooler** URL (port 6543)              |
| `DIRECT_URL`             | Supabase → Connect → ORMs → Prisma → **Direct connection** URL (port 5432)               |
| `JWT_SECRET`             | Any 48+ char random string. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"` |
| `ANTHROPIC_API_KEY`      | https://console.anthropic.com → API keys                                                 |
| `OPENAI_API_KEY`         | https://platform.openai.com/api-keys                                                     |
| `BLOB_READ_WRITE_TOKEN`  | Vercel dashboard → Storage → Create Blob Store → copy the RW token                       |
| `ALLOWED_ORIGIN`         | Your frontend URL — comma-separate multiple (e.g. `https://notemd.vercel.app,http://localhost:5173`) |

### Frontend (`frontend/.env`)

| Variable            | Value                                                                |
| ------------------- | -------------------------------------------------------------------- |
| `VITE_API_BASE`     | Your backend URL + `/api` (e.g. `https://notemd-api.vercel.app/api`) |
| `VITE_DEFAULT_LANG` | `es` (default) or `en`                                               |

---

## Set up Supabase (one-time, ~2 minutes)

1. Sign up / sign in at **https://supabase.com** → **New project**
2. Pick a project name, a **strong database password** (save it — you'll need it
   in the URLs), and a region close to your Vercel region.
3. Wait ~60 seconds for the project to provision.
4. Top of the dashboard → click **Connect** → **ORMs** tab → **Prisma**
5. Copy both the **transaction pooler** URL and the **direct connection** URL.
   Replace `[YOUR-PASSWORD]` in each with the password you set in step 2.
6. Paste them into `backend/.env` as `DATABASE_URL` and `DIRECT_URL` respectively.

> No additional Supabase keys needed — we use Postgres directly via Prisma.
> Auth is JWT-based on our own backend, and file storage is Vercel Blob.

## Run locally

```bash
# 1. Backend
cd backend
cp .env.example .env          # fill in real values
npm install
npm run db:push               # create the tables in Supabase
npm run dev                   # vercel dev — defaults to http://localhost:3000

# 2. Frontend (in a second terminal)
cd frontend
cp .env.example .env          # set VITE_API_BASE=http://localhost:3000/api
npm install
npm run dev                   # vite — defaults to http://localhost:5173
```

Open http://localhost:5173 — sign up, then start using the app.

## Deploy

### Backend
1. https://vercel.com/new → import the GitHub repo
2. **Root Directory:** `backend`
3. **Framework Preset:** Other
4. Add all `backend/.env` variables in **Environment Variables**
5. Deploy
6. After deploy, run migrations once: in **Deployments → … → Redeploy → run
   `npm run db:push`** (or run it locally pointing at the prod `DATABASE_URL`)

### Frontend
1. https://vercel.com/new → import the GitHub repo again (same repo, second project)
2. **Root Directory:** `frontend`
3. Vercel auto-detects Vite
4. Add `VITE_API_BASE=https://YOUR-BACKEND.vercel.app/api` in env vars
5. Deploy
6. Copy the deployed frontend URL and add it to the backend's `ALLOWED_ORIGIN` env

## API surface (backend)

```
POST   /api/auth/signup        { firstName, lastName, email, password, specialty?, preferredLang? }
POST   /api/auth/login         { email, password }
GET    /api/auth/me

GET    /api/patients
POST   /api/patients           { name, age, sex, mrn?, conditions? }
GET    /api/patients/[id]
PATCH  /api/patients/[id]
DELETE /api/patients/[id]

GET    /api/notes
GET    /api/notes/[id]
PATCH  /api/notes/[id]         (update SOAP sections, status, icd10Codes)

POST   /api/visits/start       { patientId, visitType, language }      → visit row
POST   /api/visits/upload-url  signed direct-upload tokens (audio + lab)
POST   /api/visits/generate    { visitId, audioUrl, durationSec? }     → SOAP + ICD-10

POST   /api/labs/analyze       { imageUrl, language }                  → interpretation + differentials
```

All authed endpoints require `Authorization: Bearer <JWT>` from `/api/auth/login`.

## Architecture notes (for the HIPAA-aligned roadmap)

- All PHI is encrypted in transit (HTTPS / TLS 1.2+) and at rest (Supabase +
  Vercel Blob encrypt by default). Audio + lab images live in Vercel Blob; only
  signed URLs are stored in Postgres.
- Auth tokens are JWTs with configurable expiry; we never store plaintext
  passwords (bcrypt hashing with cost 12).
- For a real HIPAA-compliant production deployment you'd:
  1. Sign a BAA with each subprocessor: AWS (Supabase runs on AWS), Vercel,
     Anthropic, OpenAI.
  2. Enable Supabase point-in-time recovery + row-level security policies.
  3. Move storage from Vercel Blob → AWS S3 under BAA, or use Supabase Storage.
  4. Complete a third-party HIPAA risk assessment.
  5. Sign a BAA with every clinic that uses NoteMD.

## License

Proprietary — © 2026 NoteMD. All rights reserved.
