/**
 * @file 가중치 기반 검색 엔진
 * @description 검색 결과의 관련도를 점수로 계산하여 정확한 순서로 정렬합니다.
 */
import type { Example } from '../types';

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

    // 쿼리를 단어별로 분리하여 각각 매칭 점수 계산
    const queryWords = q.split(/\s+/).filter(word => word.length > 0);
    
    // 전체 쿼리 매치 (가장 높은 가중치)
    const fullQueryScore = this.calculateFieldScore(example, q, {
      title: 20,
      keywords: 15,
      description: 10,
      category: 8,
      usage: 6,
      code: 3,
      id: 2
    });
    score += fullQueryScore.score;
    matchedFields.push(...fullQueryScore.fields);

    // 개별 단어 매치 (중간 가중치)
    queryWords.forEach(word => {
      const wordScore = this.calculateFieldScore(example, word, {
        title: 10,
        keywords: 8,
        description: 5,
        category: 4,
        usage: 3,
        code: 2,
        id: 1
      });
      score += wordScore.score;
      matchedFields.push(...wordScore.fields);
    });

    // 정확한 매치 보너스 (추가 점수)
    if (example.title.toLowerCase() === q) {
      score += 10; // 제목이 정확히 일치하면 보너스
    }

    // 키워드 정확 매치 보너스
    if (example.keywords.some(keyword => keyword.toLowerCase() === q)) {
      score += 5; // 키워드가 정확히 일치하면 보너스
    }

    // 중복 필드 제거
    const uniqueMatchedFields = [...new Set(matchedFields)];

    return {
      example,
      score,
      matchedFields: uniqueMatchedFields
    };
  }

  /**
   * 특정 필드들에 대해 점수를 계산합니다.
   */
  private static calculateFieldScore(
    example: Example, 
    searchTerm: string, 
    weights: { title: number; keywords: number; description: number; category: number; usage: number; code: number; id: number }
  ): { score: number; fields: string[] } {
    let score = 0;
    const fields: string[] = [];

    // 제목 매치
    if (example.title.toLowerCase().includes(searchTerm)) {
      score += weights.title;
      fields.push('title');
    }

    // 키워드 매치
    const keywordMatches = example.keywords.filter(keyword => 
      keyword.toLowerCase().includes(searchTerm)
    );
    if (keywordMatches.length > 0) {
      score += weights.keywords * keywordMatches.length;
      fields.push('keywords');
    }

    // 설명 매치
    if (example.description.toLowerCase().includes(searchTerm)) {
      score += weights.description;
      fields.push('description');
    }

    // 카테고리 매치
    if (example.category.toLowerCase().includes(searchTerm)) {
      score += weights.category;
      fields.push('category');
    }

    // 사용법 매치
    if (example.usage.toLowerCase().includes(searchTerm)) {
      score += weights.usage;
      fields.push('usage');
    }

    // 코드 매치
    if (example.code.toLowerCase().includes(searchTerm)) {
      score += weights.code;
      fields.push('code');
    }

    // ID 매치
    if (example.id.toLowerCase().includes(searchTerm)) {
      score += weights.id;
      fields.push('id');
    }

    return { score, fields };
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
