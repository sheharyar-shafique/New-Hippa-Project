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
import { useT, useLang } from '../i18n/LanguageProvider';

type SectionKey = 'subjective' | 'objective' | 'assessment' | 'plan';

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const baseNote = useMemo(() => NOTES.find((n) => n.id === id) ?? NOTES[0], [id]);
  const [note, setNote] = useState<SoapNote>(baseNote);
  const [regenerating, setRegenerating] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const SECTIONS: { key: SectionKey; label: string; hint: string }[] = [
    { key: 'subjective', label: t<string>('note.sectionSubjective'), hint: t<string>('note.hintSubjective') },
    { key: 'objective', label: t<string>('note.sectionObjective'), hint: t<string>('note.hintObjective') },
    { key: 'assessment', label: t<string>('note.sectionAssessment'), hint: t<string>('note.hintAssessment') },
    { key: 'plan', label: t<string>('note.sectionPlan'), hint: t<string>('note.hintPlan') },
  ];

  const valueFor = (key: SectionKey): string => {
    if (lang === 'es') {
      const esMap: Record<SectionKey, keyof SoapNote> = {
        subjective: 'subjectiveEs',
        objective: 'objectiveEs',
        assessment: 'assessmentEs',
        plan: 'planEs',
      };
      return note[esMap[key]] as string;
    }
    return note[key] as string;
  };

  const updateSection = (key: SectionKey, value: string) => {
    setNote((n) => {
      if (lang === 'es') {
        const esKeyMap: Record<SectionKey, keyof SoapNote> = {
          subjective: 'subjectiveEs',
          objective: 'objectiveEs',
          assessment: 'assessmentEs',
          plan: 'planEs',
        };
        return { ...n, [esKeyMap[key]]: value } as SoapNote;
      }
      return { ...n, [key]: value };
    });
  };

  const regenerate = (key: string) => {
    setRegenerating(key);
    setTimeout(() => setRegenerating(null), 900);
  };

  const save = () => setSavedAt(new Date());

  const askExamples = t<string[]>('note.askExamples');

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center gap-3 text-sm">
        <button onClick={() => navigate(-1)} className="btn-ghost px-2">
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </button>
        <Link to="/app" className="text-ink-500 hover:text-ink-700">{t('note.breadcrumbNotes')}</Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-700 font-medium truncate">{note.patientName}</span>
      </div>

      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink-900">{note.patientName}</h1>
              <span className="text-ink-500">· {note.age}{note.sex}</span>
              <StatusPill label={note.status} variant={note.status} translateAs="status" />
            </div>
            <p className="text-ink-600 mt-1">{lang === 'es' ? note.visitTypeEs : note.visitType}</p>
            <p className="text-sm text-ink-500 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{formatDate(note.createdAt, lang)} · {formatTime(note.createdAt, lang)}</span>
              <span>· {t('note.durationLabel')} {formatDuration(note.durationSec)}</span>
              <span className="inline-flex items-center gap-1 text-brand-700">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('common.encryptedAtRest')}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary"><Copy className="w-4 h-4" /> {t('common.copy')}</button>
            <button className="btn-secondary"><Download className="w-4 h-4" /> {t('common.export')}</button>
            <button onClick={save} className="btn-secondary"><Save className="w-4 h-4" /> {t('common.saveDraft')}</button>
            <button className="btn-primary"><Send className="w-4 h-4" /> {t('note.signSend')}</button>
          </div>
        </div>
        {savedAt && (
          <p className="mt-3 text-xs text-brand-700 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t('note.savedAt')} {formatTime(savedAt.toISOString(), lang)}
          </p>
        )}
      </div>

      <div className="card p-5">
        <p className="section-title">{t('note.chiefComplaint')}</p>
        <p className="mt-2 text-ink-800 font-medium">
          {lang === 'es' ? note.chiefComplaintEs : note.chiefComplaint}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
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
                  <button onClick={() => regenerate(s.key)} className="btn-ghost text-xs">
                    <RefreshCw className={`w-3.5 h-3.5 ${regenerating === s.key ? 'animate-spin' : ''}`} />
                    {t('note.regenerate')}
                  </button>
                </div>
              </div>
              <textarea
                value={valueFor(s.key)}
                onChange={(e) => updateSection(s.key, e.target.value)}
                rows={Math.max(4, Math.ceil(valueFor(s.key).length / 90))}
                className="mt-3 w-full text-[15px] leading-relaxed text-ink-800 bg-ink-50/40 border border-ink-200 rounded-xl p-4 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition"
              />
              {regenerating === s.key && (
                <p className="mt-2 text-xs text-brand-700 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {t('note.redrafting')}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="section-title">{t('note.suggestedICD')}</p>
              <button className="text-xs text-brand-700 font-semibold">{t('note.acceptAll')}</button>
            </div>
            <ul className="mt-3 space-y-2">
              {note.icd10.map((c) => (
                <li
                  key={c.code}
                  className="flex items-center justify-between gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{c.code}</p>
                    <p className="text-xs text-ink-500 truncate">{lang === 'es' ? c.labelEs : c.label}</p>
                  </div>
                  <button className="text-brand-700 text-xs font-semibold inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t('note.add')}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <p className="section-title">{t('note.askTitle')}</p>
            <p className="text-xs text-ink-500 mt-1">{t('note.askHint')}</p>
            <div className="mt-3 space-y-2">
              {askExamples.map((q) => (
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
              <input className="input pr-10" placeholder={t<string>('note.askPlaceholder')} />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 btn-primary px-3 py-1.5 text-xs">
                {t('note.askButton')}
              </button>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <p className="section-title">{t('note.transcript')}</p>
              <button className="text-xs text-brand-700 font-semibold inline-flex items-center gap-1">
                <PencilLine className="w-3.5 h-3.5" /> {t('common.edit')}
              </button>
            </div>
            <div className="mt-3 max-h-72 overflow-auto pr-2 space-y-3 text-sm">
              {(lang === 'es' ? TRANSCRIPT_ES : TRANSCRIPT_EN).map((line, i) => (
                <TranscriptLine key={i} {...line} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TRANSCRIPT_EN = [
  { speaker: 'Doctor', t: '00:00', text: 'Hi Margaret, good to see you. How have you been feeling?' },
  { speaker: 'Patient', t: '00:06', text: 'Tired the last couple of weeks. I’m running to the bathroom more than usual.' },
  { speaker: 'Doctor', t: '00:18', text: 'Any changes to your diet or medications?' },
  { speaker: 'Patient', t: '00:22', text: 'Holidays were rough. I’ve been pretty consistent with the metformin.' },
  { speaker: 'Doctor', t: '00:38', text: 'Let’s check your numbers — A1c came back at 8.4 today, up from 7.6.' },
  { speaker: 'Patient', t: '00:51', text: 'That’s higher than last time, isn’t it?' },
  { speaker: 'Doctor', t: '00:54', text: 'Yes. We’ll add empagliflozin and adjust the lisinopril. I’ll explain why…' },
];

const TRANSCRIPT_ES = [
  { speaker: 'Médico', t: '00:00', text: 'Hola Margaret, qué gusto verla. ¿Cómo se ha sentido?' },
  { speaker: 'Paciente', t: '00:06', text: 'Cansada en las últimas semanas. Estoy yendo al baño más de lo normal.' },
  { speaker: 'Médico', t: '00:18', text: '¿Algún cambio en su dieta o medicamentos?' },
  { speaker: 'Paciente', t: '00:22', text: 'Las fiestas estuvieron pesadas. He sido constante con la metformina.' },
  { speaker: 'Médico', t: '00:38', text: 'Veamos sus números — la A1c salió en 8.4 hoy, subió desde 7.6.' },
  { speaker: 'Paciente', t: '00:51', text: 'Eso es más alto que la vez pasada, ¿verdad?' },
  { speaker: 'Médico', t: '00:54', text: 'Sí. Vamos a agregar empagliflozina y a ajustar el lisinopril. Le explico por qué…' },
];

function TranscriptLine({ speaker, t: time, text }: { speaker: string; t: string; text: string }) {
  const isDoctor = speaker === 'Doctor' || speaker === 'Médico';
  return (
    <div className="flex gap-2">
      <span className="text-xs font-mono text-ink-400 w-12 shrink-0">{time}</span>
      <div>
        <p className={`text-xs font-semibold ${isDoctor ? 'text-brand-700' : 'text-ink-700'}`}>{speaker}</p>
        <p className="text-sm text-ink-700 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
