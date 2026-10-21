import { useState } from 'react';
import { ArrowRight, Check, ClipboardCheck, HeartPulse, Lightbulb, Link2, ListChecks, MapPin, Smartphone, UserCheck } from 'lucide-react';
import { A, BTN, Card, H2, Notice, PageHead, SampleBadge, selectCls } from '../ui';

const STEPS = [
  [Smartphone, 'Girl accesses the portal', 'Opens SAKHI on a phone. No login, no personal details.'],
  [ClipboardCheck, 'Optional screening', 'Answers simple questions privately, or skips any of them.'],
  [Lightbulb, 'Receives guidance', 'Gets general, non-diagnostic guidance and resources.'],
  [MapPin, 'Chooses a relevant service', 'Picks a health centre, counsellor or protection service.'],
  [UserCheck, 'Connects with a health worker', 'With consent, an authorised health worker is notified.'],
  [Link2, 'Referral and follow-up', 'Handled through an approved, secure system.'],
] as const;
const REFS = ['Medical evaluation', 'Nutrition counselling', 'Mental health counselling', 'Child protection support'];
const STATUS = ['Request received (mock)', 'Consent recorded (mock)', 'Matched to a health worker (mock)', 'Appointment scheduled (mock)', 'Follow-up completed (mock)'];

export default function About() {
  const [ref, setRef] = useState(REFS[0]);
  const [step, setStep] = useState(-1);
  return (
    <div className="space-y-8">
      <PageHead title="About SAKHI" sub="Screening, Awareness, Knowledge, Health & Intervention. A NIRMAAN project prototype." />

      <section className="grid gap-4 md:grid-cols-2">
        <Card><H2>Problem statement</H2><p className="text-sm">Adolescent girls in aspirational districts face compounding burdens of anaemia, malnutrition, early marriage and mental health distress that are systematically invisible to the health system due to the absence of targeted screening and data infrastructure.</p></Card>
        <Card><H2>Target population</H2><p className="text-sm">Adolescent girls (10–19 years), especially in underserved and aspirational districts, along with the families, teachers and frontline health workers who support them.</p></Card>
        <Card>
          <H2>Project objectives</H2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Make private, preventive health screening easy to reach.</li>
            <li>Improve awareness of nutrition, mental wellbeing and rights.</li>
            <li>Connect girls to verified health and protection services.</li>
            <li>Give districts anonymised, aggregate visibility to plan better.</li>
          </ul>
        </Card>
        <Card>
          <H2>Proposed solution</H2>
          <p className="text-sm">A lightweight, mobile-first portal that combines a confidential screening flow, emergency help, a service directory, nutrition and mental wellness resources, and a district monitoring view, working alongside existing public health services such as health centres, ASHA and Anganwadi workers.</p>
        </Card>
      </section>

      <section>
        <H2>Proposed impact</H2>
        <p className="mb-3 text-sm text-muted">These are intended outcomes. None of them has been achieved yet by this prototype.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {['Earlier identification of health concerns', 'Improved awareness among girls and families', 'Better access to services', 'Stronger district-level visibility'].map((t) => (
            <Card key={t} className="flex gap-2"><HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-green" aria-hidden /><p className="text-sm font-semibold">{t}</p></Card>
          ))}
        </div>
        <p className="mt-3 text-sm">SAKHI <b>complements</b> existing public health services. It does not replace doctors, counsellors, helplines or government programmes.</p>
      </section>

      <section>
        <H2>Health worker and referral workflow</H2>
        <ol className="grid gap-3 md:grid-cols-3">
          {STEPS.map(([Icon, t, d], k) => (
            <li key={t} className="relative rounded border border-line bg-white p-3">
              <span className="absolute -top-2 left-3 rounded bg-navy px-2 text-xs font-bold text-white">{k + 1}</span>
              <Icon className="h-6 w-6 text-green" aria-hidden />
              <p className="mt-1 font-bold text-navy">{t}</p>
              <p className="text-sm text-muted">{d}</p>
              {k < STEPS.length - 1 && <ArrowRight className="absolute -right-3 top-1/2 hidden h-5 w-5 text-saffron md:block" aria-hidden />}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <Card>
          <div className="mb-2 flex flex-wrap items-center gap-2"><h3 className="flex items-center gap-2 font-bold text-navy"><ListChecks className="h-5 w-5" aria-hidden /> Try a mock referral</h3><SampleBadge>Mock data only</SampleBadge></div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm font-semibold">Referral category
              <select className={`${selectCls} mt-1 font-normal`} value={ref} onChange={(e) => { setRef(e.target.value); setStep(-1); }}>{REFS.map((r) => <option key={r}>{r}</option>)}</select>
            </label>
            <button type="button" className={BTN.green} disabled={step >= STATUS.length - 1} onClick={() => setStep(step + 1)}>{step < 0 ? 'Create mock referral' : 'Advance to next status'}</button>
            <button type="button" className={BTN.outline} onClick={() => setStep(-1)}>Reset</button>
          </div>
          <ol className="mt-3 space-y-1 text-sm" aria-live="polite">
            {STATUS.map((s, k) => (
              <li key={s} className={`flex items-center gap-2 ${k <= step ? 'font-semibold text-green-dark' : 'text-muted'}`}>
                <Check className={`h-4 w-4 ${k <= step ? '' : 'opacity-20'}`} aria-hidden /> {s}{k === 0 && step >= 0 ? ` · ${ref}` : ''}
              </li>
            ))}
          </ol>
        </Card>
        <div className="mt-3"><Notice kind="warn" title="Needed for a real deployment">
          <p>Real referrals, notifications, case management and follow-up require a secure backend, authorised staff, consent procedures and safeguarding protocols. This prototype demonstrates the flow with mock data only.</p>
        </Notice></div>
      </section>

      <div className="flex flex-wrap gap-3"><A to="screening" className={BTN.green}>Try the screening</A><A to="dashboard" className={BTN.outline}>See the demo dashboard</A></div>
    </div>
  );
}
