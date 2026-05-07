import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, ShieldCheck, Stethoscope } from 'lucide-react';
import { FormEvent, useState } from 'react';
import Logo from '../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/app'), 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col px-6 sm:px-10 py-8">
        <Link to="/"><Logo /></Link>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">
              Welcome back, doctor.
            </h1>
            <p className="mt-2 text-ink-600">
              Sign in to keep documenting smarter.
            </p>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label className="label">Work email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input className="input pl-9" type="email" placeholder="dr.reyes@clinic.com" required />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="label">Password</label>
                  <a href="#" className="text-xs text-brand-700 font-semibold">Forgot?</a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input className="input pl-9" type="password" placeholder="••••••••" required />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" className="rounded text-brand-600" defaultChecked /> Keep me signed in
              </label>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Signing in…' : (<>Sign in <ArrowRight className="w-4 h-4" /></>)}
              </button>
              <button type="button" className="btn-secondary w-full">
                Continue with SSO
              </button>
            </form>
            <p className="mt-6 text-sm text-ink-600">
              New to MedScribe?{' '}
              <Link to="/signup" className="text-brand-700 font-semibold">Create an account</Link>
            </p>
          </div>
        </div>
        <p className="text-xs text-ink-400">
          Protected by SOC2-aligned controls. HIPAA compliant on AWS.
        </p>
      </div>

      <div className="hidden lg:block relative bg-gradient-to-tr from-brand-700 to-brand-500 text-white overflow-hidden">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_70%_20%,rgba(255,255,255,.18),transparent_45%)]" />
        <div className="relative h-full flex items-center justify-center p-10">
          <div className="max-w-md">
            <Stethoscope className="w-9 h-9 mb-5 opacity-90" />
            <h2 className="text-3xl font-bold leading-snug">
              “I finish my charts before I leave the exam room. The note already
              reads exactly how I would write it.”
            </h2>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                MR
              </div>
              <div>
                <p className="font-semibold">Dr. Maya Rao, MD</p>
                <p className="text-white/70 text-sm">Internal Medicine · Cedar Health</p>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3">
              <Stat label="Average note time" value="6.2s" />
              <Stat label="Charting reclaimed" value="~90 min/day" />
            </div>
            <div className="mt-6 pill bg-white/15 text-white border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" /> HIPAA · BAA · AWS
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
