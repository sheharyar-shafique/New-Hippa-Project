import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { auth } from '../../lib/auth.js';
import { handleError, handlePreflight, HttpError, methodNotAllowed, parseBody } from '../../lib/http.js';
import { prisma } from '../../lib/prisma.js';

const Body = z.object({
  patientId: z.string().min(1),
  visitType: z.enum(['In-clinic', 'Telehealth', 'Home']).default('In-clinic'),
  template: z.string().optional(),
  language: z.enum(['en', 'es']).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const user = await auth(req);
    const body = parseBody(Body, req.body);

    const patient = await prisma.patient.findFirst({
      where: { id: body.patientId, doctorId: user.id },
    });
    if (!patient) throw new HttpError(404, 'Patient not found');

    const visit = await prisma.visit.create({
      data: {
        doctorId: user.id,
        patientId: body.patientId,
        visitType: body.visitType,
        template: body.template,
        language: body.language ?? user.preferredLang,
        status: 'draft',
      },
      include: { patient: true },
    });

    res.status(201).json({ visit });
  } catch (err) {
    handleError(res, err);
  }
}
