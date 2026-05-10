import { useEffect, useRef, useState } from 'react';
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
import { MOCK_LAB_ANALYSIS } from '../lib/mockData';
import { useT, useLang } from '../i18n/LanguageProvider';

type Phase = 'idle' | 'analyzing' | 'done';

export default function LabAnalysis() {
  const t = useT();
  const { lang } = useLang();
  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== 'analyzing') return;
    setProgress(0);
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + 8 + Math.random() * 18;
        if (next >= 100) {
          window.clearInterval(id);
          setTimeout(() => setPhase('done'), 250);
          return 100;
        }
        return next;
      });
    }, 220);
    return () => window.clearInterval(id);
  }, [phase]);

  const onFile = (file: File) => {
    setFileName(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    setPhase('analyzing');
  };

  const useDemo = () => {
    setFileName('demo-cmp-lipid.png');
    setPreview(null);
    setPhase('analyzing');
  };

  const recentItems = t<{ name: string; when: string }[]>('labs.recentItems');
  const nextSteps = lang === 'es'
    ? MOCK_LAB_ANALYSIS.suggestedNextStepsEs
    : MOCK_LAB_ANALYSIS.suggestedNextSteps;

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
                if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
              }}
              className="mt-5 block border-2 border-dashed border-ink-200 rounded-xl px-6 py-10 text-center hover:border-brand-300 hover:bg-brand-50/30 transition cursor-pointer"
            >
              <Upload className="w-7 h-7 mx-auto text-brand-600" />
              <p className="mt-2 font-semibold text-ink-800">{t('labs.uploadDrop')}</p>
              <p className="text-sm text-ink-500">{t('labs.uploadBrowse')}</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files && onFile(e.target.files[0])}
              />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); inputRef.current?.click(); }}
                  className="btn-primary"
                >
                  <ImageIcon className="w-4 h-4" /> {t('labs.chooseFile')}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); useDemo(); }}
                  className="btn-secondary"
                >
                  <Sparkles className="w-4 h-4" /> {t('labs.tryDemo')}
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
        </div>
      )}

      {phase === 'analyzing' && (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-50 mx-auto flex items-center justify-center">
            <Brain className="w-7 h-7 text-brand-600 animate-pulse" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-ink-900">{t('labs.analyzing')}</h2>
          <p className="text-sm text-ink-500 mt-1">
            {fileName ? `${fileName} · ` : ''}{t('labs.ocrInterp')}
          </p>
          <div className="mt-6 max-w-md mx-auto h-2 bg-ink-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-600 transition-all" style={{ width: `${Math.min(100, progress)}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-500">{Math.round(progress)}%</p>
        </div>
      )}

      {phase === 'done' && (
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-200/70 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-semibold text-ink-900">
                    {lang === 'es' ? MOCK_LAB_ANALYSIS.panelEs : MOCK_LAB_ANALYSIS.panel}
                  </p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {fileName ?? 'sample-lab.png'} · {t('labs.ocrConfidence')}{' '}
                    <span className="font-semibold text-brand-700">
                      {(MOCK_LAB_ANALYSIS.ocrConfidence * 100).toFixed(0)}%
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => { setPhase('idle'); setPreview(null); setFileName(null); }}
                  className="btn-ghost"
                >
                  <X className="w-4 h-4" /> {t('labs.replace')}
                </button>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="bg-ink-50/60 p-5 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Uploaded lab" className="max-h-72 rounded-lg border border-ink-200 object-contain" />
                  ) : (
                    <DemoLabImage />
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
                      {MOCK_LAB_ANALYSIS.results.map((r) => (
                        <tr key={r.name}>
                          <td className="px-4 py-2 text-ink-800">{lang === 'es' ? r.nameEs : r.name}</td>
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
                {lang === 'es' ? MOCK_LAB_ANALYSIS.interpretationEs : MOCK_LAB_ANALYSIS.interpretation}
              </p>
            </div>

            <div className="card p-5">
              <p className="section-title">{t('labs.nextSteps')}</p>
              <ul className="mt-3 space-y-2">
                {nextSteps.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-ink-800">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="btn-primary">{t('labs.addToNote')}</button>
                <button className="btn-secondary">{t('labs.sharePatient')}</button>
                <button className="btn-ghost">{t('labs.exportPdf')}</button>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="card p-5">
              <p className="section-title">{t('labs.possibleConditions')}</p>
              <ul className="mt-3 space-y-3">
                {MOCK_LAB_ANALYSIS.differentials.map((d) => (
                  <li key={d.label} className="rounded-xl border border-ink-200 p-3 bg-white">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink-900">{lang === 'es' ? d.labelEs : d.label}</p>
                      <Likelihood level={d.likelihood} />
                    </div>
                    <p className="mt-1 text-xs text-ink-600 leading-relaxed">
                      {lang === 'es' ? d.reasoningEs : d.reasoning}
                    </p>
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

            <div className="card p-5">
              <p className="section-title">{t('labs.recentLabs')}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {recentItems.map((r) => (
                  <li key={r.name} className="flex items-center justify-between">
                    <span className="text-ink-800">{r.name}</span>
                    <span className="text-xs text-ink-500">{r.when}</span>
                  </li>
                ))}
              </ul>
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
  return <span className={`pill ${map[level] ?? map.Low}`}>{t<string>(`likelihood.${level}`)}</span>;
}

function DemoLabImage() {
  return (
    <div className="w-full max-w-xs aspect-[3/4] rounded-lg border border-ink-200 bg-white shadow-sm p-4 text-[10px] leading-tight text-ink-700">
      <div className="border-b border-ink-200 pb-2 flex items-center justify-between">
        <span className="font-bold text-brand-700">QuestLab</span>
        <span className="text-ink-400">Acc# 4493128</span>
      </div>
      <p className="mt-2 font-semibold">Patient: Margaret Chen, 64F</p>
      <p className="text-ink-400">Collected: 2026-05-04</p>
      <table className="mt-2 w-full text-[10px]">
        <thead>
          <tr className="text-ink-400 border-b border-ink-100">
            <th className="text-left font-medium py-1">Test</th>
            <th className="text-right font-medium py-1">Value</th>
            <th className="text-right font-medium py-1">Range</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Glucose, fasting', '168 H', '70-99'],
            ['HbA1c', '8.4 H', '<5.7'],
            ['Creatinine', '1.10', '0.6-1.2'],
            ['eGFR', '64', '>60'],
            ['Sodium', '139', '136-145'],
            ['LDL', '146 H', '<100'],
            ['HDL', '38 L', '>50 (F)'],
            ['Triglycerides', '212 H', '<150'],
            ['TSH', '2.6', '0.4-4.0'],
          ].map((row) => (
            <tr key={row[0]} className="border-b border-ink-50">
              <td className="py-1 pr-2">{row[0]}</td>
              <td
                className={`py-1 text-right tabular-nums ${
                  row[1].includes('H') || row[1].includes('L')
                    ? 'text-red-600 font-semibold'
                    : 'text-ink-800'
                }`}
              >
                {row[1]}
              </td>
              <td className="py-1 text-right text-ink-400">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
