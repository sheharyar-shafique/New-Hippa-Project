// Supabase Storage wrapper. Private buckets + signed upload/read URLs so
// PHI bytes never pass through our API routes (HIPAA-friendly + avoids
// the 4.5 MB Vercel function body limit).
//
// Required env:
//   SUPABASE_URL                e.g. https://nzplcdotvajguhvwvhyd.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY   project service-role JWT (server-side only)
//
// Required buckets (create once, private):
//   audio    — consultation audio recordings
//   labs     — lab images uploaded by clinicians
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { requireEnv } from './http.js';

let _supabase: SupabaseClient | null = null;
export function supabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = requireEnv('SUPABASE_URL');
  const key = requireEnv('SUPABASE_SERVICE_ROLE_KEY');
  _supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _supabase;
}

export type UploadKind = 'audio' | 'lab';

export const BUCKETS: Record<UploadKind, string> = {
  audio: 'audio',
  lab: 'labs',
};

const ALLOWED_TYPES: Record<UploadKind, string[]> = {
  audio: ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a'],
  lab: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
};

const MAX_BYTES: Record<UploadKind, number> = {
  audio: 250 * 1024 * 1024,
  lab: 25 * 1024 * 1024,
};

/**
 * Issue a one-time signed upload URL. The browser PUTs the file directly
 * to that URL — no bytes pass through our serverless functions.
 */
export async function createSignedUpload(params: {
  kind: UploadKind;
  userId: string;
  filename: string;
  contentType?: string;
}) {
  const { kind, userId, filename, contentType } = params;
  const bucket = BUCKETS[kind];
  if (contentType && !ALLOWED_TYPES[kind].some((t) => contentType.startsWith(t))) {
    throw new Error(`Content-Type "${contentType}" not allowed for ${kind} uploads`);
  }
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-180);
  const path = `${userId}/${Date.now()}-${safe}`;
  const { data, error } = await supabase()
    .storage
    .from(bucket)
    .createSignedUploadUrl(path);
  if (error) throw new Error(`Supabase storage error: ${error.message}`);
  return {
    bucket,
    path,
    signedUrl: data.signedUrl,
    token: data.token,
    maxBytes: MAX_BYTES[kind],
  };
}

/**
 * Generate a short-lived signed read URL for a stored file. Used to hand
 * a private object to Whisper or Claude — they fetch it within seconds.
 */
export async function getSignedReadUrl(
  bucket: string,
  path: string,
  expiresInSec = 300
): Promise<string> {
  const { data, error } = await supabase()
    .storage
    .from(bucket)
    .createSignedUrl(path, expiresInSec);
  if (error) throw new Error(`Supabase storage error: ${error.message}`);
  return data.signedUrl;
}

/**
 * Download a stored file and return base64 + content type. Used for
 * Claude vision which expects inline base64.
 */
export async function downloadAsBase64(
  bucket: string,
  path: string
): Promise<{ base64: string; mimeType: string }> {
  const { data, error } = await supabase().storage.from(bucket).download(path);
  if (error) throw new Error(`Supabase storage error: ${error.message}`);
  const mimeType = data.type || 'application/octet-stream';
  const buf = Buffer.from(await data.arrayBuffer());
  return { base64: buf.toString('base64'), mimeType };
}
