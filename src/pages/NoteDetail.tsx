import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Save,
  Send,
  Download,
  Copy,
  CheckCircle2,
  RefreshCw,
  PencilLine,
  ShieldCheck,
} from 'lucide-react';
import { NOTES, SoapNote } from '../lib/mockData';
import StatusPill from '../components/StatusPill';
import { formatDate, formatDuration, formatTime } from '../lib/utils';

const SECTIONS: { key: keyof Pick<SoapNote, 'subjective' | 'objective' | 'assessment' | 'plan'>; label: string; hint: string }[] = [
  { key: 'subjective', label: 'Subjective', hint: 'Patient-reported history, ROS, context' },
  { key: 'objective', label: 'Objective', hint: 'Vitals, exam findings, lab data' },
  { key: 'assessment', label: 'Assessment', hint: 'Clinical reasoning & differentials' },
  { key: 'plan', label: 'Plan', hint: 'Treatment, follow-up, patient instructions' },
];

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseNote = useMemo(() => NOTES.find((n) => n.id === id) ?? NOTES[0], [id]);
  const [note, setNote] = useState<SoapNote>(baseNote);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const update = (key: keyof SoapNote, value: string) =>
    setNote((n) => ({ ...n, [key]: value }));

  const regenerate = (key: string) => {
    setRegenerating(key);
    setTimeout(() => setRegenerating(null), 900);
  };

  const save = () => setSavedAt(new Date());

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center gap-3 text-sm">
        <button onClick={() => navigate(-1)} className="btn-ghost px-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <Link to="/app" className="text-ink-500 hover:text-ink-700">Notes</Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-700 font-medium truncate">{note.patientName}</span>
      </div>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink-900">{note.patientName}</h1>
              <span className="text-ink-500">· {note.age}{note.sex}</span>
              <StatusPill label={note.status} variant={note.status} />
            </div>
            <p className="text-ink-600 mt-1">{note.visitType}</p>
            <p className="text-sm text-ink-500 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{formatDate(note.createdAt)} · {formatTime(note.createdAt)}</span>
              <span>· Recording {formatDuration(note.durationSec)}</span>
              <span className="inline-flex items-center gap-1 text-brand-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Encrypted at rest
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary"><Copy className="w-4 h-4" /> Copy</button>
            <button className="btn-secondary"><Download className="w-4 h-4" /> Export</button>
            <button onClick={save} className="btn-secondary"><Save className="w-4 h-4" /> Save draft</button>
            <button className="btn-primary"><Send className="w-4 h-4" /> Sign &amp; send to EHR</button>
          </div>
        </div>
        {savedAt && (
          <p className="mt-3 text-xs text-brand-700 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Saved at {formatTime(savedAt.toISOString())}
          </p>
        )}
      </div>

      {/* Chief complaint */}
      <div className="card p-5">
        <p className="section-title">Chief complaint</p>
        <p className="mt-2 text-ink-800 font-medium">{note.chiefComplaint}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* SOAP */}
        <div className="lg:col-span-2 space-y-4">
          {SECTIONS.map((s) => (
            <div key={s.key} className="card p-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-semibold text-ink-900 inline-flex items-center gap-2">
                    <span className="w-7 h-7 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-bold">
                      {s.label[0]}
                    </span>
                    {s.label}
                  </h2>
                  <p className="text-xs text-ink-500 mt-1">{s.hint}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => regenerate(s.key)}
                    className="btn-ghost text-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${regenerating === s.key ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                </div>
              </div>
              <textarea
                value={note[s.key]}
                onChange={(e) => update(s.key, e.target.value)}
                rows={Math.max(4, Math.ceil(note[s.key].length / 90))}
                className="mt-3 w-full text-[15px] leading-relaxed text-ink-800 bg-ink-50/40 border border-ink-200 rounded-xl p-4 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition"
              />
              {regenerating === s.key && (
                <p className="mt-2 text-xs text-brand-700 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Re-drafting from transcript…
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Side: ICD-10, transcript, AI helpers */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="section-title">Suggested ICD-10</p>
              <button className="text-xs text-brand-700 font-semibold">Accept all</button>
            </div>
            <ul className="mt-3 space-y-2">
              {note.icd10.map((c) => (
                <li
                  key={c.code}
                  className="flex items-center justify-between gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{c.code}</p>
                    <p className="text-xs text-ink-500 truncate">{c.label}</p>
                  </div>
                  <button className="text-brand-700 text-xs font-semibold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Add
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="section-title">Ask MedScribe</p>
            <p className="text-xs text-ink-500 mt-1">
              Quick clinical questions about this note (decision support, not a diagnosis).
            </p>
            <div className="mt-3 space-y-2">
              {[
                'Summarize change in A1c over last year',
                'Suggest patient-friendly visit summary',
                'Check for drug interactions',
              ].map((q) => (
                <button
                  key={q}
                  className="w-full text-left text-sm rounded-lg border border-ink-200 bg-white px-3 py-2 hover:border-brand-300 hover:bg-brand-50/40"
                >
                  <Sparkles className="inline w-3.5 h-3.5 mr-2 text-brand-600" />
                  {q}
                </button>
              ))}
            </div>
            <div className="mt-3 relative">
              <input className="input pr-10" placeholder="Type a question…" />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary px-3 py-1.5 text-xs">
                Ask
              </button>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="section-title">Transcript</p>
              <button className="text-xs text-brand-700 font-semibold inline-flex items-center gap-1">
                <PencilLine className="w-3.5 h-3.5" /> Edit
              </button>
            </div>
            <div className="mt-3 max-h-72 overflow-auto pr-2 space-y-3 text-sm">
              <TranscriptLine speaker="Doctor" t="00:00" text="Hi Margaret, good to see you. How have you been feeling?" />
              <TranscriptLine speaker="Patient" t="00:06" text="Tired the last couple of weeks. I’m running to the bathroom more than usual." />
              <TranscriptLine speaker="Doctor" t="00:18" text="Any changes to your diet or medications?" />
              <TranscriptLine speaker="Patient" t="00:22" text="Holidays were rough. I’ve been pretty consistent with the metformin." />
              <TranscriptLine speaker="Doctor" t="00:38" text="Let’s check your numbers — A1c came back at 8.4 today, up from 7.6." />
              <TranscriptLine speaker="Patient" t="00:51" text="That’s higher than last time, isn’t it?" />
              <TranscriptLine speaker="Doctor" t="00:54" text="Yes. We’ll add empagliflozin and adjust the lisinopril. I’ll explain why…" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptLine({
  speaker,
  t,
  text,
}: {
  speaker: string;
  t: string;
  text: string;
}) {
  return (
    <div className="flex gap-2">
      <span className="text-xs font-mono text-ink-400 w-12 shrink-0">{t}</span>
      <div>
        <p className={`text-xs font-semibold ${speaker === 'Doctor' ? 'text-brand-700' : 'text-ink-700'}`}>
          {speaker}
        </p>
        <p className="text-sm text-ink-700 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
