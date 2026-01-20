import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { HomePage } from './components/HomePage';
import { WorkPage } from './components/WorkPage';
import { ServicesPage } from './components/ServicesPage';
import { Contact } from './components/Contact';
import { Marquee } from './components/Marquee';
import { LegalPage } from './components/LegalPage';
import { AboutPage } from './components/AboutPage';
import { SEO } from './components/SEO';
import { Layout } from './components/Layout';
import { RouterProvider, usePathname, useRouter } from './lib/router';
import { useLanguage } from './lib/i18n';
import { Reviews } from './components/Reviews';
import { FAQ } from './components/FAQ';

// SEO Configuration
const getSeoData = (path: string, lang: 'ru' | 'en') => {
  const isRu = lang === 'ru';
  if (path === '/') return { 
    title: isRu ? "Разработка сайтов, Telegram‑боты и AI" : "Website Development, Telegram Bots & AI", 
    description: isRu 
      ? "Разработка сайтов под ключ, Telegram‑боты, Mini Apps и AI‑интеграции. Быстрый запуск, фиксированные сроки и рост лидов." 
      : "Website development, Telegram bots, Mini Apps, and AI integrations. Fast launch, fixed timelines, and lead growth." 
  };
  if (path === '/about') return { 
    title: isRu ? "О компании — гарантии и экспертиза" : "About — Guarantees and Expertise", 
    description: isRu 
      ? "Работаем по договору, соблюдаем сроки, даем гарантию на код 12 месяцев. Senior‑команда и прозрачные процессы." 
      : "Contract-based work, on-time delivery, 12‑month code warranty. Senior team and transparent process." 
  };
  if (path === '/work') return { 
    title: isRu ? "Кейсы и результаты клиентов" : "Client Results & Cases", 
    description: isRu 
      ? "Реальные проекты с ростом заявок и продаж. Сайты, боты и сервисы под бизнес‑цели." 
      : "Real projects with lead and sales growth. Websites, bots, and services built for business goals." 
  };
  if (path.startsWith('/services')) return { 
    title: isRu ? "Услуги для роста заявок" : "Services for Lead Growth", 
    description: isRu 
      ? "Разработка сайтов, Telegram‑ботов, Mini Apps и AI‑решений. Подберем формат и запустим быстро." 
      : "Websites, Telegram bots, Mini Apps, and AI solutions. We pick the right format and launch fast." 
  };
  if (path === '/contact') return { 
    title: isRu ? "Контакты и расчет стоимости" : "Contact & Cost Estimate", 
    description: isRu 
      ? "Оставьте заявку и получите расчет стоимости и сроков. Ответим быстро и по делу." 
      : "Request a quote with clear scope and timeline. Fast response and clear next steps." 
  };
  if (path === '/user-agreement') return { title: isRu ? "Пользовательское соглашение" : "User Agreement", description: isRu ? "Пользовательское соглашение CODEXAI." : "CODEXAI user agreement.", noIndex: true };
  if (path === '/data-processing') return { title: isRu ? "Политика обработки данных" : "Data Processing Policy", description: isRu ? "Политика обработки персональных данных и файлов Cookie." : "Personal data and cookie processing policy.", noIndex: true };
  if (path === '/consent') return { title: isRu ? "Согласие на обработку данных" : "Data Processing Consent", description: isRu ? "Согласие на обработку персональных данных." : "Personal data processing consent.", noIndex: true };
  return { title: "404", description: isRu ? "Страница не найдена." : "Page not found.", noIndex: true };
};

const NotFound: React.FC = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black">
       <h1 className="text-9xl font-serif font-bold text-neon-acid mb-4">404</h1>
       <p className="text-zinc-500 font-mono uppercase tracking-widest mb-8">Страница не найдена</p>
       <button 
         onClick={() => router.push('/')}
         className="px-8 py-4 bg-white text-black font-bold font-mono text-xs uppercase tracking-widest hover:bg-neon-acid transition-colors"
       >
         Вернуться на главную
       </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedPath, setDisplayedPath] = useState(pathname);

  // Handle route transitions
  useEffect(() => {
    if (pathname !== displayedPath) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayedPath(pathname);
        setIsTransitioning(false);
        window.scrollTo(0, 0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname, displayedPath]);

  // Route Matching Logic
  const renderContent = () => {
    const path = displayedPath;

    // Default Home
    if (path === '/' || path === '') {
      return <HomePage />;
    }
    
    // Work
    if (path === '/work') {
      return (
        <>
          <WorkPage />
          <Marquee text="CREATE IMPACT" outline />
          <Contact />
        </>
      );
    }

    // Services (Dynamic)
    if (path.startsWith('/services')) {
      return (
        <>
          <ServicesPage />
          <Reviews />
          <FAQ />
          <Contact />
        </>
      );
    }

    // Contact
    if (path === '/contact') {
      return (
        <div className="pt-20">
          <Contact />
        </div>
      );
    }

    if (path === '/about') {
      return <AboutPage />;
    }

    // Legal Pages
    if (path === '/user-agreement') return <LegalPage type="userAgreement" />;
    if (path === '/data-processing') return <LegalPage type="privacyPolicy" />;
    if (path === '/consent') return <LegalPage type="consent" />;

    // 404
    return <NotFound />;
  };

  const seo = getSeoData(pathname, lang);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-neon-acid selection:text-black">
      <SEO title={seo.title} description={seo.description} path={pathname} noIndex={seo.noIndex} lang={lang} />
      
      <Layout>
        {/* Page Transition Overlay */}
        <div 
          className={`fixed inset-0 bg-black z-[60] pointer-events-none transition-transform duration-500 ease-in-out origin-bottom ${isTransitioning ? 'scale-y-100' : 'scale-y-0'}`}
        />

        {/* Main Content */}
        <main 
          className={`relative z-10 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          {renderContent()}
        </main>
      </Layout>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <RouterProvider>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      {!loading && <AppContent />}
    </RouterProvider>
  );
}

export default App;
