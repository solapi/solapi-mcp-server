/**
 * @class LRU 캐시 관리자
 * @description TTL과 크기 제한을 지원하는 캐시 시스템
 */
export class CacheManager {
  /**
   * @param {number} maxSize - 최대 캐시 크기 (기본값: 100)
   * @param {number} ttl - TTL in milliseconds (기본값: 5분)
   */
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  set(key, value) {
    // LRU 방식으로 캐시 크기 관리
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}