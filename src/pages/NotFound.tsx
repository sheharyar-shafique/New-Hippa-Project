import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Logo />
      <h1 className="mt-8 text-5xl font-extrabold text-ink-900 tracking-tight">404</h1>
      <p className="mt-2 text-ink-600">We couldn&rsquo;t find that page.</p>
      <Link to="/" className="mt-6 btn-primary">Go home</Link>
    </div>
  );
}
