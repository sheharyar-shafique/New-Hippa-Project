import { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthProvider';
import {
  User,
  Bell,
  ShieldCheck,
  CreditCard,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { initials } from '../lib/utils';
import Brandify from '../components/Brandify';
import { useT } from '../i18n/LanguageProvider';

export default function Settings() {
  const t = useT();
  const [tab, setTab] = useState('profile');

  const TABS = [
    { id: 'profile', label: t<string>('settings.tabs.profile'), icon: User },
    { id: 'security', label: t<string>('settings.tabs.security'), icon: ShieldCheck },
    { id: 'billing', label: t<string>('settings.tabs.billing'), icon: CreditCard },
    { id: 'templates', label: t<string>('settings.tabs.templates'), icon: Layers },
    { id: 'notifications', label: t<string>('settings.tabs.notifications'), icon: Bell },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">{t('settings.title')}</h1>
        <p className="text-ink-600 mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-5">
        <div className="card p-2 h-fit">
          {TABS.map((tt) => (
            <button
              key={tt.id}
              onClick={() => setTab(tt.id)}
              className={`w-full nav-link ${tab === tt.id ? 'nav-link-active' : ''}`}
            >
              <tt.icon className="w-4 h-4" />
              {tt.label}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'security' && <SecurityTab />}
          {tab === 'billing' && <BillingTab />}
          {tab === 'templates' && <TemplatesTab />}
          {tab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const t = useT();
  return (
    <div className="card p-6">
      <p className="section-title">{t('settings.profileSection')}</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-bold">
          {initials('Alex Reyes')}
        </div>
        <div>
          <button className="btn-secondary text-sm">{t('settings.changePhoto')}</button>
          <p className="text-xs text-ink-500 mt-1">{t('settings.photoHint')}</p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <Field label={t<string>('settings.fields.firstName')} defaultValue="Alex" />
        <Field label={t<string>('settings.fields.lastName')} defaultValue="Reyes" />
        <Field label={t<string>('settings.fields.email')} defaultValue="dr.reyes@clinic.com" />
        <Field label={t<string>('settings.fields.npi')} defaultValue="1234567890" />
        <Field label={t<string>('settings.fields.specialty')} defaultValue={t<string>('common.specialtyDefault')} />
        <Field label={t<string>('settings.fields.clinic')} defaultValue="Northbridge Internal Medicine" />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-ghost">{t('common.cancel')}</button>
        <button className="btn-primary">{t('common.saveChanges')}</button>
      </div>
    </div>
  );
}

function SecurityTab() {
  const t = useT();
  const { user, refresh } = useAuth();
  const rows = t<{ label: string; status: string; sub?: string; action?: string }[]>('settings.hipaaRows');
  const toggles = t<{ label: string; body: string }[]>('settings.toggles');

  // 2FA state
  const [setting2fa, setSetting2fa] = useState(false);
  const [totpUri, setTotpUri] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [code, setCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [showDisable, setShowDisable] = useState(false);
  const [tfaError, setTfaError] = useState<string | null>(null);
  const [tfaLoading, setTfaLoading] = useState(false);

  const is2faEnabled = user?.totpEnabled ?? false;

  const startSetup = async () => {
    setTfaLoading(true);
    setTfaError(null);
    try {
      const { secret, uri } = await api.post<{ secret: string; uri: string }>('/auth/2fa/setup', {});
      setTotpSecret(secret);
      setTotpUri(uri);
      setSetting2fa(true);
    } catch (err: any) {
      setTfaError(err?.message ?? 'Failed to start 2FA setup');
    } finally {
      setTfaLoading(false);
    }
  };

  const confirmEnable = async () => {
    setTfaLoading(true);
    setTfaError(null);
    try {
      await api.post('/auth/2fa/enable', { code });
      await refresh();
      setSetting2fa(false);
      setCode('');
    } catch (err: any) {
      setTfaError(err?.message ?? 'Invalid code');
    } finally {
      setTfaLoading(false);
    }
  };

  const confirmDisable = async () => {
    setTfaLoading(true);
    setTfaError(null);
    try {
      await api.post('/auth/2fa/disable', { code: disableCode });
      await refresh();
      setShowDisable(false);
      setDisableCode('');
    } catch (err: any) {
      setTfaError(err?.message ?? 'Invalid code');
    } finally {
      setTfaLoading(false);
    }
  };

  return (
    <>
      <div className="card p-6">
        <p className="section-title">{t('settings.hipaaSection')}</p>
        <ul className="mt-4 divide-y divide-ink-200/70">
          {rows.map((r) => (
            <Row key={r.label} {...r} />
          ))}
        </ul>
      </div>

      <div className="card p-6">
        <p className="section-title">Two-Factor Authentication (2FA)</p>
        <p className="mt-1 text-sm text-ink-600">
          Add an extra layer of security with a time-based one-time password (TOTP).
        </p>

        {tfaError && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {tfaError}
          </p>
        )}

        {is2faEnabled && !showDisable && (
          <div className="mt-4 flex items-center gap-3">
            <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
            </span>
            <button className="btn-ghost text-sm text-red-600 hover:bg-red-50" onClick={() => { setShowDisable(true); setTfaError(null); }}>
              Disable 2FA
            </button>
          </div>
        )}

        {is2faEnabled && showDisable && (
          <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-3">
            <p className="text-sm font-semibold text-red-800">Enter your current authenticator code to disable 2FA:</p>
            <input
              className="input text-center text-lg tracking-[0.3em] font-mono max-w-[200px]"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <div className="flex gap-2">
              <button className="btn-ghost text-sm" onClick={() => { setShowDisable(false); setTfaError(null); }}>Cancel</button>
              <button className="btn-primary text-sm bg-red-600 hover:bg-red-700" disabled={tfaLoading || disableCode.length !== 6} onClick={confirmDisable}>
                {tfaLoading ? 'Disabling…' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        )}

        {!is2faEnabled && !setting2fa && (
          <button className="mt-4 btn-primary text-sm" onClick={startSetup} disabled={tfaLoading}>
            {tfaLoading ? 'Setting up…' : 'Enable 2FA'}
          </button>
        )}

        {!is2faEnabled && setting2fa && (
          <div className="mt-4 p-4 rounded-xl border border-brand-200 bg-brand-50/30 space-y-4">
            <div>
              <p className="text-sm font-semibold text-ink-900">1. Scan this in your authenticator app</p>
              <p className="text-xs text-ink-500 mt-1">Google Authenticator, Authy, or 1Password</p>
              <div className="mt-3 p-3 bg-white rounded-lg border border-ink-200 break-all text-xs font-mono text-ink-700 select-all">
                {totpUri}
              </div>
              <p className="mt-2 text-xs text-ink-500">Or manually enter this secret: <code className="font-mono bg-ink-100 px-1 py-0.5 rounded select-all">{totpSecret}</code></p>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">2. Enter the 6-digit code to verify</p>
              <input
                className="input text-center text-lg tracking-[0.3em] font-mono max-w-[200px] mt-2"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost text-sm" onClick={() => { setSetting2fa(false); setTfaError(null); }}>Cancel</button>
              <button className="btn-primary text-sm" disabled={tfaLoading || code.length !== 6} onClick={confirmEnable}>
                {tfaLoading ? 'Verifying…' : 'Verify & Enable'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="card p-6">
        <p className="section-title">{t('settings.authSection')}</p>
        <div className="mt-4 space-y-4">
          <Toggle label={toggles[0].label} body={toggles[0].body} enabled />
          <Toggle label={toggles[1].label} body={toggles[1].body} />
          <Toggle label={toggles[2].label} body={toggles[2].body} enabled />
        </div>
      </div>

      <div className="card p-6">
        <p className="section-title">{t('settings.auditSection')}</p>
        <p className="mt-2 text-sm text-ink-600">{t('settings.auditBody')}</p>
        <button className="mt-3 btn-secondary">
          {t('settings.viewAuditLog')} <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

function BillingTab() {
  const t = useT();
  const features = t<string[]>('settings.planFeatures');
  return (
    <>
      <div className="card p-6">
        <p className="section-title">{t('settings.planSection')}</p>
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold text-ink-900 text-lg">{t('settings.planNamePrice')}</p>
            <p className="text-sm text-ink-500 mt-0.5">{t('settings.planMeta')}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">{t('settings.changePlan')}</button>
            <button className="btn-ghost text-red-600 hover:bg-red-50">{t('settings.cancelPlan')}</button>
          </div>
        </div>
        <ul className="mt-5 grid sm:grid-cols-2 gap-2 text-sm text-ink-700">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-6">
        <p className="section-title">{t('settings.paymentSection')}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded-md bg-ink-900 text-white text-[10px] font-bold flex items-center justify-center">VISA</div>
            <div>
              <p className="text-sm font-semibold">{t('settings.cardLast4')}</p>
              <p className="text-xs text-ink-500">{t('settings.cardExpires')}</p>
            </div>
          </div>
          <button className="btn-secondary">{t('settings.update')}</button>
        </div>
      </div>

      <div className="card p-6">
        <p className="section-title">{t('settings.invoicesSection')}</p>
        <ul className="mt-3 divide-y divide-ink-200/70">
          {[
            { d: 'Apr 1, 2026', a: '$179.00' },
            { d: 'Mar 1, 2026', a: '$179.00' },
            { d: 'Feb 1, 2026', a: '$179.00' },
          ].map((i) => (
            <li key={i.d} className="flex items-center justify-between py-3 text-sm">
              <span className="text-ink-700">{i.d}</span>
              <span className="font-semibold tabular-nums">{i.a}</span>
              <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">{t('settings.paid')}</span>
              <button className="text-brand-700 font-semibold">{t('settings.download')}</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function TemplatesTab() {
  const t = useT();

  type Template = {
    id: string;
    name: string;
    specialty: string;
    format: string;
    prompt: string;
  };

  const DEFAULT_TEMPLATES: Template[] = [
    { id: '1', name: 'Internal Medicine — Follow-up / Seguimiento', specialty: 'Internal Medicine', format: 'SOAP', prompt: 'Generate a follow-up SOAP note for an internal medicine patient. Include relevant vitals, current medications, and assessment of chronic conditions.' },
    { id: '2', name: 'Internal Medicine — New Patient / Paciente nuevo', specialty: 'Internal Medicine', format: 'SOAP', prompt: 'Generate a comprehensive new patient intake SOAP note. Include complete history, review of systems, physical examination, and initial assessment with plan.' },
    { id: '3', name: 'Diabetes Management / Manejo de diabetes', specialty: 'Internal Medicine', format: 'SOAP', prompt: 'Generate a diabetes-focused SOAP note. Include A1c trends, glucose logs, medication adjustments, diet/exercise counseling, and complications screening.' },
    { id: '4', name: 'Hypertension Follow-up / Seguimiento HTA', specialty: 'Internal Medicine', format: 'SOAP', prompt: 'Generate a hypertension follow-up SOAP note. Include BP readings, medication efficacy, lifestyle modifications, and target organ damage assessment.' },
    { id: '5', name: 'Acute Visit (Adult) / Consulta aguda (adulto)', specialty: 'Internal Medicine', format: 'SOAP', prompt: 'Generate an acute visit SOAP note. Focus on chief complaint, HPI, targeted exam, differential diagnosis, and treatment plan.' },
    { id: '6', name: 'Annual Wellness / Chequeo anual', specialty: 'Internal Medicine', format: 'SOAP', prompt: 'Generate an annual wellness visit note. Include preventive screenings, immunizations, chronic disease management, and health maintenance counseling.' },
  ];

  const [templates, setTemplates] = useState<Template[]>(() => {
    try {
      const saved = localStorage.getItem('notemd_templates');
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch {
      return DEFAULT_TEMPLATES;
    }
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Template | null>(null);

  const save = (list: Template[]) => {
    setTemplates(list);
    localStorage.setItem('notemd_templates', JSON.stringify(list));
  };

  const startEdit = (tpl: Template) => {
    setEditingId(tpl.id);
    setDraft({ ...tpl });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEdit = () => {
    if (!draft) return;
    save(templates.map((t) => (t.id === draft.id ? draft : t)));
    setEditingId(null);
    setDraft(null);
  };

  const duplicate = (tpl: Template) => {
    const newTpl: Template = {
      ...tpl,
      id: Date.now().toString(),
      name: tpl.name + ' (copy)',
    };
    save([...templates, newTpl]);
  };

  const remove = (id: string) => {
    save(templates.filter((t) => t.id !== id));
    if (editingId === id) cancelEdit();
  };

  const addNew = () => {
    const newTpl: Template = {
      id: Date.now().toString(),
      name: 'New Template',
      specialty: 'Internal Medicine',
      format: 'SOAP',
      prompt: '',
    };
    save([...templates, newTpl]);
    startEdit(newTpl);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <p className="section-title">{t('settings.templatesSection')}</p>
        <button className="btn-primary text-sm" onClick={addNew}>{t('settings.newTemplate')}</button>
      </div>
      <ul className="mt-4 grid md:grid-cols-2 gap-3">
        {templates.map((tpl) => (
          <li
            key={tpl.id}
            className={`rounded-xl border bg-white p-4 transition ${
              editingId === tpl.id ? 'border-brand-400 shadow-soft col-span-full' : 'border-ink-200 hover:shadow-soft'
            }`}
          >
            {editingId === tpl.id && draft ? (
              <div className="space-y-3">
                <div>
                  <label className="label">Template Name</label>
                  <input
                    className="input"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Specialty</label>
                    <input
                      className="input"
                      value={draft.specialty}
                      onChange={(e) => setDraft({ ...draft, specialty: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Format</label>
                    <select
                      className="input"
                      value={draft.format}
                      onChange={(e) => setDraft({ ...draft, format: e.target.value })}
                    >
                      <option value="SOAP">SOAP</option>
                      <option value="H&P">H&P</option>
                      <option value="Progress Note">Progress Note</option>
                      <option value="Procedure Note">Procedure Note</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">AI Prompt / Instructions</label>
                  <textarea
                    className="input min-h-[100px] resize-y"
                    value={draft.prompt}
                    onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                    placeholder="Describe how the AI should structure and generate notes using this template..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="btn-ghost text-sm" onClick={cancelEdit}>{t('common.cancel')}</button>
                  <button className="btn-primary text-sm" onClick={saveEdit}>{t('common.saveChanges')}</button>
                </div>
              </div>
            ) : (
              <>
                <p className="font-semibold text-ink-900">{tpl.name}</p>
                <p className="text-xs text-ink-500 mt-1">{tpl.specialty} · {tpl.format}</p>
                {tpl.prompt && (
                  <p className="text-xs text-ink-400 mt-1 line-clamp-2">{tpl.prompt}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <button className="btn-ghost text-xs" onClick={() => startEdit(tpl)}>{t('common.edit')}</button>
                  <button className="btn-ghost text-xs" onClick={() => duplicate(tpl)}>{t('settings.duplicate')}</button>
                  <button className="btn-ghost text-xs text-red-600 hover:bg-red-50" onClick={() => remove(tpl.id)}>
                    {t('common.delete') ?? 'Delete'}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotificationsTab() {
  const t = useT();
  const items = t<{ label: string; body: string }[]>('settings.notifications');
  return (
    <div className="card p-6 space-y-4">
      <p className="section-title">{t('settings.notificationsSection')}</p>
      <Toggle label={items[0].label} body={items[0].body} enabled />
      <Toggle label={items[1].label} body={items[1].body} enabled />
      <Toggle label={items[2].label} body={items[2].body} />
      <Toggle label={items[3].label} body={items[3].body} />
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" defaultValue={defaultValue} />
    </div>
  );
}

function Row({
  label,
  status,
  sub,
  action,
}: {
  label: string;
  status: string;
  sub?: string;
  action?: string;
}) {
  return (
    <li className="py-3 flex items-center justify-between gap-3 flex-wrap">
      <div>
        <p className="font-semibold text-ink-900">{label}</p>
        {sub && <p className="text-xs text-ink-500 mt-0.5"><Brandify>{sub}</Brandify></p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" /> {status}
        </span>
        {action && <button className="text-sm text-brand-700 font-semibold">{action}</button>}
      </div>
    </li>
  );
}

function Toggle({
  label,
  body,
  enabled,
}: {
  label: string;
  body: string;
  enabled?: boolean;
}) {
  const [on, setOn] = useState(!!enabled);
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="font-semibold text-ink-900">{label}</p>
        <p className="text-sm text-ink-600">{body}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`shrink-0 w-11 h-6 rounded-full relative transition ${on ? 'bg-brand-600' : 'bg-ink-200'}`}
        aria-pressed={on}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition ${
            on ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}
