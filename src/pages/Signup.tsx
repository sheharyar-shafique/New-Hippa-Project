import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import Logo from '../components/Logo';
import LanguageToggle from '../components/LanguageToggle';
import Brandify from '../components/Brandify';
import { useT } from '../i18n/LanguageProvider';

export default function Signup() {
  const navigate = useNavigate();
  const t = useT();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/app'), 700);
  };

  const bullets = t<string[]>('auth.signupAsideBullets');

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-ink-900 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_30%,rgba(34,197,94,.45),transparent_45%)]" />
        <div className="relative flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <LanguageToggle variant="dark" />
        </div>
        <div className="relative flex-1 flex items-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-snug">
              <Brandify dark>{t<string>('auth.signupAsideTitle')}</Brandify>
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              <Brandify dark>{t<string>('auth.signupAsideBody')}</Brandify>
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-300 mt-0.5" /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 pill bg-white/10 text-brand-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('auth.signupAsidePill')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-6 sm:px-10 py-8">
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <Logo />
          <LanguageToggle />
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">{t('auth.signupTitle')}</h1>
            <p className="mt-2 text-ink-600">{t('auth.signupSubtitle')}</p>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">{t('auth.firstName')}</label>
                  <input className="input" placeholder="Alex" required />
                </div>
                <div>
                  <label className="label">{t('auth.lastName')}</label>
                  <input className="input" placeholder="Reyes" required />
                </div>
              </div>
              <div>
                <label className="label">{t('auth.workEmail')}</label>
                <input className="input" type="email" placeholder="dr.reyes@clinic.com" required />
              </div>
              <div>
                <label className="label">{t('auth.specialty')}</label>
                <select className="input">
                  <option>{t('common.specialtyDefault')}</option>
                  <option>Family Medicine / Medicina Familiar</option>
                  <option>Geriatrics / Geriatría</option>
                  <option>Endocrinology / Endocrinología</option>
                </select>
              </div>
              <div>
                <label className="label">{t('auth.password')}</label>
                <input className="input" type="password" placeholder={t('auth.passwordHint')} required />
              </div>
              <label className="flex items-start gap-2 text-sm text-ink-700">
                <input type="checkbox" className="mt-0.5 rounded text-brand-600" required />
                {t('auth.acceptTerms')}
              </label>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? t('auth.creatingAccount') : (<>{t('common.createAccount')} <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>
            <p className="mt-6 text-sm text-ink-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-brand-700 font-semibold">{t('common.signIn')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
