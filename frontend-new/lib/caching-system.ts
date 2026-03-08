/**
 * Caching System
 *
 * Multi-layer caching for performance optimization
 */

export interface CacheEntry {
  key: string;
  value: any;
  ttl: number; // seconds
  createdAt: Date;
  expiresAt: Date;
  hits: number;
  size: number; // bytes
}

export interface CacheLayer {
  name: string;
  type: 'memory' | 'redis' | 'cdn';
  maxSize: number;
  currentSize: number;
  hitRate: number;
}

export class CachingSystem {
  private cache: Map<string, CacheEntry> = new Map();
  private layers: Map<string, CacheLayer> = new Map();
  private hits: number = 0;
  private misses: number = 0;

  constructor() {
    this.initializeLayers();
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const entry: CacheEntry = {
      key,
      value,
      ttl,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + ttl * 1000),
      hits: 0,
      size: JSON.stringify(value).length,
    };

    this.cache.set(key, entry);

    // Auto-cleanup expired entries
    setTimeout(() => this.delete(key), ttl * 1000);
  }

  async get(key: string): Promise<any | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      this.misses++;
      return null;
    }

    if (entry.expiresAt < new Date()) {
      this.delete(key);
      this.misses++;
      return null;
    }

    entry.hits++;
    this.hits++;
    this.cache.set(key, entry);

    return entry.value;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async invalidatePattern(pattern: string): Promise<number> {
    const regex = new RegExp(pattern);
    let count = 0;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  async getStats(): Promise<{
    totalEntries: number;
    totalSize: number;
    hitRate: number;
    missRate: number;
    topKeys: { key: string; hits: number }[];
  }> {
    const entries = Array.from(this.cache.values());
    const totalSize = entries.reduce((sum, e) => sum + e.size, 0);
    const totalRequests = this.hits + this.misses;
    const hitRate = totalRequests > 0 ? (this.hits / totalRequests) * 100 : 0;
    const missRate = totalRequests > 0 ? (this.misses / totalRequests) * 100 : 0;

    const topKeys = entries
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 10)
      .map((e) => ({ key: e.key, hits: e.hits }));

    return {
      totalEntries: entries.length,
      totalSize,
      hitRate: Math.round(hitRate * 100) / 100,
      missRate: Math.round(missRate * 100) / 100,
      topKeys,
    };
  }

  private initializeLayers(): void {
    this.layers.set('memory', {
      name: 'Memory',
      type: 'memory',
      maxSize: 100 * 1024 * 1024, // 100MB
      currentSize: 0,
      hitRate: 0,
    });

    this.layers.set('redis', {
      name: 'Redis',
      type: 'redis',
      maxSize: 1024 * 1024 * 1024, // 1GB
      currentSize: 0,
      hitRate: 0,
    });

    this.layers.set('cdn', {
      name: 'CDN',
      type: 'cdn',
      maxSize: 10 * 1024 * 1024 * 1024, // 10GB
      currentSize: 0,
      hitRate: 0,
    });
  }
}

export const cachingSystem = new CachingSystem();
