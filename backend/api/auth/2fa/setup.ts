// POST /api/auth/2fa/setup — Generate TOTP secret & QR URI (requires auth)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as OTPAuth from 'otpauth';
import { handleError, handlePreflight, methodNotAllowed } from '../../../lib/http.js';
import { auth } from '../../../lib/auth.js';
import { prisma } from '../../../lib/prisma.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);

  try {
    const user = await auth(req);

    // Generate a new TOTP secret
    const totp = new OTPAuth.TOTP({
      issuer: 'NoteMD',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: new OTPAuth.Secret({ size: 20 }),
    });

    // Save the secret (but don't enable 2FA yet — user must verify first)
    await prisma.user.update({
      where: { id: user.id },
      data: { totpSecret: totp.secret.base32 },
    });

    res.status(200).json({
      secret: totp.secret.base32,
      uri: totp.toString(), // otpauth:// URI for QR code
    });
  } catch (err) {
    handleError(res, err);
  }
}
