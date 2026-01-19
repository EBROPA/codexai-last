import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  lang?: 'ru' | 'en';
}

const BASE_URL = 'https://codexai.pro';
const BRAND = 'CODEXAI';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
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
  'разработка Telegram-ботов',
  'Telegram-боты',
  'Telegram Mini Apps',
  'разработка Mini Apps',
  'AI интеграция',
  'внедрение ИИ',
  'корпоративные сайты',
  'лендинг под ключ',
  'web development',
  'digital agency',
  'website development'
];

const normalizeTitle = (title: string) => (title.includes(BRAND) ? title : `${title} | ${BRAND}`);
const mapLocale = (lang: string) => (lang === 'en' ? 'en_US' : 'ru_RU');

export const SEO: React.FC<SEOProps> = ({ title, description, path, image, type, noIndex, lang }) => {
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

    updateJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: BRAND,
          alternateName: BRAND_VARIANTS,
          url: BASE_URL,
          logo: DEFAULT_IMAGE,
          email: 'contact@codexai.pro',
          brand: {
            '@type': 'Brand',
            name: BRAND,
            alternateName: BRAND_VARIANTS
          }
        },
        {
          '@type': 'WebSite',
          name: BRAND,
          alternateName: BRAND_VARIANTS,
          url: BASE_URL
        },
        {
          '@type': 'ProfessionalService',
          name: BRAND,
          alternateName: BRAND_VARIANTS,
          url: BASE_URL,
          email: 'contact@codexai.pro',
          areaServed: {
            '@type': 'Country',
            name: 'Russia'
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Красного Текстильщика ул, д 10-12 лит.О',
            addressLocality: 'Санкт-Петербург',
            postalCode: '191124',
            addressCountry: 'RU'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Услуги CodexAI',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Разработка сайтов' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Telegram-боты' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Telegram Mini Apps' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI интеграция' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Complex Web Services' } }
            ]
          }
        },
        {
          '@type': 'WebPage',
          name: fullTitle,
          description,
          url
        }
      ]
    });
  }, [title, description, path, image, type, noIndex, lang]);

  return null;
};
