/**
 * Hook for tracking article reading engagement
 */

import { useEffect, useRef, useCallback } from 'react';
import { analyticsStore } from './analyticsStore';

interface UseArticleTrackingOptions {
  articleId: string;
  enabled?: boolean;
}

export function useArticleTracking({ articleId, enabled = true }: UseArticleTrackingOptions) {
  const startTimeRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);
  const hasTrackedViewRef = useRef(false);
  const hasTrackedCompleteRef = useRef(false);
  const scrollDepthMilestonesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!enabled || !articleId) return;

    // Track view on mount
    if (!hasTrackedViewRef.current) {
      analyticsStore.trackView(articleId);
      hasTrackedViewRef.current = true;
      startTimeRef.current = Date.now();
    }

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));

      if (scrollPercent > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = scrollPercent;

        // Track milestones (only once per milestone)
        const milestones = [25, 50, 75, 100];
        for (const milestone of milestones) {
          if (scrollPercent >= milestone && !scrollDepthMilestonesRef.current.has(milestone)) {
            scrollDepthMilestonesRef.current.add(milestone);
            analyticsStore.trackScrollDepth(articleId, milestone);
          }
        }

        // Track complete read (reached bottom)
        if (scrollPercent >= 90 && !hasTrackedCompleteRef.current) {
          hasTrackedCompleteRef.current = true;
          const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
          analyticsStore.trackReadComplete(articleId, timeSpent);
        }
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [articleId, enabled]);

  // Track share
  const trackShare = useCallback(() => {
    if (enabled && articleId) {
      analyticsStore.trackShare(articleId);
    }
  }, [articleId, enabled]);

  // Get current reading stats
  const getReadingStats = useCallback(() => {
    return {
      timeSpent: startTimeRef.current ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0,
      scrollDepth: maxScrollDepthRef.current,
      isComplete: hasTrackedCompleteRef.current
    };
  }, []);

  return {
    trackShare,
    getReadingStats
  };
}

export default useArticleTracking;
