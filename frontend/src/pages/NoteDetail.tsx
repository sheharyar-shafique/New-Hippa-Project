import { useCallback, useEffect, useMemo, useState } from 'react';
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
  ShieldCheck,
} from 'lucide-react';
import StatusPill from '../components/StatusPill';
import Brandify from '../components/Brandify';
import { formatDate, formatDuration, formatTime } from '../lib/utils';
import { useT, useLang } from '../i18n/LanguageProvider';
import { api, Visit, Icd10 } from '../lib/api';

type SectionKey = 'subjective' | 'objective' | 'assessment' | 'plan';

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();

  const [note, setNote] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const SECTIONS: { key: SectionKey; label: string; hint: string }[] = useMemo(
    () => [
      { key: 'subjective', label: t<string>('note.sectionSubjective'), hint: t<string>('note.hintSubjective') },
      { key: 'objective',  label: t<string>('note.sectionObjective'),  hint: t<string>('note.hintObjective') },
      { key: 'assessment', label: t<string>('note.sectionAssessment'), hint: t<string>('note.hintAssessment') },
      { key: 'plan',       label: t<string>('note.sectionPlan'),       hint: t<string>('note.hintPlan') },
    ],
    [t]
  );

  // Load the note.
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const { note } = await api.get<{ note: Visit }>(`/notes/${id}`);
        if (!cancelled) setNote(note);
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? 'Failed to load note');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateSection = (key: SectionKey, value: string) => {
    setNote((n) => (n ? { ...n, [key]: value } : n));
  };

  const save = useCallback(async () => {
    if (!note) return;
    setSaving(true);
    setError(null);
    try {
      const { note: updated } = await api.patch<{ note: Visit }>(`/notes/${note.id}`, {
        chiefComplaint: note.chiefComplaint ?? undefined,
        subjective: note.subjective ?? undefined,
        objective: note.objective ?? undefined,
        assessment: note.assessment ?? undefined,
        plan: note.plan ?? undefined,
        icd10Codes: note.icd10Codes ?? undefined,
      });
      setNote(updated);
      setSavedAt(new Date());
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save note');
    } finally {
      setSaving(false);
    }
  }, [note]);

  const sign = useCallback(async () => {
    if (!note) return;
    setSaving(true);
    setError(null);
    try {
      const { note: updated } = await api.patch<{ note: Visit }>(`/notes/${note.id}`, {
        status: 'signed',
      });
      setNote(updated);
      setSavedAt(new Date());
    } catch (err: any) {
      setError(err?.message ?? 'Failed to sign note');
    } finally {
      setSaving(false);
    }
  }, [note]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto text-sm text-ink-500 py-12 text-center">Loading…</div>
    );
  }

  if (!note) {
    return (
      <div className="max-w-7xl mx-auto py-12 text-center">
        <p className="text-ink-700 font-semibold">
          {lang === 'es' ? 'Nota no encontrada' : 'Note not found'}
        </p>
        <p className="text-ink-500 mt-1 text-sm">{error}</p>
        <button onClick={() => navigate('/app')} className="mt-5 btn-secondary">
          {t('common.back')}
        </button>
      </div>
    );
  }

  const icd10List = (note.icd10Codes ?? []) as Icd10[];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center gap-3 text-sm">
        <button onClick={() => navigate(-1)} className="btn-ghost px-2">
          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
        </button>
        <Link to="/app" className="text-ink-500 hover:text-ink-700">{t('note.breadcrumbNotes')}</Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-700 font-medium truncate">{note.patient?.name ?? '—'}</span>
      </div>

      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-ink-900">{note.patient?.name ?? '—'}</h1>
              {note.patient && (
                <span className="text-ink-500">
                  · {note.patient.age}{note.patient.sex}
                </span>
              )}
              <StatusPill label={note.status} variant={note.status} translateAs="status" />
            </div>
            <p className="text-ink-600 mt-1">{note.visitType}</p>
            <p className="text-sm text-ink-500 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{formatDate(note.createdAt, lang)} · {formatTime(note.createdAt, lang)}</span>
              {note.durationSec ? (
                <span>· {t('note.durationLabel')} {formatDuration(note.durationSec)}</span>
              ) : null}
              <span className="inline-flex items-center gap-1 text-brand-700">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('common.encryptedAtRest')}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="btn-secondary"
              onClick={() => {
                const text = formatNoteForCopy(note);
                if (navigator.clipboard) navigator.clipboard.writeText(text);
              }}
            >
              <Copy className="w-4 h-4" /> {t('common.copy')}
            </button>
            <button
              className="btn-secondary"
              onClick={() => downloadAsTextFile(note)}
            >
              <Download className="w-4 h-4" /> {t('common.export')}
            </button>
            <button onClick={save} className="btn-secondary" disabled={saving}>
              <Save className="w-4 h-4" /> {t('common.saveDraft')}
            </button>
            <button onClick={sign} className="btn-primary" disabled={saving || note.status === 'signed'}>
              <Send className="w-4 h-4" /> {t('note.signSend')}
            </button>
          </div>
        </div>
        {error && (
          <p className="mt-3 text-xs text-red-600 inline-flex items-center gap-1.5">
            {error}
          </p>
        )}
        {savedAt && !error && (
          <p className="mt-3 text-xs text-brand-700 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t('note.savedAt')} {formatTime(savedAt.toISOString(), lang)}
          </p>
        )}
      </div>

      <div className="card p-5">
        <p className="section-title">{t('note.chiefComplaint')}</p>
        <input
          className="input mt-2 font-medium"
          value={note.chiefComplaint ?? ''}
          onChange={(e) => setNote((n) => (n ? { ...n, chiefComplaint: e.target.value } : n))}
          placeholder="—"
        />
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
                <button className="btn-ghost text-xs" disabled>
                  <RefreshCw className="w-3.5 h-3.5" /> {t('note.regenerate')}
                </button>
              </div>
              <textarea
                value={(note[s.key] as string) ?? ''}
                onChange={(e) => updateSection(s.key, e.target.value)}
                rows={Math.max(4, Math.ceil(((note[s.key] as string) ?? '').length / 90))}
                className="mt-3 w-full text-[15px] leading-relaxed text-ink-800 bg-ink-50/40 border border-ink-200 rounded-xl p-4 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <p className="section-title">{t('note.suggestedICD')}</p>
            {icd10List.length === 0 ? (
              <p className="mt-3 text-sm text-ink-500">—</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {icd10List.map((c) => (
                  <li
                    key={c.code}
                    className="flex items-center justify-between gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900">{c.code}</p>
                      <p className="text-xs text-ink-500 truncate">{c.label}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card p-5">
            <p className="section-title"><Brandify>{t<string>('note.askTitle')}</Brandify></p>
            <p className="text-xs text-ink-500 mt-1">{t('note.askHint')}</p>
            <p className="text-xs text-ink-400 mt-3">
              {lang === 'es' ? 'Próximamente.' : 'Coming soon.'}
            </p>
          </div>

          {note.transcript && (
            <div className="card p-5">
              <p className="section-title">{t('note.transcript')}</p>
              <div className="mt-3 max-h-72 overflow-auto pr-2 text-sm text-ink-700 leading-relaxed whitespace-pre-wrap">
                {note.transcript}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatNoteForCopy(n: Visit): string {
  const lines: string[] = [];
  lines.push(`Patient: ${n.patient?.name ?? '—'}`);
  if (n.chiefComplaint) lines.push(`CC: ${n.chiefComplaint}`);
  lines.push('');
  if (n.subjective) lines.push(`SUBJECTIVE:\n${n.subjective}`);
  if (n.objective) lines.push(`\nOBJECTIVE:\n${n.objective}`);
  if (n.assessment) lines.push(`\nASSESSMENT:\n${n.assessment}`);
  if (n.plan) lines.push(`\nPLAN:\n${n.plan}`);
  return lines.join('\n');
}

function downloadAsTextFile(n: Visit) {
  const text = formatNoteForCopy(n);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `note-${n.id}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
