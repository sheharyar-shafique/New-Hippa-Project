import { cn } from '../lib/utils';
import { useT } from '../i18n/LanguageProvider';

const styles: Record<string, string> = {
  draft: 'bg-amber-50 text-amber-700 border border-amber-100',
  finalized: 'bg-brand-50 text-brand-700 border border-brand-100',
  signed: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  high: 'bg-red-50 text-red-700 border border-red-100',
  low: 'bg-amber-50 text-amber-700 border border-amber-100',
  normal: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  borderline: 'bg-amber-50 text-amber-700 border border-amber-100',
};

export default function StatusPill({
  label,
  variant = 'draft',
  className,
  translateAs,
}: {
  label: string;
  variant?: keyof typeof styles | string;
  className?: string;
  /**
   * Optional i18n namespace for translating the label:
   * - "status" — note status (draft, finalized, signed)
   * - "flags"  — lab flags (High, Low, Normal, Borderline)
   * - "likelihood" — differentials (High, Moderate, Low)
   * If omitted, the label is rendered as-is.
   */
  translateAs?: 'status' | 'flags' | 'likelihood';
}) {
  const t = useT();
  const cls = styles[variant.toLowerCase()] ?? styles.draft;
  const text = translateAs ? t<string>(`${translateAs}.${label}`) : label;
  return <span className={cn('pill', cls, className)}>{text}</span>;
}
