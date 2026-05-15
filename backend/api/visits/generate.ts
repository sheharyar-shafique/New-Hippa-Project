// POST /api/visits/generate
// Body: { visitId, audioBucket, audioPath, durationSec?, mimeType? }
//
// Persists the audio location on the visit, generates a short-lived signed
// read URL, transcribes via Whisper, drafts SOAP + ICD-10 via Claude,
// saves the result, returns the updated visit.
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
import { getSignedReadUrl } from '../../lib/storage.js';
import { transcribeUrl } from '../../lib/whisper.js';

const Body = z.object({
  visitId: z.string().min(1),
  audioBucket: z.string().min(1),
  audioPath: z.string().min(1),
  durationSec: z.number().int().min(0).optional(),
  mimeType: z.string().optional(),
});

export const config = {
  // Whisper + Claude can take a while.
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

    // 1) Persist audio location on the visit row.
    await prisma.visit.update({
      where: { id: visit.id },
      data: {
        audioPath: body.audioPath,
        audioMimeType: body.mimeType,
        durationSec: body.durationSec,
      },
    });

    // 2) Generate a short-lived signed read URL and hand it to Whisper.
    const signedAudioUrl = await getSignedReadUrl(body.audioBucket, body.audioPath, 300);
    const lang = (visit.language === 'en' ? 'en' : 'es') as 'en' | 'es';
    const transcript = await transcribeUrl(signedAudioUrl, lang);
    if (!transcript || transcript.trim().length < 4) {
      throw new HttpError(422, 'Transcription returned empty text');
    }

    // 3) Draft the SOAP note.
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

    // 4) Save and return.
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
