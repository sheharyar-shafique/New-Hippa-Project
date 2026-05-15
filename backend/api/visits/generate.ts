// POST /api/visits/generate
// Body: { visitId, audioUrl, durationSec, mimeType }
// Saves the audio URL on the visit, transcribes via Whisper, runs Claude
// to draft the SOAP note + ICD-10 codes, persists everything, and returns
// the updated visit.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { auth } from '../../lib/auth.js';
import { generateSoap } from '../../lib/anthropic.js';
import {
  handleError,
  handlePreflight,
  HttpError,
  methodNotAllowed,
  parseBody,
} from '../../lib/http.js';
import { prisma } from '../../lib/prisma.js';
import { transcribeUrl } from '../../lib/whisper.js';

const Body = z.object({
  visitId: z.string().min(1),
  audioUrl: z.string().url(),
  durationSec: z.number().int().min(0).optional(),
  mimeType: z.string().optional(),
});

export const config = {
  // Audio transcription + Claude can take a while; bump default timeout.
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const user = await auth(req);
    const body = parseBody(Body, req.body);

    const visit = await prisma.visit.findFirst({
      where: { id: body.visitId, doctorId: user.id },
      include: { patient: true },
    });
    if (!visit) throw new HttpError(404, 'Visit not found');

    // Step 1 — persist audio location.
    await prisma.visit.update({
      where: { id: visit.id },
      data: {
        audioUrl: body.audioUrl,
        audioMimeType: body.mimeType,
        durationSec: body.durationSec,
      },
    });

    // Step 2 — transcribe audio.
    const lang = (visit.language === 'en' ? 'en' : 'es') as 'en' | 'es';
    const transcript = await transcribeUrl(body.audioUrl, lang);
    if (!transcript || transcript.trim().length < 4) {
      throw new HttpError(422, 'Transcription returned empty text');
    }

    // Step 3 — generate SOAP note.
    const soap = await generateSoap({
      transcript,
      lang,
      patient: {
        name: visit.patient.name,
        age: visit.patient.age,
        sex: visit.patient.sex,
        conditions: visit.patient.conditions,
      },
    });

    // Step 4 — save and return.
    const updated = await prisma.visit.update({
      where: { id: visit.id },
      data: {
        transcript,
        chiefComplaint: soap.chiefComplaint,
        subjective: soap.subjective,
        objective: soap.objective,
        assessment: soap.assessment,
        plan: soap.plan,
        icd10Codes: soap.icd10 as any,
        status: 'draft',
      },
      include: { patient: true },
    });

    res.status(200).json({ visit: updated });
  } catch (err) {
    handleError(res, err);
  }
}
