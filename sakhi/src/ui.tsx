import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { AlertTriangle, Info, OctagonAlert, CheckCircle2 } from 'lucide-react';

const base = 'inline-flex items-center justify-center gap-2 rounded px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50';
export const BTN = {
  primary: `${base} bg-navy text-white hover:bg-navy-dark`,
  green: `${base} bg-green text-white hover:bg-green-dark`,
  saffron: `${base} bg-saffron text-navy-dark hover:brightness-95`,
  danger: `${base} bg-red-700 text-white hover:bg-red-800`,
  outline: `${base} border border-navy bg-white text-navy hover:bg-soft`,
};

// Hash link: <A to="services?cat=phc" />
export function A({ to, className = '', children, ...rest }: { to: string; className?: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={'#/' + to} className={className} {...rest}>{children}</a>;
}
export function Btn({ className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={className} {...p} />;
}

export function PageHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="border-b-2 border-navy pb-3">
      <h1 className="flex items-center gap-3 text-2xl font-bold text-navy sm:text-3xl">
        <span className="h-7 w-1.5 shrink-0 bg-saffron" aria-hidden />
        {title}
      </h1>
      {sub && <p className="mt-2 max-w-3xl text-muted">{sub}</p>}
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 border-l-4 border-green pl-3 text-xl font-bold text-navy">{children}</h2>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded border border-line bg-white p-4 ${className}`}>{children}</div>;
}

const NK = {
  info: ['border-navy bg-sky-50 text-navy-dark', Info],
  warn: ['border-saffron bg-amber-50 text-amber-950', AlertTriangle],
  danger: ['border-red-700 bg-red-50 text-red-950', OctagonAlert],
  ok: ['border-green bg-emerald-50 text-emerald-950', CheckCircle2],
} as const;
export function Notice({ kind = 'info', title, children }: { kind?: keyof typeof NK; title?: string; children: ReactNode }) {
  const [cls, Icon] = NK[kind];
  return (
    <div role={kind === 'danger' ? 'alert' : undefined} className={`flex gap-3 rounded border-l-4 border-y border-r p-3 text-sm ${cls}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

export function SampleBadge({ children = 'Sample Data' }: { children?: ReactNode }) {
  return <span className="rounded border border-saffron bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">{children}</span>;
}

export function Loading({ text = 'Loading…' }: { text?: string }) {
  return <p role="status" className="py-6 text-center text-muted">{text}</p>;
}
export function ErrorBox({ msg, retry }: { msg: string; retry: () => void }) {
  return (
    <Notice kind="warn" title="Something went wrong">
      <p>{msg}</p>
      <button type="button" onClick={retry} className={`${BTN.outline} mt-2`}>Try again</button>
    </Notice>
  );
}

export const selectCls = 'w-full rounded border border-line bg-white px-3 py-2 text-sm';
