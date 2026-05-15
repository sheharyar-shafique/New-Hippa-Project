// POST /api/visits/upload-url
// Body: { filename, contentType?, kind?: "audio" | "lab" }
// Query: ?kind=lab  (alternative to body.kind)
//
// Returns a one-time Supabase Storage signed upload URL the browser can
// PUT to directly. Audio/image bytes never pass through this function.
//
// Response: { bucket, path, signedUrl, token, maxBytes }
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { auth } from '../../lib/auth.js';
import {
  handleError,
  handlePreflight,
  methodNotAllowed,
  parseBody,
} from '../../lib/http.js';
import { createSignedUpload, UploadKind } from '../../lib/storage.js';

const Body = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1).max(255).optional(),
  kind: z.enum(['audio', 'lab']).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const user = await auth(req);
    const body = parseBody(Body, req.body ?? {});
    const kind: UploadKind = body.kind ?? (req.query.kind === 'lab' ? 'lab' : 'audio');
    const upload = await createSignedUpload({
      kind,
      userId: user.id,
      filename: body.filename,
      contentType: body.contentType,
    });
    res.status(200).json(upload);
  } catch (err) {
    handleError(res, err);
  }
}
