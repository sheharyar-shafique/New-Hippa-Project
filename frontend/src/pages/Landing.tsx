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
  Activity,
  PenLine,
  History,
} from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import Logo from '../components/Logo';
import Brandify from '../components/Brandify';
import { useT } from '../i18n/LanguageProvider';

export default function Landing() {
  const navigate = useNavigate();
  const t = useT();

  const featureBullets1 = t<string[]>('landing.imBlockBullets');
  const featureBullets2 = t<string[]>('landing.labBlockBullets');
  const workflowSteps = t<{ title: string; body: string }[]>('landing.workflowSteps');
  const complianceRows =
    t<{ label: string; status: string }[]>('landing.complianceRows');
  const moreThanItems = t<{ title: string; body: string }[]>('landing.moreThanItems');
  const moreThanIcons = [FlaskConical, ClipboardList, Activity, Brain, PenLine, History];
  const tiers = t<any[]>('pricing.tiers');

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
                <Sparkles className="w-3.5 h-3.5" /> {t('landing.heroTag')}
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-900 leading-[1.05]">
                {t('landing.heroTitleStart')}{' '}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                  {t('landing.heroTitleHighlight')}
                </span>
              </h1>
              <p className="mt-5 text-lg text-ink-600 max-w-xl leading-relaxed">
                {t('landing.heroSubtitle')}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => navigate('/signup')} className="btn-primary text-base px-5 py-3">
                  {t('common.startTrial')} <ArrowRight className="w-4 h-4" />
                </button>
                <Link to="/login" className="btn-secondary text-base px-5 py-3">
                  {t('common.seeDemo')}
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-500">
                <span className="inline-flex items-center gap-2 text-brand-700 font-semibold">
                  <Stethoscope className="w-4 h-4" /> {t('landing.trustSignal')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600" /> {t('landing.heroBadgeHipaa')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" /> {t('common.noCreditCard')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" /> {t('common.cancelAnytime')}
                </span>
              </div>
            </div>

            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="absolute -inset-6 bg-gradient-to-tr from-brand-200/40 via-brand-100/30 to-transparent rounded-[32px] blur-2xl" />
              <div className="relative card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-ink-200/70 bg-ink-50/60">
                  <div className="flex items-center gap-2 text-xs font-medium text-ink-600">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-soft" />
                    {t('landing.heroCardRecording')}
                  </div>
                  <div className="text-xs text-ink-500">{t('landing.heroCardPatient')}</div>
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
                  <SoapPreviewCard
                    label={t('landing.heroCardSubjective')}
                    body={t('landing.heroCardSubjectiveBody')}
                  />
                  <SoapPreviewCard
                    label={t('landing.heroCardObjective')}
                    body={t('landing.heroCardObjectiveBody')}
                  />
                  <SoapPreviewCard
                    label={t('landing.heroCardAssessment')}
                    body={t('landing.heroCardAssessmentBody')}
                  />
                  <SoapPreviewCard
                    label={t('landing.heroCardPlan')}
                    body={t('landing.heroCardPlanBody')}
                    highlight
                  />
                </div>
                <div className="border-t border-ink-200/70 px-5 py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-ink-600">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    {t('landing.heroCardFooter')}
                  </div>
                  <button className="text-brand-700 font-semibold inline-flex items-center gap-1">
                    {t('landing.heroCardOpen')} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof strip — honest stats, not fictional logos */}
      <section className="border-y border-ink-200/70 bg-ink-50/60 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 items-center">
          {t<{ value: string; label: string }[]>('landing.proofStrip').map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink-900">
                {s.value}
              </p>
              <p className="text-xs sm:text-sm text-ink-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Two big features answering the client */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          <FeatureBlock
            icon={Stethoscope}
            title={t('landing.imBlockTitle')}
            body={t('landing.imBlockBody')}
            bullets={featureBullets1}
          />
          <FeatureBlock
            icon={FlaskConical}
            title={t('landing.labBlockTitle')}
            body={t('landing.labBlockBody')}
            bullets={featureBullets2}
            highlight
          />
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-ink-50/60 border-y border-ink-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2.5 flex-wrap justify-center">
              <span className="section-title">{t('landing.whyTag')}</span>
              <Logo size={22} />
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
              {t('landing.whyTitle')}
            </h2>
            <p className="mt-3 text-ink-600">{t('landing.whySubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SmallFeature icon={Mic} title={t('landing.featureOneTapTitle')} body={t('landing.featureOneTapBody')} />
            <SmallFeature icon={Brain} title={t('landing.featureSpecialtyTitle')} body={t('landing.featureSpecialtyBody')} />
            <SmallFeature icon={FileText} title={t('landing.featureEditableTitle')} body={t('landing.featureEditableBody')} />
            <SmallFeature icon={FlaskConical} title={t('landing.featureLabsTitle')} body={t('landing.featureLabsBody')} />
            <SmallFeature icon={ClipboardList} title={t('landing.featureCodingTitle')} body={t('landing.featureCodingBody')} />
            <SmallFeature icon={ShieldCheck} title={t('landing.featureSecurityTitle')} body={t('landing.featureSecurityBody')} />
          </div>
        </div>
      </section>

      {/* More than transcription — clinical-copilot positioning */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-title">{t('landing.moreThanTag')}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
            {t('landing.moreThanTitle')}
          </h2>
          <p className="mt-3 text-ink-600">{t('landing.moreThanSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {moreThanItems.map((item, i) => {
            const Icon = moreThanIcons[i] ?? Sparkles;
            return (
              <div
                key={item.title}
                className="card p-6 hover:shadow-md transition relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-soft">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="mt-4 font-semibold text-ink-900">{item.title}</h4>
                <p className="mt-1.5 text-sm text-ink-600 leading-relaxed">{item.body}</p>
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-brand-50 -z-0 opacity-60" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="section-title">{t('landing.workflowTag')}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
            {t('landing.workflowTitle')}
          </h2>
        </div>
        <div className="grid md:grid-cols-4 gap-5">
          {workflowSteps.map((step, i) => {
            const icons = [Mic, Sparkles, FileText, CheckCircle2];
            return <Step key={i} n={i + 1} icon={icons[i]} title={step.title} body={step.body} />;
          })}
        </div>
      </section>

      {/* Security */}
      <section id="security" className="bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_30%_20%,rgba(34,197,94,.5),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="pill bg-white/10 text-brand-200 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5" /> {t('landing.securityTag')}
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">{t('landing.securityTitle')}</h2>
              <p className="mt-4 text-white/70 max-w-xl leading-relaxed">{t('landing.securityBody')}</p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-xl">
                <SecurityItem icon={Lock} title={t('landing.securityItems.encryption')} />
                <SecurityItem icon={Server} title={t('landing.securityItems.aws')} />
                <SecurityItem icon={ShieldCheck} title={t('landing.securityItems.baa')} />
                <SecurityItem icon={ClipboardList} title={t('landing.securityItems.audit')} />
              </div>
            </div>

            <div className="relative">
              <div className="card text-ink-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="section-title">{t('landing.compliancePosture')}</p>
                  <span className="pill bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t('landing.complianceActive')}
                  </span>
                </div>
                <ul className="space-y-3 text-sm">
                  {complianceRows.map((row) => (
                    <li
                      key={row.label}
                      className="flex items-center justify-between py-1.5 border-b border-ink-100 last:border-0"
                    >
                      <span className="text-ink-700">{row.label}</span>
                      <span className="font-semibold text-brand-700">{row.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <span className="section-title">{t('landing.pricingTag')}</span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-ink-900 tracking-tight">
          {t('landing.pricingTitle')}
        </h2>
        <p className="mt-3 text-ink-600 max-w-xl mx-auto">{t('landing.pricingSubtitle')}</p>
        <div className="mt-8 grid md:grid-cols-3 gap-5 text-left">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.name}
              name={tier.name}
              price={tier.price}
              period={tier.period}
              features={tier.features}
              featured={tier.featured}
              featuredLabel={t('common.mostPopular')}
            />
          ))}
        </div>
        <div className="mt-10">
          <Link to="/pricing" className="btn-secondary">
            {t('landing.comparePlans')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white p-10 sm:p-14 shadow-soft text-center">
          <Clock className="w-8 h-8 mx-auto mb-4 opacity-90" />
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('landing.ctaTitle')}</h3>
          <p className="mt-3 text-white/85 max-w-xl mx-auto">
            <Brandify dark>{t<string>('landing.ctaBody')}</Brandify>
          </p>
          <button onClick={() => navigate('/signup')} className="mt-7 btn bg-white text-brand-700 hover:bg-ink-50 px-6 py-3 text-base">
            {t('common.startTrial')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

function SoapPreviewCard({ label, body, highlight }: { label: string; body: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? 'border-brand-200 bg-brand-50' : 'border-ink-200 bg-white'}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 mb-1">{label}</p>
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
    <div className={`relative rounded-2xl p-7 border ${highlight ? 'border-brand-200 bg-brand-50/50' : 'border-ink-200 bg-white'}`}>
      <div className="w-11 h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-soft">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-ink-900"><Brandify>{title}</Brandify></h3>
      <p className="mt-2 text-ink-600 leading-relaxed"><Brandify>{body}</Brandify></p>
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
        <span className="w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">{n}</span>
        <Icon className="w-5 h-5 text-brand-700" />
      </div>
      <h4 className="mt-4 font-semibold text-ink-900">{title}</h4>
      <p className="mt-1.5 text-sm text-ink-600 leading-relaxed"><Brandify>{body}</Brandify></p>
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

function PricingCard({
  name,
  price,
  period,
  features,
  featured,
  featuredLabel,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  featured?: boolean;
  featuredLabel: string;
}) {
  return (
    <div
      className={`rounded-2xl p-7 border ${
        featured ? 'border-brand-300 bg-brand-50 shadow-soft ring-1 ring-brand-200' : 'border-ink-200 bg-white'
      }`}
    >
      {featured && (
        <span className="pill bg-brand-600 text-white border border-brand-600 mb-3">{featuredLabel}</span>
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
