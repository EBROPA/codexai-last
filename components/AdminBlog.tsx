import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Save, X, ChevronLeft,
  FileText, Calendar, Tag, Image, List, HelpCircle, BarChart3,
  CheckCircle, AlertCircle, Lock, TrendingUp, Users, Clock,
  Share2, Percent, Wand2, RefreshCw, BookOpen
} from 'lucide-react';
import { useRouter } from '../lib/router';
import { blogStore } from '../lib/blogStore';
import { analyticsStore } from '../lib/analyticsStore';
import {
  BlogArticle,
  BlogAuthor,
  ArticleCategory,
  CATEGORY_META,
  generateSlug,
  ArticleFAQ,
  KeyTakeaway,
  ArticleStat,
  ContentBlock,
  generateBlockId,
  blocksToText,
  calculateReadingTimeFromBlocks,
  extractKeywords,
  generateMetaDescription,
  generateMetaTitle,
  generateTLDR,
  generateKeyTakeaways,
  generateFAQs,
  generateStats,
  ArticleAnalytics
} from '../lib/blogTypes';
import { BlockEditor } from './BlockEditor';
import { ImageUploader } from './ImageUploader';

// Simple password protection (in production use proper auth)
const ADMIN_PASSWORD = 'codexai2026';

export const AdminBlog: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeView, setActiveView] = useState<'articles' | 'analytics'>('articles');

  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem('codexai_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadArticles();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('codexai_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Неверный пароль');
    }
  };

  const loadArticles = async () => {
    // Force refresh from API
    await blogStore.refresh();
    setArticles(blogStore.getAllArticles());
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingArticle({
      id: '',
      slug: '',
      title: '',
      subtitle: '',
      excerpt: '',
      content: '',
      blocks: [{ id: generateBlockId(), type: 'paragraph', content: '' }],
      keywords: [],
      tldr: '',
      keyTakeaways: [],
      faqs: [],
      stats: [],
      category: 'web-development',
      tags: [],
      featuredImage: '',
      featuredImageAlt: '',
      authorId: 'codexai-team',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      readingTime: 0,
      autoSEO: true,
      autoGEO: true
    });
  };

  const handleEdit = (article: BlogArticle) => {
    setIsCreating(false);
    // Convert old articles to block format if needed
    if (!article.blocks || article.blocks.length === 0) {
      article.blocks = [{ 
        id: generateBlockId(), 
        type: 'paragraph', 
        content: article.content 
      }];
    }
    setEditingArticle({ ...article });
  };

  const handleSave = async () => {
    if (!editingArticle) return;

    // Validate required fields
    if (!editingArticle.title.trim()) {
      alert('Введите заголовок статьи');
      return;
    }
    if (!editingArticle.slug.trim()) {
      alert('Введите URL (slug) статьи');
      return;
    }
    if (!editingArticle.excerpt.trim()) {
      alert('Введите краткое описание (excerpt)');
      return;
    }

    // Check if article has content
    const hasBlocks = editingArticle.blocks && editingArticle.blocks.length > 0 && 
      editingArticle.blocks.some(b => b.type === 'paragraph' && b.content?.trim());
    const hasContent = editingArticle.content?.trim();
    
    if (!hasBlocks && !hasContent) {
      alert('Добавьте контент статьи');
      return;
    }

    let articleToSave = { ...editingArticle };

    // Handle custom author creation
    if (editingArticle.authorId === 'custom') {
      const customName = (editingArticle as any).customAuthorName?.trim();
      if (!customName) {
        alert('Введите имя автора');
        return;
      }
      
      // Create new author
      const newAuthor = await blogStore.createAuthor({
        name: customName,
        role: (editingArticle as any).customAuthorRole || 'Автор',
        bio: '',
        avatar: (editingArticle as any).customAuthorAvatar || '/img/codexai-logo.png',
        social: {},
        expertise: []
      });
      
      articleToSave.authorId = newAuthor.id;
      // Remove custom fields
      delete (articleToSave as any).customAuthorName;
      delete (articleToSave as any).customAuthorRole;
      delete (articleToSave as any).customAuthorAvatar;
    }

    try {
      if (isCreating) {
        await blogStore.createArticle(articleToSave);
      } else {
        await blogStore.updateArticle(articleToSave.id, articleToSave);
      }

      setEditingArticle(null);
      setIsCreating(false);
      // Force reload from store
      setArticles([...blogStore.getAllArticles()]);
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Ошибка при сохранении статьи');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить статью? Это действие нельзя отменить.')) {
      const success = await blogStore.deleteArticle(id);
      if (success) {
        // Force reload from store
        setArticles([...blogStore.getAllArticles()]);
      } else {
        alert('Ошибка при удалении статьи');
      }
    }
  };

  const handlePublish = (id: string) => {
    const updated = blogStore.publishArticle(id);
    if (updated) {
      // Force reload from store to get fresh data
      setArticles([...blogStore.getAllArticles()]);
    }
  };

  const handleUnpublish = (id: string) => {
    const updated = blogStore.unpublishArticle(id);
    if (updated) {
      // Force reload from store to get fresh data
      setArticles([...blogStore.getAllArticles()]);
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-12 flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-950 border border-white/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-neon-acid" size={24} />
            <h1 className="text-2xl font-serif font-bold text-white">Админка блога</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                placeholder="Введите пароль"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={16} />
                {authError}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-neon-acid text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-white transition-colors"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Article editor
  if (editingArticle) {
    return (
      <ArticleEditor
        article={editingArticle}
        onChange={(update) => {
          if (typeof update === 'function') {
            setEditingArticle(prev => prev ? update(prev) : prev);
          } else {
            setEditingArticle(update);
          }
        }}
        onSave={handleSave}
        onCancel={() => {
          setEditingArticle(null);
          setIsCreating(false);
        }}
        isNew={isCreating}
      />
    );
  }

  // Main admin view
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center gap-2 text-zinc-500 hover:text-neon-acid transition-colors mb-4"
            >
              <ChevronLeft size={16} />
              На сайт
            </button>
            <h1 className="text-3xl font-serif font-bold text-white">
              Управление блогом
            </h1>
          </div>

          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-neon-acid text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Новая статья
          </button>
        </div>

        {/* View Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveView('articles')}
            className={`px-4 py-3 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors ${
              activeView === 'articles'
                ? 'border-neon-acid text-neon-acid'
                : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            Статьи
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-4 py-3 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors ${
              activeView === 'analytics'
                ? 'border-neon-acid text-neon-acid'
                : 'border-transparent text-zinc-500 hover:text-white'
            }`}
          >
            <BarChart3 size={16} className="inline mr-2" />
            Аналитика
          </button>
        </div>

        {activeView === 'articles' ? (
          <ArticlesList
            articles={articles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
          />
        ) : (
          <AnalyticsDashboard articles={articles} />
        )}
      </div>
    </div>
  );
};

// Articles List Component
const ArticlesList: React.FC<{
  articles: BlogArticle[];
  onEdit: (article: BlogArticle) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
}> = ({ articles, onEdit, onDelete, onPublish, onUnpublish }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePublishClick = async (id: string) => {
    setLoadingId(id);
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 100));
    onPublish(id);
    setLoadingId(null);
  };

  const handleUnpublishClick = async (id: string) => {
    setLoadingId(id);
    await new Promise(resolve => setTimeout(resolve, 100));
    onUnpublish(id);
    setLoadingId(null);
  };

  const handleDeleteClick = (id: string) => {
    onDelete(id);
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-950 border border-white/10 p-6">
          <div className="text-3xl font-bold text-neon-acid">{articles.length}</div>
          <div className="text-zinc-500 text-sm">Всего статей</div>
        </div>
        <div className="bg-zinc-950 border border-white/10 p-6">
          <div className="text-3xl font-bold text-green-500">
            {articles.filter(a => a.status === 'published').length}
          </div>
          <div className="text-zinc-500 text-sm">Опубликовано</div>
        </div>
        <div className="bg-zinc-950 border border-white/10 p-6">
          <div className="text-3xl font-bold text-yellow-500">
            {articles.filter(a => a.status === 'draft').length}
          </div>
          <div className="text-zinc-500 text-sm">Черновики</div>
        </div>
      </div>

      {/* Empty state */}
      {articles.length === 0 && (
        <div className="bg-zinc-950 border border-white/10 p-12 text-center">
          <FileText size={48} className="mx-auto text-zinc-700 mb-4" />
          <p className="text-zinc-500">Нет статей. Создайте первую статью!</p>
        </div>
      )}

      {/* Articles table */}
      {articles.length > 0 && (
        <div className="bg-zinc-950 border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 font-mono text-xs text-zinc-500 uppercase tracking-widest">Статья</th>
                  <th className="text-left p-4 font-mono text-xs text-zinc-500 uppercase tracking-widest">Категория</th>
                  <th className="text-left p-4 font-mono text-xs text-zinc-500 uppercase tracking-widest">Статус</th>
                  <th className="text-left p-4 font-mono text-xs text-zinc-500 uppercase tracking-widest">Просмотры</th>
                  <th className="text-left p-4 font-mono text-xs text-zinc-500 uppercase tracking-widest">Дата</th>
                  <th className="text-right p-4 font-mono text-xs text-zinc-500 uppercase tracking-widest">Действия</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => {
                  const analytics = analyticsStore.getArticleAnalytics(article.id);
                  const isLoading = loadingId === article.id;
                  return (
                    <tr key={article.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isLoading ? 'opacity-50' : ''}`}>
                      <td className="p-4">
                        <div className="text-white font-medium">{article.title || 'Без названия'}</div>
                        <div className="text-zinc-500 text-sm">/blog/{article.slug || 'no-slug'}</div>
                      </td>
                      <td className="p-4">
                        <span className="text-zinc-400 text-sm">
                          {CATEGORY_META[article.category as ArticleCategory]?.name || article.category}
                        </span>
                      </td>
                      <td className="p-4">
                        {article.status === 'published' ? (
                          <span className="flex items-center gap-1 text-green-500 text-sm">
                            <CheckCircle size={14} />
                            Опубликовано
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-500 text-sm">
                            <FileText size={14} />
                            Черновик
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-zinc-400 text-sm">
                          {analytics?.views || 0}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500 text-sm">
                        {new Date(article.updatedAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEdit(article)}
                            className="p-2 text-zinc-500 hover:text-neon-acid transition-colors"
                            title="Редактировать"
                            disabled={isLoading}
                          >
                            <Edit2 size={16} />
                          </button>
                          {article.status === 'published' ? (
                            <button
                              onClick={() => handleUnpublishClick(article.id)}
                              className="p-2 text-zinc-500 hover:text-yellow-500 transition-colors"
                              title="Снять с публикации"
                              disabled={isLoading}
                            >
                              <EyeOff size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublishClick(article.id)}
                              className="p-2 text-zinc-500 hover:text-green-500 transition-colors"
                              title="Опубликовать"
                              disabled={isLoading}
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(article.id)}
                            className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                            title="Удалить"
                            disabled={isLoading}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

// Analytics Dashboard Component
const AnalyticsDashboard: React.FC<{ articles: BlogArticle[] }> = ({ articles }) => {
  const totalStats = analyticsStore.getTotalStats();
  const dailyStats = analyticsStore.getDailyStats(14);

  // Get top articles by views
  const articlesWithAnalytics = articles.map(article => ({
    article,
    analytics: analyticsStore.getArticleAnalytics(article.id)
  })).sort((a, b) => (b.analytics?.views || 0) - (a.analytics?.views || 0));

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-zinc-950 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
            <Eye size={16} />
            Всего просмотров
          </div>
          <div className="text-3xl font-bold text-white">{totalStats.totalViews}</div>
        </div>
        <div className="bg-zinc-950 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
            <Users size={16} />
            Уникальных
          </div>
          <div className="text-3xl font-bold text-white">{totalStats.totalUniqueViews}</div>
        </div>
        <div className="bg-zinc-950 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
            <BookOpen size={16} />
            Дочитали
          </div>
          <div className="text-3xl font-bold text-neon-acid">{totalStats.totalReadComplete}</div>
        </div>
        <div className="bg-zinc-950 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
            <Clock size={16} />
            Среднее время
          </div>
          <div className="text-3xl font-bold text-white">
            {Math.floor(totalStats.avgReadTime / 60)}:{String(totalStats.avgReadTime % 60).padStart(2, '0')}
          </div>
        </div>
        <div className="bg-zinc-950 border border-white/10 p-6">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
            <Share2 size={16} />
            Репосты
          </div>
          <div className="text-3xl font-bold text-white">{totalStats.totalShares}</div>
        </div>
      </div>

      {/* Daily Chart */}
      <div className="bg-zinc-950 border border-white/10 p-6">
        <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">
          Просмотры за 14 дней
        </h3>
        <div className="h-40 flex items-end gap-1">
          {dailyStats.map((day, idx) => {
            const maxViews = Math.max(...dailyStats.map(d => d.views), 1);
            const height = (day.views / maxViews) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-neon-acid/30 hover:bg-neon-acid/50 transition-colors rounded-t"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${day.date}: ${day.views} просмотров`}
                />
                {idx % 2 === 0 && (
                  <div className="text-zinc-600 text-xs mt-2 rotate-45 origin-left">
                    {new Date(day.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Articles */}
      <div className="bg-zinc-950 border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            Топ статей по просмотрам
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {articlesWithAnalytics.slice(0, 10).map(({ article, analytics }, idx) => {
            const readRate = analytics && analytics.uniqueViews > 0
              ? Math.round((analytics.readComplete / analytics.uniqueViews) * 100)
              : 0;
            
            return (
              <div key={article.id} className="p-4 flex items-center gap-4">
                <div className="text-2xl font-bold text-zinc-700 w-8">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium">{article.title}</div>
                  <div className="text-zinc-500 text-sm">
                    {CATEGORY_META[article.category as ArticleCategory]?.name}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{analytics?.views || 0} просмотров</div>
                  <div className="text-zinc-500 text-sm flex items-center gap-1 justify-end">
                    <Percent size={12} />
                    {readRate}% дочитали
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Article Analytics */}
      <div className="bg-zinc-950 border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h3 className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            Детальная статистика
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-zinc-500 text-xs uppercase">Статья</th>
                <th className="text-right p-4 text-zinc-500 text-xs uppercase">Просмотры</th>
                <th className="text-right p-4 text-zinc-500 text-xs uppercase">Уникальные</th>
                <th className="text-right p-4 text-zinc-500 text-xs uppercase">Дочитали</th>
                <th className="text-right p-4 text-zinc-500 text-xs uppercase">% дочитывания</th>
                <th className="text-right p-4 text-zinc-500 text-xs uppercase">Ср. время</th>
                <th className="text-right p-4 text-zinc-500 text-xs uppercase">Scroll 50%</th>
                <th className="text-right p-4 text-zinc-500 text-xs uppercase">Scroll 100%</th>
              </tr>
            </thead>
            <tbody>
              {articlesWithAnalytics.map(({ article, analytics }) => {
                const readRate = analytics && analytics.uniqueViews > 0
                  ? Math.round((analytics.readComplete / analytics.uniqueViews) * 100)
                  : 0;
                
                return (
                  <tr key={article.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="text-white text-sm max-w-xs truncate">{article.title}</div>
                    </td>
                    <td className="p-4 text-right text-white">{analytics?.views || 0}</td>
                    <td className="p-4 text-right text-zinc-400">{analytics?.uniqueViews || 0}</td>
                    <td className="p-4 text-right text-neon-acid">{analytics?.readComplete || 0}</td>
                    <td className="p-4 text-right">
                      <span className={readRate > 50 ? 'text-green-500' : readRate > 25 ? 'text-yellow-500' : 'text-red-500'}>
                        {readRate}%
                      </span>
                    </td>
                    <td className="p-4 text-right text-zinc-400">
                      {analytics?.avgReadTime ? `${Math.floor(analytics.avgReadTime / 60)}:${String(analytics.avgReadTime % 60).padStart(2, '0')}` : '-'}
                    </td>
                    <td className="p-4 text-right text-zinc-400">{analytics?.scrollDepth?.[50] || 0}</td>
                    <td className="p-4 text-right text-zinc-400">{analytics?.scrollDepth?.[100] || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Article Editor Component
const ArticleEditor: React.FC<{
  article: BlogArticle;
  onChange: (article: BlogArticle | ((prev: BlogArticle) => BlogArticle)) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew: boolean;
}> = ({ article, onChange, onSave, onCancel, isNew }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'geo'>('content');
  // Determine initial editor mode based on article content:
  // - If article has blocks with content -> use block editor
  // - If article has markdown content but no blocks -> use markdown editor
  // - For new articles -> default to block editor
  const hasBlocks = article.blocks && article.blocks.length > 0;
  const hasMarkdownContent = article.content && article.content.trim().length > 0;
  const initialUseBlockEditor = isNew ? true : (hasBlocks || !hasMarkdownContent);
  const [useBlockEditor, setUseBlockEditor] = useState(initialUseBlockEditor);

  const updateField = <K extends keyof BlogArticle>(field: K, value: BlogArticle[K]) => {
    console.log('[AdminBlog] updateField:', field, value);
    // Use functional update to avoid stale closure
    onChange((prev: BlogArticle) => ({ ...prev, [field]: value }));
  };

  const updateBlocks = (blocks: ContentBlock[]) => {
    const readingTime = calculateReadingTimeFromBlocks(blocks);
    onChange((prev: BlogArticle) => ({ ...prev, blocks, readingTime }));
  };

  // Auto-generate SEO fields with improved logic
  const generateSEO = () => {
    if (!article.title) {
      alert('Сначала введите заголовок статьи');
      return;
    }

    const text = article.blocks && article.blocks.length > 0 
      ? blocksToText(article.blocks) 
      : article.content || '';
    
    if (!text.trim()) {
      alert('Сначала добавьте контент статьи');
      return;
    }

    // Generate keywords from title + content
    const titleWords = article.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const contentKeywords = extractKeywords(text, 8);
    const keywords = [...new Set([...titleWords.slice(0, 3), ...contentKeywords])].slice(0, 10);
    
    // Generate meta description - prioritize excerpt if available
    let metaDescription = article.excerpt || generateMetaDescription(article.title, text);
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.slice(0, 157) + '...';
    }
    
    const metaTitle = article.title;

    onChange({
      ...article,
      keywords,
      metaDescription,
      metaTitle,
      autoSEO: true
    });
  };

  // Auto-generate GEO fields with improved logic
  const generateGEO = () => {
    if (!article.title) {
      alert('Сначала введите заголовок статьи');
      return;
    }

    const text = article.blocks && article.blocks.length > 0 
      ? blocksToText(article.blocks) 
      : article.content || '';
    
    if (!text.trim()) {
      alert('Сначала добавьте контент статьи');
      return;
    }

    // Generate TL;DR - use excerpt as base if available
    let tldr = article.excerpt || '';
    if (!tldr || tldr.length < 50) {
      tldr = generateTLDR(article.title, article.blocks || []);
    }
    
    // Generate key takeaways
    const keyTakeaways = article.keyTakeaways.length > 0 
      ? article.keyTakeaways 
      : generateKeyTakeaways(article.blocks || []);
    
    // Generate FAQs
    const faqs = article.faqs.length > 0 
      ? article.faqs 
      : generateFAQs(article.title, article.blocks || []);
    
    // Generate stats
    const stats = (article.stats && article.stats.length > 0) 
      ? article.stats 
      : generateStats(article.blocks || []);

    onChange({
      ...article,
      tldr,
      keyTakeaways,
      faqs,
      stats,
      autoGEO: true
    });
  };

  // Generate all automatically with validation
  const generateAll = () => {
    if (!article.title) {
      alert('Сначала введите заголовок статьи');
      return;
    }

    const text = article.blocks && article.blocks.length > 0 
      ? blocksToText(article.blocks) 
      : article.content || '';
    
    if (!text.trim()) {
      alert('Сначала добавьте контент статьи');
      return;
    }

    // Generate keywords
    const titleWords = article.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const contentKeywords = extractKeywords(text, 8);
    const keywords = [...new Set([...titleWords.slice(0, 3), ...contentKeywords])].slice(0, 10);
    
    // Generate meta description
    let metaDescription = article.excerpt || generateMetaDescription(article.title, text);
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.slice(0, 157) + '...';
    }

    // Generate TL;DR
    let tldr = article.excerpt || generateTLDR(article.title, article.blocks || []);
    
    // Generate key takeaways (only if empty)
    const keyTakeaways = article.keyTakeaways.length > 0 
      ? article.keyTakeaways 
      : generateKeyTakeaways(article.blocks || []);
    
    // Generate FAQs (only if empty)
    const faqs = article.faqs.length > 0 
      ? article.faqs 
      : generateFAQs(article.title, article.blocks || []);
    
    // Generate stats (only if empty)
    const stats = (article.stats && article.stats.length > 0) 
      ? article.stats 
      : generateStats(article.blocks || []);

    onChange({
      ...article,
      keywords,
      metaDescription,
      metaTitle: article.title,
      tldr,
      keyTakeaways,
      faqs,
      stats,
      autoSEO: true,
      autoGEO: true
    });
  };

  const addFAQ = () => {
    updateField('faqs', [...article.faqs, { question: '', answer: '' }]);
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...article.faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    updateField('faqs', newFaqs);
  };

  const removeFAQ = (index: number) => {
    updateField('faqs', article.faqs.filter((_, i) => i !== index));
  };

  const addKeyTakeaway = () => {
    updateField('keyTakeaways', [...article.keyTakeaways, { title: '', description: '' }]);
  };

  const updateKeyTakeaway = (index: number, field: 'title' | 'description', value: string) => {
    const newTakeaways = [...article.keyTakeaways];
    newTakeaways[index] = { ...newTakeaways[index], [field]: value };
    updateField('keyTakeaways', newTakeaways);
  };

  const removeKeyTakeaway = (index: number) => {
    updateField('keyTakeaways', article.keyTakeaways.filter((_, i) => i !== index));
  };

  const addStat = () => {
    updateField('stats', [...(article.stats || []), { label: '', value: '', source: '' }]);
  };

  const updateStat = (index: number, field: 'label' | 'value' | 'source', value: string) => {
    const newStats = [...(article.stats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    updateField('stats', newStats);
  };

  const removeStat = (index: number) => {
    updateField('stats', (article.stats || []).filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h1 className="text-2xl font-serif font-bold text-white">
              {isNew ? 'Новая статья' : 'Редактирование'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Auto-generate button */}
            <button
              onClick={generateAll}
              className="px-4 py-2 bg-zinc-800 text-neon-acid font-mono text-sm hover:bg-zinc-700 transition-colors flex items-center gap-2"
              title="Авто-генерация SEO и GEO"
            >
              <Wand2 size={16} />
              Авто SEO/GEO
            </button>

            <button
              onClick={onSave}
              className="px-6 py-3 bg-neon-acid text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Сохранить
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-3 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'content'
                ? 'border-neon-acid text-neon-acid'
                : 'border-transparent text-zinc-500 hover:text-white'
              }`}
          >
            <FileText size={16} className="inline mr-2" />
            Контент
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-3 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'seo'
                ? 'border-neon-acid text-neon-acid'
                : 'border-transparent text-zinc-500 hover:text-white'
              }`}
          >
            <Tag size={16} className="inline mr-2" />
            SEO
            {article.autoSEO && <span className="ml-2 text-xs bg-neon-acid/20 text-neon-acid px-1 rounded">AUTO</span>}
          </button>
          <button
            onClick={() => setActiveTab('geo')}
            className={`px-4 py-3 font-mono text-sm uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'geo'
                ? 'border-neon-acid text-neon-acid'
                : 'border-transparent text-zinc-500 hover:text-white'
              }`}
          >
            <BarChart3 size={16} className="inline mr-2" />
            GEO (для AI)
            {article.autoGEO && <span className="ml-2 text-xs bg-neon-acid/20 text-neon-acid px-1 rounded">AUTO</span>}
          </button>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Заголовок статьи *</label>
              <input
                type="text"
                value={article.title}
                onChange={(e) => updateField('title', e.target.value)}
                onBlur={(e) => {
                  // Generate slug only if empty and this is a new article
                  if (isNew && !article.slug && e.target.value) {
                    updateField('slug', generateSlug(e.target.value));
                  }
                }}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white text-xl focus:border-neon-acid focus:outline-none"
                placeholder="Заголовок статьи"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Подзаголовок</label>
              <input
                type="text"
                value={article.subtitle || ''}
                onChange={(e) => updateField('subtitle', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                placeholder="Дополнительный подзаголовок"
              />
            </div>

            {/* Category, Slug & Author */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-2">Категория *</label>
                <select
                  value={article.category}
                  onChange={(e) => updateField('category', e.target.value as ArticleCategory)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                >
                  {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <option key={key} value={key}>{meta.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">URL (slug)</label>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => updateField('slug', e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                  placeholder="url-statyi"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-2">Автор</label>
                <select
                  value={article.authorId}
                  onChange={(e) => updateField('authorId', e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                >
                  {blogStore.getAuthors().map((author) => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))}
                  <option value="custom">+ Добавить автора</option>
                </select>
              </div>
            </div>

            {/* Custom Author Fields */}
            {article.authorId === 'custom' && (
              <div className="p-4 bg-zinc-900/50 border border-white/10 rounded space-y-4">
                <p className="text-zinc-400 text-sm">Новый автор (будет сохранён автоматически)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 text-xs mb-1">Имя автора *</label>
                    <input
                      type="text"
                      value={(article as any).customAuthorName || ''}
                      onChange={(e) => updateField('customAuthorName' as any, e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/10 text-white text-sm focus:border-neon-acid focus:outline-none"
                      placeholder="Иван Петров"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-xs mb-1">Должность</label>
                    <input
                      type="text"
                      value={(article as any).customAuthorRole || ''}
                      onChange={(e) => updateField('customAuthorRole' as any, e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-white/10 text-white text-sm focus:border-neon-acid focus:outline-none"
                      placeholder="Senior Developer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-zinc-500 text-xs mb-1">Аватар (URL)</label>
                  <input
                    type="text"
                    value={(article as any).customAuthorAvatar || ''}
                    onChange={(e) => updateField('customAuthorAvatar' as any, e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 text-white text-sm focus:border-neon-acid focus:outline-none"
                    placeholder="https://example.com/avatar.jpg или /img/avatar.png"
                  />
                </div>
              </div>
            )}

            {/* Excerpt */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                Краткое описание (excerpt) * <span className="text-zinc-600">150-160 символов</span>
              </label>
              <textarea
                value={article.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none h-24 resize-none"
                placeholder="Краткое описание для превью"
                maxLength={200}
              />
              <div className="text-xs text-zinc-600 mt-1">{article.excerpt.length}/160</div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Главное изображение</label>
              <ImageUploader
                value={article.featuredImage}
                onChange={(url) => updateField('featuredImage', url)}
                onAltChange={(alt) => updateField('featuredImageAlt', alt)}
                alt={article.featuredImageAlt}
                placeholder="Upload featured image"
              />
              {article.featuredImage && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={article.featuredImageAlt}
                    onChange={(e) => updateField('featuredImageAlt', e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-white/10 text-white text-sm focus:border-neon-acid focus:outline-none"
                    placeholder="Alt text for SEO..."
                  />
                </div>
              )}
            </div>

            {/* Editor Mode Toggle */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6">
              <label className="block text-zinc-400 text-sm">Режим редактора</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!useBlockEditor) {
                      // Switching to block editor - clear markdown content so blocks will be used
                      updateField('content', '');
                    }
                    setUseBlockEditor(true);
                  }}
                  className={`px-4 py-2 text-sm font-mono ${
                    useBlockEditor
                      ? 'bg-neon-acid text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  } transition-colors`}
                >
                  Блочный (как VC)
                </button>
                <button
                  onClick={() => {
                    if (useBlockEditor) {
                      // Switching to markdown editor - clear blocks so markdown content will be used
                      updateField('blocks', []);
                    }
                    setUseBlockEditor(false);
                  }}
                  className={`px-4 py-2 text-sm font-mono ${
                    !useBlockEditor
                      ? 'bg-neon-acid text-black'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  } transition-colors`}
                >
                  Markdown
                </button>
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-zinc-400 text-sm mb-4">
                Контент *
              </label>
              
              {useBlockEditor ? (
                <div className="bg-zinc-900 border border-white/10 p-6 min-h-[400px]">
                  <BlockEditor
                    blocks={article.blocks || []}
                    onChange={updateBlocks}
                  />
                </div>
              ) : (
                <>
                  <textarea
                    value={article.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white font-mono text-sm focus:border-neon-acid focus:outline-none h-96 resize-y"
                    placeholder="# Заголовок&#10;&#10;Текст статьи..."
                  />
                  <div className="text-xs text-zinc-600 mt-1">
                    Поддерживается: # заголовки, **жирный**, *курсив*, [ссылки](url), списки, таблицы
                  </div>
                </>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Теги (через запятую)</label>
              <input
                type="text"
                value={article.tags.join(', ')}
                onChange={(e) => updateField('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                placeholder="разработка, сайты, цены"
              />
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-4 text-zinc-500 text-sm border-t border-white/10 pt-4">
              <span>Время чтения: {article.readingTime} мин</span>
              {article.blocks && (
                <span>Блоков: {article.blocks.length}</span>
              )}
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-zinc-900 border border-white/10 p-4">
              <span className="text-sm text-zinc-400">
                {article.autoSEO 
                  ? 'SEO-поля сгенерированы автоматически. Вы можете отредактировать их.' 
                  : 'Заполните вручную или нажмите кнопку для автогенерации'}
              </span>
              <button
                onClick={generateSEO}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-neon-acid text-sm hover:bg-zinc-700 transition-colors"
              >
                <RefreshCw size={14} />
                Сгенерировать SEO
              </button>
            </div>

            {/* Meta Title */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                Meta Title <span className="text-zinc-600">50-60 символов</span>
              </label>
              <input
                type="text"
                value={article.metaTitle || ''}
                onChange={(e) => updateField('metaTitle', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                placeholder={article.title}
              />
              <div className="text-xs text-zinc-600 mt-1">{(article.metaTitle || article.title).length}/60</div>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                Meta Description <span className="text-zinc-600">150-160 символов</span>
              </label>
              <textarea
                value={article.metaDescription || ''}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none h-24 resize-none"
                placeholder={article.excerpt}
              />
              <div className="text-xs text-zinc-600 mt-1">{(article.metaDescription || article.excerpt).length}/160</div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Keywords (через запятую)</label>
              <input
                type="text"
                value={article.keywords.join(', ')}
                onChange={(e) => updateField('keywords', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                placeholder="стоимость сайта, цена разработки"
              />
            </div>

            {/* Preview */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">Превью в поиске Google</label>
              <div className="bg-white p-4 rounded">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {article.metaTitle || article.title} | CODEXAI
                </div>
                <div className="text-green-700 text-sm">
                  codexai.pro/blog/{article.slug}
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  {article.metaDescription || article.excerpt}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GEO Tab (AI Optimization) */}
        {activeTab === 'geo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-neon-acid/10 border border-neon-acid/20 p-4">
              <span className="text-sm text-neon-acid">
                {article.autoGEO 
                  ? 'GEO-поля сгенерированы автоматически для оптимизации под AI (ChatGPT, Claude, Perplexity)' 
                  : 'GEO-поля оптимизируют статью для цитирования в AI-ассистентах'}
              </span>
              <button
                onClick={generateGEO}
                className="flex items-center gap-2 px-3 py-1.5 bg-neon-acid/20 text-neon-acid text-sm hover:bg-neon-acid/30 transition-colors"
              >
                <RefreshCw size={14} />
                Сгенерировать GEO
              </button>
            </div>

            {/* TL;DR */}
            <div>
              <label className="block text-zinc-400 text-sm mb-2">
                TL;DR (Answer Capsule) * <span className="text-zinc-600">40-60 слов — прямой ответ для AI</span>
              </label>
              <textarea
                value={article.tldr}
                onChange={(e) => updateField('tldr', e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none h-32 resize-none"
                placeholder="Прямой ответ на главный вопрос статьи. AI будет цитировать именно этот блок."
              />
              <div className="text-xs text-zinc-600 mt-1">
                {article.tldr.split(/\s+/).filter(Boolean).length} слов (рекомендуется 40-60)
              </div>
            </div>

            {/* Key Takeaways */}
            <div>
              <label className="flex items-center justify-between text-zinc-400 text-sm mb-2">
                <span>Key Takeaways (Ключевые выводы)</span>
                <button
                  onClick={addKeyTakeaway}
                  className="text-neon-acid hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </label>
              <div className="space-y-3">
                {article.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={takeaway.title}
                      onChange={(e) => updateKeyTakeaway(idx, 'title', e.target.value)}
                      className="flex-1 px-4 py-2 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                      placeholder="Заголовок"
                    />
                    <input
                      type="text"
                      value={takeaway.description}
                      onChange={(e) => updateKeyTakeaway(idx, 'description', e.target.value)}
                      className="flex-1 px-4 py-2 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                      placeholder="Описание"
                    />
                    <button
                      onClick={() => removeKeyTakeaway(idx)}
                      className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div>
              <label className="flex items-center justify-between text-zinc-400 text-sm mb-2">
                <span>FAQ (для FAQPage schema)</span>
                <button
                  onClick={addFAQ}
                  className="text-neon-acid hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </label>
              <div className="space-y-4">
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-white/10 p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-zinc-500 text-xs">Вопрос {idx + 1}</span>
                      <button
                        onClick={() => removeFAQ(idx)}
                        className="text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFAQ(idx, 'question', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-white/10 text-white focus:border-neon-acid focus:outline-none mb-2"
                      placeholder="Вопрос"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFAQ(idx, 'answer', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-800 border border-white/10 text-white focus:border-neon-acid focus:outline-none h-20 resize-none"
                      placeholder="Ответ (40-60 слов, прямой и конкретный)"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div>
              <label className="flex items-center justify-between text-zinc-400 text-sm mb-2">
                <span>Статистика (Information Gain)</span>
                <button
                  onClick={addStat}
                  className="text-neon-acid hover:text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </label>
              <div className="space-y-3">
                {(article.stats || []).map((stat, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(idx, 'label', e.target.value)}
                      className="flex-1 px-4 py-2 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                      placeholder="Метрика"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(idx, 'value', e.target.value)}
                      className="w-32 px-4 py-2 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                      placeholder="Значение"
                    />
                    <input
                      type="text"
                      value={stat.source || ''}
                      onChange={(e) => updateStat(idx, 'source', e.target.value)}
                      className="flex-1 px-4 py-2 bg-zinc-900 border border-white/10 text-white focus:border-neon-acid focus:outline-none"
                      placeholder="Источник"
                    />
                    <button
                      onClick={() => removeStat(idx)}
                      className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlog;
