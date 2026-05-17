// POST /api/auth/2fa/enable — Verify a TOTP code and enable 2FA
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import * as OTPAuth from 'otpauth';
import { handleError, handlePreflight, methodNotAllowed, parseBody } from '../../../lib/http.js';
import { auth } from '../../../lib/auth.js';
import { prisma } from '../../../lib/prisma.js';

const Body = z.object({
  code: z.string().length(6),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const user = await auth(req);
    const { code } = parseBody(Body, req.body);

    // Load the secret from DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { totpSecret: true },
    });
    if (!dbUser?.totpSecret) {
      return res.status(400).json({ error: 'Run /2fa/setup first' });
    }

    const totp = new OTPAuth.TOTP({
      issuer: 'NoteMD',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(dbUser.totpSecret),
    });

    const delta = totp.validate({ token: code, window: 1 });
    if (delta === null) {
      return res.status(400).json({ error: 'Invalid code. Please try again.' });
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: { totpEnabled: true },
    });

    res.status(200).json({ enabled: true });
  } catch (err) {
    handleError(res, err);
  }
}
