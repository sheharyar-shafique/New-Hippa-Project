import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Upload,
  X,
} from 'lucide-react';
import { PATIENTS, TEMPLATES } from '../lib/mockData';
import { formatDuration } from '../lib/utils';

type Phase = 'idle' | 'recording' | 'paused' | 'processing' | 'done';

export default function NewConsultation() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('idle');
  const [seconds, setSeconds] = useState(0);
  const [patientId, setPatientId] = useState(PATIENTS[0].id);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [progress, setProgress] = useState(0);
  const tickRef = useRef<number | null>(null);

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

  useEffect(() => {
    if (phase !== 'processing') return;
    setProgress(0);
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18;
        if (next >= 100) {
          window.clearInterval(id);
          setTimeout(() => navigate('/app/notes/n_5002'), 350);
          return 100;
        }
        return next;
      });
    }, 220);
    return () => window.clearInterval(id);
  }, [phase, navigate]);

  const patient = PATIENTS.find((p) => p.id === patientId)!;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
          New consultation
        </h1>
        <p className="text-ink-600 mt-1">
          Record the visit — we&rsquo;ll draft a SOAP note in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recorder */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 text-sm text-ink-700">
              <span className="pill bg-brand-50 text-brand-700 border border-brand-100">
                <ShieldCheck className="w-3.5 h-3.5" /> Encrypted recording
              </span>
              <span className="pill bg-ink-100 text-ink-700">
                <Clock className="w-3.5 h-3.5" /> 2 hr max session
              </span>
            </div>
            <button className="btn-ghost text-sm" onClick={() => { setPhase('idle'); setSeconds(0); }}>
              <Trash2 className="w-4 h-4" /> Reset
            </button>
          </div>

          <div className="mt-8 flex flex-col items-center text-center">
            <div className="relative">
              <div className={`w-40 h-40 rounded-full flex items-center justify-center ${
                phase === 'recording' ? 'bg-red-50' : 'bg-brand-50'
              }`}>
                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-soft ${
                  phase === 'recording' ? 'bg-red-500 animate-pulse-soft' : 'bg-brand-600'
                }`}>
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
              {phase === 'idle' && 'Tap record when you’re ready to start the visit.'}
              {phase === 'recording' && 'Listening… speak naturally.'}
              {phase === 'paused' && 'Recording paused.'}
              {phase === 'processing' && 'Transcribing & generating your SOAP note…'}
            </p>
          </div>

          {/* Waveform */}
          <div className="mt-8 flex items-end gap-1 h-20">
            {Array.from({ length: 60 }).map((_, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full origin-bottom transition-all ${
                  phase === 'recording'
                    ? 'bg-red-400 animate-wave'
                    : phase === 'paused' || phase === 'processing'
                    ? 'bg-brand-300'
                    : 'bg-ink-200'
                }`}
                style={{
                  animationDelay: `${(i % 9) * 70}ms`,
                  height: phase === 'recording'
                    ? `${15 + ((i * 17) % 75)}%`
                    : `${8 + ((i * 11) % 35)}%`,
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-3">
            {phase === 'idle' && (
              <button onClick={() => setPhase('recording')} className="btn-primary px-6 py-3 text-base">
                <Mic className="w-5 h-5" /> Start recording
              </button>
            )}
            {phase === 'recording' && (
              <>
                <button onClick={() => setPhase('paused')} className="btn-secondary px-5 py-3">
                  <Pause className="w-5 h-5" /> Pause
                </button>
                <button onClick={() => setPhase('processing')} className="btn-primary px-5 py-3">
                  <Square className="w-5 h-5" /> Stop &amp; generate
                </button>
              </>
            )}
            {phase === 'paused' && (
              <>
                <button onClick={() => setPhase('recording')} className="btn-primary px-5 py-3">
                  <Play className="w-5 h-5" /> Resume
                </button>
                <button onClick={() => setPhase('processing')} className="btn-secondary px-5 py-3">
                  <Square className="w-5 h-5" /> Stop &amp; generate
                </button>
              </>
            )}
            {phase === 'processing' && (
              <div className="w-full max-w-md">
                <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-ink-500 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Drafting SOAP note ({Math.round(progress)}%)
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-ink-200/70 pt-5">
            <div className="flex items-center justify-between gap-3">
              <p className="section-title">Or upload a recording</p>
              <span className="text-xs text-ink-500">.m4a, .mp3, .wav · up to 250 MB</span>
            </div>
            <button className="mt-3 w-full border-2 border-dashed border-ink-200 rounded-xl px-4 py-6 hover:border-brand-300 hover:bg-brand-50/30 transition flex flex-col items-center text-ink-600">
              <Upload className="w-5 h-5 mb-1.5 text-brand-600" />
              <span className="text-sm font-medium">Drop audio file or click to upload</span>
            </button>
          </div>
        </div>

        {/* Side panel: visit context */}
        <div className="space-y-5">
          <div className="card p-5">
            <p className="section-title">Visit context</p>
            <div className="mt-4 space-y-4">
              <div>
                <label className="label">Patient</label>
                <div className="relative">
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="input pr-9 appearance-none"
                  >
                    {PATIENTS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} — {p.age}{p.sex}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label">Template</label>
                <div className="relative">
                  <select
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    className="input pr-9 appearance-none"
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label">Visit type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['In-clinic', 'Telehealth', 'Home'].map((v, i) => (
                    <button
                      key={v}
                      className={`py-2 rounded-lg text-sm border transition ${
                        i === 0
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-ink-700 border-ink-200 hover:bg-ink-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <p className="section-title">Active problems</p>
            <ul className="mt-3 space-y-2 text-sm">
              {patient.conditions.map((c) => (
                <li key={c} className="flex items-center justify-between gap-2">
                  <span className="text-ink-800">{c}</span>
                  <button className="text-ink-400 hover:text-ink-600"><X className="w-3.5 h-3.5" /></button>
                </li>
              ))}
            </ul>
            <button className="mt-3 text-sm text-brand-700 font-semibold">+ Add problem</button>
          </div>

          <div className="card p-5">
            <p className="section-title">Recording tips</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-700 leading-relaxed">
              <li>• Place the device on the desk between you and the patient.</li>
              <li>• Speak findings out loud: “BP one-thirty-eight over eighty-two…”</li>
              <li>• You can pause anytime; the model handles natural breaks.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
