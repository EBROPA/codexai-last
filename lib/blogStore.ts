/**
 * Blog Store - управление статьями
 * Использует API для серверного хранения с fallback на localStorage
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
const API_BASE = '/api';

// Sample articles for fallback when API is not available
const SAMPLE_ARTICLES: BlogArticle[] = [
  {
    id: 'sample-1',
    slug: 'skolko-stoit-razrabotka-saita-v-2026',
    title: 'Сколько стоит разработка сайта в 2026 году: реальные цены',
    subtitle: 'Полный разбор стоимости от лендинга до интернет-магазина',
    excerpt: 'Разбираем реальную стоимость разработки сайтов в 2026 году: лендинг от 100 000 руб, корпоративный сайт от 250 000 руб, интернет-магазин от 500 000 руб.',
    content: '',
    blocks: [
      { id: 'b1', type: 'paragraph', content: 'Стоимость разработки сайта в 2026 году зависит от типа проекта: лендинг стоит от 100 000 рублей (5-10 дней), корпоративный сайт от 250 000 рублей (2-4 недели), интернет-магазин от 500 000 рублей (4-8 недель).' },
      { id: 'b2', type: 'heading', level: 2, content: 'Факторы, влияющие на стоимость' },
      { id: 'b3', type: 'paragraph', content: 'На стоимость сайта влияют: тип сайта, сложность дизайна и функциональность.' }
    ],
    metaTitle: 'Сколько стоит разработка сайта в 2026 году: цены от 100 000 руб',
    metaDescription: 'Реальные цены на разработку сайтов в 2026: лендинг от 100 000 руб, корпоративный сайт от 250 000 руб.',
    keywords: ['стоимость разработки сайта', 'цена сайта', 'сколько стоит сайт'],
    tldr: 'Стоимость разработки сайта в 2026 году: лендинг от 100 000 рублей, корпоративный сайт от 250 000 рублей.',
    keyTakeaways: [
      { title: 'Лендинг от 100 000 ₽', description: 'Одностраничный сайт за 5-10 дней' },
      { title: 'Корпоративный сайт от 250 000 ₽', description: 'Многостраничный сайт за 2-4 недели' }
    ],
    faqs: [
      { question: 'Сколько стоит лендинг?', answer: 'Лендинг стоит от 100 000 рублей.' }
    ],
    stats: [],
    category: 'web-development',
    tags: ['цены', 'разработка сайтов'],
    featuredImage: '/img/codexai-logo.png',
    featuredImageAlt: 'Стоимость разработки сайта',
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
    excerpt: 'Подробное руководство по разработке Telegram Mini Apps: технологии, стоимость от 120 000 руб.',
    content: '',
    blocks: [
      { id: 'b1', type: 'paragraph', content: 'Telegram Mini Apps — это веб-приложения, работающие внутри мессенджера Telegram.' }
    ],
    metaTitle: 'Telegram Mini Apps разработка: гайд 2026',
    metaDescription: 'Полный гайд по разработке Telegram Mini Apps в 2026 году.',
    keywords: ['telegram mini apps', 'tma разработка'],
    tldr: 'Telegram Mini Apps — веб-приложения внутри Telegram. Стоимость от 120 000 рублей.',
    keyTakeaways: [
      { title: 'Разработка от 120 000 ₽', description: 'Mini App за 2-3 недели' }
    ],
    faqs: [],
    stats: [],
    category: 'telegram-mini-apps',
    tags: ['telegram', 'mini apps'],
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

// Blog Store class with API support
class BlogStore {
  private articles: BlogArticle[] = [];
  private authors: BlogAuthor[] = DEFAULT_AUTHORS;
  private initialized = false;
  private useApi = true; // Try API first, fallback to localStorage

  // Check if API is available
  private async checkApiAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/db-status`);
      const data = await response.json();
      return data.connected === true;
    } catch {
      return false;
    }
  }

  // Initialize store - load from API or localStorage
  async initAsync(): Promise<void> {
    if (this.initialized) return;
    
    // Check if API is available
    this.useApi = await this.checkApiAvailable();
    
    if (this.useApi) {
      console.log('[BlogStore] Using API for data storage');
      await this.loadFromApi();
    } else {
      console.log('[BlogStore] API not available, using localStorage');
      this.loadFromLocalStorage();
    }
    
    this.initialized = true;
  }

  // Sync init for backward compatibility
  init() {
    if (this.initialized) return;
    
    // Load from localStorage synchronously
    this.loadFromLocalStorage();
    this.initialized = true;
    
    // Then try to sync with API in background
    this.checkApiAvailable().then(available => {
      if (available) {
        this.useApi = true;
        this.loadFromApi();
      }
    });
  }

  // Load data from API
  private async loadFromApi(): Promise<void> {
    try {
      // Load articles
      const articlesRes = await fetch(`${API_BASE}/articles`);
      const articlesData = await articlesRes.json();
      if (articlesData.success && articlesData.articles) {
        this.articles = articlesData.articles.map(this.mapApiArticle);
      }
      
      // Load authors
      const authorsRes = await fetch(`${API_BASE}/authors`);
      const authorsData = await authorsRes.json();
      if (authorsData.success && authorsData.authors) {
        this.authors = authorsData.authors;
      }
      
      // If no articles in DB, seed with sample articles
      if (this.articles.length === 0) {
        console.log('[BlogStore] No articles in DB, seeding with samples...');
        for (const sample of SAMPLE_ARTICLES) {
          await this.createArticle(sample);
        }
      }
    } catch (error) {
      console.error('[BlogStore] API load error:', error);
      this.loadFromLocalStorage();
    }
  }

  // Map API article to BlogArticle format
  private mapApiArticle(apiArticle: any): BlogArticle {
    return {
      ...apiArticle,
      blocks: Array.isArray(apiArticle.blocks) ? apiArticle.blocks : JSON.parse(apiArticle.blocks || '[]'),
      keyTakeaways: Array.isArray(apiArticle.keyTakeaways) ? apiArticle.keyTakeaways : JSON.parse(apiArticle.keyTakeaways || '[]'),
      faqs: Array.isArray(apiArticle.faqs) ? apiArticle.faqs : JSON.parse(apiArticle.faqs || '[]'),
      stats: Array.isArray(apiArticle.stats) ? apiArticle.stats : JSON.parse(apiArticle.stats || '[]'),
      createdAt: apiArticle.createdAt,
      updatedAt: apiArticle.updatedAt,
      publishedAt: apiArticle.publishedAt,
    };
  }

  // Load from localStorage (fallback)
  private loadFromLocalStorage(): void {
    if (typeof window === 'undefined') return;
    
    const savedArticles = localStorage.getItem(STORAGE_KEY);
    const savedAuthors = localStorage.getItem(AUTHORS_KEY);
    
    if (savedArticles) {
      this.articles = JSON.parse(savedArticles);
    } else {
      this.articles = SAMPLE_ARTICLES;
      this.saveToLocalStorage();
    }
    
    if (savedAuthors) {
      this.authors = JSON.parse(savedAuthors);
    }
  }

  // Save to localStorage
  private saveToLocalStorage() {
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

  // Async version - fetch from API if available
  async getArticleBySlugAsync(slug: string): Promise<BlogArticle | undefined> {
    await this.initAsync();
    
    if (this.useApi) {
      try {
        const response = await fetch(`${API_BASE}/articles/slug/${slug}`);
        const data = await response.json();
        if (data.success && data.article) {
          return this.mapApiArticle(data.article);
        }
      } catch (error) {
        console.error('[BlogStore] Error fetching article:', error);
      }
    }
    
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
  async createArticle(article: Partial<BlogArticle>): Promise<BlogArticle> {
    await this.initAsync();
    
    const now = new Date().toISOString();
    const newArticle: BlogArticle = {
      id: generateId(),
      slug: article.slug || generateSlug(article.title || 'untitled'),
      title: article.title || 'Без названия',
      excerpt: article.excerpt || '',
      content: article.content || '',
      blocks: article.blocks || [],
      keywords: article.keywords || [],
      tldr: article.tldr || '',
      keyTakeaways: article.keyTakeaways || [],
      faqs: article.faqs || [],
      stats: article.stats || [],
      category: article.category || 'web-development',
      tags: article.tags || [],
      featuredImage: article.featuredImage || '/img/codexai-logo.png',
      featuredImageAlt: article.featuredImageAlt || article.title || '',
      authorId: article.authorId || 'codexai-team',
      createdAt: now,
      updatedAt: now,
      status: article.status || 'draft',
      readingTime: article.readingTime || calculateReadingTime(article.content || ''),
      ...article
    } as BlogArticle;

    if (this.useApi) {
      try {
        const response = await fetch(`${API_BASE}/articles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newArticle),
        });
        const data = await response.json();
        if (data.success && data.article) {
          const created = this.mapApiArticle(data.article);
          this.articles.push(created);
          return created;
        }
      } catch (error) {
        console.error('[BlogStore] API create error:', error);
      }
    }

    // Fallback to localStorage
    this.articles.push(newArticle);
    this.saveToLocalStorage();
    return newArticle;
  }

  // Update article
  async updateArticle(id: string, updates: Partial<BlogArticle>): Promise<BlogArticle | undefined> {
    await this.initAsync();
    
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return undefined;

    const updated = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (this.useApi) {
      try {
        const response = await fetch(`${API_BASE}/articles/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        const data = await response.json();
        if (data.success && data.article) {
          const result = this.mapApiArticle(data.article);
          this.articles[index] = result;
          return result;
        }
      } catch (error) {
        console.error('[BlogStore] API update error:', error);
      }
    }

    // Fallback to localStorage
    this.articles[index] = updated;
    this.saveToLocalStorage();
    return updated;
  }

  // Delete article
  async deleteArticle(id: string): Promise<boolean> {
    await this.initAsync();
    
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) return false;

    if (this.useApi) {
      try {
        const response = await fetch(`${API_BASE}/articles/${id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          this.articles.splice(index, 1);
          return true;
        }
      } catch (error) {
        console.error('[BlogStore] API delete error:', error);
      }
    }

    // Fallback to localStorage
    this.articles.splice(index, 1);
    this.saveToLocalStorage();
    return true;
  }

  // Publish article
  async publishArticle(id: string): Promise<BlogArticle | undefined> {
    return this.updateArticle(id, {
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  }

  // Unpublish article
  async unpublishArticle(id: string): Promise<BlogArticle | undefined> {
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
  async createAuthor(author: Omit<BlogAuthor, 'id'>): Promise<BlogAuthor> {
    await this.initAsync();
    
    if (this.useApi) {
      try {
        const response = await fetch(`${API_BASE}/authors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(author),
        });
        const data = await response.json();
        if (data.success && data.author) {
          this.authors.push(data.author);
          return data.author;
        }
      } catch (error) {
        console.error('[BlogStore] API create author error:', error);
      }
    }

    // Fallback to localStorage
    const newAuthor: BlogAuthor = {
      ...author,
      id: `author-${Date.now()}`
    };
    this.authors.push(newAuthor);
    this.saveToLocalStorage();
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

  // Force refresh from API
  async refresh(): Promise<void> {
    this.initialized = false;
    await this.initAsync();
  }
}

// Singleton instance
export const blogStore = new BlogStore();

export default blogStore;
