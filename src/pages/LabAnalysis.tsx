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
import { MOCK_LAB_ANALYSIS } from '../lib/mockData';

type Phase = 'idle' | 'analyzing' | 'done';

export default function LabAnalysis() {
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            Lab analysis
          </h1>
          <p className="text-ink-600 mt-1 max-w-2xl">
            Upload a photo of a printed lab or attach a PDF. MedScribe extracts every
            value, flags abnormalities, and explains likely conditions in plain clinical language.
          </p>
        </div>
        <span className="pill bg-brand-50 text-brand-700 border border-brand-100">
          <ShieldCheck className="w-3.5 h-3.5" /> PHI encrypted on AWS
        </span>
      </div>

      {phase === 'idle' && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="card p-7">
            <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-soft">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-ink-900">Upload a lab</h2>
            <p className="mt-1 text-sm text-ink-600">
              JPG, PNG, HEIC, or PDF. Up to 25 MB.
            </p>
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
              }}
              className="mt-5 block border-2 border-dashed border-ink-200 rounded-xl px-6 py-10 text-center hover:border-brand-300 hover:bg-brand-50/30 transition cursor-pointer"
            >
              <Upload className="w-7 h-7 mx-auto text-brand-600" />
              <p className="mt-2 font-semibold text-ink-800">
                Drop a lab image or PDF here
              </p>
              <p className="text-sm text-ink-500">or click to browse</p>
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
                  <ImageIcon className="w-4 h-4" /> Choose file
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); useDemo(); }}
                  className="btn-secondary"
                >
                  <Sparkles className="w-4 h-4" /> Try demo lab
                </button>
              </div>
            </label>

            <div className="mt-5 grid sm:grid-cols-3 gap-2 text-xs text-ink-500">
              <Tip icon={Camera} label="Photo from phone" />
              <Tip icon={FileText} label="PDF from EHR" />
              <Tip icon={ImageIcon} label="Scanned printout" />
            </div>
          </div>

          <div className="card p-7">
            <h3 className="text-lg font-semibold text-ink-900">What you&rsquo;ll get back</h3>
            <ul className="mt-4 space-y-3">
              <Feat icon={Brain} title="Full result extraction" body="Every analyte, value, unit and reference range — flagged H/L/Crit." />
              <Feat icon={Sparkles} title="Plain-language interpretation" body="What the pattern likely means, written like a colleague explaining it." />
              <Feat icon={AlertTriangle} title="Ranked differentials" body="Most likely conditions with one-line reasoning and suggested next steps." />
              <Feat icon={ShieldCheck} title="Confidence + source" body="OCR confidence, model rationale, and a link back to the original image." />
            </ul>
            <div className="mt-6 rounded-xl bg-ink-50 border border-ink-200 p-4 text-sm text-ink-600">
              <strong className="text-ink-800">Decision support — not a diagnosis.</strong>{' '}
              Final interpretation and management remain with the treating clinician.
            </div>
          </div>
        </div>
      )}

      {phase === 'analyzing' && (
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-full bg-brand-50 mx-auto flex items-center justify-center">
            <Brain className="w-7 h-7 text-brand-600 animate-pulse" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-ink-900">Reading your lab…</h2>
          <p className="text-sm text-ink-500 mt-1">
            {fileName ? `${fileName} · ` : ''}OCR + clinical interpretation
          </p>
          <div className="mt-6 max-w-md mx-auto h-2 bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-ink-500">{Math.round(progress)}%</p>
        </div>
      )}

      {phase === 'done' && (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Image preview + extracted values */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-ink-200/70 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-semibold text-ink-900">{MOCK_LAB_ANALYSIS.panel}</p>
                  <p className="text-xs text-ink-500 mt-0.5">
                    {fileName ?? 'sample-lab.png'} · OCR confidence{' '}
                    <span className="font-semibold text-brand-700">
                      {(MOCK_LAB_ANALYSIS.ocrConfidence * 100).toFixed(0)}%
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => { setPhase('idle'); setPreview(null); setFileName(null); }}
                  className="btn-ghost"
                >
                  <X className="w-4 h-4" /> Replace
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
                    <DemoLabImage />
                  )}
                </div>
                <div>
                  <table className="w-full text-sm">
                    <thead className="text-xs text-ink-500">
                      <tr>
                        <th className="text-left font-medium px-4 py-2">Analyte</th>
                        <th className="text-left font-medium px-4 py-2">Value</th>
                        <th className="text-left font-medium px-4 py-2">Range</th>
                        <th className="text-left font-medium px-4 py-2">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-200/70">
                      {MOCK_LAB_ANALYSIS.results.map((r) => (
                        <tr key={r.name}>
                          <td className="px-4 py-2 text-ink-800">{r.name}</td>
                          <td className="px-4 py-2 font-semibold text-ink-900 tabular-nums">
                            {r.value} <span className="text-xs text-ink-500 font-normal">{r.unit}</span>
                          </td>
                          <td className="px-4 py-2 text-xs text-ink-500">{r.range}</td>
                          <td className="px-4 py-2">
                            <StatusPill label={r.flag} variant={r.flag} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="card p-5">
              <p className="section-title flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Interpretation
              </p>
              <p className="mt-3 text-[15px] text-ink-800 leading-relaxed">
                {MOCK_LAB_ANALYSIS.interpretation}
              </p>
            </div>

            <div className="card p-5">
              <p className="section-title">Suggested next steps</p>
              <ul className="mt-3 space-y-2">
                {MOCK_LAB_ANALYSIS.suggestedNextSteps.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm text-ink-800">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="btn-primary">Add to patient note</button>
                <button className="btn-secondary">Share patient-friendly summary</button>
                <button className="btn-ghost">Export PDF</button>
              </div>
            </div>
          </div>

          {/* Differentials & disclaimer */}
          <div className="space-y-5">
            <div className="card p-5">
              <p className="section-title">Possible conditions</p>
              <ul className="mt-3 space-y-3">
                {MOCK_LAB_ANALYSIS.differentials.map((d) => (
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
                <p className="text-sm text-amber-900 leading-relaxed">
                  {MOCK_LAB_ANALYSIS.disclaimer}
                </p>
              </div>
            </div>

            <div className="card p-5">
              <p className="section-title">Recent labs analyzed</p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  { name: 'CBC w/ differential', when: 'Yesterday' },
                  { name: 'TSH + Free T4', when: '3 days ago' },
                  { name: 'Lipid panel', when: 'Last week' },
                ].map((r) => (
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
  const map: Record<string, string> = {
    High: 'bg-red-50 text-red-700 border border-red-100',
    Moderate: 'bg-amber-50 text-amber-700 border border-amber-100',
    Low: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  };
  return <span className={`pill ${map[level] ?? map.Low}`}>{level}</span>;
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
