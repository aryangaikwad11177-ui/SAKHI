import { useState } from 'react';
import { MapPin } from 'lucide-react';
import svc from '../../server/data/services.json';
import { HELPLINES } from '../lib/helplines';
import { useT } from '../lib/app';
import HelplineCard from '../components/HelplineCard';
import { A, BTN, Notice, PageHead, selectCls } from '../ui';

const STATES = [...new Set(svc.records.map((r) => r.state))].sort();

export default function Emergency() {
  const t = useT();
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const districts = [...new Set(svc.records.filter((r) => r.state === state).map((r) => r.district))].sort();

  return (
    <div className="space-y-6">
      <PageHead title={t('em.title')} sub="Large, tap-friendly cards. Call from any phone. In danger, do not wait: call 112 or tell an adult near you." />
      <Notice kind="danger" title="Safety notice">
        <p>If you are in immediate danger, contact emergency services (112) or a trusted adult right now. Counselling lines such as Tele-MANAS are not emergency services.</p>
      </Notice>

      <h2 className="text-lg font-bold text-red-800">Emergency services</h2>
      <div className="grid gap-4 md:grid-cols-2">{HELPLINES.filter((h) => h.type === 'Emergency').map((h) => <HelplineCard key={h.num} h={h} />)}</div>
      <h2 className="text-lg font-bold text-navy">Counselling services</h2>
      <div className="grid gap-4 md:grid-cols-2">{HELPLINES.filter((h) => h.type === 'Counselling').map((h) => <HelplineCard key={h.num} h={h} />)}</div>

      <Notice kind="warn" title="Verify before real-world use">
        <p>Availability, eligibility and routing of helplines differ by state (some states route 1098 and 181 through 112). They must be re-verified against official sources before any real launch. This prototype does not list any local numbers.</p>
      </Notice>

      <section className="rounded border border-line p-4">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-navy"><MapPin className="h-5 w-5" aria-hidden /> Services near you (optional)</h2>
        <p className="mb-3 text-sm text-muted">Choose a state and district. Please do not enter your home address.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">State
            <select className={`${selectCls} mt-1 font-normal`} value={state} onChange={(e) => { setState(e.target.value); setDistrict(''); }}>
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">District
            <select className={`${selectCls} mt-1 font-normal`} value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!state}>
              <option value="">Select district</option>
              {districts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
        </div>
        {state && (
          <div className="mt-3 text-sm">
            <p>Showing the service directory for <b>{district || 'all districts'}, {state}</b>. National numbers above work everywhere.</p>
            <A to={`services?state=${encodeURIComponent(state)}${district ? `&district=${encodeURIComponent(district)}` : ''}`} className={`${BTN.green} mt-2`}>Open service directory</A>
          </div>
        )}
      </section>
    </div>
  );
}
