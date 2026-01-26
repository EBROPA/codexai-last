/**
 * Blog Types for CODEXAI
 * Optimized for SEO/GEO and AI citation
 * Block-based editor like VC.ru
 */

// Author type for E-E-A-T signals
export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    telegram?: string;
    linkedin?: string;
    twitter?: string;
  };
  expertise: string[];
}

// ============================================
// BLOCK-BASED CONTENT TYPES (like VC.ru)
// ============================================

export type ContentBlockType = 
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'quote'
  | 'code'
  | 'video'
  | 'list'
  | 'divider'
  | 'embed'
  | 'callout';

export interface BaseBlock {
  id: string;
  type: ContentBlockType;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string; // HTML content with formatting
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 2 | 3 | 4;
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  src: string;
  alt: string;
  caption?: string;
  width?: 'full' | 'wide' | 'normal';
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  content: string;
  author?: string;
  source?: string;
}

export interface CodeBlock extends BaseBlock {
  type: 'code';
  language: string;
  content: string;
  filename?: string;
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  provider: 'youtube' | 'vimeo' | 'rutube' | 'custom';
  videoId: string;
  caption?: string;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  style: 'bullet' | 'numbered' | 'check';
  items: string[];
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export interface EmbedBlock extends BaseBlock {
  type: 'embed';
  provider: 'telegram' | 'twitter' | 'codepen' | 'figma' | 'custom';
  url: string;
  html?: string;
}

export interface CalloutBlock extends BaseBlock {
  type: 'callout';
  style: 'info' | 'warning' | 'success' | 'error' | 'tip';
  title?: string;
  content: string;
}

export type ContentBlock = 
  | ParagraphBlock 
  | HeadingBlock 
  | ImageBlock 
  | QuoteBlock 
  | CodeBlock 
  | VideoBlock 
  | ListBlock 
  | DividerBlock
  | EmbedBlock
  | CalloutBlock;

// ============================================
// ARTICLE ANALYTICS
// ============================================

export interface ArticleAnalytics {
  articleId: string;
  views: number;
  uniqueViews: number;
  readComplete: number; // Number of users who read to the end
  avgReadTime: number; // Average time in seconds
  scrollDepth: {
    25: number;
    50: number;
    75: number;
    100: number;
  };
  shares: number;
  dailyStats: DailyArticleStat[];
}

export interface DailyArticleStat {
  date: string; // ISO date
  views: number;
  uniqueViews: number;
  readComplete: number;
}

export interface ViewEvent {
  articleId: string;
  sessionId: string;
  timestamp: string;
  scrollDepth: number;
  timeSpent: number;
  isComplete: boolean;
}

// Article category for topical authority
export type ArticleCategory = 
  | 'web-development'
  | 'telegram-bots'
  | 'ai-integration'
  | 'telegram-mini-apps'
  | 'seo'
  | 'case-study'
  | 'industry-insights'
  | 'tutorials';

// Article status
export type ArticleStatus = 'draft' | 'published' | 'archived';

// FAQ item for article (GEO optimization)
export interface ArticleFAQ {
  question: string;
  answer: string;
}

// Key takeaway for AI citation
export interface KeyTakeaway {
  title: string;
  description: string;
}

// Article statistics for Information Gain
export interface ArticleStat {
  label: string;
  value: string;
  source?: string;
}

// Main Article type with all SEO/GEO fields
export interface BlogArticle {
  id: string;
  slug: string;
  
  // Basic content
  title: string;
  subtitle?: string;
  excerpt: string; // 150-160 chars for meta description
  content: string; // Legacy Markdown content (kept for backward compatibility)
  blocks?: ContentBlock[]; // New block-based content
  
  // SEO fields (auto-generated if not set)
  metaTitle?: string; // Override for SEO title
  metaDescription?: string; // Override for meta description
  keywords: string[];
  canonicalUrl?: string;
  
  // GEO optimization fields (auto-generated if not set)
  tldr: string; // 40-60 words summary for AI (Answer Capsule)
  keyTakeaways: KeyTakeaway[]; // Bullet points for AI extraction
  faqs: ArticleFAQ[]; // FAQ for FAQPage schema
  stats?: ArticleStat[]; // Statistics for Information Gain
  
  // Categorization
  category: ArticleCategory;
  tags: string[];
  
  // Media
  featuredImage: string;
  featuredImageAlt: string;
  
