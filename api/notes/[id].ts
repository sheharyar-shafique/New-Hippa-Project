import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { auth } from '../../lib/auth.js';
import { handleError, handlePreflight, HttpError, methodNotAllowed, parseBody } from '../../lib/http.js';
import { prisma } from '../../lib/prisma.js';

const UpdateBody = z.object({
  chiefComplaint: z.string().optional(),
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  status: z.enum(['draft', 'finalized', 'signed']).optional(),
  icd10Codes: z
    .array(z.object({ code: z.string(), label: z.string() }))
    .optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    const user = await auth(req);
    const id = String(req.query.id ?? '');
    if (!id) throw new HttpError(400, 'Missing note id');

    const note = await prisma.visit.findFirst({
      where: { id, doctorId: user.id },
      include: { patient: true },
    });
    if (!note) throw new HttpError(404, 'Note not found');

    if (req.method === 'GET') {
      return res.status(200).json({ note });
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = parseBody(UpdateBody, req.body);
      const updated = await prisma.visit.update({
        where: { id },
        data: { ...body, icd10Codes: body.icd10Codes ?? undefined },
        include: { patient: true },
      });
      return res.status(200).json({ note: updated });
    }

    if (req.method === 'DELETE') {
      await prisma.visit.delete({ where: { id } });
      return res.status(204).end();
    }

    return methodNotAllowed(res, ['GET', 'PATCH', 'PUT', 'DELETE']);
  } catch (err) {
    handleError(res, err);
  }
}
