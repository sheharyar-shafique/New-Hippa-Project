import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from './Logo';

export default function MarketingNav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-ink-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-600">
          <a href="/#features" className="hover:text-ink-900">Features</a>
          <a href="/#workflow" className="hover:text-ink-900">How it works</a>
          <a href="/#security" className="hover:text-ink-900">Security</a>
          <Link to="/pricing" className="hover:text-ink-900">Pricing</Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link to="/login" className="btn-ghost">Sign in</Link>
          <button onClick={() => navigate('/signup')} className="btn-primary">
            Start free trial <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <button
          className="md:hidden btn-ghost p-2 rounded-lg"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-ink-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <a href="/#features" className="block text-sm text-ink-700">Features</a>
            <a href="/#workflow" className="block text-sm text-ink-700">How it works</a>
            <a href="/#security" className="block text-sm text-ink-700">Security</a>
            <Link to="/pricing" className="block text-sm text-ink-700">Pricing</Link>
            <div className="pt-2 flex gap-2">
              <Link to="/login" className="btn-secondary flex-1">Sign in</Link>
              <Link to="/signup" className="btn-primary flex-1">Start trial</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
