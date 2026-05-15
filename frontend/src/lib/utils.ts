import { Lang } from '../i18n/translations';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const localeFor = (lang?: Lang) => (lang === 'es' ? 'es-ES' : 'en-US');

export function formatDate(d: Date | string, lang?: Lang) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString(localeFor(lang), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(d: Date | string, lang?: Lang) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleTimeString(localeFor(lang), {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const REL_LABELS = {
  en: { now: 'just now', m: 'm ago', h: 'h ago', d: 'd ago' },
  es: { now: 'ahora mismo', m: ' min', h: ' h', d: ' d' },
};

export function relTime(d: Date | string, lang?: Lang) {
  const date = typeof d === 'string' ? new Date(d) : d;
  const labels = REL_LABELS[lang === 'es' ? 'es' : 'en'];
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return labels.now;
  if (diff < 3600) {
    const v = Math.floor(diff / 60);
    return lang === 'es' ? `hace ${v}${labels.m}` : `${v}${labels.m}`;
  }
  if (diff < 86400) {
    const v = Math.floor(diff / 3600);
    return lang === 'es' ? `hace ${v}${labels.h}` : `${v}${labels.h}`;
  }
  if (diff < 604800) {
    const v = Math.floor(diff / 86400);
    return lang === 'es' ? `hace ${v}${labels.d}` : `${v}${labels.d}`;
  }
  return formatDate(date, lang);
}

export function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
