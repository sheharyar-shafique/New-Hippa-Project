// POST /api/auth/2fa/verify — Verify TOTP during login (exchanges temp token for full token)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import * as OTPAuth from 'otpauth';
import { handleError, handlePreflight, methodNotAllowed, parseBody, requireEnv, HttpError } from '../../../lib/http.js';
import { signJwt } from '../../../lib/auth.js';
import { prisma } from '../../../lib/prisma.js';
import jwt from 'jsonwebtoken';

const Body = z.object({
  tempToken: z.string().min(1),
  code: z.string().length(6),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const { tempToken, code } = parseBody(Body, req.body);

    // Verify the temporary token
    const secret = requireEnv('JWT_SECRET');
    let payload: { sub: string; email: string; pending2fa: boolean };
    try {
      payload = jwt.verify(tempToken, secret) as any;
    } catch {
      throw new HttpError(401, 'Invalid or expired token');
    }
    if (!payload.pending2fa) {
      throw new HttpError(400, 'Token is not a 2FA pending token');
    }

    // Load user and check TOTP
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        specialty: true, preferredLang: true, clinic: true, npi: true,
        totpSecret: true, totpEnabled: true,
      },
    });
    if (!user || !user.totpEnabled || !user.totpSecret) {
      throw new HttpError(400, '2FA is not enabled for this account');
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'NoteMD',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.totpSecret),
    });

    const delta = totp.validate({ token: code, window: 1 });
    if (delta === null) {
      return res.status(400).json({ error: 'Invalid code. Please try again.' });
    }

    // Issue a real JWT
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
