import { SearchTool } from './searchTool.js';
import { OverviewTool } from './overviewTool.js';

/**
 * 도구 관리자
 */
export class ToolManager {
  constructor(searchEngine, cache) {
    this.tools = new Map();
    this.initializeTools(searchEngine, cache);
  }

  /**
   * 도구들 초기화
   */
  initializeTools(searchEngine, cache) {
    const searchTool = new SearchTool(searchEngine, cache);
    const overviewTool = new OverviewTool(cache);

    this.tools.set('search-solapi-docs', searchTool);
    this.tools.set('get-solapi-overview', overviewTool);
  }

  /**
   * 모든 도구 정의 반환
   */
  getToolDefinitions() {
    return Array.from(this.tools.values()).map(tool => tool.getDefinition());
  }

  /**
   * 도구 실행
   * @param {string} name - 도구 이름
   * @param {Object} args - 도구 인수
   * @returns {Promise<Object>} 실행 결과
   */
  async executeTool(name, args) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }
    return await tool.execute(args);
  }
}