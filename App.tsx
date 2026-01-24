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
import { BlogPage } from './components/BlogPage';
import { ArticlePage } from './components/ArticlePage';
import { AdminBlog } from './components/AdminBlog';

// SEO Configuration with unique meta for each service page
const servicesSeoRu: Record<string, { title: string; description: string }> = {
  '/services/web': {
    title: "Разработка сайтов под ключ от 100 000 руб - за 7-30 дней",
    description: "Создаем продающие сайты с гарантией 12 месяцев. Лендинги от 100 000 руб, корпоративные сайты от 250 000 руб, интернет-магазины от 500 000 руб. Фиксированные сроки в договоре."
  },
  '/services/bots': {
    title: "Telegram-боты для бизнеса от 50 000 руб - автоматизация продаж",
    description: "Разрабатываем Telegram-ботов для лидогенерации, поддержки клиентов и автоматизации процессов. Интеграция с CRM, оплатой и AI. Срок 3-14 дней."
  },
  '/services/ai': {
    title: "Интеграция ChatGPT и AI в бизнес - от 100 000 руб",
    description: "Внедряем искусственный интеллект: чат-боты с GPT-4, автоматизация контента, AI-аналитика и RAG-системы. Кастомные решения под ваши бизнес-задачи."
  },
  '/services/tma': {
    title: "Telegram Mini Apps разработка от 120 000 руб",
    description: "Создаем Mini Apps для Telegram: магазины, сервисы, игры, Web3. Полная интеграция с Telegram Payments, TON и Apple/Google Pay. Срок 2-4 недели."
  },
  '/services/complex': {
    title: "Сложные веб-сервисы и интеграции - LMS, SaaS, PWA",
    description: "Разработка личных кабинетов, LMS-платформ, SaaS-решений и PWA-приложений. Высоконагруженные системы с микросервисной архитектурой."
  },
  '/services/reputation': {
    title: "Управление репутацией в сети (SERM) - AI-мониторинг",
    description: "Вытеснение негатива из поисковой выдачи, работа с отзывами, мониторинг упоминаний бренда 24/7. Используем AI для анализа тональности."
  },
  '/services/custom': {
    title: "Разработка уникальных IT-продуктов - MVP, WebGL, AR/VR",
    description: "Нестандартные решения: MVP стартапов, интерактивные WebGL-сайты, генеративная графика, AR/VR проекты. Быстрая проверка гипотез."
  },
  '/services/direct': {
    title: "Настройка Яндекс.Директ - контекстная реклама с ROI",
    description: "Настройка и ведение контекстной рекламы в Яндекс.Директ. Сквозная аналитика, call-tracking, еженедельные отчеты. Приводим целевых лидов, а не клики."
  },
  '/services/tgads': {
    title: "Реклама в Telegram - TG Ads и посевы в каналах",
    description: "Официальная реклама Telegram Ads и нативные посевы в каналах. Таргетинг по интересам, подбор качественных площадок, прохождение модерации."
  }
};

const servicesSeoEn: Record<string, { title: string; description: string }> = {
  '/services/web': {
    title: "Website Development from $1,500 - 7-30 days delivery",
    description: "We create selling websites with 12-month warranty. Landing pages, corporate sites, e-commerce. Fixed deadlines in contract."
  },
  '/services/bots': {
    title: "Telegram Bots for Business from $500 - Sales Automation",
    description: "We develop Telegram bots for lead generation, customer support and process automation. CRM, payment and AI integration."
  },
  '/services/ai': {
    title: "ChatGPT and AI Integration for Business",
    description: "We implement artificial intelligence: GPT-4 chatbots, content automation, AI analytics and RAG systems. Custom solutions for your needs."
  },
  '/services/tma': {
    title: "Telegram Mini Apps Development from $2,000",
    description: "We create Mini Apps for Telegram: stores, services, games, Web3. Full integration with Telegram Payments, TON and Apple/Google Pay."
  },
  '/services/complex': {
    title: "Complex Web Services - LMS, SaaS, PWA Development",
    description: "Development of user dashboards, LMS platforms, SaaS solutions and PWA apps. High-load systems with microservice architecture."
  },
  '/services/reputation': {
    title: "Online Reputation Management (SERM) - AI Monitoring",
    description: "Negative content removal from search results, review management, 24/7 brand mention monitoring. AI-powered sentiment analysis."
  },
  '/services/custom': {
    title: "Custom IT Product Development - MVP, WebGL, AR/VR",
    description: "Non-standard solutions: startup MVPs, interactive WebGL sites, generative graphics, AR/VR projects. Fast hypothesis testing."
  },
  '/services/direct': {
    title: "Yandex.Direct Setup - PPC Advertising with ROI",
    description: "Setup and management of Yandex.Direct advertising. End-to-end analytics, call tracking, weekly reports. We bring targeted leads, not clicks."
  },
  '/services/tgads': {
    title: "Telegram Advertising - TG Ads and Channel Seeding",
    description: "Official Telegram Ads and native placements in channels. Interest targeting, quality platform selection, moderation compliance."
  }
};

