import { useState } from 'react';
import dash from '../../server/data/dashboard.json';
import { useFetch } from '../lib/app';
import { Card, H2, Loading, Notice, PageHead, SampleBadge, selectCls } from '../ui';

interface Row {
  district: string; month: string; age: string; started: number; screened: number; anaemiaFlags: number;
  nutritionRef: number; mentalRef: number; safetyRef: number; fuNutrition: number; fuMental: number; fuSafety: number;
}
interface Dash { label: string; months: string[]; ages: string[]; districts: { name: string; state: string; target: number }[]; rows: Row[] }

const TYPES = {
  nutrition: ['Nutrition support', 'nutritionRef', 'fuNutrition'],
  mental: ['Mental wellness', 'mentalRef', 'fuMental'],
  safety: ['Safety-related support', 'safetyRef', 'fuSafety'],
} as const;
type Svc = keyof typeof TYPES | 'all';
const sum = (rows: Row[], f: (r: Row) => number) => rows.reduce((a, r) => a + f(r), 0);
const n = (x: number) => x.toLocaleString('en-IN');
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);

function Bar({ label, value, max, text, color = 'bg-green' }: { label: string; value: number; max: number; text: string; color?: string }) {
  return (
    <div>
      <div className="mb-0.5 flex justify-between text-sm"><span>{label}</span><span className="font-semibold">{text}</span></div>
      <div className="h-3 overflow-hidden rounded bg-soft ring-1 ring-line" role="img" aria-label={`${label}: ${text}`}>
        <div className={`h-full ${color}`} style={{ width: `${Math.min(100, pct(value, max))}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data, loading, offline } = useFetch<Dash>('/api/dashboard', dash as Dash);
  const [district, setDistrict] = useState('all');
  const [age, setAge] = useState('all');
  const [month, setMonth] = useState('all');
  const [svc, setSvc] = useState<Svc>('all');

  const types = svc === 'all' ? (Object.keys(TYPES) as (keyof typeof TYPES)[]) : [svc];
  const refs = (r: Row) => sum2(r, 1);
  const fus = (r: Row) => sum2(r, 2);
  function sum2(r: Row, k: 1 | 2) { return types.reduce((a, t) => a + r[TYPES[t][k]], 0); }

  const base = data.rows.filter((r) => (district === 'all' || r.district === district) && (age === 'all' || r.age === age));
  const rows = base.filter((r) => month === 'all' || r.month === month);
  const screened = sum(rows, (r) => r.screened);
  const started = sum(rows, (r) => r.started);
  const refTotal = sum(rows, refs);
  const fuTotal = sum(rows, fus);

  const monthly = data.months.map((m) => {
    const rs = base.filter((r) => r.month === m);
    return { m, screened: sum(rs, (r) => r.screened), refs: sum(rs, refs) };
  });
  const maxM = Math.max(1, ...monthly.map((x) => x.screened));

  const cov = data.districts
    .filter((d) => district === 'all' || d.name === district)
    .map((d) => {
      const s = sum(data.rows.filter((r) => r.district === d.name && (age === 'all' || r.age === age)), (r) => r.screened);
      return { ...d, screened: s, cov: pct(s, d.target) };
    })
    .sort((a, b) => a.cov - b.cov);
  const underserved = cov.filter((d) => d.cov < 40);

  const kpis: [string, string][] = [
    ['Girls screened', n(screened)],
    ['Anaemia-risk flags (illustrative)', n(sum(rows, (r) => r.anaemiaFlags))],
    ...(svc === 'all' || svc === 'nutrition' ? [['Nutrition support referrals', n(sum(rows, (r) => r.nutritionRef))] as [string, string]] : []),
    ...(svc === 'all' || svc === 'mental' ? [['Mental wellness referrals', n(sum(rows, (r) => r.mentalRef))] as [string, string]] : []),
    ...(svc === 'all' || svc === 'safety' ? [['Safety-related referrals', n(sum(rows, (r) => r.safetyRef))] as [string, string]] : []),
  ];

  return (
    <div className="space-y-6">
      <PageHead title="District Health Monitoring Dashboard" sub="Demonstration view for authorised health workers and project evaluators. It shows anonymised, aggregate numbers only." />
      <Notice kind="warn" title="Illustrative Data – Not Official Government Statistics">
        <p>Every number on this page is fictional demonstration data. There is <b>no login</b> and no real health records here. A real deployment needs secure authentication, consent procedures and safeguarding protocols.</p>
      </Notice>
      {offline && <p className="text-xs text-muted">Showing the demonstration data built into this page (server not reachable).</p>}
      {loading && <Loading />}

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold">District
            <select className={`${selectCls} mt-1 font-normal`} value={district} onChange={(e) => setDistrict(e.target.value)}>
              <option value="all">All districts</option>{data.districts.map((d) => <option key={d.name} value={d.name}>{d.name} ({d.state})</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Age group
            <select className={`${selectCls} mt-1 font-normal`} value={age} onChange={(e) => setAge(e.target.value)}>
              <option value="all">All (10–19)</option>{data.ages.map((a) => <option key={a} value={a}>{a.replace('-', '–')} years</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Month
            <select className={`${selectCls} mt-1 font-normal`} value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="all">All months</option>{data.months.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">Service type
            <select className={`${selectCls} mt-1 font-normal`} value={svc} onChange={(e) => setSvc(e.target.value as Svc)}>
              <option value="all">All services</option>{(Object.keys(TYPES) as (keyof typeof TYPES)[]).map((t) => <option key={t} value={t}>{TYPES[t][0]}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Key figures">
        {kpis.map(([l, v]) => (
          <Card key={l}><p className="text-xs font-semibold uppercase tracking-wide text-muted">{l}</p><p className="mt-1 text-2xl font-bold text-navy">{v}</p><SampleBadge>Illustrative</SampleBadge></Card>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <H2>Monthly screening trend</H2>
          <div className="flex h-44 items-end gap-3" role="img" aria-label="Bar chart of girls screened and referrals per month">
            {monthly.map((x) => (
              <div key={x.m} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex h-36 w-full items-end justify-center gap-1">
                  <div className="w-1/2 bg-navy" style={{ height: `${(x.screened / maxM) * 100}%` }} title={`${x.m}: ${n(x.screened)} screened`} />
                  <div className="w-1/2 bg-saffron" style={{ height: `${(x.refs / maxM) * 100}%` }} title={`${x.m}: ${n(x.refs)} referrals`} />
                </div>
                <span className="text-[11px] text-muted">{x.m.slice(0, 3)}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 flex gap-4 text-xs"><span><span className="mr-1 inline-block h-2.5 w-2.5 bg-navy" />Screened</span><span><span className="mr-1 inline-block h-2.5 w-2.5 bg-saffron" />Referrals</span></p>
          <details className="mt-2 text-sm">
            <summary className="cursor-pointer font-semibold text-navy">View as table</summary>
            <table className="mt-2 w-full text-left text-xs"><thead><tr><th className="py-1">Month</th><th>Screened</th><th>Referrals</th></tr></thead>
              <tbody>{monthly.map((x) => <tr key={x.m} className="border-t border-line"><td className="py-1">{x.m}</td><td>{n(x.screened)}</td><td>{n(x.refs)}</td></tr>)}</tbody></table>
          </details>
        </Card>

        <Card>
          <H2>Completion and follow-up</H2>
          <div className="space-y-4">
            <Bar label="Screening completion (finished ÷ started)" value={screened} max={started} text={`${pct(screened, started)}%`} />
            <Bar label="Referral follow-up completed" value={fuTotal} max={refTotal} text={`${pct(fuTotal, refTotal)}% (${n(fuTotal)} of ${n(refTotal)})`} color="bg-navy" />
          </div>
          <p className="mt-4 text-xs text-muted">Follow-up shows how many referrals were later confirmed as completed by an authorised health worker (illustrative).</p>
        </Card>
      </div>

      <Card>
        <H2>District-wise service coverage</H2>
        <p className="mb-3 text-sm text-muted">Girls screened (Apr–Sep 2026, cumulative) as a share of the sample target population. Lowest coverage first.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {cov.map((d) => <Bar key={d.name} label={`${d.name}, ${d.state}`} value={d.screened} max={d.target} text={`${d.cov}%`} color={d.cov < 40 ? 'bg-saffron' : 'bg-green'} />)}
        </div>
      </Card>

      <Card>
        <H2>How anonymised aggregate data helps</H2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Spot districts with low coverage so outreach camps and health workers can be directed there.
            {underserved.length > 0 && <> In this sample, <b>{underserved.map((d) => d.name).join(', ')}</b> fall below 40%.</>}</li>
          <li>See which months or age groups need more nutrition, mental wellness or protection capacity.</li>
          <li>Track whether referrals are actually followed up, and improve health service delivery.</li>
          <li>Only totals are shown. No individual girl’s answers, identity or case details are ever displayed.</li>
        </ul>
      </Card>
    </div>
  );
}
