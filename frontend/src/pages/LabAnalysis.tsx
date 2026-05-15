import { useRef, useState } from 'react';
import {
  FlaskConical,
  Upload,
  Sparkles,
  ImageIcon,
  Camera,
  FileText,
  X,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import StatusPill from '../components/StatusPill';
import Brandify from '../components/Brandify';
import { useT, useLang } from '../i18n/LanguageProvider';
import { api, LabAnalysis as LabAnalysisModel } from '../lib/api';

type Phase = 'idle' | 'uploading' | 'analyzing' | 'done';

export default function LabAnalysis() {
  const t = useT();
  const { lang } = useLang();
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<LabAnalysisModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setFileName(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    try {
      setPhase('uploading');
      setProgress(15);
      setProgressLabel(lang === 'es' ? 'Subiendo imagen…' : 'Uploading image…');

      // 1) Get a signed upload URL from the backend.
      const signed = await api.post<{
        bucket: string;
        path: string;
        signedUrl: string;
        token: string;
      }>('/visits/upload-url', {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        kind: 'lab',
      });

      // 2) Upload directly to Supabase Storage.
      const putRes = await fetch(signed.signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
          'x-upsert': 'true',
        },
        body: file,
      });
      if (!putRes.ok) {
        throw new Error(`Image upload failed (${putRes.status})`);
      }

      // 3) Run analysis.
      setPhase('analyzing');
      setProgress(55);
      setProgressLabel(
        lang === 'es' ? 'Interpretando laboratorio…' : 'Interpreting lab…'
      );
      const { analysis } = await api.post<{ analysis: LabAnalysisModel }>(
        '/labs/analyze',
        {
          imageBucket: signed.bucket,
          imagePath: signed.path,
          language: lang,
        }
      );
      setAnalysis(analysis);
      setProgress(100);
      setPhase('done');
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? 'Failed to analyze lab');
      setPhase('idle');
    }
  };

  const reset = () => {
    setPhase('idle');
    setPreview(null);
    setFileName(null);
    setAnalysis(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">{t('labs.title')}</h1>
          <p className="text-ink-600 mt-1 max-w-2xl"><Brandify>{t<string>('labs.subtitle')}</Brandify></p>
        </div>
        <span className="pill bg-brand-50 text-brand-700 border border-brand-100">
          <ShieldCheck className="w-3.5 h-3.5" /> {t('labs.encryptedBadge')}
        </span>
      </div>

      {phase === 'idle' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-7">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-soft">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-ink-900">{t('labs.uploadTitle')}</h2>
            <p className="mt-1 text-sm text-ink-600">{t('labs.uploadFormats')}</p>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
              }}
              className="mt-5 block border-2 border-dashed border-ink-200 rounded-xl px-6 py-10 text-center hover:border-brand-300 hover:bg-brand-50/30 transition cursor-pointer"
            >
              <Upload className="w-7 h-7 mx-auto text-brand-600" />
              <p className="mt-2 font-semibold text-ink-800">{t('labs.uploadDrop')}</p>
              <p className="text-sm text-ink-500">{t('labs.uploadBrowse')}</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
              />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    inputRef.current?.click();
                  }}
                  className="btn-primary"
                >
                  <ImageIcon className="w-4 h-4" /> {t('labs.chooseFile')}
                </button>
              </div>
            </label>

            <div className="mt-5 grid sm:grid-cols-3 gap-2 text-xs text-ink-500">
              <Tip icon={Camera} label={t<string>('labs.tipPhone')} />
              <Tip icon={FileText} label={t<string>('labs.tipPdf')} />
              <Tip icon={ImageIcon} label={t<string>('labs.tipScan')} />
            </div>
          </div>

          <div className="card p-7">
            <h3 className="text-lg font-semibold text-ink-900">{t('labs.returnsTitle')}</h3>
            <ul className="mt-4 space-y-3">
              <Feat icon={Brain} title={t<string>('labs.returnExtractTitle')} body={t<string>('labs.returnExtractBody')} />
              <Feat icon={Sparkles} title={t<string>('labs.returnInterpretTitle')} body={t<string>('labs.returnInterpretBody')} />
              <Feat icon={AlertTriangle} title={t<string>('labs.returnDifferentialsTitle')} body={t<string>('labs.returnDifferentialsBody')} />
              <Feat icon={ShieldCheck} title={t<string>('labs.returnConfidenceTitle')} body={t<string>('labs.returnConfidenceBody')} />
            </ul>
            <div className="mt-6 rounded-xl bg-ink-50 border border-ink-200 p-4 text-sm text-ink-600">
              {t('common.decisionSupportLong')}
            </div>
          </div>
          {error && (
            <div className="lg:col-span-2 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {(phase === 'uploading' || phase === 'analyzing') && (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-50 mx-auto flex items-center justify-center">
            <Brain className="w-7 h-7 text-brand-600 animate-pulse" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-ink-900">{t('labs.analyzing')}</h2>
          <p className="text-sm text-ink-500 mt-1">
            {fileName ? `${fileName} · ` : ''}{progressLabel || t('labs.ocrInterp')}
          </p>
          <div className="mt-6 max-w-md mx-auto h-2 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-500">{Math.round(progress)}%</p>
        </div>
      )}

      {phase === 'done' && analysis && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-200/70 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-semibold text-ink-900">{analysis.panel ?? '—'}</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {fileName ?? ''} · {t('labs.ocrConfidence')}{' '}
                    <span className="font-semibold text-brand-700">
                      {analysis.ocrConfidence != null
                        ? `${(analysis.ocrConfidence * 100).toFixed(0)}%`
                        : '—'}
                    </span>
                  </p>
                </div>
                <button onClick={reset} className="btn-ghost">
                  <X className="w-4 h-4" /> {t('labs.replace')}
                </button>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="bg-ink-50/60 p-5 flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Uploaded lab"
                      className="max-h-72 rounded-lg border border-ink-200 object-contain"
                    />
                  ) : (
                    <div className="text-xs text-ink-400 italic">
                      {lang === 'es'
                        ? 'Imagen almacenada en Supabase Storage (cifrada)'
                        : 'Image stored in Supabase Storage (encrypted)'}
                    </div>
                  )}
                </div>
                <div>
                  <table className="w-full text-sm">
                    <thead className="text-xs text-ink-500">
                      <tr>
                        <th className="text-left font-medium px-4 py-2">{t('labs.colAnalyte')}</th>
                        <th className="text-left font-medium px-4 py-2">{t('labs.colValue')}</th>
                        <th className="text-left font-medium px-4 py-2">{t('labs.colRange')}</th>
                        <th className="text-left font-medium px-4 py-2">{t('labs.colFlag')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-200/70">
                      {(analysis.results ?? []).map((r) => (
                        <tr key={r.name}>
                          <td className="px-4 py-2 text-ink-800">{r.name}</td>
                          <td className="px-4 py-2 font-semibold text-ink-900 tabular-nums">
                            {r.value} <span className="text-xs text-ink-500 font-normal">{r.unit}</span>
                          </td>
                          <td className="px-4 py-2 text-xs text-ink-500">{r.range}</td>
                          <td className="px-4 py-2">
                            <StatusPill label={r.flag} variant={r.flag} translateAs="flags" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <p className="section-title flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> {t('labs.interpretation')}
              </p>
              <p className="mt-3 text-[15px] text-ink-800 leading-relaxed">
                {analysis.interpretation ?? '—'}
              </p>
            </div>

            <div className="card p-5">
              <p className="section-title">{t('labs.nextSteps')}</p>
              <ul className="mt-3 space-y-2">
                {(analysis.nextSteps ?? []).map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-ink-800">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card p-5">
              <p className="section-title">{t('labs.possibleConditions')}</p>
              <ul className="mt-3 space-y-3">
                {(analysis.differentials ?? []).map((d) => (
                  <li key={d.label} className="rounded-xl border border-ink-200 p-3 bg-white">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink-900">{d.label}</p>
                      <Likelihood level={d.likelihood} />
                    </div>
                    <p className="mt-1 text-xs text-ink-600 leading-relaxed">{d.reasoning}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5" />
                <p className="text-sm text-amber-900 leading-relaxed">{t('common.decisionSupportLong')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tip({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="rounded-lg border border-ink-200 bg-white px-3 py-2 inline-flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-brand-600" /> {label}
    </div>
  );
}

function Feat({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="font-semibold text-ink-900 text-sm">{title}</p>
        <p className="text-sm text-ink-600 leading-relaxed">{body}</p>
      </div>
    </li>
  );
}

function Likelihood({ level }: { level: string }) {
  const t = useT();
  const map: Record<string, string> = {
    High: 'bg-red-50 text-red-700 border border-red-100',
    Moderate: 'bg-amber-50 text-amber-700 border border-amber-100',
    Low: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  };
  return (
    <span className={`pill ${map[level] ?? map.Low}`}>{t<string>(`likelihood.${level}`)}</span>
  );
}