  // Author & dates
  authorId: string;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  publishedAt?: string; // ISO date
  
  // Status
  status: ArticleStatus;
  
  // Engagement
  readingTime: number; // minutes
  views?: number;
  
  // Related content for internal linking
  relatedArticles?: string[]; // Article IDs
  relatedServices?: string[]; // Service slugs
  
  // Auto-generation flags
  autoSEO?: boolean; // If true, SEO fields are auto-generated
  autoGEO?: boolean; // If true, GEO fields are auto-generated
}

// Category metadata for SEO
export const CATEGORY_META: Record<ArticleCategory, { 
  name: string; 
  nameEn: string;
  description: string;
  descriptionEn: string;
}> = {
  'web-development': {
    name: 'Веб-разработка',
    nameEn: 'Web Development',
    description: 'Статьи о разработке сайтов, технологиях и лучших практиках',
    descriptionEn: 'Articles about website development, technologies and best practices'
  },
  'telegram-bots': {
    name: 'Telegram-боты',
    nameEn: 'Telegram Bots',
    description: 'Руководства и кейсы по разработке Telegram-ботов',
    descriptionEn: 'Guides and case studies on Telegram bot development'
  },
  'ai-integration': {
    name: 'AI и нейросети',
    nameEn: 'AI & Neural Networks',
    description: 'Внедрение искусственного интеллекта в бизнес',
    descriptionEn: 'Implementing artificial intelligence in business'
  },
  'telegram-mini-apps': {
    name: 'Telegram Mini Apps',
    nameEn: 'Telegram Mini Apps',
    description: 'Разработка приложений внутри Telegram',
    descriptionEn: 'Developing applications inside Telegram'
  },
  'seo': {
    name: 'SEO и продвижение',
    nameEn: 'SEO & Marketing',
    description: 'Оптимизация сайтов для поисковых систем',
    descriptionEn: 'Website optimization for search engines'
  },
  'case-study': {
    name: 'Кейсы',
    nameEn: 'Case Studies',
    description: 'Реальные проекты с результатами и метриками',
    descriptionEn: 'Real projects with results and metrics'
  },
  'industry-insights': {
    name: 'Аналитика рынка',
    nameEn: 'Industry Insights',
    description: 'Тренды и исследования digital-рынка',
    descriptionEn: 'Trends and research of the digital market'
  },
  'tutorials': {
    name: 'Туториалы',
    nameEn: 'Tutorials',
    description: 'Пошаговые инструкции и руководства',
    descriptionEn: 'Step-by-step instructions and guides'
  }
};

// Default authors
export const DEFAULT_AUTHORS: BlogAuthor[] = [
  {
    id: 'codexai-team',
    name: 'CODEXAI Team',
    role: 'Редакция',
    bio: 'Команда экспертов CODEXAI с опытом 7+ лет в веб-разработке, AI и digital-маркетинге. Делимся практическими знаниями и кейсами.',
    avatar: '/img/codexai-logo.png',
    social: {
      telegram: 'https://t.me/codexai_pro',
      linkedin: 'https://linkedin.com/company/codexai'
    },
    expertise: ['Web Development', 'AI Integration', 'Telegram Bots', 'SEO']
  }
];

// Helper to generate reading time
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Helper to generate slug
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[а-яё]/gi, (char) => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return map[char.toLowerCase()] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate block ID
export const generateBlockId = (): string => {
  return 'block_' + generateId();
};

// Convert blocks to plain text for processing
export const blocksToText = (blocks: ContentBlock[]): string => {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        // Strip HTML tags
        return block.content.replace(/<[^>]*>/g, '');
      case 'heading':
        return block.content;
      case 'quote':
        return block.content;
      case 'code':
        return block.content;
      case 'list':
        return block.items.join(' ');
      case 'callout':
        return (block.title || '') + ' ' + block.content;
      case 'image':
        return block.alt || '';
      default:
        return '';
    }
  }).join(' ').trim();
};

