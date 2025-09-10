import { SearchTool } from './searchTool.js';
import { OverviewTool } from './overviewTool.js';
import { exampleSearchTool, handleExampleSearch, exampleDetailTool, handleExampleDetail } from './exampleSearchTool.js';
import { performanceTool, handlePerformanceTest, memoryAnalysisTool, handleMemoryAnalysis } from './performanceTool.js';
import type { ISearchEngine, ICacheManager, ToolDefinition, ToolExecutor } from '../types';

/**
 * 도구 관리자
 */
export class ToolManager {
  private tools: Map<string, { getDefinition: () => ToolDefinition; execute: ToolExecutor }>;

  constructor(searchEngine: ISearchEngine, cache: ICacheManager) {
    this.tools = new Map();
    this.initializeTools(searchEngine, cache);
  }

  /**
   * 도구들 초기화
   */
  private initializeTools(searchEngine: ISearchEngine, cache: ICacheManager): void {
    const overviewTool = new OverviewTool(cache);

    // 내부 검색 도구들 (기본 우선순위)
    this.tools.set('search-solapi-local', {
      getDefinition: () => ({
        name: 'search-solapi-local',
        description: 'SOLAPI 내부 문서에서 빠른 검색을 수행합니다 (기본 검색 도구)',
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
      }),
      execute: async (args) => {
        const searchTool = new SearchTool(searchEngine, cache);
        return await searchTool.execute(args);
      }
    });
    
    this.tools.set('get-solapi-overview', overviewTool);
    
    // 예제 코드 검색 도구들 추가
    this.tools.set('search-solapi-examples', {
      getDefinition: () => exampleSearchTool,
      execute: handleExampleSearch
    });
    
    // 웹 검색 도구 (명시적 요청 시에만 사용)
    this.tools.set('search-solapi-web', {
      getDefinition: () => ({
        name: 'search-solapi-web',
        description: 'SOLAPI 웹 문서에서 실시간 검색을 수행합니다 (웹에서 직접 검색)',
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
      }),
      execute: async (args) => {
        const searchTool = new SearchTool(searchEngine, cache);
        return await searchTool.execute(args);
      }
    });
    
    this.tools.set('get-solapi-example-detail', {
      getDefinition: () => exampleDetailTool,
      execute: handleExampleDetail
    });
    
    // 성능 테스트 도구들 추가
    this.tools.set('benchmark-solapi-search', {
      getDefinition: () => performanceTool,
      execute: handlePerformanceTest
    });
    
    this.tools.set('analyze-memory-usage', {
      getDefinition: () => memoryAnalysisTool,
      execute: handleMemoryAnalysis
    });
  }

  /**
   * 모든 도구 정의 반환
   */
  getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map(tool => tool.getDefinition());
  }

  /**
   * 도구 실행
   * @param name - 도구 이름
   * @param args - 도구 인수
   * @returns 실행 결과
   */
  async executeTool(name: string, args: Record<string, unknown>) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }
    return await tool.execute(args);
  }
}
