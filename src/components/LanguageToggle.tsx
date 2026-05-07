import { Globe } from 'lucide-react';
import { useLang } from '../i18n/LanguageProvider';
import { Lang } from '../i18n/translations';
import { cn } from '../lib/utils';

export default function LanguageToggle({
  variant = 'light',
  className,
}: {
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const { lang, setLang } = useLang();

  const base =
    variant === 'dark'
      ? 'bg-white/10 border-white/15 text-white/80'
      : 'bg-ink-50 border-ink-200 text-ink-600';
  const activeCls =
    variant === 'dark'
      ? 'bg-white text-ink-900 shadow-sm'
      : 'bg-white text-ink-900 shadow-sm border-ink-200';

  const Btn = ({ value, label }: { value: Lang; label: string }) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      aria-pressed={lang === value}
      className={cn(
        'px-2.5 py-1 rounded-md text-xs font-semibold transition',
        lang === value ? activeCls : 'hover:text-ink-900'
      )}
    >
      {label}
    </button>
  );

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border p-0.5',
        base,
        className
      )}
      role="group"
      aria-label="Language"
    >
      <Globe className="w-3.5 h-3.5 ml-1.5 opacity-60" />
      <Btn value="es" label="ES" />
      <Btn value="en" label="EN" />
    </div>
  );
}
