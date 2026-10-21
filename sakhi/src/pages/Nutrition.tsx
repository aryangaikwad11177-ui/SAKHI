import { useState } from 'react';
import { Check, Circle } from 'lucide-react';
import { A, BTN, Card, H2, Notice, PageHead } from '../ui';

type Item = { n: string; iron?: boolean; c?: boolean; protein?: boolean };
const GROUPS: { id: string; label: string; color: string; items: Item[] }[] = [
  { id: 'grain', label: 'Grains & millets', color: '#E99530', items: [{ n: 'Wheat roti' }, { n: 'Bajra / jowar roti', iron: true }, { n: 'Ragi roti or porridge', iron: true }, { n: 'Rice' }, { n: 'Poha', iron: true }, { n: 'Dalia / upma' }] },
  { id: 'protein', label: 'Pulses, eggs & protein', color: '#16845B', items: [{ n: 'Dal', iron: true, protein: true }, { n: 'Rajma / chole', iron: true, protein: true }, { n: 'Sprouts', iron: true, protein: true }, { n: 'Egg', iron: true, protein: true }, { n: 'Soya chunks', iron: true, protein: true }, { n: 'Curd / paneer / milk', protein: true }, { n: 'Fish / chicken (if eaten)', iron: true, protein: true }] },
  { id: 'veg', label: 'Vegetables & leafy greens', color: '#2E7D32', items: [{ n: 'Palak (spinach)', iron: true }, { n: 'Methi', iron: true }, { n: 'Amaranth (chaulai)', iron: true }, { n: 'Drumstick leaves', iron: true }, { n: 'Beetroot / carrot' }, { n: 'Seasonal sabzi' }] },
  { id: 'fruit', label: 'Fruit & vitamin C', color: '#C2410C', items: [{ n: 'Amla', c: true }, { n: 'Guava', c: true }, { n: 'Orange / mosambi', c: true }, { n: 'Lemon', c: true }, { n: 'Tomato', c: true }, { n: 'Banana / papaya' }] },
  { id: 'extra', label: 'Small extras', color: '#6B4F2A', items: [{ n: 'Til (sesame) ladoo', iron: true }, { n: 'Jaggery (gud)', iron: true }, { n: 'Peanuts / chana', iron: true, protein: true }] },
];
const COVER = ['grain', 'protein', 'veg', 'fruit'];

const arc = (a0: number, a1: number) => {
  const r = 90, cx = 100, cy = 100;
  const p = (a: number) => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  return `M${cx},${cy}L${p(a0)}A${r},${r} 0 0 1 ${p(a1)}Z`;
};

