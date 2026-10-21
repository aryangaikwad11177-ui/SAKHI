import { createContext, useContext, useEffect, useState } from 'react';
import { T } from './i18n';

export type Lang = 'en' | 'hi';
export interface Settings { lang: Lang; size: number; contrast: boolean }

export const AppCtx = createContext<{ s: Settings; set: (p: Partial<Settings>) => void }>({
  s: { lang: 'en', size: 0, contrast: false },
  set: () => {},
});
export const useApp = () => useContext(AppCtx);
export function useT() {
  const { s } = useApp();
  return (k: string) => T[k]?.[s.lang] ?? T[k]?.en ?? k;
}

// Fetches from the backend API. If there is no backend (file opened directly, static hosting,
// server down) it falls back to the sample data bundled inside this file, so the page always works.
export function useFetch<D>(url: string, fallback: D) {
  const [st, setSt] = useState<{ data: D; loading: boolean; offline: boolean }>({ data: fallback, loading: true, offline: false });
  useEffect(() => {
    const ac = new AbortController();
    fetch(url, { signal: ac.signal })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json() as Promise<D>;
      })
      .then((data) => setSt({ data, loading: false, offline: false }))
      .catch((e) => {
        if (e.name !== 'AbortError') setSt({ data: fallback, loading: false, offline: true });
      });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return st;
}

// Hash router: "#/services?cat=phc" -> { page: 'services', params }
export function useRoute() {
  const read = () => {
    const h = location.hash.replace(/^#\/?/, '');
    const [page, query = ''] = h.split('?');
    return { page, params: new URLSearchParams(query), key: h };
  };
  const [r, setR] = useState(read);
  useEffect(() => {
    const on = () => {
      setR(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return r;
}

export function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  return new Promise((resolve) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    resolve();
  });
}

// Discreet exit: replaces the current history entry with a neutral site.
export const quickExit = () => window.location.replace('https://www.google.com');
