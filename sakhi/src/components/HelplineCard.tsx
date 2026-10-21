import { useState } from 'react';
import { Check, Copy, Phone } from 'lucide-react';
import { copyText, useT } from '../lib/app';
import type { Helpline } from '../lib/helplines';
import { BTN } from '../ui';

export default function HelplineCard({ h }: { h: Helpline }) {
  const t = useT();
  const [done, setDone] = useState(false);
  const emergency = h.type === 'Emergency';
  return (
    <article className={`rounded border-2 p-4 ${emergency ? 'border-red-700' : 'border-navy'} bg-white`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-4xl font-bold tracking-tight text-navy">{h.num}</p>
        <span className={`rounded px-2 py-0.5 text-xs font-bold ${emergency ? 'bg-red-100 text-red-900' : 'bg-sky-100 text-navy-dark'}`}>
          {h.type === 'Emergency' ? 'Emergency service' : 'Counselling service'}
        </span>
      </div>
      <h3 className="mt-1 font-semibold text-ink">{h.name}</h3>
      <p className="mt-1 text-sm text-muted">{h.when}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a href={`tel:${h.num}`} className={emergency ? BTN.danger : BTN.primary}>
          <Phone className="h-4 w-4" aria-hidden /> {t('em.call')} {h.num}
        </a>
        <button
          type="button"
          className={BTN.outline}
          onClick={() => copyText(h.num).then(() => { setDone(true); setTimeout(() => setDone(false), 2000); })}
        >
          {done ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          <span aria-live="polite">{done ? t('em.copied') : t('em.copy')}</span>
        </button>
      </div>
    </article>
  );
}
