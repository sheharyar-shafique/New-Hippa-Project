import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';
import LanguageToggle from './LanguageToggle';
import { useT } from '../i18n/LanguageProvider';

export default function MarketingNav() {
  const navigate = useNavigate();
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-ink-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-600">
          <a href="/#features" className="hover:text-ink-900">{t('nav.features')}</a>
          <a href="/#workflow" className="hover:text-ink-900">{t('nav.howItWorks')}</a>
          <a href="/#security" className="hover:text-ink-900">{t('nav.security')}</a>
          <Link to="/pricing" className="hover:text-ink-900">{t('nav.pricing')}</Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle />
          <Link to="/login" className="btn-ghost">{t('common.signIn')}</Link>
          <button onClick={() => navigate('/signup')} className="btn-primary">
            {t('common.startTrial')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <button
          className="md:hidden btn-ghost p-2 rounded-lg"
          onClick={() => setOpen((o) => !o)}
          aria-label={t('nav.menu')}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-ink-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <a href="/#features" className="block text-sm text-ink-700">{t('nav.features')}</a>
            <a href="/#workflow" className="block text-sm text-ink-700">{t('nav.howItWorks')}</a>
            <a href="/#security" className="block text-sm text-ink-700">{t('nav.security')}</a>
            <Link to="/pricing" className="block text-sm text-ink-700">{t('nav.pricing')}</Link>
            <div className="pt-1"><LanguageToggle /></div>
            <div className="pt-2 flex gap-2">
              <Link to="/login" className="btn-secondary flex-1">{t('common.signIn')}</Link>
              <Link to="/signup" className="btn-primary flex-1">{t('common.startTrial')}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
