/**
 * @file 가중치 기반 검색 엔진
 * @description 검색 결과의 관련도를 점수로 계산하여 정확한 순서로 정렬합니다.
 */
import type { Example } from '../types/index.js';

export interface SearchScore {
  example: Example;
  score: number;
  matchedFields: string[];
}

export class WeightedSearchEngine {
  /**
   * 검색 쿼리에 대한 예제의 관련도 점수를 계산합니다.
   */
  static calculateScore(example: Example, query: string): SearchScore {
    const q = query.toLowerCase().trim();
    let score = 0;
    const matchedFields: string[] = [];

    // 제목 매치 (가장 높은 가중치: 20점)
    if (example.title.toLowerCase().includes(q)) {
      score += 20;
      matchedFields.push('title');
    }

    // 키워드 매치 (높은 가중치: 15점)
    const keywordMatches = example.keywords.filter(keyword => 
      keyword.toLowerCase().includes(q)
    );
    if (keywordMatches.length > 0) {
      score += 15 * keywordMatches.length; // 매치된 키워드 수만큼 가중치 적용
      matchedFields.push('keywords');
    }

    // 설명 매치 (중간 가중치: 10점)
    if (example.description.toLowerCase().includes(q)) {
      score += 10;
      matchedFields.push('description');
    }

    // 카테고리 매치 (중간 가중치: 8점)
    if (example.category.toLowerCase().includes(q)) {
      score += 8;
      matchedFields.push('category');
    }

    // 사용법 매치 (중간 가중치: 6점)
    if (example.usage.toLowerCase().includes(q)) {
      score += 6;
      matchedFields.push('usage');
    }

    // 코드 매치 (낮은 가중치: 3점)
    if (example.code.toLowerCase().includes(q)) {
      score += 3;
      matchedFields.push('code');
    }

    // ID 매치 (낮은 가중치: 2점)
    if (example.id.toLowerCase().includes(q)) {
      score += 2;
      matchedFields.push('id');
    }

    // 정확한 매치 보너스 (추가 점수)
    if (example.title.toLowerCase() === q) {
      score += 10; // 제목이 정확히 일치하면 보너스
    }

    // 키워드 정확 매치 보너스
    if (example.keywords.some(keyword => keyword.toLowerCase() === q)) {
      score += 5; // 키워드가 정확히 일치하면 보너스
    }

    return {
      example,
      score,
      matchedFields
    };
  }

  /**
   * 여러 예제들을 점수순으로 정렬합니다.
   */
  static sortByScore(examples: Example[], query: string): SearchScore[] {
    return examples
      .map(example => this.calculateScore(example, query))
      .sort((a, b) => b.score - a.score);
  }

  /**
   * 점수가 0보다 큰 결과만 필터링합니다.
   */
  static filterRelevantResults(scoredResults: SearchScore[]): SearchScore[] {
    return scoredResults.filter(result => result.score > 0);
  }

  /**
   * 검색 결과를 제한된 개수만큼 반환합니다.
   */
  static limitResults(scoredResults: SearchScore[], limit: number): SearchScore[] {
    return scoredResults.slice(0, limit);
  }

  /**
   * 언어별 필터링과 함께 점수 계산을 수행합니다.
   */
  static searchWithLanguageFilter(
    examples: Example[], 
    query: string, 
    languageFilter?: (example: Example) => boolean
  ): SearchScore[] {
    let filteredExamples = examples;
    
    if (languageFilter) {
      filteredExamples = examples.filter(languageFilter);
    }

    return this.sortByScore(filteredExamples, query);
  }

  /**
   * 카테고리별 필터링과 함께 점수 계산을 수행합니다.
   */
  static searchWithCategoryFilter(
    examples: Example[], 
    query: string, 
    category?: string
  ): SearchScore[] {
    let filteredExamples = examples;
    
    if (category) {
      filteredExamples = examples.filter(example => 
        example.category.toLowerCase() === category.toLowerCase()
      );
    }

    return this.sortByScore(filteredExamples, query);
  }
}
