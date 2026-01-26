import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ChevronRight, Tag, Search, Filter, ArrowUpRight } from 'lucide-react';
import { useRouter } from '../lib/router';
import { useLanguage } from '../lib/i18n';
import { SEO } from './SEO';
import { Breadcrumbs } from './Breadcrumbs';
import { blogStore } from '../lib/blogStore';
import { BlogArticle, CATEGORY_META, ArticleCategory } from '../lib/blogTypes';

// Image cache to prevent re-loading
const imageCache = new Map<string, boolean>();

// Preload image utility
const preloadImage = (src: string): Promise<void> => {
  if (imageCache.has(src)) return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, true);
      resolve();
    };
    img.onerror = () => {
      imageCache.set(src, false);
      resolve();
    };
    img.src = src;
  });
};

export const BlogPage: React.FC = () => {
  const router = useRouter();
  const { lang } = useLanguage();
  const isRu = lang === 'ru';

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<BlogArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const published = blogStore.getPublishedArticles();
    setArticles(published);
    setFilteredArticles(published);
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  }, [selectedCategory, searchQuery, articles]);

  const breadcrumbs = [
    { name: isRu ? 'Главная' : 'Home', url: '/' },
    { name: isRu ? 'Блог' : 'Blog', url: '/blog' }
  ];

  const categories = Object.entries(CATEGORY_META);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-zinc-900/50 to-transparent pointer-events-none" />
      <div className="absolute -top-[20%] right-0 w-[600px] h-[600px] bg-neon-acid/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <SEO
        title={isRu ? 'Блог о веб-разработке, AI и Telegram | CODEXAI' : 'Blog about Web Development, AI & Telegram | CODEXAI'}
        description={isRu
          ? 'Экспертные статьи о разработке сайтов, Telegram-ботов, Mini Apps и AI-интеграциях. Кейсы, туториалы и аналитика рынка от команды CODEXAI.'
          : 'Expert articles about website development, Telegram bots, Mini Apps and AI integrations. Case studies, tutorials and market analytics from CODEXAI team.'
        }
        path="/blog"
        lang={lang}
        breadcrumbs={breadcrumbs}
      />

      <div className="relative z-10 pt-24 md:pt-32 pb-10 md:pb-20 px-4 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6 md:mb-12 flex justify-center md:justify-start">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {/* Header */}
          <div className="mb-8 md:mb-20 text-center relative">
            <div className="inline-block mb-2 md:mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span className="font-mono text-neon-acid text-xs uppercase tracking-widest">
                // {isRu ? 'База знаний' : 'Knowledge Base'}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-white mb-3 md:mb-6 tracking-tight leading-tight">
              {isRu ? 'Блог' : 'Blog'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-700">CODEXAI</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-xl max-w-2xl mx-auto leading-relaxed">
              {isRu
                ? <>{'Экспертные статьи о веб-разработке, Telegram-ботах, AI и digital-маркетинге.'} <span className="hidden md:inline">Делимся опытом и практическими знаниями для роста вашего бизнеса.</span></>
                : <>{'Expert articles about web development, Telegram bots, AI and digital marketing.'} <span className="hidden md:inline">Sharing experience and practical knowledge to grow your business.</span></>
              }
            </p>
          </div>

          {/* Filters Bar */}
          <div className="sticky top-20 md:top-24 z-30 mb-8 md:mb-16 mx-auto max-w-4xl">
            <div className="p-2 backdrop-blur-xl bg-zinc-900/80 border border-white/10 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2">
              {/* Search */}
              <div className="relative flex-1 group">
                <label htmlFor="blog-search" className="sr-only">{isRu ? 'Поиск статей' : 'Search articles'}</label>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-800 text-zinc-400 group-focus-within:bg-neon-acid group-focus-within:text-black transition-all duration-300">
                  <Search size={14} />
                </div>
                <input
                  id="blog-search"
                  name="search"
                  type="text"
                  autoComplete="off"
                  placeholder={isRu ? 'Поиск статей...' : 'Search articles...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 bg-transparent text-white placeholder-zinc-500 focus:outline-none rounded-full"
                />
              </div>

              <div className="w-px bg-white/10 hidden md:block my-2" />

              {/* Category Filter */}
              <div className="relative group min-w-[220px]">
                <label htmlFor="blog-category" className="sr-only">{isRu ? 'Выбор категории' : 'Select category'}</label>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-800 text-zinc-400 group-focus-within:bg-neon-acid group-focus-within:text-black transition-all duration-300 pointer-events-none">
                  <Filter size={14} />
                </div>
                <select
                  id="blog-category"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-14 pr-8 py-3 bg-transparent text-white focus:outline-none appearance-none cursor-pointer rounded-full hover:bg-white/5 transition-colors"
                >
                  <option value="all" className="bg-zinc-900">{isRu ? 'Все категории' : 'All categories'}</option>
                  {categories.map(([key, meta]) => (
                    <option key={key} value={key} className="bg-zinc-900">
                      {isRu ? meta.name : meta.nameEn}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-y-16">
              {filteredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isRu={isRu}
                  featured={index === 0 && !searchQuery && selectedCategory === 'all'} // Make first article featured if no filters
                  onClick={() => router.push(`/blog/${article.slug}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 border border-white/5 rounded-3xl bg-white/5">
              <div className="inline-block p-4 rounded-full bg-zinc-900 mb-4 text-zinc-500">
                <Search size={24} />
              </div>
              <p className="text-zinc-400 text-lg">
                {isRu ? 'Статьи не найдены' : 'No articles found'}
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4 text-neon-acid hover:underline underline-offset-4 text-sm font-mono uppercase tracking-widest"
              >
                {isRu ? 'Сбросить фильтры' : 'Reset filters'}
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="mt-32 relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-neon-acid/10 to-transparent pointer-events-none" />
            <div className="relative z-10 px-8 py-16 md:p-20 text-center">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                {isRu ? 'Готовы начать проект?' : 'Ready to start a project?'}
              </h2>
              <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
                {isRu
                  ? 'Оставьте заявку и получите расчет стоимости и сроков разработки за 24 часа.'
                  : 'Get a quote with clear scope and timeline within 24 hours.'
                }
              </p>
              <button
                onClick={() => router.push('/request')}
                className="px-8 py-4 bg-neon-acid text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 duration-300"
              >
                {isRu ? 'Обсудить проект' : 'Discuss Project'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to fix image URL if it's just an ID
// useThumbnail: true for list views (faster loading), false for full article view
const getImageUrl = (url: string, useThumbnail: boolean = false): string => {
  if (!url) return '/img/codexai-logo.png';
  // If it looks like a UUID (no slashes, 36 chars with dashes), prepend /api/images/
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(url)) {
    return `/api/images/${url}${useThumbnail ? '?size=thumb' : ''}`;
  }
  return url;
};

// Blog Image Component with instant display
const BlogImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}> = ({ src, alt, className = '', onError }) => {
  const [isLoaded, setIsLoaded] = useState(() => imageCache.has(src));
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload image when component is about to enter viewport
  useEffect(() => {
    if (imageCache.has(src)) {
      setIsLoaded(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          preloadImage(src).then(() => {
            if (imageCache.get(src)) {
              setIsLoaded(true);
            }
          });
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: '200px' // Start loading 200px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Solid background - always visible immediately */}
      <div className="absolute inset-0 bg-zinc-800" />

      {/* Gradient shimmer effect while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite'
          }}
        />
      )}

      {/* Actual image - only render when cached or loaded */}
      {!hasError && (
        <img
          ref={imgRef}
          src={isLoaded ? src : undefined}
          data-src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
          onLoad={() => {
            imageCache.set(src, true);
            setIsLoaded(true);
          }}
          onError={handleError}
        />
      )}

      {/* Fallback on error */}
      {hasError && (
        <img
          src="/img/codexai-logo.png"
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
};

// Article Card Component
const ArticleCard: React.FC<{
  article: BlogArticle;
  isRu: boolean;
  featured?: boolean;
  onClick: () => void;
}> = ({ article, isRu, featured, onClick }) => {
  const categoryMeta = CATEGORY_META[article.category as ArticleCategory];
  // Use thumbnail for faster loading in list views
  const featuredImageUrl = getImageUrl(article.featuredImage, true);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (featured) {
    return (
      <article
        onClick={onClick}
        className="group md:col-span-2 lg:col-span-3 grid md:grid-cols-2 gap-8 md:gap-12 cursor-pointer mb-12"
      >
        <div className="aspect-[16/9] md:aspect-auto md:h-[500px] overflow-hidden rounded-2xl relative">
          <BlogImage
            src={featuredImageUrl}
            alt={article.featuredImageAlt}
            className="transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition-colors duration-500" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full border border-neon-acid/30 bg-neon-acid/10 text-neon-acid text-xs font-mono uppercase tracking-widest">
              {isRu ? 'Избранное' : 'Featured'}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="text-zinc-400 text-xs font-mono uppercase tracking-widest">
              {isRu ? categoryMeta?.name : categoryMeta?.nameEn}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 group-hover:text-neon-acid transition-colors leading-tight">
            {article.title}
          </h2>

          <p className="text-zinc-400 text-lg mb-8 line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-6 text-sm text-zinc-500 border-t border-white/10 pt-6 mt-auto">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <Clock size={14} />
              {article.readingTime} {isRu ? 'мин' : 'min'}
            </span>
            <div className="ml-auto p-3 rounded-full border border-white/20 text-white group-hover:bg-neon-acid group-hover:border-neon-acid group-hover:text-black transition-all duration-300">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      onClick={onClick}
      className="group flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 relative">
        <BlogImage
          src={featuredImageUrl}
          alt={article.featuredImageAlt}
          className="transform group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-mono uppercase tracking-widest">
            {isRu ? categoryMeta?.name : categoryMeta?.nameEn}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(article.publishedAt || article.createdAt)}
          </span>
          <span className="w-px h-3 bg-zinc-800" />
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {article.readingTime} {isRu ? 'мин' : 'min'}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-neon-acid transition-colors leading-tight line-clamp-2">
          {article.title}
        </h2>

        {/* Excerpt */}
        <p className="text-zinc-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
          {article.excerpt}
        </p>

        {/* Read More */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white group-hover:text-neon-acid transition-colors mt-auto">
          {isRu ? 'Читать статью' : 'Read Article'}
          <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};

export default BlogPage;