export default function Nutrition() {
  const [sel, setSel] = useState<Set<string>>(new Set());
  const toggle = (n: string) => setSel((s) => { const x = new Set(s); x.has(n) ? x.delete(n) : x.add(n); return x; });
  const chosen = GROUPS.flatMap((g) => g.items.filter((i) => sel.has(i.n)).map((i) => ({ ...i, g: g.id })));
  const covered = (id: string) => chosen.some((c) => c.g === id);
  const checks: [string, boolean][] = [
    ['An iron-rich food', chosen.some((c) => c.iron)],
    ['A vitamin C food (helps absorb iron)', chosen.some((c) => c.c)],
    ['A protein food', chosen.some((c) => c.protein)],
    ['At least 3 food groups (variety)', COVER.filter(covered).length >= 3],
  ];

  return (
    <div className="space-y-8">
      <PageHead title="Anaemia & Nutrition Centre" sub="Simple, practical information on iron, food and healthy growth. This is general education, not medical advice." />

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <H2>Common signs to notice</H2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Feeling tired or weak most of the time</li>
            <li>Dizziness or headaches</li>
            <li>Looking pale (face, inner eyelids, nails)</li>
            <li>Getting breathless or heart racing on light activity</li>
            <li>Difficulty concentrating in class</li>
          </ul>
          <p className="mt-2 text-sm text-muted">These signs can have other causes. Only a blood test by a health worker can tell if someone is anaemic.</p>
        </Card>
        <Card>
          <H2>Things that raise the risk</H2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Diet low in iron-rich foods, or skipping meals</li>
            <li>Heavy or long menstrual bleeding</li>
            <li>Stomach worms or frequent infections</li>
            <li>Rapid growth during adolescence</li>
            <li>Early pregnancy</li>
            <li>Drinking tea or coffee with meals (it reduces iron absorption)</li>
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card><h3 className="font-bold text-navy">Iron-rich foods</h3><p className="mt-1 text-sm">Lentils (dal), rajma, chana, sprouts, palak, methi, amaranth, drumstick leaves, sesame (til), jaggery, ragi, bajra, eggs, and meat or fish if you eat them.</p></Card>
        <Card><h3 className="font-bold text-navy">Vitamin C helps iron work</h3><p className="mt-1 text-sm">Add amla, guava, orange, lemon or tomato to the same meal as dal or greens. A squeeze of lemon on dal or sabzi is enough.</p></Card>
        <Card><h3 className="font-bold text-navy">Balanced meals & protein</h3><p className="mt-1 text-sm">Aim for 2–3 regular meals with grains or millets, a pulse or egg or curd, vegetables, and some fruit every day.</p></Card>
      </section>

      <section>
        <H2>Build a Balanced Plate</H2>
        <p className="mb-3 text-sm text-muted">Tap the foods you might eat in a day. The plate shows which food groups you have covered.</p>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {GROUPS.map((g) => (
              <fieldset key={g.id} className="rounded border border-line p-3">
                <legend className="flex items-center gap-2 px-1 text-sm font-bold text-navy">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ background: g.color }} aria-hidden /> {g.label}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <button key={i.n} type="button" aria-pressed={sel.has(i.n)} onClick={() => toggle(i.n)}
                      className={`rounded border px-3 py-1.5 text-sm ${sel.has(i.n) ? 'border-green bg-green font-semibold text-white' : 'border-line bg-white hover:border-navy'}`}>
                      {i.n}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <Card className="h-fit">
            <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48" role="img" aria-label="Plate showing food groups covered">
              <circle cx="100" cy="100" r="96" fill="#fff" stroke="#123B65" strokeWidth="3" />
              {COVER.map((id, k) => {
                const g = GROUPS.find((x) => x.id === id)!;
                const a0 = -Math.PI / 2 + (k * Math.PI) / 2;
                return <path key={id} d={arc(a0, a0 + Math.PI / 2)} fill={covered(id) ? g.color : '#eef2f6'} stroke="#fff" strokeWidth="3" />;
              })}
            </svg>
            <ul className="mt-2 grid grid-cols-2 gap-x-2 text-xs">
              {COVER.map((id) => { const g = GROUPS.find((x) => x.id === id)!; return <li key={id} className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: g.color }} aria-hidden />{g.label.split(' ')[0]}</li>; })}
            </ul>
            <ul className="mt-3 space-y-1.5 text-sm" aria-live="polite">
              {checks.map(([l, ok]) => (
                <li key={l} className="flex items-start gap-2">
                  {ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-line" aria-hidden />}
                  <span className={ok ? 'font-semibold text-green-dark' : 'text-muted'}>{l}</span>
                </li>
              ))}
            </ul>
            <button type="button" className={`${BTN.outline} mt-3 w-full`} onClick={() => setSel(new Set())}>Clear plate</button>
          </Card>
        </div>
      </section>

      <section>
        <H2>Practical Indian meal examples</H2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Breakfast', 'Ragi dosa or poha with peanuts, a glass of milk, and a guava or orange.'],
            ['Lunch', 'Bajra or wheat roti, dal, palak or methi sabzi, curd, and a squeeze of lemon.'],
            ['Dinner', 'Rice with rajma or chana, mixed vegetable sabzi, and tomato-cucumber salad.'],
          ].map(([t, d]) => (<Card key={t}><h3 className="font-bold text-navy">{t}</h3><p className="mt-1 text-sm">{d}</p></Card>))}
        </div>
      </section>

      <Notice kind="warn" title="Iron and folic acid supplements">
        <p>Under public health programmes such as Anemia Mukt Bharat, qualified health workers can provide iron and folic acid supplements to adolescents. Ask your ASHA, ANM, school health team or Primary Health Centre what is available in your area.</p>
        <p><b>Take supplements only as advised by a qualified health professional.</b> Tiredness or paleness needs a proper medical evaluation.</p>
      </Notice>

      <div className="flex flex-wrap gap-3">
        <A to="services?category=phc" className={BTN.green}>Find a Health Facility</A>
        <A to="screening" className={BTN.outline}>Take the confidential screening</A>
      </div>
    </div>
  );
}
