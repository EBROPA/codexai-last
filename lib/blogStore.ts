/**
 * Blog Store - управление статьями
 * Использует localStorage для клиента и API для сервера
 */

import { 
  BlogArticle, 
  BlogAuthor, 
  DEFAULT_AUTHORS, 
  generateId, 
  generateSlug, 
  calculateReadingTime 
} from './blogTypes';

const STORAGE_KEY = 'codexai_blog_articles';
const AUTHORS_KEY = 'codexai_blog_authors';

// Sample articles for demo
const SAMPLE_ARTICLES: BlogArticle[] = [
  {
    id: 'sample-1',
    slug: 'skolko-stoit-razrabotka-saita-v-2026',
    title: 'Сколько стоит разработка сайта в 2026 году: реальные цены',
    subtitle: 'Полный разбор стоимости от лендинга до интернет-магазина',
    excerpt: 'Разбираем реальную стоимость разработки сайтов в 2026 году: лендинг от 100 000 руб, корпоративный сайт от 250 000 руб, интернет-магазин от 500 000 руб.',
    content: `# Сколько стоит разработка сайта в 2026 году

## TL;DR
Стоимость разработки сайта в 2026 году зависит от типа проекта: лендинг стоит от 100 000 рублей (5-10 дней), корпоративный сайт от 250 000 рублей (2-4 недели), интернет-магазин от 500 000 рублей (4-8 недель). Цена включает дизайн, разработку, адаптивную верстку и гарантию на код 12 месяцев.

## Факторы, влияющие на стоимость

### 1. Тип сайта
- **Лендинг (Landing Page)** — одностраничный сайт для конкретного продукта или услуги
- **Корпоративный сайт** — многостраничный сайт компании с разделами услуг, о компании, контакты
- **Интернет-магазин** — полноценная e-commerce платформа с каталогом, корзиной и оплатой

### 2. Сложность дизайна
- Шаблонный дизайн: экономия 30-40% бюджета
- Уникальный дизайн: полная кастомизация под бренд
- Премиум-дизайн: сложные анимации, 3D-элементы, WebGL

### 3. Функциональность
- Базовая: статичные страницы, формы обратной связи
- Средняя: CMS, личные кабинеты, интеграции
- Сложная: API, микросервисы, высокие нагрузки

## Таблица цен на разработку сайтов в 2026 году

| Тип сайта | Цена от | Сроки | Гарантия |
|-----------|---------|-------|----------|
| Лендинг | 100 000 ₽ | 5-10 дней | 12 мес |
| Корпоративный сайт | 250 000 ₽ | 2-4 недели | 12 мес |
| Интернет-магазин | 500 000 ₽ | 4-8 недель | 12 мес |
| Telegram Mini App | 120 000 ₽ | 2-4 недели | 12 мес |

## Что входит в стоимость разработки

1. **Аналитика и стратегия** — исследование рынка, конкурентов, целевой аудитории
2. **UX/UI дизайн** — прототипирование, дизайн-макеты, адаптив
3. **Frontend-разработка** — верстка на React/Next.js
4. **Backend-разработка** — серверная часть, API, база данных
5. **Тестирование** — QA, кроссбраузерность, нагрузочные тесты
6. **Запуск** — деплой, SSL, настройка хостинга
7. **Гарантия** — 12 месяцев бесплатного исправления багов

## Как сэкономить на разработке

- Используйте готовые компоненты вместо кастомных
- Начните с MVP и развивайте итерациями
- Выбирайте проверенный стек технологий
- Работайте по фиксированной цене, а не почасовой

## Заключение

Стоимость разработки сайта в 2026 году начинается от 100 000 рублей за лендинг. Важно выбирать подрядчика с фиксированными ценами и сроками в договоре, гарантией на код и портфолио успешных проектов.`,
    metaTitle: 'Сколько стоит разработка сайта в 2026 году: цены от 100 000 руб',
    metaDescription: 'Реальные цены на разработку сайтов в 2026: лендинг от 100 000 руб, корпоративный сайт от 250 000 руб, интернет-магазин от 500 000 руб. Таблица цен и что входит в стоимость.',
    keywords: ['стоимость разработки сайта', 'цена сайта', 'сколько стоит сайт', 'разработка сайта цена', 'заказать сайт'],
    tldr: 'Стоимость разработки сайта в 2026 году: лендинг от 100 000 рублей (5-10 дней), корпоративный сайт от 250 000 рублей (2-4 недели), интернет-магазин от 500 000 рублей (4-8 недель). Цена включает дизайн, разработку и 12 месяцев гарантии.',
    keyTakeaways: [
      { title: 'Лендинг от 100 000 ₽', description: 'Одностраничный сайт за 5-10 дней с гарантией 12 месяцев' },
      { title: 'Корпоративный сайт от 250 000 ₽', description: 'Многостраничный сайт компании за 2-4 недели' },
      { title: 'Интернет-магазин от 500 000 ₽', description: 'E-commerce с каталогом и оплатой за 4-8 недель' },
      { title: 'Гарантия 12 месяцев', description: 'Бесплатное исправление багов в течение года' }
    ],
    faqs: [
      { question: 'Сколько стоит лендинг в 2026 году?', answer: 'Стоимость лендинга в 2026 году начинается от 100 000 рублей. Срок разработки 5-10 рабочих дней. В цену входит дизайн, разработка на React, адаптивная верстка и гарантия 12 месяцев.' },
      { question: 'Что влияет на стоимость сайта?', answer: 'На стоимость сайта влияют: тип сайта (лендинг, корпоративный, магазин), сложность дизайна, функциональность (CMS, интеграции, личные кабинеты), сроки разработки.' },
      { question: 'Можно ли сделать сайт дешевле?', answer: 'Да, можно сэкономить используя готовые компоненты, начав с MVP, выбрав проверенный стек технологий. Но не рекомендуем экономить на дизайне и безопасности.' }
    ],
    stats: [
      { label: 'Средняя стоимость лендинга', value: '100 000 ₽', source: 'CODEXAI, 2026' },
      { label: 'Срок разработки лендинга', value: '5-10 дней', source: 'CODEXAI, 2026' },
      { label: 'Гарантия на код', value: '12 месяцев', source: 'CODEXAI, 2026' }
    ],
    category: 'web-development',
    tags: ['цены', 'разработка сайтов', 'лендинг', 'корпоративный сайт', 'интернет-магазин'],
    featuredImage: '/img/codexai-logo.png',
    featuredImageAlt: 'Стоимость разработки сайта в 2026 году',
    authorId: 'codexai-team',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-24T12:00:00Z',
    publishedAt: '2026-01-20T10:00:00Z',
    status: 'published',
    readingTime: 5,
    relatedServices: ['web']
  },
  {
    id: 'sample-2',
    slug: 'telegram-mini-apps-razrabotka-2026',
    title: 'Telegram Mini Apps: полный гайд по разработке в 2026',
    subtitle: 'Как создать Mini App для Telegram с нуля',
    excerpt: 'Подробное руководство по разработке Telegram Mini Apps: технологии, стоимость от 120 000 руб, интеграции с платежами и лучшие практики.',
    content: `# Telegram Mini Apps: полный гайд по разработке в 2026

## TL;DR
Telegram Mini Apps — это веб-приложения, работающие внутри мессенджера Telegram. Стоимость разработки от 120 000 рублей, срок 2-4 недели. Mini Apps поддерживают нативные платежи (Telegram Payments, TON), имеют доступ к данным пользователя и могут работать без установки.

## Что такое Telegram Mini Apps

Telegram Mini Apps (ранее Web Apps) — это полноценные веб-приложения, которые запускаются прямо внутри Telegram. Пользователю не нужно ничего устанавливать — приложение открывается в один клик.

### Преимущества Mini Apps

- **Бесшовный вход** — авторизация через Telegram, без регистрации
- **Нативные платежи** — Apple Pay, Google Pay, Telegram Payments, TON
- **Вирусное распространение** — легко делиться ссылкой в чатах
- **Нет комиссии App Store** — экономия 30% на платежах
- **Мгновенный запуск** — не нужно скачивать и устанавливать

## Сколько стоит разработка Telegram Mini App

| Тип Mini App | Цена от | Сроки |
|--------------|---------|-------|
| Простой (визитка, каталог) | 120 000 ₽ | 2-3 недели |
| Средний (магазин, бронирование) | 200 000 ₽ | 3-4 недели |
| Сложный (GameFi, Web3) | 400 000 ₽ | 6-8 недель |

## Технологии для разработки

- **Frontend**: React, Vue, Svelte
- **Telegram API**: @twa-dev/sdk, Telegram WebApp API
- **Платежи**: Telegram Payments, TON Connect
- **Backend**: Node.js, Python
- **База данных**: PostgreSQL, MongoDB

## Примеры успешных Mini Apps

1. **Магазины** — каталог товаров с корзиной и оплатой
2. **Сервисы бронирования** — запись на услуги, выбор времени
3. **Игры** — кликеры, квизы, казуальные игры
4. **Финансы** — TON-кошельки, криптобиржи
5. **Утилиты** — заметки, таск-менеджеры, калькуляторы

## Как заказать разработку Mini App

1. Оставьте заявку на сайте или напишите в Telegram @codexai_pro
2. Получите КП с ценой и сроками за 24 часа
3. Утвердите дизайн и функциональность
4. Получите готовое приложение с документацией`,
    metaTitle: 'Telegram Mini Apps разработка: гайд 2026 | от 120 000 руб',
    metaDescription: 'Полный гайд по разработке Telegram Mini Apps в 2026 году. Стоимость от 120 000 руб, сроки 2-4 недели. Технологии, платежи, примеры.',
    keywords: ['telegram mini apps', 'tma разработка', 'telegram web apps', 'мини приложения telegram'],
    tldr: 'Telegram Mini Apps — веб-приложения внутри Telegram без установки. Стоимость разработки от 120 000 рублей, срок 2-4 недели. Поддержка платежей через Apple Pay, Google Pay, Telegram Payments и TON.',
    keyTakeaways: [
      { title: 'Разработка от 120 000 ₽', description: 'Простой Mini App за 2-3 недели с интеграцией платежей' },
      { title: 'Без установки', description: 'Приложение запускается прямо в Telegram в один клик' },
      { title: 'Нативные платежи', description: 'Apple Pay, Google Pay, Telegram Payments, TON без комиссии 30%' },
      { title: 'Вирусное распространение', description: 'Легко делиться ссылкой в чатах и группах' }
    ],
    faqs: [
      { question: 'Сколько стоит разработка Telegram Mini App?', answer: 'Стоимость разработки Telegram Mini App начинается от 120 000 рублей за простое приложение (каталог, визитка). Магазин с корзиной и оплатой — от 200 000 рублей. Сложные GameFi и Web3 проекты — от 400 000 рублей.' },
      { question: 'Сколько времени занимает разработка Mini App?', answer: 'Простой Mini App разрабатывается за 2-3 недели, средней сложности (магазин) — 3-4 недели, сложный (GameFi, Web3) — 6-8 недель. Сроки фиксируются в договоре.' },
      { question: 'Какие платежи поддерживают Mini Apps?', answer: 'Telegram Mini Apps поддерживают Apple Pay, Google Pay, Telegram Payments и криптовалюту TON. Важное преимущество — нет комиссии App Store 30%.' }
    ],
    category: 'telegram-mini-apps',
    tags: ['telegram', 'mini apps', 'tma', 'разработка', 'ton'],
    featuredImage: '/img/codexai-logo.png',
    featuredImageAlt: 'Разработка Telegram Mini Apps',
    authorId: 'codexai-team',
    createdAt: '2026-01-22T10:00:00Z',
    updatedAt: '2026-01-24T12:00:00Z',
    publishedAt: '2026-01-22T10:00:00Z',
    status: 'published',
    readingTime: 6,
    relatedServices: ['tma', 'bots']
  }
];

