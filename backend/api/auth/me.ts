import type { VercelRequest, VercelResponse } from '@vercel/node';
import { auth } from '../../lib/auth.js';
import { handleError, handlePreflight, methodNotAllowed } from '../../lib/http.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const user = await auth(req);
    res.status(200).json({ user });
  } catch (err) {
    handleError(res, err);
  }
}
