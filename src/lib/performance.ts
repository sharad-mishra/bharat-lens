/**
 * Simplified performance utilities
 */

/**
 * Simple search cache
 */
class SearchCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private maxSize = 20;
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry || Date.now() - entry.timestamp > 30 * 60 * 1000) { // 30 min TTL
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  
  set(key: string, data: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  
  getStats() {
    return { size: this.cache.size, maxSize: this.maxSize };
  }
}

export const searchCache = new SearchCache();

/**
 * Simple performance monitoring
 */
export class PerformanceMonitor {
  private metrics = new Map<string, number>();
  
  startTimer(operation: string): () => number {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.metrics.set(operation, duration);
      return duration;
    };
  }
  
  getAllStats(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Simple utility functions
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
}

export function generateCacheKey(query: string): string {
  return `search:${query.toLowerCase().trim()}`;
}

export function shouldCacheQuery(query: string): boolean {
  const trimmed = query.trim();
  return trimmed.length >= 3 && trimmed.length <= 100;
}