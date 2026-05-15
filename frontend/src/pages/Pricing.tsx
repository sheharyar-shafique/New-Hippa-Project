import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import MarketingNav from '../components/MarketingNav';
import MarketingFooter from '../components/MarketingFooter';
import Brandify from '../components/Brandify';
import { useT } from '../i18n/LanguageProvider';

export default function Pricing() {
  const t = useT();
  const tiers = t<any[]>('pricing.tiers');
  const faqs = t<{ q: string; a: string }[]>('pricing.faqs');

  return (
    <div className="bg-white">
      <MarketingNav />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="section-title">{t('landing.pricingTag')}</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-ink-900">
            {t('pricing.title')}
          </h1>
          <p className="mt-4 text-ink-600">{t('pricing.subtitle')}</p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-7 border ${
                tier.featured
                  ? 'border-brand-300 bg-brand-50 ring-1 ring-brand-200 shadow-soft'
                  : 'border-ink-200 bg-white'
              }`}
            >
              {tier.featured && (
                <span className="pill bg-brand-600 text-white border border-brand-600 mb-3">
                  {t('common.mostPopular')}
                </span>
              )}
              <h3 className="text-xl font-bold text-ink-900">{tier.name}</h3>
              <p className="text-sm text-ink-500 mt-1">{tier.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-ink-900">{tier.price}</span>
                <span className="text-sm text-ink-500">{tier.period}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-ink-700">
                {tier.features.map((f: string) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className={`mt-7 ${tier.featured ? 'btn-primary' : 'btn-secondary'} w-full`}>
                {t('common.startTrial')}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink-50/60 border-y border-ink-200/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 text-center">{t('pricing.faqTitle')}</h2>
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group card p-5 open:shadow-md transition">
                <summary className="flex items-center justify-between cursor-pointer text-ink-900 font-semibold list-none">
                  <span><Brandify>{f.q}</Brandify></span>
                  <span className="text-brand-600 group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-3 text-ink-600 leading-relaxed"><Brandify>{f.a}</Brandify></p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
