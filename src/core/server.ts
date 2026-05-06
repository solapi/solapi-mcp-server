import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { CacheManager } from './cacheManager.js';
import { ExampleFetcher } from './exampleFetcher.js';
import { ManifestStore } from './manifestLoader.js';
import { TfidfSearchEngine } from '../search/tfidfSearchEngine.js';
import { WebDocumentDataManager } from '../search/webDocumentDataManager.js';
import { ToolManager } from '../tools/toolManager.js';

export class SolapiMcpServer {
  private server: Server;
  private readonly cache: CacheManager;
  private readonly searchEngine: TfidfSearchEngine;
  private readonly manifest: ManifestStore;
  private readonly fetcher: ExampleFetcher;
  private toolManager: ToolManager;
  private isInitialized = false;

  constructor() {
    this.server = new Server(
      { name: 'solapi-mcp-server', version: '2.0.0' },
      { capabilities: { tools: {} } },
    );

    this.cache = new CacheManager();
    this.searchEngine = new TfidfSearchEngine();
    this.manifest = new ManifestStore();
    this.fetcher = new ExampleFetcher(this.cache);
    this.toolManager = new ToolManager({
      cache: this.cache,
      searchEngine: this.searchEngine,
      manifest: this.manifest,
      fetcher: this.fetcher,
    });

    this.setupRequestHandlers();
  }

  private setupRequestHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.toolManager.getToolDefinitions(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args = {} } = request.params;
      await this.initialize();
      const result = await this.toolManager.executeTool(name, args);
      return result as never;
    });
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;
    const start = Date.now();

    this.manifest.load();
    const documents = WebDocumentDataManager.getDocuments();
    if (!WebDocumentDataManager.validateDocuments(documents)) {
      throw new Error('Invalid web document data');
    }
    this.searchEngine.addDocuments(documents);

    const ms = Date.now() - start;
    console.error(
      `🚀 Initialized: ${this.manifest.size()} SDK examples + ${documents.length} web docs (${ms}ms)`,
    );
    this.isInitialized = true;
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 SOLAPI MCP server started');
  }
}
