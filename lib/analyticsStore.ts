/**
 * Analytics Store - tracking article views and engagement
 */

import { ArticleAnalytics, DailyArticleStat, ViewEvent, generateId } from './blogTypes';

const ANALYTICS_KEY = 'codexai_blog_analytics';
const EVENTS_KEY = 'codexai_blog_events';
const SESSION_KEY = 'codexai_session_id';

class AnalyticsStore {
  private analytics: Map<string, ArticleAnalytics> = new Map();
  private events: ViewEvent[] = [];
  private sessionId: string = '';
  private initialized = false;

  init() {
    if (this.initialized) return;

    if (typeof window !== 'undefined') {
      // Load analytics
      const savedAnalytics = localStorage.getItem(ANALYTICS_KEY);
      if (savedAnalytics) {
        const parsed = JSON.parse(savedAnalytics);
        Object.entries(parsed).forEach(([key, value]) => {
          this.analytics.set(key, value as ArticleAnalytics);
        });
      }

      // Load events
      const savedEvents = localStorage.getItem(EVENTS_KEY);
      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      }

      // Get or create session ID
      let sessionId = sessionStorage.getItem(SESSION_KEY);
      if (!sessionId) {
        sessionId = generateId();
        sessionStorage.setItem(SESSION_KEY, sessionId);
      }
      this.sessionId = sessionId;
    }

    this.initialized = true;
  }

  private save() {
    if (typeof window !== 'undefined') {
      const analyticsObj: Record<string, ArticleAnalytics> = {};
      this.analytics.forEach((value, key) => {
        analyticsObj[key] = value;
      });
      localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analyticsObj));
      localStorage.setItem(EVENTS_KEY, JSON.stringify(this.events.slice(-1000))); // Keep last 1000 events
    }
  }

  getSessionId(): string {
    this.init();
    return this.sessionId;
  }

  // Track a view event
  trackView(articleId: string): void {
    this.init();

    let analytics = this.analytics.get(articleId);
    if (!analytics) {
      analytics = this.createEmptyAnalytics(articleId);
    }

    // Check if this session already viewed
    const today = new Date().toISOString().split('T')[0];
    const existingEvent = this.events.find(
      e => e.articleId === articleId && e.sessionId === this.sessionId && e.timestamp.startsWith(today)
    );

    analytics.views++;
    
    if (!existingEvent) {
      analytics.uniqueViews++;
      
      // Update daily stats
      let dailyStat = analytics.dailyStats.find(d => d.date === today);
      if (!dailyStat) {
        dailyStat = { date: today, views: 0, uniqueViews: 0, readComplete: 0 };
        analytics.dailyStats.push(dailyStat);
      }
      dailyStat.views++;
      dailyStat.uniqueViews++;
    }

    this.analytics.set(articleId, analytics);
    this.save();
  }

  // Track scroll depth
  trackScrollDepth(articleId: string, depth: number): void {
    this.init();

    let analytics = this.analytics.get(articleId);
    if (!analytics) {
      analytics = this.createEmptyAnalytics(articleId);
    }

    // Track milestones
    if (depth >= 25) analytics.scrollDepth[25]++;
    if (depth >= 50) analytics.scrollDepth[50]++;
    if (depth >= 75) analytics.scrollDepth[75]++;
    if (depth >= 100) analytics.scrollDepth[100]++;

    this.analytics.set(articleId, analytics);
    this.save();
  }

  // Track read complete
  trackReadComplete(articleId: string, timeSpent: number): void {
    this.init();

    let analytics = this.analytics.get(articleId);
    if (!analytics) {
      analytics = this.createEmptyAnalytics(articleId);
    }

    analytics.readComplete++;
    
    // Update average read time
    const totalTime = analytics.avgReadTime * (analytics.readComplete - 1) + timeSpent;
    analytics.avgReadTime = Math.round(totalTime / analytics.readComplete);

    // Update daily stats
    const today = new Date().toISOString().split('T')[0];
    let dailyStat = analytics.dailyStats.find(d => d.date === today);
    if (!dailyStat) {
      dailyStat = { date: today, views: 0, uniqueViews: 0, readComplete: 0 };
      analytics.dailyStats.push(dailyStat);
    }
    dailyStat.readComplete++;

    // Record event
    this.events.push({
      articleId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      scrollDepth: 100,
      timeSpent,
      isComplete: true
    });

    this.analytics.set(articleId, analytics);
    this.save();
  }

  // Track share
  trackShare(articleId: string): void {
    this.init();

    let analytics = this.analytics.get(articleId);
    if (!analytics) {
      analytics = this.createEmptyAnalytics(articleId);
    }

    analytics.shares++;
    this.analytics.set(articleId, analytics);
    this.save();
  }

  // Get analytics for an article
  getArticleAnalytics(articleId: string): ArticleAnalytics | null {
    this.init();
    return this.analytics.get(articleId) || null;
  }

  // Get all analytics
  getAllAnalytics(): ArticleAnalytics[] {
    this.init();
    return Array.from(this.analytics.values());
  }

  // Get total stats
  getTotalStats(): {
    totalViews: number;
    totalUniqueViews: number;
    totalReadComplete: number;
    avgReadTime: number;
    totalShares: number;
  } {
    this.init();

    let totalViews = 0;
    let totalUniqueViews = 0;
    let totalReadComplete = 0;
    let totalShares = 0;
    let totalReadTime = 0;
    let articlesWithReadTime = 0;

    this.analytics.forEach(a => {
      totalViews += a.views;
      totalUniqueViews += a.uniqueViews;
      totalReadComplete += a.readComplete;
      totalShares += a.shares;
      if (a.avgReadTime > 0) {
        totalReadTime += a.avgReadTime;
        articlesWithReadTime++;
      }
    });

    return {
      totalViews,
      totalUniqueViews,
      totalReadComplete,
      avgReadTime: articlesWithReadTime > 0 ? Math.round(totalReadTime / articlesWithReadTime) : 0,
      totalShares
    };
  }

  // Get daily stats for last N days
  getDailyStats(days = 30): { date: string; views: number; uniqueViews: number; readComplete: number }[] {
    this.init();

    const stats: Map<string, { views: number; uniqueViews: number; readComplete: number }> = new Map();

    // Generate last N days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      stats.set(dateStr, { views: 0, uniqueViews: 0, readComplete: 0 });
    }

    // Aggregate from all articles
    this.analytics.forEach(a => {
      a.dailyStats.forEach(d => {
        if (stats.has(d.date)) {
          const stat = stats.get(d.date)!;
          stat.views += d.views;
          stat.uniqueViews += d.uniqueViews;
          stat.readComplete += d.readComplete;
        }
      });
    });

    // Convert to array and sort by date
    return Array.from(stats.entries())
      .map(([date, stat]) => ({ date, ...stat }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Calculate read rate (% of viewers who completed reading)
  getReadRate(articleId: string): number {
    const analytics = this.analytics.get(articleId);
    if (!analytics || analytics.uniqueViews === 0) return 0;
    return Math.round((analytics.readComplete / analytics.uniqueViews) * 100);
  }

  private createEmptyAnalytics(articleId: string): ArticleAnalytics {
    return {
      articleId,
      views: 0,
      uniqueViews: 0,
      readComplete: 0,
      avgReadTime: 0,
      scrollDepth: { 25: 0, 50: 0, 75: 0, 100: 0 },
      shares: 0,
      dailyStats: []
    };
  }

  // Clear analytics (for testing)
  clearAll(): void {
    this.analytics.clear();
    this.events = [];
    this.save();
  }
}

export const analyticsStore = new AnalyticsStore();
export default analyticsStore;
