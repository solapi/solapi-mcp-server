/**
 * @file 예제 데이터 캐시 관리자
 * @description 예제 데이터를 메모리에 캐시하여 성능을 향상시킵니다.
 */
import type { Example } from '../types/index.js';

export class ExampleCache {
  private static instance: ExampleCache;
  private cache: Map<string, Example[]> = new Map();
  private searchCache: Map<string, Example[]> = new Map();
  private categoryCache: Map<string, Example[]> = new Map();

  private constructor() {}

  static getInstance(): ExampleCache {
    if (!ExampleCache.instance) {
      ExampleCache.instance = new ExampleCache();
    }
    return ExampleCache.instance;
  }

  /**
   * 라이브러리별 예제 데이터를 캐시에 저장
   */
  setLibraryCache(libraryName: string, examples: Example[]): void {
    this.cache.set(libraryName, examples);
  }

  /**
   * 캐시된 라이브러리 예제 데이터 반환
   */
  getLibraryCache(libraryName: string): Example[] | undefined {
    return this.cache.get(libraryName);
  }

  /**
   * 검색 결과 캐시 저장
   */
  setSearchCache(query: string, results: Example[]): void {
    const cacheKey = query.toLowerCase().trim();
    this.searchCache.set(cacheKey, results);
  }

  /**
   * 검색 결과 캐시 반환
   */
  getSearchCache(query: string): Example[] | undefined {
    const cacheKey = query.toLowerCase().trim();
    return this.searchCache.get(cacheKey);
  }

  /**
   * 카테고리별 예제 캐시 저장
   */
  setCategoryCache(category: string, examples: Example[]): void {
    this.categoryCache.set(category.toLowerCase(), examples);
  }

  /**
   * 카테고리별 예제 캐시 반환
   */
  getCategoryCache(category: string): Example[] | undefined {
    return this.categoryCache.get(category.toLowerCase());
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
   * 캐시 통계 정보 반환
   */
  getCacheStats(): { libraryCount: number; searchCount: number; categoryCount: number } {
    return {
      libraryCount: this.cache.size,
      searchCount: this.searchCache.size,
      categoryCount: this.categoryCache.size
    };
  }
}
