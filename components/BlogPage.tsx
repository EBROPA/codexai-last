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
    const loadArticles = async () => {
      await blogStore.refresh();
      const published = blogStore.getPublishedArticles();
      setArticles(published);
      setFilteredArticles(published);
    };
    loadArticles();
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
          {/* Header & Controls */}
          <div className="mb-16 md:mb-24">

            {/* Title */}
            <div className="mb-12 max-w-4xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 tracking-tight leading-[0.95]">
                {isRu ? 'Будьте в курсе последних новостей и трендов' : 'Stay up to date with the latest news and trends'}
              </h1>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 border-b border-white/10 pb-6 mb-12">

              {/* Categories / Tabs */}
              <div className="flex flex-wrap items-center gap-4 md:gap-8 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`
                    whitespace-nowrap px-6 py-2 rounded-lg font-mono text-xs uppercase tracking-widest transition-all duration-300
                    ${selectedCategory === 'all'
                      ? 'bg-neon-acid text-black font-bold'
                      : 'bg-transparent text-zinc-400 hover:text-white'}
                  `}
                >
                  {isRu ? 'Свежее' : 'Latest'}
                </button>

                {categories.map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`
                      whitespace-nowrap font-sans text-sm md:text-base font-medium transition-colors duration-200
                      ${selectedCategory === key
                        ? 'text-white'
                        : 'text-zinc-500 hover:text-zinc-300'}
                    `}
                  >
                    {isRu ? meta.name : meta.nameEn}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64 lg:w-80 flex-shrink-0">
                <input
                  type="text"
                  placeholder={isRu ? 'Искать...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-neon-acid/50 transition-colors"
                />
                <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-neon-acid" />
              </div>

            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="flex flex-col gap-16">
              {filteredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  isRu={isRu}
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

// Refactored Article Card for List View
const ArticleCard: React.FC<{
  article: BlogArticle;
  isRu: boolean;
  featured?: boolean;
  onClick: () => void;
}> = ({ article, isRu, featured, onClick }) => {
  const categoryMeta = CATEGORY_META[article.category as ArticleCategory];
  const imageUrl = getImageUrl(article.featuredImage, true);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer border-b border-white/10 pb-12 last:border-0"
    >
      <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12 items-start">

        {/* Left Content Column */}
        <div className="flex-1 flex flex-col items-start w-full">

          {/* Title - Bigger and bolder on desktop */}
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4 group-hover:text-neon-acid transition-colors leading-tight">
            {article.title}
          </h2>

          {/* Excerpt - Constrained width for readability */}
          <p className="text-zinc-400 text-sm md:text-base mb-6 line-clamp-3 md:line-clamp-4 leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>

          {/* Meta Information */}
          <div className="mt-auto flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <span className="text-neon-acid">
              // {isRu ? categoryMeta?.name : categoryMeta?.nameEn}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span className="flex items-center gap-2">
              <Calendar size={12} />
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
            <span className="hidden md:block w-1 h-1 rounded-full bg-zinc-800" />
            <span className="hidden md:flex items-center gap-2">
              <Clock size={12} />
              {article.readingTime} {isRu ? 'мин' : 'min'}
            </span>

            <div className="hidden md:flex items-center gap-2 text-white group-hover:text-neon-acid transition-colors ml-4">
              {isRu ? 'Читать' : 'Read'} <ArrowUpRight size={14} />
            </div>
          </div>
        </div>

        {/* Right Image Column */}
        <div className="w-full md:w-[45%] flex-shrink-0">
          <div className="aspect-[2/1] bg-zinc-900 overflow-hidden rounded-xl relative border border-white/10 group-hover:border-neon-acid/50 transition-colors">
            <BlogImage
              src={imageUrl}
              alt={article.featuredImageAlt}
              className="transform group-hover:scale-105 transition-transform duration-700"
            />
            {/* Mobile Category Badge (Overlay) */}
            <div className="md:hidden absolute top-3 left-3 z-20">
              <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono uppercase tracking-widest">
                {isRu ? categoryMeta?.name : categoryMeta?.nameEn}
              </span>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
};

export default BlogPage;
