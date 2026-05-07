import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { dict, deepGet, Lang } from './translations';

const STORAGE_KEY = 'notemd.lang';

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <T = string>(path: string) => T;
};

const LanguageContext = createContext<Ctx | null>(null);

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'es';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'es') return stored;
  // Default to Spanish (product focus). Browser hint only flips to EN
  // when the user is clearly on an English-locale browser.
  const browser = window.navigator.language?.toLowerCase() ?? '';
  return browser.startsWith('en') ? 'en' : 'es';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback(
    <T,>(path: string): T => {
      const value = deepGet(dict[lang], path);
      if (value == null) {
        // Fallback to English if Spanish key is missing.
        const fallback = deepGet(dict.en, path);
        return (fallback ?? path) as T;
      }
      return value as T;
    },
    [lang]
  );

  const value = useMemo<Ctx>(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>');
  return ctx;
}

export function useT() {
  return useLang().t;
}
