// OpenAI Whisper transcription wrapper.
// Uses native fetch + FormData instead of the OpenAI SDK to avoid
// node-fetch ECONNRESET issues on hosting platforms like Render.
import { requireEnv } from './http.js';

const MODEL = process.env.OPENAI_WHISPER_MODEL ?? 'whisper-1';
const MAX_RETRIES = 3;

/**
 * Transcribe an audio file at a URL (Supabase signed URL, S3, etc.).
 * Returns plain text. Pass `language` to bias the recognizer:
 * "es" for Spanish, "en" for English. Whisper auto-detects either way.
 */
export async function transcribeUrl(audioUrl: string, language?: 'en' | 'es'): Promise<string> {
  // 1) Download the audio from Supabase Storage.
  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) {
    throw new Error(`Failed to fetch audio from storage: ${audioRes.status}`);
  }
  const audioBuffer = await audioRes.arrayBuffer();
  const filename = audioUrl.split('/').pop()?.split('?')[0] ?? 'audio.webm';
  const mimeType = audioRes.headers.get('content-type') || 'audio/webm';

  console.log(`[whisper] Transcribing ${filename} (${(audioBuffer.byteLength / 1024).toFixed(1)} KB)`);

  // 2) Call OpenAI Whisper API directly with native fetch + FormData.
  //    This avoids the OpenAI SDK's node-fetch dependency which causes
  //    ECONNRESET on some hosting platforms.
  const apiKey = requireEnv('OPENAI_API_KEY');
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const form = new FormData();
      const blob = new Blob([audioBuffer], { type: mimeType });
      form.append('file', blob, filename);
      form.append('model', MODEL);
      if (language) form.append('language', language);
      form.append('response_format', 'text');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Whisper API error (${response.status}): ${errText}`);
      }

      const transcript = await response.text();
      console.log(`[whisper] Transcription complete (${transcript.length} chars, attempt ${attempt})`);
      return transcript;
    } catch (err: any) {
      lastError = err;
      console.warn(`[whisper] Attempt ${attempt}/${MAX_RETRIES} failed: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        // Wait 1s, 2s before retrying.
        await new Promise((r) => setTimeout(r, attempt * 1000));
      }
    }
  }

  throw lastError ?? new Error('Whisper transcription failed after retries');
}
