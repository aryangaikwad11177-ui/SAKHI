import { useState } from 'react';
import { BarChart3, Contrast, LogOut, Menu, ShieldPlus, X } from 'lucide-react';
import { useApp, useT, quickExit } from '../lib/app';
import { A, BTN } from '../ui';

export const NAV = [
  ['', 'nav.home'],
  ['screening', 'nav.screening'],
  ['services', 'nav.services'],
  ['wellness', 'nav.wellness'],
  ['rights', 'nav.rights'],
  ['emergency', 'nav.emergency'],
  ['about', 'nav.about'],
] as const;

export function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="SAKHI logo">
      <path d="M20 2 5 8v10c0 9.5 6.3 16 15 20 8.7-4 15-10.5 15-20V8z" fill="#123B65" />
      <path d="M20 28s-8-5-8-10.5a4.3 4.3 0 0 1 8-2.2 4.3 4.3 0 0 1 8 2.2C28 23 20 28 20 28z" fill="#16845B" stroke="#fff" strokeWidth="1.2" />
      <path d="M5 8 20 2l15 6" fill="none" stroke="#E99530" strokeWidth="2.5" />
    </svg>
  );
}

export default function Header({ page }: { page: string }) {
  const { s, set } = useApp();
  const t = useT();
  const [open, setOpen] = useState(false);
  const small = 'rounded border border-white/40 px-2 py-0.5 text-xs font-semibold hover:bg-white/15 disabled:opacity-40';

  return (
    <header className="border-b border-line bg-white">
      {/* tricolour-inspired accent */}
      <div className="flex h-1.5" aria-hidden>
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 border-y border-line bg-white" />
        <div className="flex-1 bg-green" />
      </div>

      {/* utility bar */}
      <div className="bg-navy-dark text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-1.5 text-xs">
          <p className="font-medium">{t('proto')}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="underline" onClick={() => document.getElementById('main')?.focus()}>{t('skip')}</button>
            <span className="flex items-center gap-1" role="group" aria-label={t('size')}>
              <button type="button" className={small} onClick={() => set({ size: Math.max(0, s.size - 1) })} disabled={s.size === 0} aria-label="Decrease text size">A−</button>
              <button type="button" className={small} onClick={() => set({ size: 0 })} aria-label="Reset text size">A</button>
              <button type="button" className={small} onClick={() => set({ size: Math.min(2, s.size + 1) })} disabled={s.size === 2} aria-label="Increase text size">A+</button>
            </span>
            <button type="button" className={`${small} inline-flex items-center gap-1`} aria-pressed={s.contrast} onClick={() => set({ contrast: !s.contrast })}>
              <Contrast className="h-3.5 w-3.5" aria-hidden /> {t('contrast')}
            </button>
            <button type="button" className={small} onClick={() => set({ lang: s.lang === 'en' ? 'hi' : 'en' })} lang={s.lang === 'en' ? 'hi' : 'en'}>
              {t('langBtn')}
            </button>
            <A to="dashboard" className={`${small} inline-flex items-center gap-1`}><BarChart3 className="h-3.5 w-3.5" aria-hidden /> {t('worker')}</A>
          </div>
        </div>
      </div>

      {/* branding */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <A to="" className="flex items-center gap-3" aria-label="SAKHI home">
          <Logo />
          <span>
            <span className="block text-2xl font-bold leading-none text-navy">SAKHI</span>
            <span className="block text-xs font-semibold text-muted sm:text-sm">{t('site.sub')}</span>
            <span className="hidden text-[11px] text-muted lg:block">{t('project')}</span>
          </span>
        </A>
        <div className="flex items-center gap-2">
          <button type="button" onClick={quickExit} className={`${BTN.outline} hidden sm:inline-flex`} title="Leaves this site immediately">
            <LogOut className="h-4 w-4" aria-hidden /> {t('quickexit')}
          </button>
          <A to="emergency" className={BTN.saffron}><ShieldPlus className="h-4 w-4" aria-hidden /> {t('help')}</A>
          <button type="button" className="rounded border border-line p-2 text-navy md:hidden" aria-expanded={open} aria-controls="nav" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* navigation */}
      <nav id="nav" aria-label="Main" className={`bg-navy text-white ${open ? 'block' : 'hidden'} md:block`}>
        <ul className="mx-auto flex max-w-6xl flex-col md:flex-row md:flex-wrap">
          {NAV.map(([to, key]) => (
            <li key={to}>
              <A
                to={to}
                onClick={() => setOpen(false)}
                aria-current={page === to ? 'page' : undefined}
                className={`block border-b-4 px-4 py-3 text-sm font-semibold hover:bg-white/10 ${page === to ? 'border-saffron bg-white/10' : 'border-transparent'}`}
              >
                {t(key)}
              </A>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
