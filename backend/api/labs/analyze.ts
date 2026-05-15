// POST /api/labs/analyze
// Body: { imageBucket, imagePath, language?, patientId? }
//
// Downloads the image bytes from Supabase Storage, hands them to Claude
// Vision (inline base64), persists the analysis row, returns it.
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
import { downloadAsBase64 } from '../../lib/storage.js';

const Body = z.object({
  imageBucket: z.string().min(1),
  imagePath: z.string().min(1),
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

    // Fetch bytes from Supabase Storage and pass as inline base64 to Claude.
    // Claude vision accepts JPG/PNG/WEBP/HEIC; PDFs aren't supported directly.
    const { base64, mimeType } = await downloadAsBase64(body.imageBucket, body.imagePath);
    if (!mimeType.startsWith('image/')) {
      return res.status(415).json({
        error:
          'Only image formats are supported (JPG, PNG, WEBP, HEIC).',
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
        imagePath: body.imagePath,
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
