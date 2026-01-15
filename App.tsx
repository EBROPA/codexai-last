import React, { useState, useEffect } from 'react';
import { Preloader } from './components/Preloader';
import { HomePage } from './components/HomePage';
import { WorkPage } from './components/WorkPage';
import { ServicesPage } from './components/ServicesPage';
import { Contact } from './components/Contact';
import { Marquee } from './components/Marquee';
import { SEO } from './components/SEO';
import { Layout } from './components/Layout';
import { RouterProvider, usePathname, useRouter } from './lib/router';
import { Reviews } from './components/Reviews';
import { FAQ } from './components/FAQ';

// SEO Configuration
const getSeoData = (path: string) => {
  if (path === '/') return { title: "Digital Architects", description: "CODEXAI — авангардное цифровое агентство." };
  if (path === '/work') return { title: "Портфолио & Кейсы", description: "Избранные проекты CodexAI." };
  if (path.startsWith('/services')) return { title: "Наши Услуги", description: "Полный спектр цифровых решений." };
  if (path === '/contact') return { title: "Контакты", description: "Свяжитесь с CodexAI." };
  return { title: "Digital Architects", description: "CODEXAI" };
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

    // 404
    return <NotFound />;
  };

  const seo = getSeoData(pathname);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-neon-acid selection:text-black">
      <SEO title={seo.title} description={seo.description} />
      
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