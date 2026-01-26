import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Tag, ChevronLeft, Share2, Link2, CheckCircle, ArrowRight, ChevronRight, MessageSquare } from 'lucide-react';
import { useRouter, useParams } from '../lib/router';
import { useLanguage } from '../lib/i18n';
import { SEO } from './SEO';
import { Breadcrumbs } from './Breadcrumbs';
import { blogStore } from '../lib/blogStore';
import { useArticleTracking } from '../lib/useArticleTracking';
import {
  BlogArticle,
  BlogAuthor,
  CATEGORY_META,
  ArticleCategory,
  ContentBlock,
  ParagraphBlock,
  HeadingBlock,
  ImageBlock,
  QuoteBlock,
  CodeBlock,
  VideoBlock,
  ListBlock,
  CalloutBlock
} from '../lib/blogTypes';

// Render a single content block
const renderBlock = (block: ContentBlock, index: number): React.ReactNode => {
  switch (block.type) {
    case 'paragraph':
      return (
        <div
          key={block.id}
          className="text-zinc-300 leading-relaxed mb-6 text-lg"
          dangerouslySetInnerHTML={{ __html: block.content }}
        />
      );

    case 'heading':
      const HeadingTag = `h${block.level}` as 'h2' | 'h3' | 'h4';
      const headingClasses = {
        2: 'text-3xl md:text-4xl font-serif font-bold text-white mt-16 mb-8',
        3: 'text-2xl md:text-3xl font-serif font-bold text-white mt-12 mb-6',
        4: 'text-xl font-serif font-bold text-white mt-8 mb-4'
      };
      return (
        <HeadingTag key={block.id} className={headingClasses[block.level]}>
          {block.content}
        </HeadingTag>
      );

    case 'image':
      const widthClasses = {
        full: 'w-full',
        wide: 'w-full md:w-[120%] md:-ml-[10%]',
        normal: 'w-full'
      };
      return (
        <figure key={block.id} className="my-12">
          <div className={`${widthClasses[block.width || 'normal']} overflow-hidden rounded-2xl bg-zinc-900 border border-white/10`}>
            <img
              src={block.src}
              alt={block.alt}
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          {block.caption && (
            <figcaption className="text-center text-zinc-500 font-mono text-xs uppercase tracking-widest mt-4">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'quote':
      return (
        <blockquote key={block.id} className="relative my-12 pl-8 md:pl-12 border-l-2 border-neon-acid">
          <p className="text-2xl md:text-3xl font-serif italic text-white leading-relaxed">
            "{block.content}"
          </p>
          {(block.author || block.source) && (
            <footer className="mt-6 text-zinc-400 font-mono text-sm uppercase tracking-widest">
              {block.author && <span className="text-neon-acid">{block.author}</span>}
              {block.author && block.source && <span className="mx-2">•</span>}
              {block.source && <span>{block.source}</span>}
            </footer>
          )}
        </blockquote>
      );

    case 'code':
      return (
        <div key={block.id} className="my-10 bg-[#0d0d0d] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {(block.filename || block.language) && (
            <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
              <span className="text-neon-acid text-xs font-mono uppercase tracking-widest">{block.language}</span>
              {block.filename && <span className="text-zinc-500 text-xs font-mono">{block.filename}</span>}
            </div>
          )}
          <pre className="p-6 overflow-x-auto">
            <code className="text-sm text-zinc-300 font-mono leading-loose">{block.content}</code>
          </pre>
        </div>
      );

    case 'video':
      const getVideoEmbedUrl = (block: VideoBlock) => {
        switch (block.provider) {
          case 'youtube':
            return `https://www.youtube.com/embed/${block.videoId}`;
          case 'vimeo':
            return `https://player.vimeo.com/video/${block.videoId}`;
          case 'rutube':
            return `https://rutube.ru/play/embed/${block.videoId}`;
          default:
            return '';
        }
      };
      return (
        <figure key={block.id} className="my-12">
          <div className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src={getVideoEmbedUrl(block)}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
            />
          </div>
          {block.caption && (
            <figcaption className="text-center text-zinc-500 font-mono text-xs uppercase tracking-widest mt-4">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'list':
      const ListTag = block.style === 'numbered' ? 'ol' : 'ul';
      const listStyles = {
        bullet: 'space-y-4',
        numbered: 'list-decimal space-y-4 ml-6',
        check: 'space-y-4'
      };
      return (
        <ListTag key={block.id} className={`${listStyles[block.style]} my-8`}>
          {block.items.map((item, idx) => (
            <li key={idx} className="text-zinc-300 leading-relaxed text-lg flex items-start gap-4">
              {block.style === 'check' && (
                <div className="mt-1.5 flex-shrink-0 text-neon-acid">
                  <CheckCircle size={20} />
                </div>
              )}
              {block.style === 'bullet' && (
                <span className="mt-2.5 w-1.5 h-1.5 bg-zinc-600 rounded-full flex-shrink-0" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ListTag>
      );

    case 'callout':
      const calloutStyles = {
        info: 'bg-blue-500/10 border-blue-500/30 text-blue-200',
        warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200',
        success: 'bg-green-500/10 border-green-500/30 text-green-200',
        error: 'bg-red-500/10 border-red-500/30 text-red-200',
        tip: 'bg-neon-acid/5 border-neon-acid/30 text-white'
      };
      return (
        <div key={block.id} className={`p-6 md:p-8 my-10 rounded-2xl border ${calloutStyles[block.style]}`}>
          {block.title && (
            <div className="font-bold mb-3 flex items-center gap-2 font-mono uppercase tracking-widest text-sm opacity-80">
              {block.title}
            </div>
          )}
          <div className="leading-relaxed text-lg opacity-90">{block.content}</div>
        </div>
      );

    case 'divider':
      return (
        <div key={block.id} className="py-12 flex items-center justify-center gap-4 opacity-30">
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
      );

    default:
      return null;
  }
};

// Markdown renderer (fallback for old articles)
const renderMarkdown = (content: string): string => {
  return content
    // TL;DR Header - specific styling
    .replace(/^## TL;DR$/gim, '<div class="font-mono text-neon-acid text-xs uppercase tracking-widest mt-12 mb-4">// TL;DR</div>')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-serif font-bold text-white mt-12 mb-6">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-3xl md:text-4xl font-serif font-bold text-white mt-16 mb-8">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-4xl md:text-5xl font-serif font-bold text-white mt-20 mb-10">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-white">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em class="italic font-serif text-lg">$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-neon-acid border-b border-neon-acid/30 hover:border-neon-acid transition-colors" target="_blank" rel="noopener">$1</a>')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2 text-zinc-300 flex items-center gap-2"><span class="w-1 h-1 bg-zinc-500 rounded-full"></span>$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-2 text-zinc-300 list-decimal">$1</li>')
    // Tables
    // Tables - Process the whole block
    .replace(/((?:^\|.+\|(?:\r\n|\n|$))+)/gm, (match) => {
      const lines = match.trim().split(/\r\n|\n/);
      if (lines.length === 0) return '';

      let html = '<div class="overflow-x-auto my-12 -mx-4 md:mx-0 px-4 md:px-0"><table class="w-full text-left border-collapse min-w-[500px]">';

      lines.forEach((line, index) => {
        // Skip separator row (e.g. |---|---|)
        if (line.replace(/\|/g, '').trim().match(/^-+$/)) {
          return;
        }

        const cells = line.split('|').filter(c => c && c.trim() !== '');
        if (cells.length === 0) return;

        // Assume first row is header if it's the 0th index
        // (Simple heuristic, standard markdown writers usually put header first)
        const isHeaderRow = index === 0;
        const tag = isHeaderRow ? 'th' : 'td';
        const cellClass = isHeaderRow
          ? 'py-3 px-4 text-left font-mono text-xs uppercase tracking-widest text-zinc-500 border-b border-white/10 bg-white/5 whitespace-nowrap'
          : 'py-3 px-4 text-sm md:text-base text-zinc-300 border-b border-white/5 whitespace-nowrap';

        html += '<tr>';
        cells.forEach(cell => {
          html += `<${tag} class="${cellClass}">${cell.trim()}</${tag}>`;
        });
        html += '</tr>';
      });

      html += '</table></div>';
      return html;
    })
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/gim, '<pre class="bg-[#0d0d0d] border border-white/10 p-6 my-8 overflow-x-auto rounded-xl shadow-2xl"><code class="text-sm text-zinc-300">$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-white/10 px-2 py-1 text-neon-acid text-sm rounded">$1</code>')
    // Paragraphs
    .replace(/\n\n/gim, '</p><p class="text-zinc-300 leading-relaxed mb-6 text-lg">')
    // Line breaks
    .replace(/\n/gim, '<br>');
};

// Helper to fix image URL if it's just an ID (for schema generation)
const fixImageUrl = (url: string): string => {
  if (!url) return '/img/codexai-logo.png';
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidPattern.test(url)) {
    return `/api/images/${url}`;
  }
  return url;
};

// Generate Article Schema for AI citation
const generateArticleSchema = (article: BlogArticle, author: BlogAuthor | undefined) => {
  const imageUrl = fixImageUrl(article.featuredImage);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `https://codexai.pro/blog/${article.slug}`,
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: imageUrl.startsWith('http')
      ? imageUrl
      : `https://codexai.pro${imageUrl}`,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      '@id': `https://codexai.pro/team/${article.authorId}`,
      name: author?.name || 'CODEXAI Team',
      url: `https://codexai.pro/team/${article.authorId}`,
      jobTitle: author?.role,
      sameAs: author ? Object.values(author.social).filter(Boolean) : []
    },
    publisher: {
      '@type': 'Organization',
      '@id': 'https://codexai.pro/#organization',
      name: 'CODEXAI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://codexai.pro/img/codexai-logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://codexai.pro/blog/${article.slug}`
    },
    articleSection: CATEGORY_META[article.category as ArticleCategory]?.name,
    keywords: article.keywords.join(', '),
    wordCount: article.content.split(/\s+/).length,
    timeRequired: `PT${article.readingTime}M`,
    // For AI citation - key information
    about: article.keyTakeaways.map(t => ({
      '@type': 'Thing',
      name: t.title,
      description: t.description
    })),
    citation: article.stats?.map(s => ({
      '@type': 'CreativeWork',
      text: `${s.label}: ${s.value}`,
      author: s.source || 'CODEXAI'
    }))
  };
};

// Generate FAQ Schema
const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
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

export const ArticlePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { slug } = params as { slug?: string };
  const { lang } = useLanguage();
  const isRu = lang === 'ru';

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [author, setAuthor] = useState<BlogAuthor | undefined>();
  const [copied, setCopied] = useState(false);

  // Track article engagement
  const { trackShare } = useArticleTracking({
    articleId: article?.id || '',
    enabled: !!article
  });

  useEffect(() => {
    if (slug) {
      const found = blogStore.getArticleBySlug(slug);
      if (found) {
        setArticle(found);
        setAuthor(blogStore.getAuthor(found.authorId));
      }
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-12 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-acid/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">
            {isRu ? 'Статья не найдена' : 'Article not found'}
          </h1>
          <button
            onClick={() => router.push('/blog')}
            className="text-neon-acid hover:underline font-mono uppercase tracking-widest text-sm"
          >
            {isRu ? 'Вернуться в блог' : 'Back to blog'}
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { name: isRu ? 'Главная' : 'Home', url: '/' },
    { name: isRu ? 'Блог' : 'Blog', url: '/blog' },
    { name: article.title, url: `/blog/${article.slug}` }
  ];

  const categoryMeta = CATEGORY_META[article.category as ArticleCategory];

  // Helper to fix image URL if it's just an ID
  const getImageUrl = (url: string): string => {
    if (!url) return '/img/codexai-logo.png';
    // If it looks like a UUID (no slashes, 36 chars with dashes), prepend /api/images/
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(url)) {
      return `/api/images/${url}`;
    }
    return url;
  };

  const featuredImageUrl = getImageUrl(article.featuredImage);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://codexai.pro/blog/${article.slug}`);
    setCopied(true);
    trackShare(); // Track share event
    setTimeout(() => setCopied(false), 2000);
  };

  const faqsForSchema = article.faqs.map(f => ({
    question: f.question,
    answer: f.answer
  }));

  // Determine if we should use blocks or markdown
  const hasBlocks = article.blocks && article.blocks.length > 0;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pointer-events-none" />
      <div className="absolute -top-[10%] right-[10%] w-[800px] h-[800px] bg-neon-acid/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <SEO
        title={article.metaTitle || `${article.title} | CODEXAI`}
        description={article.metaDescription || article.excerpt}
        path={`/blog/${article.slug}`}
        image={featuredImageUrl}
        lang={lang}
        breadcrumbs={breadcrumbs}
        faqs={faqsForSchema}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleSchema(article, author))
        }}
      />

      <article className="relative z-10 pt-24 md:pt-24 pb-10 md:pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-12">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8 md:mb-16">
            <button
              onClick={() => router.push('/blog')}
              className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors md:hidden"
            >
              <div className="p-2 rounded-full border border-white/10 group-hover:border-neon-acid group-hover:bg-neon-acid group-hover:text-black transition-all">
                <ChevronLeft size={16} />
              </div>
              <span className="font-mono text-xs uppercase tracking-widest hidden md:inline-block">
                {isRu ? 'Назад в блог' : 'Back to blog'}
              </span>
            </button>

            <Breadcrumbs items={breadcrumbs} className="hidden md:flex" />

            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="p-3 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all"
                title={isRu ? 'Копировать ссылку' : 'Copy link'}
              >
                {copied ? <CheckCircle size={18} className="text-green-500" /> : <Link2 size={18} />}
              </button>
            </div>
          </div>

          {/* Header */}
          <header className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <span className="text-neon-acid font-mono text-xs uppercase tracking-widest">
                {isRu ? categoryMeta?.name : categoryMeta?.nameEn}
              </span>
            </div>

            <h1 className="text-3xl md:text-6xl font-serif font-bold text-white mb-4 md:mb-8 leading-tight">
              {article.title}
            </h1>

            {article.subtitle && (
              <p className="text-lg md:text-2xl text-zinc-400 mb-6 md:mb-10 max-w-2xl mx-auto leading-relaxed">
                {article.subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-zinc-500 font-mono uppercase tracking-widest">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-800">
                  <img
                    src={author?.avatar || '/img/codexai-logo.png'}
                    alt={author?.name || 'CODEXAI'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span>{author?.name || 'CODEXAI Team'}</span>
              </div>
              <span className="w-1 h-1 bg-zinc-700 rounded-full" />
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
              <span className="w-1 h-1 bg-zinc-700 rounded-full" />
              <span>{article.readingTime} {isRu ? 'мин' : 'min'}</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 md:mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
            <img
              src={featuredImageUrl}
              alt={article.featuredImageAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="max-w-3xl mx-auto">


            {/* Key Takeaways */}
            {article.keyTakeaways.length > 0 && (
              <div className="mb-16">
                <h3 className="font-mono text-zinc-500 text-xs uppercase tracking-widest mb-6">
                  {isRu ? 'Ключевые моменты' : 'Key Takeaways'}
                </h3>
                <div className="space-y-4">
                  {article.keyTakeaways.map((takeaway, idx) => (
                    <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 transition-colors">
                      <div className="mt-1 flex-shrink-0 text-neon-acid">
                        <div className="w-6 h-6 rounded-full border border-neon-acid/30 flex items-center justify-center bg-neon-acid/10">
                          <CheckCircle size={14} />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1 font-serif text-lg">{takeaway.title}</h4>
                        {takeaway.description && (
                          <p className="text-zinc-400 leading-relaxed">{takeaway.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-20">
              {hasBlocks ? (
                article.blocks!.map((block, index) => renderBlock(block, index))
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<div class="markdown-content">${renderMarkdown(article.content)}</div>`
                  }}
                />
              )}
            </div>

            {/* Statistics */}
            {article.stats && article.stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-20">
                {article.stats.map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 text-center group hover:border-neon-acid/50 transition-colors">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-serif group-hover:text-neon-acid transition-colors">{stat.value}</div>
                    <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-16 pt-8 border-t border-white/10">
                {article.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => router.push(`/blog?tag=${tag}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 text-sm hover:border-neon-acid hover:text-white transition-all"
                  >
                    <Tag size={12} />
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Author Box */}
            {author && (
              <div className="p-8 md:p-10 rounded-3xl bg-zinc-950 border border-white/10 mb-20">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 p-1">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-xs text-neon-acid uppercase tracking-widest mb-2">
                      {isRu ? 'Об авторе' : 'About Author'}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      {author.name}
                    </h3>
                    <p className="text-white/60 mb-6 leading-relaxed">
                      {author.bio}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      {author.social.telegram && (
                        <a href={author.social.telegram} target="_blank" rel="noopener" className="text-zinc-500 hover:text-white transition-colors">
                          Telegram
                        </a>
                      )}
                      {author.social.linkedin && (
                        <a href={author.social.linkedin} target="_blank" rel="noopener" className="text-zinc-500 hover:text-white transition-colors">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 p-10 md:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-acid/5 via-transparent to-neon-acid/5 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  {isRu ? 'Понравилась статья?' : 'Enjoyed the article?'}
                </h3>
                <p className="text-zinc-400 mb-8 max-w-lg mx-auto text-lg">
                  {isRu
                    ? 'Мы применяем эти знания на практике. Давайте обсудим, как мы можем помочь вашему бизнесу.'
                    : 'We apply this knowledge in practice. Let\'s discuss how we can help your business.'
                  }
                </p>
                <button
                  onClick={() => router.push('/request')}
                  className="px-8 py-4 bg-white text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-neon-acid transition-colors inline-flex items-center gap-2"
                >
                  {isRu ? 'Начать проект' : 'Start Project'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* FAQ Section */}
            {article.faqs.length > 0 && (
              <div className="mt-20 pt-16 border-t border-white/10">
                <h2 className="text-3xl font-serif font-bold text-white mb-10 text-center">
                  {isRu ? 'Часто задаваемые вопросы' : 'FAQ'}
                </h2>
                <div className="space-y-4">
                  {article.faqs.map((faq, idx) => (
                    <details
                      key={idx}
                      className="group bg-zinc-900/30 border border-white/5 rounded-2xl hover:bg-zinc-900/50 transition-all open:bg-zinc-900"
                    >
                      <summary className="p-6 cursor-pointer list-none flex items-center justify-between">
                        <span className="text-white font-medium pr-4 text-lg font-serif">{faq.question}</span>
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-open:bg-neon-acid group-open:text-black group-open:border-neon-acid transition-all">
                          <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                        </div>
                      </summary>
                      <div className="px-6 pb-8 pt-2 text-zinc-400 leading-relaxed text-lg">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;
