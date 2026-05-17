// JWT + password helpers and an `auth()` function that extracts the
// authenticated user from a Vercel API request (or throws 401).
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { VercelRequest } from '@vercel/node';
import { HttpError, requireEnv } from './http.js';
import { prisma } from './prisma.js';

const SALT_ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export type JwtPayload = { sub: string; email: string };

export function signJwt(payload: JwtPayload): string {
  const secret = requireEnv('JWT_SECRET');
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

export function verifyJwt(token: string): JwtPayload {
  const secret = requireEnv('JWT_SECRET');
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    if (!decoded?.sub) throw new Error('Invalid token payload');
    return decoded;
  } catch (e) {
    throw new HttpError(401, 'Invalid or expired token');
  }
}

export type AuthedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialty: string;
  preferredLang: string;
  clinic: string | null;
  npi: string | null;
  totpEnabled: boolean;
};

/**
 * Pull the bearer token from the Authorization header, verify it, and
 * load the user from the database. Throws 401 if anything is off.
 */
export async function auth(req: VercelRequest): Promise<AuthedUser> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    throw new HttpError(401, 'Missing Authorization header');
  }
  const token = header.slice('Bearer '.length).trim();
  const payload = verifyJwt(token);

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      specialty: true,
      preferredLang: true,
      clinic: true,
      npi: true,
      totpEnabled: true,
    },
  });
  if (!user) throw new HttpError(401, 'User no longer exists');
  return user;
}
