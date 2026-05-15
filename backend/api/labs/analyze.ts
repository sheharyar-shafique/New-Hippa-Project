// POST /api/labs/analyze
// Body: { imageUrl, language?, patientId? }
// Calls Claude vision to extract values + interpret + suggest differentials.
// Persists the analysis row and returns it.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { auth } from '../../lib/auth.js';
import { analyzeLabImage } from '../../lib/anthropic.js';
import {
  handleError,
  handlePreflight,
  methodNotAllowed,
  parseBody,
} from '../../lib/http.js';
import { prisma } from '../../lib/prisma.js';
import { fetchAsBase64 } from '../../lib/storage.js';

const Body = z.object({
  imageUrl: z.string().url(),
  patientId: z.string().optional().nullable(),
  language: z.enum(['en', 'es']).optional(),
});

export const config = {
  maxDuration: 60,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const user = await auth(req);
    const body = parseBody(Body, req.body);

    const lang = (body.language ?? user.preferredLang) === 'en' ? 'en' : 'es';

    // Fetch the image bytes from blob storage and pass to Claude as base64.
    // PDFs aren't supported by Claude vision directly — clients should
    // upload an image. (Future: convert PDF page 1 to image server-side.)
    const { base64, mimeType } = await fetchAsBase64(body.imageUrl);
    if (!mimeType.startsWith('image/')) {
      return res.status(415).json({
        error: 'Only image formats are supported for direct analysis. Please upload JPG, PNG, WEBP, or HEIC.',
      });
    }

    const analysis = await analyzeLabImage({
      imageBase64: base64,
      mimeType,
      lang,
    });

    const saved = await prisma.labAnalysis.create({
      data: {
        doctorId: user.id,
        patientId: body.patientId ?? null,
        imageUrl: body.imageUrl,
        language: lang,
        panel: analysis.panel,
        ocrConfidence: analysis.ocrConfidence,
        results: analysis.results as any,
        interpretation: analysis.interpretation,
        differentials: analysis.differentials as any,
        nextSteps: analysis.nextSteps as any,
      },
    });

    res.status(200).json({ analysis: saved });
  } catch (err) {
    handleError(res, err);
  }
}