// Calculate reading time from blocks
export const calculateReadingTimeFromBlocks = (blocks: ContentBlock[]): number => {
  const text = blocksToText(blocks);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// ============================================
// AUTO SEO/GEO GENERATION
// ============================================

// Extract keywords from text using simple frequency analysis
export const extractKeywords = (text: string, maxKeywords = 10): string[] => {
  // Russian stop words
  const stopWords = new Set([
    'и', 'в', 'на', 'с', 'по', 'для', 'из', 'к', 'о', 'от', 'за', 'при', 'до',
    'как', 'что', 'это', 'все', 'так', 'но', 'же', 'ли', 'не', 'да', 'его', 'её',
    'их', 'мы', 'вы', 'они', 'он', 'она', 'оно', 'а', 'или', 'если', 'то', 'бы',
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may',
    'might', 'must', 'can', 'of', 'to', 'in', 'for', 'on', 'with', 'at', 'by',
    'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'again', 'further', 'then', 'once', 'also', 'very', 'just'
  ]);

  // Clean and tokenize
  const words = text.toLowerCase()
    .replace(/[^\wа-яё\s]/gi, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  // Count frequency
  const freq: Record<string, number> = {};
  words.forEach(word => {
    freq[word] = (freq[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

// Generate meta description from content
export const generateMetaDescription = (title: string, text: string, maxLength = 160): string => {
  // Try to find a good sentence that contains key info
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 30);
  
  if (sentences.length > 0) {
    // Find sentence that might contain prices or key info
    const keyPatterns = [/\d+\s*(₽|руб|рублей|тыс|млн)/i, /стоит|стоимость|цена/i, /от\s+\d+/i];
    for (const pattern of keyPatterns) {
      const match = sentences.find(s => pattern.test(s));
      if (match && match.trim().length <= maxLength) {
        return match.trim();
      }
    }
    
    // Otherwise use first sentence
    const firstSentence = sentences[0].trim();
    if (firstSentence.length <= maxLength) {
      return firstSentence;
    }
    return firstSentence.slice(0, maxLength - 3) + '...';
  }
  
  // Fallback: use title with some default text
  return `${title}. Узнайте подробности в статье от CODEXAI.`.slice(0, maxLength);
};

// Generate meta title
export const generateMetaTitle = (title: string, category: ArticleCategory, maxLength = 60): string => {
  const suffix = ' | CODEXAI';
  const maxTitleLength = maxLength - suffix.length;
  
  if (title.length <= maxTitleLength) {
    return title + suffix;
  }
  
  return title.slice(0, maxTitleLength - 3) + '...' + suffix;
};

// Generate TL;DR from content
export const generateTLDR = (title: string, blocks: ContentBlock[], targetWords = 50): string => {
  const text = blocksToText(blocks);
  if (!text.trim()) {
    return `${title}. Подробная информация в статье.`;
  }
  
  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 20);
  
  // Prioritize sentences with key information (prices, numbers, key terms)
  const keyPatterns = [/\d+\s*(₽|руб|рублей)/i, /от\s+\d+/i, /стоит|стоимость/i, /срок|дней|недел/i];
  const prioritySentences: string[] = [];
  const otherSentences: string[] = [];
  
  for (const sentence of sentences) {
    if (keyPatterns.some(p => p.test(sentence))) {
      prioritySentences.push(sentence.trim());
    } else {
      otherSentences.push(sentence.trim());
    }
  }
  
  const orderedSentences = [...prioritySentences, ...otherSentences];
  
  let tldr = '';
  let wordCount = 0;
  
  for (const sentence of orderedSentences.slice(0, 5)) {
    const sentenceWords = sentence.split(/\s+/).length;
    if (wordCount + sentenceWords <= targetWords + 10) {
      tldr += sentence + '. ';
      wordCount += sentenceWords;
    }
    if (wordCount >= targetWords - 10) break;
  }
  
  if (!tldr) {
    // Fallback - use first sentence
    return sentences[0] ? sentences[0].trim() + '.' : `${title}. Подробности в статье.`;
  }
  
  return tldr.trim();
};

// Generate key takeaways from content
export const generateKeyTakeaways = (blocks: ContentBlock[]): KeyTakeaway[] => {
  const takeaways: KeyTakeaway[] = [];
  
  // Find headings and use them as takeaway titles
  for (const block of blocks) {
    if (block.type === 'heading' && (block.level === 2 || block.level === 3)) {
      // Find the next paragraph for description
      const headingIndex = blocks.indexOf(block);
      const nextParagraph = blocks.slice(headingIndex + 1).find(b => b.type === 'paragraph') as ParagraphBlock | undefined;
      
      if (nextParagraph) {
        const description = nextParagraph.content.replace(/<[^>]*>/g, '').slice(0, 100);
        takeaways.push({
          title: block.content,
          description: description + (description.length >= 100 ? '...' : '')
        });
      }
      
      if (takeaways.length >= 5) break;
    }
  }
  
  // Also check for list blocks
  for (const block of blocks) {
    if (block.type === 'list' && takeaways.length < 5) {
      for (const item of block.items.slice(0, 5 - takeaways.length)) {
        if (item.length > 10) {
          takeaways.push({
            title: item.slice(0, 50) + (item.length > 50 ? '...' : ''),
            description: ''
          });
        }
      }
    }
  }
  
  return takeaways.slice(0, 5);
};

// Generate FAQ from content (based on headings and content)
export const generateFAQs = (title: string, blocks: ContentBlock[]): ArticleFAQ[] => {
  const faqs: ArticleFAQ[] = [];
  const text = blocksToText(blocks);
  
  if (!text.trim()) {
    return [{
      question: `Что такое ${title.slice(0, 50)}?`,
      answer: 'Подробная информация доступна в статье выше.'
    }];
  }
  
  // Extract title keywords for contextual questions
  const titleLower = title.toLowerCase();
  
  // Dynamic question templates based on content and title
  const questionTemplates = [
    { 
      pattern: /стоимость|цен[аы]|сколько стоит|бюджет|от\s+\d+.*₽/i, 
      question: titleLower.includes('стоит') || titleLower.includes('цен') 
        ? `Сколько стоит ${extractMainTopic(title)}?`
        : 'Какая стоимость услуги?' 
    },
    { 
      pattern: /срок[иа]?|время|дней|недел|месяц/i, 
      question: 'Сколько времени это займёт?' 
    },
    { 
      pattern: /гарант/i, 
      question: 'Какие гарантии предоставляются?' 
    },
    { 
      pattern: /включа|входит|состав/i, 
      question: 'Что входит в услугу?' 
    },
    { 
      pattern: /как\s+(работает|заказать|начать)/i, 
      question: 'Как начать работу?' 
    },
  ];
  
  // Generate contextual FAQs based on content
  for (const template of questionTemplates) {
    if (template.pattern.test(text) && faqs.length < 3) {
      const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 30 && template.pattern.test(s));
      if (sentences.length > 0) {
        let answer = sentences[0].trim();
        // Clean up answer
        if (answer.length > 250) {
          answer = answer.slice(0, 247) + '...';
        }
        faqs.push({
          question: template.question,
          answer: answer
        });
      }
    }
  }
  
  // Add question based on title if we don't have enough
  if (faqs.length < 2) {
    const mainTopic = extractMainTopic(title);
    const firstParagraph = text.split(/[.!?]/).slice(0, 2).join('. ').trim();
    faqs.push({
      question: `Что такое ${mainTopic}?`,
      answer: firstParagraph.length > 250 ? firstParagraph.slice(0, 247) + '...' : firstParagraph + '.'
    });
  }
  
  return faqs.slice(0, 5);
};

// Helper to extract main topic from title
const extractMainTopic = (title: string): string => {
  // Remove year and common prefixes
  const cleaned = title
    .replace(/в\s+\d{4}(\s+году?)?/gi, '')
    .replace(/^(как|что такое|зачем|почему|сколько стоит)\s+/i, '')
    .replace(/:\s+.+$/, '')
    .trim();
  
  // Return shortened version
  if (cleaned.length > 40) {
    return cleaned.slice(0, 37) + '...';
  }
  return cleaned.toLowerCase();
};

// Generate statistics from content
export const generateStats = (blocks: ContentBlock[]): ArticleStat[] => {
  const stats: ArticleStat[] = [];
  const text = blocksToText(blocks);
  
  // Find numbers with context
  const numberPatterns = [
    { pattern: /(\d+(?:\s*(?:000|тыс|млн))?)\s*(?:₽|руб|рублей)/gi, label: 'Стоимость' },
    { pattern: /(\d+)\s*(?:дней|недел|месяц)/gi, label: 'Срок' },
    { pattern: /(\d+)\s*%/gi, label: 'Показатель' },
    { pattern: /(\d+)\s*(?:проект|клиент|заказ)/gi, label: 'Опыт' },
  ];
  
  for (const { pattern, label } of numberPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 0 && stats.length < 4) {
      stats.push({
        label,
        value: matches[0],
        source: 'CODEXAI'
      });
    }
  }
  
  return stats;
};
