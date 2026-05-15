import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, ShieldCheck, Stethoscope } from 'lucide-react';
import { FormEvent, useState } from 'react';
import Logo from '../components/Logo';
import LanguageToggle from '../components/LanguageToggle';
import Brandify from '../components/Brandify';
import { useT } from '../i18n/LanguageProvider';
import { useAuth } from '../lib/AuthProvider';

export default function Login() {
  const navigate = useNavigate();
  const t = useT();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col px-6 sm:px-10 py-8">
        <div className="flex items-center justify-between">
          <Link to="/"><Logo /></Link>
          <LanguageToggle />
        </div>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">
              {t('auth.loginTitle')}
            </h1>
            <p className="mt-2 text-ink-600">{t('auth.loginSubtitle')}</p>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="label">{t('auth.workEmail')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input pl-9"
                    type="email"
                    placeholder="dr.reyes@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="label">{t('auth.password')}</label>
                  <a href="#" className="text-xs text-brand-700 font-semibold">{t('auth.forgot')}</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input pl-9"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" className="rounded text-brand-600" defaultChecked /> {t('auth.keepSignedIn')}
              </label>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? t('auth.signingIn') : (<>{t('common.signIn')} <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>
            <p className="mt-6 text-sm text-ink-600">
              <Brandify>{t<string>('auth.newToNoteMD')}</Brandify>{' '}
              <Link to="/signup" className="text-brand-700 font-semibold">{t('auth.createAccountLink')}</Link>
            </p>
          </div>
        </div>
        <p className="text-xs text-ink-400">{t('auth.protectedNote')}</p>
      </div>

      <div className="hidden lg:block relative bg-gradient-to-tr from-brand-700 to-brand-500 text-white overflow-hidden">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_70%_20%,rgba(255,255,255,.18),transparent_45%)]" />
        <div className="relative h-full flex items-center justify-center p-10">
          <div className="max-w-md">
            <Stethoscope className="w-9 h-9 mb-5 opacity-90" />
            <h2 className="text-3xl font-bold leading-snug">{t('auth.testimonial')}</h2>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">MR</div>
              <div>
                <p className="font-semibold">{t('auth.testimonialName')}</p>
                <p className="text-white/70 text-sm">{t('auth.testimonialRole')}</p>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3">
              <Stat label={t('auth.avgNoteTime')} value="6.2s" />
              <Stat label={t('auth.timeReclaimed')} value={t('auth.timeReclaimedValue')} />
            </div>
            <div className="mt-6 pill bg-white/15 text-white border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" /> {t('auth.hipaaPill')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/15 px-4 py-3">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-white/75">{label}</p>
    </div>
  );
}
