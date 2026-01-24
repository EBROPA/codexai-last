/**
 * Prerender Configuration for CODEXAI
 * 
 * This configuration enables static HTML generation for search engine bots.
 * Bots (including GPTBot, Googlebot, etc.) will receive pre-rendered HTML
 * with full content instead of an empty SPA shell.
 */

export const prerenderConfig = {
  // Base URL for the site
  baseUrl: 'https://codexai.pro',

  // Routes to prerender
  routes: [
    '/',
    '/about',
    '/work',
    '/services',
    '/services/web',
    '/services/bots',
    '/services/ai',
    '/services/complex',
    '/services/tma',
    '/services/reputation',
    '/services/custom',
    '/services/direct',
    '/services/tgads',
    '/contact'
  ],

  // Output directory for prerendered HTML
  outputDir: './prerendered',

  // Bot user agents that trigger prerendering
  botUserAgents: [
    'googlebot',
    'bingbot',
    'yandexbot',
    'duckduckbot',
    'slurp',
    'baiduspider',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'whatsapp',
    'telegrambot',
    'applebot',
    'gptbot',
    'chatgpt-user',
    'perplexitybot',
    'claudebot',
    'google-extended',
    'applebot-extended'
  ],

  // SEO meta data for each route (used in prerendered HTML)
  seoData: {
    '/': {
      title: 'Разработка сайтов, Telegram-боты и AI | CODEXAI',
      description: 'Разработка сайтов под ключ, Telegram-боты, Mini Apps и AI-интеграции. Быстрый запуск, фиксированные сроки, рост заявок.',
      keywords: 'веб-студия, разработка сайтов, создание сайтов, сайт под ключ, заказать сайт'
    },
    '/about': {
      title: 'О компании CODEXAI - гарантии и экспертиза',
      description: 'Работаем по договору, соблюдаем сроки, даем гарантию на код 12 месяцев. Senior-команда и прозрачные процессы.',
      keywords: 'веб-студия CODEXAI, о компании, команда разработчиков'
    },
    '/work': {
      title: 'Портфолио и кейсы | CODEXAI',
      description: 'Реальные проекты с ростом заявок и продаж. Сайты, боты и сервисы под бизнес-цели.',
      keywords: 'портфолио, кейсы, примеры работ, веб-разработка'
    },
    '/services': {
      title: 'Услуги для роста заявок | CODEXAI',
      description: 'Разработка сайтов, Telegram-ботов, Mini Apps и AI-решений. Подберем формат и запустим быстро.',
      keywords: 'услуги веб-студии, разработка сайтов, telegram боты, ai интеграция'
    },
    '/services/web': {
      title: 'Разработка сайтов под ключ от 100 000 руб - за 7-30 дней | CODEXAI',
      description: 'Создаем продающие сайты с гарантией 12 месяцев. Лендинги, корпоративные сайты, интернет-магазины. Фиксированные сроки в договоре.',
      keywords: 'разработка сайтов, создание сайтов, лендинг, корпоративный сайт, интернет-магазин'
    },
    '/services/bots': {
      title: 'Telegram-боты для бизнеса от 50 000 руб - автоматизация продаж | CODEXAI',
      description: 'Разрабатываем Telegram-ботов для лидогенерации, поддержки клиентов и автоматизации. Интеграция с CRM, оплатой и AI.',
      keywords: 'telegram боты, разработка ботов, автоматизация продаж, чат-боты'
    },
    '/services/ai': {
      title: 'Интеграция ChatGPT и AI в бизнес - от 100 000 руб | CODEXAI',
      description: 'Внедряем искусственный интеллект: чат-боты с GPT, автоматизация контента, AI-аналитика. Кастомные решения под задачи.',
      keywords: 'ai интеграция, chatgpt, искусственный интеллект, нейросети для бизнеса'
    },
    '/services/tma': {
      title: 'Telegram Mini Apps разработка от 120 000 руб | CODEXAI',
      description: 'Создаем Mini Apps для Telegram: магазины, сервисы, игры. Полная интеграция с Telegram Payments и TON.',
      keywords: 'telegram mini apps, tma разработка, telegram web apps'
    },
    '/contact': {
      title: 'Контакты и расчет стоимости | CODEXAI',
      description: 'Оставьте заявку и получите расчет стоимости и сроков. Ответим быстро и по делу.',
      keywords: 'контакты, заказать сайт, расчет стоимости'
    }
  }
};

export default prerenderConfig;
