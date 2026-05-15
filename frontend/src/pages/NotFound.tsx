import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { useT } from '../i18n/LanguageProvider';

export default function NotFound() {
  const t = useT();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <Logo />
      <h1 className="mt-8 text-5xl font-extrabold text-ink-900 tracking-tight">{t('notFound.title')}</h1>
      <p className="mt-2 text-ink-600">{t('notFound.body')}</p>
      <Link to="/" className="mt-6 btn-primary">{t('common.goHome')}</Link>
    </div>
  );
}
