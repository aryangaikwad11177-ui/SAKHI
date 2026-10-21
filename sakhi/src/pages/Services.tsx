import { useState } from 'react';
import { ExternalLink, MapPin, Search } from 'lucide-react';
import svc from '../../server/data/services.json';
import { useFetch } from '../lib/app';
import { Card, Loading, Notice, PageHead, SampleBadge, selectCls } from '../ui';
import type { PageProps } from '../App';

// Record shape the backend (or a future verified government directory / maps API) should return.
interface Rec {
  id: string; name: string; category: string; categoryLabel: string; state: string; district: string;
  address: string | null; phone: string | null; verified: boolean; sample: boolean;
}
interface Resp { total: number; records: Rec[]; sample: boolean }

const fallback: Resp = { total: svc.records.length, records: svc.records as Rec[], sample: true };
const STATES = [...new Set(svc.records.map((r) => r.state))].sort();

export default function Services({ params }: PageProps) {
  const { data, loading, offline } = useFetch<Resp>('/api/services', fallback);
  const [state, setState] = useState(params.get('state') ?? '');
  const [district, setDistrict] = useState(params.get('district') ?? '');
  const [cat, setCat] = useState(params.get('category') ?? '');
  const [text, setText] = useState('');

  const districts = [...new Set(data.records.filter((r) => !state || r.state === state).map((r) => r.district))].sort();
  const q = text.trim().toLowerCase();
  const list = data.records.filter(
    (r) =>
      (!state || r.state === state) && (!district || r.district === district) && (!cat || r.category === cat) &&
      (!q || `${r.name} ${r.district} ${r.state} ${r.categoryLabel}`.toLowerCase().includes(q)),
  );
  const clear = () => { setState(''); setDistrict(''); setCat(''); setText(''); };

  return (
    <div className="space-y-5">
      <PageHead title="Find Nearby Health and Support Services" sub="Filter by state, district and type of service." />
      <Notice kind="warn" title="Sample data">
        <p>The records below are <b>sample entries for demonstration</b>. They are not real facilities and carry no real addresses or phone numbers. A verified government directory or maps API can be connected later through the same record format.</p>
      </Notice>

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold">State
            <select className={`${selectCls} mt-1 font-normal`} value={state} onChange={(e) => { setState(e.target.value); setDistrict(''); }}>
              <option value="">All states</option>{STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">District
            <select className={`${selectCls} mt-1 font-normal`} value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="">All districts</option>{districts.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Service category
            <select className={`${selectCls} mt-1 font-normal`} value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">All categories</option>{svc.categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Search
            <span className="relative mt-1 block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted" aria-hidden />
              <input className={`${selectCls} pl-8 font-normal`} placeholder="Name or place" value={text} onChange={(e) => setText(e.target.value)} />
            </span>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <span role="status">{loading ? 'Loading…' : `${list.length} of ${data.records.length} sample records`}</span>
          <button type="button" className="font-semibold text-navy underline" onClick={clear}>Clear filters</button>
        </div>
      </Card>
      {offline && <p className="text-xs text-muted">Showing the sample directory built into this page (server not reachable).</p>}

      {loading && <Loading />}
      {!loading && list.length === 0 && (
        <Card className="py-8 text-center">
          <p className="font-semibold text-navy">No services match these filters.</p>
          <p className="text-sm text-muted">Try another district or category, or clear the filters.</p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <div className="mb-1 flex items-start justify-between gap-2">
              <span className="rounded bg-sky-100 px-2 py-0.5 text-xs font-semibold text-navy-dark">{r.categoryLabel}</span>
              {r.sample && <SampleBadge />}
            </div>
            <h2 className="font-bold text-navy">{r.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted"><MapPin className="h-4 w-4" aria-hidden /> {r.district}, {r.state}</p>
            <dl className="mt-2 text-sm">
              <div className="flex gap-1"><dt className="font-semibold">Address:</dt><dd className="text-muted">{r.address ?? 'Not available (sample record)'}</dd></div>
              <div className="flex gap-1"><dt className="font-semibold">Phone:</dt><dd className="text-muted">{r.phone ?? 'Not verified'}</dd></div>
            </dl>
            <a
              className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold text-navy underline"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.categoryLabel} ${r.district} ${r.state}`)}`}
              target="_blank" rel="noopener noreferrer"
            >
              Search real facilities on map <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
