// OpenAI Whisper transcription wrapper.
import OpenAI, { toFile } from 'openai';
import { requireEnv } from './http.js';

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (_client) return _client;
  _client = new OpenAI({
    apiKey: requireEnv('OPENAI_API_KEY'),
    timeout: 120_000, // 2 minutes — Whisper can be slow on large files
    maxRetries: 3,    // auto-retry on transient errors like ECONNRESET
  });
  return _client;
}

const MODEL = process.env.OPENAI_WHISPER_MODEL ?? 'whisper-1';

/**
 * Transcribe an audio file at a URL (Vercel Blob, S3, etc.).
 * Returns plain text. Pass `language` to bias the recognizer:
 * "es" for Spanish, "en" for English. Whisper auto-detects either way.
 */
export async function transcribeUrl(audioUrl: string, language?: 'en' | 'es'): Promise<string> {
  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) {
    throw new Error(`Failed to fetch audio from ${audioUrl}: ${audioRes.status}`);
  }
  const audioBlob = await audioRes.blob();
  const filename =
    audioUrl.split('/').pop()?.split('?')[0] ?? 'audio.webm';

  // Convert to Buffer then use OpenAI's toFile helper for reliable uploads.
  const buffer = Buffer.from(await audioBlob.arrayBuffer());
  const file = await toFile(buffer, filename, {
    type: audioBlob.type || 'audio/webm',
  });

  const result = await client().audio.transcriptions.create({
    file,
    model: MODEL,
    language,
    response_format: 'text',
  });

  // When response_format=text the SDK returns a string.
  return typeof result === 'string' ? result : (result as any).text ?? '';
}
