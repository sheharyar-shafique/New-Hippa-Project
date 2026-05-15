import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { formatDate, initials, relTime } from '../lib/utils';
import { useT, useLang } from '../i18n/LanguageProvider';
import { api, Patient } from '../lib/api';

export default function Patients() {
  const t = useT();
  const { lang } = useLang();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { patients } = await api.get<{ patients: Patient[] }>('/patients');
      setPatients(patients);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.mrn ?? '').toLowerCase().includes(q) ||
        p.conditions.some((c) => c.toLowerCase().includes(q))
    );
  }, [patients, query]);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">{t('patients.title')}</h1>
          <p className="text-ink-600 mt-1">
            {patients.length} {t('patients.subtitleA')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary"><Filter className="w-4 h-4" /> {t('common.filters')}</button>
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <Plus className="w-4 h-4" /> {t('common.addPatient')}
          </button>
        </div>
      </div>

      <div className="card p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-9 bg-ink-50 border-transparent focus:bg-white"
            placeholder={t<string>('patients.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="px-5 py-10 text-sm text-ink-500 text-center">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm">
            <p className="text-ink-700 font-semibold">
              {patients.length === 0
                ? lang === 'es'
                  ? 'Sin pacientes todavía'
                  : 'No patients yet'
                : lang === 'es'
                ? 'Ningún resultado'
                : 'No matches'}
            </p>
            <p className="text-ink-500 mt-1">
              {lang === 'es'
                ? 'Agregue un paciente para comenzar.'
                : 'Add a patient to get started.'}
            </p>
            <button onClick={() => setModalOpen(true)} className="mt-5 btn-primary">
              <Plus className="w-4 h-4" /> {t('common.addPatient')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-ink-50/60 text-xs uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">{t('patients.colPatient')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('patients.colMrn')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('patients.colConditions')}</th>
                  <th className="text-left font-semibold px-5 py-3">{t('patients.colLastVisit')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200/70">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-ink-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                          {initials(p.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900">{p.name}</p>
                          <p className="text-xs text-ink-500">
                            {p.age} ·{' '}
                            {p.sex === 'F'
                              ? t('patients.female')
                              : p.sex === 'M'
                              ? t('patients.male')
                              : '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-ink-600">{p.mrn ?? '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {p.conditions.map((c) => (
                          <span key={c} className="pill bg-ink-100 text-ink-700">{c}</span>
                        ))}
                        {p.conditions.length === 0 && (
                          <span className="text-xs text-ink-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-ink-700">
                      <p>{formatDate(p.updatedAt, lang)}</p>
                      <p className="text-xs text-ink-500">{relTime(p.updatedAt, lang)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <AddPatientModal
          onClose={() => setModalOpen(false)}
          onCreated={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function AddPatientModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (p: Patient) => void;
}) {
  const t = useT();
  const { lang } = useLang();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'M' | 'F' | 'X'>('F');
  const [mrn, setMrn] = useState('');
  const [conditionsText, setConditionsText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const conditions = conditionsText
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const { patient } = await api.post<{ patient: Patient }>('/patients', {
        name,
        age: Number(age),
        sex,
        mrn: mrn || null,
        conditions,
      });
      onCreated(patient);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create patient');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft w-full max-w-md p-6 animate-fade-up">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">{t('common.addPatient')}</h2>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <div>
            <label className="label">
              {lang === 'es' ? 'Nombre completo' : 'Full name'}
            </label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{lang === 'es' ? 'Edad' : 'Age'}</label>
              <input
                className="input"
                type="number"
                min={0}
                max={130}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">{lang === 'es' ? 'Sexo' : 'Sex'}</label>
              <select
                className="input"
                value={sex}
                onChange={(e) => setSex(e.target.value as 'M' | 'F' | 'X')}
              >
                <option value="F">{t('patients.female')}</option>
                <option value="M">{t('patients.male')}</option>
                <option value="X">{lang === 'es' ? 'Otro' : 'Other'}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">
              MRN ({lang === 'es' ? 'opcional' : 'optional'})
            </label>
            <input
              className="input"
              value={mrn}
              onChange={(e) => setMrn(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              {lang === 'es'
                ? 'Condiciones activas (separadas por coma)'
                : 'Active conditions (comma-separated)'}
            </label>
            <input
              className="input"
              placeholder="HTN, DM2, GERD"
              value={conditionsText}
              onChange={(e) => setConditionsText(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              {t('common.cancel')}
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? lang === 'es'
                  ? 'Guardando…'
                  : 'Saving…'
                : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
