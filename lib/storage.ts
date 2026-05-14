// File storage wrapper. Uses Vercel Blob — clients upload directly via signed
// tokens, so audio/image bytes never pass through the API route (which is the
// pattern we want for HIPAA-aligned data flows anyway, and also avoids the
// 4.5 MB Vercel function body limit).
import {
  handleUpload,
  type HandleUploadBody,
} from '@vercel/blob/client';
import { requireEnv } from './http.js';

export type UploadKind = 'audio' | 'lab';

/**
 * Issue a one-time, scoped upload token the browser can use to upload directly
 * to Vercel Blob. Caller passes the request body produced by
 * `@vercel/blob/client`'s `upload()` function.
 */
export async function issueUploadToken(params: {
  body: HandleUploadBody;
  userId: string;
  kind: UploadKind;
}) {
  requireEnv('BLOB_READ_WRITE_TOKEN');
  return handleUpload({
    body: params.body,
    request: undefined as unknown as Request, // not used in token-only flow
    onBeforeGenerateToken: async (pathname) => {
      const allowedTypes =
        params.kind === 'audio'
          ? ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-m4a']
          : ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'];
      const maximumSizeInBytes =
        params.kind === 'audio' ? 250 * 1024 * 1024 : 25 * 1024 * 1024;
      return {
        allowedContentTypes: allowedTypes,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({
          userId: params.userId,
          kind: params.kind,
          pathname,
        }),
        maximumSizeInBytes,
      };
    },
    onUploadCompleted: async () => {
      // We persist the resulting URL on the row (visit/lab) when the client
      // tells us; nothing to do here besides logging if needed.
    },
  });
}

/** Fetch a binary asset previously stored in blob storage and return base64. */
export async function fetchAsBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const mimeType = res.headers.get('content-type') ?? 'application/octet-stream';
  const buf = Buffer.from(await res.arrayBuffer());
  return { base64: buf.toString('base64'), mimeType };
}
