import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { handleError, handlePreflight, methodNotAllowed, parseBody } from '../../lib/http.js';
import { hashPassword, signJwt } from '../../lib/auth.js';
import { prisma } from '../../lib/prisma.js';

const Body = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  specialty: z.string().default('Internal Medicine'),
  preferredLang: z.enum(['en', 'es']).default('es'),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const body = parseBody(Body, req.body);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
        firstName: body.firstName,
        lastName: body.lastName,
        specialty: body.specialty,
        preferredLang: body.preferredLang,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        specialty: true,
        preferredLang: true,
        clinic: true,
        npi: true,
      },
    });

    const token = signJwt({ sub: user.id, email: user.email });
    res.status(201).json({ user, token });
  } catch (err) {
    handleError(res, err);
  }
}
