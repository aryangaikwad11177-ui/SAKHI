import { useState } from 'react';
import { Scale, Users } from 'lucide-react';
import { A, BTN, Card, H2, Notice, PageHead } from '../ui';

export default function Rights() {
  const [trusted, setTrusted] = useState(false);
  return (
    <div className="space-y-8">
      <PageHead title="Know Your Rights" sub="Clear, calm information for girls and families. Nobody is blamed for asking for help." />

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-navy"><Scale className="h-5 w-5" aria-hidden /> Legal age of marriage in India</h2>
          <p className="text-sm">Under the Prohibition of Child Marriage Act, 2006, the minimum age of marriage is <b>18 years for girls</b> and <b>21 years for boys</b>. Marrying below this age is a child marriage.</p>
          <p className="mt-2 text-xs text-muted">Laws and procedures can change. Please verify against current official guidance, for example with Childline 1098 or the district Child Welfare Committee.</p>
        </Card>
        <Card>
          <h2 className="mb-2 text-lg font-bold text-navy">Recognising unsafe pressure</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Being told to marry before you are 18, or when you do not want to</li>
            <li>Being stopped from going to school against your wish</li>
            <li>Threats, shouting or force to make you agree</li>
            <li>Being made to feel guilty or afraid of saying no</li>
            <li>Anyone touching you or asking for secrets that make you uncomfortable</li>
          </ul>
        </Card>
      </section>

      <section>
        <H2>Who can help</H2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card><h3 className="font-bold text-navy">People near you</h3><p className="mt-1 text-sm">A trusted adult, a teacher, a school counsellor, an ASHA or ANM didi, or an Anganwadi worker.</p></Card>
          <Card><h3 className="font-bold text-navy">Child protection</h3><p className="mt-1 text-sm">Childline <a className="font-bold underline" href="tel:1098">1098</a> can connect you to the district Child Welfare Committee (CWC) and protection officers.</p></Card>
          <Card><h3 className="font-bold text-navy">In danger or being forced</h3><p className="mt-1 text-sm">Call <a className="font-bold underline" href="tel:112">112</a> (police and emergency) or <a className="font-bold underline" href="tel:1098">1098</a>. You can also contact a One Stop Centre.</p></Card>
        </div>
      </section>

      <Notice kind="warn" title="About confidentiality">
        <p>Helplines and counsellors try to keep what you share private. But if a child is at risk of serious harm, the law can require them to inform the authorities so that you can be protected. You can ask “What will you do with what I tell you?” before you share.</p>
        <p>SAKHI never shares your screening answers with anyone. Nothing is saved.</p>
      </Notice>

      <section>
        <div className="flex flex-wrap gap-3">
          <A to="emergency" className={BTN.danger}>I Need Help</A>
          <button type="button" className={BTN.green} aria-expanded={trusted} onClick={() => setTrusted(!trusted)}><Users className="h-4 w-4" aria-hidden /> Talk to a Trusted Person</button>
          <A to="services?category=counselling" className={BTN.outline}>Find Child Protection Support</A>
        </div>
        {trusted && (
          <Card className="mt-4">
            <h3 className="font-bold text-navy">How to start the conversation</h3>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
              <li>Pick someone who listens without judging: a parent or aunt, an older sibling, a teacher, a counsellor or ASHA didi.</li>
              <li>Choose a private moment. You can say: <i>“I need to talk about something that is worrying me. Can we talk privately?”</i></li>
              <li>Say what is happening in your own words. You do not have to say everything at once.</li>
              <li>If the first person does not help, try another. You can always call <a className="font-bold underline" href="tel:1098">1098</a>.</li>
            </ol>
          </Card>
        )}
      </section>
    </div>
  );
}
