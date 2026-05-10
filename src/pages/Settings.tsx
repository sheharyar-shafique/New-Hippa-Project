import { useState } from 'react';
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
  const rows = t<{ label: string; status: string; sub?: string; action?: string }[]>('settings.hipaaRows');
  const toggles = t<{ label: string; body: string }[]>('settings.toggles');
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
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <p className="section-title">{t('settings.templatesSection')}</p>
        <button className="btn-primary text-sm">{t('settings.newTemplate')}</button>
      </div>
      <ul className="mt-4 grid md:grid-cols-2 gap-3">
        {[
          'Internal Medicine — Follow-up / Seguimiento',
          'Internal Medicine — New Patient / Paciente nuevo',
          'Diabetes Management / Manejo de diabetes',
          'Hypertension Follow-up / Seguimiento HTA',
          'Acute Visit (Adult) / Consulta aguda (adulto)',
          'Annual Wellness / Chequeo anual',
        ].map((tt) => (
          <li key={tt} className="rounded-xl border border-ink-200 bg-white p-4 hover:shadow-soft transition">
            <p className="font-semibold text-ink-900">{tt}</p>
            <p className="text-xs text-ink-500 mt-1">{t('common.specialtyDefault')} · SOAP</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-ghost text-xs">{t('common.edit')}</button>
              <button className="btn-ghost text-xs">{t('settings.duplicate')}</button>
            </div>
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
