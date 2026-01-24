import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  lang?: 'ru' | 'en';
  faqs?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; url: string }[];
}

const BASE_URL = 'https://codexai.pro';
const BRAND = 'CODEXAI';
const DEFAULT_IMAGE = `${BASE_URL}/img/codexai-logo.png`;
const BRAND_VARIANTS = [
  'CodexAI',
  'Codexai',
  'Codex AI',
  'веб-студия CodexAI',
  'веб-студия Codexai',
  'CodexAI веб-студия',
  'Codexai веб-студия',
  'Кодексай',
  'Кодекс АИ',
  'веб-студия Кодексай',
  'Кодексай веб-студия',
  'digital agency CodexAI',
  'CodexAI агентство',
  'Codexai агентство'
];
const SERVICE_KEYWORDS = [
  'веб-студия',
  'разработка сайтов',
  'создание сайтов',
  'digital-агентство',
  'сайт под ключ',
  'заказать сайт',
  'создание лендинга',
  'лендинг под ключ',
  'корпоративный сайт',
  'создание интернет-магазина',
  'разработка сайта цена',
  'веб студия спб',
  'разработка Telegram-ботов',
  'Telegram-боты',
  'Telegram Mini Apps',
  'разработка Mini Apps',
  'AI интеграция',
  'внедрение ИИ',
  'корпоративные сайты',
  'лидогенерация',
  'привлечение клиентов',
  'web development',
  'digital agency',
  'web studio',
  'landing page',
  'website development'
];

const normalizeTitle = (title: string) => (title.includes(BRAND) ? title : `${title} | ${BRAND}`);
const mapLocale = (lang: string) => (lang === 'en' ? 'en_US' : 'ru_RU');

// Generate FAQ Schema for rich snippets
const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

// Generate Breadcrumb Schema
const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url
  }))
});

export const SEO: React.FC<SEOProps> = ({ title, description, path, image, type, noIndex, lang, faqs, breadcrumbs }) => {
  useEffect(() => {
    const fullTitle = normalizeTitle(title);
    const url = path ? `${BASE_URL}${path}` : window.location.href;
    const imageUrl = image || DEFAULT_IMAGE;
    const langValue = lang || document.documentElement.lang || 'ru';
    const locale = mapLocale(langValue);
    const keywords = [...BRAND_VARIANTS, ...SERVICE_KEYWORDS].join(', ');

    const updateMeta = (attributeName: string, attributeValue: string, content: string) => {
      let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const updateLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    const updateJsonLd = (data: Record<string, unknown>) => {
      let element = document.querySelector('script[type="application/ld+json"][data-seo="main"]');
      if (!element) {
        element = document.createElement('script');
        element.setAttribute('type', 'application/ld+json');
        element.setAttribute('data-seo', 'main');
        document.head.appendChild(element);
      }
      element.textContent = JSON.stringify(data);
    };

    document.title = fullTitle;

    updateMeta('name', 'description', description);
    updateMeta('name', 'keywords', keywords);
    updateMeta('name', 'author', BRAND);
    updateMeta('name', 'publisher', BRAND);
    updateMeta('name', 'application-name', BRAND);
    updateMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMeta('property', 'og:type', type || 'website');
    updateMeta('property', 'og:title', fullTitle);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', url);
    updateMeta('property', 'og:image', imageUrl);
    updateMeta('property', 'og:site_name', BRAND);
    updateMeta('property', 'og:locale', locale);
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', fullTitle);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', imageUrl);
    updateLink('canonical', url);

    // Build schema graph
    const schemaGraph: Record<string, unknown>[] = [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: BRAND,
        alternateName: BRAND_VARIANTS,
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: DEFAULT_IMAGE,
          width: 512,
          height: 512
        },
        email: 'contact@codexai.pro',
        telephone: '+74950322199',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+74950322199',
          contactType: 'sales',
          areaServed: ['RU', 'KZ', 'BY'],
          availableLanguage: ['Russian', 'English']
        },
        // Extended sameAs for Entity Linking (E-E-A-T)
        sameAs: [
          'https://t.me/codexai_pro',
          'https://instagram.com/codexai.agency',
          'https://wa.me/74950322199',
          'https://vc.ru/u/codexai',
          'https://clutch.co/profile/codexai',
          'https://www.linkedin.com/company/codexai'
        ],
        brand: {
          '@type': 'Brand',
          name: BRAND,
          alternateName: BRAND_VARIANTS
        },
        founder: {
          '@type': 'Person',
          '@id': `${BASE_URL}/#founder`,
          name: 'CODEXAI Team',
          jobTitle: 'Founder & CEO',
          sameAs: [
            'https://t.me/codexai_pro',
            'https://linkedin.com/company/codexai'
          ]
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: BRAND,
        alternateName: BRAND_VARIANTS,
        url: BASE_URL,
        publisher: { '@id': `${BASE_URL}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/services?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${BASE_URL}/#service`,
        name: BRAND,
        alternateName: BRAND_VARIANTS,
        url: BASE_URL,
        email: 'contact@codexai.pro',
        telephone: '+74950322199',
        priceRange: '$$',
        areaServed: [
          { '@type': 'Country', name: 'Russia' },
          { '@type': 'Country', name: 'Kazakhstan' },
          { '@type': 'Country', name: 'Belarus' }
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Красного Текстильщика ул, д 10-12 лит.О',
          addressLocality: 'Санкт-Петербург',
          postalCode: '191124',
          addressCountry: 'RU'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 59.9311,
          longitude: 30.3609
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '10:00',
          closes: '19:00'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Услуги CodexAI',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Разработка сайтов (лендинг)' },
              priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'RUB',
                price: '100000',
                minPrice: '100000'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Telegram-боты' },
              priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'RUB',
                price: '50000',
                minPrice: '50000'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Telegram Mini Apps' },
              priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'RUB',
                price: '120000',
                minPrice: '120000'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'AI интеграция' },
              priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'RUB',
                price: '100000',
                minPrice: '100000'
              }
            }
          ]
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '47',
          bestRating: '5'
        }
      },
      {
        '@type': 'WebPage',
        '@id': url,
        name: fullTitle,
        description,
        url,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#organization` }
      }
    ];

    // Add FAQ schema if provided
    if (faqs && faqs.length > 0) {
      schemaGraph.push(generateFAQSchema(faqs));
    }

    // Add Breadcrumb schema if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemaGraph.push(generateBreadcrumbSchema(breadcrumbs));
    }

    updateJsonLd({
      '@context': 'https://schema.org',
      '@graph': schemaGraph
    });
  }, [title, description, path, image, type, noIndex, lang, faqs, breadcrumbs]);

  return null;
};
