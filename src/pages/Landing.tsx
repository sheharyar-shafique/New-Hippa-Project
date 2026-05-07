import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Mic,
  Sparkles,
  ShieldCheck,
  FileText,
  FlaskConical,
  Stethoscope,
  CheckCircle2,
  Lock,
  Server,
  Brain,
  ClipboardList,
  Clock,
  ChevronRight,
} from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="pill bg-brand-50 text-brand-700 border border-brand-100">
                <Sparkles className="w-3.5 h-3.5" /> Built for Internal Medicine
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-900 leading-[1.05]">
                AI medical scribe that thinks{' '}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                  like an internist.
                </span>
              </h1>
              <p className="mt-5 text-lg text-ink-600 max-w-xl leading-relaxed">
                Record the visit, get a clean, structured SOAP note in seconds —
                fluent in internal medicine terminology, ICD-10, and lab interpretation.
                HIPAA-compliant on AWS with BAA.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => navigate('/signup')} className="btn-primary text-base px-5 py-3">
                  Start 14-day free trial <ArrowRight className="w-4 h-4" />
                </button>
                <Link to="/login" className="btn-secondary text-base px-5 py-3">
                  See live demo
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-500">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" /> No credit card required
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" /> HIPAA + AWS BAA
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" /> Cancel anytime
                </span>
              </div>
            </div>

            {/* Hero card */}
            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="absolute -inset-6 bg-gradient-to-tr from-brand-200/40 via-brand-100/30 to-transparent rounded-[32px] blur-2xl" />
              <div className="relative card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink-200/70 bg-ink-50/60">
                  <div className="flex items-center gap-2 text-xs font-medium text-ink-600">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft" />
                    Recording · 04:21
                  </div>
                  <div className="text-xs text-ink-500">Margaret Chen · 64 F</div>
                </div>
                <div className="px-5 pt-4 pb-2 flex items-end gap-1 h-16">
                  {Array.from({ length: 38 }).map((_, i) => (
                    <span
                      key={i}
                      className="flex-1 rounded-full bg-brand-500/80 origin-bottom animate-wave"
                      style={{
                        animationDelay: `${(i % 8) * 80}ms`,
                        height: `${20 + ((i * 13) % 70)}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="px-5 pb-5 pt-2 grid grid-cols-2 gap-3">
                  <SoapPreviewCard label="Subjective" body="64F w/ T2DM, HTN — fatigue x 2 wks, polyuria, blurred vision…" />
                  <SoapPreviewCard label="Objective" body="BP 142/86 · A1c 8.4% · LDL 118 · eGFR 64 · UACR 38 mg/g" />
                  <SoapPreviewCard label="Assessment" body="Uncontrolled T2DM, HTN above goal, microalbuminuria…" />
                  <SoapPreviewCard
                    label="Plan"
                    body="Add empagliflozin 10 mg, ↑ lisinopril 40 mg, DASH diet, f/u 4 wks"
                    highlight
                  />
                </div>
                <div className="border-t border-ink-200/70 px-5 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-ink-600">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    Drafted in 6.2 seconds · 4 ICD-10 codes suggested
                  </div>
                  <button className="text-brand-700 font-semibold inline-flex items-center gap-1">
                    Open note <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / trust */}
      <section className="border-y border-ink-200/70 bg-ink-50/60 py-6">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {[
            'Northbridge IM',
            'Riverside Clinic',
            'Cedar Health',
            'Atlas Primary',
            'Hudson Medical',
            'Bayfield Group',
          ].map((n) => (
            <div
              key={n}
              className="text-center text-sm font-semibold tracking-wide text-ink-400"
            >
              {n}
            </div>
          ))}
        </div>
      </section>

      {/* Q&A — directly answers the client question */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <FeatureBlock
            icon={Stethoscope}
            title="Speaks fluent internal medicine"
            body="The model is fine-tuned on internal medicine vocabulary — diabetes, hypertension, COPD, CKD, CHF, GERD, thyroid disorders, common GI/cardiology/pulm presentations. It writes the way an internist documents: appropriate ROS, focused exam findings, ICD-10 + CPT coding, and structured assessment & plan."
            bullets={[
              'PMH, ROS, focused exam, A&P scaffolding',
              'ICD-10 + CPT suggestions per encounter',
              'Pharmacology-aware (dose, frequency, contraindications)',
            ]}
          />
          <FeatureBlock
            icon={FlaskConical}
            title="Snap a lab — get the explanation"
            body="Take a picture of a lab report or attach a PDF. MedScribe extracts every value, flags abnormalities, and explains what the pattern likely means in plain clinical language with possible differentials — so you spend less time reading numbers and more time talking to the patient."
            bullets={[
              'Photo or PDF of CBC, CMP, lipid panel, A1c, TSH, etc.',
              'Plain-language interpretation with reference ranges',
              'Likely conditions ranked, with reasoning + next steps',
            ]}
            highlight
          />
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-ink-50/60 border-y border-ink-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-title">Why doctors choose MedScribe</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
              Built around the way internists actually work.
            </h2>
            <p className="mt-3 text-ink-600">
              Less typing. Cleaner notes. More face-time with patients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SmallFeature
              icon={Mic}
              title="One-tap recording"
              body="Capture in-clinic or telehealth visits. Background noise filtering and speaker separation built-in."
            />
            <SmallFeature
              icon={Brain}
              title="Specialty-tuned AI"
              body="Trained on internal medicine workflows so the SOAP note reads like you wrote it."
            />
            <SmallFeature
              icon={FileText}
              title="Editable in seconds"
              body="A clean editor with section-by-section regenerate. Save, sign, and export."
            />
            <SmallFeature
              icon={FlaskConical}
              title="Lab image analysis"
              body="Photograph a printed lab; we read it, interpret it, and suggest differentials."
            />
            <SmallFeature
              icon={ClipboardList}
              title="ICD-10 / CPT helper"
              body="Coding suggestions per encounter — accept with one click."
            />
            <SmallFeature
              icon={ShieldCheck}
              title="HIPAA on AWS"
              body="Encrypted in transit & at rest. Signed BAA. Audit logs and access controls."
            />
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-title">Workflow</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
            Record → Generate → Edit → Save
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          <Step n={1} icon={Mic} title="Record" body="Tap record at the start of the visit. Use phone, tablet, or laptop." />
          <Step n={2} icon={Sparkles} title="Generate" body="Get a structured SOAP note in seconds, with ICD-10 suggestions." />
          <Step n={3} icon={FileText} title="Edit" body="Tweak any section, regenerate just one part, accept code suggestions." />
          <Step n={4} icon={CheckCircle2} title="Save & sign" body="Export to your EHR or save securely in MedScribe — encrypted on AWS." />
        </div>
      </section>

      {/* Security */}
      <section id="security" className="bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(26,174,157,.5),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="pill bg-white/10 text-brand-200 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5" /> Compliance
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                Secure by default. HIPAA-aligned. AWS BAA in place.
              </h2>
              <p className="mt-4 text-white/70 max-w-xl leading-relaxed">
                We treat PHI like the regulated data it is. Audio and notes are
                encrypted in transit (TLS 1.2+) and at rest (AES-256). Only your
                clinic can read your patient data — never used to train models.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-xl">
                <SecurityItem icon={Lock} title="End-to-end encryption" />
                <SecurityItem icon={Server} title="AWS HIPAA-eligible services" />
                <SecurityItem icon={ShieldCheck} title="Signed BAA" />
                <SecurityItem icon={ClipboardList} title="Audit logging & access controls" />
              </div>
            </div>

            <div className="relative">
              <div className="card text-ink-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="section-title">Compliance posture</p>
                  <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
                <ul className="space-y-3 text-sm">
                  <ComplianceRow label="HIPAA Privacy & Security Rule" status="Aligned" />
                  <ComplianceRow label="AWS Business Associate Agreement (BAA)" status="Signed" />
                  <ComplianceRow label="Data residency" status="US-East / US-West" />
                  <ComplianceRow label="Encryption at rest" status="AES-256" />
                  <ComplianceRow label="Encryption in transit" status="TLS 1.2+" />
                  <ComplianceRow label="Patient data used to train models" status="Never" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="section-title">Pricing</span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
          Simple, per-clinician pricing.
        </h2>
        <p className="mt-3 text-ink-600 max-w-xl mx-auto">
          Start with a 14-day free trial. Cancel anytime. Volume discounts for clinics.
        </p>
        <div className="mt-8 grid md:grid-cols-3 gap-5 text-left">
          <PricingCard name="Starter" price="$99" period="/clinician / month" features={['100 visits per month', 'SOAP notes', 'ICD-10 suggestions', 'Email support']} />
          <PricingCard name="Practice" price="$179" period="/clinician / month" featured features={['Unlimited visits', 'Lab image analysis', 'Custom templates', 'Priority support', 'BAA included']} />
          <PricingCard name="Group" price="Custom" period="contact us" features={['10+ clinicians', 'SSO', 'EHR integrations', 'Dedicated success manager']} />
        </div>
        <div className="mt-10">
          <Link to="/pricing" className="btn-secondary">
            Compare plans <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white p-10 sm:p-14 shadow-soft text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Get back 90 minutes of your day.
          </h3>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            Stop typing notes after-hours. Try MedScribe free for 14 days — no credit card needed.
          </p>
          <button onClick={() => navigate('/signup')} className="mt-7 btn bg-white text-brand-700 hover:bg-ink-50 px-6 py-3 text-base">
            Start free trial <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function SoapPreviewCard({
  label,
  body,
  highlight,
}: {
  label: string;
  body: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        highlight
          ? 'border-brand-200 bg-brand-50'
          : 'border-ink-200 bg-white'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mb-1">
        {label}
      </p>
      <p className="text-xs text-ink-700 leading-snug line-clamp-3">{body}</p>
    </div>
  );
}

function FeatureBlock({
  icon: Icon,
  title,
  body,
  bullets,
  highlight,
}: {
  icon: any;
  title: string;
  body: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-7 border ${
        highlight ? 'border-brand-200 bg-brand-50/50' : 'border-ink-200 bg-white'
      }`}
    >
      <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-soft">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 text-ink-600 leading-relaxed">{body}</p>
      <ul className="mt-4 space-y-2 text-sm text-ink-700">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 mt-0.5 text-brand-600 shrink-0" /> {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SmallFeature({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <div className="card p-6 hover:shadow-md transition">
      <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="mt-4 font-semibold text-ink-900">{title}</h4>
      <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, icon: Icon, title, body }: { n: number; icon: any; title: string; body: string }) {
  return (
    <div className="card p-6 relative">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
          {n}
        </span>
        <Icon className="w-5 h-5 text-brand-700" />
      </div>
      <h4 className="mt-4 font-semibold text-ink-900">{title}</h4>
      <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{body}</p>
    </div>
  );
}

function SecurityItem({ icon: Icon, title }: { icon: any; title: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="w-9 h-9 rounded-lg bg-brand-500/20 text-brand-200 flex items-center justify-center">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-medium">{title}</span>
    </div>
  );
}

function ComplianceRow({ label, status }: { label: string; status: string }) {
  return (
    <li className="flex items-center justify-between py-1.5 border-b border-ink-100 last:border-0">
      <span className="text-ink-700">{label}</span>
      <span className="font-semibold text-brand-700">{status}</span>
    </li>
  );
}

function PricingCard({
  name,
  price,
  period,
  features,
  featured,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-7 border ${
        featured
          ? 'border-brand-300 bg-brand-50 shadow-soft ring-1 ring-brand-200'
          : 'border-ink-200 bg-white'
      }`}
    >
      {featured && (
        <span className="pill bg-brand-600 text-white border border-brand-600 mb-3">
          Most popular
        </span>
      )}
      <h4 className="text-lg font-bold text-ink-900">{name}</h4>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold tracking-tight text-ink-900">{price}</span>
        <span className="text-sm text-ink-500">{period}</span>
      </div>
      <ul className="mt-5 space-y-2 text-sm text-ink-700">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" /> {f}
          </li>
        ))}
      </ul>
    </div>
  );
}
