import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function MarketingFooter() {
  return (
    <footer className="border-t border-ink-200/70 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">
        <div>
          <Logo />
          <p className="text-sm text-ink-500 mt-3 leading-relaxed">
            HIPAA-compliant AI medical scribe purpose-built for internal medicine.
          </p>
        </div>
        <div>
          <p className="section-title mb-3">Product</p>
          <ul className="space-y-2 text-sm text-ink-600">
            <li><a href="/#features" className="hover:text-ink-900">Features</a></li>
            <li><a href="/#workflow" className="hover:text-ink-900">How it works</a></li>
            <li><Link to="/pricing" className="hover:text-ink-900">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <p className="section-title mb-3">Compliance</p>
          <ul className="space-y-2 text-sm text-ink-600">
            <li>HIPAA + AWS BAA</li>
            <li>SOC 2 Type II (in progress)</li>
            <li>Audit logging</li>
          </ul>
        </div>
        <div>
          <p className="section-title mb-3">Get started</p>
          <Link to="/signup" className="btn-primary w-full">Start 14-day trial</Link>
        </div>
      </div>
      <div className="border-t border-ink-200/70">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between text-xs text-ink-500 gap-2">
          <p>© {new Date().getFullYear()} MedScribe AI. All rights reserved.</p>
          <p>This product is clinical decision support — not a medical device.</p>
        </div>
      </div>
    </footer>
  );
}
