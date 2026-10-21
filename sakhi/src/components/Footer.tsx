import { useT } from '../lib/app';
import { A } from '../ui';
import { Logo } from './Header';

const cols: [string, [string, string][]][] = [
  ['About SAKHI', [['about', 'About the initiative'], ['about', 'Referral workflow'], ['dashboard', 'Dashboard (demo)']]],
  ['Health & Nutrition', [['nutrition', 'Anaemia & nutrition'], ['screening', 'Confidential screening'], ['services', 'Find services']]],
  ['Child Protection', [['rights', 'Know your rights'], ['services?category=counselling', 'Child protection support'], ['wellness', 'Mental wellness']]],
  ['Emergency Contacts', [['emergency', '112 · 1098 · 181 · 14416'], ['emergency', 'Emergency Help Centre']]],
];

export default function Footer() {
  const t = useT();
  return (
    <footer className="mt-8 border-t-4 border-navy bg-soft">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map(([h, links]) => (
          <div key={h}>
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-navy">{h}</h2>
            <ul className="space-y-1 text-sm">
              {links.map(([to, label]) => (
                <li key={label}><A to={to} className="text-navy underline-offset-2 hover:underline">{label}</A></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 border-t border-line px-4 py-5 text-sm text-muted md:grid-cols-3">
        <div>
          <h2 className="mb-1 font-bold text-navy">Privacy & Safeguarding</h2>
          <p>No names, phone numbers or addresses are collected. Screening answers stay in your browser and disappear when you leave or refresh. No cookies, no tracking.</p>
        </div>
        <div>
          <h2 className="mb-1 font-bold text-navy">Accessibility</h2>
          <p>Use the A−/A/A+ buttons for text size and the High contrast button at the top of every page. The site works with a keyboard and screen readers.</p>
        </div>
        <div>
          <h2 className="mb-1 font-bold text-navy">Disclaimer</h2>
          <p>{t('disclaimer')}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 bg-navy-dark px-4 py-3 text-xs text-white">
        <Logo className="h-5 w-5" /> <span>SAKHI · NIRMAAN Project · Prototype for demonstration only</span>
      </div>
    </footer>
  );
}
