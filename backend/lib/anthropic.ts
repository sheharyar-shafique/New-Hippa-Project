// Thin wrapper around the Anthropic SDK with two helpers tailored to NoteMD's
// workflows: SOAP-note generation from a transcript, and lab-image analysis.
import Anthropic from '@anthropic-ai/sdk';
import { HttpError, requireEnv } from './http.js';
import { SOAP_SYSTEM_PROMPT, LAB_VISION_PROMPT, type Lang } from './prompts.js';

let _client: Anthropic | null = null;
function client(): Anthropic {
  if (_client) return _client;
  _client = new Anthropic({ apiKey: requireEnv('ANTHROPIC_API_KEY') });
  return _client;
}

function model(kind: 'text' | 'vision'): string {
  if (kind === 'vision') {
    return process.env.ANTHROPIC_MODEL_VISION ?? 'claude-sonnet-4-5';
  }
  return process.env.ANTHROPIC_MODEL_TEXT ?? 'claude-sonnet-4-5';
}

function extractJson<T = unknown>(text: string): T {
  // Tolerate accidental code fences or surrounding prose.
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenceMatch ? fenceMatch[1] : text;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new HttpError(502, 'Model did not return JSON', { raw: text.slice(0, 800) });
  }
  try {
    return JSON.parse(candidate.slice(start, end + 1)) as T;
  } catch (e) {
    throw new HttpError(502, 'Failed to parse model JSON', {
      raw: text.slice(0, 800),
    });
  }
}

export type SoapResult = {
  chiefComplaint: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10: { code: string; label: string }[];
};

export async function generateSoap(params: {
  transcript: string;
  lang: Lang;
  patient?: { name: string; age: number; sex: string; conditions?: string[] };
}): Promise<SoapResult> {
  const userPayload = JSON.stringify(
    {
      patient: params.patient ?? null,
      transcript: params.transcript,
    },
    null,
    2
  );

  const resp = await client().messages.create({
    model: model('text'),
    max_tokens: 2000,
    system: SOAP_SYSTEM_PROMPT(params.lang),
    messages: [
      {
        role: 'user',
        content: `Generate the SOAP note for the visit below.\n\n${userPayload}`,
      },
    ],
  });

  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return extractJson<SoapResult>(text);
}

export type LabAnalysisResult = {
  panel: string;
  ocrConfidence: number;
  results: {
    name: string;
    value: string;
    unit: string;
    range: string;
    flag: 'High' | 'Low' | 'Normal' | 'Borderline';
  }[];
  interpretation: string;
  differentials: {
    label: string;
    likelihood: 'High' | 'Moderate' | 'Low';
    reasoning: string;
  }[];
  nextSteps: string[];
};

export async function analyzeLabImage(params: {
  imageBase64: string;
  mimeType: string;
  lang: Lang;
}): Promise<LabAnalysisResult> {
  const resp = await client().messages.create({
    model: model('vision'),
    max_tokens: 2000,
    system: LAB_VISION_PROMPT(params.lang),
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: params.mimeType as
                | 'image/jpeg'
                | 'image/png'
                | 'image/gif'
                | 'image/webp',
              data: params.imageBase64,
            },
          },
          {
            type: 'text',
            text: 'Analyze this laboratory report and return the structured JSON described in your instructions.',
          },
        ],
      },
    ],
  });

  const text = resp.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return extractJson<LabAnalysisResult>(text);
}
