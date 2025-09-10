import type { ICacheManager } from '../types';

interface CacheItem {
  value: unknown;
  timestamp: number;
}

/**
 * @class LRU 캐시 관리자
 * @description TTL과 크기 제한을 지원하는 캐시 시스템
 */
export class CacheManager implements ICacheManager {
  private cache: Map<string, CacheItem>;
  private readonly maxSize: number;
  private readonly ttl: number;

  /**
   * @param maxSize - 최대 캐시 크기 (기본값: 100)
   * @param ttl - TTL in milliseconds (기본값: 5분)
   */
  constructor(maxSize: number = 100, ttl: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key: string, value: unknown, ttl?: number): void {
    // LRU 방식으로 캐시 크기 관리
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
