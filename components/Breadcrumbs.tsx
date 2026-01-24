import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useRouter } from '../lib/router';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const router = useRouter();

  // Generate schema for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `https://codexai.pro${item.url}`
    }))
  };

  return (
    <>
      {/* Structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Visual breadcrumbs */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center gap-2 text-xs font-mono uppercase tracking-widest ${className}`}
      >
        <button 
          onClick={() => router.push('/')}
          className="text-zinc-500 hover:text-neon-acid transition-colors flex items-center gap-1"
          aria-label="Home"
        >
          <Home size={12} />
        </button>
        
        {items.map((item, index) => (
          <React.Fragment key={item.url}>
            <ChevronRight size={12} className="text-zinc-600" />
            {index === items.length - 1 ? (
              <span className="text-white" aria-current="page">
                {item.name}
              </span>
            ) : (
              <button
                onClick={() => router.push(item.url)}
                className="text-zinc-500 hover:text-neon-acid transition-colors"
              >
                {item.name}
              </button>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

// Helper function to generate breadcrumb items for common routes
export const getBreadcrumbs = (path: string, lang: 'ru' | 'en' = 'ru'): BreadcrumbItem[] => {
  const labels = {
    ru: {
      home: 'Главная',
      about: 'О компании',
      work: 'Портфолио',
      services: 'Услуги',
      contact: 'Контакты',
      web: 'Веб-разработка',
      bots: 'Telegram-боты',
      ai: 'AI и нейросети',
      complex: 'Сложные интеграции',
      tma: 'Telegram Mini Apps',
      reputation: 'Репутация',
      custom: 'Уникальный продукт',
      direct: 'Яндекс.Директ',
      tgads: 'TG-ads'
    },
    en: {
      home: 'Home',
      about: 'About',
      work: 'Portfolio',
      services: 'Services',
      contact: 'Contact',
      web: 'Web Development',
      bots: 'Telegram Bots',
      ai: 'AI & Neural Nets',
      complex: 'Complex Integrations',
      tma: 'Telegram Mini Apps',
      reputation: 'Reputation',
      custom: 'Custom Product',
      direct: 'Yandex.Direct',
      tgads: 'TG-ads'
    }
  };

  const l = labels[lang];
  const items: BreadcrumbItem[] = [{ name: l.home, url: '/' }];

  if (path === '/about') {
    items.push({ name: l.about, url: '/about' });
  } else if (path === '/work') {
    items.push({ name: l.work, url: '/work' });
  } else if (path === '/contact') {
    items.push({ name: l.contact, url: '/contact' });
  } else if (path.startsWith('/services')) {
    items.push({ name: l.services, url: '/services' });
    
    const serviceSlug = path.replace('/services/', '').replace('/services', '');
    if (serviceSlug && serviceSlug !== '') {
      const serviceLabels: Record<string, string> = {
        web: l.web,
        bots: l.bots,
        ai: l.ai,
        complex: l.complex,
        tma: l.tma,
        reputation: l.reputation,
        custom: l.custom,
        direct: l.direct,
        tgads: l.tgads
      };
      
      if (serviceLabels[serviceSlug]) {
        items.push({ name: serviceLabels[serviceSlug], url: path });
      }
    }
  }

  return items;
};

export default Breadcrumbs;
