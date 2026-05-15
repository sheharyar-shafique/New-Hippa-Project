// Tiny helpers shared across Vercel API routes.
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ZodError, ZodSchema } from 'zod';

/**
 * Apply CORS headers. The allowed origin(s) come from the `ALLOWED_ORIGIN`
 * env var (comma-separated). If the request's Origin matches, that origin
 * is echoed back; otherwise the first configured origin is used. If
 * `ALLOWED_ORIGIN` is unset we fall back to `*` (dev convenience — set it
 * in production).
 */
export function setCors(req: VercelRequest, res: VercelResponse) {
  const configured = (process.env.ALLOWED_ORIGIN ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const reqOrigin = (req.headers.origin as string | undefined) ?? '';
  let origin = '*';
  if (configured.length > 0) {
    origin = configured.includes(reqOrigin) ? reqOrigin : configured[0];
    // Required when we echo a specific origin so caches don't pollute responses.
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

export function handlePreflight(req: VercelRequest, res: VercelResponse): boolean {
  setCors(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function methodNotAllowed(res: VercelResponse, allowed: string[]) {
  res.setHeader('Allow', allowed.join(', '));
  res.status(405).json({ error: 'Method not allowed', allowed });
}

export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function handleError(res: VercelResponse, err: unknown) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, details: err.details });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Invalid request', details: err.flatten() });
    return;
  }
  // eslint-disable-next-line no-console
  console.error('[api error]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err instanceof Error ? err.message : String(err),
  });
}

export function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  return schema.parse(body);
}

export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new HttpError(500, `Missing required env var: ${name}`);
  return v;
}
