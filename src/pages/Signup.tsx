import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FormEvent, useState } from 'react';
import Logo from '../components/Logo';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate('/app'), 700);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col bg-ink-900 text-white p-10 relative overflow-hidden">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_30%_30%,rgba(26,174,157,.45),transparent_45%)]" />
        <Link to="/" className="relative"><Logo /></Link>
        <div className="relative flex-1 flex items-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-snug">
              Try MedScribe free for 14 days.
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              Connect your microphone, run a real visit, and watch the SOAP note draft itself.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                'Specialty-tuned for internal medicine',
                'Photograph labs and get instant interpretation',
                'HIPAA + BAA on AWS — encrypted end-to-end',
                'No credit card required',
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-300 mt-0.5" /> {b}
                </li>
              ))}
            </ul>
            <div className="mt-10 pill bg-white/10 text-brand-200 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5" /> Your patients’ data is never used to train models
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col px-6 sm:px-10 py-8">
        <div className="lg:hidden mb-6"><Logo /></div>
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">
              Create your account
            </h1>
            <p className="mt-2 text-ink-600">Start charting smarter today.</p>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First name</label>
                  <input className="input" placeholder="Alex" required />
                </div>
                <div>
                  <label className="label">Last name</label>
                  <input className="input" placeholder="Reyes" required />
                </div>
              </div>
              <div>
                <label className="label">Work email</label>
                <input className="input" type="email" placeholder="dr.reyes@clinic.com" required />
              </div>
              <div>
                <label className="label">Specialty</label>
                <select className="input">
                  <option>Internal Medicine</option>
                  <option>Family Medicine</option>
                  <option>Geriatrics</option>
                  <option>Endocrinology</option>
                </select>
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="At least 12 characters" required />
              </div>
              <label className="flex items-start gap-2 text-sm text-ink-700">
                <input type="checkbox" className="mt-0.5 rounded text-brand-600" required />
                I agree to the Terms of Service, Privacy Policy and HIPAA BAA.
              </label>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Creating account…' : (<>Create account <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </form>
            <p className="mt-6 text-sm text-ink-600">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-700 font-semibold">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
