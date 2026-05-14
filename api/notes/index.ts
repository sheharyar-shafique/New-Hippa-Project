import type { VercelRequest, VercelResponse } from '@vercel/node';
import { auth } from '../../lib/auth.js';
import { handleError, handlePreflight, methodNotAllowed } from '../../lib/http.js';
import { prisma } from '../../lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);

  try {
    const user = await auth(req);
    const limit = Math.min(Number(req.query.limit ?? 50), 100);
    const notes = await prisma.visit.findMany({
      where: { doctorId: user.id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { patient: { select: { id: true, name: true, age: true, sex: true } } },
    });
    res.status(200).json({ notes });
  } catch (err) {
    handleError(res, err);
  }
}
