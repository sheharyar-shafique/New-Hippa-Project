// Express entry point — replaces `vercel dev` for local/standalone usage.
// All existing Vercel-style handlers are reused as-is.
import 'dotenv/config';
import express from 'express';

// ─── Import all route handlers ──────────────────────────────────────────
import authSignup from './api/auth/signup.js';
import authLogin from './api/auth/login.js';
import authMe from './api/auth/me.js';
import patientsIndex from './api/patients/index.js';
import patientById from './api/patients/[id].js';
import notesIndex from './api/notes/index.js';
import noteById from './api/notes/[id].js';
import visitsStart from './api/visits/start.js';
import visitsUploadUrl from './api/visits/upload-url.js';
import visitsGenerate from './api/visits/generate.js';
import labsAnalyze from './api/labs/analyze.js';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3000', 10);

// ─── Middleware ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// ─── Adapter ────────────────────────────────────────────────────────────
// Vercel handlers read dynamic segments from `req.query` (e.g. req.query.id).
// Express puts them in `req.params`. This adapter merges params → query so
// the existing handler code works unchanged.
function adapt(handler: Function) {
  return (req: express.Request, res: express.Response) => {
    if (req.params && Object.keys(req.params).length > 0) {
      (req as any).query = { ...req.query, ...req.params };
    }
    return handler(req, res);
  };
}

// ─── Routes ─────────────────────────────────────────────────────────────
// Auth
app.all('/api/auth/signup', adapt(authSignup));
app.all('/api/auth/login', adapt(authLogin));
app.all('/api/auth/me', adapt(authMe));

// Patients
app.all('/api/patients', adapt(patientsIndex));
app.all('/api/patients/:id', adapt(patientById));

// Notes (visits viewed as clinical notes)
app.all('/api/notes', adapt(notesIndex));
app.all('/api/notes/:id', adapt(noteById));

// Visits
app.all('/api/visits/start', adapt(visitsStart));
app.all('/api/visits/upload-url', adapt(visitsUploadUrl));
app.all('/api/visits/generate', adapt(visitsGenerate));

// Labs
app.all('/api/labs/analyze', adapt(labsAnalyze));

// ─── 404 fallback ───────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Start ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✅ NoteMD backend running at http://localhost:${PORT}\n`);
});
