import { ArrowRight, Brain, Droplets, EyeOff, Lock, MapPin, ShieldAlert, ShieldCheck, UserX, Utensils } from 'lucide-react';
import { useT } from '../lib/app';
import { A, BTN, Card, H2, Notice } from '../ui';

export default function Home() {
  const t = useT();
  const quick = [
    ['nutrition', Droplets, 'card.nutrition', 'Signs, iron-rich foods and a balanced-plate guide.'],
    ['wellness', Brain, 'card.mental', 'Mood check-in, breathing exercises and free counselling.'],
    ['rights', ShieldCheck, 'card.safety', 'Know your rights and where to seek protection.'],
    ['services', MapPin, 'card.services', 'Filter health centres, clinics and support services.'],
  ] as const;
  const why = [
    [Droplets, 'Anaemia and nutritional deficiencies can go undetected.'],
    [Lock, 'Girls may lack access to private, safe health guidance.'],
    [Brain, 'Mental health concerns can remain unreported.'],
    [ShieldAlert, 'Vulnerable girls may not know where to seek protection or support.'],
  ] as const;

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded border border-line bg-soft p-5 md:grid-cols-5 md:p-8">
        <div className="md:col-span-3">
          <p className="mb-2 inline-block border-l-4 border-saffron pl-2 text-sm font-semibold text-green-dark">{t('tagline')}</p>
          <h1 className="text-3xl font-bold leading-tight text-navy sm:text-4xl">{t('hero.title')}</h1>
          <p className="mt-3 max-w-2xl text-base text-muted">{t('hero.sub')}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <A to="screening" className={BTN.green}>{t('cta.check')} <ArrowRight className="h-4 w-4" aria-hidden /></A>
            <A to="services" className={BTN.outline}>{t('cta.find')}</A>
          </div>
        </div>
        <Card className="md:col-span-2">
          <h2 className="mb-2 flex items-center gap-2 font-bold text-navy"><Lock className="h-5 w-5" aria-hidden /> Your privacy</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2"><EyeOff className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden />No name, phone number or address is asked.</li>
            <li className="flex gap-2"><UserX className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden />Screening answers are never saved or sent anywhere. They stay in your browser.</li>
            <li className="flex gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden />Use “Quick Exit” at the top to leave the site at once.</li>
          </ul>
        </Card>
      </section>

      <section aria-label="Quick access" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quick.map(([to, Icon, key, desc]) => (
          <A key={to} to={to} className="group block rounded border border-line bg-white p-4 hover:border-navy hover:shadow-sm">
            <Icon className="h-8 w-8 text-green" aria-hidden />
            <h2 className="mt-2 text-lg font-bold text-navy">{t(key)}</h2>
            <p className="mt-1 text-sm text-muted">{desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:underline">Open <ArrowRight className="h-4 w-4" aria-hidden /></span>
          </A>
        ))}
      </section>

      <p className="rounded bg-green px-4 py-3 text-center text-lg font-semibold text-white">{t('strip')}</p>

      <section>
        <h2 className="mb-3 border-l-4 border-green pl-3 text-xl font-bold text-navy">{t('why')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {why.map(([Icon, text]) => (
            <Card key={text} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-saffron" aria-hidden />
              <p>{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <H2>How SAKHI works</H2>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>Take the optional, private screening on your phone.</li>
            <li>Get simple guidance. It is never a diagnosis.</li>
            <li>Find a nearby health centre, counsellor or protection service.</li>
            <li>In a real deployment, an authorised health worker would follow up with your consent.</li>
          </ol>
          <A to="about" className={`${BTN.outline} mt-3`}>Read about the initiative</A>
        </Card>
        <div className="space-y-3">
          <Notice kind="warn" title="Prototype notice">
            <p>Any numbers shown in the dashboard and any service records in the directory are sample demonstration data, not official statistics or real facilities.</p>
          </Notice>
          <Notice kind="danger" title="In danger right now?">
            <p>Call <a className="font-bold underline" href="tel:112">112</a> (emergency) or <a className="font-bold underline" href="tel:1098">1098</a> (Child Helpline), or tell a trusted adult near you.</p>
          </Notice>
        </div>
      </section>
      <p className="flex items-center gap-2 text-xs text-muted"><Utensils className="h-4 w-4" aria-hidden /> Health information here is general guidance and does not replace a doctor.</p>
    </div>
  );
}
