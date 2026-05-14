// Issues a signed Vercel Blob upload token so the browser can upload audio
// (or a lab image) directly, bypassing the 4.5 MB function body limit.
// The browser uses `@vercel/blob/client`'s `upload()` helper which POSTs here.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { HandleUploadBody } from '@vercel/blob/client';
import { auth } from '../../lib/auth.js';
import { handleError, handlePreflight, methodNotAllowed } from '../../lib/http.js';
import { issueUploadToken } from '../../lib/storage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const user = await auth(req);
    const kind = (req.query.kind === 'lab' ? 'lab' : 'audio') as 'audio' | 'lab';
    const jsonResponse = await issueUploadToken({
      body: req.body as HandleUploadBody,
      userId: user.id,
      kind,
    });
    res.status(200).json(jsonResponse);
  } catch (err) {
    handleError(res, err);
  }
}
