import { SearchResultFormatter } from '../search/formatter.js';
import type { ISearchEngine, ICacheManager, Tool, ToolResult, SearchArgs } from '../types/index.js';

export class WebSearchTool implements Tool {
  private searchEngine: ISearchEngine;
  private cache: ICacheManager;

  constructor(searchEngine: ISearchEngine, cache: ICacheManager) {
    this.searchEngine = searchEngine;
    this.cache = cache;
  }

  /**
   * 도구 정의 반환
   */
  getDefinition() {
    return {
      name: 'search-solapi-web',
      description: '사용자가 명시적으로 웹 검색이나 최신 정보를 요청했을 때만 사용하세요. SOLAPI 웹사이트에서 실시간 정보를 검색합니다. 로컬 검색으로 충분하지 않거나 사용자가 웹에서 검색해달라고 명시적으로 요청한 경우에만 사용하세요.',
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
   * @param args - 도구 인수
   * @returns 검색 결과
   */
  async execute(args: Record<string, unknown>): Promise<ToolResult> {
    const { query, limit = 5 } = args as unknown as SearchArgs;

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
      let results = this.cache.get(cacheKey) as any[];

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
          text: `검색 중 오류가 발생했습니다: ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }
}
