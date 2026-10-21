import { useState } from 'react';
import { ArrowLeft, Lock, LogOut, Phone, RotateCcw } from 'lucide-react';
import { A, BTN, Card, H2, Notice, PageHead } from '../ui';

// All logic is local. Nothing typed or chosen here is stored or transmitted.
type Opt = { l: string; r: number; skip?: boolean };
type Cat = 'urgent' | 'nutrition' | 'emotional' | 'safety' | 'support';
type Q = { cat: Cat; q: string; opts: Opt[] };
const o = (l: string, r: number): Opt => ({ l, r });
const SKIP: Opt = { l: 'Prefer not to answer', r: 0, skip: true };

const QS: Q[] = [
  { cat: 'urgent', q: 'Right now, are you in immediate danger, or do you have fainting, chest pain or trouble breathing?', opts: [o('No', 0), o('Yes', 3), SKIP] },
  { cat: 'nutrition', q: 'In the past month, how often have you felt unusually tired, weak or dizzy, or found it hard to concentrate?', opts: [o('Rarely or never', 0), o('Sometimes', 1), o('Often', 2), SKIP] },
  { cat: 'nutrition', q: 'How often do you eat iron-rich foods (dal, beans, green leafy vegetables, sesame, jaggery, eggs, or meat if you eat it)?', opts: [o('Most days', 0), o('A few days a week', 1), o('Rarely', 2), SKIP] },
  { cat: 'nutrition', q: 'Do you usually get 2–3 regular meals a day?', opts: [o('Yes', 0), o('Sometimes', 1), o('No', 2), SKIP] },
  { cat: 'nutrition', q: 'Does your daily food include a variety: grains, pulses, vegetables, fruit, and milk, curd or eggs?', opts: [o('Usually', 0), o('Sometimes', 1), o('Rarely', 2), SKIP] },
  { cat: 'emotional', q: 'In the past two weeks, have you felt sad, hopeless, or lost interest in things for several days?', opts: [o('Rarely or never', 0), o('Some days', 1), o('Most days', 2), SKIP] },
  { cat: 'emotional', q: 'How often do you feel very stressed or anxious, for example about studies, family or friends?', opts: [o('Rarely', 0), o('Sometimes', 1), o('Often', 2), SKIP] },
  { cat: 'safety', q: 'Do you feel safe at home?', opts: [o('Yes', 0), o('Sometimes', 1), o('No', 2), SKIP] },
  { cat: 'safety', q: 'Do you feel safe at school, or on the way there?', opts: [o('Yes', 0), o('Sometimes', 1), o('No', 2), SKIP] },
  { cat: 'safety', q: 'Do you feel safe and respected in your relationships and friendships?', opts: [o('Yes', 0), o('Sometimes', 1), o('No', 2), SKIP] },
  { cat: 'safety', q: 'Is anyone pressuring you to get married, or to do something you do not want to do?', opts: [o('No', 0), o('Not sure', 1), o('Yes', 2), SKIP] },
  { cat: 'support', q: 'Would you like to speak privately with a trained health worker or counsellor?', opts: [o('Yes, I would like that', 2), o('Maybe later', 1), o('Not now', 0), SKIP] },
];

type Stage = 'intro' | 'age' | 'q' | 'urgent' | 'result' | 'adult';

