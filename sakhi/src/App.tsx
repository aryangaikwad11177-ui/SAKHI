import { useEffect, useState, type ComponentType } from 'react';
import { AppCtx, useRoute, type Settings } from './lib/app';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Screening from './pages/Screening';
import Nutrition from './pages/Nutrition';
import Services from './pages/Services';
import Wellness from './pages/Wellness';
import Rights from './pages/Rights';
import Emergency from './pages/Emergency';
import Dashboard from './pages/Dashboard';
import About from './pages/About';

export interface PageProps { params: URLSearchParams }

const pages: Record<string, { title: string; C: ComponentType<PageProps> }> = {
  '': { title: 'Home', C: Home },
  screening: { title: 'Confidential Health Screening', C: Screening },
  nutrition: { title: 'Anaemia & Nutrition Centre', C: Nutrition },
  services: { title: 'Find Services', C: Services },
  wellness: { title: 'Mental Wellness', C: Wellness },
  rights: { title: 'Know Your Rights', C: Rights },
  emergency: { title: 'Emergency Help Centre', C: Emergency },
  dashboard: { title: 'District Monitoring Dashboard (Demo)', C: Dashboard },
  about: { title: 'About SAKHI', C: About },
};

export default function App() {
  const [s, setS] = useState<Settings>({ lang: 'en', size: 0, contrast: false });
  const set = (p: Partial<Settings>) => setS((x) => ({ ...x, ...p }));
  const { page, params, key } = useRoute();
  const route = pages[page] ?? pages[''];

  useEffect(() => {
    const el = document.documentElement;
    el.style.fontSize = ['16px', '18px', '20px'][s.size];
    el.classList.toggle('hc', s.contrast);
    el.lang = s.lang;
  }, [s]);
  useEffect(() => {
    document.title = `${route.title} | SAKHI – NIRMAAN Prototype`;
  }, [route]);

  const C = route.C;
  return (
    <AppCtx.Provider value={{ s, set }}>
      <Header page={pages[page] ? page : ''} />
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 py-6 outline-none sm:py-8">
        <C key={key} params={params} />
      </main>
      <Footer />
    </AppCtx.Provider>
  );
}
