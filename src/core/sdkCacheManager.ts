/**
 * @file 예제 데이터 캐시 관리자
 * @description 예제 데이터를 메모리에 캐시하여 성능을 향상시킵니다.
 * LRU와 TTL 전략을 적용한 효율적인 캐시 시스템입니다.
 */
import type { Example } from '../types';

interface CacheItem {
  data: Example[];
  timestamp: number;
}

export class SdkCacheManager {
  private static instance: SdkCacheManager;
  
  // 캐시 설정
  private readonly maxLibraryCacheSize: number = 50;  // 라이브러리 캐시 최대 크기
  private readonly maxSearchCacheSize: number = 200;   // 검색 캐시 최대 크기
  private readonly maxCategoryCacheSize: number = 30;  // 카테고리 캐시 최대 크기
  private readonly searchCacheTTL: number = 10 * 60 * 1000; // 검색 캐시 TTL (10분)
  
  // 캐시 저장소 (CacheItem 구조 사용)
  private cache: Map<string, CacheItem> = new Map();
  private searchCache: Map<string, CacheItem> = new Map();
  private categoryCache: Map<string, CacheItem> = new Map();

  private constructor() {}

  static getInstance(): SdkCacheManager {
    if (!SdkCacheManager.instance) {
      SdkCacheManager.instance = new SdkCacheManager();
    }
    return SdkCacheManager.instance;
  }

  /**
   * 캐시 항목이 만료되었는지 확인
   */
  private isExpired(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp > ttl;
  }

  /**
   * LRU 방식으로 캐시 크기 관리 (가장 오래된 항목 제거)
   */
  private enforceLRULimit(cache: Map<string, CacheItem>, maxSize: number): void {
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey) {
        cache.delete(firstKey);
      }
    }
  }

  /**
   * 검색 캐시에서 만료된 항목들 정리
   */
  private cleanupExpiredSearchCache(): void {
    for (const [key, item] of this.searchCache.entries()) {
      if (this.isExpired(item.timestamp, this.searchCacheTTL)) {
        this.searchCache.delete(key);
      }
    }
  }

  /**
   * 라이브러리별 예제 데이터를 캐시에 저장 (LRU 전략 적용)
   */
  setLibraryCache(libraryName: string, examples: Example[]): void {
    // LRU 크기 제한 적용
    this.enforceLRULimit(this.cache, this.maxLibraryCacheSize);
    
    this.cache.set(libraryName, {
      data: examples,
      timestamp: Date.now()
    });
  }

  /**
   * 캐시된 라이브러리 예제 데이터 반환
   */
  getLibraryCache(libraryName: string): Example[] | undefined {
    const item = this.cache.get(libraryName);
    if (!item) return undefined;
    
    // LRU를 위해 항목을 다시 삽입 (최근 사용으로 표시)
    this.cache.delete(libraryName);
    this.cache.set(libraryName, item);
    
    return item.data;
  }

  /**
   * 검색 결과 캐시 저장 (TTL 전략 적용)
   */
  setSearchCache(query: string, results: Example[]): void {
    const cacheKey = query.toLowerCase().trim();
    
    // 만료된 항목들 정리
    this.cleanupExpiredSearchCache();
    
    // LRU 크기 제한 적용
    this.enforceLRULimit(this.searchCache, this.maxSearchCacheSize);
    
    this.searchCache.set(cacheKey, {
      data: results,
      timestamp: Date.now()
    });
  }

  /**
   * 검색 결과 캐시 반환 (TTL 체크)
   */
  getSearchCache(query: string): Example[] | undefined {
    const cacheKey = query.toLowerCase().trim();
    const item = this.searchCache.get(cacheKey);
    
    if (!item) return undefined;
    
    // TTL 체크
    if (this.isExpired(item.timestamp, this.searchCacheTTL)) {
      this.searchCache.delete(cacheKey);
      return undefined;
    }
    
    // LRU를 위해 항목을 다시 삽입
    this.searchCache.delete(cacheKey);
    this.searchCache.set(cacheKey, item);
    
    return item.data;
  }

  /**
   * 카테고리별 예제 캐시 저장 (LRU 전략 적용)
   */
  setCategoryCache(category: string, examples: Example[]): void {
    const categoryKey = category.toLowerCase();
    
    // LRU 크기 제한 적용
    this.enforceLRULimit(this.categoryCache, this.maxCategoryCacheSize);
    
    this.categoryCache.set(categoryKey, {
      data: examples,
      timestamp: Date.now()
    });
  }

  /**
   * 카테고리별 예제 캐시 반환
   */
  getCategoryCache(category: string): Example[] | undefined {
    const categoryKey = category.toLowerCase();
    const item = this.categoryCache.get(categoryKey);
    
    if (!item) return undefined;
    
    // LRU를 위해 항목을 다시 삽입
    this.categoryCache.delete(categoryKey);
    this.categoryCache.set(categoryKey, item);
    
    return item.data;
  }

  /**
   * 모든 캐시 초기화
   */
  clearAll(): void {
    this.cache.clear();
    this.searchCache.clear();
    this.categoryCache.clear();
  }

  /**
   * 특정 라이브러리 캐시만 초기화
   */
  clearLibraryCache(libraryName: string): void {
    this.cache.delete(libraryName);
  }

  /**
   * 캐시 통계 정보 반환 (만료된 항목 제외)
   */
  getCacheStats(): { 
    libraryCount: number; 
    searchCount: number; 
    categoryCount: number;
    totalMemoryUsage: number;
  } {
    // 검색 캐시에서 만료된 항목들 정리
    this.cleanupExpiredSearchCache();
    
    return {
      libraryCount: this.cache.size,
      searchCount: this.searchCache.size,
      categoryCount: this.categoryCache.size,
      totalMemoryUsage: this.cache.size + this.searchCache.size + this.categoryCache.size
    };
  }

  /**
   * 캐시 성능 정보 반환
   */
  getCachePerformanceInfo(): {
    maxLibraryCacheSize: number;
    maxSearchCacheSize: number;
    maxCategoryCacheSize: number;
    searchCacheTTL: number;
    libraryCacheUtilization: number;
    searchCacheUtilization: number;
    categoryCacheUtilization: number;
  } {
    return {
      maxLibraryCacheSize: this.maxLibraryCacheSize,
      maxSearchCacheSize: this.maxSearchCacheSize,
      maxCategoryCacheSize: this.maxCategoryCacheSize,
      searchCacheTTL: this.searchCacheTTL,
      libraryCacheUtilization: (this.cache.size / this.maxLibraryCacheSize) * 100,
      searchCacheUtilization: (this.searchCache.size / this.maxSearchCacheSize) * 100,
      categoryCacheUtilization: (this.categoryCache.size / this.maxCategoryCacheSize) * 100
    };
  }
}
