import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';

const tiers = [
  {
    name: 'Starter',
    price: '$99',
    period: 'per clinician / month',
    description: 'Solo internists getting started.',
    features: [
      '100 visits / month',
      'AI-generated SOAP notes',
      'ICD-10 + CPT suggestions',
      'Internal medicine templates',
      'Email support',
    ],
  },
  {
    name: 'Practice',
    price: '$179',
    period: 'per clinician / month',
    featured: true,
    description: 'Most popular for solo and small practices.',
    features: [
      'Unlimited visits',
      'Lab image analysis',
      'Custom templates',
      'HIPAA BAA included',
      'Priority chat support',
      'Audit logs',
    ],
  },
  {
    name: 'Group',
    price: 'Custom',
    period: 'contact us',
    description: '10+ clinicians or hospital-owned groups.',
    features: [
      'Volume pricing',
      'SSO (Okta, Azure AD)',
      'EHR integration support',
      'Dedicated success manager',
      'SLAs and onboarding',
    ],
  },
];

const faq = [
  {
    q: 'Do you sign a Business Associate Agreement (BAA)?',
    a: 'Yes. Every paid plan includes a signed BAA. We host PHI on AWS HIPAA-eligible services and encrypt data in transit (TLS 1.2+) and at rest (AES-256).',
  },
  {
    q: 'Is the AI specialty-specific?',
    a: 'MedScribe is tuned for internal medicine — chronic disease management, common acute presentations, geriatrics, and outpatient continuity care. We are adding subspecialties on request.',
  },
  {
    q: 'Can I edit notes before saving?',
    a: 'Always. Notes generate as drafts — you can edit any section, regenerate just one section, or rewrite from scratch. Nothing is finalized until you sign it.',
  },
  {
    q: 'Will my patients’ data be used for training?',
    a: 'Never. Your encounters and PHI are not used to train models — yours, ours, or any third party.',
  },
];

export default function Pricing() {
  return (
    <div className="bg-white">
      <MarketingNav />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="section-title">Pricing</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-ink-900">
            Pricing that scales with your practice.
          </h1>
          <p className="mt-4 text-ink-600">
            14-day free trial on every plan. No credit card required.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl p-7 border ${
                t.featured
                  ? 'border-brand-300 bg-brand-50 ring-1 ring-brand-200 shadow-soft'
                  : 'border-ink-200 bg-white'
              }`}
            >
              {t.featured && (
                <span className="pill bg-brand-600 text-white border border-brand-600 mb-3">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-bold text-ink-900">{t.name}</h3>
              <p className="text-sm text-ink-500 mt-1">{t.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-ink-900">
                  {t.price}
                </span>
                <span className="text-sm text-ink-500">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-ink-700">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-7 ${t.featured ? 'btn-primary' : 'btn-secondary'} w-full`}
              >
                Start free trial
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink-50/60 border-y border-ink-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 text-center">
            Frequently asked questions
          </h2>
          <div className="mt-10 space-y-4">
            {faq.map((f) => (
              <details
                key={f.q}
                className="group card p-5 open:shadow-md transition"
              >
                <summary className="flex items-center justify-between cursor-pointer text-ink-900 font-semibold list-none">
                  {f.q}
                  <span className="text-brand-600 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-ink-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