const getSeoData = (path: string, lang: 'ru' | 'en') => {
  const isRu = lang === 'ru';
  const servicesSeo = isRu ? servicesSeoRu : servicesSeoEn;

  // Check for specific service pages first
  if (servicesSeo[path]) {
    return servicesSeo[path];
  }

  if (path === '/') return {
    title: isRu ? "Разработка сайтов, Telegram-боты и AI | Веб-студия CODEXAI" : "Website Development, Telegram Bots & AI | CODEXAI",
    description: isRu
      ? "Веб-студия CODEXAI: разработка сайтов под ключ от 100 000 руб, Telegram-боты от 50 000 руб, Mini Apps и AI-интеграции. Гарантия 12 месяцев, фиксированные сроки в договоре."
      : "CODEXAI Agency: website development, Telegram bots, Mini Apps, and AI integrations. 12-month warranty, fixed timelines in contract."
  };
  if (path === '/about') return {
    title: isRu ? "О компании CODEXAI - гарантии, экспертиза, команда" : "About CODEXAI - Guarantees, Expertise, Team",
    description: isRu
      ? "Веб-студия CODEXAI: работаем по договору, соблюдаем сроки, даем гарантию на код 12 месяцев. Senior-команда, 50+ реализованных проектов, прозрачные процессы."
      : "CODEXAI Agency: contract-based work, on-time delivery, 12-month code warranty. Senior team, 50+ delivered projects, transparent process."
  };
  if (path === '/work') return {
    title: isRu ? "Портфолио и кейсы CODEXAI - реальные результаты клиентов" : "CODEXAI Portfolio - Client Results & Cases",
    description: isRu
      ? "Портфолио веб-студии CODEXAI: реальные проекты с ростом заявок до +340%. Сайты, Telegram-боты и сервисы под бизнес-цели."
      : "CODEXAI portfolio: real projects with lead growth up to +340%. Websites, Telegram bots, and services built for business goals."
  };
  if (path === '/services' || path.startsWith('/services')) return {
    title: isRu ? "Услуги веб-студии CODEXAI - сайты, боты, AI" : "CODEXAI Services - Websites, Bots, AI",
    description: isRu
      ? "Услуги CODEXAI: разработка сайтов от 100 000 руб, Telegram-боты от 50 000 руб, Mini Apps от 120 000 руб, AI-интеграции от 100 000 руб. Подберем решение под вашу задачу."
      : "CODEXAI services: websites, Telegram bots, Mini Apps, AI solutions. We pick the right format and launch fast."
  };
  if (path === '/contact') return {
    title: isRu ? "Контакты CODEXAI - расчет стоимости за 24 часа" : "Contact CODEXAI - Quote in 24 Hours",
    description: isRu
      ? "Оставьте заявку и получите расчет стоимости и сроков разработки за 24 часа. Telegram @codexai_pro, email: contact@codexai.pro"
      : "Request a quote with clear scope and timeline within 24 hours. Telegram @codexai_pro, email: contact@codexai.pro"
  };
  if (path === '/blog') return {
    title: isRu ? "Блог о веб-разработке, AI и Telegram | CODEXAI" : "Blog about Web Development, AI & Telegram | CODEXAI",
    description: isRu
      ? "Экспертные статьи о разработке сайтов, Telegram-ботов, Mini Apps и AI-интеграциях. Кейсы, туториалы и аналитика рынка от команды CODEXAI."
      : "Expert articles about website development, Telegram bots, Mini Apps and AI integrations. Case studies, tutorials and market analytics from CODEXAI team."
  };
  if (path.startsWith('/blog/')) return {
    title: isRu ? "Статья | Блог CODEXAI" : "Article | CODEXAI Blog",
    description: isRu ? "Читайте экспертные статьи в блоге CODEXAI" : "Read expert articles in CODEXAI blog"
  };
  if (path === '/admin/blog') return { title: "Админка блога | CODEXAI", description: "Управление статьями блога", noIndex: true };
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

    // Blog
    if (path === '/blog') {
      return (
        <>
          <BlogPage />
          <Contact />
        </>
      );
    }

    // Single Article
    if (path.startsWith('/blog/') && path !== '/blog/') {
      return <ArticlePage />;
    }

    // Admin Blog
    if (path === '/admin/blog') {
      return <AdminBlog />;
    }

    // Legal Pages
    if (path === '/user-agreement') return <LegalPage type="userAgreement" />;
    if (path === '/data-processing') return <LegalPage type="privacyPolicy" />;
    if (path === '/consent') return <LegalPage type="consent" />;

    // 404
    return <NotFound />;
  };

  const seo = getSeoData(pathname, lang);
  const noIndex = 'noIndex' in seo ? seo.noIndex : undefined;

  return (
    <div className="bg-black text-white min-h-screen selection:bg-neon-acid selection:text-black">
      <SEO title={seo.title} description={seo.description} path={pathname} noIndex={noIndex} lang={lang} />

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
