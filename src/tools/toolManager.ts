import { WebSearchTool } from './webSearchTool.js';
import { OverviewTool } from './overviewTool.js';
import { InternalSearchTool, handleLocalSearch, getDetailTool, handleExampleDetail, setWebSearchTool } from './internalSearchTool.js';
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

    // 웹 검색 도구를 로컬 검색 도구에 설정
    setWebSearchTool(searchEngine, cache);

    // 로컬 검색 도구 (최우선 기본 도구)
    this.tools.set('get-internal-doc', {
      getDefinition: () => InternalSearchTool,
      execute: handleLocalSearch
    });

    this.tools.set('get-internal-doc-detail', {
      getDefinition: () => getDetailTool,
      execute: handleExampleDetail
    });
    
    this.tools.set('get-solapi-overview', overviewTool);
    
    
    // 웹 검색 도구
    this.tools.set('get-solapi-doc', {
      getDefinition: () => {
        const webSearchTool = new WebSearchTool(searchEngine, cache);
        return webSearchTool.getDefinition();
      },
      execute: async (args) => {
        const webSearchTool = new WebSearchTool(searchEngine, cache);
        return await webSearchTool.execute(args);
      }
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
