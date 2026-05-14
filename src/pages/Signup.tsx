import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import Logo from '../components/Logo';
import LanguageToggle from '../components/LanguageToggle';
import Brandify from '../components/Brandify';
import { useT, useLang } from '../i18n/LanguageProvider';
import { useAuth } from '../lib/AuthProvider';

export default function Signup() {
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const { signup } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('Internal Medicine');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signup({
        firstName,
        lastName,
        email,
        password,
        specialty,
        preferredLang: lang,
      });
      navigate('/app');
    } catch (err: any) {
      setError(err?.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const bullets = t<string[]>('auth.signupAsideBullets');

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-ink-900 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_30%,rgba(34,197,94,.45),transparent_45%)]" />
        <div className="relative flex items-center justify-between">
          <Link to="/"><Logo dark /></Link>
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
                  <input
                    className="input"
                    placeholder="Alex"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="label">{t('auth.lastName')}</label>
                  <input
                    className="input"
                    placeholder="Reyes"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">{t('auth.workEmail')}</label>
                <input
                  className="input"
                  type="email"
                  placeholder="dr.reyes@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="label">{t('auth.specialty')}</label>
                <select
                  className="input"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  <option value="Internal Medicine">{t('common.specialtyDefault')}</option>
                  <option value="Family Medicine">Family Medicine / Medicina Familiar</option>
                  <option value="Geriatrics">Geriatrics / Geriatría</option>
                  <option value="Endocrinology">Endocrinology / Endocrinología</option>
                </select>
              </div>
              <div>
                <label className="label">{t('auth.password')}</label>
                <input
                  className="input"
                  type="password"
                  placeholder={t('auth.passwordHint')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
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
