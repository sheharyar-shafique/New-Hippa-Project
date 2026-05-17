import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { handleError, handlePreflight, methodNotAllowed, parseBody, requireEnv } from '../../lib/http.js';
import { signJwt, verifyPassword } from '../../lib/auth.js';
import { prisma } from '../../lib/prisma.js';

const Body = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const body = parseBody(Body, req.body);

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // If 2FA is enabled, return a short-lived temp token instead of a real JWT.
    // The client must call /auth/2fa/verify with this token + TOTP code.
    if (user.totpEnabled) {
      const secret = requireEnv('JWT_SECRET');
      const tempToken = jwt.sign(
        { sub: user.id, email: user.email, pending2fa: true },
        secret,
        { expiresIn: '5m' }
      );
      return res.status(200).json({
        requires2fa: true,
        tempToken,
      });
    }

    // No 2FA — issue a normal JWT
    const token = signJwt({ sub: user.id, email: user.email });
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        specialty: user.specialty,
        preferredLang: user.preferredLang,
        clinic: user.clinic,
        npi: user.npi,
      },
      token,
    });
  } catch (err) {
    handleError(res, err);
  }
}
