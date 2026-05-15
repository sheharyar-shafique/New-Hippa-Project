import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic,
  FlaskConical,
  FileText,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import StatusPill from '../components/StatusPill';
import { formatDate, formatDuration, initials, relTime } from '../lib/utils';
import { useT, useLang } from '../i18n/LanguageProvider';
import { api, Patient, Visit } from '../lib/api';
import { useAuth } from '../lib/AuthProvider';

export default function Dashboard() {
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const { user } = useAuth();

  const [notes, setNotes] = useState<Visit[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [notesRes, patientsRes] = await Promise.all([
          api.get<{ notes: Visit[] }>('/notes?limit=10'),
          api.get<{ patients: Patient[] }>('/patients'),
        ]);
        if (cancelled) return;
        setNotes(notesRes.notes);
        setPatients(patientsRes.patients);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const greeting = user
    ? lang === 'es'
      ? `Buenos días, Dr. ${user.lastName}`
      : `Good morning, Dr. ${user.lastName}`
    : t('dashboard.greeting');

  const signedToday = notes.filter(
    (n) => n.status === 'signed' && isToday(n.createdAt)
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">
            {greeting} 👋
          </h1>
          <p className="text-ink-600 mt-1">
            {t('dashboard.todayPrompt')}{' '}
            <span className="font-semibold text-ink-900">
              {patients.length} {lang === 'es' ? 'paciente(s)' : 'patient(s)'}
            </span>{' '}
            {lang === 'es' ? 'registrados.' : 'on file.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/app/labs')} className="btn-secondary">
            <FlaskConical className="w-4 h-4" /> {t('common.analyzeLab')}
          </button>
          <button onClick={() => navigate('/app/new')} className="btn-primary">
            <Plus className="w-4 h-4" /> {t('common.newConsultation')}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat
          icon={FileText}
          label={t<string>('dashboard.stats.notesWeek')}
          value={`${notes.length}`}
          delta={lang === 'es' ? 'Total de notas' : 'Total notes'}
        />
        <Stat
          icon={Clock}
          label={t<string>('dashboard.stats.avgDraftTime')}
          value="~6s"
          delta={t<string>('dashboard.stats.avgDraftTimeDelta')}
        />
        <Stat
          icon={TrendingUp}
          label={t<string>('dashboard.stats.timeSaved')}
          value={`${Math.round(notes.length * 6)} min`}
          delta={t<string>('dashboard.stats.timeSavedDelta')}
        />
        <Stat
          icon={CheckCircle2}
          label={t<string>('dashboard.stats.notesSigned')}
          value={`${signedToday}`}
          delta={t<string>('dashboard.stats.notesSignedDelta')}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-200/70">
            <h2 className="font-semibold text-ink-900">{t('dashboard.recentTitle')}</h2>
            <Link to="/app/patients" className="text-sm text-brand-700 font-semibold inline-flex items-center gap-1">
              {t('dashboard.viewAll')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <p className="px-5 py-10 text-sm text-ink-500 text-center">Loading…</p>
          ) : notes.length === 0 ? (
            <EmptyNotes navigate={navigate} lang={lang} />
          ) : (
            <ul className="divide-y divide-ink-200/70">
              {notes.map((n) => (
                <li key={n.id}>
                  <Link
                    to={`/app/notes/${n.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-ink-50/70 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-semibold text-sm">
                      {initials(n.patient?.name ?? '?')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-ink-900 truncate">{n.patient?.name ?? '—'}</p>
                        {n.patient && (
                          <span className="text-xs text-ink-500">
                            · {n.patient.age}{n.patient.sex.toLowerCase()}
                          </span>
                        )}
                        <StatusPill label={n.status} variant={n.status} translateAs="status" />
                      </div>
                      <p className="text-sm text-ink-600 truncate">
                        {n.chiefComplaint ?? '—'}
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-xs text-ink-500">
                      <span>{relTime(n.createdAt, lang)}</span>
                      <span>
                        {n.durationSec ? formatDuration(n.durationSec) + ' · ' : ''}
                        {formatDate(n.createdAt, lang)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-semibold text-ink-900">{t('dashboard.scheduleTitle')}</h2>
            {patients.length === 0 ? (
              <p className="mt-3 text-sm text-ink-500">
                {lang === 'es' ? 'Sin pacientes todavía.' : 'No patients yet.'}
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {patients.slice(0, 4).map((p) => (
                  <li key={p.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-ink-100 text-ink-700 text-xs font-bold flex items-center justify-center">
                      {initials(p.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{p.name}</p>
                      <p className="text-xs text-ink-500 truncate">
                        {p.conditions.slice(0, 2).join(' · ') || '—'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/app/patients" className="mt-4 btn-secondary w-full inline-flex">
              {t('dashboard.viewSchedule')}
            </Link>
          </div>

          <div className="rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white p-5 shadow-soft">
            <Mic className="w-6 h-6" />
            <p className="mt-3 font-semibold">{t('dashboard.ctaTitle')}</p>
            <p className="text-sm text-white/80 mt-1">{t('dashboard.ctaBody')}</p>
            <button onClick={() => navigate('/app/new')} className="mt-4 btn bg-white text-brand-700 hover:bg-ink-50 w-full">
              {t('common.newConsultation')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyNotes({
  navigate,
  lang,
}: {
  navigate: ReturnType<typeof useNavigate>;
  lang: 'en' | 'es';
}) {
  return (
    <div className="px-6 py-12 text-center text-sm">
      <p className="text-ink-700 font-semibold">
        {lang === 'es' ? 'Aún no hay notas' : 'No notes yet'}
      </p>
      <p className="text-ink-500 mt-1 max-w-sm mx-auto">
        {lang === 'es'
          ? 'Grabe su primera consulta para generar una nota SOAP en segundos.'
          : 'Record your first consultation to generate a SOAP note in seconds.'}
      </p>
      <button onClick={() => navigate('/app/new')} className="mt-5 btn-primary">
        <Plus className="w-4 h-4" />{' '}
        {lang === 'es' ? 'Nueva consulta' : 'New consultation'}
      </button>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  delta,
}: {
  icon: any;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-xs text-brand-700 mt-1">{delta}</p>
    </div>
  );
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}
