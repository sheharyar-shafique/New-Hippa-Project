import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { auth } from '../../lib/auth.js';
import { handleError, handlePreflight, HttpError, methodNotAllowed, parseBody } from '../../lib/http.js';
import { prisma } from '../../lib/prisma.js';

const UpdateBody = z.object({
  name: z.string().min(1).max(120).optional(),
  age: z.number().int().min(0).max(130).optional(),
  sex: z.enum(['M', 'F', 'X']).optional(),
  mrn: z.string().max(60).nullable().optional(),
  conditions: z.array(z.string()).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    const user = await auth(req);
    const id = String(req.query.id ?? '');
    if (!id) throw new HttpError(400, 'Missing patient id');

    const patient = await prisma.patient.findFirst({
      where: { id, doctorId: user.id },
    });
    if (!patient) throw new HttpError(404, 'Patient not found');

    if (req.method === 'GET') {
      return res.status(200).json({ patient });
    }

    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = parseBody(UpdateBody, req.body);
      const updated = await prisma.patient.update({
        where: { id },
        data: body,
      });
      return res.status(200).json({ patient: updated });
    }

    if (req.method === 'DELETE') {
      await prisma.patient.delete({ where: { id } });
      return res.status(204).end();
    }

    return methodNotAllowed(res, ['GET', 'PATCH', 'PUT', 'DELETE']);
  } catch (err) {
    handleError(res, err);
  }
}
