import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { upload } from '@vercel/blob/client';
import {
  Mic,
  Pause,
  Play,
  Square,
  Trash2,
  Sparkles,
  ShieldCheck,
  Clock,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { formatDuration } from '../lib/utils';
import { useT, useLang } from '../i18n/LanguageProvider';
import { api, Patient, Visit } from '../lib/api';

type Phase = 'idle' | 'recording' | 'paused' | 'uploading' | 'processing';

export default function NewConsultation() {
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState<string>('');
  const [visitType, setVisitType] = useState<'In-clinic' | 'Telehealth' | 'Home'>('In-clinic');

  const [phase, setPhase] = useState<Phase>('idle');
  const [seconds, setSeconds] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const tickRef = useRef<number | null>(null);

  // Load patients on mount.
  useEffect(() => {
    (async () => {
      try {
        const { patients } = await api.get<{ patients: Patient[] }>('/patients');
        setPatients(patients);
        if (patients[0]) setPatientId(patients[0].id);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Tick recording seconds.
  useEffect(() => {
    if (phase === 'recording') {
      tickRef.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [phase]);

  // Clean up media stream when unmounting / resetting.
  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    },
    []
  );

  const reset = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setSeconds(0);
    setProgress(0);
    setProgressLabel('');
    setPhase('idle');
    setError(null);
  };

  const startRecording = async () => {
    setError(null);
    if (!patientId) {
      setError(
        lang === 'es'
          ? 'Seleccione un paciente antes de grabar.'
          : 'Select a patient before recording.'
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });
      streamRef.current = stream;
      const preferredMime = pickSupportedMimeType();
      const rec = new MediaRecorder(stream, preferredMime ? { mimeType: preferredMime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.start(1000); // gather chunks every second
      mediaRecorderRef.current = rec;
      setPhase('recording');
    } catch (err: any) {
      setError(
        err?.name === 'NotAllowedError'
          ? lang === 'es'
            ? 'Permiso de micrófono denegado. Habilítelo en su navegador.'
            : 'Microphone permission denied. Enable it in your browser.'
          : err?.message ?? 'Microphone error'
      );
    }
  };

  const pauseRecording = () => {
    mediaRecorderRef.current?.pause();
    setPhase('paused');
  };

  const resumeRecording = () => {
    mediaRecorderRef.current?.resume();
    setPhase('recording');
  };

  const stopAndGenerate = async () => {
    const rec = mediaRecorderRef.current;
    if (!rec) return;
    setPhase('uploading');
    setProgress(5);
    setProgressLabel(lang === 'es' ? 'Finalizando grabación…' : 'Finishing recording…');

    // Wait for the final chunk.
    await new Promise<void>((resolve) => {
      rec.addEventListener('stop', () => resolve(), { once: true });
      try {
        rec.stop();
      } catch {
        resolve();
      }
    });
    streamRef.current?.getTracks().forEach((t) => t.stop());

    const blobType = rec.mimeType || 'audio/webm';
    const blob = new Blob(chunksRef.current, { type: blobType });
    const durationSec = seconds;

    try {
      // 1) Create the visit row.
      setProgress(15);
      setProgressLabel(lang === 'es' ? 'Creando consulta…' : 'Creating visit…');
      const { visit } = await api.post<{ visit: Visit }>('/visits/start', {
        patientId,
        visitType,
        language: lang,
      });

      // 2) Upload the audio directly to Vercel Blob.
      setProgress(35);
      setProgressLabel(lang === 'es' ? 'Subiendo audio cifrado…' : 'Uploading encrypted audio…');
      const filename = `audio/${visit.id}.${guessExt(blobType)}`;
      const uploaded = await upload(filename, blob, {
        access: 'public',
        handleUploadUrl: '/api/visits/upload-url',
        contentType: blobType,
      });

      // 3) Trigger transcription + SOAP generation.
      setProgress(60);
      setProgressLabel(
        lang === 'es' ? 'Transcribiendo y redactando SOAP…' : 'Transcribing and drafting SOAP…'
      );
      setPhase('processing');
      const { visit: generated } = await api.post<{ visit: Visit }>('/visits/generate', {
        visitId: visit.id,
        audioUrl: uploaded.url,
        durationSec,
        mimeType: blobType,
      });

      setProgress(100);
      navigate(`/app/notes/${generated.id}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Failed to generate note');
      setPhase('idle');
    }
  };

  const selectedPatient = patients.find((p) => p.id === patientId);
  const tips = t<string[]>('consultation.tips');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          {t('consultation.title')}
        </h1>
        <p className="text-ink-600 mt-1">{t('consultation.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 text-sm text-ink-700">
              <span className="pill bg-brand-50 text-brand-700 border border-brand-100">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('common.encryptedRecording')}
              </span>
              <span className="pill bg-ink-100 text-ink-700">
                <Clock className="w-3.5 h-3.5" /> {t('common.twoHrMax')}
              </span>
            </div>
            <button className="btn-ghost text-sm" onClick={reset}>
              <Trash2 className="w-4 h-4" /> {t('common.reset')}
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center text-center">
            <div className="relative">
              <div
                className={`w-40 h-40 rounded-full flex items-center justify-center ${
                  phase === 'recording' ? 'bg-red-50' : 'bg-brand-50'
                }`}
              >
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-soft ${
                    phase === 'recording' ? 'bg-red-500 animate-pulse-soft' : 'bg-brand-600'
                  }`}
                >
                  <Mic className="w-14 h-14" />
                </div>
              </div>
              {phase === 'recording' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-100 animate-pulse" />
              )}
            </div>
            <p className="mt-6 text-4xl font-bold tabular-nums text-ink-900">
              {formatDuration(seconds)}
            </p>
            <p className="mt-1 text-sm text-ink-500">
              {phase === 'idle' && t('consultation.statusIdle')}
              {phase === 'recording' && t('consultation.statusRecording')}
              {phase === 'paused' && t('consultation.statusPaused')}
              {(phase === 'uploading' || phase === 'processing') && t('consultation.statusProcessing')}
            </p>
          </div>

          {/* Waveform decoration */}
          <div className="mt-8 flex items-end gap-1 h-20">
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full origin-bottom transition-all ${
                  phase === 'recording'
                    ? 'bg-red-400 animate-wave'
                    : phase === 'paused' || phase === 'uploading' || phase === 'processing'
                    ? 'bg-brand-300'
                    : 'bg-ink-200'
                }`}
                style={{
                  animationDelay: `${(i % 9) * 70}ms`,
                  height: phase === 'recording' ? `${15 + ((i * 17) % 75)}%` : `${8 + ((i * 11) % 35)}%`,
                }}
              />
            ))}
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-3">
            {phase === 'idle' && (
              <button onClick={startRecording} className="btn-primary px-6 py-3 text-base">
                <Mic className="w-5 h-5" /> {t('consultation.startRecording')}
              </button>
            )}
            {phase === 'recording' && (
              <>
                <button onClick={pauseRecording} className="btn-secondary px-5 py-3">
                  <Pause className="w-5 h-5" /> {t('consultation.pause')}
                </button>
                <button onClick={stopAndGenerate} className="btn-primary px-5 py-3">
                  <Square className="w-5 h-5" /> {t('consultation.stopGenerate')}
                </button>
              </>
            )}
            {phase === 'paused' && (
              <>
                <button onClick={resumeRecording} className="btn-primary px-5 py-3">
                  <Play className="w-5 h-5" /> {t('consultation.resume')}
                </button>
                <button onClick={stopAndGenerate} className="btn-secondary px-5 py-3">
                  <Square className="w-5 h-5" /> {t('consultation.stopGenerate')}
                </button>
              </>
            )}
            {(phase === 'uploading' || phase === 'processing') && (
              <div className="w-full max-w-md">
                <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-500 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                  {progressLabel} ({Math.round(progress)}%)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <p className="section-title">{t('consultation.visitContext')}</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="label">{t('consultation.patient')}</label>
                {patients.length === 0 ? (
                  <button
                    onClick={() => navigate('/app/patients')}
                    className="w-full btn-secondary"
                  >
                    {lang === 'es' ? '+ Agregar un paciente primero' : '+ Add a patient first'}
                  </button>
                ) : (
                  <div className="relative">
                    <select
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      className="input pr-9 appearance-none"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.age}{p.sex}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
                  </div>
                )}
              </div>
              <div>
                <label className="label">{t('consultation.visitType')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ['In-clinic', t<string>('consultation.typeClinic')],
                      ['Telehealth', t<string>('consultation.typeTele')],
                      ['Home', t<string>('consultation.typeHome')],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setVisitType(value as any)}
                      className={`py-2 rounded-lg text-sm border transition ${
                        visitType === value
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-ink-700 border-ink-200 hover:bg-ink-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {selectedPatient && (
            <div className="card p-5">
              <p className="section-title">{t('consultation.activeProblems')}</p>
              {selectedPatient.conditions.length === 0 ? (
                <p className="mt-3 text-sm text-ink-500">—</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {selectedPatient.conditions.map((c) => (
                    <li key={c} className="flex items-center justify-between gap-2">
                      <span className="text-ink-800">{c}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="card p-5">
            <p className="section-title">{t('consultation.tipsTitle')}</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-700 leading-relaxed">
              {tips.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function pickSupportedMimeType(): string | undefined {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  if (typeof MediaRecorder === 'undefined') return undefined;
  for (const m of candidates) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return undefined;
}

function guessExt(mime: string): string {
  if (mime.includes('webm')) return 'webm';
  if (mime.includes('mp4')) return 'm4a';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('wav')) return 'wav';
  return 'bin';
}