export default function Screening() {
  const [stage, setStage] = useState<Stage>('intro');
  const [i, setI] = useState(0);
  const [ans, setAns] = useState<(Opt | undefined)[]>([]);

  const reset = () => { setStage('intro'); setI(0); setAns([]); };
  const answer = (opt: Opt) => {
    const next = [...ans];
    next[i] = opt;
    setAns(next);
    if (QS[i].cat === 'urgent' && opt.r >= 3) setStage('urgent');
    else if (i + 1 < QS.length) setI(i + 1);
    else setStage('result');
  };
  const back = () => (i > 0 ? setI(i - 1) : setStage('age'));

  const score = (cat: Cat) => {
    const idx = QS.map((q, k) => (q.cat === cat ? k : -1)).filter((k) => k >= 0);
    const given = idx.map((k) => ans[k]).filter((x): x is Opt => !!x && !x.skip);
    return { sum: given.reduce((a, x) => a + x.r, 0), max2: given.some((x) => x.r >= 2), answered: given.length };
  };

  const head = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <PageHead title="Confidential Health Screening" />
    </div>
  );
  const exit = (
    <A to="" className={BTN.outline}><LogOut className="h-4 w-4" aria-hidden /> Exit Screening</A>
  );
  const disclaimer = (
    <Notice kind="info" title="Not a medical diagnosis">
      <p>This questionnaire gives general guidance only. It cannot diagnose anaemia, malnutrition, depression or abuse. Only a qualified health professional can do that.</p>
    </Notice>
  );

  if (stage === 'intro')
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        {head}
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy"><Lock className="h-5 w-5" aria-hidden /> Privacy notice</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>It takes about 3 minutes. Every question can be skipped with “Prefer not to answer”.</li>
            <li>We do not ask for your name, phone number or address.</li>
            <li>Your answers are <b>not saved and not sent anywhere</b>. They are worked out on your device and vanish when you leave or refresh this page.</li>
            <li>You can press “Exit Screening” at any time.</li>
          </ul>
        </Card>
        {disclaimer}
        <div className="flex flex-wrap gap-3">
          <button type="button" className={BTN.green} onClick={() => setStage('age')}>I understand, continue</button>
          {exit}
        </div>
      </div>
    );

  if (stage === 'age')
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        {head}
        <Card>
          <h2 className="text-lg font-bold text-navy">Which age group are you in?</h2>
          <div className="mt-3 grid gap-2">
            {['10–14 years', '15–19 years', '20 years or above'].map((a, k) => (
              <button key={a} type="button" className={`${BTN.outline} justify-start`} onClick={() => { if (k === 2) setStage('adult'); else { setI(0); setStage('q'); } }}>
                {a}
              </button>
            ))}
          </div>
        </Card>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={BTN.outline} onClick={() => setStage('intro')}><ArrowLeft className="h-4 w-4" aria-hidden /> Back</button>
          {exit}
        </div>
      </div>
    );

  if (stage === 'adult')
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        {head}
        <Notice kind="info" title="This screening is designed for adolescent girls (10–19 years)">
          <p>For adults, these services may help:</p>
        </Notice>
        <Card>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Women’s health and general check-ups at your nearest PHC, CHC or government hospital.</li>
            <li>One Stop Centres support women facing violence (<A to="services?category=osc" className="font-semibold text-navy underline">find one</A>).</li>
            <li>Women Helpline <a className="font-bold underline" href="tel:181">181</a> (availability varies by state) and Tele-MANAS <a className="font-bold underline" href="tel:14416">14416</a> for counselling.</li>
          </ul>
        </Card>
        <div className="flex flex-wrap gap-3"><A to="services" className={BTN.green}>Find services</A>{exit}</div>
      </div>
    );

  if (stage === 'urgent')
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        {head}
        <Notice kind="danger" title="Please get help right now">
          <p>If you are in danger or feel very unwell, call for help immediately or tell an adult near you.</p>
        </Notice>
        <div className="flex flex-wrap gap-3">
          <a href="tel:112" className={BTN.danger}><Phone className="h-4 w-4" aria-hidden /> Call 112 (Emergency)</a>
          <a href="tel:1098" className={BTN.danger}><Phone className="h-4 w-4" aria-hidden /> Call 1098 (Child Helpline)</a>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={BTN.outline} onClick={() => { setI(1); setStage('q'); }}>Continue the screening</button>
          {exit}
        </div>
      </div>
    );

  if (stage === 'q') {
    const q = QS[i];
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        {head}
        <div>
          <div className="mb-1 flex justify-between text-sm text-muted">
            <span>Question {i + 1} of {QS.length}</span>
            <span>{Math.round((i / QS.length) * 100)}% done</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded bg-soft" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((i / QS.length) * 100)} aria-label="Progress">
            <div className="h-full bg-green transition-all" style={{ width: `${(i / QS.length) * 100}%` }} />
          </div>
        </div>
        <Card>
          <h2 className="text-lg font-semibold text-navy">{q.q}</h2>
          <div className="mt-3 grid gap-2">
            {q.opts.map((opt) => (
              <button key={opt.l} type="button" className={`${BTN.outline} justify-start ${opt.skip ? 'border-dashed text-muted' : ''}`} onClick={() => answer(opt)}>
                {opt.l}
              </button>
            ))}
          </div>
        </Card>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={BTN.outline} onClick={back}><ArrowLeft className="h-4 w-4" aria-hidden /> Back</button>
          {exit}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted"><Lock className="h-3.5 w-3.5" aria-hidden /> Private: nothing you choose is saved or sent.</p>
      </div>
    );
  }

  // ---- result ----
  const nu = score('nutrition'), em = score('emotional'), sf = score('safety'), su = score('support');
  const nLevel = nu.answered === 0 ? 'skip' : nu.sum >= 4 ? 'high' : nu.sum >= 2 ? 'some' : 'low';
  const eLevel = em.answered === 0 ? 'skip' : em.sum >= 3 ? 'high' : em.sum >= 1 ? 'some' : 'low';
  const sLevel = sf.answered === 0 ? 'skip' : sf.max2 ? 'high' : sf.sum >= 1 ? 'some' : 'low';
  const wantsTalk = su.sum >= 2;

  const NMSG = {
    high: 'Your answers suggest you may benefit from a check-up. Consider an assessment by a qualified health worker or at your nearest health centre. This is not a diagnosis.',
    some: 'A few answers suggest your food or energy levels may need attention. Iron-rich foods and regular meals can help. If tiredness continues, talk to a health worker.',
    low: 'Your answers do not point to a concern right now. Keep eating a variety of foods and regular meals.',
    skip: 'You chose not to answer these questions. You can still read the nutrition tips or visit a health worker any time.',
  }[nLevel];
  const EMSG = {
    high: 'You may be carrying a lot right now. Talking with a trained counsellor can help. Tele-MANAS (14416) is free and confidential.',
    some: 'Some stress or low mood is common and can ease with support. Try the breathing exercise, and talk to someone you trust.',
    low: 'Your answers do not point to a concern right now. Keep doing things that help you feel well.',
    skip: 'You chose not to answer. Confidential support is available whenever you want it.',
  }[eLevel];
  const SMSG = {
    high: 'Some answers suggest you may not feel safe or may be under pressure. You deserve to be safe. Please speak to a trusted adult, or call 1098 or 112 if you are in danger.',
    some: 'Some answers suggest you are unsure about feeling safe. You can ask a trusted person, a school counsellor or a helpline for guidance.',
    low: 'You said you feel safe. Remember that support is always available if things change.',
    skip: 'You chose not to answer. Verified support services are listed below if you ever need them.',
  }[sLevel];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {head}
      {disclaimer}
      {sLevel === 'high' && (
        <Notice kind="danger" title="Support for your safety">
          <p>If you are in danger, call <a className="font-bold underline" href="tel:112">112</a> or <a className="font-bold underline" href="tel:1098">1098</a>. You can also tell a trusted adult.</p>
        </Notice>
      )}
      <H2>Your guidance summary</H2>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="font-bold text-navy">Nutrition and anaemia</h3>
          <p className="mt-1 text-sm">{NMSG}</p>
          <div className="mt-3 flex flex-wrap gap-2"><A to="nutrition" className={BTN.outline}>Nutrition Centre</A><A to="services?category=phc" className={BTN.outline}>Find a health facility</A></div>
        </Card>
        <Card>
          <h3 className="font-bold text-navy">Emotional wellbeing</h3>
          <p className="mt-1 text-sm">{EMSG}</p>
          <div className="mt-3 flex flex-wrap gap-2"><A to="wellness" className={BTN.outline}>Mental Wellness</A><a href="tel:14416" className={BTN.outline}><Phone className="h-4 w-4" aria-hidden /> 14416</a></div>
        </Card>
        <Card>
          <h3 className="font-bold text-navy">Safety</h3>
          <p className="mt-1 text-sm">{SMSG}</p>
          <div className="mt-3 flex flex-wrap gap-2"><A to="rights" className={BTN.outline}>Know your rights</A><A to="emergency" className={BTN.outline}>Emergency help</A></div>
        </Card>
        <Card>
          <h3 className="font-bold text-navy">General wellbeing</h3>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
            <li>Eat regular meals with dal, vegetables and some fruit.</li>
            <li>Drink clean water, sleep well and stay active.</li>
            <li>Talk to someone you trust when worried.</li>
          </ul>
          <A to="services" className={`${BTN.outline} mt-3`}>Find services</A>
        </Card>
      </div>
      {wantsTalk && (
        <Notice kind="ok" title="You asked to speak privately with someone">
          <p>You can call Tele-MANAS <a className="font-bold underline" href="tel:14416">14416</a>, or <A to="services?category=counselling" className="font-bold underline">find counselling and child protection support</A>. An ASHA, ANM or school counsellor can also help.</p>
        </Notice>
      )}
      <div className="flex flex-wrap gap-3">
        <button type="button" className={BTN.outline} onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden /> Start again (clears answers)</button>
        {exit}
      </div>
    </div>
  );
}
