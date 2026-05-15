// Thin fetch wrapper that automatically attaches the JWT auth token and
// converts non-2xx responses into thrown Errors with a useful message.
const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? '/api';
const TOKEN_KEY = 'notemd.token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.json !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  });

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (payload && typeof payload === 'object' && 'error' in payload && (payload as any).error) ||
      (typeof payload === 'string' && payload) ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, String(message), payload);
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, json?: unknown) => request<T>(path, { method: 'POST', json }),
  patch: <T>(path: string, json?: unknown) => request<T>(path, { method: 'PATCH', json }),
  put: <T>(path: string, json?: unknown) => request<T>(path, { method: 'PUT', json }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------------
// Domain types — match the backend Prisma models
// ---------------------------------------------------------------------------
export type AuthedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialty: string;
  preferredLang: 'en' | 'es';
  clinic: string | null;
  npi: string | null;
};

export type Patient = {
  id: string;
  doctorId: string;
  name: string;
  age: number;
  sex: 'M' | 'F' | 'X';
  mrn: string | null;
  conditions: string[];
  createdAt: string;
  updatedAt: string;
};

export type Icd10 = { code: string; label: string };

export type Visit = {
  id: string;
  doctorId: string;
  patientId: string;
  patient?: Patient;
  visitType: string;
  template: string | null;
  chiefComplaint: string | null;
  status: 'draft' | 'finalized' | 'signed';
  language: 'en' | 'es';
  audioPath: string | null;
  durationSec: number | null;
  transcript: string | null;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  icd10Codes: Icd10[] | null;
  createdAt: string;
  updatedAt: string;
};

export type LabResult = {
  name: string;
  value: string;
  unit: string;
  range: string;
  flag: 'High' | 'Low' | 'Normal' | 'Borderline';
};

export type Differential = {
  label: string;
  likelihood: 'High' | 'Moderate' | 'Low';
  reasoning: string;
};

export type LabAnalysis = {
  id: string;
  doctorId: string;
  patientId: string | null;
  imagePath: string;
  language: 'en' | 'es';
  panel: string | null;
  ocrConfidence: number | null;
  results: LabResult[] | null;
  interpretation: string | null;
  differentials: Differential[] | null;
  nextSteps: string[] | null;
  createdAt: string;
};
