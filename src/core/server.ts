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
import { ensureInstalled, isInstalled, SOLACTL_VERSION, upgradeSolactl } from '../installers/solactlInstaller.js';

function parseAutoUpgrade(raw: string | undefined): boolean {
  if (!raw) return false;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
}

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

    if (!isInstalled()) {
      try {
        await ensureInstalled();
      } catch (err) {
        console.error(
          `⚠️  solactl ${SOLACTL_VERSION} 자동 설치 실패: ${(err as Error).message}. ` +
            `발송/조회 도구 호출 시 다시 시도합니다.`,
        );
      }
    }

    if (parseAutoUpgrade(process.env.SOLAPI_MCP_AUTO_UPGRADE)) {
      try {
        const result = await upgradeSolactl({ logger: (msg) => console.error(msg) });
        if (result.changed) {
          console.error(`⬆️  solactl ${result.fromVersion ?? '(미설치)'} → ${result.toVersion}로 업그레이드되었습니다.`);
        }
      } catch (err) {
        console.error(
          `⚠️  solactl 자동 업그레이드 실패: ${(err as Error).message}. ` +
            `현재 설치된 버전을 그대로 사용합니다.`,
        );
      }
    }

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
