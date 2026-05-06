import type { ExampleFetcher } from '../core/exampleFetcher.js';
import type { ManifestStore } from '../core/manifestLoader.js';
import type {
  ICacheManager,
  ISearchEngine,
  Tool,
  ToolDefinition,
} from '../types/index.js';
import { GetExampleTool } from './getExampleTool.js';
import { ListExamplesTool } from './listExamplesTool.js';
import { OverviewTool } from './overviewTool.js';
import { WebSearchTool } from './webSearchTool.js';

export interface ToolManagerDeps {
  cache: ICacheManager;
  searchEngine: ISearchEngine;
  manifest: ManifestStore;
  fetcher: ExampleFetcher;
}

export class ToolManager {
  private tools: Map<string, Tool>;

  constructor(deps: ToolManagerDeps) {
    const overview = new OverviewTool(deps.cache, deps.manifest);
    const list = new ListExamplesTool(deps.manifest);
    const get = new GetExampleTool(deps.manifest, deps.fetcher);
    const web = new WebSearchTool(deps.searchEngine, deps.cache);

    this.tools = new Map([
      [list.getDefinition().name, list as Tool],
      [get.getDefinition().name, get as Tool],
      [overview.getDefinition().name, overview as Tool],
      [web.getDefinition().name, web as Tool],
    ]);
  }

  getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.getDefinition());
  }

  async executeTool(name: string, args: Record<string, unknown>) {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Unknown tool: ${name}`);
    return tool.execute(args);
  }
}
