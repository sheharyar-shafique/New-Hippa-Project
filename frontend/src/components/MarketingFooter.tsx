import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useT } from '../i18n/LanguageProvider';

export default function MarketingFooter() {
  const t = useT();
  return (
    <footer className="border-t border-ink-200/70 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <Logo />
          <p className="text-sm text-ink-500 mt-3 leading-relaxed">{t('nav.footerTagline')}</p>
        </div>
        <div>
          <p className="section-title mb-3">{t('nav.product')}</p>
          <ul className="space-y-2 text-sm text-ink-600">
            <li><a href="/#features" className="hover:text-ink-900">{t('nav.features')}</a></li>
            <li><a href="/#workflow" className="hover:text-ink-900">{t('nav.howItWorks')}</a></li>
            <li><Link to="/pricing" className="hover:text-ink-900">{t('nav.pricing')}</Link></li>
          </ul>
        </div>
        <div>
          <p className="section-title mb-3">{t('nav.compliance')}</p>
          <ul className="space-y-2 text-sm text-ink-600">
            <li>{t('nav.complianceItems.hipaaBaa')}</li>
            <li>{t('nav.complianceItems.soc2')}</li>
            <li>{t('nav.complianceItems.audit')}</li>
          </ul>
        </div>
        <div>
          <p className="section-title mb-3">{t('nav.getStarted')}</p>
          <Link to="/signup" className="btn-primary w-full">{t('common.startTrial')}</Link>
        </div>
      </div>
      <div className="border-t border-ink-200/70">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between text-xs text-ink-500 gap-2">
          <p>© {new Date().getFullYear()} {t('common.appName')}. {t('nav.copyright')}</p>
          <p>{t('nav.footerDisclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
