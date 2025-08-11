import { SearchResultFormatter } from '../search/formatter.js';

export class SearchTool {
  constructor(searchEngine, cache) {
    this.searchEngine = searchEngine;
    this.cache = cache;
  }

  /**
   * 도구 정의 반환
   */
  getDefinition() {
    return {
      name: 'search-solapi-docs',
      description: 'SOLAPI 개발자 문서에서 고급 검색을 수행합니다 (TF-IDF, 가중치 적용)',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '검색할 키워드 (예: SMS, 알림톡, API 키)',
          },
          limit: {
            type: 'number',
            description: '검색 결과 개수 제한 (기본값: 5, 최대: 10)',
            minimum: 1,
            maximum: 10,
            default: 5
          }
        },
        required: ['query'],
      },
    };
  }

  /**
   * 검색 실행
   * @param {Object} args - 도구 인수
   * @returns {Promise<Object>} 검색 결과
   */
  async execute(args) {
    const { query, limit = 5 } = args;

    try {
      if (!query?.trim()) {
        return {
          content: [{
            type: 'text',
            text: '검색어를 입력해주세요.'
          }]
        };
      }

      const cacheKey = `search:${query}:${limit}`;
      let results = this.cache.get(cacheKey);

      if (!results) {
        const searchStart = Date.now();
        results = this.searchEngine.search(query, limit);
        const searchTime = Date.now() - searchStart;

        console.error(`🔍 Search completed in ${searchTime}ms for "${query}"`);
        this.cache.set(cacheKey, results);
      }

      if (results.length === 0) {
        return {
          content: [{
            type: 'text',
            text: SearchResultFormatter.formatEmptyResult(query)
          }]
        };
      }

      const resultText = SearchResultFormatter.formatResults(query, results);

      return {
        content: [{
          type: 'text',
          text: resultText
        }]
      };

    } catch (error) {
      console.error('Search error:', error);
      return {
        content: [{
          type: 'text',
          text: `검색 중 오류가 발생했습니다: ${error.message}`
        }]
      };
    }
  }
}
