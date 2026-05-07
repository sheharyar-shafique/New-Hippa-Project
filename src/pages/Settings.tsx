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

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security & HIPAA', icon: ShieldCheck },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'templates', label: 'Templates', icon: Layers },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function Settings() {
  const [tab, setTab] = useState('profile');

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">Settings</h1>
        <p className="text-ink-600 mt-1">Manage your account, security, and subscription.</p>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-5">
        <div className="card p-2 h-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full nav-link ${tab === t.id ? 'nav-link-active' : ''}`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
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
  return (
    <div className="card p-6">
      <p className="section-title">Profile</p>
      <div className="mt-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-bold">
          {initials('Alex Reyes')}
        </div>
        <div>
          <button className="btn-secondary text-sm">Change photo</button>
          <p className="text-xs text-ink-500 mt-1">PNG or JPG, up to 5MB.</p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <Field label="First name" defaultValue="Alex" />
        <Field label="Last name" defaultValue="Reyes" />
        <Field label="Email" defaultValue="dr.reyes@clinic.com" />
        <Field label="NPI" defaultValue="1234567890" />
        <Field label="Specialty" defaultValue="Internal Medicine" />
        <Field label="Clinic" defaultValue="Northbridge Internal Medicine" />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn-ghost">Cancel</button>
        <button className="btn-primary">Save changes</button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <>
      <div className="card p-6">
        <p className="section-title">HIPAA &amp; BAA</p>
        <ul className="mt-4 divide-y divide-ink-200/70">
          <Row label="Business Associate Agreement (BAA)" status="Signed" sub="Counter-signed by MedScribe AI · 2026-04-12" actionLabel="Download PDF" />
          <Row label="AWS HIPAA-eligible services" status="Active" sub="us-east-1 / us-west-2" />
          <Row label="Data residency" status="USA" />
          <Row label="Encryption" status="AES-256 + TLS 1.2+" />
          <Row label="Patient data used for training" status="Disabled" />
        </ul>
      </div>

      <div className="card p-6">
        <p className="section-title">Authentication</p>
        <div className="mt-4 space-y-4">
          <Toggle label="Two-factor authentication" body="Required for all clinicians on this account." enabled />
          <Toggle label="Single sign-on (SSO)" body="Connect Okta, Azure AD, or Google Workspace." />
          <Toggle label="Auto-lock after inactivity" body="Lock the app after 5 minutes idle." enabled />
        </div>
      </div>

      <div className="card p-6">
        <p className="section-title">Audit log</p>
        <p className="mt-2 text-sm text-ink-600">
          View who accessed which patient records and when.
        </p>
        <button className="mt-3 btn-secondary">
          View audit log <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}

function BillingTab() {
  return (
    <>
      <div className="card p-6">
        <p className="section-title">Plan</p>
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-semibold text-ink-900 text-lg">Practice — $179/clinician/mo</p>
            <p className="text-sm text-ink-500 mt-0.5">Billed monthly · 1 clinician · Renews 2026-06-01</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">Change plan</button>
            <button className="btn-ghost text-red-600 hover:bg-red-50">Cancel</button>
          </div>
        </div>
        <ul className="mt-5 grid sm:grid-cols-2 gap-2 text-sm text-ink-700">
          {['Unlimited visits', 'Lab image analysis', 'Custom templates', 'Priority support', 'BAA included'].map((f) => (
            <li key={f} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-600" /> {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-6">
        <p className="section-title">Payment method</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 rounded-md bg-ink-900 text-white text-[10px] font-bold flex items-center justify-center">VISA</div>
            <div>
              <p className="text-sm font-semibold">•••• 4242</p>
              <p className="text-xs text-ink-500">Expires 09/28</p>
            </div>
          </div>
          <button className="btn-secondary">Update</button>
        </div>
      </div>

      <div className="card p-6">
        <p className="section-title">Recent invoices</p>
        <ul className="mt-3 divide-y divide-ink-200/70">
          {[
            { d: 'Apr 1, 2026', a: '$179.00', s: 'Paid' },
            { d: 'Mar 1, 2026', a: '$179.00', s: 'Paid' },
            { d: 'Feb 1, 2026', a: '$179.00', s: 'Paid' },
          ].map((i) => (
            <li key={i.d} className="flex items-center justify-between py-3 text-sm">
              <span className="text-ink-700">{i.d}</span>
              <span className="font-semibold tabular-nums">{i.a}</span>
              <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">{i.s}</span>
              <button className="text-brand-700 font-semibold">Download</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function TemplatesTab() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <p className="section-title">Note templates</p>
        <button className="btn-primary text-sm">+ New template</button>
      </div>
      <ul className="mt-4 grid md:grid-cols-2 gap-3">
        {[
          'Internal Medicine — Follow-up',
          'Internal Medicine — New Patient',
          'Diabetes Management',
          'Hypertension Follow-up',
          'Acute Visit (Adult)',
          'Annual Wellness',
        ].map((t) => (
          <li key={t} className="rounded-xl border border-ink-200 bg-white p-4 hover:shadow-soft transition">
            <p className="font-semibold text-ink-900">{t}</p>
            <p className="text-xs text-ink-500 mt-1">Internal Medicine · SOAP</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-ghost text-xs">Edit</button>
              <button className="btn-ghost text-xs">Duplicate</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="card p-6 space-y-4">
      <p className="section-title">Notifications</p>
      <Toggle label="New note ready" body="Notify me when a SOAP note has finished generating." enabled />
      <Toggle label="Lab analysis ready" body="Notify me when a lab interpretation is ready." enabled />
      <Toggle label="Weekly summary" body="A short Monday email with last week’s metrics." />
      <Toggle label="Product updates" body="Tips, new features, and best practices." />
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
  actionLabel,
}: {
  label: string;
  status: string;
  sub?: string;
  actionLabel?: string;
}) {
  return (
    <li className="py-3 flex items-center justify-between gap-3 flex-wrap">
      <div>
        <p className="font-semibold text-ink-900">{label}</p>
        {sub && <p className="text-xs text-ink-500 mt-0.5">{sub}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" /> {status}
        </span>
        {actionLabel && (
          <button className="text-sm text-brand-700 font-semibold">{actionLabel}</button>
        )}
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
        className={`shrink-0 w-11 h-6 rounded-full relative transition ${
          on ? 'bg-brand-600' : 'bg-ink-200'
        }`}
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
