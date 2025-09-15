import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { CacheManager } from './cacheManager.js';
import { TfidfSearchEngine } from '../search/tfidfSearchEngine.js';
import { WebDocumentDataManager } from '../search/webDocumentDataManager.js';
import { ToolManager } from '../tools/toolManager.js';
import type { ServerConfig } from '../types';

/**
 * @class 성능 최적화된 SOLAPI MCP 서버
 */
export class SolapiMcpServer {
  private server: Server;
  private readonly searchEngine: TfidfSearchEngine;
  private readonly cache: CacheManager;
  private toolManager: ToolManager;
  private isInitialized: boolean = false;

  constructor() {
    this.server = new Server(
      {
        name: 'solapi-mcp-server',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.searchEngine = new TfidfSearchEngine();
    this.cache = new CacheManager();
    this.toolManager = new ToolManager(this.searchEngine, this.cache);

    this.setupRequestHandlers();
  }

  /**
   * 요청 핸들러 설정
   */
  private setupRequestHandlers(): void {
    // 도구 목록 반환
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.toolManager.getToolDefinitions()
      };
    });

    // 도구 실행
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args = {} } = request.params;
      await this.initialize();
      const result = await this.toolManager.executeTool(name, args);
      return result as any;
    });
  }

  /**
   * 서비스 초기화를 수행하는 지연 로딩 메서드
   */
  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const startTime = Date.now();
    console.error('🚀 Initializing optimized search engine...');

    const documents = WebDocumentDataManager.getDocuments();

    // 문서 검증
    if (!WebDocumentDataManager.validateDocuments(documents)) {
      throw new Error('Invalid document data structure');
    }

    this.searchEngine.addDocuments(documents);

    const initTime = Date.now() - startTime;
    console.error(`Search engine initialized in ${initTime}ms with ${documents.length} documents`);

    this.isInitialized = true;
  }

  /**
   * MCP 서버 시작
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('🚀 SOLAPI MCP server started');
  }
}
