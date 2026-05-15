import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { auth } from '../../lib/auth.js';
import { handleError, handlePreflight, methodNotAllowed, parseBody } from '../../lib/http.js';
import { prisma } from '../../lib/prisma.js';

const CreateBody = z.object({
  name: z.string().min(1).max(120),
  age: z.number().int().min(0).max(130),
  sex: z.enum(['M', 'F', 'X']),
  mrn: z.string().max(60).optional().nullable(),
  conditions: z.array(z.string()).default([]),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;

  try {
    const user = await auth(req);

    if (req.method === 'GET') {
      const patients = await prisma.patient.findMany({
        where: { doctorId: user.id },
        orderBy: { updatedAt: 'desc' },
      });
      return res.status(200).json({ patients });
    }

    if (req.method === 'POST') {
      const body = parseBody(CreateBody, req.body);
      const patient = await prisma.patient.create({
        data: { ...body, doctorId: user.id },
      });
      return res.status(201).json({ patient });
    }

    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (err) {
    handleError(res, err);
  }
}
