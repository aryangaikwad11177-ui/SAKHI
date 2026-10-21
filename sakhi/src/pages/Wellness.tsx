import { useEffect, useState } from 'react';
import { BatteryLow, CloudRain, Frown, LogOut, Meh, Smile, type LucideIcon } from 'lucide-react';
import { HELPLINES } from '../lib/helplines';
import { quickExit } from '../lib/app';
import HelplineCard from '../components/HelplineCard';
import { BTN, Card, H2, Notice, PageHead } from '../ui';

const MOODS: { id: string; label: string; Icon: LucideIcon; msg: string; talk?: boolean }[] = [
  { id: 'good', label: 'Good', Icon: Smile, msg: 'Lovely. Notice what is helping you feel this way and keep doing it.' },
  { id: 'okay', label: 'Okay', Icon: Meh, msg: 'Okay is fine. A short walk, some water or a chat with a friend can lift the day.' },
  { id: 'tired', label: 'Tired', Icon: BatteryLow, msg: 'Rest matters. Try regular meals, enough sleep and a few slow breaths below. If tiredness lasts, tell a health worker.' },
  { id: 'anxious', label: 'Worried', Icon: CloudRain, msg: 'Worry is common, especially with studies and family pressure. Try the breathing exercise below, and share it with someone you trust.', talk: true },
  { id: 'sad', label: 'Low', Icon: Frown, msg: 'I am sorry you feel low. You do not have to carry this alone. Please consider talking to someone, and free, confidential help is below.', talk: true },
];

const PHASES = [{ n: 'Breathe in', s: 4 }, { n: 'Hold', s: 4 }, { n: 'Breathe out', s: 6 }];

function Breathing() {
  const [on, setOn] = useState(false);
  const [p, setP] = useState(0);
  const [left, setLeft] = useState(PHASES[0].s);
  const [rounds, setRounds] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1;
        setP((cur) => {
          const nxt = (cur + 1) % PHASES.length;
          if (nxt === 0) setRounds((r) => r + 1);
          setLeft(PHASES[nxt].s);
          return nxt;
        });
        return l;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [on]);
  const scale = !on ? 0.6 : p === 2 ? 0.6 : 1;
  return (
    <Card className="text-center">
      <h3 className="font-bold text-navy">Slow breathing (4 – 4 – 6)</h3>
      <div className="mx-auto my-4 flex h-40 w-40 items-center justify-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-green/15 ring-4 ring-green/40" style={{ transform: `scale(${scale})`, transition: `transform ${on ? PHASES[p].s : 0.3}s linear` }}>
          <span className="text-lg font-bold text-green-dark" aria-live="polite">{on ? `${PHASES[p].n} · ${left}` : 'Ready'}</span>
        </div>
      </div>
      <p className="text-sm text-muted">{on ? `Rounds completed: ${rounds}` : 'Sit comfortably. Breathe in through the nose, hold, then out slowly through the mouth.'}</p>
      <button type="button" className={`${BTN.green} mt-3`} onClick={() => { setOn(!on); setP(0); setLeft(PHASES[0].s); }}>{on ? 'Stop' : 'Start'}</button>
    </Card>
  );
}

const TIPS: [string, string][] = [
  ['Academic pressure', 'Break work into small parts. Take short breaks. Marks do not define you. Talk to a teacher or counsellor if the load feels too much.'],
  ['Anxiety', 'Name the worry, then ask: what can I do today? Slow breathing and a short walk help. Share the worry with someone you trust.'],
  ['Loneliness', 'Reach out to one person today, even with a simple message. Join a group activity at school or the community.'],
  ['Social pressure', 'You can say no to things that feel wrong. Your feelings are valid. A trusted adult or counsellor can help you plan what to say.'],
];

export default function Wellness() {
  const [mood, setMood] = useState<string | null>(null);
  const [crisis, setCrisis] = useState(false);
  const m = MOODS.find((x) => x.id === mood);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1"><PageHead title="Your Feelings Matter" sub="A calm, judgement-free space. Nothing you choose here is saved." /></div>
        <button type="button" className={BTN.outline} onClick={quickExit}><LogOut className="h-4 w-4" aria-hidden /> Quick Exit</button>
      </div>

      <section>
        <H2>How are you feeling today?</H2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5" role="group" aria-label="Mood check-in">
          {MOODS.map(({ id, label, Icon }) => (
            <button key={id} type="button" aria-pressed={mood === id} onClick={() => setMood(id)}
              className={`flex flex-col items-center gap-1 rounded border-2 p-3 ${mood === id ? 'border-green bg-emerald-50' : 'border-line bg-white hover:border-navy'}`}>
              <Icon className="h-9 w-9 text-navy" aria-hidden /><span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
        {m && (
          <div className="mt-3" aria-live="polite">
            <Notice kind={m.talk ? 'warn' : 'ok'}><p>{m.msg}</p>{m.talk && <p><a className="font-bold underline" href="#talk">See who you can talk to</a></p>}</Notice>
          </div>
        )}
      </section>

      <section>
        <H2>Calm yourself</H2>
        <div className="grid gap-4 md:grid-cols-2">
          <Breathing />
          <Card>
            <h3 className="font-bold text-navy">5-4-3-2-1 grounding</h3>
            <p className="mt-1 text-sm text-muted">When thoughts race, bring your attention to the present:</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
              <li>Name <b>5</b> things you can see</li>
              <li>Name <b>4</b> things you can touch</li>
              <li>Name <b>3</b> things you can hear</li>
              <li>Name <b>2</b> things you can smell</li>
              <li>Name <b>1</b> thing you can taste, or one slow breath</li>
            </ol>
          </Card>
        </div>
      </section>

      <section>
        <H2>Tips for everyday pressure</H2>
        <div className="space-y-2">
          {TIPS.map(([t, d]) => (
            <details key={t} className="rounded border border-line bg-white p-3">
              <summary className="cursor-pointer font-semibold text-navy">{t}</summary>
              <p className="mt-2 text-sm">{d}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="talk">
        <H2>Talk to Someone</H2>
        <p className="mb-3 text-sm text-muted">You can also speak to a school counsellor, an ASHA or ANM didi, a doctor, or an adult you trust.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <HelplineCard h={HELPLINES[3]} />
          <HelplineCard h={HELPLINES[1]} />
        </div>
        <button type="button" className={`${BTN.danger} mt-4`} onClick={() => setCrisis(true)}>I am thinking of harming myself or ending my life</button>
        {crisis && (
          <div className="mt-3 space-y-3" role="alert">
            <Notice kind="danger" title="You matter, and help is available right now">
              <p>Please call <a className="font-bold underline" href="tel:112">112</a> now, or Tele-MANAS <a className="font-bold underline" href="tel:14416">14416</a> (free, confidential). If you can, go to an adult you trust and stay with them. Move away from anything you could use to hurt yourself.</p>
            </Notice>
            <div className="flex flex-wrap gap-3">
              <a href="tel:112" className={BTN.danger}>Call 112</a>
              <a href="tel:14416" className={BTN.primary}>Call 14416</a>
            </div>
          </div>
        )}
      </section>

      <Notice kind="info"><p>SAKHI is not a substitute for professional care. If feelings stay heavy for more than two weeks, please speak to a doctor or counsellor.</p></Notice>
    </div>
  );
}
