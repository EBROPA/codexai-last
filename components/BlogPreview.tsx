import React, { useEffect, useState, useRef } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useRouter } from '../lib/router';
import { useLanguage } from '../lib/i18n';
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

export const BlogPreview: React.FC = () => {
    const router = useRouter();
    const { lang } = useLanguage();
    const isRu = lang === 'ru';
    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get latest published articles (limit to 6 for the slider)
        const latest = blogStore.getPublishedArticles().slice(0, 6);
        setArticles(latest);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400; // Approx card width
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const targetScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (articles.length === 0) return null;

    return (
        <section className="py-24 md:py-32 bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-zinc-900/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
                {/* Header with Navigation */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-4">
                            {isRu ? 'Экспертные статьи,' : 'Expert Articles,'} <br />
                            <span className="text-zinc-500">
                                {isRu ? 'аналитика и новости' : 'analytics & news'}
                            </span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all active:scale-95"
                            aria-label="Previous articles"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-neon-acid hover:text-black hover:border-neon-acid transition-all active:scale-95"
                            aria-label="Next articles"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Articles Slider */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 -mx-4 px-4 md:-mx-12 md:px-12 scrollbar-none snap-x"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {articles.map((article) => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            isRu={isRu}
                            onClick={() => router.push(`/blog/${article.slug}`)}
                        />
                    ))}

                    {/* "See All" Card */}
                    <div
                        onClick={() => router.push('/blog')}
                        className="group min-w-[300px] md:min-w-[400px] aspect-[16/10] bg-zinc-900/50 border border-white/10 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-zinc-900 transition-colors snap-center"
                    >
                        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-neon-acid mb-4 group-hover:scale-110 transition-transform">
                            <ArrowUpRight size={32} />
                        </div>
                        <span className="font-serif text-xl font-bold text-white">
                            {isRu ? 'Все статьи' : 'All Articles'}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Helper to fix image URL if it's just an ID
// useThumbnail: true for list views (faster loading)
const getImageUrl = (url: string, useThumbnail: boolean = false): string => {
  if (!url) return '/img/codexai-logo.png';
  // If it looks like a UUID (no slashes, 36 chars with dashes), prepend /api/images/
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(url)) {
    return `/api/images/${url}${useThumbnail ? '?size=thumb' : ''}`;
  }
  return url;
};

// Blog Preview Image Component with instant display
const BlogPreviewImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(() => imageCache.has(src));
  const [hasError, setHasError] = useState(false);
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
        rootMargin: '300px' // Start loading 300px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Solid background - always visible immediately */}
      <div className="absolute inset-0 bg-zinc-800" />
      
      {/* Shimmer effect while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-shimmer" />
      )}
      
      {/* Actual image */}
      {!hasError && (
        <img
          src={isLoaded ? src : undefined}
          data-src={src}
          alt={alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={() => {
            imageCache.set(src, true);
            setIsLoaded(true);
          }}
          onError={() => setHasError(true)}
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

const ArticleCard: React.FC<{
    article: BlogArticle;
    isRu: boolean;
    onClick: () => void;
}> = ({ article, isRu, onClick }) => {
    const categoryMeta = CATEGORY_META[article.category as ArticleCategory];
    // Use thumbnail for faster loading in preview cards
    const featuredImageUrl = getImageUrl(article.featuredImage, true);

    return (
        <article
            onClick={onClick}
            className="group relative min-w-[320px] md:min-w-[450px] aspect-[16/10] rounded-3xl overflow-hidden cursor-pointer border border-white/10 snap-center"
        >
            {/* Background Image */}
            <BlogPreviewImage
                src={featuredImageUrl}
                alt={article.featuredImageAlt}
                className="transform group-hover:scale-105 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                {/* Top: Category */}
                <div className="flex justify-end">
                    <span className="font-mono text-neon-acid text-xs uppercase tracking-widest bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        {isRu ? categoryMeta?.name : categoryMeta?.nameEn}
                    </span>
                </div>

                {/* Bottom: Title & Arrow */}
                <div className="flex items-end justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight line-clamp-2 md:line-clamp-3 mb-2">
                            {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <Calendar size={12} />
                            <span>
                                {new Date(article.publishedAt || article.createdAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
                                    day: 'numeric',
                                    month: 'long'
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-neon-acid group-hover:text-black group-hover:border-neon-acid transition-all duration-300">
                        <ArrowUpRight size={20} className="transform group-hover:rotate-45 transition-transform" />
                    </div>
                </div>
            </div>
        </article>
    );
};