// Blog Store class
class BlogStore {
  private articles: BlogArticle[] = [];
  private authors: BlogAuthor[] = DEFAULT_AUTHORS;
  private initialized = false;

  // Initialize store
  init() {
    if (this.initialized) return;
    
    if (typeof window !== 'undefined') {
      // Load from localStorage
      const savedArticles = localStorage.getItem(STORAGE_KEY);
      const savedAuthors = localStorage.getItem(AUTHORS_KEY);
      
      if (savedArticles) {
        this.articles = JSON.parse(savedArticles);
      } else {
        // Use sample articles on first load
        this.articles = SAMPLE_ARTICLES;
        this.save();
      }
      
      if (savedAuthors) {
        this.authors = JSON.parse(savedAuthors);
      }
    }
    
    this.initialized = true;
  }

  // Save to localStorage
  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.articles));
      localStorage.setItem(AUTHORS_KEY, JSON.stringify(this.authors));
    }
  }

  // Get all published articles
  getPublishedArticles(): BlogArticle[] {
    this.init();
    return this.articles
      .filter(a => a.status === 'published')
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  // Get all articles (for admin)
  getAllArticles(): BlogArticle[] {
    this.init();
    return this.articles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Get article by slug
  getArticleBySlug(slug: string): BlogArticle | undefined {
    this.init();
    return this.articles.find(a => a.slug === slug);
  }

  // Get article by ID
  getArticleById(id: string): BlogArticle | undefined {
    this.init();
    return this.articles.find(a => a.id === id);
  }

  // Get articles by category
  getArticlesByCategory(category: string): BlogArticle[] {
    this.init();
    return this.articles
      .filter(a => a.status === 'published' && a.category === category)
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  // Get articles by tag
  getArticlesByTag(tag: string): BlogArticle[] {
    this.init();
    return this.articles
      .filter(a => a.status === 'published' && a.tags.includes(tag))
      .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  // Create article
  createArticle(article: Partial<BlogArticle>): BlogArticle {
    this.init();
    
    const now = new Date().toISOString();
    const newArticle: BlogArticle = {
      id: generateId(),
      slug: article.slug || generateSlug(article.title || 'untitled'),
      title: article.title || 'Без названия',
      excerpt: article.excerpt || '',
      content: article.content || '',
      keywords: article.keywords || [],
      tldr: article.tldr || '',
      keyTakeaways: article.keyTakeaways || [],
      faqs: article.faqs || [],
      category: article.category || 'web-development',
      tags: article.tags || [],
      featuredImage: article.featuredImage || '/img/codexai-logo.png',
      featuredImageAlt: article.featuredImageAlt || article.title || '',
      authorId: article.authorId || 'codexai-team',
      createdAt: now,
      updatedAt: now,
      status: article.status || 'draft',
      readingTime: calculateReadingTime(article.content || ''),
      ...article
    } as BlogArticle;

    this.articles.push(newArticle);
    this.save();
    
    return newArticle;
  }

  // Update article
  updateArticle(id: string, updates: Partial<BlogArticle>): BlogArticle | undefined {
    this.init();
    
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      readingTime: updates.content 
        ? calculateReadingTime(updates.content) 
        : this.articles[index].readingTime
    };

    // Update slug if title changed
    if (updates.title && !updates.slug) {
      updated.slug = generateSlug(updates.title);
    }

    this.articles[index] = updated;
    this.save();
    
    return updated;
  }

  // Delete article
  deleteArticle(id: string): boolean {
    this.init();
    
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return false;

    this.articles.splice(index, 1);
    this.save();
    
    return true;
  }

  // Publish article
  publishArticle(id: string): BlogArticle | undefined {
    return this.updateArticle(id, {
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  }

  // Unpublish article
  unpublishArticle(id: string): BlogArticle | undefined {
    return this.updateArticle(id, {
      status: 'draft'
    });
  }

  // Get author by ID
  getAuthor(id: string): BlogAuthor | undefined {
    this.init();
    return this.authors.find(a => a.id === id);
  }

  // Get all authors
  getAuthors(): BlogAuthor[] {
    this.init();
    return this.authors;
  }

  // Create new author
  createAuthor(author: Omit<BlogAuthor, 'id'>): BlogAuthor {
    this.init();
    const newAuthor: BlogAuthor = {
      ...author,
      id: `author-${Date.now()}`
    };
    this.authors.push(newAuthor);
    this.save();
    return newAuthor;
  }

  // Get all unique tags
  getAllTags(): string[] {
    this.init();
    const tags = new Set<string>();
    this.articles
      .filter(a => a.status === 'published')
      .forEach(a => a.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }

  // Get all slugs for sitemap
  getAllSlugs(): string[] {
    this.init();
    return this.articles
      .filter(a => a.status === 'published')
      .map(a => a.slug);
  }
}

// Singleton instance
export const blogStore = new BlogStore();

export default blogStore;
